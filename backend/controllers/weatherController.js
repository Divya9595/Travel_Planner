const WMO_CODES = {
  0: { condition: "Clear Sky", icon: "☀️" },
  1: { condition: "Mainly Clear", icon: "🌤️" },
  2: { condition: "Partly Cloudy", icon: "⛅" },
  3: { condition: "Overcast", icon: "☁️" },
  45: { condition: "Foggy", icon: "🌫️" },
  48: { condition: "Depositing Rime Fog", icon: "🌫️" },
  51: { condition: "Light Drizzle", icon: "🌦️" },
  53: { condition: "Moderate Drizzle", icon: "🌦️" },
  55: { condition: "Dense Drizzle", icon: "🌧️" },
  56: { condition: "Freezing Drizzle", icon: "🌧️" },
  57: { condition: "Dense Freezing Drizzle", icon: "🌧️" },
  61: { condition: "Slight Rain", icon: "🌦️" },
  63: { condition: "Moderate Rain", icon: "🌧️" },
  65: { condition: "Heavy Rain", icon: "🌧️" },
  66: { condition: "Freezing Rain", icon: "🌧️" },
  67: { condition: "Heavy Freezing Rain", icon: "🌧️" },
  71: { condition: "Slight Snow", icon: "🌨️" },
  73: { condition: "Moderate Snow", icon: "🌨️" },
  75: { condition: "Heavy Snow", icon: "❄️" },
  77: { condition: "Snow Grains", icon: "❄️" },
  80: { condition: "Slight Rain Showers", icon: "🌦️" },
  81: { condition: "Moderate Rain Showers", icon: "🌧️" },
  82: { condition: "Violent Rain Showers", icon: "🌧️" },
  85: { condition: "Slight Snow Showers", icon: "🌨️" },
  86: { condition: "Heavy Snow Showers", icon: "❄️" },
  95: { condition: "Thunderstorm", icon: "⛈️" },
  96: { condition: "Thunderstorm with Hail", icon: "⛈️" },
  99: { condition: "Thunderstorm with Heavy Hail", icon: "⛈️" },
};

export const getWeather = async (req, res) => {
  try {
    const { destination } = req.params;
    if (!destination) {
      return res.status(400).json({ error: "Destination is required" });
    }

    // Try progressively simpler versions of the destination name
    const parts = destination.split(",").map((s) => s.trim()).filter(Boolean);
    const attempts = parts.length > 1 ? [parts[0], destination] : [destination];

    let geoData = null;
    for (const attempt of attempts) {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(attempt)}&count=1&language=en`;
      const geoRes = await fetch(geoUrl);
      geoData = await geoRes.json();
      if (geoData.results && geoData.results.length > 0) break;
    }

    if (!geoData || !geoData.results || geoData.results.length === 0) {
      return res.json({ weather: null, location: null });
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: Fetch current weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    if (!weatherData.current) {
      return res.status(500).json({ error: "Failed to fetch weather data" });
    }

    const current = weatherData.current;
    const wmo = WMO_CODES[current.weather_code] || { condition: "Unknown", icon: "🌡️" };

    res.json({
      weather: {
        temp: Math.round(current.temperature_2m),
        condition: wmo.condition,
        humidity: current.relative_humidity_2m,
        wind: Math.round(current.wind_speed_10m),
        icon: wmo.icon,
      },
      location: { name, country, latitude, longitude },
    });
  } catch (error) {
    console.error("Weather fetch error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};
