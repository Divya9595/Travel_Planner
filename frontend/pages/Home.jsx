import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import AIChatWidget from "../src/components/AIChatWidget";
import { fetchTrips } from "../src/store/slices/tripSlice";
import api from "../src/store/api";

const DEFAULT_POPULAR_DESTINATIONS = [
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
];

const DEFAULT_AI_FEATURES = [
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
];

function Home() {
  const { user } = useSelector((state) => state.auth);
  const { previousTrips, loading } = useSelector((state) => state.trips);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split("T")[0];
  const [dateModal, setDateModal] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [popularDestinations, setPopularDestinations] = useState(DEFAULT_POPULAR_DESTINATIONS);
  const [aiFeatures, setAiFeatures] = useState(DEFAULT_AI_FEATURES);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [destRes, featRes] = await Promise.allSettled([
          api.get("/content/home.popularDestinations"),
          api.get("/content/home.aiFeatures"),
        ]);
        if (destRes.status === "fulfilled") setPopularDestinations(destRes.value.data.value);
        if (featRes.status === "fulfilled") setAiFeatures(featRes.value.data.value);
      } catch {
        // keep defaults
      }
    };
    loadContent();
  }, []);

  const handleCardClick = (dest) => {
    setDateModal(dest);
    setDateFrom("");
    setDateTo("");
  };

  const handleConfirmDates = () => {
    if (!dateFrom || !dateTo || !dateModal) return;
    navigate(
      `/dashboard/trips?destination=${encodeURIComponent(dateModal.name)}&dateFrom=${dateFrom}&dateTo=${dateTo}`
    );
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-900 px-6 py-8 lg:px-8 text-slate-100">
        <div className="mx-auto max-w-7xl space-y-12">

          {/* Welcome Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-800 to-slate-900 border border-slate-700/60 p-8 sm:p-10 shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  AI Travel Dashboard
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Welcome back, {user?.name || "Traveller"} 👋
                </h1>
                <p className="text-slate-300 mt-2 text-base max-w-2xl">
                  {previousTrips.length > 0
                    ? `You currently have ${previousTrips.length} saved trip${
                        previousTrips.length > 1 ? "s" : ""
                      }. Explore suggestions below or plan your next custom AI itinerary.`
                    : "Ready to explore the world? Select a popular destination below or use our AI to build your dream trip."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  to="/dashboard/trips"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 px-6 py-3 text-sm font-semibold text-white transition-all shadow-lg hover:shadow-indigo-500/25 hover:scale-105"
                >
                  <span>Plan New Trip</span>
                  <span className="text-lg">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Section 1: My Saved Trips */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span>🗺️</span> My Saved Trips
                </h2>
                <p className="text-slate-400 text-sm mt-0.5">
                  Your active and upcoming itinerary plans
                </p>
              </div>
              {previousTrips.length > 0 && (
                <Link
                  to="/dashboard/trips"
                  className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition"
                >
                  View All ({previousTrips.length}) →
                </Link>
              )}
            </div>

            {loading ? (
              <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-12 text-center">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h3 className="text-slate-300 font-medium">Loading your saved trips...</h3>
              </div>
            ) : previousTrips.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {previousTrips.map((trip) => (
                  <div
                    key={trip._id}
                    onClick={() => navigate(`/dashboard/trips/${trip._id}`)}
                    className="group relative rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500/60 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">✈️</span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {trip.travellers} {trip.travellers === 1 ? "Traveller" : "Travellers"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">
                        {trip.destination}
                      </h3>
                      {trip.from && (
                        <p className="text-slate-400 text-xs mt-1">
                          From: <span className="text-slate-300">{trip.from}</span>
                        </p>
                      )}
                      <p className="text-slate-400 text-sm mt-2 flex items-center gap-1.5">
                        <span>📅</span>
                        <span>{trip.dateFrom || "TBD"} – {trip.dateTo || "TBD"}</span>
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-700/40 flex items-center justify-between">
                      <span className="text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        View Itinerary Details
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-700/60 group-hover:bg-indigo-500 group-hover:text-white text-slate-300 flex items-center justify-center transition-all">
                        →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-8 text-center max-w-xl mx-auto">
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  No saved trips yet
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  Select a popular destination below or create your first customized itinerary in seconds!
                </p>
                <Link
                  to="/dashboard/trips"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 transition"
                >
                  <span>Create Your First Trip</span>
                  <span>→</span>
                </Link>
              </div>
            )}
          </div>

          {/* Section 2: "Where are you planning to go next?" (Trip Suggestions & Popular Destinations) */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
              <div>
                <span className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                  Featured Destinations
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Where are you planning to go next?
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Click any destination to generate a customized AI itinerary instantly.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="group relative rounded-2xl bg-slate-800/90 border border-slate-700/70 hover:border-indigo-500/60 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between"
                >
                  {/* Card Header Background Gradient */}
                  <div className={`p-6 bg-gradient-to-b ${dest.gradient}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl p-2 rounded-2xl bg-slate-800/80 shadow-md border border-slate-700/50">
                        {dest.icon}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {dest.badge}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700/80 text-slate-300">
                          {dest.duration}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition">
                      {dest.name}
                    </h3>
                    <p className="text-slate-300 text-xs mt-1 font-medium">
                      {dest.tagline}
                    </p>
                  </div>

                  {/* Highlights & CTA */}
                  <div className="p-6 pt-2 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Trip Highlights
                      </p>
                      <ul className="space-y-1.5">
                        {dest.highlights.map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                            <span className="text-indigo-400 text-xs">✦</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-400 transition">
                        Generate Itinerary
                      </span>
                      <button
                        onClick={() => handleCardClick(dest)}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500 group-hover:bg-indigo-400 text-white font-bold transition-all shadow-md group-hover:scale-110 cursor-pointer"
                        title={`Plan trip to ${dest.name}`}
                      >
                        <span className="text-lg">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Overview of using AI to make customized itineraries */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-800/80 border border-slate-700/70 p-8 sm:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-3">
                  🤖 Powered by Gemini AI
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  How Our AI Makes Customized Itineraries
                </h2>
                <p className="text-slate-300 text-base mt-3 leading-relaxed">
                  Skip hours of manual research. Our intelligent travel engine crafts complete, hyper-personalized trip itineraries in seconds based on your schedule, preferences, and destination.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {aiFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-6 flex flex-col justify-between hover:border-indigo-500/40 transition"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-2xl mb-4">
                        {feat.icon}
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">
                        {feat.title}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Banner */}
              <div className="mt-12 pt-8 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Ready to build your custom travel plan?
                  </h3>
                  <p className="text-slate-400 text-sm mt-0.5">
                    Start with any destination or chat live with our AI assistant.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/dashboard/trips"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 px-6 py-3 text-sm font-semibold text-white transition-all shadow-lg hover:scale-105"
                  >
                    <span>Create Custom Itinerary</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating AI Chat Assistant Widget */}
      <AIChatWidget />

      {/* Date Picker Modal */}
      {dateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{dateModal.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-white">{dateModal.name}</h3>
                <p className="text-slate-400 text-sm">{dateModal.duration} &middot; {dateModal.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-4">Select your travel dates to generate the itinerary:</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Departure Date</label>
                <input
                  type="date"
                  min={todayStr}
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    if (dateTo && dateTo < e.target.value) setDateTo("");
                  }}
                  className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2.5 text-sm text-white [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Return Date</label>
                <input
                  type="date"
                  min={dateFrom || todayStr}
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2.5 text-sm text-white [color-scheme:dark]"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleConfirmDates}
                disabled={!dateFrom || !dateTo}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition cursor-pointer ${
                  !dateFrom || !dateTo
                    ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-500 text-white hover:bg-indigo-400"
                }`}
              >
                Generate Itinerary
              </button>
              <button
                onClick={() => setDateModal(null)}
                className="rounded-lg bg-slate-700 px-4 py-2.5 text-sm text-slate-300 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;

