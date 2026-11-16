import clienteAxios from '../config/axiosClient';

const proyectoService = {
    // Rutas públicas
    obtenerTodos: async () => {
        const respuesta = await clienteAxios.get('/proyectos');
        return respuesta.data;
    },
    obtenerPorId: async (id) => {
        const respuesta = await clienteAxios.get(`/proyectos/${id}`);
        return respuesta.data;
    },

    // Rutas de administrador (el interceptor de axios envía el token automáticamente)
    crear: async (datos) => {
        const respuesta = await clienteAxios.post('/proyectos', datos);
        return respuesta.data;
    },
    actualizar: async (id, datos) => {
        const respuesta = await clienteAxios.put(`/proyectos/${id}`, datos);
        return respuesta.data;
    },
    eliminar: async (id) => {
        const respuesta = await clienteAxios.delete(`/proyectos/${id}`);
        return respuesta.data;
    }
};

export default proyectoService;
