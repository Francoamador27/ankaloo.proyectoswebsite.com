import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  ExternalLink,
  Eye,
  EyeOff,
  Images,
  Loader,
  Factory,
  Save,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clienteAxios from "../config/axios";
import Aviso, { useAviso, mensajeError, authHeaders } from "../components/Abastecimiento/Aviso";

const URL_PUBLICA = "/servicios/abastecimiento-para-obras";
const fetcher = (url) =>
  clienteAxios.get(url, { headers: authHeaders() }).then((r) => r.data);

// ─── Tarjeta ordenable ─────────────────────────────────────────
function TarjetaServicio({ item, onToggle, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group bg-white rounded-2xl border-2 overflow-hidden flex flex-col transition-shadow ${
        isDragging
          ? "border-[#fdce27] shadow-2xl z-10 relative"
          : "border-gray-100 hover:border-[#fdce27] hover:shadow-xl"
      }`}
    >
      {/* Portada */}
      <div className="relative aspect-[4/3] bg-[#1c1c1c]">
        {item.imagen_portada_url ? (
          <img
            src={item.imagen_portada_url}
            alt={item.titulo}
            className={`w-full h-full object-cover ${item.activo ? "" : "grayscale opacity-60"}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">
              Sin portada
            </span>
          </div>
        )}

        <button
          type="button"
          {...attributes}
          {...listeners}
          title="Arrastrar para cambiar el orden"
          className="absolute top-3 left-3 w-9 h-9 flex items-center justify-center bg-white/90 rounded-xl text-gray-500 hover:text-[#1c1c1c] cursor-grab active:cursor-grabbing shadow"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <span
          className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow ${
            item.activo ? "bg-[#fdce27] text-[#1c1c1c]" : "bg-gray-700 text-white"
          }`}
        >
          {item.activo ? "Visible" : "Oculto"}
        </span>
      </div>

      {/* Info */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-black text-[#1c1c1c] leading-tight">{item.titulo}</h3>
        {item.subtitulo && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.subtitulo}</p>
        )}
        <p className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mt-3">
          <Images className="w-4 h-4" />
          {item.galeria_count} {item.galeria_count === 1 ? "foto" : "fotos"} en la galería
        </p>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2">
          <Link
            to={`/admin-dash/abastecimiento/${item.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 text-[11px] font-black tracking-wider uppercase bg-[#1c1c1c] text-white hover:bg-[#fdce27] hover:text-[#1c1c1c] px-4 py-2.5 rounded-xl transition-colors"
          >
            <Edit className="w-4 h-4" /> Editar
          </Link>
          <button
            type="button"
            onClick={() => onToggle(item)}
            title={item.activo ? "Ocultar de la web" : "Mostrar en la web"}
            className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-100 text-gray-500 hover:border-[#fdce27] hover:text-[#1c1c1c] transition-colors"
          >
            {item.activo ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <a
            href={`${URL_PUBLICA}/${item.slug}`}
            target="_blank"
            rel="noreferrer"
            title={item.activo ? "Ver en la web" : "Está oculto: no se ve en la web"}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-100 transition-colors ${
              item.activo
                ? "text-gray-500 hover:border-[#fdce27] hover:text-[#1c1c1c]"
                : "text-gray-300 pointer-events-none"
            }`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={() => onDelete(item)}
            title="Eliminar"
            className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-red-50 text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Título de la sección ──────────────────────────────────────
function EditorSeccion({ seccion, onGuardado, aviso }) {
  const [form, setForm] = useState(seccion);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => setForm(seccion), [seccion]);

  const cambios =
    form.titulo !== seccion.titulo ||
    (form.titulo_destacado || "") !== (seccion.titulo_destacado || "") ||
    (form.seo_description || "") !== (seccion.seo_description || "");

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return aviso.error("El título de la sección es obligatorio.");
    setGuardando(true);
    try {
      await clienteAxios.put("/api/admin/abastecimientos-seccion", form, {
        headers: authHeaders(),
      });
      aviso.exito("Título de la sección guardado");
      onGuardado();
    } catch (err) {
      aviso.error(mensajeError(err));
    } finally {
      setGuardando(false);
    }
  };

  const input =
    "w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#fdce27] focus:outline-none focus:ring-4 focus:ring-[#fdce27]/20 text-[#1c1c1c] font-semibold";

  return (
    <form
      onSubmit={guardar}
      className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 lg:p-6 mb-10"
    >
      <h2 className="text-sm font-black uppercase tracking-widest text-[#1c1c1c] mb-1">
        Título de la sección
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Es el encabezado que se ve arriba de las tarjetas. La segunda parte se muestra en amarillo.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold text-gray-600">Texto principal</span>
          <input
            className={`${input} mt-1`}
            value={form.titulo}
            maxLength={255}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            placeholder="Abastecimientos para"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-gray-600">Texto destacado (amarillo)</span>
          <input
            className={`${input} mt-1`}
            value={form.titulo_destacado || ""}
            maxLength={255}
            onChange={(e) => setForm({ ...form, titulo_destacado: e.target.value })}
            placeholder="obras"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-xs font-bold text-gray-600">
            Descripción para Google{" "}
            <span className="font-normal text-gray-400">
              ({(form.seo_description || "").length}/300)
            </span>
          </span>
          <textarea
            rows={2}
            maxLength={300}
            className={`${input} mt-1 font-normal resize-none`}
            value={form.seo_description || ""}
            onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-2xl lg:text-3xl font-black tracking-tight text-[#1c1c1c]">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
            Vista previa
          </span>
          {form.titulo || "…"}{" "}
          {form.titulo_destacado && <span className="text-[#fdce27]">{form.titulo_destacado}</span>}
        </p>
        <button
          type="submit"
          disabled={!cambios || guardando}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1c1c1c] text-white hover:bg-[#fdce27] hover:text-[#1c1c1c] disabled:opacity-40 disabled:pointer-events-none font-black uppercase tracking-widest text-xs rounded-xl transition-colors"
        >
          {guardando ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar título
        </button>
      </div>
    </form>
  );
}

// ─── Vista ─────────────────────────────────────────────────────
export default function AdminAbastecimientoList() {
  const aviso = useAviso();
  const { data, isLoading, mutate } = useSWR("/api/admin/abastecimientos", fetcher);
  const [items, setItems] = useState([]);
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    if (data?.data) setItems(data.data);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const viejo = items.findIndex((i) => i.id === active.id);
    const nuevo = items.findIndex((i) => i.id === over.id);
    const ordenados = arrayMove(items, viejo, nuevo);
    setItems(ordenados);

    try {
      await clienteAxios.post(
        "/api/admin/abastecimientos/reorder",
        { items: ordenados.map((i, idx) => ({ id: i.id, position: idx + 1 })) },
        { headers: authHeaders() },
      );
      aviso.exito("Orden guardado");
      mutate();
    } catch (err) {
      setItems(items);
      aviso.error(mensajeError(err, "No se pudo guardar el orden"));
    }
  };

  const toggle = async (item) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, activo: !i.activo } : i)));
    try {
      const { data: res } = await clienteAxios.patch(
        `/api/admin/abastecimientos/${item.id}/toggle`,
        {},
        { headers: authHeaders() },
      );
      aviso.exito(res.message);
      mutate();
    } catch (err) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      aviso.error(mensajeError(err));
    }
  };

  const eliminar = async () => {
    setEliminando(true);
    try {
      await clienteAxios.delete(`/api/admin/abastecimientos/${aEliminar.id}`, {
        headers: authHeaders(),
      });
      aviso.exito(`"${aEliminar.titulo}" eliminado`);
      setAEliminar(null);
      mutate();
    } catch (err) {
      aviso.error(mensajeError(err));
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="max-w-[90rem] mx-auto p-4 lg:p-8">
      <div className="bg-white p-6 lg:p-10 rounded-2xl shadow-xl border border-gray-100 min-h-[500px]">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-[#1c1c1c] tracking-tighter uppercase">
              Abastecimiento para obras
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Estos servicios se muestran en{" "}
              <a
                href={URL_PUBLICA}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#1c1c1c] underline decoration-[#fdce27] underline-offset-4"
              >
                {URL_PUBLICA}
              </a>
              . Arrastrá las tarjetas para cambiar el orden.
            </p>
          </div>
          <Link
            to="/admin-dash/abastecimiento/nuevo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#fdce27] hover:bg-[#1c1c1c] text-[#1c1c1c] hover:text-[#fdce27] font-black uppercase tracking-widest text-xs rounded-xl shadow-xl transition-colors shrink-0"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} /> Nuevo servicio
          </Link>
        </div>

        {data?.seccion && (
          <EditorSeccion seccion={data.seccion} onGuardado={mutate} aviso={aviso} />
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-12 h-12 text-[#fdce27] animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Factory className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-black text-[#1c1c1c]">Todavía no hay servicios cargados</p>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Creá el primero con su portada, galería y descripción.
            </p>
            <Link
              to="/admin-dash/abastecimiento/nuevo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1c1c1c] text-white hover:bg-[#fdce27] hover:text-[#1c1c1c] font-black uppercase tracking-widest text-xs rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Crear el primer servicio
            </Link>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <TarjetaServicio
                    key={item.id}
                    item={item}
                    onToggle={toggle}
                    onDelete={setAEliminar}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Confirmación de borrado */}
      {aEliminar && (
        <div
          className="fixed inset-0 z-[1300] bg-black/60 flex items-center justify-center p-4"
          onClick={() => !eliminando && setAEliminar(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 lg:p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-black text-[#1c1c1c]">¿Eliminar este servicio?</h3>
            <p className="text-gray-600 mt-3">
              Se va a borrar <strong>{aEliminar.titulo}</strong> junto con su portada y todas las fotos
              de la galería. Esta acción no se puede deshacer.
            </p>
            <p className="text-sm text-gray-500 mt-3">
              Si solo querés sacarlo de la web, usá el botón del ojo para ocultarlo.
            </p>
            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                disabled={eliminando}
                onClick={() => setAEliminar(null)}
                className="px-5 py-3 rounded-xl border-2 border-gray-200 font-black uppercase tracking-wider text-xs text-gray-600 hover:border-gray-400"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={eliminando}
                onClick={eliminar}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs disabled:opacity-60"
              >
                {eliminando && <Loader className="w-4 h-4 animate-spin" />}
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <Aviso aviso={aviso.aviso} />
    </div>
  );
}
