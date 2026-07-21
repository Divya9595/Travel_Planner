import { useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../src/components/Navbar";
import { deleteTripThunk, updateTripThunk } from "../src/store/slices/tripSlice";

const typeStyles = {
  sightseeing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  food: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  transport: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  hotel: "bg-green-500/15 text-green-400 border-green-500/30",
  activity: "bg-pink-500/15 text-pink-400 border-pink-500/30",
};

function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { previousTrips } = useSelector((state) => state.trips);
  const trip = previousTrips.find((t) => t._id === id);

  const [editingPackingIdx, setEditingPackingIdx] = useState(null);
  const [editingTodoIdx, setEditingTodoIdx] = useState(null);
  const [editingReminderIdx, setEditingReminderIdx] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editIcon, setEditIcon] = useState("");

  if (!trip) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 py-12">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Trip Not Found
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              This trip doesn't exist or has been removed.
            </p>
            <Link
              to="/dashboard"
              className="inline-block rounded-xl bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-400 transition-all hover:scale-105"
            >
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
    if (!trip.dateFrom) return 0;
    const now = new Date();
    const start = new Date(trip.dateFrom);
    const diff = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const packedCount = trip.packing?.filter((i) => i.packed).length || 0;
  const packingTotal = trip.packing?.length || 0;
  const todoDone = trip.todoList?.filter((i) => i.done).length || 0;
  const todoTotal = trip.todoList?.length || 0;

  const handleDelete = () => {
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
    if (field === "packing") {
      arr.push({ item: "New Item", icon: "📦", packed: false });
    } else if (field === "todoList") {
      arr.push({ task: "New Task", done: false });
    } else {
      arr.push({ text: "New Reminder", icon: "📌", urgent: false });
    }
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
    if (field === "packing") {
      arr[idx] = { ...arr[idx], packed: !arr[idx].packed };
    } else if (field === "todoList") {
      arr[idx] = { ...arr[idx], done: !arr[idx].done };
    }
    persist(field, arr);
  };

  const toggleUrgent = (idx) => {
    const arr = [...(trip.reminders || [])];
    arr[idx] = { ...arr[idx], urgent: !arr[idx].urgent };
    persist("reminders", arr);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-900 px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/dashboard"
              className="text-sm text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              ← Back to Dashboard
            </Link>
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition cursor-pointer"
            >
              Delete Trip
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">{trip.destination}</h1>
            <p className="text-slate-400 mt-1">
              {trip.dates} · {trip.travellers} traveller
              {trip.travellers > 1 ? "s" : ""}
              {trip.dateFrom && (
                <>
                  {" "} · Starts in{" "}
                  <span className="text-white font-semibold">
                    {daysLeft()} days
                  </span>
                </>
              )}
            </p>
          </div>

          {trip.weather && (
            <div className="rounded-2xl bg-slate-800 border border-slate-700/50 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🌤️</span>
                <h2 className="text-lg font-semibold text-white">Weather</h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{trip.weather.icon}</span>
                  <div>
                    <p className="text-3xl font-bold text-white">{trip.weather.temp}°C</p>
                    <p className="text-slate-400 text-sm">{trip.weather.condition}</p>
                  </div>
                </div>
                <div className="flex gap-6 text-sm sm:ml-auto">
                  <div>
                    <p className="text-slate-500">Humidity</p>
                    <p className="text-white font-medium">{trip.weather.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Wind</p>
                    <p className="text-white font-medium">{trip.weather.wind} km/h</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {trip.attractions?.length > 0 && (
            <div className="rounded-2xl bg-slate-800 border border-slate-700/50 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📍</span>
                <h2 className="text-lg font-semibold text-white">Famous Attractions</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trip.attractions.map((a, idx) => (
                  <span key={idx} className="rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 px-4 py-1.5 text-sm font-medium">{a}</span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* What to Pack */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {trip.transport && (
              <div className="rounded-2xl bg-slate-800 border border-slate-700/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">{trip.transport.type === "flight" ? "✈️" : "🚆"}</span>
                  <h2 className="text-lg font-semibold text-white">{trip.transport.type === "flight" ? "Flight Details" : "Train Details"}</h2>
                </div>
                <div className="space-y-3">
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
                  <div className="flex items-center gap-4 text-sm text-slate-400 pt-2 border-t border-slate-700/50">
                    <span>{trip.transport.departDate}</span>
                    <span>·</span>
                    <span>{trip.transport.terminal}</span>
                    <span>·</span>
                    <span>Gate {trip.transport.gate}</span>
                  </div>
                </div>
              </div>
            )}

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

          {trip.itinerary?.days?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-lg">🗓️</span>
                <h2 className="text-lg font-semibold text-white">Day-by-Day Itinerary</h2>
              </div>
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
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${typeStyles[activity.type]}`}>{activity.type}</span>
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TripDetails;
