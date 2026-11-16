// Mismas reglas que valida el backend (src/utils/validaciones.js)
export const DOMINIO_CORREO = 'itslerdo.edu.mx';
export const LIMITE_USUARIO = 50;
export const LIMITE_PASSWORD = 72;

// Estándar de seguridad de la contraseña
export const REGLAS_PASSWORD = [
    { id: 'longitud', texto: 'Al menos 8 caracteres', cumple: (texto) => texto.length >= 8 },
    { id: 'mayuscula', texto: 'Una letra mayúscula', cumple: (texto) => /\p{Lu}/u.test(texto) },
    { id: 'minuscula', texto: 'Una letra minúscula', cumple: (texto) => /\p{Ll}/u.test(texto) },
    { id: 'numero', texto: 'Un número', cumple: (texto) => /\d/.test(texto) },
    { id: 'simbolo', texto: 'Un símbolo (por ejemplo # $ % & ! ?)', cumple: (texto) => /[^\p{L}\p{N}\s]/u.test(texto) },
];

export const passwordCumple = (texto) => REGLAS_PASSWORD.every((regla) => regla.cumple(texto));

export const esCorreoInstitucional = (valor = '') => {
    const dominio = DOMINIO_CORREO.replace(/\./g, '\\.');
    const formato = new RegExp(`^[a-z0-9]+([._-][a-z0-9]+)*@${dominio}$`);
    return formato.test(valor.trim().toLowerCase());
};
