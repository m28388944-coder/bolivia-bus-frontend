with open('src/components/Checkout.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old = '{payMethod && payMethod !== ' + chr(39) + 'efectivo' + chr(39) + ' && <QRDisplay amount={total} method={payMethod}/>}'
new = '{(payMethod === ' + chr(39) + 'qr_bcp' + chr(39) + ' || payMethod === ' + chr(39) + 'libelula' + chr(39) + ') && <QRDisplay amount={total} method={payMethod}/>}'

if old in c:
    c = c.replace(old, new)
    print('Reemplazado OK')
else:
    print('Texto no encontrado, buscando alternativa...')
    print(repr(c[c.find('QRDisplay')-50:c.find('QRDisplay')+60]))

with open('src/components/Checkout.jsx', 'w', encoding='utf-8') as f:
    f.write(c)