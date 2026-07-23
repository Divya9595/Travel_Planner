import { useState, useCallback, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../src/components/Navbar";
import { deleteTripThunk, updateTripThunk } from "../src/store/slices/tripSlice";
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

const TABS = [
  { id: "itinerary", label: "Itinerary", icon: "🗺️" },
  { id: "preparation", label: "Preparation", icon: "🎒" },
  { id: "documents", label: "Flight Details", icon: "✈️" },
];

function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { previousTrips } = useSelector((state) => state.trips);
  const trip = previousTrips.find((t) => t._id === id);

  const [activeTab, setActiveTab] = useState("itinerary");
  const [editingPackingIdx, setEditingPackingIdx] = useState(null);
  const [editingTodoIdx, setEditingTodoIdx] = useState(null);
  const [editingReminderIdx, setEditingReminderIdx] = useState(null);
  const [editingTransport, setEditingTransport] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [transportForm, setTransportForm] = useState({});
  const [liveWeather, setLiveWeather] = useState(null);

  useEffect(() => {
    if (!trip?.destination) return;
    let cancelled = false;
    api.get(`/weather/${encodeURIComponent(trip.destination)}`)
      .then((res) => {
        if (!cancelled) setLiveWeather(res.data.weather);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [trip?.destination]);

  if (!trip) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 py-12">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-3xl font-bold text-white mb-3">Trip Not Found</h2>
            <p className="text-slate-400 text-lg mb-8">This trip doesn't exist or has been removed.</p>
            <Link to="/dashboard" className="inline-block rounded-xl bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-400 transition-all hover:scale-105">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </>
    );
  }

  const persist = useCallback(
    (field, value) => {
      dispatch(updateTripThunk({ tripId: trip._id, updates: { [field]: value } }));
    },
    [dispatch, trip?._id]
  );

  const daysLeft = () => {
    const dateStr = trip.transport?.departDate || trip.dateFrom;
    if (!dateStr) return null;
    const start = new Date(dateStr);
    if (isNaN(start.getTime())) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    return Math.ceil((start - now) / (1000 * 60 * 60 * 24));
  };

  const packedCount = trip.packing?.filter((i) => i.packed).length || 0;
  const packingTotal = trip.packing?.length || 0;
  const todoDone = trip.todoList?.filter((i) => i.done).length || 0;
  const todoTotal = trip.todoList?.length || 0;

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this trip? This cannot be undone.")) return;
    dispatch(deleteTripThunk(trip._id));
    navigate("/dashboard");
  };

  const startEdit = (field, idx, currentValue, currentIcon) => {
    if (field === "packing") setEditingPackingIdx(idx);
    else if (field === "todoList") setEditingTodoIdx(idx);
    else setEditingReminderIdx(idx);
    setEditValue(currentValue);
    setEditIcon(currentIcon || "");
  };

  const cancelEdit = (field) => {
    if (field === "packing") setEditingPackingIdx(null);
    else if (field === "todoList") setEditingTodoIdx(null);
    else setEditingReminderIdx(null);
    setEditValue("");
    setEditIcon("");
  };

  const saveEdit = (field, idx) => {
    if (!editValue.trim()) return;
    const arr = [...(trip[field] || [])];
    if (field === "packing") {
      arr[idx] = { ...arr[idx], item: editValue.trim(), icon: editIcon || arr[idx].icon };
    } else if (field === "todoList") {
      arr[idx] = { ...arr[idx], task: editValue.trim() };
    } else {
      arr[idx] = { ...arr[idx], text: editValue.trim(), icon: editIcon || arr[idx].icon };
    }
    persist(field, arr);
    cancelEdit(field);
  };

  const addItem = (field) => {
    const arr = [...(trip[field] || [])];
    if (field === "packing") arr.push({ item: "New Item", icon: "📦", packed: false });
    else if (field === "todoList") arr.push({ task: "New Task", done: false });
    else arr.push({ text: "New Reminder", icon: "📌", urgent: false });
    persist(field, arr);
  };

  const deleteItem = (field, idx) => {
    const arr = [...(trip[field] || [])];
    arr.splice(idx, 1);
    persist(field, arr);
    cancelEdit(field);
  };

  const toggleItem = (field, idx) => {
    const arr = [...(trip[field] || [])];
    if (field === "packing") arr[idx] = { ...arr[idx], packed: !arr[idx].packed };
    else if (field === "todoList") arr[idx] = { ...arr[idx], done: !arr[idx].done };
    persist(field, arr);
  };

  const toggleUrgent = (idx) => {
    const arr = [...(trip.reminders || [])];
    arr[idx] = { ...arr[idx], urgent: !arr[idx].urgent };
    persist("reminders", arr);
  };

  const googleFlightsUrl = () => {
    const dest = trip.transport?.to || "destination";
    return `https://www.google.com/travel/flights?q=Flights+to+${encodeURIComponent(dest)}`;
  };

  const startEditTransport = () => {
    setTransportForm({
      type: trip.transport?.type || "flight",
      carrier: trip.transport?.carrier || "",
      flightNo: trip.transport?.flightNo || "",
      from: trip.transport?.from || "",
      to: trip.transport?.to || "",
      departDate: trip.transport?.departDate || "",
      departTime: trip.transport?.departTime || "",
      arriveTime: trip.transport?.arriveTime || "",
      terminal: trip.transport?.terminal || "",
      seat: trip.transport?.seat || "",
      gate: trip.transport?.gate || "",
    });
    setEditingTransport(true);
  };

  const saveTransport = () => {
    persist("transport", transportForm);
    setEditingTransport(false);
  };

  const handleTransportChange = (e) => {
    setTransportForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-900 px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/dashboard" className="text-sm text-slate-400 hover:text-white transition flex items-center gap-1">
              ← Back to Dashboard
            </Link>
            <button onClick={handleDelete} className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition cursor-pointer">
              Delete Trip
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">{trip.destination}</h1>
            <p className="text-slate-400 mt-1">
              {trip.dates} · {trip.travellers} traveller{trip.travellers > 1 ? "s" : ""}
              {daysLeft() !== null && daysLeft() >= 0 && <> · Starts in <span className="text-white font-semibold">{daysLeft()} days</span></>}
              {daysLeft() !== null && daysLeft() < 0 && <> · <span className="text-green-400 font-semibold">Departed</span></>}
            </p>
          </div>

          {/* Weather & Attractions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {(trip.weatherLocation || liveWeather || trip.weather) ? (
              <div className="rounded-2xl bg-slate-800 border border-slate-700/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🌤️</span>
                  <h2 className="text-sm font-semibold text-white">Weather — {trip.destination}</h2>
                </div>
                {(liveWeather || trip.weather) ? (
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{(liveWeather || trip.weather).icon}</span>
                    <div>
                      <p className="text-2xl font-bold text-white">{(liveWeather || trip.weather).temp}°C</p>
                      <p className="text-slate-400 text-xs">{(liveWeather || trip.weather).condition}</p>
                    </div>
                    <div className="flex gap-4 text-xs sm:ml-auto">
                      <div><p className="text-slate-500">Humidity</p><p className="text-white font-medium">{(liveWeather || trip.weather).humidity}%</p></div>
                      <div><p className="text-slate-500">Wind</p><p className="text-white font-medium">{(liveWeather || trip.weather).wind} km/h</p></div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-slate-700" />
                    <div className="space-y-2">
                      <div className="h-6 w-16 rounded bg-slate-700" />
                      <div className="h-3 w-24 rounded bg-slate-700" />
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {(() => {
              const itineraryPlaces = (trip.itinerary?.days || []).flatMap((d) =>
                (d.blocks || []).flatMap((b) =>
                  (b.activities || []).filter((a) => a.type === "sightseeing").map((a) => a.name)
                )
              );
              const unique = [...new Set(itineraryPlaces)];
              const top = unique.length > 0 ? unique.slice(0, 7) : (trip.attractions || []).slice(0, 7);
              if (top.length === 0) return null;
              return (
                <div className="rounded-2xl bg-slate-800 border border-slate-700/50 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📍</span>
                    <h2 className="text-sm font-semibold text-white">Sightseeing Attractions</h2>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {top.map((a, idx) => (
                      <span key={idx} className="rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 px-3 py-1 text-xs font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mb-8 border-b border-slate-700">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition cursor-pointer border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-slate-400 hover:text-white hover:border-slate-600"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}

          {/* === ITINERARY TAB === */}
          {activeTab === "itinerary" && (
            <>
              {trip.itinerary?.days?.length > 0 ? (
                <div className="space-y-8">
                  {trip.itinerary.days.map((day) => (
                    <div key={day.day} className="rounded-2xl bg-slate-800 border border-slate-700/50 overflow-hidden">
                      <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500 text-white text-sm font-bold">{day.day}</div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{day.title}</h3>
                            <p className="text-slate-400 text-sm">Day {day.day} · {day.date}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 space-y-6">
                        {day.blocks.map((block) => (
                          <div key={block.time}>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-lg">{block.icon}</span>
                              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{block.time}</h4>
                            </div>
                            <div className="space-y-2 ml-8">
                              {block.activities.map((activity, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                                  <div className="flex-1 flex items-center gap-2">
                                    <span className="text-white text-sm">{activity.name}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${typeStyles[activity.type] || "bg-slate-500/15 text-slate-400 border-slate-500/30"}`}>{activity.type}</span>
                                  </div>
                                  <span className="text-slate-500 text-xs whitespace-nowrap">{activity.duration}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-12 text-center">
                  <div className="text-4xl mb-3">🗓️</div>
                  <h3 className="text-lg font-semibold text-white mb-1">No itinerary yet</h3>
                  <p className="text-slate-400 text-sm">Generate an itinerary from the Trips page to see it here.</p>
                </div>
              )}
            </>
          )}

          {/* === PREPARATION TAB === */}
          {activeTab === "preparation" && (
            <div className="space-y-6">

              {/* Packing List + To-Do List — 2 columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Packing List */}
                <div className="rounded-2xl bg-slate-800 border border-slate-700/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎒</span>
                      <h2 className="text-lg font-semibold text-white">What to Pack</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{packedCount}/{packingTotal} packed</span>
                      <button onClick={() => addItem("packing")} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium cursor-pointer">+ Add</button>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5 mb-4">
                    <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${packingTotal ? (packedCount / packingTotal) * 100 : 0}%` }} />
                  </div>
                  <div className="space-y-2">
                    {(trip.packing || []).map((item, idx) => (
                      <div key={idx} className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition">
                        {editingPackingIdx === idx ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input value={editIcon} onChange={(e) => setEditIcon(e.target.value)} className="w-10 rounded bg-slate-700 border border-slate-600 px-2 py-1 text-sm text-white text-center" placeholder="📦" />
                            <input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="flex-1 rounded bg-slate-700 border border-slate-600 px-2 py-1 text-sm text-white" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveEdit("packing", idx); if (e.key === "Escape") cancelEdit("packing"); }} />
                            <button onClick={() => saveEdit("packing", idx)} className="text-green-400 hover:text-green-300 text-xs font-semibold cursor-pointer">Save</button>
                            <button onClick={() => deleteItem("packing", idx)} className="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer">Del</button>
                            <button onClick={() => cancelEdit("packing")} className="text-slate-400 hover:text-white text-xs cursor-pointer">X</button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => toggleItem("packing", idx)} className="flex items-center gap-3 flex-1 text-left cursor-pointer">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition ${item.packed ? "bg-indigo-500 border-indigo-500" : "border-slate-600"}`}>
                                {item.packed && <span className="text-white text-xs">✓</span>}
                              </div>
                              <span className="text-base mr-1">{item.icon}</span>
                              <span className={`text-sm transition ${item.packed ? "text-slate-500 line-through" : "text-white"}`}>{item.item}</span>
                            </button>
                            <button onClick={() => startEdit("packing", idx, item.item, item.icon)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white text-xs cursor-pointer transition">Edit</button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* To-Do List */}
                <div className="rounded-2xl bg-slate-800 border border-slate-700/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">✅</span>
                      <h2 className="text-lg font-semibold text-white">To-Do List</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{todoDone}/{todoTotal} done</span>
                      <button onClick={() => addItem("todoList")} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium cursor-pointer">+ Add</button>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5 mb-4">
                    <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${todoTotal ? (todoDone / todoTotal) * 100 : 0}%` }} />
                  </div>
                  <div className="space-y-2">
                    {(trip.todoList || []).map((item, idx) => (
                      <div key={idx} className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition">
                        {editingTodoIdx === idx ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="flex-1 rounded bg-slate-700 border border-slate-600 px-2 py-1 text-sm text-white" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveEdit("todoList", idx); if (e.key === "Escape") cancelEdit("todoList"); }} />
                            <button onClick={() => saveEdit("todoList", idx)} className="text-green-400 hover:text-green-300 text-xs font-semibold cursor-pointer">Save</button>
                            <button onClick={() => deleteItem("todoList", idx)} className="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer">Del</button>
                            <button onClick={() => cancelEdit("todoList")} className="text-slate-400 hover:text-white text-xs cursor-pointer">X</button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => toggleItem("todoList", idx)} className="flex items-center gap-3 flex-1 text-left cursor-pointer">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition ${item.done ? "bg-green-500 border-green-500" : "border-slate-600"}`}>
                                {item.done && <span className="text-white text-xs">✓</span>}
                              </div>
                              <span className={`text-sm transition ${item.done ? "text-slate-500 line-through" : "text-white"}`}>{item.task}</span>
                            </button>
                            <button onClick={() => startEdit("todoList", idx, item.task)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white text-xs cursor-pointer transition">Edit</button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Reminders */}
              <div className="rounded-2xl bg-slate-800 border border-slate-700/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔔</span>
                    <h2 className="text-lg font-semibold text-white">Reminders</h2>
                  </div>
                  <button onClick={() => addItem("reminders")} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium cursor-pointer">+ Add</button>
                </div>
                <div className="space-y-3">
                  {(trip.reminders || []).map((item, idx) => (
                    <div key={idx} className="group flex items-start gap-3 px-3 py-2.5 rounded-lg border bg-slate-700/30 border-slate-700/50">
                      {editingReminderIdx === idx ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input value={editIcon} onChange={(e) => setEditIcon(e.target.value)} className="w-10 rounded bg-slate-700 border border-slate-600 px-2 py-1 text-sm text-white text-center" placeholder="📌" />
                          <input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="flex-1 rounded bg-slate-700 border border-slate-600 px-2 py-1 text-sm text-white" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveEdit("reminders", idx); if (e.key === "Escape") cancelEdit("reminders"); }} />
                          <button onClick={() => saveEdit("reminders", idx)} className="text-green-400 hover:text-green-300 text-xs font-semibold cursor-pointer">Save</button>
                          <button onClick={() => deleteItem("reminders", idx)} className="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer">Del</button>
                          <button onClick={() => cancelEdit("reminders")} className="text-slate-400 hover:text-white text-xs cursor-pointer">X</button>
                        </div>
                      ) : (
                        <>
                          <span className="text-base mt-0.5">{item.icon}</span>
                          <span className="text-sm text-slate-300 flex-1">{item.text}</span>
                          <button onClick={() => toggleUrgent(idx)} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border cursor-pointer ${item.urgent ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-slate-600/30 text-slate-400 border-slate-600/50"}`}>
                            {item.urgent ? "Urgent" : "Normal"}
                          </button>
                          <button onClick={() => startEdit("reminders", idx, item.text, item.icon)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white text-xs cursor-pointer transition">Edit</button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === TRAVEL DOCUMENTS TAB === */}
          {activeTab === "documents" && (
            <div className="rounded-2xl bg-slate-800 border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{trip.transport?.type === "flight" ? "✈️" : "🚆"}</span>
                  <h2 className="text-lg font-semibold text-white">{trip.transport?.type === "flight" ? "Flight Details" : "Train Details"}</h2>
                </div>
                <div className="flex items-center gap-2">
                  {trip.transport && (
                    <a href={googleFlightsUrl()} target="_blank" rel="noopener noreferrer" className="text-xs bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 px-2.5 py-1 rounded-full border border-indigo-500/30 transition font-medium">
                      Google Flights ↗
                    </a>
                  )}
                  <button onClick={startEditTransport} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium cursor-pointer">
                    {trip.transport ? "Edit" : "+ Add"}
                  </button>
                </div>
              </div>

              {editingTransport ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Type</label>
                      <select name="type" value={transportForm.type} onChange={handleTransportChange} className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white">
                        <option value="flight">Flight ✈️</option>
                        <option value="train">Train 🚆</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Carrier</label>
                      <input name="carrier" value={transportForm.carrier} onChange={handleTransportChange} placeholder="e.g. Air France" className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white placeholder-slate-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Flight/Train No.</label>
                      <input name="flightNo" value={transportForm.flightNo} onChange={handleTransportChange} placeholder="e.g. AF 101" className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white placeholder-slate-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Seat</label>
                      <input name="seat" value={transportForm.seat} onChange={handleTransportChange} placeholder="e.g. 22A" className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white placeholder-slate-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Departure City</label>
                      <input name="from" value={transportForm.from} onChange={handleTransportChange} placeholder="e.g. New York (JFK)" className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white placeholder-slate-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Arrival City</label>
                      <input name="to" value={transportForm.to} onChange={handleTransportChange} placeholder="e.g. Paris (CDG)" className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white placeholder-slate-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Depart Date</label>
                      <input name="departDate" value={transportForm.departDate} onChange={handleTransportChange} placeholder="e.g. Jul 20, 2026" className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white placeholder-slate-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Depart Time</label>
                      <input name="departTime" value={transportForm.departTime} onChange={handleTransportChange} placeholder="e.g. 18:00" className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white placeholder-slate-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Arrive Time</label>
                      <input name="arriveTime" value={transportForm.arriveTime} onChange={handleTransportChange} placeholder="e.g. 07:00" className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white placeholder-slate-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Terminal</label>
                      <input name="terminal" value={transportForm.terminal} onChange={handleTransportChange} placeholder="e.g. Terminal 1" className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white placeholder-slate-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Gate</label>
                      <input name="gate" value={transportForm.gate} onChange={handleTransportChange} placeholder="e.g. C14" className="w-full rounded bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white placeholder-slate-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button onClick={saveTransport} className="rounded bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-400 transition cursor-pointer">Save</button>
                    <button onClick={() => setEditingTransport(false)} className="rounded bg-slate-700 px-4 py-2 text-sm text-slate-300 hover:text-white transition cursor-pointer">Cancel</button>
                  </div>
                </div>
              ) : trip.transport ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-lg">{trip.transport.carrier} {trip.transport.flightNo}</span>
                    <span className="text-slate-400 text-sm">{trip.transport.seat}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white font-semibold">{trip.transport.departTime}</p>
                      <p className="text-slate-400 text-xs">{trip.transport.from}</p>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="h-px flex-1 bg-slate-600" />
                      <span className="text-slate-500 text-xs">{trip.transport.type === "flight" ? "✈" : "🚆"}</span>
                      <div className="h-px flex-1 bg-slate-600" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{trip.transport.arriveTime}</p>
                      <p className="text-slate-400 text-xs">{trip.transport.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400 pt-3 border-t border-slate-700/50">
                    <span>{trip.transport.departDate}</span>
                    <span>·</span>
                    <span>{trip.transport.terminal}</span>
                    <span>·</span>
                    <span>Gate {trip.transport.gate}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✈️</div>
                  <p className="text-slate-500 text-sm">No flight details added yet. Click "+ Add" above.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default TripDetails;
