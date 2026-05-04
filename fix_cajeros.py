with open("src/pages/Terminal.jsx", "r", encoding="utf-8") as f:
    c = f.read()

old = """const CAJEROS = [
  { nombre: "BCP",                 desc: "Banco de Credito Bolivia",         horario: "08:00-20:00" },
  { nombre: "BNB",                 desc: "Banco Nacional de Bolivia",        horario: "08:00-20:00" },
  { nombre: "BancoSol",            desc: "Banco Solidario",                  horario: "08:30-19:30" },
  { nombre: "Banco Union",         desc: "Banco Union S.A.",                 horario: "08:00-18:00" },
  { nombre: "Banco Ganadero",      desc: "Banco Ganadero S.A.",              horario: "09:00-18:00" },
  { nombre: "Banco Fie",           desc: "Banco Fie S.A.",                   horario: "08:30-19:00" },
  { nombre: "Bisa",                desc: "Banco Bisa S.A.",                  horario: "09:00-19:00" },
  { nombre: "Mercantil Santa Cruz",desc: "Banco Mercantil Santa Cruz",       horario: "08:00-20:00" },
  { nombre: "Banco Economico",     desc: "Banco Economico S.A.",             horario: "09:00-18:00" },
];"""

new = """const CAJEROS = [
  { nombre: "BCP",                 desc: "Banco de Credito Bolivia",     color: "#003087", texto: "#fff", sigla: "BCP" },
  { nombre: "BNB",                 desc: "Banco Nacional de Bolivia",    color: "#E30613", texto: "#fff", sigla: "BNB" },
  { nombre: "BancoSol",            desc: "Banco Solidario",              color: "#F7941D", texto: "#fff", sigla: "SOL" },
  { nombre: "Banco Union",         desc: "Banco Union S.A.",             color: "#005B99", texto: "#fff", sigla: "BU"  },
  { nombre: "Banco Ganadero",      desc: "Banco Ganadero S.A.",          color: "#006633", texto: "#fff", sigla: "BG"  },
  { nombre: "Banco Fie",           desc: "Banco Fie S.A.",               color: "#E30613", texto: "#fff", sigla: "FIE" },
  { nombre: "Bisa",                desc: "Banco Bisa S.A.",              color: "#003087", texto: "#fff", sigla: "BISA"},
  { nombre: "Mercantil Santa Cruz",desc: "Banco Mercantil Santa Cruz",   color: "#009245", texto: "#fff", sigla: "MSC" },
  { nombre: "Banco Economico",     desc: "Banco Economico S.A.",         color: "#8B0000", texto: "#fff", sigla: "ECO" },
];"""

c = c.replace(old, new)

old_render = """              <div className="flex flex-col gap-3">
                {CAJEROS.map((c, i) => (
                  <motion.div key={c.nombre} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                      <Banknote size={24} className="text-green-600"/>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{c.nombre}</p>
                      <p className="text-xs text-gray-500">{c.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={10}/> {c.horario}
                    </div>
                  </motion.div>
                ))}
              </div>"""

new_render = """              <div className="grid grid-cols-1 gap-3">
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
              </div>"""

c = c.replace(old_render, new_render)

with open("src/pages/Terminal.jsx", "w", encoding="utf-8") as f:
    f.write(c)
print("OK")