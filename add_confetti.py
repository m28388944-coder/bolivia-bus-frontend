with open('src/components/Checkout.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old = "import { User, Download, CheckCircle, QrCode, CreditCard, ArrowLeft } from 'lucide-react';"
new = "import { User, Download, CheckCircle, QrCode, CreditCard, ArrowLeft } from 'lucide-react';\nimport confetti from 'canvas-confetti';"
c = c.replace(old, new)

old2 = "    setPaying(false);\n    setStep(3);"
new2 = "    setPaying(false);\n    setStep(3);\n    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#1B2A6B', '#D4AF37', '#C8102E'] });"
c = c.replace(old2, new2)

with open('src/components/Checkout.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
print('OK: confetti agregado')