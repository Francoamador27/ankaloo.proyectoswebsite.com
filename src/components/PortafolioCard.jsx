import { ZoomIn } from 'lucide-react';

export default function PortafolioCard({ proyecto, onImageClick }) {
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) {
      return path;
    }

    const cleanPath = String(path).replace(/^\/+/, '');

    if (cleanPath.startsWith('storage/')) {
      return `${import.meta.env.VITE_API_URL}/${cleanPath}`;
    }

    if (cleanPath.startsWith('portafolio/') || cleanPath.startsWith('portafolio-galeria/')) {
      return `${import.meta.env.VITE_API_URL}/storage/uploads/${cleanPath}`;
    }

    return `${import.meta.env.VITE_API_URL}/${cleanPath}`;
  };

  return (
    <div className="group relative bg-white border border-slate-200 border-b-4 border-b-[#fdce27] overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-full flex flex-col">
      {/* Imagen */}
      <div
        className="relative h-64 md:h-72 overflow-hidden cursor-zoom-in"
        onClick={() => proyecto.imagen && onImageClick?.(getImageUrl(proyecto.imagen))}
      >
        {proyecto.imagen ? (
          <img
            src={getImageUrl(proyecto.imagen)}
            alt={proyecto.titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1c1c1c] via-[#2c2c2c] to-[#3a3a3a] flex items-center justify-center">
            <span className="text-white text-6xl opacity-20">📁</span>
          </div>
        )}

        {/* Icono zoom al hover */}
        {proyecto.imagen && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
            <div className="w-12 h-12 flex items-center justify-center bg-[#fdce27] rounded-full">
              <ZoomIn className="w-5 h-5 text-[#1c1c1c]" />
            </div>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Título */}
        <h3 className="text-lg font-black text-[#1c1c1c] mb-3 leading-tight tracking-tight group-hover:text-[#fdce27] transition-colors line-clamp-2 uppercase">
          {proyecto.titulo}
        </h3>

        {/* Descripción */}

        {/* Botón Estilo ServicioCard */}
        <div className="flex items-center gap-2 opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">


        </div>
      </div>
    </div>
  );

}
