import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Leaf, Users, ShieldCheck, MapPin } from "lucide-react";

export default function AnkalooHighlights() {
  const cardRefs = useRef([]);
  const titleRef = useRef(null);

  useEffect(() => {
    const titleEl = titleRef.current;
    const titleObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          titleEl.classList.add("visible");
          titleObserver.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    if (titleEl) titleObserver.observe(titleEl);

    const observers = cardRefs.current.filter(Boolean).map((card) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            card.classList.add("visible");
            observer.disconnect();
          }
        },
        { threshold: 0.25 },
      );
      observer.observe(card);
      return observer;
    });
    return () => {
      titleObserver.disconnect();
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const items = [
    {
      icon: <Leaf size={36} strokeWidth={1.5} className="text-green-500" />,
      title: "Compromiso con la sustentabilidad",
      desc: "Trabajamos con una mirada de triple impacto en el desempeño de las tareas y procesos.",
      button: "Ver ",
      route: "/compromiso",
    },
    {
      icon: <Users size={36} strokeWidth={1.5} className="text-blue-500" />,
      title: "Nuestra Gente",
      desc: " Formamos un equipo comprometido, profesional y colaborativo, que trabaja con responsabilidad y vocación de mejora continua para generar valor en cada proyecto que hacemos.",
      button: "Ver",
      route: "/quienes-somos",
    },
    {
      icon: (
        <ShieldCheck size={36} strokeWidth={1.5} className="text-orange-500" />
      ),
      title: "Calidad Certificada",
      desc: "Certificados ISO 9001, 14001 y 45001 que garantizan nuestros estándares de calidad.",
      button: "Ver ",
      route: "/calidad",
    },
  ];

  return (
    <section className="bg-slate-50 py-20 px-6 lg:px-20">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .highlight-card {
          opacity: 0;
        }
        .highlight-card.visible {
          animation: fadeSlideUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .anim-title { opacity: 0; }
        .anim-title.visible {
          animation: fadeSlideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
      <h2
        ref={titleRef}
        className="anim-title text-4xl lg:text-6xl font-black text-[#1c1c1c] mb-6 tracking-tight text-center"
      >
        Nuestro <span className="text-[#fdce27]">Diferencial</span>
      </h2>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, idx) => (
            <div
              key={idx}
              ref={(el) => (cardRefs.current[idx] = el)}
              className="highlight-card group bg-white border border-slate-200 hover:border-[#fdce27]/40 p-8 transition-all duration-300 hover:shadow-md flex flex-col"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              {/* Icono */}
              <div className="mb-4">{item.icon}</div>

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
