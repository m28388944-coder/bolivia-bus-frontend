import { useState, useEffect, useRef } from "react";
import { User, CheckCircle, CreditCard, ArrowLeft, Bus, Download, Clock, Shield, Navigation, X, Zap } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";
import api from "../api/client";

const METODOS = [
  { id: "efectivo",       label: "Efectivo",      icon: "💵", desc: "Paga en ventanilla de la terminal" },
  { id: "qr",            label: "QR Bolivia",    icon: "📱", desc: "Paga con tu app del banco" },
  { id: "tarjeta",       label: "Tarjeta",       icon: "💳", desc: "Debito o credito" },
  { id: "transferencia", label: "Transferencia", icon: "🏦", desc: "Transferencia bancaria" },
];

function fmtHora(dt) {
  if (!dt) return "";
  return new Date(dt).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit", timeZone: "America/La_Paz" });
}

function fmtFecha(dt) {
  if (!dt) return "";
  return new Date(dt).toLocaleDateString("es-BO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "America/La_Paz"
  });
}

function IconoTerminal() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="18" height="11" rx="2" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1.5"/>
      <rect x="4" y="10" width="4" height="3" rx="1" fill="white"/>
      <rect x="9" y="10" width="4" height="3" rx="1" fill="white"/>
      <rect x="14" y="10" width="3" height="3" rx="1" fill="white"/>
      <circle cx="6" cy="19" r="2" fill="white"/>
      <circle cx="16" cy="19" r="2" fill="white"/>
      <rect x="20" y="9" width="2" height="5" rx="1" fill="white" opacity="0.6"/>
    </svg>
  );
}

function MapaRastreo({ placa, onClose }) {
  const [busPos, setBusPos] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await fetch("http://localhost:8000/tracking/latest");
        const data = await res.json();
        const buses = data.buses || [];
        const bus = placa ? (buses.find(b => b.bus_id === placa) || buses[0]) : buses[0];
        if (bus) setBusPos(bus);
        return bus;
      } catch { return null; }
    };

    const init = async () => {
      if (!window.L || !document.getElementById("mapa-ticket")) return;
      const bus = await fetchBus();
      const center = bus ? [bus.latitude, bus.longitude] : [-16.5, -68.15];
      const map = window.L.map("mapa-ticket").setView(center, 9);
      mapRef.current = map;
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      if (bus) {
        const icon = window.L.divIcon({
          html: "<div style='background:#1B2A6B;color:#D4AF37;padding:6px 12px;border-radius:20px;font-weight:900;font-size:13px;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid #D4AF37'>Bus " + bus.bus_id + "</div>",
          iconAnchor: [50, 20], className: "",
        });
        markerRef.current = window.L.marker([bus.latitude, bus.longitude], { icon }).addTo(map);
      }
      setInterval(async () => {
        const updated = await fetchBus();
        if (updated && markerRef.current) {
          markerRef.current.setLatLng([updated.latitude, updated.longitude]);
          setBusPos(updated);
        }
      }, 5000);
    };

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css"; link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("leaflet-script")) {
      const script = document.createElement("script");
      script.id = "leaflet-script";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = init;
      document.head.appendChild(script);
    } else if (window.L) { init(); }

    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", flexDirection: "column", background: "#0a1128" }}>
      <div style={{ background: "linear-gradient(135deg, #1B2A6B, #2d45a8)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Navigation size={18} color="#D4AF37"/>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 17 }}>Rastreo en Vivo</span>
          </div>
          {busPos && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }}/>
                <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700 }}>EN VIVO</span>
              </div>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{busPos.bus_id}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Zap size={11} color="#D4AF37"/>
                <span style={{ color: "#93C5FD", fontSize: 12 }}>{busPos.speed_kmh} km/h</span>
              </div>
            </div>
          )}
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", color: "#fff", display: "flex" }}>
          <X size={20}/>
        </button>
      </div>
      <div id="mapa-ticket" style={{ flex: 1 }}/>
    </div>
  );
}

function TicketProfesional({ booking, schedule, seats, metodo, pasajeros }) {
  const [showRastreo, setShowRastreo] = useState(false);
  const numeros = booking.asientos?.join(", ") || seats.map(s => s.numero || s.seat_number).join(", ");
  const qrData = JSON.stringify({
    codigo: booking.codigo_reserva,
    ruta: (schedule?.origin || "") + " - " + (schedule?.destination || ""),
    salida: fmtHora(schedule?.departure_time),
    asientos: numeros,
    total: booking.precio_total,
  });

  const placa = schedule?.placa || schedule?._raw?.bus?.placa;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="ticket-print max-w-sm mx-auto px-4 py-6">

      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }} className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle size={36} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-800">Reserva Confirmada!</h2>
        <p className="text-gray-500 text-sm mt-1">Tu pasaje ha sido generado exitosamente</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

        <div className="bg-gradient-to-r from-[#1B2A6B] to-[#2d45a8] p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bus size={18} />
              <span className="font-bold text-sm">Bolivia Bus</span>
            </div>
            <div className="bg-white/20 rounded-full px-3 py-1">
              <span className="text-xs font-bold tracking-wider">PASAJE</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-xs mb-1">Origen</p>
              <p className="font-black text-lg">{schedule?.origin}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-px bg-white/40 relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <IconoTerminal />
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs mb-1">Destino</p>
              <p className="font-black text-lg">{schedule?.destination}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-100 rounded-full -ml-2 border border-gray-200" />
          <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-1" />
          <div className="w-4 h-4 bg-gray-100 rounded-full -mr-2 border border-gray-200" />
        </div>

        <div className="p-5">
          <div className="bg-[#1B2A6B]/5 rounded-2xl p-3 mb-4 text-center border border-[#1B2A6B]/10">
            <p className="text-xs text-gray-500 mb-1">Codigo de reserva</p>
            <p className="text-2xl font-black text-[#1B2A6B] tracking-widest">{booking.codigo_reserva}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock size={10}/> Salida</p>
              <p className="font-bold text-gray-800 text-sm">{fmtHora(schedule?.departure_time)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock size={10}/> Llegada est.</p>
              <p className="font-bold text-gray-800 text-sm">{fmtHora(schedule?.arrival_time)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Asiento(s)</p>
              <p className="font-bold text-[#1B2A6B] text-sm">{numeros}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Empresa</p>
              <p className="font-bold text-gray-800 text-sm truncate">{schedule?.company}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <p className="text-xs text-gray-400 mb-1">Fecha de viaje</p>
            <p className="font-semibold text-gray-800 text-sm capitalize">{fmtFecha(schedule?.departure_time)}</p>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><User size={10}/> Pasajero(s)</p>
            {pasajeros.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{p.nombre}</p>
                  <p className="text-xs text-gray-400">CI: {p.ci}</p>
                </div>
                <div className="bg-[#1B2A6B]/10 rounded-lg px-2 py-1">
                  <p className="text-xs font-bold text-[#1B2A6B]">{seats[i]?.numero || seats[i]?.seat_number}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-gray-100 rounded-full -ml-2 border border-gray-200" />
            <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-1" />
            <div className="w-3 h-3 bg-gray-100 rounded-full -mr-2 border border-gray-200" />
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl border-2 border-[#1B2A6B]/10 shadow-sm">
              <QRCodeSVG value={qrData} size={90} bgColor="#ffffff" fgColor="#1B2A6B" level="H" includeMargin={false}/>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-2">
                <Shield size={12} className="text-green-500" />
                <p className="text-xs font-semibold text-green-600">Ticket verificado</p>
              </div>
              <p className="text-xs text-gray-400 mb-3">Presenta este QR al abordar el bus</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Total pagado</span>
                <span className="font-black text-[#1B2A6B] text-base">Bs. {booking.precio_total}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">Metodo</span>
                <span className="text-xs font-semibold capitalize text-gray-700">{metodo}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-4 space-y-3 no-print">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setShowRastreo(true)}
          className="w-full bg-gradient-to-r from-[#1B2A6B] to-[#2d45a8] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2">
          <Navigation size={18} /> Rastrear mi Bus en Vivo
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => window.print()}
          className="w-full border-2 border-[#1B2A6B] text-[#1B2A6B] font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2">
          <Download size={18} /> Descargar Ticket
        </motion.button>
      </div>

      {showRastreo && (
        <MapaRastreo placa={placa} onClose={() => setShowRastreo(false)} />
      )}
    </motion.div>
  );
}

export default function Checkout({ schedule, seats = [], onBack, onComplete }) {
  const [metodo, setMetodo]       = useState("efectivo");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [booking, setBooking]     = useState(null);
  const [pasajeros, setPasajeros] = useState(
    seats.map(s => ({ seat_id: s.id, nombre: "", ci: "" }))
  );

  const precioBase = schedule?.price_normal || schedule?.precio_base || 0;
  const total      = precioBase * seats.length;
  const scheduleId = schedule?._raw?.id || schedule?.id;

  const updatePasajero = (i, field, value) => {
    const nd = [...pasajeros];
    nd[i] = { ...nd[i], [field]: value };
    setPasajeros(nd);
  };

  const handlePagar = async () => {
    for (const p of pasajeros) {
      if (!p.nombre.trim() || !p.ci.trim()) {
        setError("Completa nombre y CI de todos los pasajeros"); return;
      }
    }
    setError(""); setLoading(true);
    try {
      const res = await api.post("/bookings/", {
        schedule_id: scheduleId,
        pasajeros: pasajeros.map((p, i) => ({
          seat_id: seats[i].id,
          nombre: p.nombre,
          ci: p.ci,
        })),
        metodo_pago: metodo,
      });
      setBooking(res.data);
      confetti({
        particleCount: 150, spread: 90, origin: { y: 0.6 },
        colors: ["#1B2A6B", "#D4AF37", "#ffffff", "#2d45a8"]
      });
    } catch (e) {
      setError(e.response?.data?.detail || "Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  if (booking) {
    return <TicketProfesional booking={booking} schedule={schedule} seats={seats} metodo={metodo} pasajeros={pasajeros} />;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[#1B2A6B] text-sm font-semibold mb-5">
        <ArrowLeft size={16}/> Volver a asientos
      </button>

      <div className="bg-gradient-to-r from-[#1B2A6B] to-[#2d45a8] rounded-2xl p-4 mb-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bus size={16} />
            <span className="text-sm font-semibold">{schedule?.company}</span>
          </div>
          <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">{seats.length} asiento(s)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-xs">Origen</p>
            <p className="font-black text-lg">{schedule?.origin}</p>
            <p className="text-blue-200 text-sm">{fmtHora(schedule?.departure_time)}</p>
          </div>
          <div className="text-center text-white/50 text-xl">to</div>
          <div className="text-right">
            <p className="text-blue-200 text-xs">Destino</p>
            <p className="font-black text-lg">{schedule?.destination}</p>
            <p className="text-blue-200 text-sm">{fmtHora(schedule?.arrival_time)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <User size={16} className="text-[#1B2A6B]"/> Datos del pasajero
        </h3>
        {pasajeros.map((p, i) => (
          <div key={i} className="mb-4 last:mb-0">
            {seats.length > 1 && (
              <p className="text-xs font-bold text-[#1B2A6B] mb-2 bg-[#1B2A6B]/5 rounded-lg px-2 py-1 inline-block">
                Asiento {seats[i]?.numero || seats[i]?.seat_number}
              </p>
            )}
            <div className="flex gap-2">
              <input placeholder="Nombre completo" value={p.nombre}
                onChange={e => updatePasajero(i, "nombre", e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B2A6B]"/>
              <input placeholder="CI" value={p.ci}
                onChange={e => updatePasajero(i, "ci", e.target.value)}
                className="w-28 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B2A6B]"/>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <CreditCard size={16} className="text-[#1B2A6B]"/> Metodo de pago
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {METODOS.map(m => (
            <button key={m.id} onClick={() => setMetodo(m.id)}
              className={"p-3 rounded-xl border-2 text-left transition-all " +
                (metodo === m.id ? "border-[#1B2A6B] bg-[#1B2A6B]/5" : "border-gray-200 hover:border-gray-300")}>
              <div className="text-lg mb-1">{m.icon}</div>
              <div className="text-sm font-semibold text-gray-800">{m.label}</div>
              <div className="text-xs text-gray-500">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Total a pagar</p>
          <p className="text-2xl font-black text-[#1B2A6B]">Bs. {total}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{seats.length} asiento(s)</p>
          <p className="text-sm font-semibold text-gray-600">Bs. {precioBase} c/u</p>
        </div>
      </div>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-red-500 text-sm text-center mb-3 bg-red-50 rounded-xl p-3">
          {error}
        </motion.p>
      )}

      <motion.button onClick={handlePagar} disabled={loading}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-[#1B2A6B] to-[#2d45a8] text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg">
        {loading
          ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
          : <><Shield size={18}/> Confirmar y Pagar — Bs. {total}</>}
      </motion.button>

      <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
        <Shield size={10}/> Pago seguro y encriptado
      </p>
    </div>
  );
}
