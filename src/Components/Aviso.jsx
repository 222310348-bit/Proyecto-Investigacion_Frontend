import Icono from './Icono';

const ESTILOS = {
    exito: {
        contenedor: 'bg-[#f0fdf4]',
        circulo: 'bg-[#86efac] text-[#065f46]',
        titulo: 'text-[#065f46]',
        mensaje: 'text-[#166534]',
        cerrar: 'text-[#166534] hover:bg-[#dcfce7]',
        icono: 'check',
    },
    error: {
        contenedor: 'bg-error-container/60',
        circulo: 'bg-error-container text-error',
        titulo: 'text-error',
        mensaje: 'text-on-surface',
        cerrar: 'text-secondary hover:bg-error-container',
        icono: 'error',
    },
};

// Aviso breve de éxito o error. 'aviso' es { tipo: 'exito' | 'error', titulo, mensaje }
const Aviso = ({ aviso, onCerrar }) => {
    if (!aviso) return null;
    const estilo = ESTILOS[aviso.tipo] || ESTILOS.error;

    return (
        <section
            role={aviso.tipo === 'error' ? 'alert' : 'status'}
            className={`w-full rounded-lg p-space-md mb-space-lg flex items-center justify-between gap-space-sm shadow-sm ${estilo.contenedor}`}
        >
            <div className="flex items-center gap-space-sm">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${estilo.circulo}`}>
                    <Icono nombre={estilo.icono} className="text-[20px]" />
                </span>
                <div>
                    <p className={`font-label-md text-label-md font-semibold ${estilo.titulo}`}>{aviso.titulo}</p>
                    <p className={`font-body-md text-body-md ${estilo.mensaje}`}>{aviso.mensaje}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={onCerrar}
                title="Cerrar aviso"
                className={`p-space-xs rounded-full transition-colors flex items-center ${estilo.cerrar}`}
            >
                <Icono nombre="close" className="text-[20px]" />
            </button>
        </section>
    );
};

export default Aviso;
