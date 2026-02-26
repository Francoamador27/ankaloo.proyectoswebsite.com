import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import clienteAxios from '../config/axios';
import useCont from '../hooks/useCont';
import WhatsappHref from '../utils/WhatsappUrl';

// Componente separado que siempre renderiza Swiper para mantener consistencia de hooks
function HeroSwiper({ slides, company, contact }) {
  return (
    <Swiper
      modules={[Autoplay, EffectFade, Pagination, Navigation]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      navigation
      loop={slides.length > 1}
      className="hero-swiper w-full h-full"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={slide.id} className="h-full">
          <div className="relative w-full h-full flex items-center justify-center">
            {slide.image ? (
              <img
                src={slide.image}
                alt={slide.title || "Hero"}
                className="absolute inset-0 w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            ) : null}
            {/* Overlay con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/80 via-black/40 to-black/30" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-6xl px-6 lg:px-12 mx-auto text-center">
              <span className="inline-block mb-6 px-5 py-2 text-sm font-black tracking-wider bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 thea-amelia">
                {company?.name || "RevenantTravel"}
              </span>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black  text-white mb-8 leading-[1.1] tracking-tight">
                {slide.title}
              </h1>

              <p className="max-w-2xl mx-auto text-xl md:text-2xl text-white/80 mb-12 font-light leading-relaxed">
                {slide.description}
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href={`tel:${contact?.phone || contact?.whatsapp || ""}`}
                  className="px-10 py-5 font-black text-[#003366] bg-white rounded-2xl hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-1 active:scale-95 text-lg"
                >
                  LLAMAR AHORA
                </a>

                <a
                  href={WhatsappHref({
                    message: `Hola, me interesa saber más sobre "${slide.title}". Quisiera pedir un presupuesto.`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-5 font-black text-white border-2 border-white/60 rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all text-lg"
                >
                  WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default function HeroFeatures() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const { company, contact } = useCont();

  useEffect(() => {
    let cancelled = false;

    const fetchSlides = async () => {
      try {
        const { data } = await clienteAxios.get('/api/sliders');
        if (!cancelled && Array.isArray(data?.data) && data.data.length > 0) {
          setSlides(data.data);
        }
      } catch (error) {
        console.error('Error cargando sliders', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchSlides);
    } else {
      setTimeout(fetchSlides, 1500);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
      <style>{`
        .hero-swiper,
        .hero-swiper .swiper-wrapper,
        .hero-swiper .swiper-slide {
          width: 100% !important;
          height: 100% !important;
        }

        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: white;
          width: 48px;
          height: 48px;
          background: rgba(0,0,0,.45);
          border-radius: 9999px;
          transition: all .25s ease;
        }

        .hero-swiper .swiper-button-next:hover,
        .hero-swiper .swiper-button-prev:hover {
          background: rgba(0,0,0,.7);
          transform: scale(1.05);
        }

        .hero-swiper .swiper-button-next::after,
        .hero-swiper .swiper-button-prev::after {
          font-size: 20px;
          font-weight: bold;
        }
        
        .hero-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
        }
        
        .hero-swiper .swiper-pagination-bullet-active {
          background: #003366;
          opacity: 1;
          width: 12px;
          border-radius: 6px;
          transition: width 0.3s;
        }
      `}</style>

      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-[#dc834e]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-semibold thea-amelia">Cargando experiencias...</p>
          </div>
        </div>
      ) : slides.length > 0 ? (
        <HeroSwiper slides={slides} company={company} contact={contact} />
      ) : null}
    </section>
  );
}
