import React, { useEffect, useState, useMemo } from "react";
import useCont from "../hooks/useCont";
import SEOHead from "./Head/Head";
import PortafolioCard from "./PortafolioCard";
import { Loader, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import clienteAxios from "../config/axios";
import lineasIzq from "../assets/lineasamarillasizq.png";
import lineasDer from "../assets/lineasamarillasder.png";

const POR_PAGINA = 12;

export default function Portafolio() {
  const { company } = useCont();
  const [portafolios, setPortafolios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openAccordions, setOpenAccordions] = useState(new Set());
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    clienteAxios
      .get("/api/portafolio-categorias")
      .then(({ data }) => {
        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
        setCategorias(items);
      })
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ sort: "position", dir: "asc" });

    if (selectedCategory !== "all") {
      const parentCat = categorias.find(
        (c) => String(c.id) === selectedCategory,
      );
      if (parentCat && (parentCat.children || []).length > 0) {
        const ids = [
          parentCat.id,
          ...(parentCat.children || []).map((c) => c.id),
        ];
        params.set("category", ids.join(","));
      } else {
        params.set("category", selectedCategory);
      }
    }

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }

    clienteAxios
      .get(`/api/portafolios?${params.toString()}`)
      .then(({ data }) => setPortafolios(data.data || []))
      .catch((error) => console.error("Error al obtener portafolios:", error))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, categorias]);

  const toggleAccordion = (catId) => {
    setOpenAccordions((prev) => {
      const next = new Set(prev);
      next.has(catId) ? next.delete(catId) : next.add(catId);
      return next;
    });
  };

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
    setPagina(1);
  };

  const totalPaginas = Math.ceil(portafolios.length / POR_PAGINA);

  const portafoliosPaginados = useMemo(() => {
    const inicio = (pagina - 1) * POR_PAGINA;
    return portafolios.slice(inicio, inicio + POR_PAGINA);
  }, [portafolios, pagina]);

  const irAPagina = (n) => {
    setPagina(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <SEOHead
        title={`Portafolio - ${company.name || "Anka Loo Construcciones"}`}
        description="Descubre nuestros proyectos y casos de éxito"
      />

      <div className="min-h-screen bg-[#f4f4f4] relative overflow-hidden">
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
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#fdce27] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#1c1c1c] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 px-6 py-24 mx-auto max-w-7xl lg:py-24">
          <style>{`
            @keyframes pfSlideLeft {
              from { opacity: 0; transform: translateX(-60px); }
              to   { opacity: 1; transform: translateX(0); }
            }
            .pf-title { animation: pfSlideLeft 2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
          `}</style>

          {/* Header */}
          <header className="relative z-10 mb-10 text-center">
            <h1 className="pf-title text-5xl lg:text-6xl font-black text-[#1c1c1c] mb-6 tracking-tight">
              Nuestros <span className="text-[#fdce27]">Equipos</span>
            </h1>
          </header>

          {/* Layout sidebar + grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky space-y-4 top-6">
                {/* Búsqueda */}

                {/* Categorías */}
                {categorias.length > 0 && (
                  <div className="p-4 transition-shadow bg-white border shadow-sm rounded-xl border-slate-200 hover:shadow-md">
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
                        Tipo de Equipo
                      </label>
                    </div>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => handleCategorySelect("all")}
                        className={`block w-full px-3 py-2 text-xs font-black transition-all text-left ${
                          selectedCategory === "all"
                            ? "bg-[#1c1c1c] text-[#fdce27] border-l-2 border-[#fdce27]"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        Todos los equipos
                      </button>

                      {categorias.map((cat) => {
                        const hasChildren = (cat.children || []).length > 0;
                        const isOpen = openAccordions.has(cat.id);
                        return (
                          <React.Fragment key={cat.id}>
                            <button
                              type="button"
                              onClick={() => {
                                handleCategorySelect(String(cat.id));
                                if (hasChildren) toggleAccordion(cat.id);
                              }}
                              className={`w-full px-3 py-2 text-xs font-black transition-all text-left flex items-center justify-between gap-1 ${
                                selectedCategory === String(cat.id)
                                  ? "bg-[#1c1c1c] text-[#fdce27] border-l-2 border-[#fdce27]"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              <span>{cat.nombre}</span>
                              {hasChildren && (
                                <ChevronDown
                                  className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                />
                              )}
                            </button>
                            {hasChildren &&
                              isOpen &&
                              cat.children.map((subcat) => (
                                <button
                                  key={subcat.id}
                                  type="button"
                                  onClick={() =>
                                    handleCategorySelect(String(subcat.id))
                                  }
                                  className={`w-full px-3 py-2 text-xs font-black transition-all text-left pl-6 border-l-2 ${
                                    selectedCategory === String(subcat.id)
                                      ? "bg-[#1c1c1c] text-[#fdce27] border-[#fdce27]"
                                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent"
                                  }`}
                                >
                                  └ {subcat.nombre}
                                </button>
                              ))}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Contenido principal */}
            <main className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-10 h-10 text-[#fdce27] animate-spin" />
                </div>
              ) : portafolios.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4 mb-10 md:grid-cols-2 lg:grid-cols-3">
                    {portafoliosPaginados.map((proyecto) => (
                      <PortafolioCard key={proyecto.id} proyecto={proyecto} />
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

                      {Array.from(
                        { length: totalPaginas },
                        (_, i) => i + 1,
                      ).map((n) => (
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
                      ))}

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
                <div className="py-12 text-center bg-white border shadow-sm rounded-xl border-slate-200">
                  <p className="text-base lg:text-lg text-slate-500">
                    {searchQuery || selectedCategory !== "all"
                      ? "No hay equipos que coincidan con los filtros"
                      : "No hay equipos disponibles"}
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
