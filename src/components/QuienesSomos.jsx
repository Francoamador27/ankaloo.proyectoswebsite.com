import { PhoneIcon, BuildingOfficeIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Link } from 'react-router-dom';
import WhatsappHref from '../utils/WhatsappUrl';
import Mapa from './Mapa/Mapa';
import useCont from '../hooks/useCont';
import SEOHead from './Head/Head';

const QuienesSomos = () => {
  const { company, logoUrl, contact } = useCont();

  // JSON-LD optimizado para agencia de turismo
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": company?.name || "RevenantTravel",
    "url": window?.location?.origin || "",
    "logo": logoUrl || `${window?.location?.origin || ''}/logo.png`,
    "description": "Agencia de viajes especializada en experiencias únicas. Paquetes turísticos personalizados a los mejores destinos del mundo con asesoramiento experto.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": contact?.phone || "+54 9 351 0000000",
      "contactType": "Atención al cliente",
      "areaServed": "AR",
      "availableLanguage": ["Español"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": company?.address || "Argentina",
      "addressCountry": "AR"
    }
  };

  return (
    <section className="relative">
      <SEOHead
        title={`RevenantTravel | Agencia de Viajes y Turismo`}
        description={`Conocé RevenantTravel: especialistas en crear experiencias de viaje únicas. Paquetes turísticos personalizados a los mejores destinos del mundo.`}
      />

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-white" />

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-[#dc834e] font-black tracking-widest bg-orange-50 px-4 py-1.5 rounded-full uppercase text-xs border border-orange-100 shadow-sm">
            {company.name || "RevenantTravel"}
          </span>
          <h1 className="mt-6 text-5xl md:text-6xl font-black text-slate-900 leading-tight">
            Experiencias que transforman <br /> <span className="text-[#dc834e] thea-amelia text-6xl md:text-7xl">tu vida</span>
          </h1>
          <p className="mt-6 text-slate-600 text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Somos una agencia con años de experiencia en <strong>crear viajes inolvidables</strong>.
            Nos apasiona diseñar experiencias únicas que combinen aventura, cultura y descanso.
          </p>
        </header>

        {/* Grid principal */}
        <div className="grid md:grid-cols-5 gap-10">
          {/* Columna texto */}
          <div className="md:col-span-3">
            <section className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50"></div>

              <div className="relative z-10">
                <h2 className="text-3xl font-black text-slate-900 mb-6">Nuestra Trayectoria</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  En <strong className="text-[#dc834e]">RevenantTravel</strong>, hemos evolucionado junto a las últimas tendencias en turismo experiencial.
                  Planificamos cada detalle de tu viaje, seleccionando los mejores destinos, alojamientos exclusivos
                  y experiencias auténticas que harán de tu aventura algo verdaderamente memorable.
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-slate-100 p-6 bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-all duration-300">
                    <h3 className="font-black text-slate-900 flex items-center gap-3 mb-4">
                      <BuildingOfficeIcon className="w-6 h-6 text-[#dc834e]" />
                      Nuestro Servicio
                    </h3>
                    <ul className="text-slate-600 space-y-2 font-medium">
                      <li>• Asesoramiento personalizado</li>
                      <li>• Red de destinos exclusivos</li>
                      <li>• Paquetes a medida</li>
                      <li>• Atención 24/7 durante tu viaje</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-100 p-6 bg-gradient-to-br from-amber-50 to-white hover:shadow-lg transition-all duration-300">
                    <h3 className="font-black text-slate-900 flex items-center gap-3 mb-4">
                      <CheckBadgeIcon className="w-6 h-6 text-[#dc834e]" />
                      Garantía RevenantTravel
                    </h3>
                    <ul className="text-slate-600 space-y-2 font-medium">
                      <li>• Mejores tarifas garantizadas</li>
                      <li>• Seguro de viaje incluido</li>
                      <li>• Soporte en español 24/7</li>
                      <li>• Flexibilidad en cambios</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href={WhatsappHref({ message: "Hola, me gustaría recibir asesoramiento para planificar mi próximo viaje." })}
                    className="bg-[#dc834e] hover:bg-[#c77542] text-white px-8 py-4 rounded-xl font-black text-lg shadow-lg shadow-[#dc834e]/20 transition-all active:scale-95 hover:scale-105"
                    target="_blank"
                  >
                    🌍 ARMAR MI VIAJE
                  </a>

                  <Link
                    to="/contacto"
                    className="bg-white hover:bg-orange-50 text-slate-900 ring-2 ring-[#dc834e]/20 px-8 py-4 rounded-xl font-black text-lg transition-all"
                  >
                    📞 CONTACTO
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Columna lateral */}
          <aside className="md:col-span-2 space-y-8">
            <div className="rounded-3xl border border-slate-100 bg-white shadow-lg p-8">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Contacto Directo</h3>
              <div className="space-y-5 text-slate-700">
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">Oficinas</span>
                  <strong className="text-lg">{company.address || "Argentina"}</strong>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">Horario de Atención</span>
                  <strong className="text-lg">{company.business_hours || "Lunes a Viernes, 9 a 18hs"}</strong>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">Medios de Contacto</span>
                  <div className="flex flex-col gap-2 mt-2">
                    <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#dc834e] font-bold hover:underline">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      WhatsApp: {contact.phone}
                    </a>
                    <a href={`mailto:${contact.email}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 font-medium hover:text-[#dc834e]">
                      {contact.email || "info@revenanttravel.com"}
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8 aspect-[4/3] w-full overflow-hidden rounded-[2rem] ring-4 ring-slate-50 shadow-inner">
                <Mapa />
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-[#dc834e] to-amber-700 p-8 text-white relative overflow-hidden group shadow-xl">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
              <h3 className="text-xl font-black mb-4 flex items-center gap-2 relative z-10">
                <span className="text-amber-200">✨</span> Nuestro Compromiso
              </h3>
              <p className="text-white/95 leading-relaxed font-medium relative z-10">
                En RevenantTravel no solo vendemos paquetes, creamos <strong>experiencias transformadoras</strong>. Entendemos que cada viaje es una oportunidad única para crear recuerdos inolvidables.
              </p>
            </div>
          </aside>
        </div>

        {/* CTA final */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-white border border-[#dc834e]/20 p-8 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-black text-slate-900">
                ¿Planeás un viaje grupal o corporativo?
              </h4>
              <p className="text-slate-600 font-medium">
                Consultanos por paquetes especiales para grupos, empresas e incentivos.
              </p>
            </div>
            <a
              href={WhatsappHref({ message: "Hola, me interesa informaci\u00f3n sobre viajes grupales o corporativos." })}
              className="bg-[#dc834e] text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform whitespace-nowrap hover:bg-[#c77542]"
            >
              VIAJES GRUPALES
            </a>
          </div>
        </div>
      </div>

      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
};

export default QuienesSomos;
