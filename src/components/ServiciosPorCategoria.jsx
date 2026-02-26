import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import WhatsappHref from "../utils/WhatsappUrl";
import useSWR from "swr";
import clienteAxios from "../config/axios";
import SEOHead from "./Head/Head";

export default function ServiciosPorCategoria() {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const [serviciosApi, setServiciosApi] = useState([]);
  const [categoriaInfo, setCategoriaInfo] = useState(null);

  // ---- SWR - Obtener categoría por ID ----
  const fetcherCategoria = (url) => clienteAxios(url).then((res) => res.data);
  const { data: dataCategorias } = useSWR(
    "/api/servicios-categorias",
    fetcherCategoria,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  // Buscar categoría por slug o ID
  useEffect(() => {
    if (!dataCategorias?.data) return;
    const cat = dataCategorias.data.find(
      (c) =>
        c.id === parseInt(categoria) ||
        c.nombre?.toLowerCase().replace(/\s+/g, "-") === categoria.toLowerCase()
    );
    if (cat) {
      setCategoriaInfo(cat);
    } else {
      // Si no se encuentra, redirigir a servicios
      navigate("/servicios");
    }
  }, [dataCategorias, categoria, navigate]);

  // ---- SWR - Obtener servicios por categoría ----
  const fetcher = (url) => clienteAxios(url).then((res) => res.data);

  const { data, error, isLoading } = useSWR(
    categoriaInfo
      ? `/api/servicios?category=${categoriaInfo.id}&sort=position&dir=asc&per_page=1000`
      : null,
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

  // ---- Datos finales ----
  const servicios = useMemo(() => {
    return serviciosApi.map((s) => ({
      icon: s.icon ?? "🛠️",
      titulo: s.titulo ?? s.title ?? "Servicio especializado",
      descripcion: s.descripcion ?? s.description ?? "",
      highlight: s.highlight ?? s.tagline ?? "",
      slug:
        s.slug ??
        (s.titulo ?? s.title ?? "").toLowerCase().replace(/\s+/g, "-"),
      image: s.image ?? null,
      price: s.price ?? null,
    }));
  }, [serviciosApi]);

  // ✅ Card para Grid - Diseño de Turismo
  const ServicioCard = ({ item, idx }) => {
    return (
      <div
        className="group relative h-[450px] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(220,131,78,0.15)] opacity-0 animate-fadeInUp"
        style={{
          animationDelay: `${idx * 120}ms`,
          animationFillMode: "forwards",
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

        {/* Link invisible */}
        <Link
          to={`/servicios/${item.slug}`}
          className="absolute inset-0 z-20 cursor-pointer"
          aria-label={`Ver detalles de ${item.titulo}`}
        />
      </div>
    );
  };

  if (!categoriaInfo && !isLoading) {
    return null;
  }

  return (
    <section className="relative bg-slate-50 py-24 px-6 lg:px-20 overflow-hidden">
      <SEOHead
        priority="high"
        title={`${categoriaInfo?.nombre || "Categoría"} | RevenantTravel`}
        description={
          categoriaInfo?.descripcion ||
          "Descubre nuestros paquetes turísticos exclusivos."
        }
      />

      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#dc834e] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-slate-500 hover:text-[#dc834e] transition-colors"
            >
              Inicio
            </Link>
            <span className="text-slate-400">/</span>
            <Link
              to="/servicios"
              className="text-slate-500 hover:text-[#dc834e] transition-colors"
            >
              Paquetes
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-[#dc834e] font-semibold">
              {categoriaInfo?.nombre || "..."}
            </span>
          </nav>
        </div>

        {/* Header con imagen de categoría */}
        <div className="text-center mb-20">
          {categoriaInfo?.imagen && (
            <div className="mb-8 relative h-64 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={categoriaInfo.imagen}
                alt={categoriaInfo.nombre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent flex items-end justify-center pb-10">
                <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight">
                  {categoriaInfo.nombre}
                </h1>
              </div>
            </div>
          )}

          {!categoriaInfo?.imagen && (
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              {categoriaInfo?.nombre || "Cargando..."}
            </h1>
          )}

          {categoriaInfo?.descripcion && (
            <p className="text-slate-600 max-w-2xl mx-auto text-xl leading-relaxed font-light">
              {categoriaInfo.descripcion}
            </p>
          )}

          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="h-1.5 w-20 rounded-full bg-[#dc834e]"></div>
            <div className="h-2 w-2 rounded-full bg-[#dc834e]"></div>
            <div className="h-1.5 w-20 rounded-full bg-[#dc834e]"></div>
          </div>
        </div>

        {/* Carga o error */}
        {isLoading && (
          <div className="text-center text-slate-500 mb-12 animate-pulse">
            Cargando paquetes...
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 mb-12 bg-red-50 p-4 rounded-xl">
            No pudimos cargar los paquetes. Por favor, reintenta más tarde.
          </div>
        )}

        {/* Mensaje si no hay servicios */}
        {!isLoading && servicios.length === 0 && (
          <div className="text-center text-slate-500 mb-12 bg-slate-100 p-8 rounded-2xl">
            <p className="text-xl font-semibold mb-2">
              No hay paquetes disponibles en esta categoría
            </p>
            <Link
              to="/servicios"
              className="text-[#dc834e] hover:underline font-bold"
            >
              Ver todos los paquetes
            </Link>
          </div>
        )}

        {/* ✅ Grid */}
        {servicios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
            {servicios.map((item, idx) => (
              <ServicioCard key={idx} item={item} idx={idx} />
            ))}
          </div>
        )}

        {/* CTA Final */}
        <div className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-br from-[#dc834e] to-amber-700 p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h4 className="text-4xl font-black text-white mb-6">
              ¿Listo para tu próxima{" "}
              <span className="text-5xl">aventura</span>?
            </h4>
            <p className="text-white/90 text-lg mb-10 font-light leading-relaxed max-w-2xl mx-auto">
              Consultanos por disponibilidad, paquetes personalizados y
              promociones exclusivas.
            </p>

            <a
              href={WhatsappHref({
                message: `Hola, vengo desde la web de RevenantTravel y me gustaría información sobre ${
                  categoriaInfo?.nombre || "los paquetes turísticos"
                }.`,
              })}
              className="inline-block bg-white text-[#dc834e] px-12 py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-50 hover:scale-105 transition-all active:scale-95"
              target="_blank"
              rel="noreferrer"
            >
              🌍 CONSULTAR DISPONIBILIDAD
            </a>
          </div>
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
