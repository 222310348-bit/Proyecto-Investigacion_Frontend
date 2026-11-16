import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import proyectoService from '../services/proyectoService';
import Icono from '../Components/Icono';
import EtiquetaTipo from '../Components/EtiquetaTipo';
import { obtenerTipo, separarParticipantes, obtenerIniciales } from '../utils/proyectoUtils';

const DetalleProyecto = () => {
    const { id } = useParams();
    const [proyecto, setProyecto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargar = async () => {
            setCargando(true);
            setError('');
            try {
                const data = await proyectoService.obtenerPorId(id);
                setProyecto(data);
            } catch (err) {
                // 404 y 400 significan que ese proyecto no existe
                const noExiste = err.response?.status === 404 || err.response?.status === 400;
                setError(noExiste ? 'El proyecto que buscas no existe.' : 'No se pudo cargar el proyecto. Intenta de nuevo más tarde.');
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, [id]);

    const enlaceVolver = (
        <Link to="/" className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary hover:text-primary-container transition-colors group">
            <Icono nombre="arrow_back" className="text-[20px] transition-transform group-hover:-translate-x-1" />
            <span>Volver a proyectos</span>
        </Link>
    );

    if (cargando) {
        return <p className="text-center py-16 font-body-md text-body-md text-secondary">Cargando proyecto...</p>;
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter py-space-xl">
                <div role="alert" className="text-center py-16 bg-surface-container-lowest rounded-xl">
                    <Icono nombre="search_off" className="text-[48px] text-secondary mb-space-sm block" />
                    <h1 className="font-headline-sm text-headline-sm text-on-surface mb-space-md">{error}</h1>
                    {enlaceVolver}
                </div>
            </div>
        );
    }

    const tipo = obtenerTipo(proyecto.clave);
    const participantes = separarParticipantes(proyecto.participantes);

    return (
        <div className="flex flex-col w-full">
            <div className="w-full bg-surface-container-low py-space-md">
                <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    {enlaceVolver}
                    <nav aria-label="Migas de pan" className="flex items-center gap-space-xs font-code-tech text-code-tech text-secondary">
                        <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
                        <span className="text-surface-dim">/</span>
                        <span className="text-on-surface font-semibold">{proyecto.clave.trim()}</span>
                    </nav>
                </div>
            </div>

            <section className="w-full bg-surface-container-lowest shadow-sm">
                <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter py-space-xl">
                    <div className="flex flex-wrap items-center gap-space-sm mb-space-md">
                        <EtiquetaTipo tipo={tipo} />
                        <span className="px-space-sm py-1 rounded bg-surface-container text-on-surface font-code-tech text-code-tech">
                            Clave: {proyecto.clave.trim()}
                        </span>
                    </div>
                    <h1 className="font-headline-lg-mobile text-headline-lg-mobile sm:font-headline-lg sm:text-headline-lg text-on-surface leading-tight tracking-tight max-w-5xl">
                        {proyecto.proyecto}
                    </h1>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter py-space-xl w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                    <section className="lg:col-span-8 bg-surface-container-lowest p-space-lg sm:p-space-xl rounded shadow-sm">
                        <div className="flex items-center gap-space-xs mb-space-md">
                            <Icono nombre="target" className="text-primary text-[24px]" />
                            <h2 className="font-headline-md text-headline-md text-on-surface">Objetivo</h2>
                        </div>
                        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
                            {proyecto.objetivo || 'Este proyecto no tiene un objetivo registrado.'}
                        </p>
                    </section>

                    <section className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded shadow-sm">
                        <div className="flex items-center justify-between mb-space-md">
                            <div className="flex items-center gap-space-xs">
                                <Icono nombre="group" className="text-primary text-[22px]" />
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">Participantes</h2>
                            </div>
                            <span className="px-space-xs py-0.5 rounded bg-surface-container font-code-tech text-code-tech text-secondary">
                                {participantes.length}
                            </span>
                        </div>
                        {participantes.length > 0 ? (
                            <ul className="space-y-space-sm">
                                {participantes.map((nombre) => (
                                    <li key={nombre} className="flex items-center gap-space-sm">
                                        <div className="w-9 h-9 rounded bg-surface-container-high flex items-center justify-center text-primary font-bold text-label-lg shrink-0">
                                            {obtenerIniciales(nombre)}
                                        </div>
                                        <span className="font-label-lg text-label-lg text-on-surface leading-snug">{nombre}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="font-body-md text-body-md text-secondary">Sin participantes registrados.</p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DetalleProyecto;
