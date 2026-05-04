export const DESTINOS = [
  {
    departamento: "La Paz",
    color: "#1B2A6B",
    lugares: [
      {
        nombre: "Lago Titicaca",
        imagen: "/images/destinos/titicaca.jpg",
        descripcion: "El lago navegable mas alto del mundo a 3.800 msnm. Islas flotantes de los Uros y cultura milenaria aymara.",
        precio_desde: 25, duracion: "1-3 dias", tipo: "Naturaleza",
      },
      {
        nombre: "Tiwanaku",
        imagen: "/images/destinos/tiwanaku.jpg",
        descripcion: "Centro ceremonial preincaico declarado Patrimonio de la Humanidad por la UNESCO. Puerta del Sol milenaria.",
        precio_desde: 30, duracion: "1 dia", tipo: "Cultura",
      },
      {
        nombre: "Valle de la Luna",
        imagen: "/images/destinos/valle-luna.jpg",
        descripcion: "Formaciones geologicas unicas que simulan el paisaje lunar a solo 10 minutos del centro de La Paz.",
        precio_desde: 15, duracion: "Medio dia", tipo: "Naturaleza",
      },
    ],
  },
  {
    departamento: "Oruro",
    color: "#C0392B",
    lugares: [
      {
        nombre: "Carnaval de Oruro",
        imagen: "/images/destinos/carnaval-oruro.jpg",
        descripcion: "Obra maestra del Patrimonio Oral e Inmaterial de la Humanidad. La Diablada mas famosa del mundo.",
        precio_desde: 40, duracion: "3-5 dias", tipo: "Cultura",
      },
      {
        nombre: "Salar de Coipasa",
        imagen: "/images/destinos/salar-coipasa.jpg",
        descripcion: "El segundo salar mas grande de Bolivia con flamencos rosados y paisajes infinitos de sal blanca.",
        precio_desde: 35, duracion: "1-2 dias", tipo: "Naturaleza",
      },
    ],
  },
  {
    departamento: "Potosi",
    color: "#8E44AD",
    lugares: [
      {
        nombre: "Cerro Rico",
        imagen: "/images/destinos/cerro-rico.jpg",
        descripcion: "La montana que fue la mayor fuente de plata del mundo colonial. Minas historicas visitables.",
        precio_desde: 45, duracion: "1 dia", tipo: "Historia",
      },
      {
        nombre: "Ciudad de Potosi",
        imagen: "/images/destinos/potosi-ciudad.jpg",
        descripcion: "Ciudad colonial declarada Patrimonio de la Humanidad. Arquitectura barroca andina unica en el mundo.",
        precio_desde: 20, duracion: "1-2 dias", tipo: "Cultura",
      },
    ],
  },
  {
    departamento: "Cochabamba",
    color: "#27AE60",
    lugares: [
      {
        nombre: "Cristo de la Concordia",
        imagen: "/images/destinos/cristo-concordia.jpg",
        descripcion: "La estatua de Cristo mas grande del mundo con 40.44 metros. Vista panoramica de toda la ciudad.",
        precio_desde: 10, duracion: "Medio dia", tipo: "Religion",
      },
      {
        nombre: "Parque Nacional Torotoro",
        imagen: "/images/destinos/torotoro.jpg",
        descripcion: "Huellas de dinosaurios, cavernas y cascadas en un paisaje prehistorico unico de Bolivia.",
        precio_desde: 55, duracion: "2-3 dias", tipo: "Naturaleza",
      },
    ],
  },
  {
    departamento: "Santa Cruz",
    color: "#E67E22",
    lugares: [
      {
        nombre: "Misiones Jesuitas",
        imagen: "/images/destinos/misiones-jesuitas.jpg",
        descripcion: "Seis misiones jesuitas del siglo XVII declaradas Patrimonio Mundial por la UNESCO.",
        precio_desde: 80, duracion: "2-4 dias", tipo: "Historia",
      },
      {
        nombre: "Jardin de las Delicias",
        imagen: "/images/destinos/amboro.jpg",
        descripcion: "Cascadas y selva tropical en el Parque Nacional Amboro. Una de las zonas mas biodiversas del planeta.",
        precio_desde: 60, duracion: "2-3 dias", tipo: "Naturaleza",
      },
    ],
  },
  {
    departamento: "Sucre",
    color: "#F39C12",
    lugares: [
      {
        nombre: "Ciudad Blanca de Sucre",
        imagen: "/images/destinos/sucre.jpg",
        descripcion: "Capital constitucional de Bolivia. Arquitectura colonial impecable declarada Patrimonio UNESCO.",
        precio_desde: 35, duracion: "2-3 dias", tipo: "Cultura",
      },
      {
        nombre: "Cal Orcko",
        imagen: "/images/destinos/cal-orcko.jpg",
        descripcion: "La pared de dinosaurios mas grande del mundo con mas de 5.000 huellas de 294 especies.",
        precio_desde: 25, duracion: "Medio dia", tipo: "Ciencia",
      },
    ],
  },
  {
    departamento: "Tarija",
    color: "#16A085",
    lugares: [
      {
        nombre: "Valle de los Vinos",
        imagen: "/images/destinos/tarija-vinos.jpg",
        descripcion: "Los vinos mas altos del mundo a 1.900 msnm. Bodegas y vinos de altura premiados internacionalmente.",
        precio_desde: 50, duracion: "1-2 dias", tipo: "Gastronomia",
      },
    ],
  },
  {
    departamento: "Beni",
    color: "#2ECC71",
    lugares: [
      {
        nombre: "Rurrenabaque",
        imagen: "/images/destinos/rurrenabaque.jpg",
        descripcion: "Puerta de entrada al Amazonas boliviano. Pampas con caimanes, anacondas y delfines rosados.",
        precio_desde: 90, duracion: "3-5 dias", tipo: "Aventura",
      },
    ],
  },
  {
    departamento: "Uyuni",
    color: "#3498DB",
    lugares: [
      {
        nombre: "Salar de Uyuni",
        imagen: "/images/destinos/salar-uyuni.jpg",
        descripcion: "El desierto de sal mas grande del mundo. 10.582 km2 de blanco infinito y cielos de espejo.",
        precio_desde: 110, duracion: "3 dias", tipo: "Naturaleza",
      },
      {
        nombre: "Laguna Colorada",
        imagen: "/images/destinos/laguna-colorada.jpg",
        descripcion: "Laguna de color rojo intenso a 4.278 msnm con flamencos james y paisajes de otro mundo.",
        precio_desde: 110, duracion: "3 dias", tipo: "Naturaleza",
      },
    ],
  },
];

export const TIPO_COLORS = {
  Naturaleza:  { bg: "bg-green-100",  text: "text-green-700" },
  Cultura:     { bg: "bg-purple-100", text: "text-purple-700" },
  Historia:    { bg: "bg-amber-100",  text: "text-amber-700" },
  Aventura:    { bg: "bg-red-100",    text: "text-red-700" },
  Religion:    { bg: "bg-blue-100",   text: "text-blue-700" },
  Gastronomia: { bg: "bg-orange-100", text: "text-orange-700" },
  Ciencia:     { bg: "bg-teal-100",   text: "text-teal-700" },
};