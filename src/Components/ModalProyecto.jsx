import { useEffect, useMemo, useState } from 'react';
import Icono from './Icono';
import CampoParticipantes from './CampoParticipantes';
import proyectoService from '../services/proyectoService';
import { LIMITES, separarParticipantes, unirParticipantes } from '../utils/proyectoUtils';
import { construirDirectorio, limpiarNombre, mismaPersona } from '../utils/participantesUtils';

const CLASE_CAMPO = 'w-full bg-surface-container-low rounded-lg text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container/30';

// Ventana modal para crear o editar. Si 'proyecto' es null se crea uno nuevo.
// 'proyectos' son todos los registrados, para el historial de participantes
const ModalProyecto = ({ proyecto, proyectos = [], onCerrar, onGuardado, onSesionExpirada }) => {
    const editando = Boolean(proyecto);
    const [formData, setFormData] = useState({
        clave: proyecto?.clave?.trim() || '',
        proyecto: proyecto?.proyecto || '',
        objetivo: proyecto?.objetivo || '',
    });
    const [participantes, setParticipantes] = useState(separarParticipantes(proyecto?.participantes));
    const [nuevoParticipante, setNuevoParticipante] = useState('');
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');
    const [guardando, setGuardando] = useState(false);

    // Personas registradas en los demás proyectos
    const directorio = useMemo(() => construirDirectorio(proyectos, proyecto?.id), [proyectos, proyecto]);

    // Cerrar con la tecla Escape
    useEffect(() => {
        const alPresionar = (e) => {
            if (e.key === 'Escape' && !guardando) onCerrar();
        };
        document.addEventListener('keydown', alPresionar);
        return () => document.removeEventListener('keydown', alPresionar);
    }, [guardando, onCerrar]);

    const cambiarCampo = (campo, valor) => {
        setFormData({ ...formData, [campo]: valor });
        setErrores({ ...errores, [campo]: undefined });
        setErrorGeneral('');
    };

    // Devuelve la lista con el nombre que esté escrito en el campo (si hay alguno)
    const listaConPendiente = () => {
        const nombre = limpiarNombre(nuevoParticipante);
        if (!nombre || participantes.some((p) => mismaPersona(p, nombre))) return participantes;
        return [...participantes, nombre];
    };

    const cambiarParticipantes = (lista) => {
        setParticipantes(lista);
        setErrores({ ...errores, participantes: undefined });
        setErrorGeneral('');
    };

    // Mismas reglas que valida el backend
    const validar = (datos) => {
        const encontrados = {};
        if (!datos.clave) encontrados.clave = 'Este campo es obligatorio.';
        if (!datos.proyecto) encontrados.proyecto = 'Este campo es obligatorio.';
        if (datos.participantes.length > LIMITES.participantes) {
            encontrados.participantes = `Máximo ${LIMITES.participantes} caracteres en total.`;
        }
        return encontrados;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const lista = listaConPendiente();
        const datos = {
            clave: formData.clave.trim(),
            proyecto: formData.proyecto.trim(),
            objetivo: formData.objetivo.trim(),
            participantes: unirParticipantes(lista),
        };

        const encontrados = validar(datos);
        if (Object.keys(encontrados).length > 0) {
            setErrores(encontrados);
            return;
        }

        setGuardando(true);
        setErrorGeneral('');
        try {
            const guardado = editando
                ? await proyectoService.actualizar(proyecto.id, datos)
                : await proyectoService.crear(datos);
            onGuardado(guardado, editando);
        } catch (error) {
            if (error.response?.status === 401) {
                onSesionExpirada();
                return;
            }
            setErrores(error.response?.data?.errores || {});
            setErrorGeneral(error.response?.data?.mensaje || 'No se pudo conectar con el servidor.');
            setGuardando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-[#0f172a]/50 backdrop-blur-sm">
            <form
                onSubmit={handleSubmit}
                noValidate
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal-proyecto"
                className="bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]"
            >
                {/* Encabezado */}
                <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                        <div className="w-8 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center">
                            <Icono nombre={editando ? 'edit_note' : 'add'} className="text-[20px]" />
                        </div>
                        <div>
                            <h2 id="titulo-modal-proyecto" className="font-headline-sm text-headline-sm text-on-surface leading-tight">
                                {editando ? 'Editar proyecto' : 'Nuevo proyecto'}
                            </h2>
                            {editando && (
                                <span className="font-code-tech text-code-tech text-secondary">
                                    Registro: {proyecto.clave.trim()}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onCerrar}
                        disabled={guardando}
                        title="Cerrar"
                        className="text-secondary hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors flex items-center"
                    >
                        <Icono nombre="close" className="text-[24px]" />
                    </button>
                </div>

                {/* Cuerpo (formulario) */}
                <div className="p-space-lg overflow-y-auto flex flex-col gap-space-md">
                    {errorGeneral && (
                        <div role="alert" className="p-space-md rounded-lg bg-error-container/60 flex items-start gap-space-sm">
                            <Icono nombre="error" className="text-[20px] text-error shrink-0" />
                            <p className="font-body-md text-body-md text-on-surface">{errorGeneral}</p>
                        </div>
                    )}

                    {/* Campo: Clave */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="campo-clave" className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between">
                            <span>Clave del proyecto *</span>
                            <span className="font-body-sm text-body-sm text-secondary">Ej. ITSLerdo #001-SIST-2016 o CONACYT 214582</span>
                        </label>
                        <input
                            id="campo-clave"
                            type="text"
                            maxLength={LIMITES.clave}
                            value={formData.clave}
                            onChange={(e) => cambiarCampo('clave', e.target.value)}
                            className={`${CLASE_CAMPO} px-space-md py-2.5 font-code-tech text-code-tech`}
                        />
                        {errores.clave && <span className="font-body-sm text-body-sm text-error">{errores.clave}</span>}
                    </div>

                    {/* Campo: Proyecto (título) */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="campo-proyecto" className="font-label-md text-label-md text-on-surface font-semibold">
                                Proyecto *
                            </label>
                            <span className="font-code-tech text-code-tech text-secondary">
                                {formData.proyecto.length} / {LIMITES.proyecto} caracteres
                            </span>
                        </div>
                        <textarea
                            id="campo-proyecto"
                            rows="3"
                            maxLength={LIMITES.proyecto}
                            value={formData.proyecto}
                            onChange={(e) => cambiarCampo('proyecto', e.target.value)}
                            className={`${CLASE_CAMPO} p-space-md font-body-md text-body-md`}
                        />
                        {errores.proyecto && <span className="font-body-sm text-body-sm text-error">{errores.proyecto}</span>}
                    </div>

                    {/* Campo: Objetivo con contador de caracteres */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="campo-objetivo" className="font-label-md text-label-md text-on-surface font-semibold">
                                Objetivo
                            </label>
                            <span className="font-code-tech text-code-tech text-secondary">
                                {formData.objetivo.length} / {LIMITES.objetivo} caracteres
                            </span>
                        </div>
                        <textarea
                            id="campo-objetivo"
                            rows="5"
                            maxLength={LIMITES.objetivo}
                            value={formData.objetivo}
                            onChange={(e) => cambiarCampo('objetivo', e.target.value)}
                            className={`${CLASE_CAMPO} p-space-md font-body-md text-body-md`}
                        />
                        {errores.objetivo && <span className="font-body-sm text-body-sm text-error">{errores.objetivo}</span>}
                    </div>

                    {/* Campo: Participantes con historial de nombres registrados */}
                    <CampoParticipantes
                        participantes={participantes}
                        onCambiar={cambiarParticipantes}
                        texto={nuevoParticipante}
                        onCambiarTexto={setNuevoParticipante}
                        directorio={directorio}
                        error={errores.participantes}
                    />
                </div>

                {/* Pie */}
                <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-end gap-space-sm">
                    <button
                        type="button"
                        onClick={onCerrar}
                        disabled={guardando}
                        className="px-space-md py-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={guardando}
                        className="px-space-lg py-space-sm bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                        <Icono nombre="save" className="text-[18px]" />
                        <span>{guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear proyecto'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ModalProyecto;
