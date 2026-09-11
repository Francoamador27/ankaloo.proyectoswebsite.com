import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import SEOHead from "./Head/Head";
import abastecimientoPlantas from "../data/abastecimientoPlantas.json";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export default function PlantaDetalle() {
  const { plantaId } = useParams();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const planta = abastecimientoPlantas.find((p) => p.id === plantaId);
  const imagenes = planta
    ? [planta.imagen, ...(planta.galeria || [])].filter(Boolean)
    : [];

  if (!planta) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black text-[#1c1c1c] mb-2 tracking-wide">
            No encontramos esta planta
          </h1>
          <Link
            to="/servicios/abastecimiento-para-obras"
            className="text-[#fdce27] font-black hover:underline text-sm tracking-widest"
          >
            Volver a Abastecimiento para obras
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${planta.titulo} - Anka Loo`}
        description={planta.descripcion?.join(" ") || ""}
      />

      <div className="min-h-screen bg-[#f4f4f4]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#fdce27] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1c1c1c] rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1c1c1c] mb-3 tracking-tight leading-none">
              {planta.titulo}
            </h1>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8 flex-wrap">
              <Link
                to="/"
                className="text-[#5a5a5a] hover:text-[#fdce27] transition-colors font-semibold"
              >
                Inicio
              </Link>
              <span className="text-slate-400">/</span>
              <Link
                to="/servicios"
                className="text-[#5a5a5a] hover:text-[#fdce27] transition-colors font-semibold"
              >
                Servicios
              </Link>
              <span className="text-slate-400">/</span>
              <Link
                to="/servicios/abastecimiento-para-obras"
                className="text-[#5a5a5a] hover:text-[#fdce27] transition-colors font-semibold"
              >
                Abastecimiento para obras
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-[#fdce27] font-black truncate max-w-[150px] lg:max-w-none">
                {planta.titulo}
              </span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Izquierda: Galería */}
              <div className="animate-fadeInLeft flex flex-col gap-4">
                <div className="relative h-80 sm:h-96 lg:h-[450px] shadow-2xl bg-white border border-slate-200 p-2">
                  <div className="w-full h-full relative overflow-hidden">
                    {imagenes.length > 0 ? (
                      <Swiper
                        style={{
                          "--swiper-navigation-color": "#fdce27",
                          "--swiper-pagination-color": "#fdce27",
                        }}
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{
                          swiper:
                            thumbsSwiper && !thumbsSwiper.destroyed
                              ? thumbsSwiper
                              : null,
                        }}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="w-full h-full"
                      >
                        {imagenes.map((img, index) => (
                          <SwiperSlide key={index}>
                            <img
                              src={img}
                              alt={`${planta.titulo} - Foto ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <div className="w-full h-full bg-[#1c1c1c] flex items-center justify-center relative overflow-hidden">
                        <span className="text-xs font-black tracking-[0.2em] text-white/30 uppercase relative z-10">
                          Imagen próximamente
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#fdce27]"></div>
                </div>

                {/* Thumbnails */}
                {imagenes.length > 1 && (
                  <div className="h-24 sm:h-28 w-full p-2 bg-white border border-slate-200 shadow-sm">
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={4}
                      freeMode={true}
                      watchSlidesProgress={true}
                      modules={[FreeMode, Navigation, Thumbs]}
                      className="w-full h-full thumbs-swiper"
                    >
                      {imagenes.map((img, index) => (
                        <SwiperSlide
                          key={index}
                          className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity [&.swiper-slide-thumb-active]:border-2 [&.swiper-slide-thumb-active]:border-[#fdce27] [&.swiper-slide-thumb-active]:opacity-100"
                        >
                          <img
                            src={img}
                            alt={`Miniatura ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </div>

              {/* Derecha: Info */}
              <div className="animate-fadeInRight">
                <div className="mb-6">
                  <span className="bg-[#1c1c1c] text-[#fdce27] text-[10px] font-black tracking-[0.2em] px-3 py-1.5 inline-block shadow-sm">
                    ABASTECIMIENTO
                  </span>
                </div>

                {planta.subtitulo && (
                  <p className="text-xs font-black uppercase tracking-widest text-[#d9a800] mb-6">
                    {planta.subtitulo}
                  </p>
                )}

                {Array.isArray(planta.descripcion) &&
                  planta.descripcion.length > 0 && (
                    <ul className="text-lg leading-relaxed text-[#5a5a5a] font-light mb-10 list-none p-0 m-0 space-y-3">
                      {planta.descripcion.map((item, idx) => (
                        <li key={idx} className="relative pl-6">
                          <span className="absolute left-0 top-0 text-[#fdce27] font-black">
                            ❯
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.6s ease-out forwards;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.6s ease-out forwards;
        }
      `}</style>
    </>
  );
}
