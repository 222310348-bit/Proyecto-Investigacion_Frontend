export const SITIO_INSTITUCIONAL = 'https://www.lerdo.tecnm.mx/';

export const CONTACTO = {
    nombre: 'TecNM - Lerdo',
    direccion: [
        'Av. Tecnológico No. 1555 Sur',
        'Periférico Gómez - Lerdo Km. 14.5',
        'Ciudad Lerdo, Durango, C.P. 35150',
    ],
    correo: 'comunicacion@itslerdo.edu.mx',
    telefonos: ['871-725-23-71', '871-725-57-79', '871-725-58-02'],
};

// Enlaces tomados del sitio original
export const REDES = [
    { texto: 'Facebook', url: 'https://www.facebook.com/Instituto-Tecnol%C3%B3gico-Superior-de-Lerdo-P%C3%A1gina-Oficial-285056498195463/' },
    { texto: 'Twitter', url: 'https://twitter.com/ITSLerdo' },
];

// Franjas de logotipos oficiales. Para actualizarlas basta con reemplazar el archivo
// en public/images o cambiar aquí la ruta y el texto alternativo.
export const BANNERS = {
    encabezado: {
        imagen: '/images/banner-institucional.png',
        alt: 'Tecnológico Nacional de México, Gobierno del Estado de Durango e Instituto Tecnológico Superior de Lerdo',
    },
    pie: {
        imagen: '/images/banner-sep.jpg',
        alt: 'Secretaría de Educación Pública',
    },
};

// Secciones de la página principal que aparecen en el menú
export const SECCIONES_MENU = [
    { ancla: 'inicio', texto: 'Inicio' },
    { ancla: 'proyectos', texto: 'Proyectos' },
    { ancla: 'servicios', texto: 'Servicios' },
    { ancla: 'empresas', texto: 'Empresas' },
    { ancla: 'convocatorias', texto: 'Convocatorias' },
];
