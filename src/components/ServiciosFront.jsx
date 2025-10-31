import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WhatsappHref from '../utils/WhatsappUrl';
import useSWR from 'swr';
import clienteAxios from '../config/axios';
import Mapa from './Mapa/Mapa';
import SEOHead from './Head/Head';
import useCont from '../hooks/useCont';

export default function ServiciosFront() {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [serviciosApi, setServiciosApi] = useState([]);

  // ---- SWR ----
  const fetcher = (url) => clienteAxios(url).then((res) => res.data);
  const { data, error, isLoading } = useSWR('/api/servicios', fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  // ---- Cargar a state + loguear ----
  useEffect(() => {
    if (!data) return;
    // Si es paginador Laravel: { data: [...] }, si no: [...]
    const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    setServiciosApi(items);
  }, [data]);

  // ---- Animaciones al entrar en viewport ----
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(entry.target.dataset.index));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Re-observar cuando cambia la lista
    const cards = document.querySelectorAll('[data-index]');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [serviciosApi]);

  // ---- Fallback estático (si la API no trae nada) ----
  const serviciosFallback = [
    { icon: '🦷', titulo: 'Odontología General', descripcion: 'Diagnóstico integral, tratamiento de caries con técnicas mínimamente invasivas y restauraciones estéticas con resinas de última generación. Atención personalizada en Córdoba.', keywords: 'caries, empastes, restauraciones dentales córdoba', highlight: 'Resinas estéticas duraderas' },
    { icon: '✨', titulo: 'Estética Dental', descripcion: 'Blanqueamiento profesional LED, carillas de porcelana y contorneado dental. Diseño de sonrisa digital para resultados naturales y armónicos en Córdoba.', keywords: 'blanqueamiento dental, carillas, diseño sonrisa córdoba', highlight: 'Sonrisa perfecta' },
    { icon: '🪥', titulo: 'Prevención e Higiene', descripcion: 'Profilaxis profesional, selladores de fisuras y aplicación de flúor. Programa integral de educación bucodental para toda la familia en Córdoba.', keywords: 'limpieza dental, prevención, higiene bucal córdoba', highlight: 'Prevención es salud' },
    { icon: '🧭', titulo: 'Ortodoncia Avanzada', descripcion: 'Ortodoncia invisible con alineadores transparentes, brackets estéticos y planificación digital 3D. Corrección de mordida y alineación dental en Córdoba.', keywords: 'ortodoncia invisible, brackets, alineadores córdoba', highlight: 'Tecnología 3D' },
    { icon: '⚙️', titulo: 'Implantes y Prótesis', descripcion: 'Implantes dentales de titanio, prótesis fijas y removibles. Rehabilitación oral completa con tecnología de vanguardia y garantía extendida en Córdoba.', keywords: 'implantes dentales, prótesis dental córdoba', highlight: 'Solución definitiva' },
    { icon: '🩺', titulo: 'Endodoncia Especializada', descripcion: 'Tratamientos de conducto con microscopio dental y técnicas rotatorias. Salvamos tus dientes naturales eliminando el dolor de forma definitiva.', keywords: 'endodoncia, tratamiento conducto córdoba', highlight: 'Sin dolor garantizado' },
    { icon: '👶', titulo: 'Odontopediatría', descripcion: 'Atención dental especializada para niños y adolescentes. Ambiente lúdico, técnicas adaptadas y educación preventiva para una sonrisa saludable desde pequeños.', keywords: 'dentista niños, odontopediatría córdoba', highlight: 'Ambiente amigable' },
    { icon: '⏱️', titulo: 'Urgencias Dentales 24/7', descripcion: 'Atención inmediata para dolor dental, fracturas y emergencias. Servicio de guardia con respuesta rápida para resolver crisis agudas en Córdoba.', keywords: 'urgencias dentales, emergencia dental córdoba', highlight: 'Respuesta inmediata' },
  ];

  // Si la API trae algo, usamos eso; si no, fallback
  const servicios = (serviciosApi?.length ? serviciosApi : serviciosFallback).map((s) => ({
    // Normalizamos campos posibles del backend
    icon: s.icon ?? '🦷',
    titulo: s.titulo ?? s.title ?? 'Servicio',
    descripcion: s.descripcion ?? s.description ?? '',
    keywords: s.keywords ?? '',
    highlight: s.highlight ?? s.tagline ?? '',
    slug: s.slug,
    // opcional: imagen si tu API la tiene (s.image)
    image: s.image ?? null,
  }));
  const { auth, company } = useCont();

  return (

    <section className="relative bg-gradient-to-br from-[#fefbf5] via-white to-[#f8f9fa] py-20 px-6 lg:px-20 overflow-hidden">
      <SEOHead

          priority="low"  // ← Baja prioridad
        title={`${company.name} | Servicios odontológicos de calidad en ${company.address ?? ""}`}
        description={`Descubrí los servicios odontológicos que ofrecemos en ${company.name}. Atención integral, tecnología avanzada y un equipo de expertos para cuidar tu sonrisa en ${company.address ?? ""}.`}
      />
      {/* BG decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#8cb9ce] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#a8d0e0] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#8cb9ce] rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#8cb9ce]/10 px-4 py-2 rounded-full text-[#8cb9ce] font-medium text-sm mb-4">
            <span className="w-2 h-2 bg-[#8cb9ce] rounded-full animate-pulse"></span>
            Consultorio Odontológico en Córdoba
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Servicios Odontológicos
            <span className="block text-[#8cb9ce] text-2xl lg:text-3xl font-light mt-2">
              de Excelencia
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Atención dental integral con tecnología avanzada y más de 15 años de experiencia
            cuidando sonrisas en Córdoba. Tu salud bucodental en manos expertas.
          </p>
          <div className="mt-6 h-1 w-32 rounded-full mx-auto bg-gradient-to-r from-[#8cb9ce] to-[#a8d0e0]"></div>
        </div>

        {/* Estado de carga / error */}
        {isLoading && (
          <div className="text-center text-slate-500 mb-8">Cargando servicios…</div>
        )}
        {error && (
          <div className="text-center text-red-600 mb-8">No se pudieron cargar los servicios.</div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {servicios.map((item, idx) => (
            <div
              key={idx}
              data-index={idx}
              className={`group relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 
                hover:bg-white hover:shadow-2xl hover:border-[#8cb9ce]/20 
                transform transition-all duration-500 hover:-translate-y-2
                ${visibleCards.has(String(idx))
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {/* BG gradiente hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8cb9ce]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Badge */}
              {item.highlight && (
                <div className="absolute -top-3 -right-3 bg-[#8cb9ce] text-white text-xs px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                  {item.highlight}
                </div>
              )}

              <div className="relative z-10">
                {/* Icono o imagen */}
                <div className="flex items-center justify-center w-16 h-16 bg-[#8cb9ce]/10 rounded-2xl mb-4 group-hover:bg-[#8cb9ce]/20 transition-colors duration-300 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.titulo} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </span>
                  )}
                </div>

                {/* Contenido */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#8cb9ce] transition-colors duration-300">
                  {item.titulo}
                </h3>
<p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
  {item.descripcion}
</p>

                {/* Keywords SEO (screen-reader only) */}
                {item.keywords && <span className="sr-only">{item.keywords}</span>}

                {/* Indicador hover */}
                <div className="flex items-center text-[#8cb9ce] text-sm font-medium  group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <Link to={`/servicios/${item.slug}`}>Más información</Link>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="flex flex-wrap gap-4 justify-center items-center">


            <a
              href={WhatsappHref({ message: "Hola, necesito turno para odontologia" })}
              className="bg-white/95 hover:bg-white text-[#008DD2] ring-1 ring-[#008DD2]/20 px-6 py-3 rounded-md font-semibold shadow-sm transition"
              target="_blank"
              rel="noreferrer"
            >
              📅 Reservar turno
            </a>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>
              📍 <strong>Consultorio odontológico en Córdoba Capital</strong> |
              ⏰ <strong>Turnos disponibles</strong> |
              🏆 <strong>+15 años de experiencia</strong>
            </p>
          </div>
        </div>

        {/* Schema SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DentalClinic",
              "name": "Consultorio Odontológico Córdoba",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Córdoba",
                "addressCountry": "Argentina"
              },
              "medicalSpecialty": servicios.map(s => s.titulo),
              "availableService": servicios.map(servicio => ({
                "@type": "MedicalProcedure",
                "name": servicio.titulo,
                "description": servicio.descripcion
              }))
            })
          }}
        />
      </div>
    </section>
  );
}
