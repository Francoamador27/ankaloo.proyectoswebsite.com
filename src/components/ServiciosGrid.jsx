import React, { useState, useEffect, useMemo } from "react";
import {
  Link,
  useSearchParams,
  useParams,
  useNavigate,
} from "react-router-dom";
import useSWR from "swr";
import clienteAxios from "../config/axios";
import SEOHead from "./Head/Head";
import { ServicioCard } from "./Cards/ServicioCard";
import lineasIzq from "../assets/lineasamarillasizq.png";
import lineasDer from "../assets/lineasamarillasder.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

const POR_PAGINA = 12;

export default function ServiciosGrid() {
  const { categoria: categoriaSlug } = useParams();
  const navigate = useNavigate();
  const [serviciosApi, setServiciosApi] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagina, setPagina] = useState(1);

  // Capturar parámetro 'categoria' de la URL (slug o param)
  useEffect(() => {
    if (!categorias.length) return;

    // Si viene de /servicios/:categoria (slug)
    if (categoriaSlug) {
      if (categoriaSlug === "todas-nuestras-obras") {
        setSelectedCategory("all");
      } else {
        const cat = categorias.find(
          (c) =>
            c.nombre?.toLowerCase().replace(/\s+/g, "-") ===
              categoriaSlug.toLowerCase() || String(c.id) === categoriaSlug,
        );
        if (cat) {
          setSelectedCategory(String(cat.id));
        } else {
          setSelectedCategory("all");
        }
      }
    } else {
      setSelectedCategory("all");
    }
  }, [categoriaSlug, categorias]);

  const handleCategorySelect = (slug) => {
    if (slug === "all") {
      navigate("/servicios/todas-nuestras-obras");
    } else {
      const cat = categorias.find((c) => String(c.id) === slug);
      const catSlug = cat
        ? cat.nombre.toLowerCase().replace(/\s+/g, "-")
        : slug;
      navigate(`/servicios/${catSlug}`);
    }
  };

  // ---- SWR (API dinámica) ----
  const fetcher = (url) => clienteAxios(url).then((res) => res.data);

  const { data: dataCategorias } = useSWR(
    "/api/servicios-categorias",
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
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

  // ---- Datos finales ----
  const servicios = useMemo(() => {
    const base = serviciosApi?.length ? serviciosApi : [];
    return base.map((s) => ({
      icon: s.icon ?? "🛠️",
      titulo: s.titulo ?? s.title ?? "Servicio especializado",
      descripcion: s.descripcion ?? s.description ?? "",
      highlight: s.highlight ?? s.tagline ?? "",
      slug:
        s.slug ??
        (s.titulo ?? s.title ?? "").toLowerCase().replace(/\s+/g, "-"),
      image: s.image ?? null,
      categoria: s.categoria?.nombre ?? null,
    }));
  }, [serviciosApi]);

  const totalPaginas = Math.ceil(servicios.length / POR_PAGINA);

  const serviciosPaginados = useMemo(() => {
    const inicio = (pagina - 1) * POR_PAGINA;
    return servicios.slice(inicio, inicio + POR_PAGINA);
  }, [servicios, pagina]);

  const irAPagina = (n) => {
    setPagina(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative bg-[#f4f4f4] py-12 lg:py-16 px-6 lg:px-20 overflow-hidden">
      <div
        aria-hidden="true"
        className="hidden lg:block pointer-events-none absolute left-0 top-0 h-full w-48 select-none z-0 opacity-60"
        style={{
          backgroundImage: `url(${lineasDer})`,
          backgroundRepeat: "repeat-y",
          backgroundSize: "contain",
          backgroundPosition: "left top",
        }}
      />
      <div
        aria-hidden="true"
        className="hidden lg:block pointer-events-none absolute right-0 top-0 h-full w-48 select-none z-0 opacity-60"
        style={{
          backgroundImage: `url(${lineasIzq})`,
          backgroundRepeat: "repeat-y",
          backgroundSize: "contain",
          backgroundPosition: "right top",
        }}
      />
      <SEOHead
        priority="high"
        title={`Ankaloo Construcciones | Obras e Infraestructura en Córdoba`}
        description="Empresa constructora de Córdoba: obras hidráulicas, viales, saneamiento, urbanizaciones y obras civiles con tecnología de vanguardia."
      />

      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#fdce27] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#1c1c1c] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Compacto */}
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1c1c1c] mb-3 lg:mb-4 tracking-tight ">
            {selectedCategory === "all"
              ? "Nuestras Obras"
              : categorias.find((c) => String(c.id) === selectedCategory)
                  ?.nombre || "Nuestras Obras"}
          </h2>

          <p className="text-[#5a5a5a] mx-auto text-sm md:text-base lg:text-lg leading-relaxed font-light">
            En{" "}
            <strong className="text-[#1c1c1c]">Ankaloo Construcciones</strong>{" "}
            brindamos servicios de infraestructura con profesionales
            especializados y tecnología de última generación.
          </p>
        </div>

        {/* Main Layout con Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16 lg:mb-20">
          {/* Sidebar Filtros */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Search Box */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-[#fdce27]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <label className="text-sm font-semibold text-slate-900">
                    Buscar obra
                  </label>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nombre o tipo de obra..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-[#fdce27] focus:outline-none focus:ring-2 focus:ring-[#fdce27]/20 transition-all duration-200 text-sm"
                />
              </div>

              {/* Categorías Filter */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-5 h-5 text-[#fdce27]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <label className="text-sm font-semibold text-slate-900">
                    Tipo de Obra
                  </label>
                </div>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect("all")}
                    className={`w-full px-3 py-2 text-xs font-black transition-all text-left ${
                      selectedCategory === "all"
                        ? "bg-[#1c1c1c] text-[#fdce27] border-l-2 border-[#fdce27]"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Todos
                  </button>
                  {categorias.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(String(cat.id))}
                      className={`w-full px-3 py-2 text-xs font-black transition-all text-left ${
                        selectedCategory === String(cat.id)
                          ? "bg-[#1c1c1c] text-[#fdce27] border-l-2 border-[#fdce27]"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {cat.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Counter */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <p className="text-xs text-slate-600">
                  <span className="font-black text-[#1c1c1c]">
                    {servicios.length}
                  </span>{" "}
                  obras disponibles
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Carga o error */}
            {isLoading && (
              <div className="text-center text-slate-500 mb-12 animate-pulse">
                Cargando Servicios …
              </div>
            )}
            {error && (
              <div className="text-center text-red-600 mb-12 bg-red-50 p-4 rounded-xl">
                No pudimos cargar los Servicios. Por favor, reintenta más tarde.
              </div>
            )}

            {/* Grid */}
            {!isLoading && servicios.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {serviciosPaginados.map((item, idx) => (
                    <ServicioCard key={idx} item={item} idx={idx} />
                  ))}
                </div>

                {totalPaginas > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => irAPagina(pagina - 1)}
                      disabled={pagina === 1}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-[#1c1c1c] hover:border-[#fdce27] hover:text-[#fdce27] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                      (n) => (
                        <button
                          key={n}
                          onClick={() => irAPagina(n)}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-black transition-colors ${
                            n === pagina
                              ? "bg-[#fdce27] text-[#1c1c1c] border border-[#fdce27]"
                              : "bg-white border border-slate-200 text-[#1c1c1c] hover:border-[#fdce27] hover:text-[#fdce27]"
                          }`}
                        >
                          {n}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() => irAPagina(pagina + 1)}
                      disabled={pagina === totalPaginas}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-[#1c1c1c] hover:border-[#fdce27] hover:text-[#fdce27] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              !isLoading && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-slate-800 mb-1">
                    No se encontraron servicios
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Intenta ajustar tus filtros de búsqueda
                  </p>
                </div>
              )
            )}
          </main>
        </div>

        <div className="mt-8 lg:mt-10 text-center text-slate-500 font-bold text-xs lg:text-sm tracking-widest ">
          <p>Obras Viales | Hidráulicas | Saneamiento | Urbanizaciones</p>
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
