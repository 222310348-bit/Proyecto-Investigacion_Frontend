import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from 'src/Components/MainLayout.jsx';
import ProtectedRoute from 'src/Components/ProtectedRoute.jsx';
import Proyectos from 'src/Pages/Proyectos.jsx';
import DetalleProyecto from 'src/Pages/DetalleProyecto.jsx';
import Login from 'src/Pages/Login.jsx';
import AdminProyectos from 'src/Pages/AdminProyectos.jsx';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas: cualquiera puede verlas sin iniciar sesión */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Proyectos />} />
                    <Route path="/proyecto/:id" element={<DetalleProyecto />} />
                </Route>
                <Route path="/login" element={<Login />} />

                {/* Rutas privadas: solo con sesión de administrador (token necesario) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminProyectos />} />
                </Route>

                {/* Cualquier otra dirección regresa al catálogo */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
