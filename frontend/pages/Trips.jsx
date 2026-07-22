import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { createTripThunk } from "../src/store/slices/tripSlice";
import Navbar from "../src/components/Navbar";
import AIChatWidget from "../src/components/AIChatWidget";
import api from "../src/store/api";

const typeStyles = {
  sightseeing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  food: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  transport: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  hotel: "bg-green-500/15 text-green-400 border-green-500/30",
  activity: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  culture: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  nature: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  shopping: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  adventure: "bg-red-500/15 text-red-400 border-red-500/30",
  relaxation: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  nightlife: "bg-violet-500/15 text-violet-400 border-violet-500/30",
};

const DEFAULT_DESTINATION_DATA = {
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
};

const defaultDashboardData = {
  weather: { temp: 25, condition: "Clear Sky", humidity: 55, wind: 10, icon: "☀️" },
  attractions: ["Local Landmark", "Historic Site", "Popular Market", "City Center", "Scenic Viewpoint", "Cultural Museum"],
  packing: [
    { item: "Passport", icon: "🛂", packed: false },
    { item: "Travel adapter", icon: "🔌", packed: false },
    { item: "Camera", icon: "📷", packed: false },
    { item: "Comfortable shoes", icon: "👟", packed: false },
    { item: "Sunscreen", icon: "🧴", packed: false },
    { item: "Water bottle", icon: "🍶", packed: false },
  ],
  transport: { type: "flight", carrier: "Airline", flightNo: "XX 000", from: "Home City", to: "Destination", departDate: "Oct 1, 2026", departTime: "08:00", arriveTime: "14:00", terminal: "Terminal 1", seat: "10A", gate: "D5" },
};

function generateDashboardData(dest, itinerary, fromDate, destData = DEFAULT_DESTINATION_DATA) {
  let matched = null;
  for (const key of Object.keys(destData)) {
    if (dest.includes(key)) {
      matched = destData[key];
      break;
    }
  }
  const base = matched || defaultDashboardData;
  return {
    weather: base.weather,
    attractions: base.attractions,
    packing: base.packing.map((p) => ({ ...p })),
    todoList: [
      { task: "Book flights", done: false },
      { task: "Reserve hotel", done: false },
      { task: "Buy travel insurance", done: false },
      { task: "Check passport validity", done: false },
      { task: "Pack luggage", done: false },
      { task: "Download offline maps", done: false },
    ],
    transport: { ...base.transport, to: itinerary.destination },
    reminders: [
      { text: "Check passport validity (6+ months)", icon: "🛂", urgent: true },
      { text: "Check visa requirements", icon: "📋", urgent: false },
      { text: "Carry printed confirmations", icon: "📄", urgent: false },
      { text: "Download local transport app", icon: "📱", urgent: false },
    ],
  };
}

function Trips() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [search, setSearch] = useState({
    from: "",
    destination: "",
    dateFrom: "",
    dateTo: "",
    travellers: 1,
  });
  const [activeTab, setActiveTab] = useState("itinerary");
  const [itinerary, setItinerary] = useState(null);
  const [tripAdded, setTripAdded] = useState(false);
  const todayStr = new Date().toISOString().split("T")[0];
  const [destData, setDestData] = useState(DEFAULT_DESTINATION_DATA);

  const [step, setStep] = useState("search");
  const [attractions, setAttractions] = useState([]);
  const [selectedAttractions, setSelectedAttractions] = useState([]);

  const { previousTrips } = useSelector((state) => state.trips);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadContent = async () => {
      try {
        const ddRes = await api.get("/content/home.destinationData");
        setDestData(ddRes.data.value);
      } catch {
        // keep defaults
      }
    };
    loadContent();
  }, []);

  useEffect(() => {
    if (location.state?.generatedItinerary) {
      const genItinerary = location.state.generatedItinerary;
      setItinerary(genItinerary);
      setActiveTab("itinerary");
      setTripAdded(false);
      setSearch((prev) => ({
        ...prev,
        destination: genItinerary.destination || prev.destination,
        dateFrom: location.state?.dateFrom || genItinerary.dateFrom || "",
        dateTo: location.state?.dateTo || genItinerary.dateTo || "",
        travellers: genItinerary.travellers || prev.travellers,
      }));
      setTimeout(() => {
        window.scrollTo({ top: 350, behavior: "smooth" });
      }, 100);
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.generatedItinerary) return;
    const destParam = searchParams.get("destination");
    const dateFromParam = searchParams.get("dateFrom");
    const dateToParam = searchParams.get("dateTo");
    if (destParam) {
      const destName = decodeURIComponent(destParam);
      setSearch((prev) => {
        const updated = { ...prev, destination: destName };
        if (dateFromParam) updated.dateFrom = dateFromParam;
        if (dateToParam) updated.dateTo = dateToParam;
        return updated;
      });
    }
  }, [searchParams]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "dateFrom" && updated.dateTo && updated.dateTo < value) {
        updated.dateTo = value;
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.destination.trim()) return;
    if (!search.dateFrom || !search.dateTo) {
      alert("Please enter both departure and return dates before planning your trip.");
      return;
    }

    setStep("loading-attractions");
    setItinerary(null);
    setSelectedAttractions([]);
    setActiveTab("itinerary");

    api.post("/ai/attractions", { destination: search.destination.trim() })
      .then((res) => {
        setAttractions(res.data.attractions || []);
        setStep("select-attractions");
      })
      .catch(() => {
        alert("Failed to fetch attractions. Please try again.");
        setStep("search");
      });
  };

  const handleSelectAttraction = (idx) => {
    setSelectedAttractions((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSelectAll = () => {
    if (selectedAttractions.length === attractions.length) {
      setSelectedAttractions([]);
    } else {
      setSelectedAttractions(attractions.map((_, i) => i));
    }
  };

  const handleGenerateItinerary = () => {
    if (selectedAttractions.length === 0) return;

    setStep("generating-itinerary");

    const selected = selectedAttractions.map((i) => attractions[i]);
    api.post("/ai/generate-itinerary", {
      destination: search.destination.trim(),
      dateFrom: search.dateFrom,
      dateTo: search.dateTo,
      travellers: search.travellers,
      selectedAttractions: selected,
    })
      .then((res) => {
        const generated = res.data.itinerary;
        if (generated) {
          setItinerary(generated);
          setStep("itinerary");
        } else {
          alert("Failed to generate itinerary. Please try again.");
          setStep("select-attractions");
        }
      })
      .catch(() => {
        alert("Failed to generate itinerary. Please try again.");
        setStep("select-attractions");
      });
  };

  const handleAddTrip = () => {
    if (!itinerary) return;
    if (!search.dateFrom || !search.dateTo) {
      alert("Please enter both departure and arrival dates before saving.");
      return;
    }
    const dest = itinerary.destination.toLowerCase();
    const dashboardData = generateDashboardData(dest, itinerary, search.dateFrom, destData);
    const tripPayload = {
      from: search.from,
      destination: itinerary.destination,
      dateFrom: search.dateFrom,
      dateTo: search.dateTo,
      travellers: itinerary.travellers,
      dates: itinerary.tripDuration,
      itinerary,
      ...dashboardData,
    };
    dispatch(createTripThunk(tripPayload));
    setTripAdded(true);
  };

  return (
    <>
      <Navbar />

      {/* Ribbon Search Bar */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-16 z-40">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-7xl px-6 py-4"
        >
          <div className="flex flex-col lg:flex-row items-end gap-4">
            <div className="w-full lg:w-40">
              <label
                htmlFor="from"
                className="block text-xs font-medium text-slate-400 mb-1"
              >
                From
              </label>
              <input
                id="from"
                name="from"
                type="text"
                value={search.from}
                onChange={handleChange}
                placeholder="Departing city"
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex-1 w-full">
              <label
                htmlFor="destination"
                className="block text-xs font-medium text-slate-400 mb-1"
              >
                Destination
              </label>
              <input
                id="destination"
                name="destination"
                type="text"
                value={search.destination}
                onChange={handleChange}
                placeholder="Where to?"
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div className="w-full lg:w-44">
              <label
                htmlFor="dateFrom"
                className="block text-xs font-medium text-slate-400 mb-1"
              >
                From Date
              </label>
              <input
                id="dateFrom"
                name="dateFrom"
                type="date"
                min={todayStr}
                value={search.dateFrom}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition [color-scheme:dark]"
              />
            </div>

            <div className="w-full lg:w-44">
              <label
                htmlFor="dateTo"
                className="block text-xs font-medium text-slate-400 mb-1"
              >
                To Date
              </label>
              <input
                id="dateTo"
                name="dateTo"
                type="date"
                min={search.dateFrom || todayStr}
                value={search.dateTo}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition [color-scheme:dark]"
              />
            </div>

            <div className="w-full lg:w-32">
              <label
                htmlFor="travellers"
                className="block text-xs font-medium text-slate-400 mb-1"
              >
                Travellers
              </label>
              <input
                id="travellers"
                name="travellers"
                type="number"
                min="1"
                max="20"
                value={search.travellers}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={!search.dateFrom || !search.dateTo || !search.destination.trim()}
              className={`w-full lg:w-auto rounded-lg px-8 py-2.5 text-sm font-semibold transition whitespace-nowrap ${
                !search.dateFrom || !search.dateTo || !search.destination.trim()
                  ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-400 cursor-pointer"
              }`}
            >
              Plan My Trip
            </button>
          </div>
        </form>
      </div>

      {/* AI Customization Notice Banner */}
      <div className="bg-indigo-950/70 border-b border-indigo-500/30 px-6 py-3">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <p className="text-xs sm:text-sm text-indigo-200">
              <span className="font-semibold text-white">Need a more customized itinerary?</span>{" "}
              Use our AI Assistant to tailor your activities, flight details, budget, and dining preferences!
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-ai-chat"))}
            className="shrink-0 px-4 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <span>✨</span>
            <span>Use AI Custom Planner</span>
          </button>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="min-h-screen bg-slate-900 px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-5xl">

          {/* Tab Buttons */}
          <div className="flex items-center gap-1 mb-8 border-b border-slate-700">
            <button
              onClick={() => setActiveTab("itinerary")}
              className={`px-5 py-3 text-sm font-medium transition cursor-pointer border-b-2 -mb-px ${
                activeTab === "itinerary"
                  ? "text-indigo-400 border-indigo-400"
                  : "text-slate-400 border-transparent hover:text-white"
              }`}
            >
              Itinerary
            </button>
            <button
              onClick={() => setActiveTab("previous")}
              className={`px-5 py-3 text-sm font-medium transition cursor-pointer border-b-2 -mb-px ${
                activeTab === "previous"
                  ? "text-indigo-400 border-indigo-400"
                  : "text-slate-400 border-transparent hover:text-white"
              }`}
            >
              Previous Trips
            </button>
          </div>

          {/* Itinerary Tab */}
          {activeTab === "itinerary" && (
            <>
              {(!itinerary && step === "search") ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-6">🗺️</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Plan Your Trip
                  </h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Enter your destination, travel dates, and number of
                    travellers above to discover famous attractions and generate a custom itinerary.
                  </p>
                </div>
              ) : step === "loading-attractions" ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4" />
                  <p className="text-slate-300 text-sm">Finding famous attractions in {search.destination}...</p>
                </div>
              ) : step === "select-attractions" ? (
                <div>
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">Famous Attractions in {search.destination}</h2>
                      <p className="text-slate-400 text-sm mt-1">Select the attractions you want to visit ({selectedAttractions.length} of {attractions.length} selected)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={handleSelectAll} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer transition">
                        {selectedAttractions.length === attractions.length ? "Deselect All" : "Select All"}
                      </button>
                      <button
                        onClick={handleGenerateItinerary}
                        disabled={selectedAttractions.length === 0}
                        className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition whitespace-nowrap ${
                          selectedAttractions.length === 0
                            ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                            : "bg-emerald-500 text-white hover:bg-emerald-400 cursor-pointer"
                        }`}
                      >
                        Generate Itinerary ({selectedAttractions.length})
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {attractions.map((attr, idx) => {
                      const isSelected = selectedAttractions.includes(idx);
                      const typeColor = typeStyles[attr.type] || "bg-slate-500/15 text-slate-400 border-slate-500/30";
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectAttraction(idx)}
                          className={`text-left rounded-xl border p-4 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-indigo-500/15 border-indigo-500/50 ring-1 ring-indigo-500/30"
                              : "bg-slate-800 border-slate-700/50 hover:border-slate-600"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition ${
                              isSelected ? "bg-indigo-500 border-indigo-500" : "border-slate-600"
                            }`}>
                              {isSelected && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${typeColor}`}>{attr.type}</span>
                          </div>
                          <h3 className="text-sm font-semibold text-white mt-2">{attr.name}</h3>
                          <p className="text-slate-400 text-xs mt-1 line-clamp-2">{attr.description}</p>
                          <p className="text-slate-500 text-xs mt-2">~{attr.estimatedTime}</p>
                        </button>
                      );
                    })}
                  </div>

                  {attractions.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-3">🔍</div>
                      <p className="text-slate-400 text-sm">No attractions found. Try a different destination.</p>
                    </div>
                  )}
                </div>
              ) : step === "generating-itinerary" ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4" />
                  <p className="text-slate-300 text-sm">Generating your custom itinerary for {search.destination}...</p>
                  <p className="text-slate-500 text-xs mt-2">Based on {selectedAttractions.length} selected attractions</p>
                </div>
              ) : itinerary ? (
                <div>
                  {/* Trip Header */}
                  <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {itinerary.destination}
                      </h2>
                      <p className="text-slate-400 text-sm mt-1">
                        {itinerary.tripDuration} &middot; {itinerary.travellers}{" "}
                        traveller{itinerary.travellers > 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      onClick={handleAddTrip}
                      disabled={tripAdded || !search.dateFrom || !search.dateTo}
                      className={`shrink-0 rounded-lg px-6 py-2.5 text-sm font-semibold transition whitespace-nowrap ${
                        tripAdded
                          ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-default"
                          : !search.dateFrom || !search.dateTo
                            ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                            : "bg-emerald-500 text-white hover:bg-emerald-400 cursor-pointer"
                      }`}
                    >
                      {tripAdded
                        ? "✓ Added to My Trips"
                        : !search.dateFrom || !search.dateTo
                          ? "Set dates first"
                          : "+ Add My Trip"}
                    </button>
                  </div>

                  {/* Day Cards */}
                  <div className="space-y-8">
                    {itinerary.days.map((day) => (
                      <div
                        key={day.day}
                        className="rounded-2xl bg-slate-800 border border-slate-700/50 overflow-hidden"
                      >
                        {/* Day Header */}
                        <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500 text-white text-sm font-bold">
                              {day.day}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {day.title}
                              </h3>
                              <p className="text-slate-400 text-sm">
                                Day {day.day} &middot; {day.date}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Time Blocks */}
                        <div className="p-6 space-y-6">
                          {(day.blocks || []).map((block) => (
                            <div key={block.time}>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">{block.icon}</span>
                                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                                  {block.time}
                                </h4>
                              </div>

                              <div className="space-y-2 ml-8">
                                {(block.activities || []).map((activity, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                                    <div className="flex-1 flex items-center gap-2">
                                      <span className="text-white text-sm">
                                        {activity.name}
                                      </span>
                                      <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                                          typeStyles[activity.type] || "bg-slate-500/15 text-slate-400 border-slate-500/30"
                                        }`}
                                      >
                                        {activity.type}
                                      </span>
                                    </div>
                                    <span className="text-slate-500 text-xs whitespace-nowrap">
                                      {activity.duration}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}

          {/* Previous Trips Tab */}
          {activeTab === "previous" && (
            <>
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const pastTrips = previousTrips.filter((trip) => {
                  const endDate = trip.dateTo || trip.dates;
                  if (!endDate) return false;
                  const d = new Date(endDate);
                  return !isNaN(d.getTime()) && d < today;
                });

                return pastTrips.length > 0 ? (
                  <div className="space-y-6">
                    {pastTrips.map((trip) => (
                      <Link
                        key={trip._id}
                        to={`/dashboard/trips/${trip._id}`}
                        className="block rounded-2xl bg-slate-800 border border-slate-700/50 p-6 hover:border-indigo-500/50 hover:bg-slate-700/50 transition-all group"
                      >
                        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition">
                          {trip.destination}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                          {trip.dates || `${trip.dateFrom} - ${trip.dateTo}`} &middot; {trip.travellers} traveller
                          {trip.travellers > 1 ? "s" : ""}
                        </p>
                        <span className="inline-block mt-3 text-xs text-indigo-400 font-medium">
                          View Details →
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-5xl mb-6">🧳</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Past Trips Yet
                    </h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                      Completed trips will appear here once their travel dates have passed.
                    </p>
                  </div>
                );
              })()}
            </>
          )}

        </div>
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget
        onItineraryGenerated={(itinerary) => {
          setItinerary(itinerary);
          setActiveTab("itinerary");
          setTripAdded(false);
        }}
      />
    </>
  );
}

export default Trips;
