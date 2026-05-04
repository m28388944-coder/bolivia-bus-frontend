import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import SearchResults from "./components/SearchResults";
import SeatMap from "./components/SeatMap";
import Checkout from "./components/Checkout";
import Terminal from "./pages/Terminal";
import MyTrips from "./components/MyTrips";
import useSearchStore from "./stores/searchStore";
import useBookingStore from "./stores/bookingStore";
import { adaptSchedule } from "./api/adapters";
import { ArrowLeft, Bus, MapPin, Clock } from "lucide-react";

const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -40 },
};

function StepBar({ step, onBack }) {
  const steps = [
    { id: "home",     label: "Inicio" },
    { id: "results",  label: "Horarios" },
    { id: "seats",    label: "Asiento" },
    { id: "checkout", label: "Pago" },
  ];
  const idx = steps.findIndex(s => s.id === step);
  if (step === "home") return null;
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-1 text-[#1B2A6B] text-sm font-semibold">
          <ArrowLeft size={16}/>
        </button>
        <div className="flex items-center gap-2 flex-1">
          {steps.slice(1).map((s, i) => {
            const realIdx = i + 1;
            const done   = realIdx < idx;
            const active = realIdx === idx;
            return (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className={"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 " +
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
    </div>
  );
}

function ScheduleCard({ schedule }) {
  if (!schedule) return null;
  const fmt = (dt) => new Date(dt).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1B2A6B]/10 rounded-xl flex items-center justify-center">
            <Bus size={20} className="text-[#1B2A6B]"/>
          </div>
          <div>
            <div className="flex items-center gap-2 font-black text-[#1B2A6B] text-lg">
              <span>{fmt(schedule.departure_time)}</span>
              <span className="text-gray-400">→</span>
              <span className="text-gray-600">{fmt(schedule.arrival_time)}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1"><MapPin size={10}/> {schedule.origin} → {schedule.destination}</span>
              <span className="flex items-center gap-1"><Clock size={10}/> {schedule.duration_hours}h</span>
              <span className="font-medium text-[#1B2A6B]">{schedule.company}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-[#1B2A6B]">Bs. {schedule.price_normal}</div>
          <div className="text-xs text-gray-400 capitalize">{schedule.bus_type}</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [step, setStep] = useState("home");
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const { resultados, buscar, seleccionarSchedule, asientos, loading } = useSearchStore();
  const { toggleAsiento, asientosSeleccionados, limpiar } = useBookingStore();

  const adaptedResults = resultados.map(adaptSchedule);

  const handleSearch = async (origen, destino, fecha) => {
    await buscar(origen, destino, fecha);
    setPage("booking");
    setStep("results");
  };

  const handleSelectSchedule = async (adapted) => {
    setSelectedSchedule(adapted);
    await seleccionarSchedule(adapted._raw);
    setStep("seats");
  };

  const handleSelectSeat = (seat) => {
    if (!seat.disponible) return;
    toggleAsiento(seat);
  };

  const handleCheckout = () => {
    if (asientosSeleccionados.length > 0) setStep("checkout");
  };

  const handleBack = () => {
    if (step === "checkout")     setStep("seats");
    else if (step === "seats")   setStep("results");
    else if (step === "results") { setPage("home"); setStep("home"); }
    else                         { setPage("home"); setStep("home"); }
  };

  const handleBookingComplete = () => {
    setPage("trips");
    setStep("home");
    limpiar();
  };

  const goHome = () => { setPage("home"); setStep("home"); };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">

        {page === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Home onSearch={handleSearch} onTerminal={() => setPage("terminal")}/>
          </motion.div>
        )}

        {page === "booking" && (
          <motion.div key={"booking-" + step} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <StepBar step={step} onBack={handleBack}/>
            <div className="max-w-4xl mx-auto px-4 py-6">

              {step === "results" && (
                <SearchResults results={adaptedResults} loading={loading} onSelect={handleSelectSchedule}/>
              )}

              {step === "seats" && (
                <>
                  <ScheduleCard schedule={selectedSchedule}/>
                  <SeatMap seats={asientos} onSeatSelected={handleSelectSeat} selectedSeats={asientosSeleccionados}/>
                  <AnimatePresence>
                    {asientosSeleccionados.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-center mt-6">
                        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                          ✓ {asientosSeleccionados.length} asiento(s) seleccionado(s)
                        </div>
                        <br/>
                        <motion.button onClick={handleCheckout}
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className="bg-[#D4AF37] hover:bg-[#c49b2e] text-[#1B2A6B] font-black px-12 py-4 rounded-2xl text-lg shadow-lg">
                          Continuar al Pago →
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {step === "checkout" && (
                <Checkout schedule={selectedSchedule} seats={asientosSeleccionados}
                  onBack={handleBack} onComplete={handleBookingComplete}/>
              )}
            </div>
          </motion.div>
        )}

        {page === "terminal" && (
          <motion.div key="terminal" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="bg-[#1B2A6B] px-6 py-4 flex items-center gap-3">
              <button onClick={goHome} className="text-white hover:text-[#D4AF37] transition-colors">
                <ArrowLeft size={20}/>
              </button>
              <span className="text-white font-bold">Terminal Metropolitana El Alto</span>
            </div>
            <Terminal/>
          </motion.div>
        )}

        {page === "trips" && (
          <motion.div key="trips" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="bg-gradient-to-r from-[#1B2A6B] to-[#2d45a8] px-6 py-8 text-white flex items-center gap-4">
              <button onClick={goHome} className="hover:text-[#D4AF37] transition-colors">
                <ArrowLeft size={20}/>
              </button>
              <div>
                <h1 className="text-2xl font-black">Bolivia <span className="text-[#D4AF37]">Bus</span></h1>
                <p className="text-blue-200 text-sm">Historial de viajes</p>
              </div>
            </div>
            <MyTrips onSearch={goHome}/>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
