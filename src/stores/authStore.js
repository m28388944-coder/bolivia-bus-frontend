import { create } from "zustand";
import api from "../api/client";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("bb_user") || "null"),
  token: localStorage.getItem("bb_token") || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("bb_token", res.data.access_token);
      localStorage.setItem("bb_user", JSON.stringify(res.data.user));
      set({ user: res.data.user, token: res.data.access_token, loading: false });
      return true;
    } catch (e) {
      set({ error: e.response?.data?.detail || "Error al iniciar sesion", loading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/register", data);
      localStorage.setItem("bb_token", res.data.access_token);
      localStorage.setItem("bb_user", JSON.stringify(res.data.user));
      set({ user: res.data.user, token: res.data.access_token, loading: false });
      return true;
    } catch (e) {
      set({ error: e.response?.data?.detail || "Error al registrarse", loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("bb_token");
    localStorage.removeItem("bb_user");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;