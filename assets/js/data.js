/* =========================================================
   Quoph · Datos del sitio
   ---------------------------------------------------------
   EDITA ESTE ARCHIVO para cambiar precios, productos y
   servicios. No necesitas tocar nada más.
   ========================================================= */

const CONFIG = {
  /* Números de WhatsApp en formato internacional, sin + ni espacios */
  waTienda: '56947073628',   // pedidos de la tienda
  waTarot:  '56935068224',   // agenda de tarot con Simón

  moneda: 'CLP',

  horarios: {
    // 0 = domingo … 6 = sábado
    online:     { dias: [0,1,2,3,4,5,6], desde: 11, hasta: 23 },
    presencial: { dias: [1,2,3,4,5],     desde: 11, hasta: 19 }
  }
};

/* ---------------- Categorías del catálogo ---------------- */
const CATEGORIAS = [
  { id: 'velas',     nombre: 'Velas' },
  { id: 'inciensos', nombre: 'Inciensos y sahumerios' },
  { id: 'cuarzos',   nombre: 'Cuarzos y cristales' },
  { id: 'amuletos',  nombre: 'Amuletos' },
  { id: 'figuras',   nombre: 'Figuras' },
  { id: 'rituales',  nombre: 'Insumos rituales' }
];

/* Ilustración de respaldo por categoría (se usa cuando el
   producto todavía no tiene foto propia en `img`).        */
const GLYPHS = {
  velas:     '<path d="M24 6c2.5 3.2 4 5.6 4 7.6a4 4 0 0 1-8 0c0-2 1.5-4.4 4-7.6Z"/><rect x="17" y="20" width="14" height="22" rx="1.5"/><path d="M24 20v-2"/>',
  inciensos: '<path d="M18 42h12"/><path d="M24 42V14"/><path d="M24 12c3-2.4 3-5 1.5-7 3 1 4.5 3.6 3.5 6.4-.8 2.2-3 3-5 2.6Z"/><path d="M15 30c-2 2-2 5 0 7M33 26c2 2 2 5 0 7"/>',
  cuarzos:   '<path d="m24 5 11 12-11 26L13 17 24 5Z"/><path d="M13 17h22M24 5v38M18.5 11.5 24 17l5.5-5.5"/>',
  amuletos:  '<circle cx="24" cy="27" r="13"/><path d="m24 17 3 8.5h8.5l-6.9 5.2 2.7 8.4L24 34l-7.3 5.1 2.7-8.4-6.9-5.2H21L24 17Z"/><path d="M20 10h8"/>',
  figuras:   '<circle cx="24" cy="12" r="5"/><path d="M15 42c0-9 4-16 9-16s9 7 9 16Z"/><path d="M12 42h24"/>',
  rituales:  '<path d="M11 20h26c0 8-5.8 14-13 14s-13-6-13-14Z"/><path d="M24 34v8M17 42h14"/><path d="M20 16c0-3 1.5-5 4-6-1 2.5-.5 4 1 5.5"/>'
};

/* ---------------- Catálogo de productos ------------------
   precio  → número entero en pesos chilenos
   img     → (opcional) 'assets/img/productos/mi-foto.jpg'
   ---------------------------------------------------------
   ⚠ Los precios son referenciales: ajústalos a los reales.
   ========================================================= */
const PRODUCTOS = [
  /* Velas */
  { id:'v1', cat:'velas', nombre:'Vela de miel artesanal', desc:'Endulzamiento y armonía en el hogar.', precio:3500 },
  { id:'v2', cat:'velas', nombre:'Velón 7 mechas de abundancia', desc:'Para trabajos de prosperidad de siete días.', precio:8900 },
  { id:'v3', cat:'velas', nombre:'Vela roja de amor', desc:'Atracción, pasión y reconciliación.', precio:3500 },
  { id:'v4', cat:'velas', nombre:'Velón blanco de limpieza', desc:'Purificación de espacios y personas.', precio:4500 },
  { id:'v5', cat:'velas', nombre:'Vela de soja aromática', desc:'Cera vegetal con aceites esenciales puros.', precio:7900 },

  /* Inciensos y sahumerios */
  { id:'i1', cat:'inciensos', nombre:'Palo Santo (caja de 20)', desc:'Madera sagrada del Perú para limpiar ambientes.', precio:3000 },
  { id:'i2', cat:'inciensos', nombre:'Sahumerio de salvia blanca', desc:'Atado de salvia para limpieza profunda.', precio:5500 },
  { id:'i3', cat:'inciensos', nombre:'Incienso Nag Champa', desc:'Clásico de la India, ideal para meditar.', precio:2500 },
  { id:'i4', cat:'inciensos', nombre:'Sahumerio de romero y ruda', desc:'Corta malas vibras y envidias.', precio:4000 },
  { id:'i5', cat:'inciensos', nombre:'Resina de copal + carboncillo', desc:'Sahumado tradicional para rituales.', precio:4800 },

  /* Cuarzos y cristales */
  { id:'c1', cat:'cuarzos', nombre:'Cuarzo rosa en bruto', desc:'Amor propio y sanación emocional.', precio:6500 },
  { id:'c2', cat:'cuarzos', nombre:'Punta generadora de amatista', desc:'Intuición, calma mental y protección.', precio:12900 },
  { id:'c3', cat:'cuarzos', nombre:'Cuarzo blanco pulido', desc:'Amplificador universal de energía.', precio:5500 },
  { id:'c4', cat:'cuarzos', nombre:'Obsidiana negra', desc:'Escudo energético y anclaje a tierra.', precio:7500 },
  { id:'c5', cat:'cuarzos', nombre:'Pirita natural', desc:'La piedra del dinero y la voluntad.', precio:9900 },
  { id:'c6', cat:'cuarzos', nombre:'Set 7 chakras', desc:'Siete piedras para alineación energética.', precio:14900 },

  /* Amuletos */
  { id:'a1', cat:'amuletos', nombre:'Ojo turco', desc:'Protección contra el mal de ojo.', precio:4500 },
  { id:'a2', cat:'amuletos', nombre:'Péndulo de amatista', desc:'Radiestesia y trabajo con el subconsciente.', precio:9500 },
  { id:'a3', cat:'amuletos', nombre:'Pentáculo de protección', desc:'Colgante en metal plateado con cordón.', precio:8900 },
  { id:'a4', cat:'amuletos', nombre:'Herradura de la suerte', desc:'Fortuna y resguardo en la entrada del hogar.', precio:5900 },
  { id:'a5', cat:'amuletos', nombre:'Pulsera de siete metales', desc:'Equilibrio planetario y protección diaria.', precio:7500 },

  /* Figuras */
  { id:'f1', cat:'figuras', nombre:'Buda de la abundancia', desc:'Resina policromada, 15 cm.', precio:12000 },
  { id:'f2', cat:'figuras', nombre:'Santa Muerte 15 cm', desc:'Imagen tradicional en resina.', precio:18900 },
  { id:'f3', cat:'figuras', nombre:'Ganesha', desc:'Remueve obstáculos y abre caminos.', precio:14500 },
  { id:'f4', cat:'figuras', nombre:'San Miguel Arcángel', desc:'Defensa espiritual y corte de lazos.', precio:16900 },

  /* Insumos rituales */
  { id:'r1', cat:'rituales', nombre:'Baño energético de ruda', desc:'Preparado listo para limpieza personal.', precio:6900 },
  { id:'r2', cat:'rituales', nombre:'Aceite ritual de abundancia', desc:'Para ungir velas, manos y amuletos.', precio:6500 },
  { id:'r3', cat:'rituales', nombre:'Kit limpieza de hogar', desc:'Sahumerio, sal, vela y aceite en un pack.', precio:19900 },
  { id:'r4', cat:'rituales', nombre:'Agua florida', desc:'Clásico esencial de todo altar.', precio:5500 },
  { id:'r5', cat:'rituales', nombre:'Mortero de piedra', desc:'Para moler hierbas y resinas.', precio:15900 }
];

/* ---------------- Servicios de Tarot --------------------- */
const SERVICIOS_TAROT = [
  {
    id: 'tarot-3',
    nombre: '3 preguntas',
    precio: 10000,
    duracion: 'Preguntas libres',
    desc: 'Ideal cuando llegas con dudas puntuales y necesitas una respuesta directa.',
    incluye: [
      'Tres preguntas sobre lo que necesites saber',
      'Amor, trabajo, dinero, salud o familia',
      'Lectura honesta, empática y confidencial'
    ]
  },
  {
    id: 'tarot-6',
    nombre: '6 preguntas',
    precio: 18000,
    duracion: 'Preguntas libres',
    desc: 'Más espacio para profundizar en un tema o abordar varias áreas de tu vida.',
    incluye: [
      'Seis preguntas libres',
      'Ejemplo: qué piensa alguien de mí, cómo se proyecta mi relación',
      'Orientación para tomar mejores decisiones'
    ]
  },
  {
    id: 'tarot-completo',
    nombre: 'Sesión completa',
    precio: 30000,
    duracion: '1 hora 20 minutos',
    destacado: 'La más completa',
    desc: 'Una lectura profunda de tu pasado, presente y las tendencias que se proyectan hacia tu futuro.',
    incluye: [
      'Pasado que aún influye en tu presente',
      'Tu presente emocional, espiritual y energético',
      'Amor, dinero y trabajo',
      'Salud desde una mirada holística',
      'Bloqueos, karma y patrones repetitivos',
      'Tendencias para los próximos 6 meses',
      '5 preguntas libres al final'
    ]
  }
];

/* ---------------- Otros servicios ------------------------
   precio: null  → se muestra "Valor a consultar"
   ========================================================= */
const SERVICIOS_OTROS = [
  { id:'carta-astral',    nombre:'Carta astral',            precio:null, desc:'Tu mapa natal completo: personalidad, ciclos y potenciales.' },
  { id:'carta-vocacional',nombre:'Carta vocacional',        precio:null, desc:'Orientación de propósito y camino laboral según tu carta.' },
  { id:'compatibilidad',  nombre:'Compatibilidad amorosa',  precio:null, desc:'Análisis de vínculo entre dos cartas natales.' },
  { id:'numerologia',     nombre:'Lectura numerológica',    precio:null, desc:'Tus números personales y el ciclo en que te encuentras.' },
  { id:'quiromancia',     nombre:'Quiromancia',             precio:null, desc:'Lectura de manos, solo presencial en el local.' },
  { id:'limpiezas',       nombre:'Limpiezas energéticas',   precio:null, desc:'Brujería, mal de ojo y malas vibras. Personas y hogares.' },
  { id:'rituales',        nombre:'Rituales a medida',       precio:null, desc:'Abundancia, salud y amor, diseñados para tu caso.' },
  { id:'chakras',         nombre:'Alineación de chakras',   precio:null, desc:'Trabajo energético para reordenar tus centros.' },
  { id:'acupuntura',      nombre:'Acupuntura y medicina china', precio:null, desc:'Terapia con Simón Pedro, certificado por el MINSAL.' },
  { id:'bach',            nombre:'Flores de Bach',          precio:null, desc:'Fórmula personalizada según tu estado emocional.' },
  { id:'aromaterapia',    nombre:'Aromaterapia',            precio:null, desc:'Aceites esenciales para acompañar tu proceso.' },
  { id:'cursos',          nombre:'Cursos',                  precio:null, desc:'Tarot profesional, velas, magia blanca y magia verde.' }
];
