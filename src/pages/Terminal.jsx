import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Bus, Banknote, ExternalLink } from "lucide-react";

const TABS = [
  { id: "info",       label: "Informacion" },
  { id: "servicios",  label: "Servicios" },
  { id: "operadores", label: "Operadores" },
  { id: "cajeros",    label: "Cajeros ATM" },
  { id: "mapa",       label: "Mapa" },
];

const SERVICIOS = [
  { img: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/tienda.png", nombre: "Tiendas", desc: "Galerias comerciales y tiendas de souvenirs", color: "bg-blue-50 border-blue-200" },
  { img: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/atm_money_withdrawal_cash_point_bill_money_icon_128572.png", nombre: "Cajeros Automaticos", desc: "9 cajeros ATM de todos los bancos", color: "bg-green-50 border-green-200" },
  { img: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/ABOGADOS.png", nombre: "Servicio de Abogados", desc: "Asesoria legal para viajeros", color: "bg-purple-50 border-purple-200" },
  { img: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/area-de-espera-1.png", nombre: "Salas de Embarque", desc: "Preembarque 1, 2, 3 y 4 con WiFi", color: "bg-indigo-50 border-indigo-200" },
  { img: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/chairs_umbrella_sun_restaurant_patio_terrace_icon_251107.png", nombre: "Restaurantes", desc: "Patio de comidas y cafeterias", color: "bg-orange-50 border-orange-200" },
  { img: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/FARMACIA-1.png", nombre: "Farmacias", desc: "Servicio farmaceutico 24hrs", color: "bg-red-50 border-red-200" },
  { img: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/banos-publicos-e1753725024770.png", nombre: "Banos Publicos", desc: "Adaptados para personas con discapacidad", color: "bg-cyan-50 border-cyan-200" },
  { img: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/juegos.png", nombre: "Sala de Juegos", desc: "Entretenimiento para todas las edades", color: "bg-yellow-50 border-yellow-200" },
  { img: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/912f1787e72861288d6006c295838c8c-icono-de-auditorio-de-cine.webp", nombre: "Cine", desc: "Sala de cine dentro de la terminal", color: "bg-pink-50 border-pink-200" },
  { img: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/patinaje.png", nombre: "Pista de Patinaje", desc: "Pista de patinaje sobre hielo", color: "bg-sky-50 border-sky-200" },
];

const INSTITUCIONES = [
  { nombre: "SEGIP", desc: "Servicio General de Identificacion Personal", logo: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/segip.png", url: "https://www.segip.gob.bo/" },
  { nombre: "SERECI", desc: "Organo Electoral Plurinacional - Tribunal Supremo Electoral", logo: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/sereci-e1753715057867.png", url: "#" },
  { nombre: "Gob. El Alto", desc: "Gobierno Autonomo Municipal de El Alto", logo: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/logo-gamea-1024x715.webp", url: "https://www.elalto.gob.bo/" },
  { nombre: "ATT", desc: "Autoridad de Regulacion y Fiscalizacion de Telecomunicaciones", logo: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/att.png", url: "https://www.att.gob.bo/" },
];

const OPERADORES_NAC = [
  { nombre: "Flota Bolivar",      rutas: "La Paz - Cbba - SCZ - Potosi - Sucre - Trinidad - Yacuiba", color: "#003087" },
  { nombre: "Flota Cosmos",       rutas: "Cbba - Santa Cruz - Potosi - Yacuiba - Trinidad",            color: "#FF6600" },
  { nombre: "Flota Copacabana",   rutas: "Potosi - Cochabamba - Sucre",                                color: "#CC0000" },
  { nombre: "Buses Concordia",    rutas: "La Paz - Santa Cruz - Cbba - La Paz",                        color: "#006633" },
  { nombre: "PumaBus",            rutas: "La Paz - Santa Cruz - Cochabamba - Oruro",                   color: "#FFD700" },
  { nombre: "19 de Marzo",        rutas: "La Paz - Santa Cruz - Cochabamba - Oruro",                   color: "#8B0000" },
  { nombre: "Flota Imperial",     rutas: "Potosi - salidas 20:15 y 22:00",                             color: "#4B0082" },
  { nombre: "Trans El Inca",      rutas: "Salidas diarias multiples destinos",                         color: "#006400" },
  { nombre: "La Veloz",           rutas: "Cbba - Santa Cruz - Trinidad - Cama Leito 3 Filas",          color: "#FF4500" },
  { nombre: "Titicaca B",         rutas: "Uyuni - mas comodo y seguro",                                color: "#1E90FF" },
  { nombre: "Flota Urkupina",     rutas: "Cbba - Santa Cruz - Yacuiba",                                color: "#9400D3" },
  { nombre: "Trans Sumaj Orcko",  rutas: "Cbba - Santa Cruz 07:30 / 20:30 - 14:00 / 19:30",           color: "#DC143C" },
  { nombre: "Super Americano",    rutas: "Oruro - Cbba - Potosi - multiples horarios",                 color: "#FF8C00" },
  { nombre: "Empresa Exp La Paz", rutas: "Tarija - Bermejo 14:00 / 18:00",                             color: "#2F4F4F" },
  { nombre: "Quirquincho",        rutas: "La Paz - Buenos Aires - Mendoza - Cordoba",                  color: "#8B4513" },
  { nombre: "Linea Sindical",     rutas: "Trans del Sur 1 - multiples destinos",                       color: "#556B2F" },
];

const OPERADORES_INT = [
  { nombre: "PumaBus Internacional", rutas: "La Paz - Buenos Aires - Santiago",       color: "#FFD700" },
  { nombre: "Andorinha",             rutas: "Conexion con Brasil",                    color: "#009C3B" },
  { nombre: "Cruz del Norte",        rutas: "Internacional - multiples destinos",     color: "#CC0000" },
  { nombre: "Requipa Tours",         rutas: "Uyuni 21:30 - Potosi 21:30 - Villazon", color: "#8B0000" },
  { nombre: "Pullman Napoli",        rutas: "Arica Chile - Giros y Encomiendas 05:15",color: "#003087" },
  { nombre: "Linea Sindical Naser",  rutas: "Salidas diarias manana",                 color: "#4B0082" },
];

const CAJEROS = [
  { nombre: "BCP",                 desc: "Banco de Credito Bolivia",     color: "#003087", texto: "#fff", sigla: "BCP" },
  { nombre: "BNB",                 desc: "Banco Nacional de Bolivia",    color: "#E30613", texto: "#fff", sigla: "BNB" },
  { nombre: "BancoSol",            desc: "Banco Solidario",              color: "#F7941D", texto: "#fff", sigla: "SOL" },
  { nombre: "Banco Union",         desc: "Banco Union S.A.",             color: "#005B99", texto: "#fff", sigla: "BU"  },
  { nombre: "Banco Ganadero",      desc: "Banco Ganadero S.A.",          color: "#006633", texto: "#fff", sigla: "BG"  },
  { nombre: "Banco Fie",           desc: "Banco Fie S.A.",               color: "#E30613", texto: "#fff", sigla: "FIE" },
  { nombre: "Bisa",                desc: "Banco Bisa S.A.",              color: "#003087", texto: "#fff", sigla: "BISA"},
  { nombre: "Mercantil Santa Cruz",desc: "Banco Mercantil Santa Cruz",   color: "#009245", texto: "#fff", sigla: "MSC" },
  { nombre: "Banco Economico",     desc: "Banco Economico S.A.",         color: "#8B0000", texto: "#fff", sigla: "ECO" },
];

function MapaTerminal() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.7!2d-68.1936!3d-16.5054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDMwJzE5LjQiUyA2OMKwMTEnMzcuMiJX!5e0!3m2!1ses!2sbo!4v1234567890"
        width="100%" height="380" style={{ border: 0 }} allowFullScreen loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"/>
      <div className="bg-white p-4">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-[#1B2A6B] mt-0.5 shrink-0"/>
          <div>
            <p className="font-semibold text-gray-800">Terminal Metropolitana El Alto</p>
            <p className="text-gray-500 text-sm mt-0.5">Av. Ladislao Cabrera, zona Villa Bolivar "D", El Alto</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Phone size={11}/> +591 75154027</span>
              <span className="flex items-center gap-1"><Mail size={11}/> contacto@terminalmetropolitanaelalto.com.bo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Terminal() {
  const [tab, setTab] = useState("info");
  const [tipoOp, setTipoOp] = useState("nacional");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-56 overflow-hidden">
        <img src="https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/ptinffrf3mbitiijp2wt-1024x576.webp"
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80"; e.target.onerror=null; }}
          alt="Terminal Metropolitana El Alto" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A6B]/90 via-[#1B2A6B]/40 to-transparent"/>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h1 className="text-white font-black text-2xl">Terminal Metropolitana El Alto</h1>
          <p className="text-blue-200 text-sm mt-1">La infraestructura de transporte mas grande y moderna de Bolivia</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-blue-200">
            <span className="flex items-center gap-1"><MapPin size={11}/> Av. Ladislao Cabrera, Villa Bolivar "D"</span>
            <span className="flex items-center gap-1"><Phone size={11}/> +591 75154027</span>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={"flex-1 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 " +
                (tab === t.id ? "border-[#1B2A6B] text-[#1B2A6B]" : "border-transparent text-gray-500 hover:text-gray-700")}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">

          {tab === "info" && (
            <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                <h2 className="font-black text-[#1B2A6B] text-xl mb-3">Entidad Descentralizada Terminal Metropolitana El Alto</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  A mas de 4 mil metros sobre el nivel del mar se levanta imponente la Terminal Metropolitana de El Alto, 
                  construida en 2021 se constituye en la infraestructura futurista mas grande, moderna y segura de Bolivia. 
                  Esta representacion se consolida en el contexto internacional, por ser una referencia en Sud America.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  La construccion de la Terminal Metropolitana El Alto responde a la necesidad de ordenar el transporte 
                  terrestre en la ciudad y mejorar la conectividad con otras infraestructuras como el aeropuerto, 
                  la aduana y el sistema de teleféricos.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                <h3 className="font-bold text-gray-800 mb-4">Instituciones presentes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {INSTITUCIONES.map(inst => (
                    <a key={inst.nombre} href={inst.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                      <img src={inst.logo} alt={inst.nombre} className="w-12 h-10 object-contain shrink-0"
                        onError={e => { e.target.style.display="none"; }}/>
                      <div>
                        <p className="font-bold text-sm text-gray-800">{inst.nombre}</p>
                        <p className="text-xs text-gray-500 leading-tight mt-0.5">{inst.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-3">Contacto y redes sociales</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-[#1B2A6B]"/> Av. Ladislao Cabrera, zona Villa Bolivar "D", El Alto</div>
                  <div className="flex items-center gap-2"><Phone size={14} className="text-[#1B2A6B]"/> +591 75154027</div>
                  <div className="flex items-center gap-2"><Mail size={14} className="text-[#1B2A6B]"/> contacto@terminalmetropolitanaelalto.com.bo</div>
                </div>
                <div className="flex gap-3">
                  {[
                    { icon: "f", label: "Facebook", color: "#1877F2" },
                    { icon: "tt", label: "TikTok", color: "#000" },
                    { icon: "ig", label: "Instagram", color: "#E1306C" },
                    { icon: "wa", label: "WhatsApp", color: "#25D366" },
                  ].map(s => (
                    <div key={s.label} className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer"
                      style={{ background: s.color }}>
                      {s.icon}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === "servicios" && (
            <motion.div key="servicios" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="font-bold text-gray-700 mb-4 text-center">Servicios ofrecidos en la terminal</h3>
              <div className="grid grid-cols-2 gap-3">
                {SERVICIOS.map((s, i) => (
                  <motion.div key={s.nombre} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={"border rounded-2xl p-4 flex flex-col items-center text-center " + s.color}>
                    <img src={s.img} alt={s.nombre} className="w-14 h-14 object-contain mb-2"
                      onError={e => { e.target.style.display="none"; }}/>
                    <p className="font-bold text-sm text-gray-800">{s.nombre}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-tight">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "operadores" && (
            <motion.div key="operadores" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setTipoOp("nacional")}
                  className={"flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all " +
                    (tipoOp === "nacional" ? "bg-[#1B2A6B] text-white" : "bg-gray-100 text-gray-600")}>
                  Nacionales ({OPERADORES_NAC.length})
                </button>
                <button onClick={() => setTipoOp("internacional")}
                  className={"flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all " +
                    (tipoOp === "internacional" ? "bg-[#1B2A6B] text-white" : "bg-gray-100 text-gray-600")}>
                  Internacionales ({OPERADORES_INT.length})
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {(tipoOp === "nacional" ? OPERADORES_NAC : OPERADORES_INT).map((op, i) => (
                  <motion.div key={op.nombre} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex items-center">
                    <div className="w-2 self-stretch" style={{ background: op.color }}/>
                    <div className="flex items-center gap-3 p-4 flex-1">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0"
                        style={{ background: op.color }}>
                        {op.nombre.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{op.nombre}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{op.rutas}</p>
                      </div>
                    </div>
                    <Bus size={16} className="text-gray-300 mr-4 shrink-0"/>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "cajeros" && (
            <motion.div key="cajeros" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-center text-sm text-gray-500 mb-4">{CAJEROS.length} cajeros ATM disponibles</p>
              <div className="grid grid-cols-1 gap-3">
                {CAJEROS.map((cajero, i) => (
                  <motion.div key={cajero.nombre} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                    <div className="w-16 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-sm"
                      style={{ background: cajero.color, color: cajero.texto }}>
                      {cajero.sigla}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{cajero.nombre}</p>
                      <p className="text-xs text-gray-500">{cajero.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-semibold">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
                        24/7
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "mapa" && (
            <motion.div key="mapa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MapaTerminal/>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}