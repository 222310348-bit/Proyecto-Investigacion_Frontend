// src/context/AuthProvider.jsx
import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import authService from '../services/authService';

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Al abrir la página, si hay un token guardado comprobamos que siga vigente
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setCargando(false);
                return;
            }
            try {
                const data = await authService.perfil();
                setAuth(data);
            } catch {
                localStorage.removeItem('token');
                setAuth({});
            } finally {
                setCargando(false);
            }
        };
        autenticarUsuario();
    }, []);

    // useCallback evita que la función cambie en cada render (otras páginas dependen de ella)
    const cerrarSesion = useCallback(() => {
        localStorage.removeItem('token');
        setAuth({});
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth, cargando, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
};
