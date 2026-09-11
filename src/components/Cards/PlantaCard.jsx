import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TiltedCard from "../TiltedCard";

export default function PlantaCard({ planta }) {
  const [imgOk, setImgOk] = useState(false);
  const wrapperRef = useRef(null);

  // Precarga la imagen: solo mostramos TiltedCard si realmente existe,
  // sino queda el placeholder (mientras no se suba la foto real).
  useEffect(() => {
    if (!planta.imagen) return;
    const img = new Image();
    img.onload = () => setImgOk(true);
    img.onerror = () => setImgOk(false);
    img.src = planta.imagen;
  }, [planta.imagen]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cat-card { opacity: 0; }
        .cat-card.visible {
          animation: fadeSlideUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
      <div ref={wrapperRef} className="cat-card">
        <Link to={`/servicios/abastecimiento-para-obras/${planta.id}`}>
        <div className="group relative h-auto min-h-[560px] lg:h-[580px] overflow-hidden shadow-xl border border-slate-200/10 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer bg-[#1c1c1c]">
          {/* Línea dorada superior que aparece en hover */}
          <div className="absolute top-0 left-0 w-full h-1 bg-[#fdce27] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 z-30"></div>

          {/* Fondo (Imagen o Patrón) */}
          <div className="absolute inset-0 z-0">
            {imgOk ? (
              <TiltedCard
                imageSrc={planta.imagen}
                altText={planta.titulo}
                captionText={planta.titulo}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={5}
                scaleOnHover={1.12}
                showMobileWarning={false}
                displayOverlayContent={false}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-[#1c1c1c]">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                ></div>
                <span className="relative text-xs font-black tracking-[0.2em] text-white/30 uppercase">
                  Imagen próximamente
                </span>
              </div>
            )}

            {/* Filtro amarillo vibrante */}
            <div className="absolute inset-0 bg-[#fdce27]/70 mix-blend-multiply z-10 transition-all duration-500 group-hover:bg-[#fdce27]/80" />

            {/* Overlay degradado suave */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* Contenido */}
          <div className="relative z-20 lg:absolute lg:inset-0">
            <div className="relative z-10 h-full flex flex-col p-8 pt-32 lg:pt-[120px] text-white">
              {/* Título estilo tipología de obra */}
              <div className="mb-6">
                <h3 className="inline-block bg-[#5b5959e6]/95 px-5 py-3 text-2xl lg:text-2xl font-black uppercase tracking-tighter text-[#fdce27] border-l-[10px] border-[#fdce27] shadow-xl">
                  {planta.titulo}
                </h3>
              </div>

              {/* Descripción (como items) */}
              {Array.isArray(planta.descripcion) &&
                planta.descripcion.length > 0 && (
                  <ul className="max-w-none text-[15px] font-medium text-slate-100 mb-6 list-none p-0 m-0">
                    {planta.descripcion.map((item, idx) => (
                      <li
                        key={idx}
                        className="relative pb-2 pl-5 leading-tight"
                      >
                        <span className="absolute left-0 top-[4px] text-[12px] font-black text-white">
                          ❯
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

              {/* CTA */}
              <div className={`mt-auto ${planta.subtitulo ? "pb-10" : ""}`}>
                <div className="flex items-center gap-3 group/cta">
                  <span className="text-[10px] font-black tracking-[0.15em] text-white transition-all duration-300 group-hover/cta:text-[#fdce27]">
                    VER
                  </span>
                  <div className="w-8 h-8 bg-[#fdce27] flex items-center justify-center transition-all duration-300 group-hover/cta:scale-110 active:scale-95 shadow-md">
                    <svg
                      className="w-4 h-4 text-[#1c1c1c]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Subtítulo (modelo de la planta) siempre al fondo */}
              {planta.subtitulo && (
                <p className="absolute bottom-0 left-0 right-0 px-8 py-3 text-[11px] tracking-wide text-white text-right border-t border-white/20">
                  {planta.subtitulo}
                </p>
              )}
            </div>
          </div>
        </div>
        </Link>
      </div>
    </>
  );
}
