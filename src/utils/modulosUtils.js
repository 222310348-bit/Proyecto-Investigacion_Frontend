// Contenido de los módulos que no dependen de la base de datos.

// Información proporcionada por el instituto, sujeta a cambios
export const SERVICIOS_ESPECIALIZADOS = [
    { titulo: 'Pruebas de Tensión', icono: 'expand' },
    { titulo: 'Pruebas de Capacitación', icono: 'co_present' },
];

// Empresas que aparecen en los proyectos externos registrados.
// 'claves' liga cada empresa con sus proyectos para enlazar al detalle.
export const EMPRESAS_ASOCIADAS = [
    {
        nombre: 'Grupo Lala',
        razonSocial: 'Complejo Lala UHT y Transportadora de Alimentos, S.A. de C.V.',
        claves: ['CONACYT 214582', 'CONACYT 209808', 'CONACYT 195766'],
    },
    {
        nombre: 'Orbe Kultiva',
        razonSocial: 'Orbe Kultiva, S.A.',
        claves: ['CONACYT 213198'],
    },
    {
        nombre: 'Moringa del Desierto',
        razonSocial: 'Moringa del Desierto SPR de RL de CV',
        claves: ['CONACYT 221224'],
    },
    {
        nombre: 'Equinox',
        razonSocial: 'Equipos Inoxidables del Norte, S.A. de C.V.',
        claves: ['CONACYT 232498'],
    },
    {
        nombre: 'Medizone',
        razonSocial: 'MEDIZONE, S.A. de C.V.',
        claves: ['CONACYT 232056'],
    },
    {
        nombre: 'Reverté Carbonatos de Calcio',
        razonSocial: 'S.A. Reverté Carbonatos de Calcio',
        claves: ['CONACYT 213121'],
    },
    {
        nombre: 'Fundación Interdisciplinaria para el Desarrollo Empresarial',
        razonSocial: 'S. de R.L. de C.V.',
        claves: ['CONACYT 231156'],
    },
];

// Convocatorias vigentes. Para publicar una, agrega un objeto con esta forma:
// { titulo: 'Nombre', descripcion: 'Resumen', cierre: '2027-01-31', url: 'https://...' }
export const CONVOCATORIAS = [];

// Tarjetas de la página principal. 'ancla' es la sección a la que llevan.
export const MODULOS = [
    {
        id: 'internos',
        ancla: 'internos',
        titulo: 'Proyectos Internos',
        descripcion: 'Proyectos financiados por el ITS de Lerdo.',
        imagen: '/images/logo-itsl-escudo.png',
    },
    {
        id: 'externos',
        ancla: 'externos',
        titulo: 'Proyectos Externos',
        descripcion: 'Proyectos con empresas, apoyados por convocatorias CONACYT.',
        imagen: '/images/logo-conacyt.png',
    },
    {
        id: 'servicios',
        ancla: 'servicios',
        titulo: 'Servicios Especializados',
        descripcion: 'Pruebas y servicios técnicos que ofrece el instituto.',
        icono: 'engineering',
    },
    {
        id: 'empresas',
        ancla: 'empresas',
        titulo: 'Empresas Asociadas',
        descripcion: 'Empresas con las que el instituto ha desarrollado proyectos.',
        icono: 'domain',
    },
    {
        id: 'convocatorias',
        ancla: 'convocatorias',
        titulo: 'Convocatorias',
        descripcion: 'Convocatorias abiertas para participar en proyectos.',
        icono: 'campaign',
    },
];

// Compara claves aunque tengan espacios o tabuladores de más
export const normalizarClave = (clave = '') => clave.replace(/\s+/g, ' ').trim().toUpperCase();
