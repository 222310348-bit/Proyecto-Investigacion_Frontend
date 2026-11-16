import { useEffect, useState } from 'react';
import Icono from './Icono';
import usuarioService from '../services/usuarioService';
import {
    DOMINIO_CORREO,
    LIMITE_USUARIO,
    LIMITE_PASSWORD,
    REGLAS_PASSWORD,
    passwordCumple,
    esCorreoInstitucional,
} from '../utils/usuarioUtils';

const CLASE_CAMPO = 'w-full bg-surface-container-low rounded-lg px-space-md py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container/30';

// Ventana modal de administradores. Si 'usuario' es null se da de alta uno nuevo;
// si se recibe un usuario, solo se le cambia la contraseña
const ModalUsuario = ({ usuario, onCerrar, onGuardado, onSesionExpirada }) => {
    const cambiandoPassword = Boolean(usuario);
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmacion, setConfirmacion] = useState('');
    const [verPassword, setVerPassword] = useState(false);
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');
    const [guardando, setGuardando] = useState(false);

    // Cerrar con la tecla Escape
    useEffect(() => {
        const alPresionar = (e) => {
            if (e.key === 'Escape' && !guardando) onCerrar();
        };
        document.addEventListener('keydown', alPresionar);
        return () => document.removeEventListener('keydown', alPresionar);
    }, [guardando, onCerrar]);

    const limpiarError = (campo) => {
        setErrores({ ...errores, [campo]: undefined });
        setErrorGeneral('');
    };

    // Mismas reglas que valida el backend
    const validar = () => {
        const encontrados = {};
        if (!cambiandoPassword && !esCorreoInstitucional(correo)) {
            encontrados.usuario = `Debe ser un correo institucional (@${DOMINIO_CORREO}).`;
        }
        if (!passwordCumple(password)) {
            encontrados.password = 'La contraseña no cumple con todos los requisitos.';
        }
        if (password !== confirmacion) {
            encontrados.confirmacion = 'Las contraseñas no coinciden.';
        }
        return encontrados;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const encontrados = validar();
        if (Object.keys(encontrados).length > 0) {
            setErrores(encontrados);
            return;
        }

        setGuardando(true);
        setErrorGeneral('');
        try {
            if (cambiandoPassword) {
                await usuarioService.cambiarPassword(usuario.id, password);
                onGuardado(`Se cambió la contraseña de "${usuario.usuario}".`);
            } else {
                const creado = await usuarioService.crear({ usuario: correo.trim().toLowerCase(), password });
                onGuardado(`El administrador "${creado.usuario}" fue dado de alta.`);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                onSesionExpirada();
                return;
            }
            setErrores(error.response?.data?.errores || {});
            setErrorGeneral(error.response?.data?.mensaje || 'No se pudo conectar con el servidor.');
            setGuardando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-[#0f172a]/50 backdrop-blur-sm">
            <form
                onSubmit={handleSubmit}
                noValidate
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal-usuario"
                className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]"
            >
                {/* Encabezado */}
                <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm min-w-0">
                        <div className="w-8 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                            <Icono nombre={cambiandoPassword ? 'key' : 'person_add'} className="text-[20px]" />
                        </div>
                        <div className="min-w-0">
                            <h2 id="titulo-modal-usuario" className="font-headline-sm text-headline-sm text-on-surface leading-tight">
                                {cambiandoPassword ? 'Cambiar contraseña' : 'Nuevo administrador'}
                            </h2>
                            {cambiandoPassword && (
                                <span className="font-code-tech text-code-tech text-secondary break-all">{usuario.usuario}</span>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onCerrar}
                        disabled={guardando}
                        title="Cerrar"
                        className="text-secondary hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors flex items-center"
                    >
                        <Icono nombre="close" className="text-[24px]" />
                    </button>
                </div>

                {/* Cuerpo (formulario) */}
                <div className="p-space-lg overflow-y-auto flex flex-col gap-space-md">
                    {errorGeneral && (
                        <div role="alert" className="p-space-md rounded-lg bg-error-container/60 flex items-start gap-space-sm">
                            <Icono nombre="error" className="text-[20px] text-error shrink-0" />
                            <p className="font-body-md text-body-md text-on-surface">{errorGeneral}</p>
                        </div>
                    )}

                    {/* Campo: correo institucional (solo al dar de alta) */}
                    {!cambiandoPassword && (
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="campo-correo" className="font-label-md text-label-md text-on-surface font-semibold">
                                Correo institucional *
                            </label>
                            <input
                                id="campo-correo"
                                type="email"
                                autoComplete="off"
                                maxLength={LIMITE_USUARIO}
                                placeholder={`nombre@${DOMINIO_CORREO}`}
                                value={correo}
                                onChange={(e) => { setCorreo(e.target.value); limpiarError('usuario'); }}
                                className={CLASE_CAMPO}
                            />
                            {errores.usuario
                                ? <span className="font-body-sm text-body-sm text-error">{errores.usuario}</span>
                                : <span className="font-body-sm text-body-sm text-secondary">Solo se aceptan correos @{DOMINIO_CORREO}. Será su usuario para iniciar sesión.</span>}
                        </div>
                    )}

                    {/* Campo: contraseña */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="campo-password" className="font-label-md text-label-md text-on-surface font-semibold">
                            {cambiandoPassword ? 'Nueva contraseña *' : 'Contraseña *'}
                        </label>
                        <div className="relative flex items-center">
                            <input
                                id="campo-password"
                                type={verPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                maxLength={LIMITE_PASSWORD}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); limpiarError('password'); }}
                                className={`${CLASE_CAMPO} pr-11`}
                            />
                            <button
                                type="button"
                                onClick={() => setVerPassword(!verPassword)}
                                aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                className="absolute right-2.5 p-1 rounded text-secondary hover:text-on-surface transition-colors flex items-center justify-center"
                            >
                                <Icono nombre={verPassword ? 'visibility_off' : 'visibility'} className="text-[20px]" />
                            </button>
                        </div>
                        {errores.password && <span className="font-body-sm text-body-sm text-error">{errores.password}</span>}

                        {/* Requisitos del estándar de seguridad, se marcan conforme se cumplen */}
                        <ul aria-label="Requisitos de la contraseña" className="mt-1 p-space-sm bg-surface-container-low rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-x-space-md gap-y-1">
                            {REGLAS_PASSWORD.map((regla) => {
                                const cumple = regla.cumple(password);
                                return (
                                    <li
                                        key={regla.id}
                                        data-cumple={cumple}
                                        className={`flex items-center gap-1.5 font-body-sm text-body-sm ${cumple ? 'text-[#166534]' : 'text-secondary'}`}
                                    >
                                        <Icono nombre={cumple ? 'check_circle' : 'radio_button_unchecked'} className="text-[16px] shrink-0" />
                                        <span>{regla.texto}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Campo: confirmar contraseña */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="campo-confirmacion" className="font-label-md text-label-md text-on-surface font-semibold">
                            Confirmar contraseña *
                        </label>
                        <input
                            id="campo-confirmacion"
                            type={verPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            maxLength={LIMITE_PASSWORD}
                            value={confirmacion}
                            onChange={(e) => { setConfirmacion(e.target.value); limpiarError('confirmacion'); }}
                            className={CLASE_CAMPO}
                        />
                        {errores.confirmacion && <span className="font-body-sm text-body-sm text-error">{errores.confirmacion}</span>}
                    </div>
                </div>

                {/* Pie */}
                <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-end gap-space-sm">
                    <button
                        type="button"
                        onClick={onCerrar}
                        disabled={guardando}
                        className="px-space-md py-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={guardando}
                        className="px-space-lg py-space-sm bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                        <Icono nombre="save" className="text-[18px]" />
                        <span>{guardando ? 'Guardando...' : cambiandoPassword ? 'Cambiar contraseña' : 'Dar de alta'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ModalUsuario;
