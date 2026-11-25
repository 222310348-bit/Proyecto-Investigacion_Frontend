import { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import proyectoService from '../services/proyectoService';
import Icono from '../Components/Icono';
import Aviso from '../Components/Aviso';
import ModalProyecto from '../Components/ModalProyecto';
import ModalConfirmarEliminar from '../Components/ModalConfirmarEliminar';
import IconoProyecto from '../Components/IconoProyecto';
import { obtenerTipo, separarParticipantes, coincideBusqueda } from '../utils/proyectoUtils';

const FILTROS = [
    { id: 'todos', texto: 'Todos' },
    { id: 'interno', texto: 'Internos' },
    { id: 'externo', texto: 'Externos' },
];

const ETIQUETA_FILA = {
    interno: { texto: 'Interno', clase: 'text-[#065f46] bg-[#ecfdf5]' },
    externo: { texto: 'Externo', clase: 'text-on-primary-fixed-variant bg-primary-fixed' },
};

const AdminProyectos = () => {
    const { cerrarSesion } = useContext(AuthContext);
    const navigate = useNavigate();
    const [proyectos, setProyectos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('todos');
    const [aviso, setAviso] = useState(null);
    // modal: null (cerrado), { proyecto: null } (nuevo) o { proyecto } (editar)
    const [modal, setModal] = useState(null);
    const [porEliminar, setPorEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    const salir = useCallback(() => {
        cerrarSesion();
        navigate('/login');
    }, [cerrarSesion, navigate]);

    const cargar = useCallback(async () => {
        try {
            const data = await proyectoService.obtenerTodos();
            setProyectos(data);
        } catch (err) {
            console.error('Error al cargar:', err);
            setAviso({ tipo: 'error', titulo: 'Error', mensaje: 'No se pudieron cargar los proyectos.' });
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    const conteo = useMemo(() => ({
        todos: proyectos.length,
        interno: proyectos.filter((p) => obtenerTipo(p.clave) === 'interno').length,
        externo: proyectos.filter((p) => obtenerTipo(p.clave) === 'externo').length,
    }), [proyectos]);

    const visibles = useMemo(() => proyectos.filter((p) =>
        (filtro === 'todos' || obtenerTipo(p.clave) === filtro) && coincideBusqueda(p, busqueda)
    ), [proyectos, filtro, busqueda]);

    const cerrarModal = useCallback(() => setModal(null), []);
    const cancelarEliminar = useCallback(() => setPorEliminar(null), []);

    const handleGuardado = (guardado, editando) => {
        setModal(null);
        setAviso({
            tipo: 'exito',
            titulo: 'Operación exitosa',
            mensaje: `El proyecto "${guardado.clave}" fue ${editando ? 'actualizado' : 'creado'} correctamente.`,
        });
        cargar();
    };

    const handleEliminar = async () => {
        setEliminando(true);
        try {
            await proyectoService.eliminar(porEliminar.id);
            setAviso({
                tipo: 'exito',
                titulo: 'Operación exitosa',
                mensaje: `El proyecto "${porEliminar.clave.trim()}" fue eliminado.`,
            });
            cargar();
        } catch (err) {
            if (err.response?.status === 401) {
                salir();
                return;
            }
            setAviso({
                tipo: 'error',
                titulo: 'Error',
                mensaje: err.response?.data?.mensaje || 'No se pudo eliminar el proyecto.',
            });
        } finally {
            setEliminando(false);
            setPorEliminar(null);
        }
    };

    return (
        <>
            <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />

            <div className="flex flex-col gap-space-md">
                {/* Barra de herramientas de la tabla */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                        <div>
                            <div className="flex items-center gap-space-xs">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">Listado de Proyectos</h2>
                            </div>
                            <span className="font-label-sm text-label-sm text-secondary block mt-0.5">
                                ({proyectos.length} proyectos registrados)
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setModal({ proyecto: null })}
                            className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm transition-all"
                        >
                            <Icono nombre="add" className="text-[20px]" />
                            <span>Nuevo proyecto</span>
                        </button>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-space-md pt-space-xs">
                        <div className="relative flex-1">
                            <Icono nombre="search" className="absolute left-3 top-2.5 text-secondary text-[20px]" />
                            <input
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Filtrar proyectos por clave, título o participante..."
                                aria-label="Filtrar proyectos"
                                className="w-full bg-surface-container-low pl-10 pr-space-md py-space-sm rounded-lg font-body-md text-body-md text-on-surface placeholder:text-secondary focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container/20 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 lg:pb-0">
                            {FILTROS.map((opcion) => (
                                <button
                                    key={opcion.id}
                                    type="button"
                                    onClick={() => setFiltro(opcion.id)}
                                    aria-pressed={filtro === opcion.id}
                                    className={`px-space-md py-space-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors ${
                                        filtro === opcion.id
                                            ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                                            : 'bg-surface-container text-secondary hover:text-on-surface hover:bg-surface-container-high'
                                    }`}
                                >
                                    {opcion.texto} ({conteo[opcion.id]})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabla de proyectos */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-container-low text-secondary font-label-md text-label-md">
                                <tr>
                                    <th scope="col" className="py-space-md px-space-md font-semibold">Clave</th>
                                    <th scope="col" className="py-space-md px-space-md font-semibold min-w-[280px]">Proyecto</th>
                                    <th scope="col" className="py-space-md px-space-md font-semibold min-w-[200px]">Participantes</th>
                                    <th scope="col" className="py-space-md px-space-md font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">
                                {visibles.map((proyecto) => {
                                    const etiqueta = ETIQUETA_FILA[obtenerTipo(proyecto.clave)];
                                    const participantes = separarParticipantes(proyecto.participantes);
                                    return (
                                        <tr key={proyecto.id} className="hover:bg-surface-container-low/60 transition-colors">
                                            <td className="py-space-md px-space-md align-top whitespace-nowrap">
                                                <div className="flex items-start gap-space-sm">
                                                    <IconoProyecto proyecto={proyecto} tamano="sm" />
                                                    <div>
                                                        <span className="inline-block font-code-tech text-code-tech bg-surface-container text-on-surface px-space-sm py-1 rounded">
                                                            {proyecto.clave.trim()}
                                                        </span>
                                                        {etiqueta && (
                                                            <span className={`block mt-1 font-label-sm text-label-sm font-semibold px-2 py-0.5 rounded w-max ${etiqueta.clase}`}>
                                                                {etiqueta.texto}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-space-md px-space-md align-top">
                                                <h3 className="font-headline-sm text-[16px] text-on-surface font-semibold leading-snug line-clamp-2">
                                                    {proyecto.proyecto}
                                                </h3>
                                            </td>
                                            <td className="py-space-md px-space-md align-top">
                                                <span className="font-body-sm text-body-sm text-on-surface line-clamp-2">
                                                    {participantes.join(', ') || '—'}
                                                </span>
                                                <span className="font-label-sm text-label-sm text-secondary block mt-1">
                                                    {participantes.length} {participantes.length === 1 ? 'participante' : 'participantes'}
                                                </span>
                                            </td>
                                            <td className="py-space-md px-space-md align-top text-right">
                                                <div className="inline-flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setModal({ proyecto })}
                                                        title="Editar proyecto"
                                                        aria-label={`Editar ${proyecto.clave.trim()}`}
                                                        className="p-2 rounded hover:bg-surface-container text-secondary hover:text-primary transition-colors flex items-center"
                                                    >
                                                        <Icono nombre="edit" className="text-[18px]" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPorEliminar(proyecto)}
                                                        title="Eliminar proyecto"
                                                        aria-label={`Eliminar ${proyecto.clave.trim()}`}
                                                        className="p-2 rounded hover:bg-error-container text-secondary hover:text-error transition-colors flex items-center"
                                                    >
                                                        <Icono nombre="delete" className="text-[18px]" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {cargando && (
                        <p className="p-space-lg text-center font-body-md text-body-md text-secondary">Cargando proyectos...</p>
                    )}
                    {!cargando && visibles.length === 0 && (
                        <p className="p-space-lg text-center font-body-md text-body-md text-secondary">
                            No hay proyectos que coincidan con la búsqueda o el filtro.
                        </p>
                    )}

                    <div className="p-space-md bg-surface-container-low">
                        <span className="font-label-sm text-label-sm text-secondary">
                            Mostrando {visibles.length} de {proyectos.length} proyectos
                        </span>
                    </div>
                </div>
            </div>

            {modal && (
                <ModalProyecto
                    proyecto={modal.proyecto}
                    proyectos={proyectos}
                    onCerrar={cerrarModal}
                    onGuardado={handleGuardado}
                    onSesionExpirada={salir}
                />
            )}

            {porEliminar && (
                <ModalConfirmarEliminar
                    titulo="¿Eliminar proyecto definitivamente?"
                    eliminando={eliminando}
                    onCancelar={cancelarEliminar}
                    onConfirmar={handleEliminar}
                >
                    ¿Está seguro de eliminar el proyecto{' '}
                    <span className="font-code-tech text-code-tech bg-surface-container text-on-surface px-1.5 py-0.5 rounded">
                        {porEliminar.clave.trim()}
                    </span>
                    ? Esta acción no se puede deshacer.
                </ModalConfirmarEliminar>
            )}
        </>
    );
};

export default AdminProyectos;
