import React, { useCallback } from "react";
import PlantaCard from "./Cards/PlantaCard";
import abastecimientoPlantas from "../data/abastecimientoPlantas.json";
import SEOHead from "./Head/Head";
import lineasIzq from "../assets/lineasamarillasizq.png";
import lineasDer from "../assets/lineasamarillasder.png";

export default function AbastecimientoParaObras() {
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
        title="Abastecimiento para obras | Anka Loo"
        description="Plantas propias de hormigón y asfalto de Anka Loo en Río Cuarto, al servicio de la logística y provisión de insumos para nuestras obras."
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
            Abastecimientos para{" "}
            <span className="text-[#fdce27]">obras</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {abastecimientoPlantas.map((planta) => (
            <PlantaCard key={planta.id} planta={planta} />
          ))}
        </div>
      </div>
    </section>
  );
}
