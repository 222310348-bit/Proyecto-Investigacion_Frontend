import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icono from './Icono';
import { SECCIONES_MENU, SITIO_INSTITUCIONAL } from '../utils/institucionUtils';

// Menú de pantallas chicas: panel que entra por la derecha
const MenuLateral = ({ rutaAdmin, onCerrar }) => {
    const botonCerrar = useRef(null);

    // Escape cierra el menú y la página de fondo no se desplaza mientras está abierto
    useEffect(() => {
        const alPresionar = (e) => {
            if (e.key === 'Escape') onCerrar();
        };
        const desbordeAnterior = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', alPresionar);
        botonCerrar.current.focus();
        return () => {
            document.body.style.overflow = desbordeAnterior;
            document.removeEventListener('keydown', alPresionar);
        };
    }, [onCerrar]);

    return (
        <div className="fixed inset-0 z-50 xl:hidden">
            <button
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar menú"
                tabIndex={-1}
                className="absolute inset-0 w-full h-full bg-[#0f172a]/50"
            ></button>

            <nav
                id="menu-lateral"
                aria-label="Secciones del portal"
                className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-surface-container-lowest shadow-2xl flex flex-col"
            >
                <div className="h-16 px-space-md bg-primary text-on-primary border-b-[3px] border-accent-container flex items-center justify-between">
                    <span className="font-headline-sm text-headline-sm">Menú</span>
                    <button
                        ref={botonCerrar}
                        type="button"
                        onClick={onCerrar}
                        aria-label="Cerrar menú"
                        className="p-space-xs rounded hover:bg-white/10 transition-colors flex items-center"
                    >
                        <Icono nombre="close" className="text-[26px]" />
                    </button>
                </div>

                <ul className="flex-1 overflow-y-auto py-space-sm">
                    {SECCIONES_MENU.map((seccion) => (
                        <li key={seccion.ancla}>
                            <Link
                                to={`/#${seccion.ancla}`}
                                onClick={onCerrar}
                                className="block px-space-lg py-space-md font-label-lg text-label-lg text-on-surface hover:bg-primary/5 hover:text-primary border-l-[3px] border-transparent hover:border-primary transition-colors"
                            >
                                {seccion.texto}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="p-space-md border-t border-surface-container-high flex flex-col gap-space-sm">
                    <a
                        href={SITIO_INSTITUCIONAL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded border border-primary text-primary hover:bg-primary/5 font-label-md text-label-md transition-colors"
                    >
                        <span>Sitio ITS Lerdo</span>
                        <Icono nombre="open_in_new" className="text-[16px]" />
                    </a>
                    <Link
                        to={rutaAdmin}
                        onClick={onCerrar}
                        className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md transition-colors"
                    >
                        <Icono nombre="lock" className="text-[16px]" />
                        <span>Administrador</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default MenuLateral;
