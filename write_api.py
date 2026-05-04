with open('src/api.js', 'w', encoding='utf-8') as f:
    f.write(
'import axios from ' + chr(39) + 'axios' + chr(39) + ';\n'
'\n'
'const API = axios.create({\n'
'  baseURL: ' + chr(39) + 'http://localhost:8000/api/v1' + chr(39) + ',\n'
'  headers: { ' + chr(39) + 'Content-Type' + chr(39) + ': ' + chr(39) + 'application/json' + chr(39) + ' },\n'
'});\n'
'\n'
'export const searchRoutes = (data) => API.post(' + chr(39) + '/routes/search' + chr(39) + ', data);\n'
'export const getDepartamentos = () => API.get(' + chr(39) + '/routes/departamentos' + chr(39) + ');\n'
'export const getSeatMap = (scheduleId) => API.get(' + chr(39) + '/seats/map/' + chr(39) + ' + scheduleId);\n'
'export const reserveSeat = (seatId) => API.post(' + chr(39) + '/seats/reserve/' + chr(39) + ' + seatId);\n'
'export const createBooking = (data) => API.post(' + chr(39) + '/bookings/' + chr(39) + ', data);\n'
'export const getTicket = (bookingId) => API.get(' + chr(39) + '/tickets/' + chr(39) + ' + bookingId);\n'
'export const downloadPDF = (bookingId) => API.get(' + chr(39) + '/tickets/' + chr(39) + ' + bookingId + ' + chr(39) + '/pdf' + chr(39) + ', { responseType: ' + chr(39) + 'blob' + chr(39) + ' });\n'
'export const validateTicket = (token) => API.post(' + chr(39) + '/tickets/validate?token=' + chr(39) + ' + token);\n'
'export const login = (data) => API.post(' + chr(39) + '/auth/login' + chr(39) + ', data);\n'
'export const register = (data) => API.post(' + chr(39) + '/auth/register' + chr(39) + ', data);\n'
'\n'
'export default API;\n'
    )
print('OK: api.js')