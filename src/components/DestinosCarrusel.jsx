import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import clienteAxios from "../config/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

export default function DestinosCarrusel() {
  const [categorias, setCategorias] = useState([]);

  // ---- SWR - Obtener categorías ----
  const fetcher = (url) => clienteAxios(url).then((res) => res.data);

  const { data, error, isLoading } = useSWR(
    "/api/servicios-categorias",
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (!data) return;
    const items = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];
    setCategorias(items);
  }, [data]);

  if (isLoading) {
    return (
      <section className="relative bg-slate-50 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || categorias.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white py-24 px-6 overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-32 left-20 w-96 h-96 bg-[#dc834e] rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#dc834e]/10 px-6 py-2.5 rounded-full text-[#dc834e] font-black text-sm mb-6 border border-[#dc834e]/20 shadow-md">
            <span className="w-2 h-2 bg-[#dc834e] rounded-full animate-ping"></span>
            EXPLORA EL MUNDO
          </div>

          <h2 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Nuestros{" "}
            <span className="text-[#dc834e] text-6xl lg:text-7xl">
              Destinos
            </span>
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto text-xl leading-relaxed font-light">
            Descubre experiencias únicas en los destinos más fascinantes del
            planeta
          </p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="h-1.5 w-20 rounded-full bg-[#dc834e]"></div>
            <div className="h-2 w-2 rounded-full bg-[#dc834e]"></div>
            <div className="h-1.5 w-20 rounded-full bg-[#dc834e]"></div>
          </div>
        </div>

        {/* Carrusel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            coverflowEffect={{
              rotate: 15,
              stretch: 0,
              depth: 200,
              modifier: 1.5,
              slideShadows: false,
            }}
            spaceBetween={30}
            slidesPerView={3}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".destinos-swiper-button-next",
              prevEl: ".destinos-swiper-button-prev",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="destinos-swiper pb-16"
          >
            {categorias.map((categoria) => {
              const slug =
                categoria.nombre?.toLowerCase().replace(/\s+/g, "-") ||
                categoria.id;
              return (
                <SwiperSlide key={categoria.id}>
                  <Link to={`/paquetes/${slug}`}>
                    <div className="group relative h-[420px] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-700 hover:shadow-[0_30px_70px_rgba(220,131,78,0.25)] cursor-pointer">
                      {/* Imagen de fondo */}
                      <div className="absolute inset-0 z-0">
                        {categoria.imagen ? (
                          <img
                            src={categoria.imagen}
                            alt={categoria.nombre}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#dc834e] via-[#c77542] to-amber-700"></div>
                        )}

                        {/* Overlay con gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent transition-all duration-500 group-hover:from-[#dc834e]/95 group-hover:via-slate-900/70" />
                      </div>

                      {/* Contenido */}
                      <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                        <h3 className="text-4xl font-black mb-4 tracking-tight transition-transform duration-500 group-hover:-translate-y-2 leading-tight">
                          {categoria.nombre}
                        </h3>

                        {categoria.descripcion && (
                          <p className="text-white/90 text-base mb-6 leading-relaxed line-clamp-3 transition-all duration-500 group-hover:text-white">
                            {categoria.descripcion}
                          </p>
                        )}

                        {/* CTA */}
                        <div className="flex items-center gap-3 opacity-80 transform transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-2">
                          <span className="text-sm font-bold tracking-tight uppercase text-white">
                            Explorar destino
                          </span>
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center transition-all duration-300 group-hover:bg-white/30">
                            <svg
                              className="w-5 h-5 text-white"
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
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Botones de navegación personalizados */}
          <button className="destinos-swiper-button-prev absolute top-1/2 -translate-y-1/2 left-4 z-20 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl flex items-center justify-center text-[#dc834e] hover:bg-[#dc834e] hover:text-white transition-all duration-300 hover:scale-110 active:scale-95">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="destinos-swiper-button-next absolute top-1/2 -translate-y-1/2 right-4 z-20 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl flex items-center justify-center text-[#dc834e] hover:bg-[#dc834e] hover:text-white transition-all duration-300 hover:scale-110 active:scale-95">
            <svg
              className="w-6 h-6"
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
          </button>
        </div>

        {/* Link a todos los paquetes */}
        <div className="text-center mt-12">
          <Link
            to="/servicios"
            className="inline-block bg-[#dc834e] hover:bg-[#c77542] text-white px-10 py-4 rounded-2xl font-black text-base shadow-xl shadow-[#dc834e]/20 active:scale-95 transition-all"
          >
            VER TODOS LOS PAQUETES
          </Link>
        </div>
      </div>

      <style jsx>{`
        .destinos-swiper .swiper-pagination-bullet {
          background: #dc834e;
          opacity: 0.4;
          width: 12px;
          height: 12px;
        }

        .destinos-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.3);
        }
      `}</style>
    </section>
  );
}
