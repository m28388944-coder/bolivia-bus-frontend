import { create } from "zustand";
import api from "../api/client";

const useBookingStore = create((set, get) => ({
  asientosSeleccionados: [],
  pasajeros: [],
  booking: null,
  misViajes: [],
  loading: false,
  error: null,

  toggleAsiento: (asiento) => {
    const sel = get().asientosSeleccionados;
    const existe = sel.find((a) => a.id === asiento.id);
    if (existe) {
      set({ asientosSeleccionados: sel.filter((a) => a.id !== asiento.id) });
    } else {
      set({ asientosSeleccionados: [...sel, asiento] });
    }
  },

  setPasajero: (index, data) => {
    const pasajeros = [...get().pasajeros];
    pasajeros[index] = { ...pasajeros[index], ...data };
    set({ pasajeros });
  },

  initPasajeros: (asientos) => {
    set({ pasajeros: asientos.map((a) => ({ seat_id: a.id, nombre: "", ci: "" })) });
  },

  confirmarReserva: async (scheduleId, metodoPago = "efectivo") => {
    set({ loading: true, error: null });
    try {
      const { asientosSeleccionados, pasajeros } = get();
      const res = await api.post("/bookings/", {
        schedule_id: scheduleId,
        pasajeros: pasajeros.map((p, i) => ({
          seat_id: asientosSeleccionados[i].id,
          nombre: p.nombre,
          ci: p.ci,
        })),
        metodo_pago: metodoPago,
      });
      set({ booking: res.data, loading: false });
      return res.data;
    } catch (e) {
      set({ error: e.response?.data?.detail || "Error al confirmar reserva", loading: false });
      return null;
    }
  },

  cargarMisViajes: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/bookings/my");
      set({ misViajes: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  limpiar: () => set({ asientosSeleccionados: [], pasajeros: [], booking: null }),
}));

export default useBookingStore;