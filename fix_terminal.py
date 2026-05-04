with open("src/pages/Terminal.jsx", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace(
    "import { MapPin, Clock, Phone, Mail, Bus, Banknote, Heart, Coffee, Dumbbell, ShoppingBag, Info, Star, Facebook, ExternalLink } from \"lucide-react\";",
    "import { MapPin, Clock, Phone, Mail, Bus, Banknote, ExternalLink } from \"lucide-react\";"
)

with open("src/pages/Terminal.jsx", "w", encoding="utf-8") as f:
    f.write(c)
print("OK")