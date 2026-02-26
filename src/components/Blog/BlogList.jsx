import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import { Calendar, Search, Tag, ArrowRight } from 'lucide-react';

export default function BlogList() {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  const fetcher = (url) => clienteAxios(url).then((res) => res.data);

  const { data: postsData, isLoading } = useSWR('/api/posts', fetcher);
  const { data: categoriasData } = useSWR('/api/posts-categorias', fetcher);

  const posts = useMemo(() => {
    if (Array.isArray(postsData?.data)) return postsData.data;
    if (Array.isArray(postsData)) return postsData;
    return [];
  }, [postsData]);

  const categorias = useMemo(() => {
    if (Array.isArray(categoriasData?.data)) return categoriasData.data;
    if (Array.isArray(categoriasData)) return categoriasData;
    return [];
  }, [categoriasData]);

  // Filtrar posts
  const postsFiltrados = useMemo(() => {
    return posts.filter((post) => {
      const matchBusqueda = busqueda
        ? post.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
          (post.contenido || '').toLowerCase().includes(busqueda.toLowerCase())
        : true;

      const matchCategoria = categoriaId
        ? post.categoria_id === parseInt(categoriaId)
        : true;

      return matchBusqueda && matchCategoria;
    });
  }, [posts, busqueda, categoriaId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const extractText = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const PostCard = ({ post, idx }) => {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
      >
        <div className="relative">
          <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
            {post.imagen ? (
              <img
                src={post.imagen}
                alt={post.titulo}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-5xl text-slate-300">📰</span>
              </div>
            )}
          </div>

          {post.categoria && (
            <div className="absolute top-4 left-4">
              <span className="bg-white/95 text-slate-700 text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                {post.categoria.nombre}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 text-slate-500 text-xs mb-3">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(post.publicado_en)}</span>
            </div>
            {post.autor && (
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>{post.autor.name}</span>
              </div>
            )}
          </div>

          <h3 className="text-xl font-semibold mb-2 tracking-tight leading-tight line-clamp-2 text-slate-900">
            {post.titulo}
          </h3>

          <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3">
            {extractText(post.contenido || '')}
          </p>

          <div className="flex items-center gap-2 text-sm text-slate-700 group-hover:text-slate-900">
            <span className="font-medium">Leer articulo</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="border-b border-slate-200 bg-gradient-to-b from-[#fff6f0] via-white to-white">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#dc834e] bg-[#dc834e]/10 px-4 py-2 rounded-full border border-[#dc834e]/20 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#dc834e]" />
              Blog de viajes
            </div>
            <h1 className="text-4xl lg:text-5xl font-semibold mb-4 tracking-tight text-slate-900">
              Blog de <span className="text-[#dc834e]">RevenantTravel</span>
            </h1>
            <div className="mx-auto h-0.5 w-16 bg-[#dc834e] rounded-full mb-4" />
            <p className="text-lg text-slate-600 leading-relaxed">
              Historias, consejos y experiencias de viaje.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 mb-10 border border-slate-200">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Búsqueda */}
            <div className="flex-1 min-w-[280px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por título o contenido..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                />
              </div>
            </div>

            {/* Filtro por Categoría */}
            <div className="min-w-[250px]">
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all duration-200 appearance-none bg-white cursor-pointer"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Limpiar filtros */}
            {(busqueda || categoriaId) && (
              <button
                onClick={() => {
                  setBusqueda('');
                  setCategoriaId('');
                }}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-200"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Contador de resultados */}
          <div className="mt-4 text-sm text-slate-500">
            Mostrando <span className="font-semibold text-slate-700">{postsFiltrados.length}</span> de{' '}
            <span className="font-semibold text-slate-700">{posts.length}</span> articulos
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-transparent"></div>
            <p className="mt-3 text-slate-600">Cargando articulos...</p>
          </div>
        )}

        {/* Grid de Posts */}
        {!isLoading && postsFiltrados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {postsFiltrados.map((post, idx) => (
              <PostCard key={post.id} post={post} idx={idx} />
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {!isLoading && postsFiltrados.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-2">No se encontraron articulos</h3>
            <p className="text-slate-600 mb-6">
              Intenta ajustar tus filtros de búsqueda
            </p>
            <button
              onClick={() => {
                setBusqueda('');
                setCategoriaId('');
              }}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all duration-200"
            >
              Ver todos los artículos
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
