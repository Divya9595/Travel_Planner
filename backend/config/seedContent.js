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
