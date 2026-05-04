content = open(r"src\components\SeatMap.jsx", "r", encoding="utf-8").read()

# Extraer todo desde FloorMap en adelante (lo que esta bien)
floor_start = content.find("\nfunction FloorMap")
tail = content[floor_start:]

# Construir SeatButton correcto
seat_button = """
function SeatButton({ seat, isSelected, isRecommended, onClick }) {
  const status = isSelected ? "selected" : isRecommended ? "recommended" : seat.status;
  const isAvail = seat.status === "available";
  return (
    <motion.button
      whileHover={isAvail ? { scale: 1.08, y: -2 } : {}}
      whileTap={isAvail ? { scale: 0.95 } : {}}
      onClick={() => isAvail && onClick(seat)}
      disabled={!isAvail}
      title={seat.seat_number + " - " + seat.status}
      className={"transition-all duration-150 " + (isAvail ? "cursor-pointer" : "cursor-not-allowed opacity-70")}>
      <SeatSVG
        status={status}
        floor={seat.floor}
        seatNum={seat.seat_number}
        isSelected={isSelected}
        isRecommended={isRecommended}
      />
    </motion.button>
  );
}
"""

# Header limpio
header = """import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSeatMap } from '../api';
import SeatTimer from './SeatTimer';
import { Star } from 'lucide-react';

const STATUS_CONFIG = {
  available:   { cursor: "cursor-pointer" },
  occupied:    { cursor: "cursor-not-allowed" },
  reserved:    { cursor: "cursor-not-allowed" },
  selected:    { cursor: "cursor-pointer" },
  recommended: { cursor: "cursor-pointer" },
};

function SeatSVG({ status, floor, seatNum, isSelected, isRecommended }) {
  const colors = {
    available:   { body: "#e8eeff", border: "#1B2A6B", text: "#1B2A6B" },
    occupied:    { body: "#e5e7eb", border: "#9ca3af", text: "#9ca3af" },
    reserved:    { body: "#fef3c7", border: "#f59e0b", text: "#b45309" },
    selected:    { body: "#1B2A6B", border: "#1B2A6B", text: "#ffffff" },
    recommended: { body: "#dcfce7", border: "#22c55e", text: "#15803d" },
  };
  const c = colors[status] || colors.occupied;
  return (
    <svg width="48" height="52" viewBox="0 0 48 52" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="2" width="36" height="26" rx="6" fill={c.body} stroke={c.border} strokeWidth="2"/>
      <rect x="10" y="4" width="28" height="8" rx="4" fill={c.border} opacity="0.15"/>
      <rect x="4" y="26" width="40" height="16" rx="5" fill={c.body} stroke={c.border} strokeWidth="2"/>
      <rect x="1" y="24" width="5" height="18" rx="3" fill={c.border} opacity="0.3"/>
      <rect x="42" y="24" width="5" height="18" rx="3" fill={c.border} opacity="0.3"/>
      <rect x="8" y="42" width="5" height="8" rx="2" fill={c.border} opacity="0.4"/>
      <rect x="35" y="42" width="5" height="8" rx="2" fill={c.border} opacity="0.4"/>
      <text x="24" y="38" textAnchor="middle" fontSize="9" fontWeight="bold" fill={c.text}>{seatNum}</text>
      {isSelected && <text x="24" y="19" textAnchor="middle" fontSize="13" fill="#ffffff">&#10003;</text>}
      {isRecommended && !isSelected && <circle cx="38" cy="6" r="6" fill="#22c55e"/>}
    </svg>
  );
}
"""

# FloorMap con texto limpio
tail_clean = tail.replace(
    "ðŸšŒ FRENTE DEL BUS \u2014 PISO",
    "FRENTE DEL BUS - PISO"
)

new_content = header + seat_button + tail_clean
open(r"src\components\SeatMap.jsx", "w", encoding="utf-8").write(new_content)
print("OK: SeatMap reescrito limpio")