import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import clienteAxios from "../config/axios";
import CategoriaServicioCard from "./CategoriaServicioCard";

export default function CategoriasServicios() {
  const [categorias, setCategorias] = useState([]);

  // ---- SWR - Obtener categorías ----
  const fetcher = (url) => clienteAxios(url).then((res) => res.data);

  const { data, error, isLoading } = useSWR(
    "/api/servicios-categorias",
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
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
      <section className="relative bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 w-96 mx-auto mb-16"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-slate-100 "></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || categorias.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-white py-24 px-6 overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="absolute top-32 left-20 w-96 h-96 bg-[#fdce27] blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-[#1c1c1c] blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-black text-[#1c1c1c] mb-6 tracking-tight ">
            Nuestros <span className="text-[#fdce27]">Servicios</span>
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto text-xl leading-relaxed font-light">
            Conoce los tipos de obras en los que nos especializamos
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {categorias.map((categoria) => (
            <CategoriaServicioCard key={categoria.id} categoria={categoria} />
          ))}
        </div>
      </div>
    </section>
  );
}
