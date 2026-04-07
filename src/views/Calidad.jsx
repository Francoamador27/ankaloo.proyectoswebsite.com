import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Loader, Award, Download, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import SEOHead from '../components/Head/Head';
import clienteAxios from '../config/axios';
import useCont from '../hooks/useCont';

const fetcher = (url) => clienteAxios.get(url).then((res) => res.data.data);

export default function Calidad() {
  const { company } = useCont();
  const { data: certificados, error, isLoading } = useSWR('/api/certificados', fetcher);

  return (
    <>
      <SEOHead
        title={`Calidad y Certificaciones - ${company.name || 'Ankaloo Construcciones'}`}
        description="Conoce nuestras certificaciones de calidad y estándares de excelencia en infraestructura."
      />

      <div className="min-h-screen bg-white py-12 lg:py-20 relative overflow-hidden">
        {/* Fondo Industrial Sutil */}
        <div className="absolute top-0 left-0 w-full h-96 bg-[#f4f4f4] -z-10 skew-y-[-2deg] origin-top-left"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-[#fdce27] rounded-full blur-3xl opacity-10 -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header de Sección */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-6 animate-fadeIn">
              <div className="h-1 w-12 bg-[#fdce27]"></div>
              <span className="text-[10px] font-black tracking-[0.4em] text-slate-400 ">Estándares de Excelencia</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-5xl font-black text-[#1c1c1c] tracking-tighter leading-none  mb-8">
              Compromiso con la Calidad
            </h1>
            <p className="max-w-7xl text-xl leading-relaxed font-light text-[#5a5a5a] animate-fadeInUp">
              En <strong>{company.name || 'Ankaloo'}</strong>, la calidad no es una opción, es nuestra base operativa. Contamos con certificaciones nacionales e internacionales que avalan cada uno de nuestros procesos constructivos.
            </p>
          </header>

          {/* Grilla de Certificados */}
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader className="w-12 h-12 text-[#fdce27] animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-2xl">
              <p className="text-slate-500 font-bold">Error al cargar las certificaciones. Intenta nuevamente más tarde.</p>
            </div>
          ) : certificados?.length === 0 ? (
            <div className="text-center py-32 bg-[#1c1c1c] rounded-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#fdce27] opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700"></div>
              <p className="text-white/40 font-black text-xs uppercase tracking-[0.3em]">No hay certificados publicados actualmente</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificados.map((cert, index) => (
                <article 
                    key={cert.id} 
                    className="relative group bg-white shadow-lg hover:shadow-2xl border border-slate-100 transition-all duration-500 animate-fadeInUp overflow-hidden rounded-3xl flex items-center justify-center p-8 lg:p-12 aspect-[4/3] sm:aspect-video md:aspect-[4/3] lg:aspect-[3/2]"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    {cert.imagen ? (
                      <img
                        src={cert.imagen}
                        alt="Certificado de Calidad"
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-sm"
                      />
                    ) : (
                      <Award className="w-20 h-20 text-slate-200" />
                    )}

                    <div className="absolute inset-0 bg-[#1c1c1c]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    {cert.documento && (
                      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex justify-end lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-500 pointer-events-none z-10">
                        <a
                          href={cert.documento}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pointer-events-auto flex items-center gap-2 bg-[#fdce27] hover:bg-[#1c1c1c] text-[#1c1c1c] hover:text-[#fdce27] text-[11px] font-black uppercase tracking-[0.15em] px-5 py-3.5 shadow-xl rounded-2xl transition-colors duration-300"
                        >
                          <Download size={16} strokeWidth={2.5} />
                          <span>Descargar Certificado</span>
                        </a>
                      </div>
                    )}
                </article>
              ))}
            </div>
          )}

          {/* Sección de Compromiso (Footer de la vista) */}
          <section className="mt-32 p-12 bg-[#1c1c1c] relative overflow-hidden rounded-[2.5rem]">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#fdce27] opacity-10 blur-[100px] -mr-32 -mt-32"></div>
             <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="max-w-xl">
                    <h4 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight mb-6">
                        Seguridad y <span className="text-[#fdce27]">Confianza</span> en cada estructura.
                    </h4>
                    <p className="text-white/60 font-light">
                        Todas nuestras certificaciones son auditadas periódicamente para garantizar que cumplimos con los requisitos más exigentes del mercado.
                    </p>
                </div>
                <div className="flex gap-8 opacity-20 filter grayscale">
                    <Award size={64} className="text-white" />
                    <ShieldCheck size={64} className="text-white" />
                    <FileText size={64} className="text-white" />
                </div>
             </div>
          </section>
        </div>
      </div>
    </>
  );
}
