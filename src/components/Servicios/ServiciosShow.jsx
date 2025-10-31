import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import clienteAxios from "../../config/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import SEOHead from "../Head/Head";

const ACCENT = "#8cb9ce";
const isImageUrl = (url = "") =>
  /\.(jpe?g|png|webp|gif|bmp|svg)(\?.*)?$/i.test(url || "");

const HeroSkeleton = () => (
  <div className="rounded-2xl border border-gray-200 bg-white">
    <div className="animate-pulse p-6">
      <div className="h-6 w-64 rounded bg-gray-200 mb-3" />
      <div className="h-10 w-96 rounded bg-gray-200 mb-4" />
      <div className="aspect-video w-full rounded-xl bg-gray-200" />
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="h-full">
    <div className="relative h-full min-h-[220px] rounded-2xl border border-gray-200 bg-white p-4 overflow-hidden">
      <div className="animate-pulse">
        <div className="aspect-video w-full rounded-xl bg-gray-200" />
      </div>
    </div>
  </div>
);

export default function ServiciosShow() {
  const token = localStorage.getItem("AUTH_TOKEN");
  const { slug, idOrSlug, id } = useParams();
  const param = slug || idOrSlug || id;

  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchServicio = async () => {
      if (!param) return;
      setLoading(true);
      setErr(null);
      try {
        const { data } = await clienteAxios.get(
          `/api/servicios/${encodeURIComponent(param)}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        setServicio(data?.data ?? null);
      } catch (e) {
        console.error("Error cargando servicio", e);
        setErr("No se pudo cargar el servicio.");
      } finally {
        setLoading(false);
      }
    };
    fetchServicio();
  }, [param, token]);

  useEffect(() => {
    if (servicio?.title) {
      document.title = `${servicio.title} • Servicios`;
    }
  }, [servicio]);

  const tags = useMemo(() => {
    const t = servicio?.tags;
    if (Array.isArray(t)) return t;
    if (typeof t === "string") {
      return t
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }
    return [];
  }, [servicio]);

  const features = useMemo(() => {
    const f = servicio?.features;
    if (Array.isArray(f)) return f;
    if (typeof f === "string") {
      try {
        const parsed = JSON.parse(f);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [servicio]);

  const gallery = useMemo(() => {
    if (Array.isArray(servicio?.gallery_urls) && servicio.gallery_urls.length) {
      return servicio.gallery_urls;
    }
    if (Array.isArray(servicio?.gallery)) {
      return servicio.gallery.map((g) =>
        g?.startsWith("http")
          ? g
          : `${window.location.origin}/${g.replace(/^\/+/, "")}`
      );
    }
    return [];
  }, [servicio]);

  const mainHero =
    servicio?.mainImage_url ||
    servicio?.image_url ||
    (isImageUrl(servicio?.image) ? servicio?.image : null);

  const slides = useMemo(() => {
    const arr = [];
    if (mainHero) arr.push(mainHero);
    (gallery || []).forEach((g) => {
      if (g && !arr.includes(g)) arr.push(g);
    });
    return arr;
  }, [mainHero, gallery]);

  const extraSlides = slides.slice(1);

  // 💡 Descripción (acepta `description` o `descripcion`)
  const descripcion = useMemo(() => {
    const d = servicio?.description ?? servicio?.descripcion ?? "";
    return (typeof d === "string" ? d.trim() : "") || "";
  }, [servicio]);

  return (
    <section className="bg-white text-gray-800">
<SEOHead
  title={`${servicio?.title || "Servicios"} | Servicios odontológicos`}
  description={servicio?.description || "Descubrí nuestros servicios odontológicos."}
/>

      {/* Contenedor principal (breadcrumbs + título) */}
      <div className="mx-auto max-w-7xl px-6 pt-10">
        <nav className="mb-4 text-sm">
          <Link to="/" className="hover:underline" style={{ color: ACCENT }}>
            Inicio
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/servicios" className="hover:underline" style={{ color: ACCENT }}>
            Servicios
          </Link>
          {servicio?.title && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">{servicio.title}</span>
            </>
          )}
        </nav>

        {loading ? (
          <HeroSkeleton />
        ) : err ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 mb-10">
            <h2 className="text-xl font-semibold text-red-700">Error</h2>
            <p className="text-red-600 mt-2">{err}</p>
            <div className="mt-4">
              <Link
                to="/servicios"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2"
                style={{ backgroundColor: ACCENT, color: "white" }}
              >
                ← Volver a servicios
              </Link>
            </div>
          </div>
        ) : !servicio ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-10">
            <h2 className="text-xl font-semibold">No encontrado</h2>
            <p className="text-gray-600 mt-2">El servicio solicitado no existe.</p>
            <div className="mt-4">
              <Link
                to="/servicios"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2"
                style={{ backgroundColor: ACCENT, color: "white" }}
              >
                ← Volver a servicios
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Título justo debajo de las migas */}
            <h1
              className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-6"
              style={{ color: ACCENT }}
            >
              {servicio.title}
            </h1>
          </>
        )}
      </div>

      {/* 🔒 Galería: NO tocada (queda tal cual) */}
      {!loading && servicio && (
        <div className="mx-auto max-w-7xl px-6 mb-10">
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            {slides.length === 0 ? (
              <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-300 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-400 text-sm font-medium">
                    Sin imágenes disponibles
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative gallery-container">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={0}
                  navigation={{
                    nextEl: ".swiper-button-next-custom",
                    prevEl: ".swiper-button-prev-custom",
                  }}
                  loop={slides.length > 1}
                  autoplay={
                    slides.length > 1
                      ? { delay: 4500, disableOnInteraction: false }
                      : false
                  }
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  className="h-[450px] md:h-[500px]"
                >
                  {slides.map((url, idx) => (
                    <SwiperSlide key={`hero-${idx}`}>
                      {isImageUrl(url) ? (
                        <div className="h-full w-full bg-white">
                          <img
                            src={url}
                            alt={`${servicio.title} ${idx === 0 ? "(principal)" : ""}`}
                            className="h-full w-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300"
                        >
                          <div className="text-center p-6">
                            <svg
                              className="mx-auto h-16 w-16 mb-4"
                              style={{ color: ACCENT }}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <p className="text-sm font-medium text-gray-700 max-w-xs truncate">
                              {url.split("/").pop()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Click para abrir</p>
                          </div>
                        </a>
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>

                {slides.length > 1 && (
                  <>
                    <button
                      className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-110 group"
                      style={{ color: ACCENT }}
                    >
                      <svg
                        className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-110 group"
                      style={{ color: ACCENT }}
                    >
                      <svg
                        className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contenido bajo la galería */}
      {!loading && servicio && (
        <div className="mx-auto max-w-7xl px-6 py-10">
          {/* ✅ Descripción agregada */}
          {descripcion && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 mb-10">
              <h2 className="text-xl font-semibold" style={{ color: ACCENT }}>
                Descripción
              </h2>
              <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-line">
                {descripcion}
              </p>
            </section>
          )}

          {/* ✅ Swiper de tags (si hay) */}
          {Array.isArray(tags) && tags.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-3" style={{ color: ACCENT }}>
                Etiquetas
              </h2>
              <Swiper
                modules={[FreeMode, Autoplay]}
                slidesPerView="auto"
                freeMode
                spaceBetween={8}
                loop={tags.length > 6}
                autoplay={
                  tags.length > 6
                    ? { delay: 2000, disableOnInteraction: false }
                    : false
                }
                className="!py-1"
              >
                {tags.map((t, i) => (
                  <SwiperSlide key={`tag-${i}`} className="!w-auto">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-sm"
                      style={{
                        border: `1px solid ${ACCENT}`,
                        backgroundColor: "#f2f8fb",
                        color: "#335764",
                      }}
                    >
                      #{t}
                    </span>
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>
          )}

          {/* Características (queda igual que antes) */}
          {features.length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 mb-10">
              <h2 className="text-xl font-semibold" style={{ color: ACCENT }}>
                Características
              </h2>
              <ul className="mt-4 space-y-4">
                {features.map((f, i) => {
                  const title = typeof f === "string" ? f : f?.title ?? "";
                  const desc = typeof f === "string" ? "" : f?.description ?? "";
                  if (!title && !desc) return null;
                  return (
                    <li
                      key={`feature-${i}`}
                      className="rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="mt-0.5 inline-block h-5 w-5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: ACCENT }}
                          title="Detalle"
                        />
                        <div>
                          {title && (
                            <h3 className="text-base font-semibold text-gray-800">
                              {title}
                            </h3>
                          )}
                          {desc && (
                            <p className="text-sm text-gray-600 mt-1">{desc}</p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Más imágenes (queda igual que antes) */}
          {extraSlides.length > 0 && (
            <section className="mb-4">
              <h2 className="text-xl font-semibold mb-4" style={{ color: ACCENT }}>
                Más imágenes
              </h2>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={12}
                navigation
                loop={extraSlides.length > 2}
                autoplay={
                  extraSlides.length > 2
                    ? { delay: 4000, disableOnInteraction: false }
                    : false
                }
                pagination={{ clickable: true }}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="px-1"
              >
                {extraSlides.map((url, idx) => (
                  <SwiperSlide key={`thumb-${idx}`} className="h-full">
                    <div className="relative h-full min-h-[220px] rounded-2xl border border-gray-200 bg-white p-3">
                      {isImageUrl(url) ? (
                        <a href={url} target="_blank" rel="noreferrer" title="Ver imagen">
                          <img
                            src={url}
                            alt={`Imagen ${idx + 2}`}
                            className="aspect-video w-full object-cover rounded-xl"
                            loading="lazy"
                          />
                        </a>
                      ) : (
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm underline"
                          style={{ color: ACCENT }}
                          title="Abrir recurso"
                        >
                          {url.split("/").pop()}
                        </a>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>
          )}

          {/* Schema (opcional) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Service",
                name: servicio.title,
                description: descripcion || undefined,
                image: slides?.[0] || undefined,
                areaServed: "Córdoba, Argentina",
              }),
            }}
          />
        </div>
      )}
    </section>
  );
}
