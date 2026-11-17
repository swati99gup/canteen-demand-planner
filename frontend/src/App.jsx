import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';
import { 
  AlertTriangle, Clock, TrendingUp, Sparkles, 
  ShoppingBag, ThumbsUp, Utensils, Plus, Minus, 
  RotateCcw, Store, UserCheck, CheckCircle2, Send
} from 'lucide-react';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const QUICK_DISHES = [
  { name: "Egg Fried Rice", emoji: "🍚", price: "₹90", desc: "Double egg, basmati rice wok-tossed" },
  { name: "Veg Chowmein", emoji: "🥢", price: "₹70", desc: "Crisp shredded vegetables & soy" },
  { name: "Egg Chowmein", emoji: "🍳", price: "₹90", desc: "Double egg with Hakka noodles" },
  { name: "Double Egg Omelette", emoji: "🥚", price: "₹25", desc: "Fluffy 2-egg pan omelette" },
  { name: "Veg Maggi", emoji: "🍜", price: "₹35", desc: "Hot masala Maggi with veggies" },
  { name: "Veg Fried Rice", emoji: "🥗", price: "₹70", desc: "Fresh wok-fried seasoned rice" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("vendor"); // 'vendor' (Manoj Bhaiya) or 'customer' (Student)
  const [selectedDay, setSelectedDay] = useState("Saturday");
  const [prediction, setPrediction] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [aiBriefing, setAiBriefing] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [backendError, setBackendError] = useState(null);
  const [reactions, setReactions] = useState({ day: "Saturday", total_reactions: 0, breakdown: [] });
  const [deliveryToast, setDeliveryToast] = useState(null);

  // Fetch prediction whenever day changes
  useEffect(() => {
    fetch(`http://localhost:5000/api/predict?day=${selectedDay}`)
      .then(res => {
        if (!res.ok) throw new Error("Could not connect to backend API");
        return res.json();
      })
      .then(data => {
        setPrediction(data);
        setAiBriefing("");
        setBackendError(null);
      })
      .catch(err => {
        console.error(err);
        setBackendError(err.message);
      });
  }, [selectedDay]);

  // Fetch historical analytics once for Recharts
  useEffect(() => {
    fetch('http://localhost:5000/api/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error("Error fetching analytics:", err));
  }, []);

  // Fetch day-specific student reactions
  const fetchReactions = (dayToFetch) => {
    fetch(`http://localhost:5000/api/reactions?day=${dayToFetch}`)
      .then(res => res.json())
      .then(data => setReactions(data))
      .catch(err => console.error("Error fetching reactions:", err));
  };

  useEffect(() => {
    fetchReactions(selectedDay);
  }, [selectedDay]);

  // Add (+1) Reaction for the selected day
  const handleAddReaction = async (dishName) => {
    try {
      const res = await fetch('http://localhost:5000/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day_of_week: selectedDay, dish_name: dishName })
      });
      const data = await res.json();
      setReactions(data);
      showToast(`Delivered to Manoj Bhaiya's counter: +1 ${dishName}!`);
    } catch (e) {
      console.error("Add reaction error:", e);
    }
  };

  // Remove (-1) Reaction for the selected day
  const handleRemoveReaction = async (dishName) => {
    try {
      const res = await fetch('http://localhost:5000/api/reactions/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day_of_week: selectedDay, dish_name: dishName })
      });
      const data = await res.json();
      setReactions(data);
      showToast(`Updated: -1 ${dishName} removed.`);
    } catch (e) {
      console.error("Remove reaction error:", e);
    }
  };

  // Reset all reactions for the selected day
  const handleResetReactions = async () => {
    if (!window.confirm(`Reset all craving reactions for ${selectedDay}?`)) return;
    try {
      const res = await fetch('http://localhost:5000/api/reactions/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day_of_week: selectedDay })
      });
      const data = await res.json();
      setReactions(data);
      showToast(`All reactions for ${selectedDay} cleared.`);
    } catch (e) {
      console.error("Reset error:", e);
    }
  };

  const showToast = (msg) => {
    setDeliveryToast(msg);
    setTimeout(() => setDeliveryToast(null), 3000);
  };

  const handleGenerateAiBriefing = async () => {
    if (!prediction) return;
    setLoadingAi(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prediction)
      });
      const data = await res.json();
      setAiBriefing(data.briefing);
    } catch (e) {
      setAiBriefing("Operational note: Prioritize Fried Rice & Chowmein batches before 8:30 PM.");
    } finally {
      setLoadingAi(false);
    }
  };

  const getDishCount = (dishName) => {
    const item = reactions.breakdown?.find(b => b.dish_name.toLowerCase() === dishName.toLowerCase());
    return item ? item.vote_count : 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Main Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
            {/* Logo & Institute */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-xl shadow-xs">
                <Store size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-base">NIT Jamshedpur Canteen Portal</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Hostels A-D, RLB, AHR
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {activeTab === 'vendor' ? "👨‍🍳 Manoj Bhaiya's Canteen Decision Center" : "🎓 Student Night Canteen Craving Hub"}
                </div>
              </div>
            </div>

            {/* View Switcher Tabs & Day Selector */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {/* Day Selector */}
              <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-600">Day:</span>
                <select 
                  value={selectedDay} 
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer"
                >
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Tab Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setActiveTab("vendor")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                    activeTab === "vendor"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Store size={14} />
                  <span>Canteen Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab("customer")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition relative ${
                    activeTab === "customer"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <UserCheck size={14} />
                  <span>Student Portal</span>
                  {reactions.total_reactions > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                      {reactions.total_reactions}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating Delivery Toast */}
      {deliveryToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-bounce">
          <Send size={14} className="text-emerald-400" />
          <span>{deliveryToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {backendError && (
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-amber-900 text-sm flex items-center gap-3">
            <AlertTriangle className="text-amber-600 flex-shrink-0" />
            <div>
              <strong>Backend connection pending:</strong> Make sure the Express server is running on <code>http://localhost:5000</code>.
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PAGE 1: 🎓 CUSTOMER / STUDENT REACTION PAGE                   */}
        {/* ============================================================ */}
        {activeTab === "customer" && (
          <div className="space-y-6">
            {/* Student Welcome Card */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white p-6 sm:p-8 rounded-3xl shadow-sm">
              <div className="max-w-2xl">
                <span className="bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                  Hostel Student Dining Pre-Check
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-3">
                  Skipping the Mess Tonight?
                </h2>
                <p className="text-blue-100 text-sm mt-2 leading-relaxed">
                  Tap your planned dinner below. Your cravings are delivered directly to <strong>Manoj Bhaiya's canteen prep screen</strong> so he buys enough ingredients and stays open late for you!
                </p>

                {prediction && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20 text-xs">
                    <span>Hostel Mess Tonight ({selectedDay}):</span>
                    <strong className="underline underline-offset-2">{prediction.mess_dish}</strong>
                    <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">
                      Rating: {prediction.rating} / 5.0
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Live Student Peer Pulse */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>
                  <strong>{reactions.total_reactions} students</strong> from Hostels A, B, C, D have delivered reactions for <strong>{selectedDay}</strong>.
                </span>
              </div>
              <button
                onClick={() => setActiveTab("vendor")}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                View Manoj Bhaiya's Kitchen View →
              </button>
            </div>

            {/* Student Dish Menu Cards with 1-Click Tap Controls */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Utensils size={18} className="text-blue-600" />
                Tap to Add or Remove What You Want to Eat Tonight ({selectedDay}):
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {QUICK_DISHES.map((dish) => {
                  const count = getDishCount(dish.name);
                  return (
                    <div 
                      key={dish.name}
                      className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                        count > 0 
                          ? 'bg-blue-50/60 border-blue-300 shadow-sm' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl p-2 bg-slate-50 rounded-xl border border-slate-100">{dish.emoji}</span>
                          <span className="font-extrabold text-blue-700 text-sm bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                            {dish.price}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-base mt-3">{dish.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{dish.desc}</p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">
                          Your Planned Quantity:
                        </span>

                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                          <button
                            onClick={() => handleRemoveReaction(dish.name)}
                            disabled={count <= 0}
                            title="Decrease quantity"
                            className="p-1 text-slate-600 hover:text-rose-600 hover:bg-white rounded-lg disabled:opacity-30 transition"
                          >
                            <Minus size={14} />
                          </button>
                          
                          <span className="px-2 font-black text-sm text-slate-900 min-w-5 text-center">
                            {count}
                          </span>

                          <button
                            onClick={() => handleAddReaction(dish.name)}
                            title="Deliver order intention to canteen"
                            className="p-1 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-2xs transition active:scale-95"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PAGE 2: 👨‍🍳 MANOJ BHAIYA'S CANTEEN OPERATIONAL DASHBOARD     */}
        {/* ============================================================ */}
        {activeTab === "vendor" && prediction && (
          <div className="space-y-8">
            {/* Top Cards: Status & Procurement */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Shift Outlook */}
              <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
                prediction.status === "SURGE" 
                  ? 'bg-rose-50/70 border-rose-200' 
                  : prediction.status === "LOW"
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-blue-50/70 border-blue-200'
              }`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      prediction.status === "SURGE" 
                        ? 'bg-rose-600 text-white' 
                        : prediction.status === "LOW"
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {prediction.status} DEMAND FORECAST
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Multiplier: {prediction.multiplier}x
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mt-4">
                    {prediction.mess_dish}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                    <span>Student Satisfaction Rating:</span>
                    <strong className="text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {prediction.rating} / 5.0
                    </strong>
                  </div>

                  <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                    {prediction.alert_message}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 font-medium text-slate-600">
                    <Clock size={16} /> Recommended Close:
                  </span>
                  <span className="font-extrabold text-slate-900 text-base">
                    {prediction.recommended_closing_time}
                  </span>
                </div>
              </div>

              {/* Card 2: Batch Prep Recommendations */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <ShoppingBag size={20} className="text-blue-600" />
                      Kitchen Batch Prep Targets (Before 8:00 PM)
                    </h3>
                    <span className="text-xs text-slate-500">
                      Rates from NITJSR Notice Ref: 253/2026
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Boiled Rice (Pre-Cooked)
                      </div>
                      <div className="text-3xl font-black text-slate-900 mt-2">
                        {prediction.prep.rice_kg} <span className="text-sm font-semibold text-slate-500">kg</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        For Veg & Egg Fried Rice
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Chowmein Packets
                      </div>
                      <div className="text-3xl font-black text-slate-900 mt-2">
                        {prediction.prep.noodle_packs} <span className="text-sm font-semibold text-slate-500">packs</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Pre-boiled & oil-coated
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Egg Inventory
                      </div>
                      <div className="text-3xl font-black text-slate-900 mt-2">
                        {prediction.prep.egg_trays} <span className="text-sm font-semibold text-slate-500">trays</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        (~{prediction.prep.total_eggs_needed} eggs)
                      </div>
                    </div>
                  </div>
                </div>

                {/* SQL Historical Summary Strip */}
                <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 text-center text-sm">
                  <div>
                    <span className="text-slate-400 text-xs block">SQL Sample Count</span>
                    <strong className="text-slate-800">{prediction.sql_metrics.sample_count} shifts recorded</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Historical Avg Sales</span>
                    <strong className="text-slate-800">₹{prediction.sql_metrics.historical_avg_revenue.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Historical Stockout Rate</span>
                    <strong className={prediction.sql_metrics.stockout_rate_pct > 0 ? "text-rose-600" : "text-emerald-600"}>
                      {prediction.sql_metrics.stockout_rate_pct}% of shifts
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE CUSTOMER REACTIONS DELIVERED TO CANTEEN */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="bg-amber-500 p-2 rounded-lg text-white">
                    <ThumbsUp size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Live Customer Demand (Delivered from Student Portal)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time order intentions submitted by students for <strong>{selectedDay}</strong>.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <div className="text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-full">
                    {selectedDay} Customer Pledges: <strong className="text-blue-900 text-sm ml-1">{reactions.total_reactions}</strong>
                  </div>
                  <button 
                    onClick={handleResetReactions}
                    title="Clear all reactions for this day"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <RotateCcw size={15} />
                  </button>
                </div>
              </div>

              {/* Tally Breakdown for Kitchen Crew */}
              <div className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {QUICK_DISHES.map((dish) => {
                    const count = getDishCount(dish.name);
                    return (
                      <div 
                        key={dish.name}
                        className={`p-3 rounded-xl border text-center transition ${
                          count > 0 
                            ? 'bg-blue-50/80 border-blue-200' 
                            : 'bg-slate-50/70 border-slate-100 opacity-60'
                        }`}
                      >
                        <span className="text-xl block">{dish.emoji}</span>
                        <span className="text-xs font-bold text-slate-800 block mt-1 truncate">{dish.name}</span>
                        <span className="text-lg font-black text-blue-700 block mt-0.5">{count}</span>
                        <span className="text-[10px] text-slate-400">orders</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI Operational Briefing (Gemini API Integration) */}
            <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-slate-50 border border-indigo-200 p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="bg-indigo-600 p-2 rounded-lg text-white">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      AI Shift Briefing for Manoj Bhaiya (Gemini API)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Synthesizes SQL aggregations, student menu ratings, and closing recommendations.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleGenerateAiBriefing}
                  disabled={loadingAi}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition shadow-sm disabled:opacity-50"
                >
                  {loadingAi ? "Generating..." : "Generate Shift Briefing"}
                </button>
              </div>

              {aiBriefing && (
                <div className="mt-4 p-4 bg-white/90 rounded-xl border border-indigo-100 text-sm whitespace-pre-line text-slate-800 leading-relaxed font-mono">
                  {aiBriefing}
                </div>
              )}
            </div>

            {/* Historical Charts (Recharts) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-600" />
                    Historical Revenue vs. Mess Dinner Quality (21 Shifts in data.csv)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real sales at standardized rates (₹90 Egg Fried Rice / Chowmein, ₹70 Veg, ₹25 Omelette)
                  </p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="sale_date" tick={{fontSize: 11}} stroke="#94A3B8" />
                    <YAxis tick={{fontSize: 11}} stroke="#94A3B8" />
                    <Tooltip 
                      formatter={(val) => [`₹${val}`, "Revenue"]}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) {
                          const r = payload[0].payload;
                          return `${label} (${r.day_of_week}): ${r.mess_dinner_dish} [Mess Rating: ${r.student_rating}/5]`;
                        }
                        return label;
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="total_revenue_rs" 
                      name="Night Canteen Revenue (₹)" 
                      fill="#2563EB" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Fast Food Item Breakdown Chart */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-800 mb-4">
                  High-Mover Volume: Fried Rice vs. Chowmein Orders
                </h4>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="sale_date" tick={{fontSize: 11}} stroke="#94A3B8" />
                      <YAxis tick={{fontSize: 11}} stroke="#94A3B8" />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total_rice_sold" 
                        name="Fried Rice Plates" 
                        stroke="#EA580C" 
                        strokeWidth={2} 
                        dot={{r: 3}}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="total_chowmein_sold" 
                        name="Chowmein Plates" 
                        stroke="#0D9488" 
                        strokeWidth={2} 
                        dot={{r: 3}}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
