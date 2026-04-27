import { Link } from "react-router-dom";

export default function AnkalooHighlights() {
  const items = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-9 h-9"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      ),
      title: "Compromiso con la sustentabilidad",
      desc: "En Anka Loo trabajamos con una mirada de triple impacto en el desempeño de las tareas y procesos.",
      button: "Ver  ",
      route: "/compromiso",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-9 h-9"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>
      ),
      title: "Equipo Profesional",
      desc: "Contamos con profesionales de formación específica y personal altamente capacitado.",
      button: "Trabaja con nosotros",
      route: "/trabaja-con-nosotros",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-9 h-9"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
          />
        </svg>
      ),
      title: "Calidad Certificada",
      desc: "Certificados ISO 9001, 14001 y 45001 que garantizan nuestros estándares de calidad.",
      button: "Ver certificados",
      route: "/calidad",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-9 h-9"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
      ),
      title: "Cobertura Nacional",
      desc: "Con sede en Córdoba, trabajamos en todo el país.",
      button: "Ver sede",
      route: "/sede",
    },
  ];

  return (
    <section className="bg-slate-50 py-10 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white border border-slate-200 hover:border-[#fdce27]/40 p-8 transition-all duration-300 hover:shadow-md flex flex-col"
            >
              {/* Icono */}
              <div className="text-slate-400 group-hover:text-[#1c1c1c] transition-colors duration-300 mb-4">
                {item.icon}
              </div>

              {/* Acento dorado */}
              <div className="w-5 h-1.5 bg-[#fdce27] mb-4"></div>

              {/* Título */}
              <h3 className="text-lg font-black text-[#1c1c1c] mb-3 leading-snug">
                {item.title}
              </h3>

              {/* Descripción */}
              <p className="text-sm text-slate-500 leading-relaxed font-light">
                {item.desc}
              </p>
              {/* Botón Estilo Industrial */}
              <Link
                to={item.route}
                className="inline-flex items-center gap-2 mt-auto pt-6 opacity-70 hover:opacity-100 transition-all duration-300 hover:translate-x-1 group/btn"
              >
                <span className="text-[10px] font-black tracking-[0.15em] text-[#1c1c1c] uppercase">
                  {item.button || "Ver detalles"}
                </span>
                <div className="w-6 h-6 bg-[#fdce27] flex items-center justify-center transition-transform duration-300 group-hover/btn:scale-110">
                  <svg
                    className="w-3 h-3 text-[#1c1c1c]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
