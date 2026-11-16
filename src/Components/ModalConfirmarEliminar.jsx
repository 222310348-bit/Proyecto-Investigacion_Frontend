import { useEffect } from 'react';
import Icono from './Icono';

// Diálogo de confirmación antes de eliminar. El mensaje se pasa como contenido (children)
const ModalConfirmarEliminar = ({ titulo, children, eliminando, onCancelar, onConfirmar }) => {
    // Cerrar con la tecla Escape
    useEffect(() => {
        const alPresionar = (e) => {
            if (e.key === 'Escape' && !eliminando) onCancelar();
        };
        document.addEventListener('keydown', alPresionar);
        return () => document.removeEventListener('keydown', alPresionar);
    }, [eliminando, onCancelar]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-[#0f172a]/50 backdrop-blur-sm">
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="titulo-eliminar"
                className="bg-surface-container-lowest w-full max-w-[480px] rounded-xl p-space-lg shadow-2xl flex flex-col gap-space-md"
            >
                <div className="flex items-start gap-space-sm">
                    <div className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center shrink-0">
                        <Icono nombre="warning" className="text-[24px]" />
                    </div>
                    <div>
                        <span className="font-label-sm text-label-sm text-error uppercase font-bold tracking-wider">Confirmación</span>
                        <h3 id="titulo-eliminar" className="font-headline-sm text-[18px] text-on-surface leading-tight mt-0.5">
                            {titulo}
                        </h3>
                    </div>
                </div>

                <p className="font-body-md text-body-md text-secondary break-words">{children}</p>

                <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                    <button
                        type="button"
                        onClick={onCancelar}
                        disabled={eliminando}
                        className="px-space-md py-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirmar}
                        disabled={eliminando}
                        className="px-space-md py-space-sm bg-error hover:bg-[#991515] text-on-error font-label-md text-label-md rounded-lg shadow-sm transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                        <Icono nombre="delete_forever" className="text-[18px]" />
                        <span>{eliminando ? 'Eliminando...' : 'Eliminar definitivamente'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmarEliminar;
