with open('src/components/Checkout.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old = "function QRDisplay({ amount, method }) {"
card_component = '''function CardForm({ amount, onConfirm, paying }) {
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const fmt = (v) => v.replace(/\\D/g,'').replace(/(\\d{4})/g,' ').trim().slice(0,19);
  const fmtExp = (v) => v.replace(/\\D/g,'').replace(/(\\d{2})(\\d)/,'/').slice(0,5);
  return (
    <div className="bg-white rounded-xl border-2 border-[#1B2A6B] p-5">
      <div className="bg-gradient-to-r from-[#1B2A6B] to-[#162259] rounded-xl p-4 mb-4 text-white">
        <p className="text-xs text-blue-300 mb-3">Libélula — Pago Seguro</p>
        <p className="text-xl font-mono tracking-widest">{card.number || '•••• •••• •••• ••••'}</p>
        <div className="flex justify-between mt-3 text-sm">
          <span>{card.name || 'NOMBRE TITULAR'}</span>
          <span>{card.expiry || 'MM/AA'}</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Número de tarjeta</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
            placeholder="1234 5678 9012 3456" maxLength={19}
            value={card.number} onChange={e=>setCard({...card,number:fmt(e.target.value)})}/>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Nombre del titular</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="JUAN QUISPE" value={card.name}
            onChange={e=>setCard({...card,name:e.target.value.toUpperCase()})}/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Vencimiento</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="MM/AA" maxLength={5}
              value={card.expiry} onChange={e=>setCard({...card,expiry:fmtExp(e.target.value)})}/>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">CVV</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="123" maxLength={4} type="password"
              value={card.cvv} onChange={e=>setCard({...card,cvv:e.target.value.replace(/\\D/g,'').slice(0,4)})}/>
          </div>
        </div>
        <p className="text-center font-bold text-[#1B2A6B] text-lg">Total: Bs. {amount.toFixed(2)}</p>
        <button onClick={onConfirm} disabled={paying}
          className="w-full bg-[#1B2A6B] hover:bg-[#162259] text-white font-bold py-3 rounded-xl">
          {paying ? 'Procesando...' : '💳 Pagar con Tarjeta'}
        </button>
      </div>
    </div>
  );
}

'''
c = c.replace(old, card_component + old)

old2 = "{(payMethod === 'qr_bcp' || payMethod === 'libelula') && <QRDisplay amount={total} method={payMethod}/>}"
new2 = "{payMethod === 'qr_bcp' && <QRDisplay amount={total} method={payMethod}/>}\n          {payMethod === 'libelula' && <CardForm amount={total} onConfirm={handlePay} paying={paying}/>}"
c = c.replace(old2, new2)

old3 = "{payMethod && (\n            <button onClick={handlePay} disabled={paying} className=\"w-full mt-4 bg-[#1B2A6B] hover:bg-[#162259] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2\">\n              {paying ? 'Verificando pago...' : '✅ Confirmar Pago'}\n            </button>\n          )}"
new3 = "{payMethod && payMethod !== 'libelula' && payMethod !== 'efectivo' && (\n            <button onClick={handlePay} disabled={paying} className=\"w-full mt-4 bg-[#1B2A6B] hover:bg-[#162259] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2\">\n              {paying ? 'Verificando pago...' : '✅ Confirmar Pago'}\n            </button>\n          )}\n          {payMethod === 'efectivo' && (\n            <button onClick={handlePay} disabled={paying} className=\"w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl\">\n              {paying ? 'Procesando...' : '✅ Confirmar Reserva'}\n            </button>\n          )}"
c = c.replace(old3, new3)

with open('src/components/Checkout.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
print('OK: Checkout.jsx actualizado con formulario de tarjeta')