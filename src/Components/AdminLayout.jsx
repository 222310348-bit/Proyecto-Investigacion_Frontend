import { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Icono from './Icono';

const SECCIONES = [
    { ruta: '/admin', texto: 'Proyectos', icono: 'folder_open' },
    { ruta: '/admin/usuarios', texto: 'Administradores', icono: 'manage_accounts' },
];

// Estructura común del panel: encabezado de sesión, pestañas de sección y contenido
const AdminLayout = () => {
    const { auth, cerrarSesion } = useContext(AuthContext);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const salir = () => {
        cerrarSesion();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-surface">
            <div className="max-w-7xl mx-auto p-space-md sm:p-space-lg">
                <header className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm mb-space-md flex flex-col md:flex-row md:items-center md:justify-between gap-space-md">
                    <div className="flex items-center gap-space-md">
                        <img src="/images/logo-itsl.png" alt="Logo del ITS de Lerdo" className="h-12 w-auto object-contain" />
                        <div>
                            <span className="font-label-sm text-label-sm text-secondary uppercase">Panel de administración</span>
                            <h1 className="font-headline-sm text-headline-sm text-on-surface">Investigación y Desarrollo Tecnológico</h1>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-space-md justify-between md:justify-end">
                        <div className="flex items-center gap-space-sm min-w-0">
                            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-lg font-bold shadow-sm shrink-0">
                                {(auth.usuario || '?').charAt(0).toUpperCase()}
                            </div>
                            <div className="text-left min-w-0">
                                <span className="block font-label-md text-label-md text-on-surface font-semibold break-all">{auth.usuario}</span>
                                <span className="block font-label-sm text-label-sm text-secondary">Administrador</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-space-sm">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container text-secondary hover:text-primary transition-all font-label-md text-label-md shadow-sm"
                            >
                                <Icono nombre="visibility" className="text-[18px]" />
                                <span>Ver portal público</span>
                            </Link>
                            <button
                                type="button"
                                onClick={salir}
                                className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container text-secondary hover:text-error hover:bg-error-container transition-all font-label-md text-label-md shadow-sm"
                            >
                                <Icono nombre="logout" className="text-[18px]" />
                                <span>Cerrar sesión</span>
                            </button>
                        </div>
                    </div>
                </header>

                <nav aria-label="Secciones del panel" className="flex items-center gap-space-xs p-1 bg-surface-container rounded-lg w-max max-w-full mb-space-lg">
                    {SECCIONES.map((seccion) => {
                        const activa = pathname === seccion.ruta;
                        return (
                            <Link
                                key={seccion.ruta}
                                to={seccion.ruta}
                                aria-current={activa ? 'page' : undefined}
                                className={`inline-flex items-center gap-space-xs px-space-md py-1.5 rounded font-label-md text-label-md transition-all ${
                                    activa ? 'bg-primary-container text-on-primary shadow-sm' : 'text-secondary hover:text-on-surface'
                                }`}
                            >
                                <Icono nombre={seccion.icono} className="text-[18px]" />
                                <span>{seccion.texto}</span>
                            </Link>
                        );
                    })}
                </nav>

                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
