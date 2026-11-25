import { Link } from 'react-router-dom';
import Icono from './Icono';
import BannerInstitucional from './BannerInstitucional';
import { CONTACTO, REDES, SECCIONES_MENU, SITIO_INSTITUCIONAL } from '../utils/institucionUtils';

const CLASE_TITULO = 'font-label-lg text-label-lg uppercase tracking-wider text-accent-container mb-space-md';
const CLASE_ENLACE = 'text-on-primary/85 hover:text-on-primary hover:underline underline-offset-4 transition-colors';

// Los teléfonos se marcan sin guiones
const enlaceTelefono = (telefono) => `tel:+52${telefono.replace(/\D/g, '')}`;

const Footer = () => {
    return (
        <footer className="w-full">
            <div className="bg-primary-deep text-on-primary border-t-4 border-accent-container">
                <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter py-space-xl sm:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] gap-space-xl">
                    <div className="flex flex-col items-start gap-space-md">
                        <div className="flex items-center gap-space-md">
                            <img src="/images/logo-itsl-escudo.png" alt="Escudo del ITS de Lerdo" className="h-20 w-20 object-contain shrink-0" />
                            <div>
                                <p className="font-headline-sm text-headline-sm">{CONTACTO.nombre}</p>
                                <p className="font-body-md text-body-md text-on-primary/80">Instituto Tecnológico Superior de Lerdo</p>
                            </div>
                        </div>
                        <p className="font-body-md text-body-md text-on-primary/80 max-w-sm">
                            Portal de proyectos de Investigación y Desarrollo Tecnológico.
                        </p>
                        <a
                            href={SITIO_INSTITUCIONAL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded bg-surface-container-lowest text-primary hover:bg-primary-fixed font-label-md text-label-md transition-colors"
                        >
                            <span>Ir al sitio del ITS Lerdo</span>
                            <Icono nombre="open_in_new" className="text-[16px]" />
                        </a>
                    </div>

                    <div>
                        <h2 className={CLASE_TITULO}>Contacto</h2>
                        <address className="not-italic flex flex-col gap-space-md font-body-md text-body-md">
                            <div className="flex gap-space-sm">
                                <Icono nombre="location_on" className="text-[20px] text-accent-container shrink-0" />
                                <span className="text-on-primary/85">
                                    {CONTACTO.direccion.map((linea) => (
                                        <span key={linea} className="block">{linea}</span>
                                    ))}
                                </span>
                            </div>
                            <div className="flex gap-space-sm">
                                <Icono nombre="mail" className="text-[20px] text-accent-container shrink-0" />
                                <a href={`mailto:${CONTACTO.correo}`} className={`${CLASE_ENLACE} break-all`}>{CONTACTO.correo}</a>
                            </div>
                            <div className="flex gap-space-sm">
                                <Icono nombre="call" className="text-[20px] text-accent-container shrink-0" />
                                <span className="flex flex-col">
                                    {CONTACTO.telefonos.map((telefono) => (
                                        <a key={telefono} href={enlaceTelefono(telefono)} className={CLASE_ENLACE}>{telefono}</a>
                                    ))}
                                </span>
                            </div>
                        </address>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-space-xl">
                        <div>
                            <h2 className={CLASE_TITULO}>Secciones</h2>
                            <ul className="flex flex-col gap-space-xs font-body-md text-body-md">
                                {SECCIONES_MENU.map((seccion) => (
                                    <li key={seccion.ancla}>
                                        <Link to={`/#${seccion.ancla}`} className={CLASE_ENLACE}>{seccion.texto}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className={CLASE_TITULO}>Redes</h2>
                            <ul className="flex flex-col gap-space-xs font-body-md text-body-md">
                                {REDES.map((red) => (
                                    <li key={red.texto}>
                                        <a href={red.url} target="_blank" rel="noopener noreferrer" className={CLASE_ENLACE}>{red.texto}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-lowest">
                <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter py-space-md flex flex-col items-center gap-space-sm">
                    <BannerInstitucional ubicacion="pie" className="h-10 sm:h-14" />
                    <p className="font-body-sm text-body-sm text-secondary text-center">
                        © {new Date().getFullYear()} TecNM · Instituto Tecnológico Superior de Lerdo
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
