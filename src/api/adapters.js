export function adaptSchedule(s) {
  return {
    id: s.id,
    bus_type: s.bus?.tipo || "normal",
    departure_time: s.hora_salida,
    arrival_time: s.hora_llegada_est,
    duration_hours: s.ruta?.duracion_min ? (s.ruta.duracion_min / 60).toFixed(1) : "?",
    origin: s.ruta?.origen || "",
    destination: s.ruta?.destino || "",
    company: s.empresa?.nombre || "",
    company_color: s.empresa?.color || "#1B2A6B",
    available_seats: s.asientos_disponibles || 0,
    total_seats: s.bus?.total_asientos || 0,
    terminal_fee: 5,
    price_normal: s.precio_base,
    price_semicama: s.precio_base,
    price_cama: s.precio_base,
    placa: s.bus?.placa || "",
    _raw: s,
  };
}

export function adaptSeat(s) {
  return {
    id: s.id,
    seat_number: s.numero,
    fila: s.fila,
    columna: s.columna,
    tipo: s.tipo,
    piso: s.piso,
    disponible: s.disponible,
  };
}