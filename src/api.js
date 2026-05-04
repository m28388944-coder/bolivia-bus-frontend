import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export const searchRoutes = (data) => API.post('/routes/search', data);
export const getDepartamentos = () => API.get('/routes/departamentos');
export const getSeatMap = (scheduleId) => API.get('/seats/map/' + scheduleId);
export const reserveSeat = (seatId) => API.post('/seats/reserve/' + seatId);
export const createBooking = (data) => API.post('/bookings/', data);
export const getTicket = (bookingId) => API.get('/tickets/' + bookingId);
export const downloadPDF = (bookingId) => API.get('/tickets/' + bookingId + '/pdf', { responseType: 'blob' });
export const validateTicket = (token) => API.post('/tickets/validate?token=' + token);
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

export default API;
