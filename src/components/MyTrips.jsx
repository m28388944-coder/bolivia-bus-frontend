import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, MapPin, Clock, Bus, RefreshCw, Share2, X, Navigation, Zap } from "lucide-react";
import api from "../api/client";

function MapaRastreo({ viaje, onClose }) {
  const [busPos, setBusPos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const intervalRef = useRef(null);

  const placa = viaje.placa;

  const fetchBus = async () => {
    try {
      const res = await api.get("https://bolivia-bus-backend.onrender.com/tracking/latest");
      const buses = res.data.buses || [];
      const bus = placa
        ? buses.find(b => b.bus_id === placa) || buses[0]
        : buses[0];
      if (bus) setBusPos(bus);
      return bus;
    } catch { return null; }
  };

  useEffect(() => {
    const existingLink = document.getElementById("leaflet-css");
    const existingScript = document.getElementById("leaflet-script");

    const init = async () => {
      if (!window.L || !document.getElementById("mapa-rastreo")) return;

      const bus = await fetchBus();
      setLoading(false);

      const center = bus
        ? [bus.latitude, bus.longitude]
        : [-16.5, -68.15];

      const map = window.L.map("mapa-rastreo").setView(center, 9);
      mapRef.current = map;

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
      }).addTo(map);

      if (bus) {
        const icon = window.L.divIcon({
          html: `<div style="background:#1B2A6B;color:#D4AF37;padding:6px 12px;border-radius:20px;font-weight:900;font-size:13px;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid #D4AF37">🚌 ${bus.bus_id}</div>`,
          iconAnchor: [50, 20],
          className: "",
        });
        markerRef.current = window.L.marker([bus.latitude, bus.longitude], { icon })
          .addTo(map)
          .bindPopup(`<b>${bus.bus_id}</b><br>${bus.speed_kmh} km/h<br>${bus.status}`)
          .openPopup();
      } else {
        setError(true);
      }

      intervalRef.current = setInterval(async () => {
        const updated = await fetchBus();
        if (updated && markerRef.current && mapRef.current) {
          markerRef.current.setLatLng([updated.latitude, updated.longitude]);
          markerRef.current.getPopup()?.setContent(
            `<b>${updated.bus_id}</b><br>${updated.speed_kmh} km/h<br>${updated.status}`
          );
          setBusPos(updated);
        }
      }, 5000);
    };

    if (!existingLink) {
      const link = document.createElement("link");
      link.id = "leaflet-css"; link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "leaflet-script";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = init;
      document.head.appendChild(script);
    } else if (window.L) {
      init();
    }

    return () => {
      clearInterval(intervalRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [viaje]);

  const fmt = (dt) => new Date(dt).toLocaleTimeString("es-BO", {
    hour: "2-digit", minute: "2-digit", timeZone: "America/La_Paz"
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col">

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1B2A6B, #2d45a8)" }}
        className="px-4 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Navigation size={18} color="#D4AF37"/>
            <span className="text-white font-black text-lg">Rastreo en Vivo</span>
          </div>
          <p className="text-blue-200 text-sm mt-0.5">{viaje.ruta} · {fmt(viaje.hora_salida)}</p>
        </div>
        <button onClick={onClose}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
          style={{ background: "rgba(255,255,255,0.15)" }}>
          <X size={20}/>
        </button>
      </div>

      {/* Status bar */}
      <div style={{ background: "rgba(27,42,107,0.95)" }} className="px-4 py-3 flex items-center gap-4">
        {busPos ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
              <span className="text-green-400 text-xs font-bold">EN VIVO</span>
            </div>
            <span className="text-white text-sm font-bold">{busPos.bus_id}</span>
            <div className="flex items-center gap-1">
              <Zap size={12} color="#D4AF37"/>
              <span className="text-blue-200 text-xs">{busPos.speed_kmh} km/h</span>
            </div>
            <span className="text-blue-200 text-xs capitalize">{busPos.status}</span>
          </>
        ) : (
          <span className="text-blue-300 text-xs">Buscando el bus...</span>
        )}
        <div className="ml-auto text-right">
          <p className="text-blue-300 text-xs">Reserva</p>
          <p className="text-white text-xs font-black tracking-wider">{viaje.codigo_reserva}</p>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
              <p className="text-white font-semibold">Localizando tu bus...</p>
              <p className="text-gray-400 text-sm mt-1">Placa: {placa || "buscando..."}</p>
            </div>
          </div>
        )}
        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900">
            <div className="text-center px-8">
              <Bus size={48} color="#D4AF37" className="mx-auto mb-4"/>
              <p className="text-white font-bold text-lg mb-2">Bus no localizado</p>
              <p className="text-gray-400 text-sm">El GPS del bus aún no está activo</p>
            </div>
          </div>
        )}
        <div id="mapa-rastreo" style={{ height: "100%", width: "100%" }}/>
      </div>
    </motion.div>
  );
}

export default function MyTrips({ onSearch }) {
  const [viajes, setViajes]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [rastreando, setRastreando] = useState(null);

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings/my");
      const data = res.data;
      setViajes(Array.isArray(data) ? data : []);
    } catch {
      setViajes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const fmt = (dt) => new Date(dt).toLocaleString("es-BO", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    timeZone: "America/La_Paz"
  });

  const handleWhatsApp = (v) => {
    const msg = encodeURIComponent(
      "Bolivia Bus - Mi Reserva\n\n" +
      "Codigo: " + v.codigo_reserva + "\n" +
      "Ruta: " + v.ruta + "\n" +
      "Salida: " + fmt(v.hora_salida) + "\n" +
      "Total: Bs. " + v.precio_total
    );
    window.open("https://wa.me/?text=" + msg, "_blank");
  };

  const estadoColor = {
    pagada:    { bg: "rgba(34,197,94,0.1)",  text: "#22C55E", border: "rgba(34,197,94,0.3)" },
    pendiente: { bg: "rgba(245,158,11,0.1)", text: "#F59E0B", border: "rgba(245,158,11,0.3)" },
    cancelada: { bg: "rgba(239,68,68,0.1)",  text: "#EF4444", border: "rgba(239,68,68,0.3)" },
    completada:{ bg: "rgba(59,130,246,0.1)", text: "#3B82F6", border: "rgba(59,130,246,0.3)" },
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 border-2 border-[#1B2A6B] border-t-transparent rounded-full animate-spin mb-4"/>
      <p className="text-gray-500 text-sm">Cargando tus viajes...</p>
    </div>
  );

  if (!viajes.length) return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-[#1B2A6B]/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
        <Ticket size={36} className="text-[#1B2A6B]"/>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">No tienes viajes aún</h3>
      <p className="text-gray-500 text-sm mb-6">Compra tu primer pasaje y aparecerá aquí</p>
      <button onClick={onSearch}
        className="bg-[#1B2A6B] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#D4AF37] hover:text-[#1B2A6B] transition-all">
        Buscar pasajes
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-black text-gray-800 text-xl">{viajes.length} viaje(s)</h2>
          <p className="text-gray-500 text-sm">Tu historial de reservas</p>
        </div>
        <button onClick={cargar}
          className="flex items-center gap-1.5 text-[#1B2A6B] text-sm font-semibold bg-[#1B2A6B]/5 px-3 py-2 rounded-xl hover:bg-[#1B2A6B]/10 transition-all">
          <RefreshCw size={14}/> Actualizar
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {viajes.map((v, i) => {
          const ec = estadoColor[v.estado] || estadoColor.pendiente;
          return (
            <motion.div key={v.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Header tarjeta */}
              <div style={{ background: "linear-gradient(135deg, #1B2A6B, #2d45a8)" }}
                className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bus size={16} color="#D4AF37"/>
                  <span className="text-white font-black text-sm tracking-wider">{v.codigo_reserva}</span>
                </div>
                <div style={{ background: ec.bg, border: `1px solid ${ec.border}`, borderRadius: 99, padding: "3px 10px" }}>
                  <span style={{ color: ec.text, fontSize: 11, fontWeight: 700 }}>{v.estado}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-gray-800 mb-1">
                      <MapPin size={15} color="#1B2A6B"/>
                      {v.ruta}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Clock size={13}/>
                      {fmt(v.hora_salida)}
                    </div>
                    {v.placa && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                        <Bus size={11}/>
                        Placa: <span className="font-mono font-bold text-[#1B2A6B]">{v.placa}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#1B2A6B]">Bs. {v.precio_total}</div>
                    <div className="text-xs text-gray-400">{v.tickets} ticket(s)</div>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-3 flex gap-2">
                  <button onClick={() => setRastreando(v)}
                    style={{ background: "linear-gradient(135deg, #1B2A6B, #2d45a8)" }}
                    className="flex-1 flex items-center justify-center gap-2 text-white font-bold text-sm py-3 rounded-xl transition-all hover:opacity-90">
                    <Navigation size={15}/> Rastrear Bus
                  </button>
                  <button onClick={() => handleWhatsApp(v)}
                    className="flex items-center justify-center gap-1.5 bg-green-50 text-green-700 font-semibold text-sm py-3 px-4 rounded-xl hover:bg-green-100 transition-all">
                    <Share2 size={14}/> WA
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {rastreando && <MapaRastreo viaje={rastreando} onClose={() => setRastreando(null)}/>}
      </AnimatePresence>
    </div>
  );
}

