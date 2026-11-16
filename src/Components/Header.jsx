import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Icono from './Icono';

const Header = () => {
    const { auth } = useContext(AuthContext);

    return (
        <header className="sticky top-0 z-50 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high">
            <div className="max-w-7xl mx-auto h-20 px-gutter-mobile sm:px-gutter flex items-center justify-between gap-space-md">
                <Link to="/" className="flex items-center gap-space-md min-w-0">
                    <img src="/images/logo-itsl.png" alt="Logo del ITS de Lerdo" className="h-10 w-auto object-contain shrink-0" />
                    <div className="flex flex-col min-w-0">
                        <span className="hidden sm:block font-label-sm text-label-sm text-secondary uppercase tracking-wider truncate">
                            Instituto Tecnológico Superior de Lerdo
                        </span>
                        <span className="font-headline-sm text-[16px] sm:text-headline-sm text-on-surface tracking-tight leading-tight">
                            Investigación y Desarrollo Tecnológico
                        </span>
                    </div>
                </Link>

                {/* Si ya hay sesión iniciada lleva directo al panel, si no al login */}
                <Link
                    to={auth.usuario ? '/admin' : '/login'}
                    className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded bg-surface-container hover:bg-surface-container-high text-on-surface hover:text-primary transition-all font-label-md text-label-md shrink-0"
                >
                    <Icono nombre="lock" className="text-[16px]" />
                    <span>Administrador</span>
                </Link>
            </div>
        </header>
    );
};

export default Header;
