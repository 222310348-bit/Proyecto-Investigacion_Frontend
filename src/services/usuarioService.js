import clienteAxios from '../config/axiosClient';

// Gestión de administradores. Todas las rutas exigen sesión (el interceptor envía el token)
const usuarioService = {
    obtenerTodos: async () => {
        const respuesta = await clienteAxios.get('/usuarios');
        return respuesta.data;
    },
    // 'datos' es un objeto { usuario: correo institucional, password }
    crear: async (datos) => {
        const respuesta = await clienteAxios.post('/usuarios', datos);
        return respuesta.data;
    },
    cambiarPassword: async (id, password) => {
        const respuesta = await clienteAxios.put(`/usuarios/${id}/password`, { password });
        return respuesta.data;
    },
    eliminar: async (id) => {
        const respuesta = await clienteAxios.delete(`/usuarios/${id}`);
        return respuesta.data;
    }
};

export default usuarioService;
