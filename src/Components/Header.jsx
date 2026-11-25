import { useCallback, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Icono from './Icono';
import BannerInstitucional from './BannerInstitucional';
import MenuLateral from './MenuLateral';
import { SECCIONES_MENU, SITIO_INSTITUCIONAL } from '../utils/institucionUtils';

const Header = () => {
    const { auth } = useContext(AuthContext);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const cerrarMenu = useCallback(() => setMenuAbierto(false), []);

    // Si ya hay sesión iniciada lleva directo al panel, si no al login
    const rutaAdmin = auth.usuario ? '/admin' : '/login';

    return (
        <>
            {/* Franja de logotipos oficiales: se queda arriba y no acompaña al desplazamiento */}
            <div className="bg-surface-container-lowest border-b border-surface-container-high">
                <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter py-space-xs flex justify-center">
                    <BannerInstitucional ubicacion="encabezado" className="h-10 sm:h-14 lg:h-16" />
                </div>
            </div>

            <header className="sticky top-0 z-40 bg-primary text-on-primary border-b-[3px] border-accent-container shadow-md">
                <div className="max-w-7xl mx-auto h-16 px-gutter-mobile sm:px-gutter flex items-center justify-between gap-space-md">
                    <Link to="/#inicio" className="flex items-center gap-space-sm min-w-0">
                        <img src="/images/logo-itsl.png" alt="Logo del ITS de Lerdo" className="h-10 w-10 object-contain shrink-0" />
                        <div className="flex flex-col min-w-0 leading-tight">
                            <span className="hidden sm:block font-label-sm text-label-sm uppercase tracking-wider text-on-primary/75 truncate">
                                Instituto Tecnológico Superior de Lerdo
                            </span>
                            <span className="font-headline-sm text-[15px] sm:text-[17px] truncate">
                                Investigación y Desarrollo Tecnológico
                            </span>
                        </div>
                    </Link>

                    <nav aria-label="Secciones del portal" className="hidden xl:flex items-center gap-1">
                        {SECCIONES_MENU.map((seccion) => (
                            <Link
                                key={seccion.ancla}
                                to={`/#${seccion.ancla}`}
                                className="px-space-sm py-space-xs rounded font-label-lg text-label-lg text-on-primary/85 hover:text-on-primary hover:bg-white/10 transition-colors"
                            >
                                {seccion.texto}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden xl:flex items-center gap-space-sm shrink-0">
                        <a
                            href={SITIO_INSTITUCIONAL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded border border-white/40 hover:bg-white/10 font-label-md text-label-md transition-colors"
                        >
                            <span>Sitio ITS Lerdo</span>
                            <Icono nombre="open_in_new" className="text-[16px]" />
                        </a>
                        <Link
                            to={rutaAdmin}
                            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded bg-surface-container-lowest text-primary hover:bg-primary-fixed font-label-md text-label-md transition-colors"
                        >
                            <Icono nombre="lock" className="text-[16px]" />
                            <span>Administrador</span>
                        </Link>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMenuAbierto(true)}
                        aria-label="Abrir menú"
                        aria-expanded={menuAbierto}
                        aria-controls="menu-lateral"
                        className="xl:hidden p-space-xs rounded hover:bg-white/10 transition-colors flex items-center"
                    >
                        <Icono nombre="menu" className="text-[28px]" />
                    </button>
                </div>
            </header>

            {menuAbierto && <MenuLateral rutaAdmin={rutaAdmin} onCerrar={cerrarMenu} />}
        </>
    );
};

export default Header;
