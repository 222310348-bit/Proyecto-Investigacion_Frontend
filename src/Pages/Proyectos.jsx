import { useEffect, useMemo, useState } from 'react';
import proyectoService from '../services/proyectoService';
import ProyectoCard from '../Components/ProyectoCard';
import Icono from '../Components/Icono';
import { obtenerTipo, coincideBusqueda } from '../utils/proyectoUtils';

const Proyectos = () => {
    const [proyectos, setProyectos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('todos');

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await proyectoService.obtenerTodos();
                setProyectos(data);
            } catch (err) {
                console.error('Error al cargar los proyectos:', err);
                setError(true);
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    const conteo = useMemo(() => ({
        todos: proyectos.length,
        interno: proyectos.filter((p) => obtenerTipo(p.clave) === 'interno').length,
        externo: proyectos.filter((p) => obtenerTipo(p.clave) === 'externo').length,
    }), [proyectos]);

    const visibles = useMemo(() => proyectos.filter((p) =>
        (filtro === 'todos' || obtenerTipo(p.clave) === filtro) && coincideBusqueda(p, busqueda)
    ), [proyectos, filtro, busqueda]);

    const pestanas = [
        { id: 'todos', texto: 'Todos' },
        { id: 'interno', texto: 'Proyectos Internos' },
        { id: 'externo', texto: 'Proyectos Externos' },
    ];

    const restablecer = () => {
        setBusqueda('');
        setFiltro('todos');
    };

    return (
        <div className="flex flex-col w-full">
            {/* Presentación y conteo de proyectos */}
            <section className="w-full bg-surface-container-low py-space-lg">
                <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter flex flex-col lg:flex-row lg:items-end justify-between gap-gutter">
                    <div className="max-w-3xl">
                        <span className="font-code-tech text-code-tech text-primary uppercase tracking-widest block mb-space-xs">
                            Instituto Tecnológico Superior de Lerdo
                        </span>
                        <h1 className="font-headline-lg-mobile text-headline-lg-mobile sm:font-headline-lg sm:text-headline-lg text-on-surface mb-space-sm">
                            Proyectos de Investigación y Desarrollo Tecnológico
                        </h1>
                        <p className="font-body-lg text-body-lg text-secondary">
                            Consulta los proyectos internos y externos del instituto.
                        </p>
                    </div>

                    <div className="flex items-center gap-space-sm flex-wrap self-start lg:self-end bg-surface-container-lowest p-space-sm rounded-xl shadow-sm">
                        <div className="px-space-md py-space-xs rounded bg-surface-container">
                            <span className="font-code-tech text-code-tech text-secondary block">Total</span>
                            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{conteo.todos}</span>
                        </div>
                        <div className="w-px h-8 bg-surface-variant"></div>
                        <div className="px-space-md py-space-xs rounded bg-primary/10">
                            <span className="font-code-tech text-code-tech text-primary block">Internos</span>
                            <span className="font-headline-sm text-headline-sm text-primary font-bold">{conteo.interno}</span>
                        </div>
                        <div className="w-px h-8 bg-surface-variant"></div>
                        <div className="px-space-md py-space-xs rounded bg-secondary-container/40">
                            <span className="font-code-tech text-code-tech text-tertiary block">Externos</span>
                            <span className="font-headline-sm text-headline-sm text-tertiary font-bold">{conteo.externo}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Buscador y pestañas */}
            <section className="w-full bg-surface-container-lowest shadow-sm sticky top-20 z-30">
                <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter py-space-md flex flex-col gap-space-md">
                    <div className="w-full relative">
                        <Icono nombre="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-[22px]" />
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar por clave, título, objetivo o participante..."
                            aria-label="Buscar proyectos"
                            className="w-full pl-12 pr-24 py-3 bg-surface-container-low rounded-lg text-on-surface placeholder:text-secondary font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
                        />
                        {busqueda && (
                            <button
                                type="button"
                                onClick={() => setBusqueda('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-secondary hover:text-primary font-label-sm text-label-sm"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-space-xs p-1 bg-surface-container rounded-lg self-start flex-wrap">
                        {pestanas.map((pestana) => (
                            <button
                                key={pestana.id}
                                type="button"
                                onClick={() => setFiltro(pestana.id)}
                                aria-pressed={filtro === pestana.id}
                                className={`px-space-md py-1.5 rounded font-label-md text-label-md transition-all ${
                                    filtro === pestana.id
                                        ? 'bg-primary-container text-on-primary shadow-sm'
                                        : 'text-secondary hover:text-on-surface'
                                }`}
                            >
                                {pestana.texto} ({conteo[pestana.id]})
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tarjetas de proyectos */}
            <section className="w-full py-space-xl">
                <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
                    {cargando && (
                        <p className="text-center py-16 font-body-md text-body-md text-secondary">Cargando proyectos...</p>
                    )}

                    {!cargando && error && (
                        <div role="alert" className="text-center py-16 bg-surface-container-lowest rounded-xl">
                            <Icono nombre="cloud_off" className="text-[48px] text-secondary mb-space-sm block" />
                            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">No se pudieron cargar los proyectos</h3>
                            <p className="font-body-md text-body-md text-secondary">Intenta de nuevo más tarde.</p>
                        </div>
                    )}

                    {!cargando && !error && (
                        <>
                            <p className="font-body-sm text-body-sm text-secondary mb-space-lg">
                                Mostrando <span className="font-semibold text-on-surface">{visibles.length}</span> de {proyectos.length} proyectos
                            </p>

                            {visibles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                                    {visibles.map((proyecto) => (
                                        <ProyectoCard key={proyecto.id} proyecto={proyecto} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-surface-container-lowest rounded-xl">
                                    <Icono nombre="manage_search" className="text-[48px] text-secondary mb-space-sm block" />
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">No se encontraron proyectos</h3>
                                    <p className="font-body-md text-body-md text-secondary mb-space-md max-w-md mx-auto">
                                        No hay proyectos que coincidan con la búsqueda o el filtro seleccionado.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={restablecer}
                                        className="px-space-md py-2 bg-primary text-on-primary font-label-md text-label-md rounded"
                                    >
                                        Restablecer filtros
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Proyectos;
