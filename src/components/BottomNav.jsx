import { motion } from 'framer-motion';
import { Search, Ticket, Bus, MapPin } from 'lucide-react';
import { useStore } from '../store';

const NAV_ITEMS = [
  { id: "search",   label: "Buscar",    icon: Search },
  { id: "trips",    label: "Mis Viajes", icon: Ticket },
  { id: "tracking", label: "Rastreo",   icon: Bus },
  { id: "terminal", label: "Terminal",  icon: MapPin },
];

export default function BottomNav({ active, onNav }) {
  const { bookings } = useStore();
  return (
    <motion.div
      initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: "spring", bounce: 0.3, delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl z-50 ">
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
