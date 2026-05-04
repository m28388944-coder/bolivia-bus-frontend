import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Search, ArrowLeftRight, Bus } from "lucide-react";

const DEPTOS = [
  { name: "La Paz",      icon: "🏔️" },
  { name: "El Alto",     icon: "🌄" },
  { name: "Santa Cruz",  icon: "🌴" },
  { name: "Cochabamba",  icon: "🌸" },
  { name: "Oruro",       icon: "🎭" },
  { name: "Potosi",      icon: "⛏️" },
  { name: "Sucre",       icon: "🏛️" },
  { name: "Tarija",      icon: "🍇" },
];

const TAGLINES = [
  "Viaja seguro por Bolivia",
  "Tu asiento en segundos",
  "7 departamentos conectados",
  "Ticket digital al instante",
];

const STATS = [
  { value: "50K+", label: "Pasajeros" },
  { value: "11",   label: "Rutas" },
  { value: "8",    label: "Buses" },
  { value: "100%", label: "Seguro" },
];

const BG_IMAGES = [
  "/images/destinos/21b6cca63c91ba68bcb2e3f641a8f95679ba74ad94ef2248037fd680.jpg",
  "/images/destinos/el-templo-kalasasaya-en-la-ciudad-preincaica-de-tiwanaku_409bf3a8_1280x849.jpg",
  "/images/destinos/paisaje-del-valle-de-la-luna-cerca-paz-en-bolivia-opinión-sol-rocoso-141765991.jpg",
  "/images/destinos/FOTO-CARNAVAL-ORURO-1024x682-1.jpeg",
  "/images/destinos/salar-coipasa-group-photographers-pond-bolivia.jpg",
  "/images/destinos/vista-cel-cerro-dai-tetti.jpg",
  "/images/destinos/Toro_Toro-G-2048x1502.jpg",
  "/images/destinos/salar-de-uyuni-hotel-768x432.jpg",
];

const DESTINOS = [
  { nombre: "Lago Titicaca",     img: "/images/destinos/21b6cca63c91ba68bcb2e3f641a8f95679ba74ad94ef2248037fd680.jpg", desde: "La Paz",     precio: 25 },
  { nombre: "Tiwanaku",          img: "/images/destinos/el-templo-kalasasaya-en-la-ciudad-preincaica-de-tiwanaku_409bf3a8_1280x849.jpg", desde: "La Paz", precio: 25 },
  { nombre: "Valle de la Luna",  img: "/images/destinos/paisaje-del-valle-de-la-luna-cerca-paz-en-bolivia-opinión-sol-rocoso-141765991.jpg", desde: "La Paz", precio: 15 },
  { nombre: "Carnaval de Oruro", img: "/images/destinos/FOTO-CARNAVAL-ORURO-1024x682-1.jpeg", desde: "La Paz",     precio: 25 },
  { nombre: "Salar de Uyuni",    img: "/images/destinos/salar-de-uyuni-hotel-768x432.jpg",    desde: "Oruro",     precio: 45 },
  { nombre: "Torotoro",          img: "/images/destinos/Toro_Toro-G-2048x1502.jpg",           desde: "Cochabamba",precio: 35 },
  { nombre: "Sucre Colonial",    img: "/images/destinos/sucre-potosi-magri-3.jpg",            desde: "Potosi",    precio: 30 },
  { nombre: "Rurrenabaque",      img: "/images/destinos/rurrenabaque-beni.jpg",               desde: "La Paz",    precio: 80 },
];

export default function SearchHero({ onSearch }) {
  const [form, setForm] = useState({
    origen: "", destino: "",
    fecha: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [tagIdx, setTagIdx]   = useState(0);
  const [bgIdx, setBgIdx]     = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTagIdx(i => (i + 1) % TAGLINES.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBgIdx(i => (i + 1) % BG_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const swap = () => setForm(f => ({ ...f, origen: f.destino, destino: f.origen }));

  const handleSubmit = async () => {
    if (!form.origen || !form.destino) { setError("Selecciona origen y destino"); return; }
    if (form.origen === form.destino)  { setError("Origen y destino deben ser distintos"); return; }
    setError(""); setLoading(true);
    await onSearch(form.origen, form.destino, form.fecha);
    setLoading(false);
  };

  const handleDestino = (d) => {
    setForm(f => ({ ...f, destino: d.desde === "La Paz" ? "La Paz" : d.desde, origen: "La Paz" }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50">
      {/* HERO */}
      <div className="relative min-h-[580px] flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={bgIdx}
            initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${BG_IMAGES[bgIdx]})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A6B]/80 via-[#1B2A6B]/60 to-[#1B2A6B]/90"/>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bus size={36} className="text-[#D4AF37]"/>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Bolivia <span className="text-[#D4AF37]">Bus</span>
              </h1>
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={tagIdx}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="text-blue-200 text-lg font-medium">
                {TAGLINES[tagIdx]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Origen</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B2A6B]"/>
                  <select value={form.origen} onChange={e => setForm(f => ({ ...f, origen: e.target.value }))}
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1B2A6B] appearance-none bg-gray-50">
                    <option value="">Seleccionar ciudad</option>
                    {DEPTOS.map(d => <option key={d.name} value={d.name}>{d.icon} {d.name}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={swap}
                className="mt-5 w-10 h-10 bg-[#1B2A6B]/10 hover:bg-[#1B2A6B] hover:text-white text-[#1B2A6B] rounded-xl flex items-center justify-center transition-all">
                <ArrowLeftRight size={16}/>
              </button>

              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Destino</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]"/>
                  <select value={form.destino} onChange={e => setForm(f => ({ ...f, destino: e.target.value }))}
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1B2A6B] appearance-none bg-gray-50">
                    <option value="">Seleccionar ciudad</option>
                    {DEPTOS.map(d => <option key={d.name} value={d.name}>{d.icon} {d.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Fecha de viaje</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B2A6B]"/>
                <input type="date" value={form.fecha}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1B2A6B] bg-gray-50"/>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

            <motion.button onClick={handleSubmit} disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#1B2A6B] to-[#2d45a8] text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-lg disabled:opacity-60">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
              ) : (
                <><Search size={20}/> Buscar Horarios</>
              )}
            </motion.button>
          </motion.div>

          <div className="flex items-center gap-8 mt-8">
            {STATS.map(s => (
              <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <div className="text-2xl font-black text-[#D4AF37]">{s.value}</div>
                <div className="text-xs text-blue-200">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINOS DESTACADOS */}
      <div className="px-4 py-10 max-w-4xl mx-auto">
        <h2 className="text-xl font-black text-[#1B2A6B] mb-1">Destinos Destacados</h2>
        <p className="text-gray-500 text-sm mb-6">Descubre Bolivia a bordo de nuestros buses</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DESTINOS.map((d, i) => (
            <motion.div key={d.nombre}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => handleDestino(d)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-sm"
              style={{ height: 160 }}>
              <img src={d.img} alt={d.nombre}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-black text-sm leading-tight">{d.nombre}</p>
                <p className="text-[#D4AF37] text-xs font-semibold mt-0.5">Desde Bs. {d.precio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}