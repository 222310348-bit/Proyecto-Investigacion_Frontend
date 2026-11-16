import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Estructura común de las páginas públicas: encabezado, contenido y pie
const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full bg-surface">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
