// Icono de Material Symbols. 'nombre' es el identificador del icono (ej. "search")
const Icono = ({ nombre, className = '' }) => {
    return (
        <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
            {nombre}
        </span>
    );
};

export default Icono;
