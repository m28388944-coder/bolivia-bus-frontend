with open("src/pages/Home.jsx", "r", encoding="utf-8") as f:
    c = f.read()

# Quitar boton Ida y Vuelta
c = c.replace("""            <div className="flex gap-2 mb-4">
              <button className="flex-1 py-2 text-sm font-semibold bg-[#1B2A6B] text-white rounded-xl">Solo ida</button>
              <button className="flex-1 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Ida y Vuelta</button>
            </div>""", "")

# Corregir Terminal El Alto en navbar - usar button con onClick
c = c.replace(
    '<button onClick={onTerminal} className="hover:text-[#D4AF37] transition-colors">Terminal El Alto</button>',
    '<button onClick={onTerminal} className="hover:text-[#D4AF37] transition-colors font-medium">Terminal El Alto</button>'
)

with open("src/pages/Home.jsx", "w", encoding="utf-8") as f:
    f.write(c)
print("OK")