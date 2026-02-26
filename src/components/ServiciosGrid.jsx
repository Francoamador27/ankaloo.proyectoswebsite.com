import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import WhatsappHref from "../utils/WhatsappUrl";
import useSWR from "swr";
import clienteAxios from "../config/axios";
import SEOHead from "./Head/Head";
import useCont from "../hooks/useCont";

export default function ServiciosGrid() {
  const [serviciosApi, setServiciosApi] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ---- SWR (API dinámica) ----
  const fetcher = (url) => clienteAxios(url).then((res) => res.data);

  const { data: dataCategorias } = useSWR(
    "/api/servicios-categorias",
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const serviciosUrl = useMemo(() => {
    const params = new URLSearchParams({
      sort: "position",
      dir: "asc",
      per_page: "1000",
    });

    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }

    return `/api/servicios?${params.toString()}`;
  }, [selectedCategory, searchQuery]);

  const { data, error, isLoading } = useSWR(serviciosUrl, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!dataCategorias) return;
    const items = Array.isArray(dataCategorias?.data)
      ? dataCategorias.data
      : Array.isArray(dataCategorias)
      ? dataCategorias
      : [];
    setCategorias(items);
  }, [dataCategorias]);

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

  const { company } = useCont();

  // ✅ Card para Grid - Diseño de Turismo
  const ServicioCard = ({ item, idx }) => {
    return (
      <div
        className="group relative h-[450px] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(220,131,78,0.15)] opacity-0 animate-fadeInUp"
        style={{ 
          animationDelay: `${idx * 120}ms`,
          animationFillMode: 'forwards'
        }}
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
              <span className="text-8xl opacity-30">{item.icon}</span>
            </div>
          )}

          {/* Overlay con gradiente elegante */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent transition-all duration-500 group-hover:from-[#dc834e]/90 group-hover:via-slate-900/60" />
        </div>

        {/* Badge Superior - Posición Absoluta */}
        {item.highlight && (
          <div className="absolute top-6 right-6 z-20">
            <span className="bg-[#dc834e]/90 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg border border-white/20">
              {item.highlight}
            </span>
          </div>
        )}

        {/* Contenido - Fijado a la parte inferior */}
        <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
          {/* Título con fuente elegante */}
          <h3 className="text-3xl font-black mb-3 tracking-tight transition-transform duration-500 group-hover:-translate-y-1 leading-tight">
            {item.titulo}
          </h3>

          {/* Descripción visible siempre */}
          <p className="text-white/90 text-sm mb-4 leading-relaxed line-clamp-2 transition-all duration-500 group-hover:text-white">
            {item.descripcion}
          </p>

          {/* Precio si existe */}
          {item.price && (
            <div className="mb-4">
              <span className="text-2xl font-black text-[#dc834e] bg-white/90 px-4 py-1 rounded-full">
                ${item.price}
              </span>
            </div>
          )}

          {/* CTA hover */}
          <div className="flex items-center gap-3 opacity-70 transform transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-2">
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
        description="Descubre nuestros paquetes turísticos exclusivos. Experiencias únicas en los mejores destinos del mundo con RevenantTravel."
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

          <h2 className="text-5xl lg:text-6xl font-black thea-amelia text-slate-900 mb-6 tracking-tight">
            Nuestros <span className="text-[#dc834e] thea-amelia text-6xl lg:text-6xl">Paquetes Turísticos</span>
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

        {/* Filtros */}
        <div className="mb-16">
          <div className="max-w-2xl mx-auto mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar paquetes por nombre o descripcion"
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 shadow-sm focus:border-[#dc834e] focus:ring-2 focus:ring-[#dc834e]/20 transition-all"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-tight border transition-all ${
                selectedCategory === "all"
                  ? "bg-[#dc834e] text-white border-[#dc834e] shadow-lg shadow-[#dc834e]/20"
                  : "bg-white text-slate-700 border-slate-200 hover:border-[#dc834e] hover:text-[#dc834e]"
              }`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(String(cat.id))}
                className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-tight border transition-all ${
                  selectedCategory === String(cat.id)
                    ? "bg-[#dc834e] text-white border-[#dc834e] shadow-lg shadow-[#dc834e]/20"
                    : "bg-white text-slate-700 border-slate-200 hover:border-[#dc834e] hover:text-[#dc834e]"
                }`}
              >
                {cat.nombre}
              </button>
            ))}
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

        {/* ✅ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
          {servicios.map((item, idx) => (
            <ServicioCard key={idx} item={item} idx={idx} />
          ))}
        </div>

        {/* CTA Final */}
        <div className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-br from-[#dc834e] to-amber-700 p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h4 className="text-4xl font-black text-white mb-6">
              ¿Listo para tu próxima <span className=" text-5xl">aventura</span>?
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

      {/* ✅ Animación CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(3rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.7s ease-out;
        }
      `}</style>
    </section>
  );
}