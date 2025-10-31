import { PhoneIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Link } from 'react-router-dom';
import WhatsappHref from '../utils/WhatsappUrl';
import Mapa from './Mapa/Mapa';
import useCont from '../hooks/useCont';
import SEOHead from './Head/Head';

const QuienesSomos = () => {
  // JSON-LD para SEO (Dentist / LocalBusiness)
  const { company, logoUrl, contact } = useCont();
  console.log({ company, logoUrl, contact });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": "Mint Odontología",
    "image": `${window?.location?.origin || ''}/og-mint.jpg`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "24 de Septiembre 842",
      "addressLocality": "Córdoba",
      "addressRegion": "Córdoba",
      "postalCode": "5000",
      "addressCountry": "AR"
    },
    "url": window?.location?.origin || "",
    "openingHours": "Mo-Fr 09:00-18:00",
    "priceRange": "$$",
    "description": "Clínica odontológica en Córdoba: odontología general, estética dental, ortodoncia, implantes y urgencias. Turnos online."
  };

  return (
    <section className="relative">
      <SEOHead
        title={`${company.name} | Conocé más sobre nosotros`}
        description={`Descubrí quiénes somos en ${company.name}. Un equipo de profesionales dedicados a cuidar tu sonrisa en ${company.address ?? ""}.`}
      />
      {/* Fondo suave y halo para foco visual */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-white to-[#F5FBFE]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_at_top,_rgba(0,141,210,0.08),_transparent_60%)]" />

      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Header */}
        <header className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[#008DD2] font-medium tracking-wide bg-[#EAF7FD] px-3 py-1 rounded-full">
            {company.name && <>{company.name} </>}
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            ¿Quiénes <span className="text-[#008DD2]">somos</span>?
          </h1>
          <p className="mt-4 text-slate-600 text-lg max-w-3xl mx-auto">
            En <strong>{company.name && <>{company.name} </>}</strong> cuidamos tu sonrisa con un enfoque
            humano y tecnología moderna. Ofrecemos <em>odontología general</em>,
            <em> estética dental</em>, <em>ortodoncia</em>, <em>implantes</em> y
            <em> urgencias</em> de lunes a viernes, en el corazón de Córdoba Capital.
          </p>
        </header>

        {/* Grid principal: texto + datos */}
        <div className="grid md:grid-cols-5 gap-8">
          {/* Columna texto */}
          <div className="md:col-span-3">
            <section className="bg-white/90 backdrop-blur rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900">Nuestra esencia</h2>
              <p className="mt-3 text-slate-600">
                Nacimos con una misión clara: brindar una experiencia odontológica cercana,
                clara y previsible. Combinamos protocolos de <strong>bioseguridad</strong>,
                materiales de <strong>primera línea</strong> y planes de tratamiento
                personalizados para lograr resultados estéticos y funcionales que perduren.
              </p>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-100 p-4 bg-white">
                  <h3 className="font-semibold text-slate-900">Tratamientos</h3>
                  <ul className="mt-2 text-slate-600 space-y-1 list-disc list-inside">
                    <li>Odontología general &amp; preventiva</li>
                    <li>Estética: blanqueamiento y carillas</li>
                    <li>Ortodoncia (convencional y alineadores)</li>
                    <li>Implantes y prótesis</li>
                    <li>Urgencias odontológicas</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-slate-100 p-4 bg-white">
                  <h3 className="font-semibold text-slate-900">Por qué elegirnos</h3>
                  <ul className="mt-2 text-slate-600 space-y-1 list-disc list-inside">
                    <li>Atención cálida y explicaciones claras</li>
                    <li>Diagnóstico digital y planificación</li>
                    <li>Protocolos de esterilización certificados</li>
                    <li>Materiales y laboratorios de calidad</li>
                    <li>Turnos online y recordatorios</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href={WhatsappHref({ message: "Hola, necesito turno para odontologia" })}
                  className="bg-white/95 hover:bg-white text-[#008DD2] ring-1 ring-[#008DD2]/20 px-6 py-3 rounded-md font-semibold shadow-sm transition"
                  target='_blank'
                >
                  📅 Reservar turno
                </a >

                <a href={`tel:${contact.phone || ''}`}
                  className="bg-white/80 hover:bg-white text-slate-800 ring-1 ring-slate-200 px-6 py-3 rounded-md font-semibold shadow-sm transition flex items-center gap-2"
                >
                  <PhoneIcon className="h-5 w-5" />
                  Llamar
                </a>

                <Link
                  to="/contacto"
                  className="bg-transparent hover:bg-white/70 text-slate-800 ring-1 ring-white/60 backdrop-blur px-6 py-3 rounded-md font-semibold shadow-sm transition"
                >
                  📍 ¿Cómo llegar?
                </Link>

              </div>
            </section>
          </div>

          {/* Columna info local / SEO local */}
          <aside className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-white/90 backdrop-blur shadow-sm p-6">
              <h3 className="text-xl font-bold text-slate-900">Datos del consultorio</h3>
              <div className="mt-4 space-y-3 text-slate-700">
                <p>
                  <span className="block text-slate-500 text-sm">Dirección</span>
                  <strong>{`${company.address || ''}`}</strong><br />
                </p>
                <p>
                  <span className="block text-slate-500 text-sm">Horarios</span>
                  <strong>{`${company.business_hours || ''}`}</strong>
                </p>
                <div>
                  <span className="block text-slate-500 text-sm">Turnos</span>
                  <div className="flex flex-col gap-1">
                    <span>
                      Escribinos por WhatsApp.{" "}
                      <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                        Iniciar chat
                      </a>
                    </span>
                    <span>
                      Vía Email.{" "}
                      <a href={`mailto:${contact.email}`} target="_blank" rel="noopener noreferrer">
                        {contact.email || ""}
                      </a>
                    </span>
                  </div>
                </div>

              </div>

              <div className="mt-5 aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-slate-100">
                <Mapa />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/90 backdrop-blur shadow-sm p-6">
              <h3 className="text-xl font-bold text-slate-900">Enfocados en tu experiencia</h3>
              <p className="mt-2 text-slate-600">
                Optimizamos cada etapa: <strong>diagnóstico claro</strong>,
                <strong> tiempos de atención razonables</strong> y
                <strong> seguimiento post-tratamiento</strong>. Nuestra prioridad es que te sientas
                seguro, informado y acompañado.
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
                <li className="rounded-lg bg-[#EAF7FD] text-[#005e88] px-3 py-2">Bioseguridad</li>
                <li className="rounded-lg bg-[#EAF7FD] text-[#005e88] px-3 py-2">Odontología estética</li>
                <li className="rounded-lg bg-[#EAF7FD] text-[#005e88] px-3 py-2">Ortodoncia</li>
                <li className="rounded-lg bg-[#EAF7FD] text-[#005e88] px-3 py-2">Implantes</li>
              </ul>
            </div>
          </aside>
        </div>

        {/* FAQ breve con keywords para SEO */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">Preguntas frecuentes</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-100 bg-white p-5">
              <h3 className="font-semibold text-slate-900">
                ¿Atienden urgencias odontológicas en Córdoba?
              </h3>
              <p className="mt-2 text-slate-600">
                Sí, brindamos atención de urgencia en días hábiles. Para disponibilidad y horarios,
                solicitá turno online o contactanos por WhatsApp.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white p-5">
              <h3 className="font-semibold text-slate-900">
                ¿Ofrecen estética dental (carillas y blanqueamiento)?
              </h3>
              <p className="mt-2 text-slate-600">
                Realizamos <strong>blanqueamiento</strong> y <strong>carillas</strong> con planificación
                digital para resultados naturales y predecibles.
              </p>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-slate-800 font-medium">
              ¿Listo para agendar tu consulta en Mint Odontología?
            </span>
            <Link
              to="/contacto"
              className="inline-flex items-center rounded-lg bg-[#008DD2] text-white px-5 py-2.5 font-semibold shadow-sm hover:bg-[#0079AF] transition"
            >
              Reservar turno
            </Link>
          </div>
        </div>
      </div>

      {/* JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
};

export default QuienesSomos;
