import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import WhatsappHref from "../utils/WhatsappUrl";
import useSWR from "swr";
import clienteAxios from "../config/axios";
import SEOHead from "./Head/Head";
import useCont from "../hooks/useCont";

// ✅ Swiper (slider)
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// ✅ CSS Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ServiciosSwiper() {
  const [visibleCards, setVisibleCards] = useState(() => new Set());
  const [serviciosApi, setServiciosApi] = useState([]);

  // ---- SWR (API dinámica) ----
  const fetcher = (url) => clienteAxios(url).then((res) => res.data);

  const { data, error, isLoading } = useSWR(
    "/api/servicios?sort=position&dir=asc&per_page=1000",
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
    setServiciosApi(items);
  }, [data]);

  // ---- Fallback si la API no trae nada ----
  const serviciosFallback = useMemo(
    () => [
      {
        icon: "🏖️",
        titulo: "Playas Paradisíacas",
        descripcion:
          "Descubre las mejores playas del Caribe con arenas blancas y aguas cristalinas.",
        highlight: "Popular",
      },
      {
        icon: "🏔️",
        titulo: "Montañas y Aventura",
        descripcion:
          "Experiencias en la naturaleza con trekkings, escalada y paisajes increíbles.",
        highlight: "Aventura",
      },
      {
        icon: "🏛️",
        titulo: "Tours Culturales",
        descripcion:
          "Explora ciudades históricas, museos y sitios arqueológicos fascinantes.",
        highlight: "Cultura",
      },
      {
        icon: "🌴",
        titulo: "Escapadas Tropicales",
        descripcion:
          "Relájate en destinos exóticos con todo incluido y servicio premium.",
        highlight: "All Inclusive",
      },
      {
        icon: "🎿",
        titulo: "Aventuras de Invierno",
        descripcion:
          "Ski, snowboard y experiencias únicas en los mejores centros de esquí.",
        highlight: "Temporada",
      },
      {
        icon: "🚢",
        titulo: "Cruceros de Lujo",
        descripcion:
          "Navega por el mundo conociendo múltiples destinos con máximo confort.",
        highlight: "Premium",
      },
    ],
    []
  );

  // ---- Datos finales ----
  const servicios = useMemo(() => {
    const base = serviciosApi?.length ? serviciosApi : serviciosFallback;
    return base.map((s) => ({
      icon: s.icon ?? "🛠️",
      titulo: s.titulo ?? s.title ?? "Servicio especializado",
      descripcion: s.descripcion ?? s.description ?? "",
      highlight: s.highlight ?? s.tagline ?? "",
      slug: s.slug ?? (s.titulo ?? s.title ?? "").toLowerCase().replace(/\s+/g, "-"),
      image: s.image ?? null,
    }));
  }, [serviciosApi, serviciosFallback]);

  // ✅ Helper: marcar visibles desde Swiper
  const markSwiperVisible = useCallback((swiper) => {
    if (!swiper) return;

    setVisibleCards((prev) => {
      const next = new Set(prev);

      const slidesPerView = swiper.params.slidesPerView === 'auto' 
        ? swiper.slides.length 
        : (swiper.params.slidesPerView || 1);
      
      const activeIndex = swiper.activeIndex || 0;
      const numVisibleSlides = typeof slidesPerView === 'number' 
        ? Math.ceil(slidesPerView) 
        : 1;
      
      for (let i = 0; i < numVisibleSlides; i++) {
        const index = activeIndex + i;
        if (index < swiper.slides.length) {
          next.add(String(index));
        }
      }

      return next;
    });
  }, []);

  const { company } = useCont();

  // ✅ Card para Swiper
  const ServicioCard = ({ item, idx }) => {
    const isVisible = visibleCards.has(String(idx));

    return (
      <div
        data-index={idx}
        className={`group relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-xl transform transition-all duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Imagen de Fondo */}
        <div className="absolute inset-0 z-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.titulo}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#dc834e] via-[#c77542] to-amber-700 flex items-center justify-center">
              <span className="text-7xl opacity-30">{item.icon}</span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent transition-all duration-500 group-hover:from-[#dc834e]/90 group-hover:via-slate-900/60" />
        </div>

        {/* Contenido */}
        <div className="relative z-10 h-full flex flex-col justify-end p-10 text-white">
          {/* Badge */}
          {item.highlight && (
            <div className="mb-4 transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="bg-[#dc834e]/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-white/20 shadow-lg">
                {item.highlight}
              </span>
            </div>
          )}

          {/* Título */}
          <h3 className="text-3xl font-black mb-2 tracking-tight transition-transform duration-500 group-hover:-translate-y-2">
            {item.titulo}
          </h3>

          {/* CTA hover */}
          <div className="flex items-center gap-3 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <span className="text-sm font-bold tracking-tight uppercase text-white">
              Ver detalles del paquete
            </span>
            <div className="w-8 h-8 rounded-full bg-[#dc834e]/80 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-300 group-hover:bg-[#dc834e]">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Link invisible */}
        <Link
          to={`/servicios/${item.slug}`}
          className="absolute inset-0 z-20 cursor-pointer"
          aria-label={`Ver detalles de ${item.titulo}`}
        />
      </div>
    );
  };

  return (
    <section className="relative bg-slate-50 py-24 px-6 lg:px-20 overflow-hidden">
      <SEOHead
        priority="high"
        title={`RevenantTravel | Paquetes Turísticos`}
        description="Descubre nuestros paquetes turísticos exclusivos en los mejores destinos del mundo."
      />

      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#dc834e] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#dc834e]/10 px-6 py-2.5 rounded-full text-[#dc834e] font-black text-sm mb-6 border border-[#dc834e]/20 shadow-md">
            <span className="w-2 h-2 bg-[#dc834e] rounded-full animate-ping"></span>
            EXPERIENCIAS ÚNICAS
          </div>

          <h2 className="text-4xl lg:text-5xl font-black  text-slate-900 mb-6 tracking-tight">
            Le <span className="text-[#dc834e]  text-6xl lg:text-5xl">Paquetes</span>
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto text-xl leading-relaxed font-light">
            En <strong className="text-[#dc834e]">RevenantTravel</strong> creamos experiencias inolvidables en los destinos más increíbles del mundo.
          </p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="h-1.5 w-20 rounded-full bg-[#dc834e]"></div>
            <div className="h-2 w-2 rounded-full bg-[#dc834e]"></div>
            <div className="h-1.5 w-20 rounded-full bg-[#dc834e]"></div>
          </div>
        </div>

        {/* Carga o error */}
        {isLoading && (
          <div className="text-center text-slate-500 mb-12 animate-pulse">
            Cargando paquetes turísticos…
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 mb-12 bg-red-50 p-4 rounded-xl">
            No pudimos cargar los paquetes. Por favor, reintenta más tarde.
          </div>
        )}

        {/* ✅ Slider */}
        <div className="mb-20">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 12 },
              640: { slidesPerView: 1, spaceBetween: 14 },
              768: { slidesPerView: 3, spaceBetween: 16 },
              1024: { slidesPerView: 4, spaceBetween: 18 },
              1280: { slidesPerView: 4, spaceBetween: 20 },
            }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4500, disableOnInteraction: true }}
            loop={true}
            style={{ paddingBottom: "38px" }}
            onSwiper={(swiper) => markSwiperVisible(swiper)}
            onSlideChange={(swiper) => markSwiperVisible(swiper)}
          >
            {servicios.map((item, idx) => (
              <SwiperSlide key={idx} className="h-auto">
                <div className="h-full">
                  <ServicioCard item={item} idx={idx} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* CTA Final */}
        <div className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-br from-[#dc834e] to-amber-700 p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h4 className="text-4xl font-black text-white mb-6">
              ¿Listo para tu próxima aventura?
            </h4>
            <p className="text-white/90 text-lg mb-10 font-light leading-relaxed max-w-2xl mx-auto">
              Consultanos por disponibilidad, paquetes personalizados y promociones exclusivas.
            </p>

            <a
              href={WhatsappHref({
                message:
                  "Hola, vengo desde la web de RevenantTravel y me gustaría información sobre los paquetes turísticos.",
              })}
              className="inline-block bg-white text-[#dc834e] px-12 py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-50 hover:scale-105 transition-all active:scale-95"
              target="_blank"
              rel="noreferrer"
            >
              🌍 CONSULTAR DISPONIBILIDAD
            </a>
          </div>
        </div>

        <div className="mt-12 text-center text-slate-400 font-bold text-sm tracking-widest uppercase">
          <p>Destinos únicos | Experiencias exclusivas | Viajes inolvidables</p>
        </div>
      </div>
    </section>
  );
}