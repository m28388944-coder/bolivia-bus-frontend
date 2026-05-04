with open(r"src\components\SeatMap.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Encontrar donde empieza el SeatButton nuevo (el bueno)
start = content.find("function SeatButton")
# Encontrar donde empieza el SeatButton viejo (el malo) - segunda ocurrencia
second = content.find("}) {", start)
# Encontrar el final del SeatButton viejo
end = content.find("\nfunction FloorMap", second)

# Reconstruir: todo antes del SeatButton + SeatButton nuevo + resto desde FloorMap
new_content = content[:start] + content[start:second+1].rstrip() + "\n" + content[end:]

with open(r"src\components\SeatMap.jsx", "w", encoding="utf-8") as f:
    f.write(new_content)
print("OK: SeatMap limpio")