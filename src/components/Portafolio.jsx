import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useCont from '../hooks/useCont';
import SEOHead from './Head/Head';
import PortafolioCard from './PortafolioCard';
import { Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import clienteAxios from '../config/axios';
import lineasIzq from "../assets/lineasamarillasizq.png";
import lineasDer from "../assets/lineasamarillasder.png";

const POR_PAGINA = 12;

export default function Portafolio() {
  const { company } = useCont();
  const [portafolios, setPortafolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchPortafolios();
  }, []);

  const fetchPortafolios = async () => {
    try {
      const { data } = await clienteAxios.get('/api/portafolios');
      setPortafolios(data.data || []);
    } catch (error) {
      console.error('Error al obtener portafolios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar portafolios por búsqueda
  const portafoliosFiltrados = useMemo(() => {
    if (!searchQuery.trim()) return portafolios;
    return portafolios.filter((proyecto) => {
      const titulo = proyecto.titulo || proyecto.title || '';
      const descripcion = proyecto.descripcion || proyecto.description || '';
      const query = searchQuery.toLowerCase();
      return titulo.toLowerCase().includes(query) || descripcion.toLowerCase().includes(query);
    });
  }, [portafolios, searchQuery]);

  const totalPaginas = Math.ceil(portafoliosFiltrados.length / POR_PAGINA);

  const portafoliosPaginados = useMemo(() => {
    const inicio = (pagina - 1) * POR_PAGINA;
    return portafoliosFiltrados.slice(inicio, inicio + POR_PAGINA);
  }, [portafoliosFiltrados, pagina]);

  const irAPagina = (n) => {
    setPagina(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEOHead
        title={`Portafolio - ${company.name || 'Ankaloo Construcciones'}`}
        description="Descubre nuestros proyectos y casos de éxito"
      />

      <div className="min-h-screen bg-[#f4f4f4] lg: relative overflow-hidden">
        <div aria-hidden="true" className="hidden lg:block pointer-events-none absolute left-0 top-0 h-full w-48 select-none z-0 opacity-60" style={{ backgroundImage: `url(${lineasDer})`, backgroundRepeat: 'repeat-y', backgroundSize: 'contain', backgroundPosition: 'left top' }} />
        <div aria-hidden="true" className="hidden lg:block pointer-events-none absolute right-0 top-0 h-full w-48 select-none z-0 opacity-60" style={{ backgroundImage: `url(${lineasIzq})`, backgroundRepeat: 'repeat-y', backgroundSize: 'contain', backgroundPosition: 'right top' }} />
        {/* Efectos de fondo */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#fdce27] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#1c1c1c] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-24">
          {/* Header Centrado */}
          <header className="relative z-10 text-center mb-16 lg:mb-10">
            <h1 className="text-5xl lg:text-6xl font-black text-[#1c1c1c] mb-6 tracking-tight">
              Nuestras <span className="text-[#fdce27]">Maquinarias</span>
            </h1>

            <p className="max-w-7xl mx-auto text-xl leading-relaxed font-light text-[#5a5a5a]">
              En <strong className="text-[#1c1c1c]">{company.name || 'Ankaloo Construcciones'}</strong> brindamos soluciones de infraestructura con tecnología de vanguardia y equipos especializados.
            </p>
          </header>


          {/* Grid de proyectos */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-10 h-10 text-[#fdce27] animate-spin" />
            </div>
          ) : portafoliosFiltrados.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                {portafoliosPaginados.map((proyecto) => (
                  <PortafolioCard key={proyecto.id} proyecto={proyecto} />
                ))}
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => irAPagina(pagina - 1)}
                    disabled={pagina === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-[#1c1c1c] hover:border-[#fdce27] hover:text-[#fdce27] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => irAPagina(n)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-black transition-colors ${
                        n === pagina
                          ? 'bg-[#fdce27] text-[#1c1c1c] border border-[#fdce27]'
                          : 'bg-white border border-slate-200 text-[#1c1c1c] hover:border-[#fdce27] hover:text-[#fdce27]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    onClick={() => irAPagina(pagina + 1)}
                    disabled={pagina === totalPaginas}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-[#1c1c1c] hover:border-[#fdce27] hover:text-[#fdce27] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-base lg:text-lg text-slate-500">
                {searchQuery ? 'No hay proyectos que coincidan con tu búsqueda' : 'No hay proyectos disponibles en el portafolio'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
