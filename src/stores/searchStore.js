import { create } from "zustand";
import api from "../api/client";
import { adaptSeat } from "../api/adapters";

const useSearchStore = create((set) => ({
  origen: "",
  destino: "",
  fecha: new Date().toISOString().split("T")[0],
  resultados: [],
  loading: false,
  error: null,
  scheduleSeleccionado: null,
  asientos: [],
  loadingAsientos: false,

  setOrigen: (v) => set({ origen: v }),
  setDestino: (v) => set({ destino: v }),
  setFecha:   (v) => set({ fecha: v }),

  buscar: async (origen, destino, fecha) => {
    set({ loading: true, error: null, resultados: [] });
    try {
      const params = new URLSearchParams();
      if (origen)  params.append("origen",  origen);
      if (destino) params.append("destino", destino);
      if (fecha)   params.append("fecha",   fecha);
      const res = await api.get("/schedules/?" + params);
      const data = res.data;
      const lista = Array.isArray(data) ? data : (data.value || data.items || []);
      set({ resultados: lista, loading: false });
    } catch (e) {
      set({ error: "Error al buscar horarios", loading: false });
    }
  },

  seleccionarSchedule: async (schedule) => {
    set({ scheduleSeleccionado: schedule, loadingAsientos: true, asientos: [] });
    try {
      const res = await api.get("/schedules/" + schedule.id + "/seats");
      const data = res.data;
      const lista = Array.isArray(data) ? data : (data.value || data.items || []);
      const adaptados = lista.map(adaptSeat);
      set({ asientos: adaptados, loadingAsientos: false });
    } catch (e) {
      set({ loadingAsientos: false });
    }
  },

  limpiar: () => set({ resultados: [], scheduleSeleccionado: null, asientos: [] }),
}));

export default useSearchStore;