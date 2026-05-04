# ── MyTrips mejorado ─────────────────────────────────────────────────────────
mytrips = r"""import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Download, Share2, MapPin, RefreshCw, Bus, User, Hash } from 'lucide-react';
import { useStore } from '../store';
import { downloadPDF } from '../api';

export default function MyTrips({ onSearch }) {
  const { bookings } = useStore();

  const handleDownload = async (bookingId) => {
    try {
      const res = await downloadPDF(bookingId);
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url; a.download = "ticket_boliviabus.pdf"; a.click();
    } catch { alert("Error al descargar"); }
  };

  const handleWhatsApp = (b) => {
    const msg = encodeURIComponent(
      "Bolivia Bus - Mi Ticket\n\n" +
      "Pasajero: " + b.passenger_name + "\n" +
      "Ruta: " + (b.origin || "?") + " -> " + (b.destination || "?") + "\n" +
      "Asiento: " + (b.seat_number || "-") + "\n" +
      "Total: Bs. " + b.total_price + "\n\n" +
      "Ticket: http://boliviabus.bo/ticket/" + b.id
    );
    window.open("https://wa.me/?text=" + msg, "_blank");
  };

  if (bookings.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Ticket size={40} className="text-gray-300"/>
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No tienes viajes aun</h3>
        <p className="text-gray-400 mb-6">Tus tickets apareceran aqui despues de comprar</p>
        <button onClick={onSearch}
          className="bg-[#1B2A6B] text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 mx-auto hover:bg-[#D4AF37] hover:text-[#1B2A6B] transition-all">
          <MapPin size={16}/> Buscar mi primer viaje
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#1B2A6B]">Mis Viajes</h2>
        <span className="bg-[#1B2A6B] text-white text-xs px-3 py-1 rounded-full font-bold">
          {bookings.length} ticket{bookings.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex flex-col gap-5">
        <AnimatePresence>
          {bookings.map((b, i) => (
            <motion.div key={b.id || i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

              {/* Header tipo boarding pass */}
              <div className="bg-gradient-to-r from-[#1B2A6B] to-[#2d45a8] px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-white font-black text-lg">
                      <span>{b.origin || "?"}</span>
                      <span className="text-[#D4AF37]">→</span>
                      <span>{b.destination || "?"}</span>
                    </div>
                    <p className="text-blue-300 text-xs mt-0.5">
                      {b.savedAt ? new Date(b.savedAt).toLocaleDateString("es-BO", { day:"2-digit", month:"long", year:"numeric" }) : "Reciente"}
                    </p>
                  </div>
                  <div className={"text-xs px-3 py-1.5 rounded-full font-bold " +
                    (b.status === "confirmed" ? "bg-green-500 text-white" : "bg-amber-500 text-white")}>
                    {b.status === "confirmed" ? "Confirmado" : b.status}
                  </div>
                </div>
              </div>

              {/* Separador tipo ticket perforado */}
              <div className="relative flex items-center bg-white">
                <div className="w-5 h-5 rounded-full bg-gray-100 -ml-2.5 shrink-0 border border-gray-200"/>
                <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-1"/>
                <div className="w-5 h-5 rounded-full bg-gray-100 -mr-2.5 shrink-0 border border-gray-200"/>
              </div>

              {/* Datos del ticket */}
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4 text-sm mb-5">
                  <div className="flex items-start gap-2">
                    <User size={14} className="text-gray-400 mt-0.5 shrink-0"/>
                    <div>
                      <p className="text-gray-400 text-xs">Pasajero</p>
                      <p className="font-semibold text-gray-800">{b.passenger_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Hash size={14} className="text-gray-400 mt-0.5 shrink-0"/>
                    <div>
                      <p className="text-gray-400 text-xs">Asiento</p>
                      <p className="font-semibold text-gray-800">{b.seat_number || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Bus size={14} className="text-gray-400 mt-0.5 shrink-0"/>
                    <div>
                      <p className="text-gray-400 text-xs">Empresa</p>
                      <p className="font-semibold text-gray-800">{b.company || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Ticket size={14} className="text-[#1B2A6B] mt-0.5 shrink-0"/>
                    <div>
                      <p className="text-gray-400 text-xs">Total pagado</p>
                      <p className="font-black text-[#1B2A6B] text-base">Bs. {b.total_price}</p>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleDownload(b.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#1B2A6B] text-white text-sm py-2.5 rounded-xl font-semibold hover:bg-[#162259] transition-all">
                    <Download size={14}/> PDF
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleWhatsApp(b)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 text-white text-sm py-2.5 rounded-xl font-semibold hover:bg-green-600 transition-all">
                    <Share2 size={14}/> WhatsApp
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={onSearch}
                    className="flex items-center justify-center gap-1 border-2 border-[#1B2A6B] text-[#1B2A6B] text-sm px-3 py-2.5 rounded-xl font-semibold hover:bg-[#1B2A6B] hover:text-white transition-all">
                    <RefreshCw size={14}/>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
"""

# ── BottomNav mejorado ────────────────────────────────────────────────────────
bottomnav = r"""import { motion } from 'framer-motion';
import { Search, Ticket, Bus } from 'lucide-react';
import { useStore } from '../store';

const NAV_ITEMS = [
  { id: "search",   label: "Buscar",    icon: Search },
  { id: "trips",    label: "Mis Viajes", icon: Ticket },
  { id: "tracking", label: "Rastreo",   icon: Bus },
];

export default function BottomNav({ active, onNav }) {
  const { bookings } = useStore();
  return (
    <motion.div
      initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: "spring", bounce: 0.3, delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl z-50 md:hidden">
      <div className="flex items-center justify-around px-2 py-1.5 pb-safe">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => onNav(id)}
              className="flex flex-col items-center gap-0.5 px-5 py-2 rounded-2xl transition-all relative min-w-[72px]">
              {isActive && (
                <motion.div layoutId="nav-pill"
                  className="absolute inset-0 bg-[#1B2A6B]/10 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}/>
              )}
              <motion.div
                animate={isActive ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="relative">
                <Icon size={22} color={isActive ? "#1B2A6B" : "#9CA3AF"}/>
                {id === "trips" && bookings.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-black">
                    {bookings.length > 9 ? "9+" : bookings.length}
                  </motion.span>
                )}
              </motion.div>
              <span className={"text-[10px] font-bold transition-colors " + (isActive ? "text-[#1B2A6B]" : "text-gray-400")}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
"""

open(r"src\components\MyTrips.jsx",  "w", encoding="utf-8").write(mytrips)
print("OK: MyTrips")
open(r"src\components\BottomNav.jsx", "w", encoding="utf-8").write(bottomnav)
print("OK: BottomNav")
print("\nNivel 3 completado!")