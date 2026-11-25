import Icono from './Icono';
import { ICONOS_PROYECTO } from '../utils/iconoUtils';

const CLASE_OPCION = 'h-full flex flex-col items-center justify-center gap-1 rounded-lg border border-surface-container-high bg-surface-container-lowest p-space-sm text-center text-secondary transition-colors hover:border-primary/40 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40';

// Elección del icono del proyecto. Valor vacío = automático (el icono del área que indica la clave)
const SelectorIcono = ({ valor, sugerido, onCambiar, error }) => {
    const opciones = [
        { clave: '', simbolo: ICONOS_PROYECTO[sugerido].simbolo, texto: 'Automático' },
        ...Object.entries(ICONOS_PROYECTO).map(([clave, icono]) => ({ clave, ...icono })),
    ];

    return (
        <fieldset className="flex flex-col gap-1.5">
            <legend className="font-label-md text-label-md text-on-surface font-semibold mb-1.5">Icono del proyecto</legend>
            <p className="font-body-sm text-body-sm text-secondary">
                «Automático» usa el icono que corresponde a la clave: {ICONOS_PROYECTO[sugerido].texto}.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-space-xs mt-space-xs">
                {opciones.map((opcion) => (
                    <label key={opcion.clave || 'automatico'} className="cursor-pointer">
                        <input
                            type="radio"
                            name="icono"
                            value={opcion.clave}
                            checked={valor === opcion.clave}
                            onChange={() => onCambiar(opcion.clave)}
                            className="sr-only peer"
                        />
                        <span className={CLASE_OPCION}>
                            <Icono nombre={opcion.simbolo} className="text-[24px]" />
                            <span className="font-label-sm text-label-sm leading-tight">{opcion.texto}</span>
                        </span>
                    </label>
                ))}
            </div>
            {error && <span className="font-body-sm text-body-sm text-error">{error}</span>}
        </fieldset>
    );
};

export default SelectorIcono;
