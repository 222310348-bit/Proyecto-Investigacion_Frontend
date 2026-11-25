import Icono from './Icono';
import { ICONOS_PROYECTO, obtenerIconoProyecto } from '../utils/iconoUtils';
import { obtenerTipo } from '../utils/proyectoUtils';

const TAMANOS = {
    sm: { caja: 'w-8 h-8 rounded', icono: 'text-[18px]' },
    md: { caja: 'w-11 h-11 rounded-lg', icono: 'text-[24px]' },
    lg: { caja: 'w-16 h-16 rounded-xl', icono: 'text-[36px]' },
};

// Internos en rojo institucional y externos en dorado
const COLORES = {
    externo: 'bg-accent-container text-on-accent-container',
    otro: 'bg-primary text-on-primary',
    interno: 'bg-primary text-on-primary',
};

// Icono del proyecto: el que eligió el administrador o, si no eligió, el de su área
const IconoProyecto = ({ proyecto, tamano = 'md', className = '' }) => {
    const icono = ICONOS_PROYECTO[obtenerIconoProyecto(proyecto)];
    const medidas = TAMANOS[tamano];

    return (
        <span
            title={icono.texto}
            className={`inline-flex items-center justify-center shrink-0 ${medidas.caja} ${COLORES[obtenerTipo(proyecto.clave)]} ${className}`}
        >
            <Icono nombre={icono.simbolo} className={medidas.icono} />
            <span className="sr-only">{icono.texto}</span>
        </span>
    );
};

export default IconoProyecto;
