import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Search, ArrowLeftRight, Bus, Star, Clock, ChevronRight, Phone, Mail, Shield, CreditCard, Smartphone } from "lucide-react";
import { DESTINOS, TIPO_COLORS } from "../data/destinos";
import useSearchStore from "../stores/searchStore";

const DEPTOS = [
  { name: "La Paz", icon: "🏔️" }, { name: "Santa Cruz", icon: "🌴" }, { name: "Cochabamba", icon: "🌸" },
  { name: "Oruro", icon: "🎭" }, { name: "Potosi", icon: "⛏️" },
  { name: "Sucre", icon: "🏛️" }, { name: "Tarija", icon: "🍇" },
  { name: "Trinidad", icon: "🌿" }, { name: "Cobija", icon: "🦜" },
];

const METODOS_PAGO = [
  { nombre: "QR Bolivia", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/220px-QR_code_for_mobile_English_Wikipedia.svg.png", desc: "Todos los bancos" },
  { nombre: "Tigo Money", color: "#00B0E3", desc: "Pago movil" },
  { nombre: "VISA", color: "#1A1F71", desc: "Credito / Debito" },
  { nombre: "Mastercard", color: "#EB001B", desc: "Credito / Debito" },
  { nombre: "Banca Internet", color: "#1B2A6B", desc: "Transferencia" },
];

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1547558840-6cbd35a0e8a2?w=1920&q=80",
  "https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?w=1920&q=80",
  "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=80",
];

export default function Home({ onSearch }) {
  const [form, setForm] = useState({ origen: "", destino: "", fecha: new Date().toISOString().split("T")[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bgIdx, setBgIdx] = useState(0);
  const [deptoActivo, setDeptoActivo] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setBgIdx(i => (i + 1) % BG_IMAGES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const swap = () => setForm(f => ({ ...f, origen: f.destino, destino: f.origen }));

  const handleSearch = async () => {
    if (!form.origen || !form.destino) { setError("Selecciona origen y destino"); return; }
    if (form.origen === form.destino) { setError("Origen y destino deben ser distintos"); return; }
    setError(""); setLoading(true);
    await onSearch(form.origen, form.destino, form.fecha);
    setLoading(false);
  };

  const handleDestino = (depto) => {
    setForm(f => ({ ...f, destino: depto.departamento }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">

      <nav className="bg-[#1B2A6B] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bus size={24} className="text-[#D4AF37]"/>
          <span className="font-black text-xl">Bolivia<span className="text-[#D4AF37]">Bus</span>.bo</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#terminal" className="hover:text-[#D4AF37] transition-colors font-medium">Terminal El Alto</a>
          <a href="#destinos" className="hover:text-[#D4AF37] transition-colors">Destinos</a>
          <a href="#porque" className="hover:text-[#D4AF37] transition-colors">Por que nosotros</a>
          <a href="#contacto" className="hover:text-[#D4AF37] transition-colors">Contacto</a>
        </div>
        <div className="flex items-center gap-2 text-xs text-blue-200">
          <Mail size={12}/> info@boliviabus.bo
        </div>
      </nav>

      <div className="relative h-[600px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div key={bgIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }} className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${BG_IMAGES[bgIdx]})` }}/>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B2A6B]/90 via-[#1B2A6B]/60 to-transparent"/>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              COMPRA TUS<br/><span className="text-[#D4AF37]">PASAJES DE BUS</span><br/>EN BOLIVIA
            </motion.h1>
            <p className="text-blue-200 text-lg mb-6">Las mejores empresas de bus conectadas en una sola plataforma</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1.5"><Shield size={16} className="text-[#D4AF37]"/> Pago seguro</div>
              <div className="flex items-center gap-1.5"><Bus size={16} className="text-[#D4AF37]"/> 7 rutas</div>
              <div className="flex items-center gap-1.5"><Star size={16} className="text-[#D4AF37]"/> 5 empresas</div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl p-6">


            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs font-bold text-[#1B2A6B] mb-1 block">ORIGEN DE</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B2A6B]"/>
                  <select value={form.origen} onChange={e => setForm(f => ({ ...f, origen: e.target.value }))}
                    className="w-full pl-8 pr-2 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B] appearance-none">
                    <option value="">Origen</option>
                    {DEPTOS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#1B2A6B] mb-1 block">DESTINO A</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]"/>
                  <select value={form.destino} onChange={e => setForm(f => ({ ...f, destino: e.target.value }))}
                    className="w-full pl-8 pr-2 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B] appearance-none">
                    <option value="">Destino</option>
                    {DEPTOS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs font-bold text-[#1B2A6B] mb-1 block">FECHA DE SALIDA</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B2A6B]"/>
                <input type="date" value={form.fecha} min={new Date().toISOString().split("T")[0]}
                  onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                  className="w-full pl-8 pr-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]"/>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs mb-2 text-center">{error}</p>}

            <motion.button onClick={handleSearch} disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-[#D4AF37] hover:bg-[#c49b2e] text-[#1B2A6B] font-black py-4 rounded-xl text-lg flex items-center justify-center gap-2 disabled:opacity-60 transition-all">
              {loading
                ? <div className="w-5 h-5 border-2 border-[#1B2A6B] border-t-transparent rounded-full animate-spin"/>
                : <><Search size={20}/> Buscar</>}
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div id="destinos" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Los Principales Destinos en Bolivia</h2>
            <p className="text-gray-500 mt-1">Los mejores destinos para explorar esta temporada</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {DESTINOS.map((d, i) => (
            <button key={d.departamento} onClick={() => setDeptoActivo(i)}
              className={"px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all " +
                (deptoActivo === i ? "text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
              style={deptoActivo === i ? { background: d.color } : {}}>
              {d.departamento}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={deptoActivo} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINOS[deptoActivo].lugares.map((lugar, i) => {
              const tipoCfg = TIPO_COLORS[lugar.tipo] || { bg: "bg-gray-100", text: "text-gray-700" };
              return (
                <motion.div key={lugar.nombre} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={lugar.imagen} alt={lugar.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute top-3 left-3">
                      <span className={"text-xs font-semibold px-2 py-1 rounded-full " + tipoCfg.bg + " " + tipoCfg.text}>
                        {lugar.tipo}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-lg px-2 py-1">
                      <span className="text-xs font-bold text-[#1B2A6B]">Desde Bs. {lugar.precio_desde}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-gray-900 text-lg mb-1">{lugar.nombre}</h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{lugar.descripcion}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock size={12}/> {lugar.duracion}
                      </div>
                      <button onClick={() => handleDestino(DESTINOS[deptoActivo])}
                        className="flex items-center gap-1 text-sm font-semibold text-[#1B2A6B] hover:text-[#D4AF37] transition-colors">
                        Buscar pasaje <ChevronRight size={14}/>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div id="porque" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black text-gray-900 mb-2">¿Por que comprar en Bolivia Bus?</h2>
          <p className="text-gray-500 mb-10">La plataforma de transporte mas completa de Bolivia</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, titulo: "Compra segura", desc: "Tu pago esta protegido con cifrado SSL. Garantizamos la autenticidad de cada ticket emitido por nuestro sistema." },
              { icon: Bus, titulo: "Informacion al dia", desc: "Contacto directo con todas las empresas de transporte. Horarios, precios y disponibilidad en tiempo real." },
              { icon: Smartphone, titulo: "Ticket digital", desc: "Recibe tu pasaje en segundos. Muestra el codigo QR desde tu celular en el embarque sin necesidad de imprimir." },
            ].map((item, i) => (
              <motion.div key={item.titulo} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#1B2A6B]/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon size={24} className="text-[#1B2A6B]"/>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#1B2A6B] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-white font-bold text-xl mb-6 text-center">Tipos de pago aceptados</h3>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { label: "QR Bolivia", bg: "#fff", text: "#1B2A6B" },
              { label: "Tigo Money", bg: "#00B0E3", text: "#fff" },
              { label: "VISA", bg: "#1A1F71", text: "#fff" },
              { label: "Mastercard", bg: "#EB001B", text: "#fff" },
              { label: "Banca Internet", bg: "#27AE60", text: "#fff" },
              { label: "Efectivo", bg: "#D4AF37", text: "#1B2A6B" },
            ].map(m => (
              <div key={m.label} className="px-5 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: m.bg, color: m.text }}>
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="terminal" className="py-16 bg-[#1B2A6B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-3">Terminal <span className="text-[#D4AF37]">Metropolitana El Alto</span></h2>
            <p className="text-blue-200 text-lg">La terminal mas moderna de Bolivia — abierta las 24 horas</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 rounded-2xl p-6 text-white">
              <div className="text-3xl mb-3">🕐</div>
              <h3 className="font-bold text-[#D4AF37] mb-2">Horario</h3>
              <p className="text-blue-200 text-sm">Abierto las 24 horas, los 365 dias del año. Nunca cerramos.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 text-white">
              <div className="text-3xl mb-3">🚌</div>
              <h3 className="font-bold text-[#D4AF37] mb-2">Empresas</h3>
              <p className="text-blue-200 text-sm">Mas de 16 empresas nacionales y 6 internacionales operando diariamente.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 text-white">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold text-[#D4AF37] mb-2">Ubicacion</h3>
              <p className="text-blue-200 text-sm">Av. Juan Pablo II, El Alto. A 10 minutos del aeropuerto internacional.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {["🍽️ Restaurantes","🏧 ATM 24/7","🛡️ Seguridad","📶 WiFi Gratis","🧳 Guarderia","🚿 Duchas","🚗 Parking","♿ Accesible"].map(s => (
              <div key={s} className="bg-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium text-center">{s}</div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-blue-200 text-sm mb-4">¿Necesitas mas informacion sobre la terminal?</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="tel:+59122000000" className="bg-[#D4AF37] text-[#1B2A6B] font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors">📞 Llamar ahora</a>
              <a href="mailto:info@boliviabus.bo" className="bg-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">✉️ Escribir email</a>
            </div>
          </div>
        </div>
      </section>
      <section id="terminal" className="py-16 bg-[#1B2A6B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-3">Terminal <span className="text-[#D4AF37]">Metropolitana El Alto</span></h2>
            <p className="text-blue-200 text-lg">La terminal mas moderna de Bolivia — abierta las 24 horas</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 rounded-2xl p-6 text-white">
              <div className="text-3xl mb-3">🕐</div>
              <h3 className="font-bold text-[#D4AF37] mb-2">Horario</h3>
              <p className="text-blue-200 text-sm">Abierto las 24 horas, los 365 dias del año. Nunca cerramos.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 text-white">
              <div className="text-3xl mb-3">🚌</div>
              <h3 className="font-bold text-[#D4AF37] mb-2">Empresas</h3>
              <p className="text-blue-200 text-sm">Mas de 16 empresas nacionales y 6 internacionales operando diariamente.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 text-white">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold text-[#D4AF37] mb-2">Ubicacion</h3>
              <p className="text-blue-200 text-sm">Av. Ladislao Cabrera, zona Villa Bolivar "D", El Alto.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {["🍽️ Restaurantes","🏧 ATM 24/7","🛡️ Seguridad","📶 WiFi Gratis","🧳 Guarderia","🚿 Duchas","🚗 Parking","♿ Accesible"].map(s => (
                  <div key={s} className="bg-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium text-center">{s}</div>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                <a href="tel:+59122000000" className="bg-[#D4AF37] text-[#1B2A6B] font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors">📞 Llamar ahora</a>
                <a href="mailto:info@boliviabus.bo" className="bg-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">✉️ Escribir email</a>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl h-72">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.7!2d-68.1936!3d-16.5054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDMwJzE5LjQiUyA2OMKwMTEnMzcuMiJX!5e0!3m2!1ses!2sbo!4v1234567890"
                width="100%"
                height="100%"
                style={{border:0}}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Terminal El Alto"
              />
            </div>
          </div>
        </div>
      </section>
      <footer id="contacto" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bus size={20} className="text-[#D4AF37]"/>
              <span className="font-black text-lg">Bolivia<span className="text-[#D4AF37]">Bus</span>.bo</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Trabajamos para que tu viaje sea INOLVIDABLE, esa es nuestra principal motivacion.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#D4AF37]">Pa los viajeros</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#terminal" className="hover:text-white transition-colors">Terminal El Alto</a></li>
              <li><a href="#destinos" className="hover:text-white transition-colors">Principales destinos</a></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Tipos de asientos</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Nuestras empresas</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#D4AF37]">Ayuda</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Contactanos</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Preguntas frecuentes</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Cambios y cancelaciones</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Politicas de privacidad</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#D4AF37]">Contacto</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2"><Mail size={14}/> info@boliviabus.bo</div>
              <div className="flex items-center gap-2"><Phone size={14}/> +591 2 2000000</div>
              <div className="flex items-center gap-2"><MapPin size={14}/> La Paz, Bolivia</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          © 2026 Boliviabus.bo | Todos los derechos reservados
        </div>
      </footer>
    </div>
  );
}




