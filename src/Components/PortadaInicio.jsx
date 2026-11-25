import { Link } from 'react-router-dom';
import Icono from './Icono';
import ImagenParallax from './ImagenParallax';
import { SITIO_INSTITUCIONAL } from '../utils/institucionUtils';

// Portada de la página principal con la fachada del instituto y el número de proyectos
const PortadaInicio = ({ conteo, cargando }) => {
    const cifras = [
        { texto: 'Proyectos', valor: conteo.todos },
        { texto: 'Internos', valor: conteo.interno },
        { texto: 'Externos', valor: conteo.externo },
    ];

    return (
        <section id="inicio" aria-labelledby="titulo-portada" className="scroll-mt-16">
            <ImagenParallax
                src="/images/portada-itsl.jpg"
                cargaInmediata
                className="min-h-[480px] sm:min-h-[540px] flex items-center"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/95 via-primary/85 to-primary/40" aria-hidden="true"></div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-gutter-mobile sm:px-gutter py-16">
                    <div className="max-w-2xl text-on-primary">
                        <span className="block font-code-tech text-code-tech uppercase tracking-widest text-accent-container">
                            TecNM · Instituto Tecnológico Superior de Lerdo
                        </span>
                        <h1 id="titulo-portada" className="font-display-lg-mobile text-display-lg-mobile sm:font-display-lg sm:text-display-lg mt-space-sm">
                            Investigación y Desarrollo Tecnológico
                        </h1>
                        <p className="font-body-lg text-body-lg text-on-primary/90 mt-space-md max-w-xl">
                            Proyectos de investigación del instituto, financiados con recursos propios o en vinculación
                            con empresas mediante convocatorias CONACYT.
                        </p>

                        <div className="flex flex-wrap gap-space-sm mt-space-lg">
                            <Link
                                to="/#proyectos"
                                className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded bg-surface-container-lowest text-primary hover:bg-primary-fixed font-label-lg text-label-lg transition-colors"
                            >
                                <Icono nombre="search" className="text-[18px]" />
                                <span>Consultar proyectos</span>
                            </Link>
                            <a
                                href={SITIO_INSTITUCIONAL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded border border-white/60 hover:bg-white/10 font-label-lg text-label-lg transition-colors"
                            >
                                <span>Sitio del ITS Lerdo</span>
                                <Icono nombre="open_in_new" className="text-[18px]" />
                            </a>
                        </div>

                        <dl className="grid grid-cols-3 max-w-md mt-space-xl pt-space-md border-t border-white/25">
                            {cifras.map((cifra) => (
                                <div key={cifra.texto}>
                                    <dt className="font-label-md text-label-md uppercase tracking-wider text-on-primary/75">{cifra.texto}</dt>
                                    <dd className="font-headline-lg text-headline-lg">{cargando ? '—' : cifra.valor}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </ImagenParallax>
        </section>
    );
};

export default PortadaInicio;
