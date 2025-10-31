import GaleriaSwiper from './GaleriaSwiper';

export default function ComoComprar() {
  return (
    <section id="como-comprar" className="bg-white">
      {/* Encabezado */}
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold" style={{ color: '#8cb9ce' }}>
          Quienes Somos?
        </h2>
        <div className="mt-2 h-1 w-20 mx-auto rounded-full" style={{ backgroundColor: '#8cb9ce' }} />
      </div>

      {/* 2 columnas en desktop, stacked en mobile */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Izquierda: Galería (sin textos/títulos dentro) */}
        <div>
          <GaleriaSwiper size="large" />
        </div>

        {/* Derecha: Descripción del consultorio */}
        <aside className="md:pl-6">
          <div className="rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="mb-4">
              <span
                className="inline-block h-2 w-16 rounded-full"
                style={{ backgroundColor: '#8cb9ce' }}
              />
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Mint Odontología
            </h3>

            <p className="text-gray-600 leading-relaxed mb-4">
              Somos un equipo enfocado en brindar una experiencia odontológica
              cálida, precisa y moderna. Combinamos tecnología de última
              generación con un trato cercano para que cada visita sea cómoda y
              segura.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              Nuestro consultorio está diseñado para tu bienestar: espacios
              luminosos, esterilización certificada y protocolos de atención
              pensados para pacientes de todas las edades. Nos guía un enfoque
              preventivo y estético para lograr sonrisas sanas y naturales.
            </p>

            {/* Píldoras de valor */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: '#8cb9ce' }}
                />
                <span className="text-gray-700">Equipamiento digital</span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: '#8cb9ce' }}
                />
                <span className="text-gray-700">Esterilización certificada</span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: '#8cb9ce' }}
                />
                <span className="text-gray-700">Odontología estética</span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: '#8cb9ce' }}
                />
                <span className="text-gray-700">Atención para toda la familia</span>
              </li>
            </ul>

            {/* Separador sutil */}
            <div className="my-6 h-px bg-gray-100" />

            {/* Mini “stats”/confianza */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold" style={{ color: '#8cb9ce' }}>
                  +500
                </div>
                <div className="text-xs text-gray-500">Pacientes</div>
              </div>
              <div>
                <div className="text-xl font-bold" style={{ color: '#8cb9ce' }}>
                  5+
                </div>
                <div className="text-xs text-gray-500">Años de experiencia</div>
              </div>
              <div>
                <div className="text-xl font-bold" style={{ color: '#8cb9ce' }}>
                  5★
                </div>
                <div className="text-xs text-gray-500">Valoraciones</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
