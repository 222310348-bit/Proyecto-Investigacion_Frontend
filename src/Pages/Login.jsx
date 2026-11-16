import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import Icono from '../Components/Icono';

const CLASE_CAMPO = 'w-full h-11 pl-10 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [verPassword, setVerPassword] = useState(false);
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    // Si ya hay una sesión iniciada no tiene caso mostrar el formulario
    if (auth.usuario) {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEnviando(true);
        try {
            const data = await authService.login({ usuario, password });

            // Guardamos el token que devuelve el backend
            localStorage.setItem('token', data.token);

            // Actualizamos el estado global y entramos al panel
            setAuth({ usuario: data.usuario });
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.mensaje || 'No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
            setEnviando(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-space-md">
            <main className="w-full max-w-md mx-auto">
                <div className="flex items-center justify-between mb-space-lg">
                    <Link to="/" className="inline-flex items-center gap-space-xs text-secondary hover:text-primary transition-colors font-label-md text-label-md group">
                        <Icono nombre="arrow_back" className="text-[18px] transition-transform group-hover:-translate-x-1" />
                        <span>Volver al portal público de proyectos</span>
                    </Link>
                </div>

                <section className="w-full bg-surface-container-lowest rounded-xl shadow-xl shadow-secondary/10 overflow-hidden">
                    <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-container to-tertiary"></div>

                    <div className="p-space-lg sm:p-space-xl flex flex-col">
                        <div className="flex flex-col items-center text-center mb-space-lg">
                            <img src="/images/logo-itsl.png" alt="Logo del ITS de Lerdo" className="h-16 w-auto object-contain mb-space-md" />
                            <h1 className="font-headline-md text-headline-md text-on-surface mb-space-xs tracking-tight">
                                Acceso de Administrador
                            </h1>
                            <p className="font-body-sm text-body-sm text-secondary max-w-xs leading-tight">
                                Investigación y Desarrollo Tecnológico
                            </p>
                        </div>

                        {error && (
                            <div role="alert" className="mb-space-lg p-space-md rounded-lg bg-error-container/60 flex items-start gap-space-sm shadow-sm">
                                <Icono nombre="error" className="text-[20px] text-error shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-label-md text-label-md text-error font-semibold mb-0.5">No se pudo iniciar sesión</p>
                                    <p className="font-body-sm text-body-sm text-on-surface leading-snug">{error}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setError('')}
                                    aria-label="Cerrar aviso"
                                    className="text-secondary hover:text-on-surface p-0.5 rounded transition-colors flex items-center"
                                >
                                    <Icono nombre="close" className="text-[16px]" />
                                </button>
                            </div>
                        )}

                        <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="usuario" className="font-label-md text-label-md text-on-surface">Usuario</label>
                                <div className="relative flex items-center">
                                    <Icono nombre="person" className="absolute left-3 text-secondary text-[20px] pointer-events-none" />
                                    <input
                                        id="usuario"
                                        type="text"
                                        autoComplete="username"
                                        required
                                        value={usuario}
                                        onChange={(e) => setUsuario(e.target.value)}
                                        className={`${CLASE_CAMPO} pr-3`}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="password" className="font-label-md text-label-md text-on-surface">Contraseña</label>
                                <div className="relative flex items-center">
                                    <Icono nombre="lock" className="absolute left-3 text-secondary text-[20px] pointer-events-none" />
                                    <input
                                        id="password"
                                        type={verPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                            </div>

                            <button
                                type="submit"
                                disabled={enviando}
                                className="w-full mt-space-sm h-12 bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-label-lg font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 tracking-wide active:scale-[0.99] disabled:opacity-60"
                            >
                                <span>{enviando ? 'Ingresando...' : 'Ingresar'}</span>
                                <Icono nombre="login" className="text-[20px]" />
                            </button>
                        </form>
                    </div>

                    <div className="bg-surface-container-low px-space-lg py-2.5 text-center">
                        <span className="font-code-tech text-[11px] uppercase tracking-wider text-secondary">
                            Acceso exclusivo para administradores
                        </span>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Login;
