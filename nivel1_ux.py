import os

# ── SearchHero mejorado ──────────────────────────────────────────────────────
hero = r"""import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Search, ArrowRight, ArrowLeftRight, Shield, Ticket, Bus } from 'lucide-react';
import { getDepartamentos, searchRoutes } from '../api';

const DEPTOS = [
  { name: "La Paz",      icon: "🏔️" },
  { name: "Santa Cruz",  icon: "🌴" },
  { name: "Cochabamba",  icon: "🌸" },
  { name: "Oruro",       icon: "🎭" },
  { name: "Potosi",      icon: "⛏️" },
  { name: "Sucre",       icon: "🏛️" },
  { name: "Tarija",      icon: "🍇" },
];

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?w=1920&q=80",
  "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=80",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80",
];

const TAGLINES = [
  "Viaja seguro por Bolivia",
  "Tu asiento en segundos",
  "11 rutas, 7 departamentos",
  "Ticket digital al instante",
];

const STATS = [
  { value: "50K+", label: "Pasajeros" },
  { value: "11",   label: "Rutas" },
  { value: "7",    label: "Departamentos" },
  { value: "100%", label: "Seguro" },
];

export default function SearchHero({ onResults }) {
  const [departamentos, setDepartamentos] = useState([]);
  const [form, setForm] = useState({ origin: "", destination: "", date: "", passengers: 1, tripType: "one_way" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bgIdx, setBgIdx] = useState(0);
  const [tagIdx, setTagIdx] = useState(0);

  useEffect(() => {
    getDepartamentos().then(r => setDepartamentos(r.data.departamentos)).catch(() => {});
    const today = new Date().toISOString().split("T")[0];
    setForm(f => ({ ...f, date: today }));
    const bgTimer = setInterval(() => setBgIdx(i => (i + 1) % BG_IMAGES.length), 5000);
    const tagTimer = setInterval(() => setTagIdx(i => (i + 1) % TAGLINES.length), 3000);
    return () => { clearInterval(bgTimer); clearInterval(tagTimer); };
  }, []);

  const swapLocations = () => setForm(f => ({ ...f, origin: f.destination, destination: f.origin }));

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!form.origin || !form.destination || !form.date) { setError("Completa todos los campos"); return; }
    if (form.origin === form.destination) { setError("Origen y destino deben ser diferentes"); return; }
    setLoading(true); setError("");
    try {
      const res = await searchRoutes(form);
      onResults(res.data.results, form);
    } catch { setError("Error al buscar. Intenta de nuevo."); }
    finally { setLoading(false); }
  };

  const getDeptoIcon = (name) => DEPTOS.find(d => d.name === name)?.icon || "📍";

  return (
    <div className="relative min-h-[580px] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Fondo rotativo */}
      <AnimatePresence mode="wait">
        <motion.div key={bgIdx}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BG_IMAGES[bgIdx]})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a4a]/85 via-[#1B2A6B]/75 to-[#0a1235]/95" />

      {/* Particulas decorativas */}
      {[...Array(6)].map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full bg-[#D4AF37]/20"
          style={{ width: 8 + i * 4, height: 8 + i * 4, left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [-10, 10, -10], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      {/* Titulo */}
      <div className="relative z-10 text-center mb-8">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <motion.div className="inline-block mb-3 px-4 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <span className="text-[#D4AF37] text-sm font-semibold tracking-wider">SISTEMA NACIONAL DE PASAJES</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-3 tracking-tight">
            Bolivia <span className="text-[#D4AF37]">Bus</span>
          </h1>
          <div className="h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p key={tagIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-blue-200 text-xl">
                {TAGLINES[tagIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div className="flex gap-6 justify-center mt-5 flex-wrap"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          {STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
              className="text-center">
              <div className="text-2xl font-black text-[#D4AF37]">{s.value}</div>
              <div className="text-blue-300 text-xs">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Formulario */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 bg-white/97 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-full max-w-4xl border border-white/20">

        <div className="flex gap-3 mb-5">
          {[{ id: "one_way", label: "Solo Ida" }, { id: "round_trip", label: "Ida y Vuelta" }].map(t => (
            <button key={t.id} onClick={() => setForm({ ...form, tripType: t.id })}
              className={"px-4 py-2 rounded-full text-sm font-semibold transition-all " +
                (form.tripType === t.id ? "bg-[#1B2A6B] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-9 gap-3 items-end">
            {/* Origen */}
            <div className="md:col-span-3 flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <MapPin size={12} className="text-[#1B2A6B]" /> Origen
              </label>
              <div className="relative">
                <select value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-gray-50 font-medium appearance-none transition-colors">
                  <option value="">Desde donde?</option>
                  {departamentos.map(d => <option key={d} value={d}>{getDeptoIcon(d)} {d}</option>)}
                </select>
                {form.origin && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                    {getDeptoIcon(form.origin)}
                  </span>
                )}
              </div>
            </div>

            {/* Swap */}
            <div className="md:col-span-1 flex justify-center">
              <motion.button type="button" onClick={swapLocations}
                whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-10 h-10 rounded-full bg-[#1B2A6B] text-white flex items-center justify-center hover:bg-[#D4AF37] transition-colors mt-5 shadow-md">
                <ArrowLeftRight size={16} />
              </motion.button>
            </div>

            {/* Destino */}
            <div className="md:col-span-3 flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <MapPin size={12} className="text-red-500" /> Destino
              </label>
              <div className="relative">
                <select value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-gray-50 font-medium appearance-none transition-colors">
                  <option value="">A donde vas?</option>
                  {departamentos.map(d => <option key={d} value={d}>{getDeptoIcon(d)} {d}</option>)}
                </select>
                {form.destination && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                    {getDeptoIcon(form.destination)}
                  </span>
                )}
              </div>
            </div>

            {/* Fecha */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <Calendar size={12} className="text-[#1B2A6B]" /> Fecha
              </label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-gray-50 font-medium transition-colors" />
            </div>
          </div>

          {form.tripType === "round_trip" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="mt-3 flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <Calendar size={12} className="text-[#1B2A6B]" /> Fecha Regreso
              </label>
              <input type="date" value={form.return_date || ""} onChange={e => setForm({ ...form, return_date: e.target.value })}
                className="w-full md:w-48 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-gray-50" />
            </motion.div>
          )}

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-3 text-center font-medium bg-red-50 py-2 rounded-lg">
              {error}
            </motion.p>
          )}

          <motion.button type="submit" disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full mt-4 bg-gradient-to-r from-[#1B2A6B] to-[#2d45a8] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg shadow-lg hover:from-[#D4AF37] hover:to-[#c49b2e] hover:text-[#1B2A6B] transition-all duration-300">
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Buscando...</span></>
            ) : (
              <><Search size={20} /><span>Buscar Pasajes</span><ArrowRight size={20} /></>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Badges de confianza */}
      <motion.div className="relative z-10 flex gap-6 mt-6 flex-wrap justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        {[
          { icon: Shield, label: "Pago seguro" },
          { icon: Ticket, label: "Ticket digital" },
          { icon: Bus,    label: "11 rutas disponibles" },
        ].map(({ icon: Icon, label }) => (
          <motion.div key={label} whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-white/80 text-sm bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
            <Icon size={14} className="text-[#D4AF37]" />
            <span>{label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
"""

# ── SearchResults mejorado ───────────────────────────────────────────────────
results = r"""import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Bus, MapPin, ChevronRight, SlidersHorizontal, Star, Zap, TrendingDown } from 'lucide-react';
import SkeletonCard from './SkeletonCard';

const BUS_CONFIG = {
  normal:   { bg: "bg-blue-50",    border: "border-blue-200",   text: "text-blue-700",   label: "Normal",       color: "#3b82f6" },
  semicama: { bg: "bg-purple-50",  border: "border-purple-200", text: "text-purple-700", label: "Semicama",     color: "#8b5cf6" },
  cama:     { bg: "bg-amber-50",   border: "border-amber-200",  text: "text-amber-700",  label: "Cama / Lecho", color: "#f59e0b" },
};

const BUS_ICONS = {
  normal:   ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="13" rx="2" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5"/>
      <rect x="4" y="9" width="5" height="4" rx="1" fill={color}/>
      <rect x="10" y="9" width="5" height="4" rx="1" fill={color}/>
      <rect x="16" y="9" width="3" height="4" rx="1" fill={color}/>
      <circle cx="6" cy="20" r="2" fill={color}/>
      <circle cx="18" cy="20" r="2" fill={color}/>
      <rect x="2" y="6" width="4" height="5" rx="1" fill={color} opacity="0.4"/>
    </svg>
  ),
  semicama: ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5"/>
      <rect x="4" y="8" width="4" height="5" rx="1.5" fill={color}/>
      <rect x="10" y="8" width="4" height="5" rx="1.5" fill={color}/>
      <rect x="16" y="8" width="3" height="5" rx="1.5" fill={color}/>
      <path d="M4 13 Q6 15 8 13" stroke={color} strokeWidth="1" fill="none"/>
      <path d="M10 13 Q12 15 14 13" stroke={color} strokeWidth="1" fill="none"/>
      <circle cx="6" cy="20" r="2" fill={color}/>
      <circle cx="18" cy="20" r="2" fill={color}/>
    </svg>
  ),
  cama: ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="15" rx="2" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5"/>
      <rect x="4" y="8" width="5" height="6" rx="2" fill={color}/>
      <rect x="11" y="8" width="5" height="6" rx="2" fill={color}/>
      <line x1="4" y1="11" x2="9" y2="11" stroke="white" strokeWidth="1"/>
      <line x1="11" y1="11" x2="16" y2="11" stroke="white" strokeWidth="1"/>
      <circle cx="6" cy="20" r="2" fill={color}/>
      <circle cx="18" cy="20" r="2" fill={color}/>
    </svg>
  ),
};

function formatTime(dt) {
  return new Date(dt).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
}

function getPrice(s) {
  if (s.bus_type === "cama") return s.price_cama;
  if (s.bus_type === "semicama") return s.price_semicama;
  return s.price_normal;
}

function SeatBar({ available, total = 40 }) {
  const pct = Math.round((available / total) * 100);
  const color = pct > 50 ? "#22c55e" : pct > 20 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden" style={{ width: 60 }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3, duration: 0.6 }}
          className="h-full rounded-full" style={{ backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{available} libres</span>
    </div>
  );
}

export default function SearchResults({ results, searchInfo, onSelect, loading }) {
  const [sortBy, setSortBy] = useState("price");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-4">
      {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
    </div>
  );
  if (!results) return null;

  let filtered = [...results];
  if (filterType !== "all") filtered = filtered.filter(s => s.bus_type === filterType);
  if (sortBy === "price") filtered.sort((a, b) => getPrice(a) - getPrice(b));
  if (sortBy === "time") filtered.sort((a, b) => new Date(a.departure_time) - new Date(b.departure_time));
  if (sortBy === "seats") filtered.sort((a, b) => b.available_seats - a.available_seats);

  const cheapest = Math.min(...filtered.map(getPrice));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2 bg-[#1B2A6B] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
            <MapPin size={14} />
            <span>{searchInfo?.origin}</span>
            <span className="text-[#D4AF37] mx-1">→</span>
            <span>{searchInfo?.destination}</span>
          </div>
          <span className="text-sm text-gray-500 ml-auto">
            {filtered.length} viaje{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </span>
          <button onClick={() => setShowFilters(!showFilters)}
            className={"flex items-center gap-1 text-sm px-3 py-2 rounded-lg border transition-all " +
              (showFilters ? "bg-[#1B2A6B] text-white border-[#1B2A6B]" : "border-gray-300 text-gray-600 hover:border-[#1B2A6B]")}>
            <SlidersHorizontal size={14} /> Filtros
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-4 mb-4 overflow-hidden shadow-sm">
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Tipo de Bus</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { id: "all", label: "Todos" },
                      { id: "normal", label: "Normal" },
                      { id: "semicama", label: "Semicama" },
                      { id: "cama", label: "Cama" },
                    ].map(f => (
                      <button key={f.id} onClick={() => setFilterType(f.id)}
                        className={"px-3 py-1 rounded-full text-sm transition-all font-medium " +
                          (filterType === f.id ? "bg-[#1B2A6B] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Ordenar por</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { id: "price", label: "Precio", Icon: TrendingDown },
                      { id: "time",  label: "Hora",   Icon: Clock },
                      { id: "seats", label: "Asientos", Icon: Star },
                    ].map(({ id, label, Icon }) => (
                      <button key={id} onClick={() => setSortBy(id)}
                        className={"flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all font-medium " +
                          (sortBy === id ? "bg-[#1B2A6B] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                        <Icon size={12} /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-16">
          <Bus size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">No hay viajes disponibles</p>
          <p className="text-gray-400 text-sm mt-1">Prueba otra fecha o ruta</p>
        </motion.div>
      )}

      <div className="flex flex-col gap-4">
        {filtered.map((s, i) => {
          const cfg = BUS_CONFIG[s.bus_type] || BUS_CONFIG.normal;
          const BusIcon = BUS_ICONS[s.bus_type] || BUS_ICONS.normal;
          const price = getPrice(s);
          const isCheapest = price === cheapest && filtered.length > 1;
          return (
            <motion.div key={s.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(27,42,107,0.12)" }}
              className={"bg-white rounded-2xl shadow-md p-5 border border-gray-100 cursor-pointer border-l-4 relative overflow-hidden " +
                (isCheapest ? "border-l-green-500" : "border-l-[#1B2A6B]")}
              onClick={() => onSelect(s)}>

              {isCheapest && (
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                    <Zap size={10} /> Mejor precio
                  </span>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-3xl font-black text-[#1B2A6B]">{formatTime(s.departure_time)}</span>
                    <div className="flex-1 flex items-center gap-1 min-w-[80px]">
                      <div className="h-px flex-1 bg-gray-300" />
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full">
                        <Clock size={10} className="text-gray-400" />
                        <span className="text-xs text-gray-500">{s.duration_hours}h</span>
                      </div>
                      <div className="h-px flex-1 bg-gray-300" />
                    </div>
                    <span className="text-3xl font-black text-gray-600">{formatTime(s.arrival_time)}</span>
                    <span className={"flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-bold border " +
                      cfg.bg + " " + cfg.text + " " + cfg.border}>
                      <BusIcon color={cfg.color.replace("text-", "")} />
                      {cfg.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1 font-medium">
                      <Bus size={14} className="text-[#1B2A6B]" /> {s.company}
                    </span>
                    <SeatBar available={s.available_seats} />
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-4xl font-black text-[#1B2A6B]">Bs. {price}</div>
                  <div className="text-xs text-gray-400 mt-0.5">+ Bs. {s.terminal_fee} terminal</div>
                  <div className="text-sm font-bold text-gray-600 mt-1">
                    Total: <span className="text-[#1B2A6B]">Bs. {price + s.terminal_fee}</span>
                  </div>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="mt-3 bg-[#1B2A6B] text-white text-sm font-bold px-6 py-2.5 rounded-xl flex items-center gap-1 ml-auto hover:bg-[#D4AF37] hover:text-[#1B2A6B] transition-all shadow-md">
                    Elegir <ChevronRight size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
"""

# ── SeatMap: asientos SVG forma real de silla ─────────────────────────────
seatmap_patch = r"""
function SeatSVG({ status, floor, seatNum, isSelected, isRecommended }) {
  const colors = {
    available:   { body: "#e8eeff", border: "#1B2A6B", text: "#1B2A6B" },
    occupied:    { body: "#e5e7eb", border: "#9ca3af", text: "#9ca3af" },
    reserved:    { body: "#fef3c7", border: "#f59e0b", text: "#b45309" },
    selected:    { body: "#1B2A6B", border: "#1B2A6B", text: "#ffffff" },
    recommended: { body: "#dcfce7", border: "#22c55e", text: "#15803d" },
  };
  const c = colors[status] || colors.occupied;
  return (
    <svg width="48" height="52" viewBox="0 0 48 52" xmlns="http://www.w3.org/2000/svg">
      {/* Respaldo */}
      <rect x="6" y="2" width="36" height="26" rx="6" fill={c.body} stroke={c.border} strokeWidth="2"/>
      {/* Cabecera acolchada */}
      <rect x="10" y="4" width="28" height="8" rx="4" fill={c.border} opacity="0.15"/>
      {/* Asiento */}
      <rect x="4" y="26" width="40" height="16" rx="5" fill={c.body} stroke={c.border} strokeWidth="2"/>
      {/* Brazos */}
      <rect x="1" y="24" width="5" height="18" rx="3" fill={c.border} opacity="0.3"/>
      <rect x="42" y="24" width="5" height="18" rx="3" fill={c.border} opacity="0.3"/>
      {/* Patas */}
      <rect x="8"  y="42" width="5" height="8" rx="2" fill={c.border} opacity="0.4"/>
      <rect x="35" y="42" width="5" height="8" rx="2" fill={c.border} opacity="0.4"/>
      {/* Numero */}
      <text x="24" y="38" textAnchor="middle" fontSize="9" fontWeight="bold" fill={c.text}>{seatNum}</text>
      {/* Check si seleccionado */}
      {isSelected && (
        <text x="24" y="19" textAnchor="middle" fontSize="11" fill="#ffffff">✓</text>
      )}
      {/* Estrella si recomendado */}
      {isRecommended && !isSelected && (
        <circle cx="38" cy="6" r="6" fill="#22c55e"/>
      )}
    </svg>
  );
}
"""

# Leer SeatMap actual y parcharlo
seatmap_path = r"src\components\SeatMap.jsx"
with open(seatmap_path, "r", encoding="utf-8") as f:
    content = f.read()

# Reemplazar el SeatButton con version SVG
old_btn = '''function SeatButton({ seat, isSelected, isRecommended, onClick }) {
  const status = isSelected ? "selected" : isRecommended ? "recommended" : seat.status;
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.occupied;
  const isAvail = seat.status === "available";

  return (
    <motion.button
      whileHover={isAvail ? { scale: 1.1 } : {}}
      whileTap={isAvail ? { scale: 0.95 } : {}}
      onClick={() => isAvail && onClick(seat)}
      disabled={!isAvail}
      title={seat.seat_number + " \u2014 " + seat.status}
      className={"relative rounded-xl border-2 w-14 h-14 flex flex-col items-center justify-center transition-all duration-150 font-bold text-xs " + cfg.bg + " " + cfg.border + " " + cfg.text + " " + cfg.hover + " " + cfg.cursor}>
      <span className="text-lg">{isSelected ? "\u2714" : seat.floor === 2 ? "\uD83E\uDE91" : "\uD83D\uDCBA"}</span>
      <span className="text-[10px] leading-none">{seat.seat_number}</span>
      {isRecommended && !isSelected && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <Star size={8} className="text-white"/>
        </span>
      )}
    </motion.button>
  );
}'''

new_btn = seatmap_patch + '''
function SeatButton({ seat, isSelected, isRecommended, onClick }) {
  const status = isSelected ? "selected" : isRecommended ? "recommended" : seat.status;
  const isAvail = seat.status === "available";
  return (
    <motion.button
      whileHover={isAvail ? { scale: 1.08, y: -2 } : {}}
      whileTap={isAvail ? { scale: 0.95 } : {}}
      onClick={() => isAvail && onClick(seat)}
      disabled={!isAvail}
      title={seat.seat_number + " - " + seat.status}
      className={"transition-all duration-150 " + (isAvail ? "cursor-pointer" : "cursor-not-allowed opacity-70")}>
      <SeatSVG
        status={status}
        floor={seat.floor}
        seatNum={seat.seat_number}
        isSelected={isSelected}
        isRecommended={isRecommended}
      />
    </motion.button>
  );
}'''

# Solo parchamos SeatButton, el resto del SeatMap se mantiene
if 'function SeatButton' in content:
    # Buscar y reemplazar por posicion
    start = content.find('function SeatButton')
    # Encontrar el final de la funcion (el '}' que cierra)
    depth = 0
    end = start
    for i, ch in enumerate(content[start:], start):
        if ch == '{': depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    new_content = content[:start] + new_btn + content[end:]
    with open(seatmap_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("OK: SeatMap parcheado con SVG")
else:
    print("WARN: SeatButton no encontrado, saltando SeatMap")

# Escribir SearchHero
with open(r"src\components\SearchHero.jsx", "w", encoding="utf-8") as f:
    f.write(hero)
print("OK: SearchHero")

# Escribir SearchResults
with open(r"src\components\SearchResults.jsx", "w", encoding="utf-8") as f:
    f.write(results)
print("OK: SearchResults")

print("\nNivel 1 UX completado!")