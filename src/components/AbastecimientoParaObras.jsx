import React, { useCallback } from "react";
import PlantaCard from "./Cards/PlantaCard";
import { useAbastecimientos } from "../hooks/useAbastecimientos";
import SEOHead from "./Head/Head";
import lineasIzq from "../assets/lineasamarillasizq.png";
import lineasDer from "../assets/lineasamarillasder.png";

export default function AbastecimientoParaObras() {
  const { plantas, seccion, isLoading } = useAbastecimientos();

  const titleRef = useCallback((el) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -180px 0px" },
    );
    observer.observe(el);
  }, []);

  return (
    <section className="relative px-6 py-24 overflow-hidden bg-white">
      <SEOHead
        priority="high"
        title={`${[seccion.titulo, seccion.titulo_destacado].filter(Boolean).join(" ")} | Anka Loo`}
        description={seccion.seo_description}
      />

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

      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="absolute top-32 left-20 w-96 h-96 bg-[#fdce27] blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-[#1c1c1c] blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <style>{`
            @keyframes slideFromLeft {
              from { opacity: 0; transform: translateX(-60px); }
              to   { opacity: 1; transform: translateX(0); }
            }
            .anim-title { opacity: 0; }
            .anim-title.visible {
              animation: slideFromLeft 2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }
          `}</style>
          <h2
            ref={titleRef}
            className="anim-title mt-6 mb-4 text-4xl lg:text-6xl font-black tracking-tight text-center text-[#1c1c1c]"
          >
            {seccion.titulo}{" "}
            {seccion.titulo_destacado && (
              <span className="text-[#fdce27]">{seccion.titulo_destacado}</span>
            )}
          </h2>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div
            role="status"
            aria-label="Cargando"
            className="flex items-center justify-center min-h-[560px] lg:min-h-[580px]"
          >
            <div className="w-12 h-12 border-4 border-[#fdce27] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {plantas.map((planta) => (
              <PlantaCard key={planta.id} planta={planta} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
