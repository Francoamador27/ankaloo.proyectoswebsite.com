export default function QuienesSomos() {
  return (
    <section id="quienes-somos" className="bg-white">
      {/* Encabezado */}
      <div className="text-center py-10">
        <h2 className="text-4xl font-extrabold thea-amelia" style={{ color: '#dc834e' }}>
          ¿Quiénes Somos?
        </h2>
        <div
          className="mt-2 h-1.5 w-24 mx-auto rounded-full"
          style={{ backgroundColor: '#dc834e' }}
        />
      </div>

      {/* 2 columnas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center-start mb-20">
        {/* Izquierda: Video institucional + texto SEO */}
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-xl bg-gray-50 aspect-video transition-transform hover:scale-[1.02] duration-500">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/f6QFJUkORmQ"
              title="Vídeo Institucional RevenantTravel"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Texto SEO dentro de la misma columna */}
          <div className="text-gray-700 leading-relaxed bg-orange-50 rounded-2xl border border-orange-100 p-6 shadow-sm">
            <h4 className="text-xl font-bold text-slate-900 mb-3">Compromiso con tu Experiencia</h4>
            <p className="mb-4">
              En <strong className="text-[#dc834e]">RevenantTravel</strong>, entendemos que cada viaje es una experiencia única que merece ser memorable. Por eso, combinamos años de experiencia con asesoramiento personalizado y atención al detalle.
            </p>
            <p>
              Nuestra <strong>agencia de viajes</strong> se destaca por la calidad de nuestros servicios, la selección exclusiva de destinos y el soporte continuo durante todo tu viaje.
            </p>
          </div>
        </div>

        {/* Derecha: Descripción */}
        <aside className="md:pl-10">
          <div className="rounded-3xl border border-slate-100 shadow-lg p-8 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-0 opacity-50"></div>

            <div className="relative z-10">
              <div className="mb-6">
                <span
                  className="inline-block h-2 w-20 rounded-full"
                  style={{ backgroundColor: '#dc834e' }}
                />
              </div>



              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Somos una agencia líder especializada en crear <strong>experiencias de viaje personalizadas</strong>. Brindamos paquetes integrales a destinos únicos en el mundo, enfocándonos en tu comodidad, seguridad y satisfacción.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                Contamos con una amplia trayectoria organizando viajes que superan las expectativas de nuestros clientes. Brindamos <strong>asesoramiento sin cargo</strong> y atención personalizada para cada aventura.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Viajes personalizados",
                  "Destinos exclusivos",
                  "Asesoramiento sin cargo",
                  "Atención 24/7",
                  "Seguros incluidos",
                  "Mejores tarifas"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div
                      className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-white text-[10px]"
                      style={{ backgroundColor: '#dc834e' }}
                    >
                      ✓
                    </div>
                    <span className="text-slate-800 font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
