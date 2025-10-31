import { useRef, useState } from "react";
import TurnstileCaptcha from "../components/TurnstileCaptcha";
import clienteAxios from "../config/axios";
import Alerta from "../components/Alerta";
import WhatsappHref from "../utils/WhatsappUrl";
import Mapa from "./Mapa/Mapa";
import useCont from "../hooks/useCont";
import Test from "./test/Test";
import SEOHead from "./Head/Head";

const Contacto = () => {
    const formRef = useRef(null);
    const turnstileRef = useRef(null);
    const [captchaToken, setCaptchaToken] = useState('');
    const [estadoMensaje, setEstadoMensaje] = useState({ tipo: '', texto: '' });
    const [loading, setLoading] = useState(false);
    const { company, logoUrl, contact } = useCont();
    
    // Verificar si estamos en entorno local
    const isLocal = import.meta.env.VITE_ENTORNO === 'local';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEstadoMensaje({ tipo: '', texto: '' });

        try {
            const fd = new FormData(formRef.current);
            const datos = {
                nombre: fd.get('nombre')?.toString().trim() || '',
                email: fd.get('email')?.toString().trim() || '',
                telefono: fd.get('telefono')?.toString().trim() || '',
                mensaje: fd.get('mensaje')?.toString().trim() || '',
                turnstile_token: isLocal ? 'local-bypass' : captchaToken,
            };

            const res = await clienteAxios.post('/api/contacto', datos);
            const isOk =
                (res.status >= 200 && res.status < 300) ||
                res.data?.success == true;

            if (!isOk) throw new Error(res.data?.message || 'Error al enviar');

            setEstadoMensaje({
                tipo: 'exito',
                texto: res.data?.message || 'Mensaje enviado correctamente. Te contactaremos pronto.',
            });

            // Reset del form
            formRef.current?.reset();
            setCaptchaToken('');
            
            // Reiniciar Turnstile solo si no estamos en local
            if (!isLocal && turnstileRef.current?.reset) {
                turnstileRef.current.reset();
            }
        } catch (error) {
            console.error('Contacto error:', error);
            setEstadoMensaje({
                tipo: 'error',
                texto: error.response?.data?.message || error.message || 'Hubo un error al enviar el mensaje',
            });
            
            // Reiniciar Turnstile en caso de error también
            if (!isLocal && turnstileRef.current?.reset) {
                turnstileRef.current.reset();
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-16 bg-[#F7FBFD]">
            <SEOHead
                priority="low"  // ← Baja prioridad
                title={`${company.name} | Contacto`}
                description={`Ponte en contacto con ${company.name}. Estamos aquí para ayudarte con cualquier consulta o solicitud.`}
            />
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Mapa */}
                    <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
                        <div className="h-[380px] sm:h-[460px] lg:h-full">
                            <Mapa />
                        </div>
                    </div>
                    {/* Formulario */}
                    <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-6 md:p-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Contactanos</h2>
                        <p className="mb-6 text-slate-600">
                            Dejanos tu consulta y te respondemos a la brevedad. También podés escribirnos por{" "}
                            
                               <a href={WhatsappHref({ message: "Hola, necesito turno para odontologia" })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#008DD2] underline"
                            >
                                WhatsApp
                            </a>
                        </p>
                        <strong>{`${company.address || ''}`}</strong><br />
                        <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-slate-700 font-medium">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    required
                                    className="w-full border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008DD2]/30 focus:border-[#008DD2]"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008DD2]/30 focus:border-[#008DD2]"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-medium">Teléfono</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    required
                                    className="w-full border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008DD2]/30 focus:border-[#008DD2]"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-medium">Consulta</label>
                                <textarea
                                    rows="4"
                                    name="mensaje"
                                    required
                                    className="w-full border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008DD2]/30 focus:border-[#008DD2]"
                                />
                            </div>
                            {!isLocal && (
                                <div>
                                    <TurnstileCaptcha ref={turnstileRef} onVerify={setCaptchaToken} />
                                </div>
                            )}
                            <button
                                type="submit"
                                className="bg-[#008DD2] text-white font-semibold px-6 py-2 rounded hover:bg-[#0079AF] transition disabled:opacity-60"
                                disabled={loading || (!isLocal && !captchaToken)}
                            >
                                {loading ? 'Enviando...' : 'Enviar consulta'}
                            </button>
                            {estadoMensaje.texto && (
                                <div className="mb-4">
                                    <Alerta tipo={estadoMensaje.tipo}>{estadoMensaje.texto}</Alerta>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contacto;