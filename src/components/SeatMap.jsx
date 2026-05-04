import { motion } from "framer-motion";
import { Star } from "lucide-react";

function SeatSVG({ status, seatNum }) {
  const colors = {
    available:  { body: "#e8eeff", border: "#1B2A6B", text: "#1B2A6B" },
    occupied:   { body: "#e5e7eb", border: "#9ca3af", text: "#9ca3af" },
    selected:   { body: "#1B2A6B", border: "#1B2A6B", text: "#ffffff" },
  };
  const c = colors[status] || colors.occupied;
  return (
    <svg width="44" height="48" viewBox="0 0 48 52" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="2" width="36" height="26" rx="6" fill={c.body} stroke={c.border} strokeWidth="2"/>
      <rect x="10" y="4" width="28" height="8" rx="4" fill={c.border} opacity="0.15"/>
      <rect x="4" y="26" width="40" height="16" rx="5" fill={c.body} stroke={c.border} strokeWidth="2"/>
      <rect x="1"  y="24" width="5" height="18" rx="3" fill={c.border} opacity="0.3"/>
      <rect x="42" y="24" width="5" height="18" rx="3" fill={c.border} opacity="0.3"/>
      <rect x="8" y="42" width="10" height="8" rx="3" fill={c.border} opacity="0.2"/>
      <rect x="30" y="42" width="10" height="8" rx="3" fill={c.border} opacity="0.2"/>
      <text x="24" y="38" textAnchor="middle" fontSize="10" fontWeight="700" fill={c.text}>{seatNum}</text>
    </svg>
  );
}

export default function SeatMap({ seats = [], onSeatSelected, selectedSeats = [] }) {
  if (!seats.length) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
        <div className="animate-spin w-8 h-8 border-2 border-[#1B2A6B] border-t-transparent rounded-full mx-auto mb-3"/>
        Cargando asientos...
      </div>
    );
  }

  const selectedIds = new Set(selectedSeats.map(s => s.id));
  const filas = [...new Set(seats.map(s => s.fila))].sort();

  const getStatus = (seat) => {
    if (selectedIds.has(seat.id)) return "selected";
    if (!seat.disponible) return "occupied";
    return "available";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-[#1B2A6B] text-lg mb-6 text-center">Selecciona tu asiento</h3>

      <div className="bg-gray-100 rounded-xl p-2 text-center text-xs text-gray-500 font-semibold mb-6 mx-auto max-w-xs">
        🚌 FRENTE DEL BUS
      </div>

      <div className="flex flex-col gap-2 items-center mb-6">
        {filas.map(fila => {
          const asientosFila = seats.filter(s => s.fila === fila).sort((a, b) => a.columna - b.columna);
          const izq = asientosFila.filter(s => s.columna <= 2);
          const der = asientosFila.filter(s => s.columna > 2);
          return (
            <div key={fila} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-4 text-center font-bold">{fila}</span>
              <div className="flex gap-1">
                {izq.map(seat => (
                  <motion.div key={seat.id}
                    whileHover={seat.disponible ? { scale: 1.1 } : {}}
                    whileTap={seat.disponible ? { scale: 0.95 } : {}}
                    onClick={() => seat.disponible && onSeatSelected(seat)}
                    className={seat.disponible ? "cursor-pointer" : "cursor-not-allowed opacity-60"}>
                    <SeatSVG status={getStatus(seat)} seatNum={seat.numero}/>
                  </motion.div>
                ))}
              </div>
              <div className="w-6"/>
              <div className="flex gap-1">
                {der.map(seat => (
                  <motion.div key={seat.id}
                    whileHover={seat.disponible ? { scale: 1.1 } : {}}
                    whileTap={seat.disponible ? { scale: 0.95 } : {}}
                    onClick={() => seat.disponible && onSeatSelected(seat)}
                    className={seat.disponible ? "cursor-pointer" : "cursor-not-allowed opacity-60"}>
                    <SeatSVG status={getStatus(seat)} seatNum={seat.numero}/>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-gray-500 border-t pt-4">
        <div className="flex items-center gap-1.5">
          <SeatSVG status="available" seatNum=""/>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <SeatSVG status="selected" seatNum=""/>
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <SeatSVG status="occupied" seatNum=""/>
          <span>Ocupado</span>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-4 p-3 bg-[#1B2A6B]/5 rounded-xl text-center">
          <span className="text-sm font-semibold text-[#1B2A6B]">
            ✓ Asientos: {selectedSeats.map(s => s.numero).join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}