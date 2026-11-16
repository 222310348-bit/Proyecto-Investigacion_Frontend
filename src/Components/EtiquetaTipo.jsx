import { ETIQUETA_TIPO } from '../utils/proyectoUtils';

const ESTILOS = {
    interno: 'bg-secondary-container text-on-secondary-fixed',
    externo: 'bg-primary-fixed text-on-primary-fixed-variant',
};

// Insignia "Proyecto Interno" / "Proyecto Externo". Si la clave no sigue ningún formato no muestra nada
const EtiquetaTipo = ({ tipo }) => {
    if (!ETIQUETA_TIPO[tipo]) return null;

    return (
        <span className={`inline-block px-space-sm py-0.5 rounded font-label-sm text-label-sm uppercase tracking-wider ${ESTILOS[tipo]}`}>
            {ETIQUETA_TIPO[tipo]}
        </span>
    );
};

export default EtiquetaTipo;
