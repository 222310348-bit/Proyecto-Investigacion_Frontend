import { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import usuarioService from '../services/usuarioService';
import Icono from '../Components/Icono';
import Aviso from '../Components/Aviso';
import ModalUsuario from '../Components/ModalUsuario';
import ModalConfirmarEliminar from '../Components/ModalConfirmarEliminar';
import { DOMINIO_CORREO } from '../utils/usuarioUtils';

const AdminUsuarios = () => {
    const { auth, cerrarSesion } = useContext(AuthContext);
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [aviso, setAviso] = useState(null);
    // modal: null (cerrado), { usuario: null } (alta) o { usuario } (cambiar contraseña)
    const [modal, setModal] = useState(null);
    const [porEliminar, setPorEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    const salir = useCallback(() => {
        cerrarSesion();
        navigate('/login');
    }, [cerrarSesion, navigate]);

    const cargar = useCallback(async () => {
        try {
            const data = await usuarioService.obtenerTodos();
            setUsuarios(data);
        } catch (err) {
            if (err.response?.status === 401) {
                salir();
                return;
            }
            console.error('Error al cargar:', err);
            setAviso({ tipo: 'error', titulo: 'Error', mensaje: 'No se pudieron cargar los administradores.' });
        } finally {
            setCargando(false);
        }
    }, [salir]);

    useEffect(() => { cargar(); }, [cargar]);

    const cerrarModal = useCallback(() => setModal(null), []);
    const cancelarEliminar = useCallback(() => setPorEliminar(null), []);

    const handleGuardado = (mensaje) => {
        setModal(null);
        setAviso({ tipo: 'exito', titulo: 'Operación exitosa', mensaje });
        cargar();
    };

    const handleEliminar = async () => {
        setEliminando(true);
        try {
            await usuarioService.eliminar(porEliminar.id);
            setAviso({
                tipo: 'exito',
                titulo: 'Operación exitosa',
                mensaje: `El administrador "${porEliminar.usuario}" fue eliminado.`,
            });
            cargar();
        } catch (err) {
            if (err.response?.status === 401) {
                salir();
                return;
            }
            setAviso({
                tipo: 'error',
                titulo: 'Error',
                mensaje: err.response?.data?.mensaje || 'No se pudo eliminar el administrador.',
            });
        } finally {
            setEliminando(false);
            setPorEliminar(null);
        }
    };

    return (
        <>
            <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />

            <div className="flex flex-col gap-space-md">
                {/* Barra de herramientas */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                    <div>
                        <div className="flex items-center gap-space-xs">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                            <h2 className="font-headline-sm text-headline-sm text-on-surface">Administradores</h2>
                        </div>
                        <span className="font-label-sm text-label-sm text-secondary block mt-0.5">
                            ({usuarios.length} {usuarios.length === 1 ? 'cuenta registrada' : 'cuentas registradas'}) · Las altas requieren un correo @{DOMINIO_CORREO}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setModal({ usuario: null })}
                        className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm transition-all"
                    >
                        <Icono nombre="person_add" className="text-[20px]" />
                        <span>Nuevo administrador</span>
                    </button>
                </div>

                {/* Tabla de administradores */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-container-low text-secondary font-label-md text-label-md">
                                <tr>
                                    <th scope="col" className="py-space-md px-space-md font-semibold">Usuario</th>
                                    <th scope="col" className="py-space-md px-space-md font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">
                                {usuarios.map((usuario) => {
                                    const esMiCuenta = usuario.id === auth.id;
                                    return (
                                        <tr key={usuario.id} className="hover:bg-surface-container-low/60 transition-colors">
                                            <td className="py-space-md px-space-md align-middle">
                                                <div className="flex items-center gap-space-sm">
                                                    <div className="w-9 h-9 rounded bg-surface-container-high flex items-center justify-center text-primary font-bold text-label-lg shrink-0">
                                                        {usuario.usuario.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-label-lg text-label-lg text-on-surface break-all">{usuario.usuario}</span>
                                                    {esMiCuenta && (
                                                        <span className="font-label-sm text-label-sm font-semibold px-2 py-0.5 rounded text-[#065f46] bg-[#ecfdf5] whitespace-nowrap">
                                                            Tu cuenta
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-space-md px-space-md align-middle text-right">
                                                <div className="inline-flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setModal({ usuario })}
                                                        title="Cambiar contraseña"
                                                        aria-label={`Cambiar contraseña de ${usuario.usuario}`}
                                                        className="p-2 rounded hover:bg-surface-container text-secondary hover:text-primary transition-colors flex items-center"
                                                    >
                                                        <Icono nombre="key" className="text-[18px]" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPorEliminar(usuario)}
                                                        disabled={esMiCuenta}
                                                        title={esMiCuenta ? 'No puedes eliminar tu propia cuenta' : 'Eliminar administrador'}
                                                        aria-label={`Eliminar a ${usuario.usuario}`}
                                                        className="p-2 rounded hover:bg-error-container text-secondary hover:text-error transition-colors flex items-center disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondary disabled:cursor-not-allowed"
                                                    >
                                                        <Icono nombre="delete" className="text-[18px]" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {cargando && (
                        <p className="p-space-lg text-center font-body-md text-body-md text-secondary">Cargando administradores...</p>
                    )}
                </div>
            </div>

            {modal && (
                <ModalUsuario
                    usuario={modal.usuario}
                    onCerrar={cerrarModal}
                    onGuardado={handleGuardado}
                    onSesionExpirada={salir}
                />
            )}

            {porEliminar && (
                <ModalConfirmarEliminar
                    titulo="¿Eliminar administrador?"
                    eliminando={eliminando}
                    onCancelar={cancelarEliminar}
                    onConfirmar={handleEliminar}
                >
                    ¿Está seguro de eliminar la cuenta{' '}
                    <span className="font-code-tech text-code-tech bg-surface-container text-on-surface px-1.5 py-0.5 rounded">
                        {porEliminar.usuario}
                    </span>
                    ? Dejará de tener acceso al panel de inmediato.
                </ModalConfirmarEliminar>
            )}
        </>
    );
};

export default AdminUsuarios;
