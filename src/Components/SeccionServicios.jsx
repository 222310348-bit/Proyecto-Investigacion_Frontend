import Icono from './Icono';
import Aparecer from './Aparecer';
import ImagenParallax from './ImagenParallax';
import EncabezadoSeccion from './EncabezadoSeccion';
import { SERVICIOS_ESPECIALIZADOS } from '../utils/modulosUtils';

const SeccionServicios = () => {
    return (
        <section id="servicios" aria-labelledby="titulo-servicios" className="scroll-mt-16">
            <ImagenParallax src="/images/banda-investigacion.jpg" className="py-space-xl sm:py-20">
                <div className="absolute inset-0 bg-primary/90" aria-hidden="true"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
                    <EncabezadoSeccion
                        id="titulo-servicios"
                        claro
                        antetitulo="Vinculación"
                        titulo="Servicios Especializados"
                        descripcion="Pruebas y servicios técnicos que ofrece el instituto."
                    />

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-gutter max-w-3xl">
                        {SERVICIOS_ESPECIALIZADOS.map((servicio, indice) => (
                            <li key={servicio.titulo}>
                                <Aparecer retraso={indice * 80}>
                                    <div className="flex items-center gap-space-md bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
                                        <span className="w-12 h-12 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center shrink-0">
                                            <Icono nombre={servicio.icono} className="text-[28px]" />
                                        </span>
                                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{servicio.titulo}</h3>
                                    </div>
                                </Aparecer>
                            </li>
                        ))}
                    </ul>
                </div>
            </ImagenParallax>
        </section>
    );
};

export default SeccionServicios;
