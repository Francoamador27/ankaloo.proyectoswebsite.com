import { CalendarDaysIcon, ShieldCheckIcon, HeartIcon, PhoneIcon } from '@heroicons/react/24/outline'
import Gallery from './ServiciosFront'
import { Link } from 'react-router-dom'
import backgroundD from '../assets/img/fondo-mint.png';
import Popup from './PopUp';
import WhatsappHref from '../utils/WhatsappUrl';
import SEOHead  from "./Head/Head.jsx";
import useCont from "../hooks/useCont";
const features = [
  {
    name: 'Turnos online',
    description:
    'Reservá tu consulta através de Whatsapp en minutos .',
    icon: CalendarDaysIcon,
  },
  {
    name: 'Atención segura',
    description:
    'Protocolos de bioseguridad, esterilización certificada y materiales de primera línea.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Cuidado integral',
    description:
    'Odontología general, estética, ortodoncia y urgencias, todo en un mismo lugar.',
    icon: HeartIcon,
  },
]

export default function FeatureSection() {
  return (
    <>

      <div
        className="relative pt-24 px-6 text-left min-h-screen"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,.92), rgba(255,255,255,.65), rgba(255,255,255,.15)), url(${backgroundD})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Contenedor centrado para limitar ancho y mantener el "look" blanco sobre el fondo */}
        <div className="max-w-5xl mx-auto">
          <h1 className="font-bold titulo-principal leading-tight mb-4 text-slate-900">
            <span className="text-slate-900">Mint</span>{' '}
            <span className="text-slate-700">Odontología</span><br />
            <span className="text-slate-800">Sonrisas</span> que inspiran{' '}
            <span className="text-[#008DD2]">confianza</span>
          </h1>

          <p className="text-lg description-principal mb-6 text-slate-700">
            Cuidamos tu salud bucal con tecnología moderna y un trato cercano.
            Tratamientos estéticos, ortodoncia, implantes y más — pensados para vos.
          </p>

          <div className="flex flex-wrap gap-3">
            {/* Primario claro sobre fondo celeste */}
            <a href={WhatsappHref({ message: "Hola, necesito turno para odontologia" })}
              to="/turnos"
              className="bg-white/95 hover:bg-white text-[#008DD2] ring-1 ring-[#008DD2]/20 px-6 py-3 rounded-md font-semibold shadow-sm transition"
            target='_blank'
            >
              📅 Reservar turno
            </a >

                  <a href='tel:3517699950'
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

          {/* Features en "glass white" para integrarse con el fondo */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="bg-white/85 backdrop-blur-md rounded-xl p-5 shadow-sm ring-1 ring-white/60"
              >
                <div className="flex items-start gap-3">
                  <feature.icon className="h-8 w-8 text-[#008DD2]" aria-hidden="true" />
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{feature.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Opcional: galería */}
          {/* <div id="galeria" className="mt-12">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Antes y después</h2>
            <Gallery />
          </div> */}
        </div>
      </div>
    </>
  )
}