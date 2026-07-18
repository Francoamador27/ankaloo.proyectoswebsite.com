import React, { useState, lazy, Suspense } from "react";
import useSWR, { mutate } from "swr";
import clienteAxios from "../config/axios";
import { Plus, Pencil, Trash2, GripVertical, MapPin, Briefcase, ToggleLeft, ToggleRight, X } from "lucide-react";

const TiptapEditor = lazy(() => import("../components/TiptapEditor/TiptapEditor"));

const token = () => localStorage.getItem("AUTH_TOKEN");

const fetcher = () =>
  clienteAxios("/api/admin/vacantes", {
    headers: { Authorization: `Bearer ${token()}` },
  }).then((res) => res.data);

const EMPTY_FORM = { titulo: "", area: "", ubicacion: "", descripcion: "", activo: true };

const VacantesAdmin = () => {
  const { data, error, isLoading } = useSWR("/api/admin/vacantes", fetcher);
  const vacantes = data?.data ?? [];

  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null); // null = crear, objeto = editar
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const abrirCrear = () => {
    setForm(EMPTY_FORM);
    setEditando(null);
    setErrMsg("");
    setModal(true);
  };

  const abrirEditar = (v) => {
    setForm({ titulo: v.titulo, area: v.area, ubicacion: v.ubicacion, descripcion: v.descripcion || "", activo: v.activo });
    setEditando(v);
    setErrMsg("");
    setModal(true);
  };

  const cerrarModal = () => {
    setModal(false);
    setEditando(null);
    setForm(EMPTY_FORM);
    setErrMsg("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrMsg("");
    try {
      if (editando) {
        await clienteAxios.put(`/api/vacantes/${editando.id}`, form, {
          headers: { Authorization: `Bearer ${token()}` },
        });
      } else {
        await clienteAxios.post("/api/vacantes", form, {
          headers: { Authorization: `Bearer ${token()}` },
        });
      }
      await mutate("/api/admin/vacantes");
      cerrarModal();
    } catch (err) {
      setErrMsg(err.response?.data?.message || "Error al guardar la vacante.");
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta vacante?")) return;
    try {
      await clienteAxios.delete(`/api/vacantes/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      await mutate("/api/admin/vacantes");
    } catch {
      alert("Error al eliminar la vacante.");
    }
  };

  const handleToggleActivo = async (v) => {
    try {
      await clienteAxios.put(
        `/api/vacantes/${v.id}`,
        { activo: !v.activo },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      await mutate("/api/admin/vacantes");
    } catch {
      alert("Error al cambiar el estado.");
    }
  };

  if (isLoading) return <p className="p-6 text-slate-500">Cargando vacantes...</p>;
  if (error) return <p className="p-6 text-red-500">Error al cargar las vacantes.</p>;

  const activas = vacantes.filter((v) => v.activo).length;
  const inactivas = vacantes.filter((v) => !v.activo).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Posiciones Abiertas</h1>
          <p className="text-slate-500 text-sm">
            {activas} activa{activas !== 1 ? "s" : ""} · {inactivas} inactiva{inactivas !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 bg-[#fdce27] text-[#1c1c1c] font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-95 transition-all"
        >
          <Plus size={16} />
          Nueva posición
        </button>
      </div>

      {/* Lista */}
      {vacantes.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <Briefcase size={36} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No hay posiciones cargadas todavía.</p>
          <p className="text-slate-400 text-sm mt-1">Creá la primera usando el botón de arriba.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vacantes.map((v) => (
            <div
              key={v.id}
              className={`bg-white border rounded-2xl p-5 flex items-center gap-4 shadow-sm transition-all ${
                v.activo ? "border-slate-200" : "border-slate-100 opacity-60"
              }`}
            >
              <GripVertical size={16} className="text-slate-300 flex-shrink-0 cursor-grab" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-slate-900 text-sm">{v.titulo}</span>
                  {!v.activo && (
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">inactiva</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Briefcase size={11} />
                    {v.area}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {v.ubicacion}
                  </span>
                </div>
                {v.descripcion && (
                  <div
                    className="text-xs text-slate-400 mt-1.5 prose prose-sm max-w-none line-clamp-1"
                    dangerouslySetInnerHTML={{ __html: v.descripcion }}
                  />
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Toggle activo */}
                <button
                  onClick={() => handleToggleActivo(v)}
                  title={v.activo ? "Desactivar" : "Activar"}
                  className={`p-1.5 rounded-lg transition-colors ${
                    v.activo ? "text-green-600 hover:bg-green-50" : "text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  {v.activo ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
                <button
                  onClick={() => abrirEditar(v)}
                  title="Editar"
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleEliminar(v.id)}
                  title="Eliminar"
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear/editar */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">
                {editando ? "Editar posición" : "Nueva posición"}
              </h2>
              <button onClick={cerrarModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Título del puesto <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Jefe de Obra"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#fdce27] focus:ring-4 focus:ring-[#fdce27]/10 outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Área <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Obra civil"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#fdce27] focus:ring-4 focus:ring-[#fdce27]/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Ubicación <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={form.ubicacion}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Córdoba, Remoto"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#fdce27] focus:ring-4 focus:ring-[#fdce27]/10 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Descripción <span className="text-slate-400 normal-case">(opcional)</span>
                </label>
                <Suspense
                  fallback={
                    <div className="border border-slate-200 rounded-xl p-4 text-sm text-slate-400">
                      Cargando editor...
                    </div>
                  }
                >
                  <TiptapEditor
                    content={form.descripcion}
                    onChange={(html) => setForm((prev) => ({ ...prev, descripcion: html }))}
                    placeholder="Breve descripción del rol y requisitos..."
                  />
                </Suspense>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="activo"
                  checked={form.activo}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#fdce27] rounded"
                />
                <span className="text-sm font-medium text-slate-700">
                  Posición activa (visible en la página)
                </span>
              </label>

              {errMsg && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                  {errMsg}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#fdce27] text-[#1c1c1c] font-bold rounded-xl hover:brightness-95 transition-all text-sm disabled:opacity-50"
                >
                  {saving ? "Guardando..." : editando ? "Guardar cambios" : "Crear posición"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VacantesAdmin;
