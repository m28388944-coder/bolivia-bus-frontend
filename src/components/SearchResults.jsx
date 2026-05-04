import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Bus, MapPin, ChevronRight, SlidersHorizontal, Star, Zap, TrendingDown, Building2 } from "lucide-react";
import SkeletonCard from "./SkeletonCard";

const BUS_CONFIG = {
  normal:   { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   label: "Normal",       color: "#3b82f6" },
  semicama: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", label: "Semicama",     color: "#8b5cf6" },
  cama:     { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  label: "Cama / Lecho", color: "#f59e0b" },
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
          className="h-full rounded-full" style={{ backgroundColor: color }}/>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{available} libres</span>
    </div>
  );
}

// Badge de empresa/flota con color único por nombre
function EmpresaBadge({ empresa }) {
  const colores = [
    { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200" },
    { bg: "bg-teal-50",    text: "text-teal-700",    border: "border-teal-200" },
    { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200" },
    { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200" },
    { bg: "bg-cyan-50",    text: "text-cyan-700",    border: "border-cyan-200" },
    { bg: "bg-lime-50",    text: "text-lime-700",    border: "border-lime-200" },
  ];
  // Color consistente por nombre de empresa
  const idx = empresa.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colores.length;
  const c = colores[idx];
  return (
    <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-bold border ${c.bg} ${c.text} ${c.border}`}>
      <Building2 size={11} /> {empresa}
    </span>
  );
}

export default function SearchResults({ results, searchInfo, onSelect, loading }) {
  const [sortBy, setSortBy]         = useState("price");
  const [filterType, setFilterType] = useState("all");
  const [filterEmpresa, setFilterEmpresa] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-4">
      {[1, 2, 3].map(i => <SkeletonCard key={i}/>)}
    </div>
  );
  if (!results) return null;

  // Empresas únicas disponibles
  const empresas = ["all", ...Array.from(new Set(results.map(r => r.company).filter(Boolean)))];

  let filtered = [...results];
  if (filterType !== "all") filtered = filtered.filter(s => s.bus_type === filterType);
  if (filterEmpresa !== "all") filtered = filtered.filter(s => s.company === filterEmpresa);
  if (sortBy === "price") filtered.sort((a, b) => getPrice(a) - getPrice(b));
  if (sortBy === "time")  filtered.sort((a, b) => new Date(a.departure_time) - new Date(b.departure_time));
  if (sortBy === "seats") filtered.sort((a, b) => b.available_seats - a.available_seats);

  const cheapest = Math.min(...filtered.map(getPrice));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">

        {/* Barra superior */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2 bg-[#1B2A6B] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
            <MapPin size={14}/>
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
            <SlidersHorizontal size={14}/> Filtros
          </button>
        </div>

        {/* Filtros expandibles */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-4 mb-4 overflow-hidden shadow-sm">
              <div className="flex flex-wrap gap-6">

                {/* Tipo de bus */}
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

                {/* ── FILTRO POR EMPRESA/FLOTA ── */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Empresa / Flota</p>
                  <div className="flex gap-2 flex-wrap">
                    {empresas.map(e => (
                      <button key={e} onClick={() => setFilterEmpresa(e)}
                        className={"px-3 py-1 rounded-full text-sm transition-all font-medium " +
                          (filterEmpresa === e ? "bg-[#1B2A6B] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                        {e === "all" ? "Todas" : e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ordenar */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Ordenar por</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { id: "price", label: "Precio",   Icon: TrendingDown },
                      { id: "time",  label: "Hora",     Icon: Clock },
                      { id: "seats", label: "Asientos", Icon: Star },
                    ].map(({ id, label, Icon }) => (
                      <button key={id} onClick={() => setSortBy(id)}
                        className={"flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all font-medium " +
                          (sortBy === id ? "bg-[#1B2A6B] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                        <Icon size={12}/> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CHIPS DE EMPRESA para selección rápida sin abrir filtros ── */}
        {empresas.length > 2 && (
          <div className="flex gap-2 flex-wrap mb-2">
            <span className="text-xs text-gray-400 self-center font-semibold">Flotas:</span>
            {empresas.filter(e => e !== "all").map(e => (
              <button key={e} onClick={() => setFilterEmpresa(filterEmpresa === e ? "all" : e)}
                className={"px-3 py-1 rounded-full text-xs font-bold border transition-all " +
                  (filterEmpresa === e
                    ? "bg-[#1B2A6B] text-white border-[#1B2A6B]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#1B2A6B]")}>
                {e}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Bus size={48} className="mx-auto text-gray-300 mb-4"/>
          <p className="text-gray-500 text-lg font-medium">No hay viajes disponibles</p>
          <p className="text-gray-400 text-sm mt-1">Prueba otra fecha, ruta o empresa</p>
        </motion.div>
      )}

      <div className="flex flex-col gap-4">
        {filtered.map((s, i) => {
          const cfg   = BUS_CONFIG[s.bus_type] || BUS_CONFIG.normal;
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
                    <Zap size={10}/> Mejor precio
                  </span>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  {/* Horarios */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-3xl font-black text-[#1B2A6B]">{formatTime(s.departure_time)}</span>
                    <div className="flex-1 flex items-center gap-1 min-w-[80px]">
                      <div className="h-px flex-1 bg-gray-300"/>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full">
                        <Clock size={10} className="text-gray-400"/>
                        <span className="text-xs text-gray-500">{s.duration_hours}h</span>
                      </div>
                      <div className="h-px flex-1 bg-gray-300"/>
                    </div>
                    <span className="text-3xl font-black text-gray-600">{formatTime(s.arrival_time)}</span>
                  </div>

                  {/* Empresa + tipo bus + asientos */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* ── BADGE EMPRESA/FLOTA ── */}
                    <EmpresaBadge empresa={s.company || "Sin empresa"} />
                    <span className={"flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-bold border " +
                      cfg.bg + " " + cfg.text + " " + cfg.border}>
                      <Bus size={11}/> {cfg.label}
                    </span>
                    <SeatBar available={s.available_seats}/>
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
                    Elegir <ChevronRight size={16}/>
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
