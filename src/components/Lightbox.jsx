import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  const src = images[currentIndex];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-[#fdce27] text-white hover:text-[#1c1c1c] transition-colors rounded-full z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Contador */}
      {images.length > 1 && (
        <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-black tracking-widest">
          {currentIndex + 1} / {images.length}
        </span>
      )}

      {/* Flecha anterior */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-[#fdce27] text-white hover:text-[#1c1c1c] transition-colors rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Imagen */}
      <img
        src={src}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-w-[90vw] max-h-[85vh] object-contain shadow-2xl"
        style={{ userSelect: "none" }}
      />

      {/* Flecha siguiente */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-[#fdce27] text-white hover:text-[#1c1c1c] transition-colors rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
