import { useRef, useState } from "react";
import TurnstileCaptcha from "../components/TurnstileCaptcha";
import clienteAxios from "../config/axios";
import Alerta from "../components/Alerta";
import WhatsappHref from "../utils/WhatsappUrl";
import useCont from "../hooks/useCont";
import SEOHead from "./Head/Head";

const Contacto = () => {
  const formRef = useRef(null);
  const turnstileRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [estadoMensaje, setEstadoMensaje] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(false);
  const { company, contact } = useCont();

  const isLocal = import.meta.env.VITE_ENTORNO === "local";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEstadoMensaje({ tipo: "", texto: "" });

    try {
      const fd = new FormData(formRef.current);
      const datos = {
        nombre: fd.get("nombre")?.toString().trim() || "",
        email: fd.get("email")?.toString().trim() || "",
        telefono: fd.get("telefono")?.toString().trim() || "",
        mensaje: fd.get("mensaje")?.toString().trim() || "",
        turnstile_token: isLocal ? "local-bypass" : captchaToken,
      };

      const res = await clienteAxios.post("/api/contacto", datos);
      const isOk =
        (res.status >= 200 && res.status < 300) || res.data?.success === true;

      if (!isOk) throw new Error(res.data?.message || "Error al enviar");

      setEstadoMensaje({
        tipo: "exito",
        texto:
          res.data?.message ||
          "Tu consulta fue enviada con éxito. Un asesor técnico se contactará pronto.",
      });

      formRef.current?.reset();
      setCaptchaToken("");
      if (!isLocal && turnstileRef.current?.reset) {
        turnstileRef.current.reset();
      }
    } catch (error) {
      console.error("Contacto error:", error);
      setEstadoMensaje({
        tipo: "error",
        texto:
          error.response?.data?.message ||
          error.message ||
          "Hubo un error al enviar el mensaje. Podés escribirnos por WhatsApp.",
      });
      if (!isLocal && turnstileRef.current?.reset) {
        turnstileRef.current.reset();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-white py-24 overflow-hidden">
      <SEOHead
        priority="low"
        title={`RevenantTravel | Contacto`}
        description={`Contactate con RevenantTravel para obtener información sobre nuestros paquetes turísticos. Te ayudamos a planificar tu próximo viaje.`}
      />

      {/* Glow decorativo */}
      <div className="absolute -top-32 -right-40 w-[500px] h-[500px] bg-[#dc834e]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Encabezado */}
        <header className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-[#dc834e] text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
            Agencia de Viajes
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mt-6 mb-4 leading-tight">
            ¿Listo para tu próxima <br /><span className="text-[#dc834e] thea-amelia text-6xl md:text-7xl">aventura</span>?
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            Envíanos tu consulta y recibí <strong>asesoramiento personalizado</strong>.
            También podés escribirnos directo por{" "}
            <a
              href={WhatsappHref({
                message: "Hola, me gustaría información sobre paquetes turísticos.",
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#dc834e] underline font-black hover:text-[#c77542]"
            >
              WhatsApp
            </a>
            .
          </p>
        </header>

        {/* Layout de contacto */}
        <div className="grid lg:grid-cols-12 gap-12 bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">

          {/* Info Lateral */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#dc834e] to-amber-700 p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-8">Información de Contacto</h3>
              <div className="space-y-8">
                <div>
                  <p className="text-amber-100 text-xs font-black uppercase tracking-widest mb-1">Nuestra Oficina</p>
                  <p className="text-lg font-medium">{company.address || "Argentina"}</p>
                </div>
                <div>
                  <p className="text-amber-100 text-xs font-black uppercase tracking-widest mb-1">Escríbenos</p>
                  <p className="text-lg font-medium">{contact.email || "info@revenanttravel.com"}</p>
                </div>
                <div>
                  <p className="text-amber-100 text-xs font-black uppercase tracking-widest mb-1">Horario de Atención</p>
                  <p className="text-lg font-medium">{company.business_hours || "Lun a Vie: 09:00 - 18:00hs"}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20 relative z-10">
              <p className="text-amber-50 text-sm italic thea-amelia text-xl">
                "Tu próxima aventura comienza aquí"
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-8 p-10 md:p-12">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-slate-900 font-black text-sm uppercase tracking-wider">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Juan Pérez"
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-[#003366]/10 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-900 font-black text-sm uppercase tracking-wider">
                    WhatsApp / Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Ej: +54 9 351..."
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-[#dc834e]/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-900 font-black text-sm uppercase tracking-wider">
                  Email de contacto
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="ejemplo@email.com"
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-[#dc834e]/20 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-900 font-black text-sm uppercase tracking-wider">
                  Tu consulta sobre el viaje
                </label>
                <textarea
                  name="mensaje"
                  rows="4"
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-[#dc834e]/20 transition-all font-medium resize-none"
                  placeholder="Contanos qué destino te interesa, fechas aproximadas, cantidad de personas..."
                />
              </div>

              {!isLocal && (
                <div className="py-2">
                  <TurnstileCaptcha ref={turnstileRef} onVerify={setCaptchaToken} />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#dc834e] text-white font-black px-8 py-5 rounded-2xl shadow-xl hover:bg-[#c77542] hover:scale-[1.02] transition-all disabled:opacity-60 active:scale-95"
                  disabled={loading || (!isLocal && !captchaToken)}
                >
                  {loading ? "ENVIANDO..." : "ENVIAR CONSULTA"}
                </button>
                <a
                  href={WhatsappHref({
                    message: "Hola, me interesa información sobre paquetes turísticos.",
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white text-[#dc834e] border-2 border-[#dc834e] font-black px-8 py-5 rounded-2xl hover:bg-[#dc834e]/5 transition-all text-center active:scale-95"
                >
                  ESCRIBIR POR WHATSAPP
                </a>
              </div>

              {estadoMensaje.texto && (
                <div className="mt-6">
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
