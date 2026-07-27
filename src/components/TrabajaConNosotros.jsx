import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import TurnstileCaptcha from "../components/TurnstileCaptcha";
import clienteAxios from "../config/axios";
import Alerta from "../components/Alerta";
import useCont from "../hooks/useCont";
import SEOHead from "./Head/Head";
import lineasIzq from "../assets/lineasamarillasizq.png";
import lineasDer from "../assets/lineasamarillasder.png";
import {
  Landmark,
  TrendingUp,
  Users,
  ShieldCheck,
  FileText,
  X,
} from "lucide-react";

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes("/embed/")) return url;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const PILLARS = [
  {
    Icon: Landmark,
    title: "Proyectos de escala",
    desc: "Trabajamos en obras de infraestructura con impacto en la comunidad.",
  },
  {
    Icon: TrendingUp,
    title: "Desarrollo profesional",
    desc: " Fomentamos el crecimiento de cada persona con capacitaciones, oportunidades de desarrollo y un plan de carrera para todos los niveles.",
  },
  {
    Icon: Users,
    title: "Equipo comprometido",
    desc: "Somos un equipo que apuesta al trabajo colaborativo y la mejora continua.",
  },
  {
    Icon: ShieldCheck,
    title: "Seguridad ante todo",
    desc: "Trabajamos para consolidar una cultura preventiva, donde el compromiso con la seguridad forma parte de cada tarea y de cada decisión.",
  },
];

const TrabajaConNosotros = () => {
  const { data: vacantesData } = useSWR("/api/vacantes", () =>
    clienteAxios("/api/vacantes").then((res) => res.data),
  );
  const VACANTES = vacantesData?.data ?? [];
  const formRef = useRef(null);
  const formSectionRef = useRef(null);
  const turnstileRef = useRef(null);
  const fileInputRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [estadoMensaje, setEstadoMensaje] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(false);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [vacanteDetalle, setVacanteDetalle] = useState(null);

  const handleFileChange = (e) => {
    setCvFile(e.target.files?.[0] ?? null);
  };

  // Combobox "Área de interés"
  const [comboInput, setComboInput] = useState("");
  const [comboOpen, setComboOpen] = useState(false);
  const [esOtroPuesto, setEsOtroPuesto] = useState(false);
  const [otroPuestoTexto, setOtroPuestoTexto] = useState("");
  const comboRef = useRef(null);

  // Sincronizar display del combobox cuando se selecciona una vacante desde la lista
  useEffect(() => {
    if (esOtroPuesto) return;
    setComboInput(puestoSeleccionado);
  }, [puestoSeleccionado, esOtroPuesto]);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (comboRef.current && !comboRef.current.contains(e.target)) {
        setComboOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectVacante = (rol) => {
    setPuestoSeleccionado(rol);
    setEsOtroPuesto(false);
    setOtroPuestoTexto("");
    formSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handlePostularme = (v) => {
    setVacanteDetalle(null);
    handleSelectVacante(v.titulo);
  };
  const { company } = useCont();
  const videoEmbedUrl = getYouTubeEmbedUrl(company?.rrhh_video);

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
      formData.append(
        "localidad",
        fd.get("localidad")?.toString().trim() || "",
      );
      formData.append(
        "puesto_interes",
        fd.get("puesto_interes")?.toString().trim() || "",
      );
      formData.append(
        "experiencia",
        fd.get("experiencia")?.toString().trim() || "",
      );
      formData.append("mensaje", fd.get("mensaje")?.toString().trim() || "");
      formData.append(
        "turnstile_token",
        isLocal ? "local-bypass" : captchaToken,
      );
      if (fd.get("cv")) formData.append("cv", fd.get("cv"));

      const res = await clienteAxios.post(
        "/api/trabaja-con-nosotros",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const isOk =
        (res.status >= 200 && res.status < 300) || res.data?.success === true;
      if (!isOk) throw new Error(res.data?.message || "Error al enviar");

      setEstadoMensaje({
        tipo: "exito",
        texto:
          res.data?.message ||
          "Tu CV fue enviado con éxito. ¡Nos pondremos en contacto pronto!",
      });

      formRef.current?.reset();
      setCaptchaToken("");
      setCvFile(null);
      setComboInput("");
      setPuestoSeleccionado("");
      setEsOtroPuesto(false);
      setOtroPuestoTexto("");
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
        title="Anka Loo Anka Loo | Trabaja Con Nosotros"
        description="Envía tu CV y únete al equipo de Anka Loo Anka Loo. Buscamos profesionales talentosos para impulsar grandes obras de infraestructura."
      />

      {/* ── HERO ── */}
      <div className="relative overflow-hidden px-6 sm:px-12 py-16 sm:py-20">
        <style>{`
          @keyframes tcnSlideLeft {
            from { opacity: 0; transform: translateX(-60px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          .tcn-title { animation: tcnSlideLeft 2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        `}</style>
        <header className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="ct-title mt-6 mb-4 text-4xl lg:text-6xl font-black tracking-tight ">
            Trabaja con <span className="text-[#fdce27]">Nosotros</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-600 font-light">
            Nuestra gente es el motor que impulsa cada proyecto. Por eso
            buscamos sumar talentos con ganas de desarrollarse y crecer junto a
            nosotros.
          </p>
        </header>
      </div>

      {/* ── VIDEO ── */}
      {videoEmbedUrl && (
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden">
            <iframe
              src={videoEmbedUrl}
              title="Video Anka Loo Anka Loo"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div className="relative overflow-hidden">
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
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-16">
          {/* ── PILLARS ── */}
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">
              Lo que nos hace diferentes
            </h2>
            <p className="text-xs tracking-[0.15em] uppercase text-slate-400 mb-8">
              Por qué Anka Loo
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {PILLARS.map((pillar) => {
                const PillarIcon = pillar.Icon;
                return (
                  <div
                    key={pillar.title}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-[#fdce27] transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center mb-4">
                      <PillarIcon size={18} className="text-[#fdce27]" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mb-1">
                      {pillar.title}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── IMAGEN BANNER RRHH ── */}
          {/* {company?.rrhh_imagen && (
            // <div className="w-full aspect-video rounded-2xl overflow-hidden">
            //   <h2 className="text-2xl font-black text-slate-900 mb-8">
            //     Nuestros espacios de trabajo
            //   </h2>
            //   <img
            //     src={company.rrhh_imagen}
            //     alt="Anka Loo — Trabaja con nosotros"
            //     className="w-full h-full object-cover"
            //   />
            // </div>
          )} */}

          {/* ── VACANTES ── */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-8 pt-8 pb-4">
              <h2 className="text-2xl font-black text-slate-900 mb-8">
                Posiciones abiertas
              </h2>

              <p className="text-xs tracking-[0.15em] uppercase text-slate-400 mb-2">
                ¿Hay algo para vos?
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {VACANTES.length === 0 ? (
                <p className="px-8 py-6 text-sm text-slate-400">
                  No hay posiciones abiertas en este momento.
                </p>
              ) : (
                VACANTES.map((v) => (
                  <button
                    key={v.id ?? v.titulo}
                    type="button"
                    onClick={() => setVacanteDetalle(v)}
                    className="w-full flex items-center justify-between px-8 py-4 hover:bg-[#fdce27]/5 transition-colors cursor-pointer text-left"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.08em] text-slate-400 mb-0.5">
                        {v.area}
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {v.titulo}
                      </p>
                      {v.descripcion && (
                        <div
                          className="prose prose-sm max-w-none text-xs text-slate-500 mt-1 line-clamp-2 [&_p]:m-0 [&_ul]:m-0 [&_ul]:pl-4"
                          dangerouslySetInnerHTML={{ __html: v.descripcion }}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500">
                        {v.ubicacion}
                      </span>
                      <span className="text-[#fdce27] text-lg font-bold">
                        →
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── FORMULARIO ── */}
          <div
            ref={formSectionRef}
            className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="bg-slate-50 px-8 pt-8 pb-6 border-b border-slate-100">
              <h2 className="text-2xl font-black text-slate-900">
                Enviar Curriculum CV / Resumen
              </h2>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="p-8 space-y-5"
            >
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
                {/* ── Combobox área de interés ── */}
                <div className="flex flex-col gap-1.5" ref={comboRef}>
                  <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
                    Puesto de interés{" "}
                    <span className="normal-case">(opcional)</span>
                  </label>

                  {/* Input oculto que viaja con el form */}
                  <input
                    type="hidden"
                    name="puesto_interes"
                    value={puestoSeleccionado}
                  />

                  <div className="relative">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="Buscá o elegí una posición..."
                      value={comboInput}
                      disabled={esOtroPuesto}
                      onFocus={() => setComboOpen(true)}
                      onChange={(e) => {
                        setComboInput(e.target.value);
                        setPuestoSeleccionado(e.target.value);
                        setComboOpen(true);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-9 text-sm text-slate-800 placeholder-slate-400 focus:border-[#fdce27] focus:ring-4 focus:ring-[#fdce27]/10 outline-none transition-all disabled:opacity-60"
                    />
                    {/* Chevron */}
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      aria-hidden
                    >
                      ▾
                    </span>

                    {/* Dropdown */}
                    {comboOpen &&
                      !esOtroPuesto &&
                      (() => {
                        const filtradas = VACANTES.filter((v) =>
                          v.titulo
                            .toLowerCase()
                            .includes(comboInput.toLowerCase()),
                        );
                        const opciones = [
                          ...filtradas,
                          { id: "__otros__", titulo: "Otros" },
                        ];
                        return (
                          <ul className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                            {opciones.map((v) => (
                              <li
                                key={v.id}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  if (v.id === "__otros__") {
                                    setComboInput("Otros");
                                    setPuestoSeleccionado("");
                                    setEsOtroPuesto(true);
                                    setOtroPuestoTexto("");
                                    setComboOpen(false);
                                    return;
                                  }
                                  setComboInput(v.titulo);
                                  setPuestoSeleccionado(v.titulo);
                                  setComboOpen(false);
                                }}
                                className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors
                                ${puestoSeleccionado === v.titulo ? "bg-[#fdce27]/15 text-[#1c1c1c] font-semibold" : "text-slate-700 hover:bg-slate-50"}
                                ${v.id === "__otros__" ? "border-t border-slate-100 text-slate-500 italic" : ""}`}
                              >
                                {v.titulo}
                                {puestoSeleccionado === v.titulo && (
                                  <span className="text-[#d9a800] not-italic">
                                    ✓
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        );
                      })()}
                  </div>

                  {/* Input adicional para especificar el puesto cuando se elige "Otros" */}
                  {esOtroPuesto && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <input
                        type="text"
                        autoFocus
                        autoComplete="off"
                        placeholder="Escribí el puesto que buscás..."
                        value={otroPuestoTexto}
                        maxLength={200}
                        onChange={(e) => {
                          setOtroPuestoTexto(e.target.value);
                          setPuestoSeleccionado(e.target.value);
                        }}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-[#fdce27] focus:ring-4 focus:ring-[#fdce27]/10 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEsOtroPuesto(false);
                          setOtroPuestoTexto("");
                          setComboInput("");
                          setPuestoSeleccionado("");
                        }}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 flex-shrink-0"
                        aria-label="Volver a la lista de posiciones"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
                    Localidad
                  </label>
                  <input
                    type="text"
                    name="localidad"
                    placeholder="Ej: Córdoba Capital"
                    required
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-[#fdce27] focus:ring-4 focus:ring-[#fdce27]/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-[0.08em] text-slate-400">
                  ¿Por qué Anka Loo?{" "}
                  <span className="normal-case">(opcional)</span>
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
                <input
                  ref={fileInputRef}
                  id="cv-input"
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  required={!cvFile}
                  hidden
                  onChange={handleFileChange}
                />
                {cvFile ? (
                  <div className="flex items-center gap-3 border border-[#fdce27] bg-[#fdce27]/5 rounded-xl px-4 py-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1c1c1c] flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-[#fdce27]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {cvFile.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatFileSize(cvFile.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCvFile(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 p-1"
                      aria-label="Quitar archivo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="cv-input"
                    className="flex flex-col items-center gap-2 border border-dashed border-slate-300 rounded-xl p-5 text-center text-sm text-slate-400 bg-slate-50 cursor-pointer hover:border-[#fdce27] hover:bg-[#fdce27]/5 transition-all"
                  >
                    <span className="text-xl">↑</span>
                    <span>Subir archivo · PDF o Word, hasta 5 MB</span>
                  </label>
                )}
              </div>

              {!isLocal && (
                <div className="py-2">
                  <TurnstileCaptcha
                    ref={turnstileRef}
                    onVerify={setCaptchaToken}
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Tu información se trata con total confidencialidad. Solo el
                  equipo de Capital Humano tiene acceso.
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
                  <Alerta tipo={estadoMensaje.tipo}>
                    {estadoMensaje.texto}
                  </Alerta>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ── POPUP DETALLE VACANTE ── */}
      <AnimatePresence>
        {vacanteDetalle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#1c1c1c]/50 backdrop-blur-sm p-4 pt-24 pb-10"
            onClick={() => setVacanteDetalle(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-8 pt-7 pb-5 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#d9a800] font-semibold mb-1">
                    {vacanteDetalle.area}
                  </p>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {vacanteDetalle.titulo}
                  </h3>
                  <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500">
                    {vacanteDetalle.ubicacion}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setVacanteDetalle(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 flex-shrink-0"
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Descripción */}
              <div className="px-8 py-6 overflow-y-auto">
                {vacanteDetalle.descripcion ? (
                  <div
                    className="prose prose-sm max-w-none text-slate-600 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                    dangerouslySetInnerHTML={{
                      __html: vacanteDetalle.descripcion,
                    }}
                  />
                ) : (
                  <p className="text-sm text-slate-400">
                    Sin descripción disponible para esta posición.
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setVacanteDetalle(null)}
                  className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-5 py-2.5 rounded-xl hover:bg-slate-100"
                >
                  ← Volver atrás
                </button>
                <button
                  type="button"
                  onClick={() => handlePostularme(vacanteDetalle)}
                  className="bg-[#fdce27] text-[#1c1c1c] font-bold text-sm px-6 py-2.5 rounded-xl hover:brightness-95 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Postularme →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TrabajaConNosotros;
