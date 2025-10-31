import { Link } from "react-router-dom";
import { useState, useRef } from 'react';
import Alerta from '../components/Alerta';
import UseAuth from "../hooks/useAuth";
import clienteAxios from "../config/axios";
import TurnstileCaptcha from "../components/TurnstileCaptcha";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaLogin, setCaptchaLogin] = useState('');
    const [captchaReset, setCaptchaReset] = useState('');

    const [errores, setErrores] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [emailReset, setEmailReset] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [verPassword, setVerPassword] = useState(false);

    // Referencias para resetear Turnstile
    const turnstileLoginRef = useRef(null);
    const turnstileResetRef = useRef(null);

    const { login } = UseAuth({ middleware: 'guest', url: '/mi-cuenta' });

    // Leer entorno
    const entorno = import.meta.env.VITE_ENTORNO;
    const esLocal = entorno === 'local';

    const toMsg = (e) => {
        if (!e) return '';
        if (typeof e === 'string') return e;
        if (Array.isArray(e)) return e.join(' ');
        if (typeof e === 'object') return Object.values(e).flat().join(' ');
        return String(e);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrores(null);
        setLoading(true);

        try {
            const datos = {
                email,
                password,
                turnstile_token: esLocal ? 'local-bypass' : captchaLogin,
            };
            
            await login(datos, setErrores, setLoading);
            
            // Si hubo error, reiniciar captcha
            if (!esLocal && turnstileLoginRef.current?.reset) {
                turnstileLoginRef.current.reset();
            }
            setCaptchaLogin('');
        } catch (error) {
            // Reiniciar captcha en caso de error
            if (!esLocal && turnstileLoginRef.current?.reset) {
                turnstileLoginRef.current.reset();
            }
            setCaptchaLogin('');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrores(null);
        setMensaje('');

        try {
            const { data } = await clienteAxios.post('/api/forgot-password', {
                email: emailReset,
                turnstile_token: esLocal ? 'local-bypass' : captchaReset,
            });
            
            setMensaje(data.message);
            
            // Reiniciar captcha después de envío exitoso
            if (!esLocal && turnstileResetRef.current?.reset) {
                turnstileResetRef.current.reset();
            }
            setCaptchaReset('');
        } catch (error) {
            const api = error.response?.data;
            setErrores(api?.errors || api?.message || 'Ocurrió un error');
            
            // Reiniciar captcha en caso de error
            if (!esLocal && turnstileResetRef.current?.reset) {
                turnstileResetRef.current.reset();
            }
            setCaptchaReset('');
        }
    };

    // Validaciones
    const camposLoginCompletos = email.trim() !== '' && password.trim() !== '' && (esLocal || captchaLogin);
    const camposResetCompletos = emailReset.trim() !== '' && (esLocal || captchaReset);

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className="w-96 h-[450px] relative perspective">
                <div className={`transition-transform duration-700 relative w-full h-full transform-style-preserve-3d ${showReset ? 'rotate-y-180' : ''}`}>

                    {/* Login */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-lg shadow-lg p-6">
                        <div className="flex flex-col justify-center items-center space-y-2">
                            <h2 className="text-2xl font-medium text-slate-700">Iniciar sesión</h2>
                            <p className="text-slate-500">Ingresá tus datos a continuación.</p>
                        </div>
                        <form onSubmit={handleLogin} className="w-full mt-4 space-y-3">
                            <input
                                className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300"
                                placeholder="Correo electrónico"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className="relative z-20">
                                <input
                                    className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300 pr-10"
                                    placeholder="Contraseña"
                                    type={verPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500"
                                    onClick={() => setVerPassword(!verPassword)}
                                    aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {verPassword ? '🙈' : '👁️'}
                                </button>
                            </div>

                            {errores && (
                                <div className="space-y-1">
                                    <Alerta>
                                        {toMsg(errores)}
                                    </Alerta>
                                </div>
                            )}

                            {!esLocal && (
                                <TurnstileCaptcha 
                                    ref={turnstileLoginRef}
                                    onVerify={setCaptchaLogin} 
                                />
                            )}

                            <div className="text-center">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowReset(true);
                                        setErrores(null);
                                        setMensaje('');
                                    }} 
                                    className="text-blue-500 font-medium hover:underline"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>

                            <button
                                className={`w-full py-2 text-white font-semibold rounded-md transition ${camposLoginCompletos ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed opacity-50'}`}
                                type="submit"
                                disabled={loading || !camposLoginCompletos}
                            >
                                {loading ? 'Cargando...' : 'Iniciar sesión'}
                            </button>

                            <p className="flex justify-center space-x-1">
                                <span className="text-slate-700">¿No tenés una cuenta?</span>
                                <Link className="text-blue-500 hover:underline" to="/auth/register">Registrate</Link>
                            </p>
                        </form>
                    </div>

                    {/* Recuperación */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-lg shadow-lg p-6 rotate-y-180">
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-semibold text-slate-700">¿Olvidaste tu contraseña?</h2>
                            <p className="text-slate-500 text-sm">Te enviaremos un email para recuperarla</p>
                        </div>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <input
                                className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300"
                                type="email"
                                placeholder="Tu correo"
                                value={emailReset}
                                onChange={(e) => setEmailReset(e.target.value)}
                            />

                            {errores && (
                                <div className="space-y-1">
                                    <Alerta>{toMsg(errores)}</Alerta>
                                </div>
                            )}
                            
                            {mensaje && (
                                <div className="bg-green-100 text-green-700 border border-green-300 px-4 py-2 rounded text-sm">
                                    {mensaje}
                                </div>
                            )}

                            {!esLocal && (
                                <TurnstileCaptcha 
                                    ref={turnstileResetRef}
                                    onVerify={setCaptchaReset} 
                                />
                            )}

                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    className="text-sm text-blue-500 hover:underline"
                                    onClick={() => {
                                        setShowReset(false);
                                        setErrores(null);
                                        setMensaje('');
                                    }}
                                >
                                    Volver al inicio de sesión
                                </button>

                                <button
                                    type="submit"
                                    disabled={!camposResetCompletos}
                                    className={`px-4 py-2 text-white rounded-md transition ${camposResetCompletos ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed opacity-50'}`}
                                >
                                    Enviar correo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;