with open("src/pages/Terminal.jsx", "r", encoding="utf-8") as f:
    c = f.read()

# Imagen hero real
c = c.replace(
    'src="https://terminalmetropolitanaelalto.com.bo/wp-content/uploads/2022/05/terminal-el-alto-aerial.jpg"',
    'src="https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/ptinffrf3mbitiijp2wt-1024x576.webp"'
)
c = c.replace(
    'e.target.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80"',
    'e.target.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80"; e.target.onerror=null'
)

# Instituciones con logos reales
old_inst = """const INSTITUCIONES = [
  { nombre: "SEGIP", desc: "Servicio General de Identificacion Personal", color: "#0066CC" },
  { nombre: "SERECI", desc: "Organo Electoral Plurinacional - Tribunal Supremo Electoral", color: "#CC0000" },
  { nombre: "Gob. El Alto", desc: "Gobierno Autonomo Municipal de El Alto", color: "#00A86B" },
  { nombre: "ATT", desc: "Autoridad de Regulacion y Fiscalizacion de Telecomunicaciones", color: "#003366" },
];"""

new_inst = """const INSTITUCIONES = [
  { nombre: "SEGIP", desc: "Servicio General de Identificacion Personal", logo: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/segip.png", url: "https://www.segip.gob.bo/" },
  { nombre: "SERECI", desc: "Organo Electoral Plurinacional - Tribunal Supremo Electoral", logo: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/sereci-e1753715057867.png", url: "#" },
  { nombre: "Gob. El Alto", desc: "Gobierno Autonomo Municipal de El Alto", logo: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/logo-gamea-1024x715.webp", url: "https://www.elalto.gob.bo/" },
  { nombre: "ATT", desc: "Autoridad de Regulacion y Fiscalizacion de Telecomunicaciones", logo: "https://www.terminalmetropolitanaelalto.com.bo/wp-content/uploads/2025/07/att.png", url: "https://www.att.gob.bo/" },
];"""

c = c.replace(old_inst, new_inst)

# Servicios con iconos reales
old_srv = """const SERVICIOS = [
  { icon: "🏪", nombre: "Tiendas",              desc: "Galerias comerciales y tiendas de souvenirs",     color: "bg-blue-50 text-blue-700 border-blue-200" },
  { icon: "🏧", nombre: "Cajeros Automaticos",   desc: "9 cajeros ATM de todos los bancos",               color: "bg-green-50 text-green-700 border-green-200" },
  { icon: "⚖️", nombre: "Servicio de Abogados",  desc: "Asesoria legal para viajeros",                   color: "bg-purple-50 text-purple-700 border-purple-200" },
  { icon: "🚌", nombre: "Salas de Embarque",     desc: "Preembarque 1, 2, 3 y 4 con WiFi",               color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { icon: "🍽️", nombre: "Restaurantes",          desc: "Patio de comidas y cafeterias",                  color: "bg-orange-50 text-orange-700 border-orange-200" },
  { icon: "💊", nombre: "Farmacias",             desc: "Servicio farmaceutico 24hrs",                    color: "bg-red-50 text-red-700 border-red-200" },
  { icon: "🚻", nombre: "Banos Publicos",        desc: "Banos adaptados para personas con discapacidad", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { icon: "🎮", nombre: "Sala de Juegos",        desc: "Entretenimiento para todas las edades",          color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { icon: "🎬", nombre: "Cine",                  desc: "Sala de cine dentro de la terminal",             color: "bg-pink-50 text-pink-700 border-pink-200" },
  { icon: "⛸️", nombre: "Pista de Patinaje",     desc: "Pista de patinaje sobre hielo",                  color: "bg-sky-50 text-sky-700 border-sky-200" },
  { icon: "🏥", nombre: "Consultorio Medico",    desc: "DorSalud - Atencion medica 24hrs",               color: "bg-rose-50 text-rose-700 border-rose-200" },
  { icon: "💪", nombre: "Gimnasio",              desc: "Gimnasio equipado para viajeros",                color: "bg-violet-50 text-violet-700 border-violet-200" },
];"""

new_srv = """const SERVICIOS = [
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
];"""

c = c.replace(old_srv, new_srv)

# Actualizar el render de servicios para usar img en vez de icon emoji
old_render = """                {SERVICIOS.map((s, i) => (
                  <motion.div key={s.nombre} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={"border rounded-2xl p-4 " + s.color}>
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <p className="font-bold text-sm">{s.nombre}</p>
                    <p className="text-xs opacity-75 mt-0.5 leading-tight">{s.desc}</p>
                  </motion.div>
                ))}"""

new_render = """                {SERVICIOS.map((s, i) => (
                  <motion.div key={s.nombre} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={"border rounded-2xl p-4 flex flex-col items-center text-center " + s.color}>
                    <img src={s.img} alt={s.nombre} className="w-14 h-14 object-contain mb-2"
                      onError={e => { e.target.style.display="none"; }}/>
                    <p className="font-bold text-sm text-gray-800">{s.nombre}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-tight">{s.desc}</p>
                  </motion.div>
                ))}"""

c = c.replace(old_render, new_render)

# Actualizar render de instituciones para usar logos reales
old_inst_render = """                  {INSTITUCIONES.map(inst => (
                    <div key={inst.nombre} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0"
                        style={{ background: inst.color }}>
                        {inst.nombre.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">{inst.nombre}</p>
                        <p className="text-xs text-gray-500 leading-tight mt-0.5">{inst.desc}</p>
                      </div>
                    </div>
                  ))}"""

new_inst_render = """                  {INSTITUCIONES.map(inst => (
                    <a key={inst.nombre} href={inst.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                      <img src={inst.logo} alt={inst.nombre} className="w-12 h-10 object-contain shrink-0"
                        onError={e => { e.target.style.display="none"; }}/>
                      <div>
                        <p className="font-bold text-sm text-gray-800">{inst.nombre}</p>
                        <p className="text-xs text-gray-500 leading-tight mt-0.5">{inst.desc}</p>
                      </div>
                    </a>
                  ))}"""

c = c.replace(old_inst_render, new_inst_render)

with open("src/pages/Terminal.jsx", "w", encoding="utf-8") as f:
    f.write(c)
print("OK")