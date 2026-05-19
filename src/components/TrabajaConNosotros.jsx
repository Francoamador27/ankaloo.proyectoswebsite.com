import { useRef, useState } from "react";
import TurnstileCaptcha from "../components/TurnstileCaptcha";
import clienteAxios from "../config/axios";
import Alerta from "../components/Alerta";
import useCont from "../hooks/useCont";
import SEOHead from "./Head/Head";
import lineasIzq from "../assets/lineasamarillasizq.png";
import lineasDer from "../assets/lineasamarillasder.png";
import { Landmark, TrendingUp, Users, ShieldCheck } from "lucide-react";

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes("/embed/")) return url;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const PILLARS = [
  {
    Icon: Landmark,
    title: "Proyectos de escala",
    desc: "Trabajamos en obras de infraestructura vial e hidráulica con impacto real en la región.",
  },
  {
    Icon: TrendingUp,
    title: "Desarrollo profesional",
    desc: "Programas de formación en liderazgo y competencias técnicas para todos los niveles.",
  },
  {
    Icon: Users,
    title: "Equipo comprometido",
    desc: "Un equipo que apuesta al trabajo colaborativo y la mejora continua.",
  },
  {
    Icon: ShieldCheck,
    title: "Seguridad ante todo",
    desc: "Nuestra cultura de HyS es parte de quiénes somos, en todas las áreas.",
  },
];

const VACANTES = [
  { area: "Obra civil", rol: "Jefe de Obra", ubicacion: "Córdoba" },
  { area: "Logística", rol: "Responsable de Almacén", ubicacion: "Córdoba" },
  { area: "Corporativo", rol: "Analista de Capital Humano", ubicacion: "Remoto" },
];

const TrabajaConNosotros = () => {
  const formRef = useRef(null);
  const formSectionRef = useRef(null);
  const turnstileRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [estadoMensaje, setEstadoMensaje] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(false);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState("");

  const handleSelectVacante = (rol) => {
    setPuestoSeleccionado(rol);
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const { company } = useCont();
  const videoEmbedUrl = getYouTubeEmbedUrl(company?.video_quienes_somos);

  const isLocal = import.meta.env.VITE_ENTORNO === "local";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEstadoMensaje({ tipo: "", texto: "" });

    try {
      const fd = new FormData(formRef.current);
      const formData = new FormData();
      formData.append("nombre", fd.get("nombre")?.toString().trim() || "");
      formData.append("email", fd.get("email")?.toString().trim() || "");
      formData.append("telefono", fd.get("telefono")?.toString().trim() || "");
      formData.append("puesto_interes", fd.get("puesto_interes")?.toString().trim() || "");
      formData.append("experiencia", fd.get("experiencia")?.toString().trim() || "");
      formData.append("mensaje", fd.get("mensaje")?.toString().trim() || "");
      formData.append("turnstile_token", isLocal ? "local-bypass" : captchaToken);
      if (fd.get("cv")) formData.append("cv", fd.get("cv"));

      const res = await clienteAxios.post("/api/trabaja-con-nosotros", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const isOk = (res.status >= 200 && res.status < 300) || res.data?.success === true;
      if (!isOk) throw new Error(res.data?.message || "Error al enviar");

      setEstadoMensaje({
        tipo: "exito",
        texto: res.data?.message || "Tu CV fue enviado con éxito. ¡Nos pondremos en contacto pronto!",
      });

      formRef.current?.reset();
      setCaptchaToken("");
      if (!isLocal && turnstileRef.current?.reset) turnstileRef.current.reset();
    } catch (error) {
      console.error("TrabajaConNosotros error:", error);
      setEstadoMensaje({
        tipo: "error",
        texto:
          error.response?.data?.message ||
          error.message ||
          "Hubo un error al enviar tu CV. Por favor intenta de nuevo.",
      });
      if (!isLocal && turnstileRef.current?.reset) turnstileRef.current.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <SEOHead
        priority="low"
        title="Anka Loo Construcciones | Trabaja Con Nosotros"
        description="Envía tu CV y únete al equipo de Anka Loo Construcciones. Buscamos profesionales talentosos para impulsar grandes obras de infraestructura."
      />

      {/* Decorativas laterales */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 z-0 hidden w-48 h-full pointer-events-none select-none lg:block opacity-60"
        style={{
          backgroundImage: `url(${lineasDer})`,
          backgroundRepeat: "repeat-y",
          backgroundSize: "contain",
          backgroundPosition: "left top",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 z-0 hidden w-48 h-full pointer-events-none select-none lg:block opacity-60"
        style={{
          backgroundImage: `url(${lineasIzq})`,
          backgroundRepeat: "repeat-y",
          backgroundSize: "contain",
          backgroundPosition: "right top",
        }}
      />

      {/* ── HERO ── */}
      <div className="relative bg-[#1c1c1c] overflow-hidden px-6 sm:px-12 py-16 sm:py-20">
        {/* glows decorativos */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#fdce27]/8 pointer-events-none" />
        <div className="absolute -bottom-10 left-[30%] w-52 h-52 rounded-full bg-[#fdce27]/5 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="text-xs font-normal tracking-[0.15em] uppercase text-[#fdce27] mb-4">
            Capital humano · Únete al equipo
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-[#f0ede6] leading-tight mb-5 max-w-xl">
            Construimos obras.{" "}
            <em className="not-italic text-[#fdce27]">Construimos carreras.</em>
          </h1>
          <p className="text-[#a0a0a0] text-base sm:text-lg font-light leading-relaxed max-w-md">
            En Ankaloo creemos que los proyectos de infraestructura los hacen las
            personas. Buscamos{" "}
            <strong className="text-[#f0ede6] font-medium">personas</strong> que
            quieran crecer junto con nosotros.
          </p>
        </div>
      </div>

      {/* ── VIDEO ── */}
      {videoEmbedUrl && (
        <div className="w-full aspect-video bg-black">
          <iframe
            src={videoEmbedUrl}
            title="Video Anka Loo Construcciones"
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-16">

        {/* ── PILLARS ── */}
        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-slate-400 mb-2">
            Por qué Ankaloo
          </p>
          <h2 className="text-2xl font-black text-slate-900 mb-8">
            Lo que nos hace diferentes
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PILLARS.map((pillar) => {
              const PillarIcon = pillar.Icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-[#fdce27] transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#1c1c1c] flex items-center justify-center mb-4">
                    <PillarIcon size={18} className="text-[#fdce27]" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">{pillar.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── VACANTES ── */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-8 pt-8 pb-4">
            <p className="text-xs tracking-[0.15em] uppercase text-slate-400 mb-2">
              Posiciones abiertas
            </p>
            <h2 className="text-2xl font-black text-slate-900">
              ¿Hay algo para vos?
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {VACANTES.map((v) => (
              <button
                key={v.rol}
                type="button"
                onClick={() => handleSelectVacante(v.rol)}
                className="w-full flex items-center justify-between px-8 py-4 hover:bg-[#fdce27]/5 transition-colors cursor-pointer text-left"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.08em] text-slate-400 mb-0.5">
                    {v.area}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">{v.rol}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500">
                    {v.ubicacion}
                  </span>
                  <span className="text-[#fdce27] text-lg font-bold">→</span>
                </div>
              </button>
            ))}
          </div>
          <p className="px-8 py-4 text-xs text-slate-400 border-t border-slate-100">
            ¿No ves tu perfil? Dejanos tu CV de todas formas ↓
          </p>
        </div>

        {/* ── FORMULARIO ── */}
        <div ref={formSectionRef} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-8 pt-8 pb-6 border-b border-slate-100">
            <p className="text-xs tracking-[0.15em] uppercase text-slate-400 mb-2">
              Postulaciones espontáneas
            </p>
            <h2 className="text-2xl font-black text-slate-900">
              Contanos sobre vos
            </h2>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: Juan Pérez"
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-[#fdce27] focus:ring-4 focus:ring-[#fdce27]/10 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
                  Área de interés <span className="normal-case">(opcional)</span>
                </label>
                <input
                  type="text"
                  name="puesto_interes"
                  placeholder="Ej: Operador de Maquinaria, Ingeniero Civil..."
                  value={puestoSeleccionado}
                  onChange={(e) => setPuestoSeleccionado(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-[#fdce27] focus:ring-4 focus:ring-[#fdce27]/10 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="ejemplo@email.com"
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-[#fdce27] focus:ring-4 focus:ring-[#fdce27]/10 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="+54 351 ..."
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-[#fdce27] focus:ring-4 focus:ring-[#fdce27]/10 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
                ¿Por qué Ankaloo? <span className="normal-case">(opcional)</span>
              </label>
              <textarea
                name="mensaje"
                rows={3}
                placeholder="Contanos un poco sobre vos y por qué querés unirte al equipo..."
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-[#fdce27] focus:ring-4 focus:ring-[#fdce27]/10 outline-none transition-all resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
                CV / Portafolio
              </label>
              <label className="flex flex-col items-center gap-2 border border-dashed border-slate-300 rounded-xl p-5 text-center text-sm text-slate-400 bg-slate-50 cursor-pointer hover:border-[#fdce27] hover:bg-[#fdce27]/5 transition-all">
                <span className="text-xl">↑</span>
                <span>Subir archivo · PDF o Word, hasta 5 MB</span>
                <input
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  required
                  hidden
                />
              </label>
            </div>

            {!isLocal && (
              <div className="py-2">
                <TurnstileCaptcha ref={turnstileRef} onVerify={setCaptchaToken} />
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Tu información se trata con total confidencialidad. Solo el equipo
                de Capital Humano tiene acceso.
              </p>
              <button
                type="submit"
                disabled={loading || (!isLocal && !captchaToken)}
                className="bg-[#fdce27] text-[#1c1c1c] font-bold text-sm px-8 py-3 rounded-xl hover:brightness-95 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? "Enviando..." : "Enviar postulación →"}
              </button>
            </div>

            {estadoMensaje.texto && (
              <div className="mt-4">
                <Alerta tipo={estadoMensaje.tipo}>{estadoMensaje.texto}</Alerta>
              </div>
            )}
          </form>
        </div>

      </div>
    </section>
  );
};

export default TrabajaConNosotros;
