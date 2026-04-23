import {
  PhoneIcon,
  BuildingOfficeIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import useSWR from "swr";
import clienteAxios from "../config/axios";
import WhatsappHref from "../utils/WhatsappUrl";
import Mapa from "./Mapa/Mapa";
import useCont from "../hooks/useCont";
import SEOHead from "./Head/Head";
import MagicBento from "./MagicBento";
import lineasIzq from "../assets/lineasamarillasizq.png";
import lineasDer from "../assets/lineasamarillasder.png";

const fetcher = (url) => clienteAxios(url).then((res) => res.data);

// Carga perezosa del componente 3D pesado
const Lanyard = lazy(() => import("./Lanyard"));
const QuienesSomos = () => {
  const { company, logoUrl, contact } = useCont();
  const { data: brochureData } = useSWR("/api/brochure", fetcher, {
    revalidateOnFocus: false,
  });
  const brochure = brochureData?.data ?? null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: company?.name || "Anka Loo Construcciones",
    url: window?.location?.origin || "",
    logo: logoUrl || `${window?.location?.origin || ""}/logo.png`,
    description:
      "Empresa constructora de Córdoba especializada en obras hidráulicas, viales, saneamiento y ambientales. Profesionales con maquinaria y tecnología de última generación.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contact?.phone || "+54 9 351 0000000",
      contactType: "Consultas de Obra",
      areaServed: "AR",
      availableLanguage: ["Español"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: company?.address || "Córdoba, Argentina",
      addressCountry: "AR",
    },
  };

  return (
    <section className="relative overflow-hidden">
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
      <SEOHead
        title={`Anka Loo Construcciones | Obras Hidráulicas, Viales y Saneamiento en Córdoba`}
        description={`Anka Loo Construcciones: empresa constructora de Córdoba especializada en obras hidráulicas, viales, saneamiento y ambientales. Calidad, experiencia y tecnología de vanguardia en cada proyecto.`}
      />

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-white" />

      <div className="relative z-10 max-w-6xl px-6 py-20 mx-auto">
        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl text-slate-900">
            Quienes<span className="text-[#fdce27]"> Somos</span>
          </h1>
          <p className="max-w-3xl mx-auto mt-6 text-xl font-light leading-relaxed text-slate-600">
            Somos una empresa constructora de <strong>Córdoba</strong>{" "}
            especializada en obras de infraestructura. Brindamos servicios de
            calidad basados en el conocimiento y la experiencia en{" "}
            <strong>técnicas constructivas de vanguardia</strong>.
          </p>
        </header>

        {/* Historia */}
        <div className="max-w-4xl p-8 mx-auto mb-16 bg-white border shadow-lg border-slate-100 rounded-3xl">
          <h2 className="mb-4 text-2xl font-black text-slate-900">Historia</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            Anka Loo se constituye formalmente en 2006, a partir de la
            trayectoria iniciada en 1976 por{" "}
            <strong>Marcelo Indalecio Boidi</strong> en el sector de la
            construcción. Su desarrollo independiente se caracterizó por una
            sólida gestión operativa y presencia en obra.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            En la actualidad somos una empresa especializada en servicios de
            infraestructura vial, hidráulica, de saneamiento y ambiental, que
            brinda soluciones de calidad. Nuestro diferencial está en la gestión
            de nuestra gente y en la incorporación de tecnología que nos permite
            cumplir plazos, optimizar costos y construir relaciones a largo
            plazo con nuestros clientes. En{" "}
            <strong className="text-[#fdce27]">Anka Loo</strong> trabajamos
            priorizando el bienestar de las personas, la rentabilidad y la
            sostenibilidad ambiental, contribuyendo al desarrollo integral de la
            comunidad.
          </p>
          {brochure && (
            <div className="mt-6">
              <a
                href={brochure.archivo}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#fdce27] text-slate-900 font-bold px-6 py-3 rounded-xl hover:brightness-90 transition-all"
              >
                <Download size={18} />
                Descargar brochure en PDF
              </a>
            </div>
          )}
        </div>

        {/* Grid principal */}
        <div className="grid gap-10 md:grid-cols-5">
          {/* Columna texto */}
          <div className="md:col-span-3">
            <section className="relative p-8 overflow-hidden bg-white border shadow-xl rounded-3xl border-slate-100 md:p-12">
              {/* Lanyard 3D Animation Background */}
              <div className="absolute inset-0 overflow-hidden -z-10 h-96 rounded-3xl bg-slate-50/50">
                <Suspense
                  fallback={
                    <div className="flex flex-col items-center justify-center w-full h-full opacity-50">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-[#fdce27] mb-2"></div>
                      <span className="text-xs font-bold tracking-widest uppercase text-slate-400">
                        Cargando 3D...
                      </span>
                    </div>
                  }
                >
                  <Lanyard />
                </Suspense>
              </div>
              <div className="relative z-10">
                <h2 className="mb-6 text-3xl font-black text-slate-900">
                  Nuestra Misión
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-slate-600">
                  En{" "}
                  <strong className="text-[#fdce27]">
                    Anka Loo Construcciones
                  </strong>
                  , nuestro objetivo primario es brindar a nuestros clientes
                  servicios de alta calidad, poniendo a su disposición
                  profesionales de formación específica, maquinarias y
                  tecnología de última generación. Este formato de eficiencia
                  comprobada permite alcanzar excelentes resultados bajando
                  significativamente los costos operativos.
                </p>
                {company?.imagen_corporativa && (
                  <div className="relative w-full h-80 md:h-[400px] mt-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src={
                        company.imagen_corporativa.startsWith("http")
                          ? company.imagen_corporativa
                          : `${import.meta.env.VITE_API_URL}/${company.imagen_corporativa}`
                      }
                      alt="Equipo e Infraestructura Anka Loo"
                      className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Columna lateral */}
          <aside className="space-y-8 md:col-span-2">
            <div className="p-8 bg-white border shadow-lg rounded-3xl border-slate-100">
              <h3 className="mb-6 text-2xl font-black text-slate-900">
                Contacto
              </h3>
              <div className="space-y-5 text-slate-700">
                <div>
                  <span className="block mb-1 text-xs font-bold tracking-widest text-slate-400">
                    Oficinas
                  </span>
                  <strong className="text-lg">
                    {company.address || "Argentina"}
                  </strong>
                </div>
                <div>
                  <span className="block mb-1 text-xs font-bold tracking-widest text-slate-400">
                    Horario
                  </span>
                  <strong className="text-lg">
                    {company.business_hours || "Lunes a Viernes, 9 a 18hs"}
                  </strong>
                </div>
                <div>
                  <span className="block mb-1 text-xs font-bold tracking-widest text-slate-400">
                    Medios de Contacto
                  </span>
                  <div className="flex flex-col gap-2 mt-2">
                    {contact.whatsapp && (
                      <a
                        href={`https://wa.me/${contact.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#fdce27] font-bold hover:underline"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        WhatsApp: {contact.phone}
                      </a>
                    )}
                    <a
                      href={`mailto:${contact.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 font-medium hover:text-[#fdce27]"
                    >
                      {contact.email || "info@ankaloo.com"}
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8 aspect-[4/3] w-full overflow-hidden rounded-[2rem] ring-4 ring-slate-50 shadow-inner">
                <Mapa />
              </div>
            </div>
          </aside>
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
