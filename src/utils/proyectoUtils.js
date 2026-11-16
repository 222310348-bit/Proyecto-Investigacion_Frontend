// Longitudes máximas de la tabla `proyecto` (las mismas que valida el backend)
export const LIMITES = { clave: 100, proyecto: 1000, objetivo: 1000, participantes: 500 };

export const ETIQUETA_TIPO = {
    interno: 'Proyecto Interno',
    externo: 'Proyecto Externo',
};

// Igual que el sitio original y el backend: el tipo se distingue por el inicio de la clave
export const obtenerTipo = (clave = '') => {
    const inicio = clave.trim().toUpperCase();
    if (inicio.startsWith('ITSLERDO')) return 'interno';
    if (inicio.startsWith('CONACYT')) return 'externo';
    return 'otro';
};

// En la base los participantes se guardan en un solo texto separado por "/"
export const separarParticipantes = (texto) => {
    if (!texto) return [];
    return texto.split('/').map((nombre) => nombre.trim()).filter(Boolean);
};

export const unirParticipantes = (lista) => lista.join(' / ');

export const obtenerIniciales = (nombre = '') => {
    const palabras = nombre.trim().split(/\s+/).filter((palabra) => palabra && !palabra.endsWith('.'));
    return palabras.slice(0, 2).map((palabra) => palabra[0].toUpperCase()).join('');
};

// Quita mayúsculas y acentos para que la búsqueda no dependa de ellos
export const normalizarTexto = (texto = '') =>
    texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const coincideBusqueda = (proyecto, busqueda) => {
    const termino = normalizarTexto(busqueda.trim());
    if (!termino) return true;
    return [proyecto.clave, proyecto.proyecto, proyecto.objetivo, proyecto.participantes]
        .some((campo) => normalizarTexto(campo || '').includes(termino));
};
