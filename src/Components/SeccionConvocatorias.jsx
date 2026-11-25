import Icono from './Icono';
import Aparecer from './Aparecer';
import EncabezadoSeccion from './EncabezadoSeccion';
import { CONVOCATORIAS } from '../utils/modulosUtils';
import { SITIO_INSTITUCIONAL } from '../utils/institucionUtils';

// 'cierre' viene como AAAA-MM-DD
const formatearFecha = (fecha) =>
    new Date(`${fecha}T00:00:00`).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

const SeccionConvocatorias = () => {
    return (
        <section id="convocatorias" aria-labelledby="titulo-convocatorias" className="scroll-mt-16 bg-surface py-space-xl sm:py-20">
            <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
                <EncabezadoSeccion
                    id="titulo-convocatorias"
                    antetitulo="Participa"
                    titulo="Convocatorias"
                    descripcion="Convocatorias abiertas para participar en proyectos de investigación."
                />

                {CONVOCATORIAS.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                        {CONVOCATORIAS.map((convocatoria, indice) => (
                            <li key={convocatoria.titulo}>
                                <Aparecer retraso={(indice % 2) * 60} className="h-full">
                                    <article className="h-full flex flex-col gap-space-sm bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border-l-4 border-primary">
                                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{convocatoria.titulo}</h3>
                                        {convocatoria.descripcion && (
                                            <p className="font-body-md text-body-md text-secondary">{convocatoria.descripcion}</p>
                                        )}
                                        <div className="mt-auto pt-space-sm flex flex-wrap items-center justify-between gap-space-sm">
                                            {convocatoria.cierre && (
                                                <span className="inline-flex items-center gap-space-xs font-label-md text-label-md text-on-surface">
                                                    <Icono nombre="event" className="text-[18px] text-primary" />
                                                    Cierra el {formatearFecha(convocatoria.cierre)}
                                                </span>
                                            )}
                                            {convocatoria.url && (
                                                <a
                                                    href={convocatoria.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-space-xs font-label-md text-label-md text-primary hover:underline"
                                                >
                                                    Ver convocatoria <Icono nombre="open_in_new" className="text-[16px]" />
                                                </a>
                                            )}
                                        </div>
                                    </article>
                                </Aparecer>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Aparecer>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-space-lg bg-surface-container-lowest rounded-xl p-space-lg sm:p-space-xl border border-dashed border-outline-variant">
                            <span className="w-14 h-14 rounded-xl bg-primary/10 text-primary inline-flex items-center justify-center shrink-0">
                                <Icono nombre="campaign" className="text-[32px]" />
                            </span>
                            <div className="flex-1">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface">Por el momento no hay convocatorias vigentes</h3>
                                <p className="font-body-md text-body-md text-secondary mt-space-xs">
                                    El instituto también publica sus avisos y convocatorias en su sitio oficial.
                                </p>
                            </div>
                            <a
                                href={SITIO_INSTITUCIONAL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md transition-colors shrink-0"
                            >
                                <span>Ir al sitio del ITS Lerdo</span>
                                <Icono nombre="open_in_new" className="text-[16px]" />
                            </a>
                        </div>
                    </Aparecer>
                )}
            </div>
        </section>
    );
};

export default SeccionConvocatorias;
