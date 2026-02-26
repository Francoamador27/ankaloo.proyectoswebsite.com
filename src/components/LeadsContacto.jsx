import React, { useState, useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import clienteAxios from '../config/axios';
import { Eye, Trash2, Search, Filter } from 'lucide-react';

const LeadsContacto = () => {
  const token = localStorage.getItem('AUTH_TOKEN');

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [pagina, setPagina] = useState(1);
  const [perPage] = useState(15);
  const [leadSeleccionado, setLeadSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (busqueda.length >= 3) p.append('q', busqueda);
    if (filtroEstado) p.append('estado', filtroEstado);
    if (pagina) p.append('page', pagina);
    if (perPage) p.append('per_page', perPage);
    return p.toString();
  }, [busqueda, filtroEstado, pagina, perPage]);

  const fetcher = () =>
    clienteAxios(`/api/leads-contacto?${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then((res) => res.data);

  const statsFetcher = () =>
    clienteAxios('/api/leads-contacto/stats', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then((res) => res.data);

  const { data, error, isLoading } = useSWR(`/api/leads-contacto?${query}`, fetcher);
  const { data: stats } = useSWR('/api/leads-contacto/stats', statsFetcher);

  if (isLoading) return <p className="p-4 text-gray-600">Cargando leads...</p>;
  if (error) return <p className="p-4 text-red-600">Error al cargar los leads.</p>;

  const leads = data?.data ?? [];
  const currentPage = data?.current_page ?? pagina;
  const lastPage = data?.last_page ?? 1;

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este lead?')) return;

    try {
      await clienteAxios.delete(`/api/leads-contacto/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      mutate(`/api/leads-contacto?${query}`);
      mutate('/api/leads-contacto/stats');
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el lead.');
    }
  };

  const handleVerDetalle = async (id) => {
    try {
      const { data } = await clienteAxios.get(`/api/leads-contacto/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLeadSeleccionado(data);
      setModalAbierto(true);
    } catch (err) {
      console.error(err);
      alert('Error al cargar el detalle del lead.');
    }
  };

  const handleActualizarEstado = async (id, nuevoEstado) => {
    try {
      await clienteAxios.put(`/api/leads-contacto/${id}`, 
        { estado: nuevoEstado },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      mutate(`/api/leads-contacto?${query}`);
      mutate('/api/leads-contacto/stats');
      if (leadSeleccionado?.id === id) {
        setLeadSeleccionado({ ...leadSeleccionado, estado: nuevoEstado });
      }
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el estado.');
    }
  };

  const handleActualizarNotas = async (id, notas) => {
    try {
      await clienteAxios.put(`/api/leads-contacto/${id}`, 
        { notas },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      mutate(`/api/leads-contacto?${query}`);
    } catch (err) {
      console.error(err);
      alert('Error al actualizar las notas.');
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      nuevo: 'bg-green-100 text-green-800 border-green-200',
      en_proceso: 'bg-blue-100 text-blue-800 border-blue-200',
      contactado: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cerrado: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    const labels = {
      nuevo: 'Nuevo',
      en_proceso: 'En Proceso',
      contactado: 'Contactado',
      cerrado: 'Cerrado',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badges[estado] || 'bg-gray-100 text-gray-800'}`}>
        {labels[estado] || estado}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 mb-2">
          Leads de <span className="text-[#dc834e]">Contacto</span>
        </h1>
        <p className="text-slate-600">Gestiona las consultas recibidas desde el formulario de contacto.</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="text-3xl font-black text-slate-900">{stats.total}</div>
            <div className="text-sm text-slate-600 font-medium mt-1">Total</div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 shadow-sm border border-green-200">
            <div className="text-3xl font-black text-green-800">{stats.nuevos}</div>
            <div className="text-sm text-green-700 font-medium mt-1">Nuevos</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-200">
            <div className="text-3xl font-black text-blue-800">{stats.en_proceso}</div>
            <div className="text-sm text-blue-700 font-medium mt-1">En Proceso</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-6 shadow-sm border border-yellow-200">
            <div className="text-3xl font-black text-yellow-800">{stats.contactados}</div>
            <div className="text-sm text-yellow-700 font-medium mt-1">Contactados</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-black text-gray-800">{stats.cerrados}</div>
            <div className="text-sm text-gray-700 font-medium mt-1">Cerrados</div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, email, teléfono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#dc834e]/20 focus:border-[#dc834e]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#dc834e]/20 focus:border-[#dc834e]"
            >
              <option value="">Todos los estados</option>
              <option value="nuevo">Nuevos</option>
              <option value="en_proceso">En Proceso</option>
              <option value="contactado">Contactados</option>
              <option value="cerrado">Cerrados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-700">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-700">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-700">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-700">
                  Mensaje
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-700">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(lead.created_at).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{lead.nombre}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">{lead.email}</div>
                    <div className="text-xs text-slate-500">{lead.telefono}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600 line-clamp-2 max-w-md">
                      {lead.mensaje}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getEstadoBadge(lead.estado)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleVerDetalle(lead.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEliminar(lead.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leads.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No hay leads para mostrar.
          </div>
        )}
      </div>

      {/* Paginación */}
      {lastPage > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPagina(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="px-4 py-2 bg-[#dc834e] text-white rounded-lg font-bold">
            Página {currentPage} de {lastPage}
          </span>
          <button
            onClick={() => setPagina(currentPage + 1)}
            disabled={currentPage >= lastPage}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal de Detalle */}
      {modalAbierto && leadSeleccionado && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{leadSeleccionado.nombre}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Recibido el {new Date(leadSeleccionado.created_at).toLocaleString('es-AR')}
                  </p>
                </div>
                <button
                  onClick={() => setModalAbierto(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Información de Contacto */}
              <div>
                <h4 className="font-black text-slate-700 mb-3">Información de Contacto</h4>
                <div className="space-y-2 bg-slate-50 rounded-xl p-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">Email:</span>
                    <p className="text-sm text-slate-900">{leadSeleccionado.email}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">Teléfono:</span>
                    <p className="text-sm text-slate-900">{leadSeleccionado.telefono}</p>
                  </div>
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <h4 className="font-black text-slate-700 mb-3">Mensaje</h4>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {leadSeleccionado.mensaje}
                  </p>
                </div>
              </div>

              {/* Estado */}
              <div>
                <h4 className="font-black text-slate-700 mb-3">Estado</h4>
                <select
                  value={leadSeleccionado.estado}
                  onChange={(e) => handleActualizarEstado(leadSeleccionado.id, e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#dc834e]/20 focus:border-[#dc834e] font-medium"
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="contactado">Contactado</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>

              {/* Notas */}
              <div>
                <h4 className="font-black text-slate-700 mb-3">Notas Internas</h4>
                <textarea
                  defaultValue={leadSeleccionado.notas || ''}
                  onBlur={(e) => handleActualizarNotas(leadSeleccionado.id, e.target.value)}
                  rows="4"
                  placeholder="Agregar notas internas sobre este lead..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#dc834e]/20 focus:border-[#dc834e] resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setModalAbierto(false)}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsContacto;
