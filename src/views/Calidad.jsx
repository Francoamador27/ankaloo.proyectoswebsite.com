import React, { useEffect, useState } from "react";
import useSWR from "swr";
import {
  Loader,
  Award,
  Download,
  ShieldCheck,
  FileText,
  ArrowRight,
} from "lucide-react";
import SEOHead from "../components/Head/Head";
import clienteAxios from "../config/axios";
import useCont from "../hooks/useCont";
import ImageSlider from "../components/ImageSlider";

const fetcher = (url) => clienteAxios.get(url).then((res) => res.data.data);

const fetcherSlider = (url) =>
  clienteAxios.get(url).then((res) => res.data.data);

export default function Calidad() {
  const { company } = useCont();

  const { data: imagenesCalidad = [] } = useSWR(
    "/api/recursos-imagenes/calidad",
    fetcherSlider,
    { revalidateOnFocus: false },
  );

  const {
    data: certificados,
    error,
    isLoading,
  } = useSWR("/api/certificados", fetcher);

  const { data: politicaData } = useSWR("/api/politica-gestion", fetcher, {
    revalidateOnFocus: false,
  });
  const politicaUrl = politicaData?.documento ?? null;

  return (
    <>
      <SEOHead
        title={`Calidad y Certificaciones - ${company.name || "Anka Loo Anka Loo"}`}
        description="Conoce nuestras certificaciones de calidad y estándares de excelencia en infraestructura."
      />

      <div className="min-h-screen bg-white py-12 lg:py-20 relative overflow-hidden">
        {/* Fondo Industrial Sutil */}
        <div className="absolute top-0 left-0 w-full h-96 bg-[#f4f4f4] -z-10 skew-y-[-2deg] origin-top-left"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-[#fdce27] rounded-full blur-3xl opacity-10 -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header de Sección */}
          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-[#1c1c1c] leading-tight mb-8">
              Calidad <span className="text-[#fdce27]">Certificada</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg leading-relaxed font-light text-[#5a5a5a] animate-fadeInUp">
              En <strong>{company.name || "Anka Loo"} </strong>
              contamos con certificaciones de calidad ISO que avalan nuestros
              procesos constructivos.
            </p>
          </header>
          {/* Slider calidad — separado, arriba */}

          {imagenesCalidad.length > 0 && (
            <div className="mt-12 rounded-2xl overflow-hidden shadow-lg">
              <ImageSlider
                images={imagenesCalidad}
                imgClassName="w-full max-h-[600px] object-cover"
              />
            </div>
          )}
          {/* Grilla de Certificados */}
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader className="w-12 h-12 text-[#fdce27] animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-2xl">
              <p className="text-slate-500 font-bold">
                Error al cargar las certificaciones. Intenta nuevamente más
                tarde.
              </p>
            </div>
          ) : certificados?.length === 0 ? (
            <div className="text-center py-32 bg-[#1c1c1c] rounded-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#fdce27] opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700"></div>
              <p className="text-white/40 font-black text-xs uppercase tracking-[0.3em]">
                No hay certificados publicados actualmente
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 justify-items-center px-10 sm:px-0">
              {certificados.map((cert, index) => (
                <article
                  key={cert.id}
                  className="group w-full bg-white shadow-lg hover:shadow-2xl border border-slate-100 transition-all duration-500 animate-fadeInUp overflow-hidden rounded-2xl flex flex-col"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative flex items-center justify-center aspect-video">
                    {cert.imagen ? (
                      <img
                        src={cert.imagen}
                        alt="Certificado de Calidad"
                        className="w-full h-full object-contain drop-shadow-sm"
                      />
                    ) : (
                      <Award className="w-12 h-12 text-slate-200" />
                    )}
                    <div className="absolute inset-0 bg-[#1c1c1c]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>

                  {cert.documento && (
                    <div className="px-4 pb-4 flex justify-center">
                      <a
                        href={cert.documento}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#fdce27] hover:bg-[#1c1c1c] text-[#1c1c1c] hover:text-[#fdce27] text-[10px] font-black uppercase tracking-[0.15em] px-4 py-2.5 shadow-xl rounded-xl transition-colors duration-300"
                      >
                        <Download size={13} strokeWidth={2.5} />
                        <span>DESCARGAR CERTIFICADO</span>
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {/* Política de Gestión — texto centrado ancho completo */}
          <div className="mb-12 bg-[#f4f4f4] rounded-2xl p-8 lg:p-12 mt-8 flex flex-col items-center text-center">
            <p className="text-lg leading-relaxed font-light text-[#5a5a5a] mb-6 max-w-2xl">
              En <strong className="text-[#1c1c1c] font-black">Anka Loo</strong>{" "}
              definimos y cumplimos una{" "}
              <strong className="text-[#1c1c1c]">
                Política de Calidad, Medio Ambiente, Salud y Seguridad de los
                Trabajadores
              </strong>
              , que rige la gestión diaria y regula nuestro trabajo para el
              logro de los objetivos y la mejora continua de nuestros procesos.
            </p>
            {politicaUrl && (
              <a
                href={politicaUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#fdce27] hover:bg-[#1c1c1c] text-[#1c1c1c] hover:text-[#fdce27] text-[11px] font-black uppercase tracking-[0.15em] px-5 py-3.5 rounded-2xl transition-colors duration-300"
              >
                <Download size={16} strokeWidth={2.5} />
                <span>Descargar Política de Gestión</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
