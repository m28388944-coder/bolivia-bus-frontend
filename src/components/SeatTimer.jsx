import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Zap } from 'lucide-react';

export default function SeatTimer({ onExpire }) {
  const [seconds, setSeconds] = useState(15 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(interval); onExpire && onExpire(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const pct = seconds / (15 * 60);
  const isWarning = seconds < 180;
  const isDanger  = seconds < 60;

  const radius = 28;
  const circ   = 2 * Math.PI * radius;
  const dash   = circ * pct;

  const color  = isDanger ? "#ef4444" : isWarning ? "#f59e0b" : "#1B2A6B";
  const bgCard = isDanger ? "bg-red-50 border-red-400" : isWarning ? "bg-amber-50 border-amber-400" : "bg-blue-50 border-[#1B2A6B]";
  const label  = isDanger ? "Tiempo casi agotado!" : isWarning ? "Apurate, poco tiempo!" : "Asiento reservado temporalmente";
  const Icon   = isDanger ? Zap : isWarning ? AlertTriangle : Clock;

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className={"rounded-2xl p-4 mb-4 border-2 " + bgCard}>
      <div className="flex items-center gap-4">
        {/* Circular countdown */}
        <motion.div
          animate={isDanger ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="relative shrink-0">
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="5"/>
            <motion.circle
              cx="36" cy="36" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ - dash}
              style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
              transition={{ duration: 0.8 }}
            />
            <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="bold" fill={color}>
              {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
            </text>
          </svg>
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Icon size={16} style={{ color }} className={isDanger ? "animate-bounce" : ""}/>
            <span className="text-sm font-bold" style={{ color }}>{label}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <motion.div
              className="h-2 rounded-full transition-all duration-1000"
              style={{ width: (pct * 100) + "%", backgroundColor: color }}
            />
          </div>
          <p className="text-xs text-gray-500">El asiento se libera si no completas la compra</p>
        </div>
      </div>
    </motion.div>
  );
}
