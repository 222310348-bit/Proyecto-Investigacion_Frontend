import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icono from './Icono';
import Aparecer from './Aparecer';
import EncabezadoSeccion from './EncabezadoSeccion';
import { EMPRESAS_ASOCIADAS, normalizarClave } from '../utils/modulosUtils';

// 'proyectos' son los que ya cargó la página; con ellos cada clave enlaza a su detalle
const SeccionEmpresas = ({ proyectos }) => {
    const proyectoPorClave = useMemo(
        () => new Map(proyectos.map((proyecto) => [normalizarClave(proyecto.clave), proyecto])),
        [proyectos]
    );

    return (
        <section id="empresas" aria-labelledby="titulo-empresas" className="scroll-mt-16 bg-surface-container-lowest py-space-xl sm:py-20">
            <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
                <EncabezadoSeccion
                    id="titulo-empresas"
                    antetitulo="Vinculación"
                    titulo="Empresas Asociadas"
                    descripcion="Empresas con las que el instituto ha desarrollado proyectos externos."
                />

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                    {EMPRESAS_ASOCIADAS.map((empresa, indice) => (
                        <li key={empresa.nombre}>
                            <Aparecer retraso={(indice % 3) * 60} className="h-full">
                                <article className="h-full flex flex-col gap-space-md rounded-xl border border-surface-container-high p-space-lg">
                                    <div className="flex items-start gap-space-sm">
                                        <span className="w-11 h-11 rounded-lg bg-accent-container/60 text-on-accent-container inline-flex items-center justify-center shrink-0">
                                            <Icono nombre="domain" className="text-[24px]" />
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="font-headline-sm text-headline-sm text-on-surface leading-snug">{empresa.nombre}</h3>
                                            <p className="font-body-sm text-body-sm text-secondary">{empresa.razonSocial}</p>
                                        </div>
                                    </div>

                                    <div className="pt-space-sm border-t border-surface-container">
                                        <span className="block font-label-md text-label-md text-secondary mb-space-xs">
                                            {empresa.claves.length} {empresa.claves.length === 1 ? 'proyecto' : 'proyectos'}
                                        </span>
                                        <ul className="flex flex-col gap-space-xs">
                                            {empresa.claves.map((clave) => {
                                                const proyecto = proyectoPorClave.get(normalizarClave(clave));
                                                return (
                                                    <li key={clave}>
                                                        {proyecto ? (
                                                            <Link to={`/proyecto/${proyecto.id}`} className="group block">
                                                                <span className="font-code-tech text-code-tech text-primary group-hover:underline">{clave}</span>
                                                                <span className="font-body-sm text-body-sm text-on-surface line-clamp-2">{proyecto.proyecto}</span>
                                                            </Link>
                                                        ) : (
                                                            <span className="font-code-tech text-code-tech text-secondary">{clave}</span>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </article>
                            </Aparecer>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default SeccionEmpresas;
