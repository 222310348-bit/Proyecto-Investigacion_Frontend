import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { auth, cargando } = useContext(AuthContext);
    // Revisamos si existe el token en el almacenamiento local
    const token = localStorage.getItem('token');

    // Si no hay token, redirigimos al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Mientras se comprueba el token con el backend no mostramos nada
    if (cargando) {
        return null;
    }

    // Si el backend rechazó el token (expiró o no es válido), también va al login
    if (!auth.usuario) {
        return <Navigate to="/login" replace />;
    }

    // Si hay sesión, permitimos el acceso a las rutas hijas (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;
