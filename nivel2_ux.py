# ── SeatTimer mejorado: circular countdown ───────────────────────────────────
timer = r"""import { useState, useEffect } from 'react';
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
"""

# ── App.jsx mejorado ─────────────────────────────────────────────────────────
app = r"""import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchHero from './components/SearchHero';
import SearchResults from './components/SearchResults';
import SeatMap from './components/SeatMap';
import Checkout from './components/Checkout';
import MyTrips from './components/MyTrips';
import BottomNav from './components/BottomNav';
import { useStore } from './store';
import { ArrowLeft, Bus, MapPin, Clock } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -40 },
};

function StepBar({ step }) {
  const steps = [
    { id: "search",   label: "Buscar" },
    { id: "results",  label: "Horarios" },
    { id: "seats",    label: "Asiento" },
    { id: "checkout", label: "Pago" },
  ];
  const idx = steps.findIndex(s => s.id === step);
  if (step === "search") return null;
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        {steps.slice(1).map((s, i) => {
          const realIdx = i + 1;
          const done    = realIdx < idx;
          const active  = realIdx === idx;
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all " +
                (done ? "bg-green-500 text-white" : active ? "bg-[#1B2A6B] text-white" : "bg-gray-200 text-gray-400")}>
                {done ? "✓" : realIdx}
              </div>
              <span className={"text-xs font-medium hidden sm:block " +
                (active ? "text-[#1B2A6B]" : done ? "text-green-600" : "text-gray-400")}>
                {s.label}
              </span>
              {i < 2 && <div className={"flex-1 h-px " + (done ? "bg-green-400" : "bg-gray-200")}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScheduleCard({ schedule }) {
  if (!schedule) return null;
  const getPrice = (s) => {
    if (s.bus_type === "cama") return s.price_cama;
    if (s.bus_type === "semicama") return s.price_semicama;
    return s.price_normal;
  };
  const fmt = (dt) => new Date(dt).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1B2A6B]/10 rounded-xl flex items-center justify-center">
            <Bus size={20} className="text-[#1B2A6B]"/>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-[#1B2A6B] text-lg">{fmt(schedule.departure_time)}</span>
              <span className="text-gray-400">→</span>
              <span className="font-black text-gray-600 text-lg">{fmt(schedule.arrival_time)}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1"><MapPin size={10}/> {schedule.origin} → {schedule.destination}</span>
              <span className="flex items-center gap-1"><Clock size={10}/> {schedule.duration_hours}h</span>
              <span className="font-medium text-[#1B2A6B]">{schedule.company}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-[#1B2A6B]">Bs. {getPrice(schedule)}</div>
          <div className="text-xs text-gray-400">+ Bs. {schedule.terminal_fee} terminal</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage]                   = useState("search");
  const [step, setStep]                   = useState("search");
  const [results, setResults]             = useState(null);
  const [searchInfo, setSearchInfo]       = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSeat, setSelectedSeat]   = useState(null);
  const [loading, setLoading]             = useState(false);
  const { addBooking } = useStore();

  const handleResults      = (data, info) => { setResults(data); setSearchInfo(info); setStep("results"); };
  const handleSelectSchedule = (s)        => { setSelectedSchedule(s); setStep("seats"); };
  const handleSelectSeat   = (seat)       => setSelectedSeat(seat);
  const handleCheckout     = ()           => { if (selectedSeat) setStep("checkout"); };
  const handleBack         = () => {
    if (step === "checkout") setStep("seats");
    else if (step === "seats") { setStep("results"); setSelectedSeat(null); }
    else { setStep("search"); setResults(null); }
  };
  const handleBookingComplete = (booking) => {
    addBooking({ ...booking, origin: selectedSchedule?.origin, destination: selectedSchedule?.destination, company: selectedSchedule?.company, seat_number: selectedSeat?.seat_number });
  };
  const goSearch = () => { setPage("search"); setStep("search"); };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <StepBar step={step}/>
      <AnimatePresence mode="wait">
        {page === "search" && (
          <motion.div key={"search-" + step} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>

            {step === "search" && <SearchHero onResults={handleResults}/>}

            {step === "results" && (
              <div>
                <div className="max-w-4xl mx-auto px-4 pt-4">
                  <button onClick={handleBack} className="flex items-center gap-1.5 text-[#1B2A6B] text-sm font-semibold hover:gap-2.5 transition-all mb-2">
                    <ArrowLeft size={16}/> Nueva busqueda
                  </button>
                </div>
                <SearchResults results={results} searchInfo={searchInfo} onSelect={handleSelectSchedule} loading={loading}/>
              </div>
            )}

            {step === "seats" && (
              <div className="max-w-4xl mx-auto px-4 py-6">
                <button onClick={handleBack} className="flex items-center gap-1.5 text-[#1B2A6B] text-sm font-semibold hover:gap-2.5 transition-all mb-4">
                  <ArrowLeft size={16}/> Volver a horarios
                </button>
                <ScheduleCard schedule={selectedSchedule}/>
                <SeatMap schedule={selectedSchedule} onSeatSelected={handleSelectSeat}/>
                <AnimatePresence>
                  {selectedSeat && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                      className="text-center mt-6">
                      <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        ✓ Asiento {selectedSeat.seat_number} seleccionado
                      </div>
                      <br/>
                      <motion.button onClick={handleCheckout}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-[#1B2A6B] to-[#2d45a8] text-white font-bold px-12 py-4 rounded-2xl text-lg shadow-lg hover:from-[#D4AF37] hover:to-[#c49b2e] hover:text-[#1B2A6B] transition-all">
                        Continuar al Pago →
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {step === "checkout" && (
              <Checkout schedule={selectedSchedule} seat={selectedSeat} onBack={handleBack} onComplete={handleBookingComplete}/>
            )}
          </motion.div>
        )}

        {page === "trips" && (
          <motion.div key="trips-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="bg-gradient-to-r from-[#1B2A6B] to-[#2d45a8] px-6 py-8 text-white">
              <h1 className="text-2xl font-black">Bolivia <span className="text-[#D4AF37]">Bus</span></h1>
              <p className="text-blue-200 text-sm">Historial de viajes</p>
            </div>
            <MyTrips onSearch={goSearch}/>
          </motion.div>
        )}

        {page === "tracking" && (
          <motion.div key="tracking-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="bg-gradient-to-r from-[#1B2A6B] to-[#2d45a8] px-6 py-8 text-white">
              <h1 className="text-2xl font-black">Bolivia <span className="text-[#D4AF37]">Bus</span></h1>
              <p className="text-blue-200 text-sm">Rastreo de tu bus en tiempo real</p>
            </div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-[#1B2A6B]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bus size={32} className="text-[#1B2A6B]"/>
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-2">Rastreo disponible con tu ticket</p>
              <p className="text-sm text-gray-400 mb-6">Compra tu pasaje para ver la ubicacion de tu bus en tiempo real</p>
              <button onClick={goSearch}
                className="bg-[#1B2A6B] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#D4AF37] hover:text-[#1B2A6B] transition-all">
                Comprar pasaje
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-[#1B2A6B] text-white text-center py-6 mt-12 text-sm hidden md:block">
        <p>Bolivia Bus © 2026 | Sistema Integral de Ticketing Terrestre</p>
        <p className="text-[#D4AF37] mt-1">La Paz · Cochabamba · Santa Cruz · Oruro · Potosi · Sucre · Tarija</p>
      </footer>
      <BottomNav active={page} onNav={setPage}/>
    </div>
  );
}
"""

open(r"src\components\SeatTimer.jsx", "w", encoding="utf-8").write(timer)
print("OK: SeatTimer")
open(r"src\App.jsx", "w", encoding="utf-8").write(app)
print("OK: App.jsx")
print("\nNivel 2 completado!")