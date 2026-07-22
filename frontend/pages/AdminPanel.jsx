import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import api from "../src/store/api";

const TABS = [
  { id: "popular-dest", label: "Popular Destinations", icon: "🗺️" },
  { id: "ai-features", label: "AI Features", icon: "✨" },
  { id: "sample-itineraries", label: "Sample Itineraries", icon: "📝" },
  { id: "destination-data", label: "Destination Data", icon: "🌤️" },
  { id: "landing-features", label: "Landing Features", icon: "🧩" },
  { id: "landing-steps", label: "How It Works", icon: "📋" },
  { id: "landing-dest", label: "Landing Destinations", icon: "🌍" },
  { id: "ai-prompt", label: "AI Prompt", icon: "🤖" },
  { id: "ai-greeting", label: "AI Greeting", icon: "💬" },
  { id: "users", label: "Users", icon: "👥" },
];

function AdminPanel() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("popular-dest");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [popularDest, setPopularDest] = useState([]);
  const [aiFeatures, setAiFeatures] = useState([]);
  const [landingFeatures, setLandingFeatures] = useState([]);
  const [landingSteps, setLandingSteps] = useState([]);
  const [landingDest, setLandingDest] = useState([]);
  const [sampleItineraries, setSampleItineraries] = useState("{}");
  const [destinationData, setDestinationData] = useState("{}");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGreeting, setAiGreeting] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    loadAllContent();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAllContent = async () => {
    setLoading(true);
    try {
      const [destRes, aiFeatRes, lfRes, lsRes, ldRes, siRes, ddRes, promptRes, greetRes, usersRes] =
        await Promise.allSettled([
          api.get("/content/home.popularDestinations"),
          api.get("/content/home.aiFeatures"),
          api.get("/content/landing.features"),
          api.get("/content/landing.steps"),
          api.get("/content/landing.destinations"),
          api.get("/content/home.sampleItineraries"),
          api.get("/content/home.destinationData"),
          api.get("/content/ai.prompt"),
          api.get("/content/ai.greeting"),
          api.get("/auth/users"),
        ]);

      if (destRes.status === "fulfilled") setPopularDest(destRes.value.data.value || []);
      if (aiFeatRes.status === "fulfilled") setAiFeatures(aiFeatRes.value.data.value || []);
      if (lfRes.status === "fulfilled") setLandingFeatures(lfRes.value.data.value || []);
      if (lsRes.status === "fulfilled") setLandingSteps(lsRes.value.data.value || []);
      if (ldRes.status === "fulfilled") setLandingDest(ldRes.value.data.value || []);
      if (siRes.status === "fulfilled") setSampleItineraries(JSON.stringify(siRes.value.data.value || {}, null, 2));
      if (ddRes.status === "fulfilled") setDestinationData(JSON.stringify(ddRes.value.data.value || {}, null, 2));
      if (promptRes.status === "fulfilled") {
        const val = promptRes.value.data.value;
        setAiPrompt(typeof val === "string" ? val : val?.text || "");
      }
      if (greetRes.status === "fulfilled") {
        const val = greetRes.value.data.value;
        setAiGreeting(typeof val === "string" ? val : val?.text || "");
      }
      if (usersRes.status === "fulfilled") setUsers(usersRes.value.data || []);
    } catch {
      showToast("Failed to load content", "error");
    }
    setLoading(false);
  };

  const saveSection = async (section, value) => {
    setSaving(true);
    try {
      await api.put(`/content/${section}`, { value });
      showToast(`${section} saved successfully`);
    } catch {
      showToast(`Failed to save ${section}`, "error");
    }
    setSaving(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-900 px-6 py-8 lg:px-8 text-slate-100">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage site content, AI prompt, and users</p>
          </div>

          {toast && (
            <div
              className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${
                toast.type === "error"
                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                  : "bg-green-500/20 text-green-300 border border-green-500/30"
              }`}
            >
              {toast.msg}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:w-56 shrink-0">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-2 flex lg:flex-col gap-1 overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-indigo-500 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-300">Loading content...</p>
                </div>
              ) : (
                <>
                  {activeTab === "popular-dest" && (
                    <ArraySection
                      title="Popular Destinations"
                      description="Destination cards shown on the Home page"
                      items={popularDest}
                      setItems={setPopularDest}
                      onSave={() => saveSection("home.popularDestinations", popularDest)}
                      saving={saving}
                      fields={[
                        { key: "id", label: "ID", type: "text" },
                        { key: "name", label: "Name", type: "text" },
                        { key: "tagline", label: "Tagline", type: "text" },
                        { key: "badge", label: "Badge", type: "text" },
                        { key: "duration", label: "Duration", type: "text" },
                        { key: "icon", label: "Icon (emoji)", type: "text" },
                        { key: "gradient", label: "Gradient class", type: "text" },
                        { key: "highlights", label: "Highlights (comma-separated)", type: "csv" },
                      ]}
                    />
                  )}

                  {activeTab === "ai-features" && (
                    <ArraySection
                      title="AI Features"
                      description="Feature cards shown on the Home page AI section"
                      items={aiFeatures}
                      setItems={setAiFeatures}
                      onSave={() => saveSection("home.aiFeatures", aiFeatures)}
                      saving={saving}
                      fields={[
                        { key: "icon", label: "Icon (emoji)", type: "text" },
                        { key: "title", label: "Title", type: "text" },
                        { key: "description", label: "Description", type: "textarea" },
                      ]}
                    />
                  )}

                  {activeTab === "sample-itineraries" && (
                    <JsonSection
                      title="Sample Itineraries"
                      description="Pre-built day-by-day itineraries for popular destinations. Used when users select a destination from the Home page. Keys: paris, tokyo, bali, etc."
                      value={sampleItineraries}
                      setValue={setSampleItineraries}
                      onSave={() => {
                        try { saveSection("home.sampleItineraries", JSON.parse(sampleItineraries)); }
                        catch { showToast("Invalid JSON", "error"); }
                      }}
                      saving={saving}
                    />
                  )}

                  {activeTab === "destination-data" && (
                    <JsonSection
                      title="Destination Data"
                      description="Weather, attractions, packing lists, and transport data for each destination. Keys: paris, tokyo, bali, etc."
                      value={destinationData}
                      setValue={setDestinationData}
                      onSave={() => {
                        try { saveSection("home.destinationData", JSON.parse(destinationData)); }
                        catch { showToast("Invalid JSON", "error"); }
                      }}
                      saving={saving}
                    />
                  )}

                  {activeTab === "landing-features" && (
                    <ArraySection
                      title="Landing Features"
                      description="Feature cards on the public landing page"
                      items={landingFeatures}
                      setItems={setLandingFeatures}
                      onSave={() => saveSection("landing.features", landingFeatures)}
                      saving={saving}
                      fields={[
                        { key: "icon", label: "Icon (emoji)", type: "text" },
                        { key: "title", label: "Title", type: "text" },
                        { key: "description", label: "Description", type: "textarea" },
                      ]}
                    />
                  )}

                  {activeTab === "landing-steps" && (
                    <ArraySection
                      title="How It Works Steps"
                      description="Steps shown on the landing page"
                      items={landingSteps}
                      setItems={setLandingSteps}
                      onSave={() => saveSection("landing.steps", landingSteps)}
                      saving={saving}
                      fields={[
                        { key: "step", label: "Step #", type: "text" },
                        { key: "icon", label: "Icon (emoji)", type: "text" },
                        { key: "title", label: "Title", type: "text" },
                        { key: "description", label: "Description", type: "textarea" },
                      ]}
                    />
                  )}

                  {activeTab === "landing-dest" && (
                    <ArraySection
                      title="Landing Destinations"
                      description="Destination showcase on the public landing page"
                      items={landingDest}
                      setItems={setLandingDest}
                      onSave={() => saveSection("landing.destinations", landingDest)}
                      saving={saving}
                      fields={[
                        { key: "name", label: "Name", type: "text" },
                        { key: "type", label: "Type", type: "text" },
                        { key: "image", label: "Image URL", type: "text" },
                      ]}
                    />
                  )}

                  {activeTab === "ai-prompt" && (
                    <TextSection
                      title="AI System Prompt"
                      description="The system prompt that guides Gemini AI itinerary generation. Use {destination}, {days}, {budget} as placeholders."
                      value={aiPrompt}
                      setValue={setAiPrompt}
                      onSave={() => saveSection("ai.prompt", { text: aiPrompt })}
                      saving={saving}
                      multiline
                    />
                  )}

                  {activeTab === "ai-greeting" && (
                    <TextSection
                      title="AI Chat Greeting"
                      description="The default greeting message shown when the AI chat widget opens"
                      value={aiGreeting}
                      setValue={setAiGreeting}
                      onSave={() => saveSection("ai.greeting", { text: aiGreeting })}
                      saving={saving}
                    />
                  )}

                  {activeTab === "users" && (
                    <UsersSection users={users} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ArraySection({ title, description, items, setItems, onSave, saving, fields }) {
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState({});
  const [addMode, setAddMode] = useState(false);
  const [newItem, setNewItem] = useState({});

  const startEdit = (idx) => {
    setEditIdx(idx);
    const item = { ...items[idx] };
    fields.forEach((f) => {
      if (f.type === "csv" && Array.isArray(item[f.key])) {
        item[f.key] = item[f.key].join(", ");
      }
    });
    setEditData(item);
  };

  const saveEdit = () => {
    const updated = { ...editData };
    fields.forEach((f) => {
      if (f.type === "csv" && typeof updated[f.key] === "string") {
        updated[f.key] = updated[f.key].split(",").map((s) => s.trim()).filter(Boolean);
      }
    });
    const copy = [...items];
    copy[editIdx] = updated;
    setItems(copy);
    setEditIdx(null);
    setEditData({});
  };

  const deleteItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
    setEditIdx(null);
  };

  const addItem = () => {
    const item = { ...newItem };
    fields.forEach((f) => {
      if (f.type === "csv" && typeof item[f.key] === "string") {
        item[f.key] = item[f.key].split(",").map((s) => s.trim()).filter(Boolean);
      } else if (f.type === "csv") {
        item[f.key] = [];
      }
    });
    if (!item.id) item.id = `item-${Date.now()}`;
    setItems([...items, item]);
    setNewItem({});
    setAddMode(false);
  };

  const handleFieldChange = (key, value, isEdit) => {
    if (isEdit) {
      setEditData((prev) => ({ ...prev, [key]: value }));
    } else {
      setNewItem((prev) => ({ ...prev, [key]: value }));
    }
  };

  const renderForm = (data, onChange, isEdit) => (
    <div className="space-y-3">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="block text-xs text-slate-400 mb-1">{f.label}</label>
          {f.type === "textarea" ? (
            <textarea
              value={data[f.key] || ""}
              onChange={(e) => onChange(f.key, e.target.value, isEdit)}
              rows={3}
              className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          ) : (
            <input
              type="text"
              value={data[f.key] || ""}
              onChange={(e) => onChange(f.key, e.target.value, isEdit)}
              className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAddMode(!addMode)}
            className="px-3 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400 transition cursor-pointer"
          >
            + Add
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-400 transition cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {addMode && (
        <div className="mb-4 rounded-lg bg-slate-700/50 border border-slate-600 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">New Item</h3>
          {renderForm(newItem, handleFieldChange, false)}
          <div className="flex gap-2 mt-3">
            <button onClick={addItem} className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-400 cursor-pointer">Add</button>
            <button onClick={() => { setAddMode(false); setNewItem({}); }} className="px-3 py-1.5 rounded-lg bg-slate-600 text-slate-300 text-xs font-medium hover:text-white cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-6">No items yet. Click "+ Add" to create one.</p>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="rounded-lg bg-slate-700/50 border border-slate-600 p-4">
              {editIdx === idx ? (
                <>
                  {renderForm(editData, handleFieldChange, true)}
                  <div className="flex gap-2 mt-3">
                    <button onClick={saveEdit} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-400 cursor-pointer">Save</button>
                    <button onClick={() => setEditIdx(null)} className="px-3 py-1.5 rounded-lg bg-slate-600 text-slate-300 text-xs font-medium hover:text-white cursor-pointer">Cancel</button>
                  </div>
                </>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.icon && <span className="text-lg">{item.icon}</span>}
                      <span className="text-sm font-semibold text-white">{item.name || item.title || item.id || `Item ${idx + 1}`}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-500/20 text-indigo-300">{item.badge}</span>
                      )}
                      {item.duration && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-slate-600 text-slate-300">{item.duration}</span>
                      )}
                    </div>
                    {item.tagline && <p className="text-slate-400 text-xs mt-1">{item.tagline}</p>}
                    {item.description && <p className="text-slate-400 text-xs mt-1 line-clamp-2">{item.description}</p>}
                    {item.type && <p className="text-slate-400 text-xs mt-1">{item.type}</p>}
                    {item.step && <p className="text-slate-400 text-xs mt-1">Step {item.step}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => startEdit(idx)} className="px-2 py-1 rounded text-xs text-indigo-400 hover:text-indigo-300 hover:bg-slate-600 cursor-pointer">Edit</button>
                    <button onClick={() => deleteItem(idx)} className="px-2 py-1 rounded text-xs text-red-400 hover:text-red-300 hover:bg-slate-600 cursor-pointer">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function JsonSection({ title, description, value, setValue, onSave, saving }) {
  const [error, setError] = useState(null);

  const handleChange = (val) => {
    setValue(val);
    try {
      JSON.parse(val);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{description}</p>
        </div>
        <button
          onClick={onSave}
          disabled={saving || !!error}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-400 transition cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      {error && (
        <div className="mb-3 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400 font-mono">
          JSON Error: {error}
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        rows={30}
        spellCheck={false}
        className="w-full rounded-lg bg-slate-900 border border-slate-600 px-4 py-3 text-sm text-green-400 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
      />
    </div>
  );
}

function TextSection({ title, description, value, setValue, onSave, saving, multiline = false }) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{description}</p>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-400 transition cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={20}
          className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-3 text-sm text-white font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      )}
    </div>
  );
}

function UsersSection({ users }) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Users</h2>
        <p className="text-slate-400 text-sm mt-0.5">All registered users</p>
      </div>
      {users.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-6">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-3 text-slate-400 font-medium">Name</th>
                <th className="text-left py-3 px-3 text-slate-400 font-medium">Email</th>
                <th className="text-left py-3 px-3 text-slate-400 font-medium">Country</th>
                <th className="text-left py-3 px-3 text-slate-400 font-medium">Role</th>
                <th className="text-left py-3 px-3 text-slate-400 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id || u.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-3 text-white font-medium">{u.name}</td>
                  <td className="py-3 px-3 text-slate-300">{u.email}</td>
                  <td className="py-3 px-3 text-slate-300">{u.country}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.role === "admin"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-slate-600 text-slate-300"
                    }`}>
                      {u.role || "user"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-xs">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
