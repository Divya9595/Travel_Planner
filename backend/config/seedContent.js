import Content from "../models/Content.js";

const defaultSections = {
  "home.popularDestinations": [
    {
      id: "paris",
      name: "Paris, France",
      tagline: "Art, Romance & Fine Dining",
      badge: "Most Popular",
      duration: "5 Days",
      icon: "🗼",
      gradient: "from-amber-500/20 via-rose-500/10 to-transparent",
      highlights: ["Eiffel Tower", "Louvre Museum", "Seine Sunset Cruise"],
    },
    {
      id: "tokyo",
      name: "Tokyo, Japan",
      tagline: "Futuristic Culture & Cuisine",
      badge: "Trending",
      duration: "5 Days",
      icon: "🌸",
      gradient: "from-pink-500/20 via-purple-500/10 to-transparent",
      highlights: ["Shibuya Crossing", "Mount Fuji Day Trip", "Senso-ji Temple"],
    },
    {
      id: "bali",
      name: "Bali, Indonesia",
      tagline: "Tropical Beach & Temple Escape",
      badge: "Best Value",
      duration: "5 Days",
      icon: "🏝️",
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      highlights: ["Ubud Rice Terraces", "Tanah Lot Temple", "Nusa Penida Boat Tour"],
    },
    {
      id: "rome",
      name: "Rome, Italy",
      tagline: "Ancient History & Culinary Delights",
      badge: "Cultural Hub",
      duration: "4 Days",
      icon: "🏛️",
      gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
      highlights: ["Colosseum & Forum", "Vatican City", "Piazza Navona"],
    },
    {
      id: "new-york",
      name: "New York, USA",
      tagline: "Iconic Skyline & Entertainment",
      badge: "City Break",
      duration: "4 Days",
      icon: "🗽",
      gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
      highlights: ["Central Park", "Times Square", "Broadway Shows"],
    },
    {
      id: "kyoto",
      name: "Kyoto, Japan",
      tagline: "Serene Temples & Traditions",
      badge: "Relaxing",
      duration: "4 Days",
      icon: "⛩️",
      gradient: "from-red-500/20 via-rose-500/10 to-transparent",
      highlights: ["Arashiyama Bamboo Grove", "Kinkaku-ji", "Gion District"],
    },
  ],

  "home.aiFeatures": [
    {
      icon: "✨",
      title: "Instant Personalized Itineraries",
      description:
        "Tell us your destination, trip length, and interests. Our AI automatically generates tailored day-by-day activity schedules.",
    },
    {
      icon: "🌤️",
      title: "Smart Weather & Attraction Insights",
      description:
        "Get live weather context, popular landmark suggestions, and curated local recommendations all in one dashboard.",
    },
    {
      icon: "🎒",
      title: "Automated Packing & To-Do Checklists",
      description:
        "Never forget your essentials. AI customizes packing lists and task reminders based on your destination's climate and activities.",
    },
    {
      icon: "💬",
      title: "Interactive AI Travel Assistant",
      description:
        "Have questions on the go? Chat directly with our AI travel widget to adjust plans, get flight info, or discover hidden gems.",
    },
  ],

  "landing.features": [
    {
      icon: "🤖",
      title: "AI Travel Planner",
      description:
        "Chat with our AI to build a personalized itinerary. Just tell it your destination, dates, and preferences — it handles the rest.",
    },
    {
      icon: "📅",
      title: "Day-by-Day Itinerary",
      description:
        "Get a structured daily plan with morning, afternoon, and evening activities, complete with timing and categories.",
    },
    {
      icon: "🌤️",
      title: "Destination Weather",
      description:
        "See real-time weather conditions for your destination so you pack right and plan activities accordingly.",
    },
    {
      icon: "📍",
      title: "Famous Attractions",
      description:
        "Discover top attractions, hidden gems, and must-visit spots curated for every destination.",
    },
    {
      icon: "🎒",
      title: "Smart Packing List",
      description:
        "Auto-generated packing checklist based on your destination — beach? sunscreen & cap. Mountain? warm layers & trekking shoes.",
    },
    {
      icon: "✅",
      title: "Trip Preparation To-Do",
      description:
        "Never miss a step. Track bookings, visa applications, insurance, currency exchange, and more in one checklist.",
    },
    {
      icon: "🔔",
      title: "Reminders & Notifications",
      description:
        "Get reminded about passport expiry, visa requirements, vaccinations, and important deadlines before your trip.",
    },
    {
      icon: "✈️",
      title: "Flight & Train Details",
      description:
        "Store and view your transport schedule — carrier, timing, terminal, seat — all in one place on your dashboard.",
    },
  ],

  "landing.steps": [
    {
      step: "1",
      title: "Search Your Destination",
      description:
        "Enter where you want to go, travel dates, and number of travellers.",
      icon: "🔍",
    },
    {
      step: "2",
      title: "Chat with AI",
      description:
        "Tell our AI your preferences — food, adventure, budget, pace. It asks the right questions.",
      icon: "💬",
    },
    {
      step: "3",
      title: "Get Your Itinerary",
      description:
        "Receive a personalized day-by-day plan with activities, meals, and timing — ready to follow.",
      icon: "🗺️",
    },
  ],

  "landing.destinations": [
    {
      name: "Bali, Indonesia",
      type: "Beach & Culture",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    },
    {
      name: "Paris, France",
      type: "City & Romance",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    },
    {
      name: "Tokyo, Japan",
      type: "Culture & Food",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    },
    {
      name: "Santorini, Greece",
      type: "Island & Relaxation",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    },
  ],

  "ai.greeting": "👋 Hi! I'm your AI travel planner. Tell me where you'd like to go, how many days, and what you enjoy — I'll create a personalized itinerary for you!",

  "home.sampleItineraries": {
    paris: {
      destination: "Paris, France",
      tripDuration: "5 Days",
      travellers: 2,
      days: [
        {
          day: 1,
          title: "Arrival & Iconic Landmarks",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "Arrive at Charles de Gaulle Airport", type: "transport", duration: "1 hr" },
              { name: "Check in to hotel & freshen up", type: "hotel", duration: "1 hr" },
              { name: "Breakfast at Café de Flore", type: "food", duration: "1 hr" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Eiffel Tower visit & photos", type: "sightseeing", duration: "2 hrs" },
              { name: "Lunch at Le Marais district", type: "food", duration: "1 hr" },
              { name: "Walk along Champ de Mars gardens", type: "sightseeing", duration: "1 hr" },
            ]},
            { time: "Evening", icon: "🌙", activities: [
              { name: "Seine River sunset cruise", type: "activity", duration: "1.5 hrs" },
              { name: "Dinner at Le Jules Verne", type: "food", duration: "1.5 hrs" },
            ]},
          ],
        },
        {
          day: 2,
          title: "Art & Culture Day",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "Louvre Museum guided tour", type: "sightseeing", duration: "3 hrs" },
              { name: "Coffee at museum café", type: "food", duration: "30 min" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Tuileries Garden stroll", type: "sightseeing", duration: "1 hr" },
              { name: "Lunch at Angelina Paris", type: "food", duration: "1 hr" },
              { name: "Musée d'Orsay visit", type: "sightseeing", duration: "2 hrs" },
            ]},
            { time: "Evening", icon: "🌙", activities: [
              { name: "Montmartre & Sacré-Cœur", type: "sightseeing", duration: "2 hrs" },
              { name: "Dinner at a Montmartre bistro", type: "food", duration: "1.5 hrs" },
            ]},
          ],
        },
        {
          day: 3,
          title: "Palace of Versailles",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "Train to Versailles", type: "transport", duration: "45 min" },
              { name: "Versailles Palace tour", type: "sightseeing", duration: "2.5 hrs" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Gardens of Versailles walk", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Lunch near palace grounds", type: "food", duration: "1 hr" },
              { name: "Grand Trianon & Marie Antoinette's Estate", type: "sightseeing", duration: "1.5 hrs" },
            ]},
            { time: "Evening", icon: "🌙", activities: [
              { name: "Return to Paris", type: "transport", duration: "45 min" },
              { name: "Dinner in Le Latin quarter", type: "food", duration: "1.5 hrs" },
            ]},
          ],
        },
        {
          day: 4,
          title: "Shopping & Hidden Gems",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "Champs-Élysées morning walk", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Shopping at Galeries Lafayette", type: "activity", duration: "2 hrs" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Lunch at Rue Cler market street", type: "food", duration: "1 hr" },
              { name: "Rodin Museum visit", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Saint-Germain-des-Prés explore", type: "sightseeing", duration: "1.5 hrs" },
            ]},
            { time: "Evening", icon: "🌙", activities: [
              { name: "Moulin Rouge show", type: "activity", duration: "2 hrs" },
              { name: "Late night dinner in Pigalle", type: "food", duration: "1 hr" },
            ]},
          ],
        },
        {
          day: 5,
          title: "Farewell Paris",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "Notre-Dame area walk (exterior view)", type: "sightseeing", duration: "1 hr" },
              { name: "Breakfast at a riverside café", type: "food", duration: "1 hr" },
              { name: "Last-minute souvenir shopping", type: "activity", duration: "1 hr" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Check out from hotel", type: "hotel", duration: "30 min" },
              { name: "Transfer to airport", type: "transport", duration: "1 hr" },
            ]},
          ],
        },
      ],
    },
    tokyo: {
      destination: "Tokyo, Japan",
      tripDuration: "5 Days",
      travellers: 2,
      days: [
        {
          day: 1,
          title: "Arrival & Shibuya Experience",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "Arrive at Narita Airport", type: "transport", duration: "1 hr" },
              { name: "Take express train to hotel", type: "transport", duration: "1.5 hrs" },
              { name: "Check in & freshen up", type: "hotel", duration: "1 hr" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Shibuya Crossing & Hachiko statue", type: "sightseeing", duration: "1 hr" },
              { name: "Ramen lunch at Ichiran", type: "food", duration: "1 hr" },
              { name: "Shibuya Sky observation deck", type: "sightseeing", duration: "1.5 hrs" },
            ]},
            { time: "Evening", icon: "🌙", activities: [
              { name: "Harajuku & Takeshita Street", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Dinner in Omotesando", type: "food", duration: "1.5 hrs" },
            ]},
          ],
        },
        {
          day: 2,
          title: "Traditional Tokyo",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "Senso-ji Temple, Asakusa", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Nakamise Shopping Street", type: "activity", duration: "1 hr" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Sushi lunch at Tsukiji Outer Market", type: "food", duration: "1.5 hrs" },
              { name: "Imperial Palace East Gardens", type: "sightseeing", duration: "1.5 hrs" },
            ]},
            { time: "Evening", icon: "🌙", activities: [
              { name: "Akihabara electronics district", type: "sightseeing", duration: "2 hrs" },
              { name: "Izakaya dinner experience", type: "food", duration: "1.5 hrs" },
            ]},
          ],
        },
        {
          day: 3,
          title: "Day Trip to Mount Fuji",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "Bullet train to Kawaguchiko", type: "transport", duration: "2 hrs" },
              { name: "Lake Kawaguchi boat ride", type: "activity", duration: "1 hr" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Fuji View lunch", type: "food", duration: "1 hr" },
              { name: "Chureito Pagoda viewpoint hike", type: "sightseeing", duration: "2 hrs" },
            ]},
            { time: "Evening", icon: "🌙", activities: [
              { name: "Return to Tokyo", type: "transport", duration: "2 hrs" },
              { name: "Conveyor belt sushi dinner", type: "food", duration: "1 hr" },
            ]},
          ],
        },
        {
          day: 4,
          title: "Modern Tokyo & Shopping",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "TeamLab Borderless digital art", type: "activity", duration: "2 hrs" },
              { name: "Lunch in Odaiba", type: "food", duration: "1 hr" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Tokyo Skytree observation", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Shopping in Ginza district", type: "activity", duration: "2 hrs" },
            ]},
            { time: "Evening", icon: "🌙", activities: [
              { name: "Robot Restaurant show", type: "activity", duration: "1.5 hrs" },
              { name: "Yakiniku dinner in Shinjuku", type: "food", duration: "1.5 hrs" },
            ]},
          ],
        },
        {
          day: 5,
          title: "Farewell Tokyo",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "Meiji Shrine morning visit", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Breakfast at a Tokyo café", type: "food", duration: "1 hr" },
              { name: "Last-minute shopping at Don Quijote", type: "activity", duration: "1 hr" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Check out from hotel", type: "hotel", duration: "30 min" },
              { name: "Transfer to airport", type: "transport", duration: "1.5 hrs" },
            ]},
          ],
        },
      ],
    },
    bali: {
      destination: "Bali, Indonesia",
      tripDuration: "5 Days",
      travellers: 2,
      days: [
        {
          day: 1,
          title: "Arrival & Beach Vibes",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "Arrive at Ngurah Rai Airport", type: "transport", duration: "1 hr" },
              { name: "Transfer to Seminyak hotel", type: "transport", duration: "45 min" },
              { name: "Check in & relax by the pool", type: "hotel", duration: "1.5 hrs" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Seminyak Beach walk & sunbathe", type: "sightseeing", duration: "2 hrs" },
              { name: "Seafood lunch at Jimbaran Bay", type: "food", duration: "1 hr" },
            ]},
            { time: "Evening", icon: "🌙", activities: [
              { name: "Sunset at Tanah Lot Temple", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Welcome dinner at a beach club", type: "food", duration: "1.5 hrs" },
            ]},
          ],
        },
        {
          day: 2,
          title: "Ubud & Rice Terraces",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "Drive to Ubud", type: "transport", duration: "1.5 hrs" },
              { name: "Tegallalang Rice Terraces walk", type: "sightseeing", duration: "1.5 hrs" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Lunch at Ubud local warung", type: "food", duration: "1 hr" },
              { name: "Sacred Monkey Forest visit", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Ubud Art Market shopping", type: "activity", duration: "1 hr" },
            ]},
            { time: "Evening", icon: "🌙", activities: [
              { name: "Traditional Balinese dance performance", type: "activity", duration: "1.5 hrs" },
              { name: "Dinner at a jungle restaurant", type: "food", duration: "1.5 hrs" },
            ]},
          ],
        },
        {
          day: 3,
          title: "Temples & Waterfalls",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "Tirta Empul water purification temple", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Coffee plantation visit", type: "activity", duration: "1 hr" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Tegenungan Waterfall swim", type: "activity", duration: "2 hrs" },
              { name: "Lunch at a Ubud café", type: "food", duration: "1 hr" },
            ]},
            { time: "Evening", icon: "🌙", activities: [
              { name: "Return to Seminyak", type: "transport", duration: "1.5 hrs" },
              { name: "Dinner at La Lucciola", type: "food", duration: "1.5 hrs" },
            ]},
          ],
        },
        {
          day: 4,
          title: "Island Adventure",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "Nusa Penida day trip boat ride", type: "transport", duration: "45 min" },
              { name: "Kelingking Beach viewpoint", type: "sightseeing", duration: "1.5 hrs" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Snorkeling with manta rays", type: "activity", duration: "2 hrs" },
              { name: "Lunch on the island", type: "food", duration: "1 hr" },
            ]},
            { time: "Evening", icon: "🌙", activities: [
              { name: "Return to Bali mainland", type: "transport", duration: "45 min" },
              { name: "Farewell seafood dinner", type: "food", duration: "1.5 hrs" },
            ]},
          ],
        },
        {
          day: 5,
          title: "Farewell Bali",
          blocks: [
            { time: "Morning", icon: "🌅", activities: [
              { name: "Morning yoga session", type: "activity", duration: "1 hr" },
              { name: "Breakfast at hotel", type: "food", duration: "1 hr" },
              { name: "Last-minute spa treatment", type: "activity", duration: "1.5 hrs" },
            ]},
            { time: "Afternoon", icon: "☀️", activities: [
              { name: "Check out from hotel", type: "hotel", duration: "30 min" },
              { name: "Transfer to airport", type: "transport", duration: "45 min" },
            ]},
          ],
        },
      ],
    },
  },

  "home.destinationData": {
    paris: {
      weather: { temp: 22, condition: "Partly Cloudy", humidity: 60, wind: 15, icon: "⛅" },
      attractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Arc de Triomphe", "Montmartre", "Seine River Cruise"],
      packing: [
        { item: "Light jacket", icon: "🧥", packed: false },
        { item: "Umbrella", icon: "☂️", packed: false },
        { item: "Comfortable walking shoes", icon: "👟", packed: false },
        { item: "Camera", icon: "📷", packed: false },
        { item: "Power adapter (EU)", icon: "🔌", packed: false },
        { item: "Travel guide book", icon: "📖", packed: false },
      ],
      transport: { type: "flight", carrier: "Air France", flightNo: "AF 101", from: "New York (JFK)", to: "Paris (CDG)", departDate: "Jul 20, 2026", departTime: "18:00", arriveTime: "07:00", terminal: "Terminal 1", seat: "22A", gate: "C14" },
    },
    tokyo: {
      weather: { temp: 30, condition: "Humid", humidity: 80, wind: 8, icon: "🌤️" },
      attractions: ["Senso-ji Temple", "Shibuya Crossing", "Tokyo Tower", "Meiji Shrine", "Akihabara", "TeamLab Borderless"],
      packing: [
        { item: "Sunscreen", icon: "🧴", packed: false },
        { item: "Portable fan", icon: "🌬️", packed: false },
        { item: "IC Card (Suica/Pasmo)", icon: "💳", packed: false },
        { item: "Light clothing", icon: "👕", packed: false },
        { item: "Power adapter (JP)", icon: "🔌", packed: false },
        { item: "Pocket Wi-Fi", icon: "📡", packed: false },
      ],
      transport: { type: "flight", carrier: "Japan Airlines", flightNo: "JL 005", from: "Delhi (DEL)", to: "Tokyo (NRT)", departDate: "Aug 10, 2026", departTime: "02:30", arriveTime: "11:00", terminal: "Terminal 3", seat: "18C", gate: "A7" },
    },
    bali: {
      weather: { temp: 28, condition: "Partly Cloudy", humidity: 75, wind: 12, icon: "⛅" },
      attractions: ["Tanah Lot Temple", "Ubud Rice Terraces", "Sacred Monkey Forest", "Seminyak Beach", "Tegenungan Waterfall", "Uluwatu Temple"],
      packing: [
        { item: "Sunscreen (SPF 50+)", icon: "🧴", packed: false },
        { item: "Cap / Hat", icon: "🧢", packed: false },
        { item: "Sunglasses", icon: "🕶️", packed: false },
        { item: "Swimwear", icon: "👙", packed: false },
        { item: "Flip flops", icon: "🩴", packed: false },
        { item: "Light cotton clothes", icon: "👕", packed: false },
        { item: "Insect repellent", icon: "🦟", packed: false },
        { item: "Reusable water bottle", icon: "🍶", packed: false },
      ],
      transport: { type: "flight", carrier: "Air India", flightNo: "AI 101", from: "Mumbai (BOM)", to: "Bali (DPS)", departDate: "Sep 5, 2026", departTime: "06:00", arriveTime: "14:30", terminal: "Terminal 2", seat: "14A", gate: "B12" },
    },
  },
};

export const seedContent = async () => {
  try {
    const count = await Content.countDocuments();
    if (count === 0) {
      const docs = Object.entries(defaultSections).map(([section, value]) => ({
        section,
        value,
      }));
      await Content.insertMany(docs);
      console.log(`Seeded ${docs.length} content sections`);
    }
  } catch (error) {
    console.error("Content seed error:", error.message);
  }
};
