import clienteAxios from '../config/axiosClient';

const authService = {
    // 'credenciales' es un objeto { usuario, password }. Responde { token, usuario }
    login: async (credenciales) => {
        const respuesta = await clienteAxios.post('/auth/login', credenciales);
        return respuesta.data;
    },

    // Comprueba que el token guardado siga vigente. Responde { usuario }
    perfil: async () => {
        const respuesta = await clienteAxios.get('/auth/perfil');
        return respuesta.data;
    }
};

export default authService;
