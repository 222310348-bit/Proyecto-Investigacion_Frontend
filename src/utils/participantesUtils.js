import { separarParticipantes, normalizarTexto } from './proyectoUtils';

// Títulos académicos que se ignoran al comparar nombres (M.C., M.A., Dr., Ing., Lic., Mtro....)
const TITULO = /^(m\.\s?[a-z]\.?|dra?\.?|ing\.?|lic\.?|mtr[oa]\.?|arq\.?|c\.p\.?|ph\.?d\.?)$/;

// Limpia lo que se escribe: espacios repetidos y punto o coma al final
export const limpiarNombre = (nombre = '') =>
    nombre.replace(/\s+/g, ' ').trim().replace(/[.,;]+$/, '').trim();

// Clave para reconocer a la misma persona escrita de distintas formas:
// sin acentos ni mayúsculas, sin títulos, sin prefijos como "ITSLerdo:", sin puntuación
// y con las palabras ordenadas ("Ríos Marmolejo César" = "César Ríos Marmolejo")
export const claveNombre = (nombre = '') => {
    let texto = normalizarTexto(limpiarNombre(nombre));
    texto = texto.replace(/^[^:]{1,40}:\s*/, '');
    const palabras = texto.split(' ').filter(Boolean);
    while (palabras.length > 1 && TITULO.test(palabras[0])) palabras.shift();
    return palabras
        .map((palabra) => palabra.replace(/[^a-z0-9]/g, ''))
        .filter(Boolean)
        .sort()
        .join(' ');
};

const distancia = (a, b) => {
    const fila = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        let anterior = fila[0];
        fila[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const temporal = fila[j];
            fila[j] = Math.min(fila[j] + 1, fila[j - 1] + 1, anterior + (a[i - 1] === b[j - 1] ? 0 : 1));
            anterior = temporal;
        }
    }
    return fila[b.length];
};

// Posible misma persona: a un nombre le falta una palabra del otro
// ("Armando Cordero Escamilla" / "Armando José Cordero Escamilla") o difieren por una o dos letras
const sonParecidos = (a, b) => {
    const [corto, largo] = a.palabras.length <= b.palabras.length ? [a, b] : [b, a];
    if (corto.palabras.length >= 3 && corto.palabras.every((palabra) => largo.palabras.includes(palabra))) {
        return true;
    }
    return Math.min(a.clave.length, b.clave.length) >= 12 && distancia(a.clave, b.clave) <= 2;
};

const contarAcentos = (texto) => (texto.normalize('NFD').match(/[̀-ͯ]/g) || []).length;
const tienePrefijo = (texto) => texto.includes(':') || TITULO.test(normalizarTexto(texto).split(' ')[0]);

// Directorio de participantes registrados en los proyectos (sin contar el que se está editando).
// Cada entrada agrupa las formas de escribir a una persona y elige como nombre la más usada.
export const construirDirectorio = (proyectos, idExcluido = null) => {
    const grupos = new Map();

    proyectos.forEach((proyecto) => {
        if (proyecto.id === idExcluido) return;
        separarParticipantes(proyecto.participantes).forEach((original) => {
            const nombre = limpiarNombre(original);
            const clave = claveNombre(nombre);
            if (!clave) return;
            if (!grupos.has(clave)) {
                grupos.set(clave, { clave, palabras: clave.split(' '), usos: new Map(), proyectos: new Map() });
            }
            const grupo = grupos.get(clave);
            grupo.usos.set(nombre, (grupo.usos.get(nombre) || 0) + 1);
            grupo.proyectos.set(proyecto.id, proyecto.clave.trim());
        });
    });

    const directorio = [...grupos.values()].map((grupo) => {
        const formas = [...grupo.usos.entries()]
            .sort(([a, usosA], [b, usosB]) =>
                usosB - usosA
                || Number(tienePrefijo(a)) - Number(tienePrefijo(b))
                || contarAcentos(b) - contarAcentos(a)
                || a.localeCompare(b, 'es'))
            .map(([nombre]) => nombre);
        return {
            clave: grupo.clave,
            palabras: grupo.palabras,
            nombre: formas[0],
            variantes: formas.slice(1),
            proyectos: [...grupo.proyectos.values()],
            parecidos: [],
        };
    });

    directorio.forEach((a, i) => {
        directorio.slice(i + 1).forEach((b) => {
            if (sonParecidos(a, b)) {
                a.parecidos.push(b.nombre);
                b.parecidos.push(a.nombre);
            }
        });
    });

    return directorio.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
};

// Compara un nombre con el directorio:
// null = no está registrado ni se parece a nadie; 'exacta' = escrito igual que en el directorio;
// 'variante' = la misma persona escrita de otra forma; 'parecido' = posiblemente la misma persona
export const buscarCoincidencia = (nombre, directorio) => {
    const limpio = limpiarNombre(nombre);
    const clave = claveNombre(limpio);
    if (!clave) return null;

    const mismo = directorio.find((grupo) => grupo.clave === clave);
    if (mismo) {
        return { tipo: mismo.nombre === limpio ? 'exacta' : 'variante', grupo: mismo };
    }
    const parecido = directorio.find((grupo) => sonParecidos({ clave, palabras: clave.split(' ') }, grupo));
    return parecido ? { tipo: 'parecido', grupo: parecido } : null;
};

// Filtra el directorio con lo que se va escribiendo (cada palabra escrita debe aparecer)
export const filtrarDirectorio = (directorio, texto) => {
    const terminos = normalizarTexto(texto).split(/\s+/).filter(Boolean);
    if (terminos.length === 0) return directorio;
    return directorio.filter((grupo) => {
        const contenido = normalizarTexto([grupo.nombre, ...grupo.variantes].join(' '));
        return terminos.every((termino) => contenido.includes(termino));
    });
};

export const mismaPersona = (a, b) => claveNombre(a) === claveNombre(b);
