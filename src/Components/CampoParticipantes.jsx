import { useMemo } from 'react';
import Icono from './Icono';
import { obtenerIniciales } from '../utils/proyectoUtils';
import { buscarCoincidencia, filtrarDirectorio, limpiarNombre, mismaPersona } from '../utils/participantesUtils';

const textoProyectos = (cantidad) => `${cantidad} ${cantidad === 1 ? 'proyecto' : 'proyectos'}`;

// Participantes de un proyecto con el historial de personas ya registradas en otros proyectos,
// para escribir cada nombre siempre igual. 'texto' es lo que está escrito en el campo, aún sin agregar
const CampoParticipantes = ({ participantes, onCambiar, texto, onCambiarTexto, directorio, error }) => {
    const visibles = useMemo(() => filtrarDirectorio(directorio, texto), [directorio, texto]);

    // Nombres del proyecto que ya existen escritos de otra forma, o que se parecen a alguien registrado
    const avisos = useMemo(() => participantes
        .map((nombre) => ({ nombre, coincidencia: buscarCoincidencia(nombre, directorio) }))
        .filter(({ coincidencia }) => coincidencia && coincidencia.tipo !== 'exacta'),
    [participantes, directorio]);
    const conAviso = new Set(avisos.map((aviso) => aviso.nombre));

    const agregar = (nombre) => {
        const limpio = limpiarNombre(nombre);
        onCambiarTexto('');
        // No se agrega dos veces a la misma persona aunque esté escrita distinto
        if (!limpio || participantes.some((p) => mismaPersona(p, limpio))) return;
        onCambiar([...participantes, limpio]);
    };

    const quitar = (nombre) => onCambiar(participantes.filter((p) => p !== nombre));

    // Cambia un nombre por la forma registrada, sin duplicar si esa forma ya estaba en la lista
    const homologar = (nombre, registrado) => {
        const yaEsta = participantes.includes(registrado);
        onCambiar(participantes.flatMap((p) => {
            if (p !== nombre) return [p];
            return yaEsta ? [] : [registrado];
        }));
    };

    const manejarTecla = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Evita que Enter envíe el formulario
            agregar(texto);
        } else if (e.key === 'Backspace' && !texto && participantes.length > 0) {
            onCambiar(participantes.slice(0, -1));
        }
    };

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <label htmlFor="campo-participante" className="font-label-md text-label-md text-on-surface font-semibold">
                    Participantes
                </label>
                <span className="font-label-sm text-label-sm text-secondary">
                    {participantes.length} {participantes.length === 1 ? 'agregado' : 'agregados'}
                </span>
            </div>

            {/* Participantes del proyecto (chips) y campo para escribir */}
            <div className="flex flex-wrap gap-2 p-2.5 bg-surface-container-low rounded-lg min-h-[50px] items-center">
                {participantes.map((nombre) => (
                    <span
                        key={nombre}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm text-on-surface shadow-sm ${
                            conAviso.has(nombre) ? 'bg-[#fffbeb] ring-1 ring-[#f59e0b]' : 'bg-surface-container-lowest'
                        }`}
                    >
                        {conAviso.has(nombre) ? (
                            <Icono nombre="warning" className="text-[14px] text-[#b45309]" />
                        ) : (
                            <span className="w-4 h-4 rounded-full bg-primary-container text-on-primary text-[10px] flex items-center justify-center font-bold">
                                {obtenerIniciales(nombre).charAt(0)}
                            </span>
                        )}
                        <span>{nombre}</span>
                        <button
                            type="button"
                            onClick={() => quitar(nombre)}
                            title={`Quitar a ${nombre}`}
                            className="text-secondary hover:text-error ml-0.5 flex items-center"
                        >
                            <Icono nombre="close" className="text-[14px]" />
                        </button>
                    </span>
                ))}
                <input
                    id="campo-participante"
                    type="text"
                    autoComplete="off"
                    value={texto}
                    onChange={(e) => onCambiarTexto(e.target.value.replace('/', ''))}
                    onKeyDown={manejarTecla}
                    placeholder="Buscar o escribir un nombre y presionar Enter"
                    className="flex-1 bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-secondary focus:outline-none min-w-[240px] px-2 py-1"
                />
            </div>
            {error && <span className="font-body-sm text-body-sm text-error">{error}</span>}

            {/* Avisos de homologación */}
            {avisos.length > 0 && (
                <ul aria-label="Avisos de homologación" className="flex flex-col gap-1.5">
                    {avisos.map(({ nombre, coincidencia }) => (
                        <li key={nombre} className="p-space-sm rounded-lg bg-[#fffbeb] flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                            <p className="font-body-sm text-body-sm text-[#92400e]">
                                «{nombre}» {coincidencia.tipo === 'variante' ? 'ya está registrado como' : '¿es la misma persona que'}{' '}
                                <span className="font-semibold">«{coincidencia.grupo.nombre}»</span>
                                {coincidencia.tipo === 'parecido' && '?'} ({textoProyectos(coincidencia.grupo.proyectos.length)}).
                            </p>
                            <button
                                type="button"
                                onClick={() => homologar(nombre, coincidencia.grupo.nombre)}
                                className="shrink-0 px-space-sm py-1 rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm shadow-sm transition-colors"
                            >
                                Usar «{coincidencia.grupo.nombre}»
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Historial: personas ya registradas en otros proyectos */}
            <section aria-label="Participantes registrados en otros proyectos" className="mt-1 rounded-lg ring-1 ring-surface-container-high overflow-hidden">
                <div className="px-space-sm py-1.5 bg-surface-container-low flex items-center justify-between gap-space-sm">
                    <span className="font-label-md text-label-md text-on-surface flex items-center gap-1">
                        <Icono nombre="history" className="text-[16px] text-secondary" />
                        Registrados en otros proyectos
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary">
                        {texto.trim() ? `${visibles.length} de ${directorio.length}` : `${directorio.length} personas`}
                    </span>
                </div>

                {visibles.length > 0 ? (
                    <ul className="max-h-48 overflow-y-auto divide-y divide-surface-container">
                        {visibles.map((grupo) => {
                            const agregado = participantes.some((p) => mismaPersona(p, grupo.nombre));
                            return (
                                <li key={grupo.clave}>
                                    <button
                                        type="button"
                                        onClick={() => agregar(grupo.nombre)}
                                        disabled={agregado}
                                        title={`Aparece en: ${grupo.proyectos.join(', ')}`}
                                        className="w-full text-left px-space-sm py-1.5 flex items-start justify-between gap-space-sm hover:bg-surface-container-low transition-colors disabled:cursor-default disabled:hover:bg-transparent"
                                    >
                                        <span className="min-w-0">
                                            <span className={`block font-body-sm text-body-sm font-semibold ${agregado ? 'text-secondary' : 'text-on-surface'}`}>
                                                {grupo.nombre}
                                            </span>
                                            {grupo.variantes.length > 0 && (
                                                <span className="block font-label-sm text-label-sm text-secondary">
                                                    También escrito: {grupo.variantes.join(' · ')}
                                                </span>
                                            )}
                                            {grupo.parecidos.length > 0 && (
                                                <span className="block font-label-sm text-label-sm text-[#b45309]">
                                                    ¿Misma persona que {grupo.parecidos.join(' o ')}?
                                                </span>
                                            )}
                                        </span>
                                        <span className="shrink-0 flex items-center gap-1 font-label-sm text-label-sm text-secondary">
                                            {agregado ? (
                                                <><Icono nombre="check" className="text-[14px] text-[#166534]" /> Agregado</>
                                            ) : (
                                                <>{textoProyectos(grupo.proyectos.length)} <Icono nombre="add" className="text-[16px] text-primary" /></>
                                            )}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="px-space-sm py-space-sm font-body-sm text-body-sm text-secondary">
                        {directorio.length === 0
                            ? 'Aún no hay participantes registrados en otros proyectos.'
                            : 'Nadie registrado coincide. Presiona Enter para agregarlo como participante nuevo.'}
                    </p>
                )}
            </section>
        </div>
    );
};

export default CampoParticipantes;
