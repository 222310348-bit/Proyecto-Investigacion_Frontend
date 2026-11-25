// Título de una sección de la página principal. 'claro' es para fondos rojos u oscuros
const EncabezadoSeccion = ({ id, antetitulo, titulo, descripcion, claro = false }) => {
    return (
        <div className="max-w-3xl mb-space-xl">
            {antetitulo && (
                <span className={`block font-code-tech text-code-tech uppercase tracking-widest mb-space-xs ${claro ? 'text-accent-container' : 'text-primary'}`}>
                    {antetitulo}
                </span>
            )}
            <h2
                id={id}
                className={`font-headline-lg-mobile text-headline-lg-mobile sm:font-headline-lg sm:text-headline-lg ${claro ? 'text-on-primary' : 'text-on-surface'}`}
            >
                {titulo}
            </h2>
            <span className={`block w-12 h-1 rounded mt-space-sm ${claro ? 'bg-accent-container' : 'bg-accent'}`} aria-hidden="true"></span>
            {descripcion && (
                <p className={`font-body-lg text-body-lg mt-space-md ${claro ? 'text-on-primary/85' : 'text-secondary'}`}>
                    {descripcion}
                </p>
            )}
        </div>
    );
};

export default EncabezadoSeccion;
