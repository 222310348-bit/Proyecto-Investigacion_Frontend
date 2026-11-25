import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import proyectoService from '../services/proyectoService';
import ProyectoCard from '../Components/ProyectoCard';
import Icono from '../Components/Icono';
import Aparecer from '../Components/Aparecer';
import ImagenParallax from '../Components/ImagenParallax';
import PortadaInicio from '../Components/PortadaInicio';
import TarjetaModulo from '../Components/TarjetaModulo';
import EncabezadoSeccion from '../Components/EncabezadoSeccion';
import SeccionServicios from '../Components/SeccionServicios';
import SeccionEmpresas from '../Components/SeccionEmpresas';
import SeccionConvocatorias from '../Components/SeccionConvocatorias';
import { obtenerTipo, coincideBusqueda } from '../utils/proyectoUtils';
import { MODULOS, SERVICIOS_ESPECIALIZADOS, EMPRESAS_ASOCIADAS, CONVOCATORIAS } from '../utils/modulosUtils';

// Los enlaces #internos y #externos llevan al catálogo con esa pestaña elegida
const FILTRO_POR_ANCLA = { internos: 'interno', externos: 'externo' };

const PESTANAS = [
    { id: 'todos', texto: 'Todos' },
    { id: 'interno', texto: 'Proyectos Internos' },
    { id: 'externo', texto: 'Proyectos Externos' },
];

const desplazarA = (id) => {
    const destino = document.getElementById(id);
    if (!destino) return;
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    destino.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' });
};

const Proyectos = () => {
    const location = useLocation();
    const ancla = location.hash.slice(1);

    const [proyectos, setProyectos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState(FILTRO_POR_ANCLA[ancla] || 'todos');
    const [navegacionVista, setNavegacionVista] = useState(location.key);

    // Cada clic en el menú o en un módulo es una navegación nueva: si apunta a internos o externos, cambia la pestaña
    if (navegacionVista !== location.key) {
        setNavegacionVista(location.key);
        if (FILTRO_POR_ANCLA[ancla]) setFiltro(FILTRO_POR_ANCLA[ancla]);
    }

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

    // Baja a la sección del enlace. Se repite al terminar de cargar porque las tarjetas cambian la altura de la página
    useEffect(() => {
        if (!ancla) return undefined;
        const cuadro = requestAnimationFrame(() => desplazarA(FILTRO_POR_ANCLA[ancla] ? 'proyectos' : ancla));
        return () => cancelAnimationFrame(cuadro);
    }, [ancla, location.key, cargando]);

    const conteo = useMemo(() => ({
        todos: proyectos.length,
        interno: proyectos.filter((p) => obtenerTipo(p.clave) === 'interno').length,
        externo: proyectos.filter((p) => obtenerTipo(p.clave) === 'externo').length,
    }), [proyectos]);

    const visibles = useMemo(() => proyectos.filter((p) =>
        (filtro === 'todos' || obtenerTipo(p.clave) === filtro) && coincideBusqueda(p, busqueda)
    ), [proyectos, filtro, busqueda]);

    const textoProyectos = (cantidad) => (cargando || error ? 'Ver proyectos' : `${cantidad} proyectos`);
    const cifraModulo = {
        internos: textoProyectos(conteo.interno),
        externos: textoProyectos(conteo.externo),
        servicios: `${SERVICIOS_ESPECIALIZADOS.length} servicios`,
        empresas: `${EMPRESAS_ASOCIADAS.length} empresas`,
        convocatorias: CONVOCATORIAS.length > 0 ? `${CONVOCATORIAS.length} vigentes` : 'Sin convocatorias vigentes',
    };

    const restablecer = () => {
        setBusqueda('');
        setFiltro('todos');
    };

    return (
        <div className="flex flex-col w-full">
            <PortadaInicio conteo={conteo} cargando={cargando || error} />

            {/* Módulos del portal */}
            <section aria-labelledby="titulo-modulos" className="bg-surface-container-lowest py-space-xl sm:py-16">
                <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
                    <EncabezadoSeccion id="titulo-modulos" antetitulo="Contenido del portal" titulo="Módulos" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-gutter">
                        {MODULOS.map((modulo, indice) => (
                            <Aparecer key={modulo.id} retraso={indice * 60} className="h-full">
                                <TarjetaModulo modulo={modulo} cifra={cifraModulo[modulo.id]} />
                            </Aparecer>
                        ))}
                    </div>
                </div>
            </section>

            {/* Catálogo de proyectos (base de datos) */}
            <section id="proyectos" aria-labelledby="titulo-proyectos" className="scroll-mt-16 bg-surface py-space-xl sm:py-16">
                <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
                    <EncabezadoSeccion
                        id="titulo-proyectos"
                        antetitulo="Catálogo"
                        titulo="Proyectos de investigación"
                        descripcion="Consulta los proyectos internos y externos del instituto."
                    />

                    {/* Buscador y pestañas: se quedan visibles bajo el menú mientras se recorre el catálogo */}
                    <div className="sticky top-[67px] z-30 -mx-gutter-mobile sm:-mx-gutter px-gutter-mobile sm:px-gutter py-space-md bg-surface/95 backdrop-blur border-b border-surface-container-high flex flex-col gap-space-md">
                        <div className="w-full relative">
                            <Icono nombre="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-[22px]" />
                            <input
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar por clave, título, objetivo o participante..."
                                aria-label="Buscar proyectos"
                                className="w-full pl-12 pr-24 py-3 bg-surface-container-lowest rounded-lg shadow-sm text-on-surface placeholder:text-secondary font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
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
                            {PESTANAS.map((pestana) => (
                                <button
                                    key={pestana.id}
                                    type="button"
                                    onClick={() => setFiltro(pestana.id)}
                                    aria-pressed={filtro === pestana.id}
                                    className={`px-space-md py-1.5 rounded font-label-md text-label-md transition-all ${
                                        filtro === pestana.id
                                            ? 'bg-primary text-on-primary shadow-sm'
                                            : 'text-secondary hover:text-on-surface'
                                    }`}
                                >
                                    {pestana.texto} ({conteo[pestana.id]})
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-space-lg">
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
                                        {visibles.map((proyecto, indice) => (
                                            <Aparecer key={proyecto.id} retraso={(indice % 3) * 60} className="h-full">
                                                <ProyectoCard proyecto={proyecto} />
                                            </Aparecer>
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
                </div>
            </section>

            <ImagenParallax src="/images/banda-tecnologia.jpg" className="h-40 sm:h-56">
                <div className="absolute inset-0 bg-primary-deep/40" aria-hidden="true"></div>
            </ImagenParallax>

            <SeccionServicios />
            <SeccionEmpresas proyectos={proyectos} />

            <ImagenParallax src="/images/banda-camino.jpg" className="h-40 sm:h-56">
                <div className="absolute inset-0 bg-primary-deep/40" aria-hidden="true"></div>
            </ImagenParallax>

            <SeccionConvocatorias />
        </div>
    );
};

export default Proyectos;
