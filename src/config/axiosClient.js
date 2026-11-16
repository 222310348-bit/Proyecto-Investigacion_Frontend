import axios from 'axios';

const clienteAxios = axios.create({
    // URL de la API (Proyecto-Investigacion_Backend). Se configura en el archivo .env
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api'
});

// INTERCEPTOR: Antes de que salga cualquier petición hacia el backend...
clienteAxios.interceptors.request.use(
    (config) => {
        // Buscamos el token en el localStorage (donde se guarda al iniciar sesión)
        const token = localStorage.getItem('token');

        if (token) {
            // Si el token existe, lo añadimos a las cabeceras, tal como lo espera el backend
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default clienteAxios;
