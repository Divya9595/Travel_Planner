import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { addTrip, createTripThunk } from "../src/store/slices/tripSlice";
import Navbar from "../src/components/Navbar";
import AIChatWidget from "../src/components/AIChatWidget";

const sampleItineraries = {
  paris: {
    destination: "Paris, France",
    tripDuration: "5 Days",
    travellers: 2,
    days: [
      {
        day: 1,
        date: "Jul 20, 2026",
        title: "Arrival & Iconic Landmarks",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "Arrive at Charles de Gaulle Airport", type: "transport", duration: "1 hr" },
              { name: "Check in to hotel & freshen up", type: "hotel", duration: "1 hr" },
              { name: "Breakfast at Café de Flore", type: "food", duration: "1 hr" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Eiffel Tower visit & photos", type: "sightseeing", duration: "2 hrs" },
              { name: "Lunch at Le Marais district", type: "food", duration: "1 hr" },
              { name: "Walk along Champ de Mars gardens", type: "sightseeing", duration: "1 hr" },
            ],
          },
          {
            time: "Evening",
            icon: "🌙",
            activities: [
              { name: "Seine River sunset cruise", type: "activity", duration: "1.5 hrs" },
              { name: "Dinner at Le Jules Verne", type: "food", duration: "1.5 hrs" },
            ],
          },
        ],
      },
      {
        day: 2,
        date: "Jul 21, 2026",
        title: "Art & Culture Day",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "Louvre Museum guided tour", type: "sightseeing", duration: "3 hrs" },
              { name: "Coffee at museum café", type: "food", duration: "30 min" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Tuileries Garden stroll", type: "sightseeing", duration: "1 hr" },
              { name: "Lunch at Angelina Paris", type: "food", duration: "1 hr" },
              { name: "Musée d'Orsay visit", type: "sightseeing", duration: "2 hrs" },
            ],
          },
          {
            time: "Evening",
            icon: "🌙",
            activities: [
              { name: "Montmartre & Sacré-Cœur", type: "sightseeing", duration: "2 hrs" },
              { name: "Dinner at a Montmartre bistro", type: "food", duration: "1.5 hrs" },
            ],
          },
        ],
      },
      {
        day: 3,
        date: "Jul 22, 2026",
        title: "Palace of Versailles",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "Train to Versailles", type: "transport", duration: "45 min" },
              { name: "Versailles Palace tour", type: "sightseeing", duration: "2.5 hrs" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Gardens of Versailles walk", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Lunch near palace grounds", type: "food", duration: "1 hr" },
              { name: "Grand Trianon & Marie Antoinette's Estate", type: "sightseeing", duration: "1.5 hrs" },
            ],
          },
          {
            time: "Evening",
            icon: "🌙",
            activities: [
              { name: "Return to Paris", type: "transport", duration: "45 min" },
              { name: "Dinner in Le Latin quarter", type: "food", duration: "1.5 hrs" },
            ],
          },
        ],
      },
      {
        day: 4,
        date: "Jul 23, 2026",
        title: "Shopping & Hidden Gems",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "Champs-Élysées morning walk", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Shopping at Galeries Lafayette", type: "activity", duration: "2 hrs" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Lunch at Rue Cler market street", type: "food", duration: "1 hr" },
              { name: "Rodin Museum visit", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Saint-Germain-des-Prés explore", type: "sightseeing", duration: "1.5 hrs" },
            ],
          },
          {
            time: "Evening",
            icon: "🌙",
            activities: [
              { name: "Moulin Rouge show", type: "activity", duration: "2 hrs" },
              { name: "Late night dinner in Pigalle", type: "food", duration: "1 hr" },
            ],
          },
        ],
      },
      {
        day: 5,
        date: "Jul 24, 2026",
        title: "Farewell Paris",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "Notre-Dame area walk (exterior view)", type: "sightseeing", duration: "1 hr" },
              { name: "Breakfast at a riverside café", type: "food", duration: "1 hr" },
              { name: "Last-minute souvenir shopping", type: "activity", duration: "1 hr" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Check out from hotel", type: "hotel", duration: "30 min" },
              { name: "Transfer to airport", type: "transport", duration: "1 hr" },
            ],
          },
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
        date: "Aug 10, 2026",
        title: "Arrival & Shibuya Experience",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "Arrive at Narita Airport", type: "transport", duration: "1 hr" },
              { name: "Take express train to hotel", type: "transport", duration: "1.5 hrs" },
              { name: "Check in & freshen up", type: "hotel", duration: "1 hr" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Shibuya Crossing & Hachiko statue", type: "sightseeing", duration: "1 hr" },
              { name: "Ramen lunch at Ichiran", type: "food", duration: "1 hr" },
              { name: "Shibuya Sky observation deck", type: "sightseeing", duration: "1.5 hrs" },
            ],
          },
          {
            time: "Evening",
            icon: "🌙",
            activities: [
              { name: "Harajuku & Takeshita Street", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Dinner in Omotesando", type: "food", duration: "1.5 hrs" },
            ],
          },
        ],
      },
      {
        day: 2,
        date: "Aug 11, 2026",
        title: "Traditional Tokyo",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "Senso-ji Temple, Asakusa", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Nakamise Shopping Street", type: "activity", duration: "1 hr" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Sushi lunch at Tsukiji Outer Market", type: "food", duration: "1.5 hrs" },
              { name: "Imperial Palace East Gardens", type: "sightseeing", duration: "1.5 hrs" },
            ],
          },
          {
            time: "Evening",
            icon: "🌙",
            activities: [
              { name: "Akihabara electronics district", type: "sightseeing", duration: "2 hrs" },
              { name: "Izakaya dinner experience", type: "food", duration: "1.5 hrs" },
            ],
          },
        ],
      },
      {
        day: 3,
        date: "Aug 12, 2026",
        title: "Day Trip to Mount Fuji",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "Bullet train to Kawaguchiko", type: "transport", duration: "2 hrs" },
              { name: "Lake Kawaguchi boat ride", type: "activity", duration: "1 hr" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Fuji View lunch", type: "food", duration: "1 hr" },
              { name: "Chureito Pagoda viewpoint hike", type: "sightseeing", duration: "2 hrs" },
            ],
          },
          {
            time: "Evening",
            icon: "🌙",
            activities: [
              { name: "Return to Tokyo", type: "transport", duration: "2 hrs" },
              { name: "Conveyor belt sushi dinner", type: "food", duration: "1 hr" },
            ],
          },
        ],
      },
      {
        day: 4,
        date: "Aug 13, 2026",
        title: "Pop Culture & Shopping",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "TeamLab Borderless digital art museum", type: "activity", duration: "2.5 hrs" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Lunch in Odaiba", type: "food", duration: "1 hr" },
              { name: "Ginza shopping district", type: "activity", duration: "2.5 hrs" },
            ],
          },
          {
            time: "Evening",
            icon: "🌙",
            activities: [
              { name: "Tokyo Tower night view", type: "sightseeing", duration: "1 hr" },
              { name: "Yakiniku BBQ dinner", type: "food", duration: "1.5 hrs" },
            ],
          },
        ],
      },
      {
        day: 5,
        date: "Aug 14, 2026",
        title: "Farewell Tokyo",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "Meiji Shrine morning walk", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Matcha & pastry at a café", type: "food", duration: "1 hr" },
              { name: "Last-minute souvenir shopping at Don Quijote", type: "activity", duration: "1 hr" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Check out from hotel", type: "hotel", duration: "30 min" },
              { name: "Transfer to Narita Airport", type: "transport", duration: "1.5 hrs" },
            ],
          },
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
        date: "Sep 5, 2026",
        title: "Arrival & Beach Vibes",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "Arrive at Ngurah Rai Airport", type: "transport", duration: "1 hr" },
              { name: "Transfer to Seminyak hotel", type: "transport", duration: "45 min" },
              { name: "Check in & relax by the pool", type: "hotel", duration: "1.5 hrs" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Seminyak Beach walk & sunbathe", type: "sightseeing", duration: "2 hrs" },
              { name: "Seafood lunch at Jimbaran Bay", type: "food", duration: "1 hr" },
            ],
          },
          {
            time: "Evening",
            icon: "🌙",
            activities: [
              { name: "Sunset at Tanah Lot Temple", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Welcome dinner at a beach club", type: "food", duration: "1.5 hrs" },
            ],
          },
        ],
      },
      {
        day: 2,
        date: "Sep 6, 2026",
        title: "Ubud & Rice Terraces",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "Drive to Ubud", type: "transport", duration: "1.5 hrs" },
              { name: "Tegallalang Rice Terraces walk", type: "sightseeing", duration: "1.5 hrs" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Lunch at Ubud local warung", type: "food", duration: "1 hr" },
              { name: "Sacred Monkey Forest visit", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Ubud Art Market shopping", type: "activity", duration: "1 hr" },
            ],
          },
          {
            time: "Evening",
            icon: "🌙",
            activities: [
              { name: "Traditional Balinese dance performance", type: "activity", duration: "1.5 hrs" },
              { name: "Dinner at a jungle restaurant", type: "food", duration: "1.5 hrs" },
            ],
          },
        ],
      },
      {
        day: 3,
        date: "Sep 7, 2026",
        title: "Temples & Waterfalls",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "Tirta Empul water purification temple", type: "sightseeing", duration: "1.5 hrs" },
              { name: "Coffee plantation visit", type: "activity", duration: "1 hr" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Tegenungan Waterfall swim", type: "activity", duration: "2 hrs" },
              { name: "Lunch at a Ubud café", type: "food", duration: "1 hr" },
            ],
          },
          {
            time: "Evening",
            icon: "🌙",
            activities: [
              { name: "Return to Seminyak", type: "transport", duration: "1.5 hrs" },
              { name: "Dinner at La Lucciola", type: "food", duration: "1.5 hrs" },
            ],
          },
        ],
      },
      {
        day: 4,
        date: "Sep 8, 2026",
        title: "Island Adventure",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "Nusa Penida day trip boat ride", type: "transport", duration: "45 min" },
              { name: "Kelingking Beach viewpoint", type: "sightseeing", duration: "1.5 hrs" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Snorkeling with manta rays", type: "activity", duration: "2 hrs" },
              { name: "Lunch on the island", type: "food", duration: "1 hr" },
            ],
          },
          {
            time: "Evening",
            icon: "🌙",
            activities: [
              { name: "Return to Bali mainland", type: "transport", duration: "45 min" },
              { name: "Farewell seafood dinner", type: "food", duration: "1.5 hrs" },
            ],
          },
        ],
      },
      {
        day: 5,
        date: "Sep 9, 2026",
        title: "Farewell Bali",
        blocks: [
          {
            time: "Morning",
            icon: "🌅",
            activities: [
              { name: "Morning yoga session", type: "activity", duration: "1 hr" },
              { name: "Breakfast at hotel", type: "food", duration: "1 hr" },
              { name: "Last-minute spa treatment", type: "activity", duration: "1.5 hrs" },
            ],
          },
          {
            time: "Afternoon",
            icon: "☀️",
            activities: [
              { name: "Check out from hotel", type: "hotel", duration: "30 min" },
              { name: "Transfer to airport", type: "transport", duration: "45 min" },
            ],
          },
        ],
      },
    ],
  },
};

const typeStyles = {
  sightseeing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  food: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  transport: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  hotel: "bg-green-500/15 text-green-400 border-green-500/30",
  activity: "bg-pink-500/15 text-pink-400 border-pink-500/30",
};

const destinationData = {
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

function generateDashboardData(dest, itinerary, fromDate) {
  let matched = null;
  for (const key of Object.keys(destinationData)) {
    if (dest.includes(key)) {
      matched = destinationData[key];
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

const todayStr = new Date().toISOString().split("T")[0];

function generateItineraryForDates(destination, dateFrom, dateTo, travellers) {
  const destName = destination.trim() || "Destination";
  const key = destName.toLowerCase();
  const matchedKey = Object.keys(sampleItineraries).find((k) => key.includes(k));
  const matchedSample = matchedKey ? sampleItineraries[matchedKey] : null;

  let totalDays = 1;
  let startDate = null;

  if (dateFrom && dateTo) {
    const d1 = new Date(dateFrom);
    const d2 = new Date(dateTo);
    const diffTime = d2 - d1;
    const calcDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (calcDays > 0) totalDays = calcDays;
    startDate = d1;
  } else if (matchedSample) {
    totalDays = matchedSample.days.length;
  }

  const generatedDays = [];

  const activityTemplates = [
    {
      title: "Arrival & City Overview",
      morning: [
        { name: `Arrive in ${destName}`, type: "transport", duration: "1.5 hrs" },
        { name: "Hotel check-in & freshen up", type: "hotel", duration: "1 hr" },
      ],
      afternoon: [
        { name: "Explore central landmarks", type: "sightseeing", duration: "2.5 hrs" },
        { name: "Lunch at local café", type: "food", duration: "1 hr" },
      ],
      evening: [
        { name: "Sunset viewpoint & walk", type: "sightseeing", duration: "1.5 hrs" },
        { name: "Welcome dinner at top restaurant", type: "food", duration: "1.5 hrs" },
      ],
    },
    {
      title: "Culture & Landmark Tour",
      morning: [
        { name: "Guided museum & heritage tour", type: "sightseeing", duration: "3 hrs" },
      ],
      afternoon: [
        { name: "Traditional food experience", type: "food", duration: "1.5 hrs" },
        { name: "Stroll through historic district", type: "sightseeing", duration: "2 hrs" },
      ],
      evening: [
        { name: "Local market explore", type: "activity", duration: "1.5 hrs" },
        { name: "Dinner & night walk", type: "food", duration: "2 hrs" },
      ],
    },
    {
      title: "Nature & Local Experiences",
      morning: [
        { name: "Morning scenic park walk", type: "activity", duration: "2 hrs" },
        { name: "Breakfast at a famous spot", type: "food", duration: "1 hr" },
      ],
      afternoon: [
        { name: "Visit key tourist attraction", type: "sightseeing", duration: "2.5 hrs" },
        { name: "Artisanal lunch spot", type: "food", duration: "1 hr" },
      ],
      evening: [
        { name: "River or scenic boat cruise", type: "activity", duration: "1.5 hrs" },
        { name: "Gourmet dinner experience", type: "food", duration: "1.5 hrs" },
      ],
    },
    {
      title: "Shopping & Local Cuisine",
      morning: [
        { name: "Morning market & souvenir shopping", type: "activity", duration: "2 hrs" },
      ],
      afternoon: [
        { name: "Food tasting tour", type: "food", duration: "2.5 hrs" },
        { name: "Architectural & photo spots", type: "sightseeing", duration: "2 hrs" },
      ],
      evening: [
        { name: "Rooftop view & drinks", type: "activity", duration: "1.5 hrs" },
        { name: "Special dinner spot", type: "food", duration: "2 hrs" },
      ],
    },
    {
      title: "Relaxation & Departure",
      morning: [
        { name: "Leisurely breakfast & coffee", type: "food", duration: "1 hr" },
        { name: "Last-minute souvenir shopping", type: "activity", duration: "1.5 hrs" },
      ],
      afternoon: [
        { name: "Hotel check-out", type: "hotel", duration: "30 min" },
        { name: "Transfer to airport / station", type: "transport", duration: "1.5 hrs" },
      ],
    },
  ];

  for (let i = 0; i < totalDays; i++) {
    let dateStr = `Day ${i + 1}`;
    if (startDate) {
      const curDate = new Date(startDate);
      curDate.setDate(startDate.getDate() + i);
      dateStr = curDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    if (matchedSample && matchedSample.days[i]) {
      generatedDays.push({
        ...matchedSample.days[i],
        day: i + 1,
        date: dateStr,
      });
    } else {
      const tpl = activityTemplates[i % activityTemplates.length];
      generatedDays.push({
        day: i + 1,
        date: dateStr,
        title: `${tpl.title}`,
        blocks: [
          { time: "Morning", icon: "🌅", activities: tpl.morning },
          { time: "Afternoon", icon: "☀️", activities: tpl.afternoon },
          { time: "Evening", icon: "🌙", activities: tpl.evening },
        ],
      });
    }
  }

  return {
    destination: destName,
    tripDuration: `${totalDays} Day${totalDays > 1 ? "s" : ""}`,
    travellers: parseInt(travellers) || 1,
    days: generatedDays,
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

  const { previousTrips } = useSelector((state) => state.trips);
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.state?.generatedItinerary) {
      const genItinerary = location.state.generatedItinerary;
      setItinerary(genItinerary);
      setActiveTab("itinerary");
      setTripAdded(false);
      if (genItinerary.destination) {
        setSearch((prev) => ({ ...prev, destination: genItinerary.destination }));
      }
      setTimeout(() => {
        window.scrollTo({ top: 350, behavior: "smooth" });
      }, 100);
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.generatedItinerary) return;
    const destParam = searchParams.get("destination");
    if (destParam) {
      const destName = decodeURIComponent(destParam);
      setSearch((prev) => ({ ...prev, destination: destName }));
      const generated = generateItineraryForDates(
        destName,
        search.dateFrom,
        search.dateTo,
        search.travellers
      );
      setItinerary(generated);
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

    const generated = generateItineraryForDates(
      search.destination,
      search.dateFrom,
      search.dateTo,
      search.travellers
    );

    setItinerary(generated);
    setActiveTab("itinerary");
    setTripAdded(false);
  };

  const handleAddTrip = () => {
    if (!itinerary) return;
    const dest = itinerary.destination.toLowerCase();
    const dashboardData = generateDashboardData(dest, itinerary, search.dateFrom);
    const tripPayload = {
      from: search.from,
      destination: itinerary.destination,
      dateFrom: search.dateFrom || todayStr,
      dateTo: search.dateTo || todayStr,
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
              className="w-full lg:w-auto rounded-lg bg-indigo-500 px-8 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 transition cursor-pointer whitespace-nowrap"
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
              {!itinerary ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-6">🗺️</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Plan Your Trip
                  </h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Enter your destination, travel dates, and number of
                    travellers above to generate a day-by-day itinerary.
                  </p>
                </div>
              ) : (
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
                      disabled={tripAdded}
                      className={`shrink-0 rounded-lg px-6 py-2.5 text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                        tripAdded
                          ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-default"
                          : "bg-emerald-500 text-white hover:bg-emerald-400"
                      }`}
                    >
                      {tripAdded ? "✓ Added to My Trips" : "+ Add My Trip"}
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
                          {day.blocks.map((block) => (
                            <div key={block.time}>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">{block.icon}</span>
                                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                                  {block.time}
                                </h4>
                              </div>

                              <div className="space-y-2 ml-8">
                                {block.activities.map((activity, idx) => (
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
                                          typeStyles[activity.type]
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
              )}
            </>
          )}

          {/* Previous Trips Tab */}
          {activeTab === "previous" && (
            <>
              {previousTrips.length > 0 ? (
                <div className="space-y-6">
                  {previousTrips.map((trip) => (
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
                    No Previous Trips Yet
                  </h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Once you complete a trip with Horizon, it will appear here.
                    Start planning your first adventure above!
                  </p>
                </div>
              )}
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
