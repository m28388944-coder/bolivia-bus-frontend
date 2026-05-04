import { create } from 'zustand';

export const useStore = create((set, get) => ({
  user: null,
  token: null,
  bookings: JSON.parse(localStorage.getItem("bb_bookings") || "[]"),

  setUser: (user, token) => {
    localStorage.setItem("bb_token", token);
    localStorage.setItem("bb_user", JSON.stringify(user));
    set({ user, token });
  },

  addBooking: (booking) => {
    const bookings = [...get().bookings, { ...booking, savedAt: new Date().toISOString() }];
    localStorage.setItem("bb_bookings", JSON.stringify(bookings));
    set({ bookings });
  },

  clearBookings: () => {
    localStorage.removeItem("bb_bookings");
    set({ bookings: [] });
  }
}));
