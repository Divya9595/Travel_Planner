import { Link } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";

const features = [
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
];

const steps = [
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
];

const destinations = [
  {
    name: "Bali, Indonesia",
    type: "Beach & Culture",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  },
  {
    name: "Paris, France",
    type: "City & Romance",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
  },
  {
    name: "Tokyo, Japan",
    type: "Culture & Food",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
  },
  {
    name: "Santorini, Greece",
    type: "Island & Relaxation",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80"
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Plan Your Perfect Trip
            <span className="block text-indigo-400">With AI Assistance</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Not a booking platform — a smart travel planner. Chat with AI to
            create personalized itineraries, get packing lists, weather updates,
            and everything you need for a stress-free trip.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="rounded-xl bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-400 transition-all hover:scale-105"
            >
              Start Planning Free
            </Link>
            <a
              href="#how-it-works"
              className="rounded-xl bg-white/10 border border-white/20 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-800/50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 text-center mb-14 max-w-xl mx-auto">
            Three simple steps to your personalized travel plan
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div
                key={s.step}
                className="text-center p-8 rounded-2xl bg-slate-800 border border-slate-700/50 relative"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-500 text-white text-lg font-bold flex items-center justify-center mx-auto mb-5">
                  {s.step}
                </div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Everything You Need to Plan a Trip
          </h2>
          <p className="text-slate-400 text-center mb-14 max-w-2xl mx-auto">
            Horizon Travel gives you all the tools to plan, prepare, and
            navigate your trip — no booking required.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 transition-colors group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destination Showcase */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Popular Destinations to Plan
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Pick a destination and let our AI build your perfect itinerary
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((d) => (
              <div
                key={d.name}
                className="rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 transition-all hover:scale-[1.02] group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-white">
                    {d.name}
                  </h3>
                  <p className="text-slate-400 text-sm">{d.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Your Personal Travel Dashboard
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Once your trip is planned, everything lives in one dashboard
          </p>

          <div className="rounded-2xl bg-slate-800 border border-slate-700/50 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weather Widget Preview */}
              <div className="rounded-xl bg-slate-700/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🌤️</span>
                  <span className="text-sm font-semibold text-white">
                    Weather
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⛅</span>
                  <div>
                    <p className="text-xl font-bold text-white">28°C</p>
                    <p className="text-slate-400 text-xs">Partly Cloudy</p>
                  </div>
                </div>
              </div>

              {/* Packing Preview */}
              <div className="rounded-xl bg-slate-700/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎒</span>
                  <span className="text-sm font-semibold text-white">
                    Packing List
                  </span>
                </div>
                <div className="space-y-1.5">
                  {["Sunscreen", "Cap", "Sunglasses", "Swimwear"].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-sm text-slate-300"
                      >
                        <div className="w-4 h-4 rounded border border-slate-500 flex items-center justify-center">
                          <span className="text-[8px] text-slate-500">✓</span>
                        </div>
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Flight Preview */}
              <div className="rounded-xl bg-slate-700/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">✈️</span>
                  <span className="text-sm font-semibold text-white">
                    Flight Details
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="text-right">
                    <p className="text-white font-semibold">06:00</p>
                    <p className="text-slate-400 text-xs">Mumbai</p>
                  </div>
                  <div className="flex-1 h-px bg-slate-600 relative">
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs text-slate-500 bg-slate-700/50 px-1">
                      ✈
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">14:30</p>
                    <p className="text-slate-400 text-xs">Bali</p>
                  </div>
                </div>
              </div>

              {/* Reminders Preview */}
              <div className="rounded-xl bg-slate-700/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🔔</span>
                  <span className="text-sm font-semibold text-white">
                    Reminders
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span>🛂</span> Check passport validity
                  </div>
                  <div className="flex items-center gap-2 text-xs text-red-400">
                    <span>💉</span> Get travel vaccinations
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span>📋</span> Apply for visa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Sign up for free and let our AI build a personalized itinerary for
            your dream destination. No booking fees, no hidden charges — just
            smart travel planning.
          </p>
          <Link
            to="/register"
            className="inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-indigo-600 shadow-lg hover:bg-indigo-50 transition-all hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Index;
