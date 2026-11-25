import { obtenerTipo } from './proyectoUtils';

// Iconos que el administrador puede asignar a un proyecto (columna ICONO de la tabla proyecto).
// Las claves deben coincidir con ICONOS_PROYECTO del backend (src/utils/iconosProyecto.js).
// 'simbolo' es el nombre del icono en Material Symbols.
export const ICONOS_PROYECTO = {
    posgrado: { simbolo: 'school', texto: 'Posgrado' },
    ambiental: { simbolo: 'eco', texto: 'Ingeniería Ambiental' },
    sistemas: { simbolo: 'computer', texto: 'Sistemas Computacionales' },
    electronica: { simbolo: 'memory', texto: 'Electrónica' },
    industrial: { simbolo: 'precision_manufacturing', texto: 'Industrial' },
    alimentos: { simbolo: 'restaurant', texto: 'Alimentos' },
    agua: { simbolo: 'water_drop', texto: 'Agua y sustentabilidad' },
    agroindustria: { simbolo: 'agriculture', texto: 'Agroindustria' },
    energia: { simbolo: 'bolt', texto: 'Energía' },
    educacion: { simbolo: 'menu_book', texto: 'Educación' },
    vinculacion: { simbolo: 'handshake', texto: 'Vinculación con empresa' },
    investigacion: { simbolo: 'science', texto: 'Investigación' },
};

// Código de área de las claves internas (ITSLerdo #001-AMBI-2016) y el icono que le corresponde
const ICONO_POR_AREA = {
    POSG: 'posgrado',
    AMBI: 'ambiental',
    SIST: 'sistemas',
    ELEC: 'electronica',
    INDU: 'industrial',
};

export const obtenerArea = (clave = '') => {
    const coincidencia = clave.match(/-([A-Za-z]+)-\d{4}/);
    return coincidencia ? coincidencia[1].toUpperCase() : null;
};

// Icono que se usa cuando el administrador no eligió uno
export const obtenerIconoSugerido = (clave = '') => {
    if (obtenerTipo(clave) === 'externo') return 'vinculacion';
    return ICONO_POR_AREA[obtenerArea(clave)] || 'investigacion';
};

export const obtenerIconoProyecto = (proyecto) =>
    ICONOS_PROYECTO[proyecto.icono] ? proyecto.icono : obtenerIconoSugerido(proyecto.clave);
