import { create } from "zustand";
import api from "../api/client";

const useTerminalStore = create((set) => ({
  terminales: [],
  terminalActiva: null,
  loading: false,

  cargarTerminales: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/terminals/");
      set({ terminales: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  cargarTerminal: async (id) => {
    set({ loading: true });
    try {
      const res = await api.get("/terminals/" + id);
      set({ terminalActiva: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));

export default useTerminalStore;