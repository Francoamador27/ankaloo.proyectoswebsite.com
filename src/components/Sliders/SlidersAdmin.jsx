import React, { useEffect, useState } from 'react';
import clienteAxios from '../../config/axios';
import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Image as ImageIcon, Pencil, X } from 'lucide-react';

const SortableItem = ({ slide, onDelete, onEdit, isEditing }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-xl shadow-sm flex items-center gap-4 p-4 ${
        isEditing ? 'border-blue-300 ring-2 ring-blue-100' : ''
      }`}
    >
      {/* DRAG HANDLE */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        title="Arrastrar"
      >
        <GripVertical />
      </div>

      {/* IMAGEN */}
      <img
        src={slide.image}
        alt={slide.title}
        className="w-24 h-24 object-cover rounded-lg border"
      />

      {/* TEXTO */}
      <div className="flex-1">
        <h4 className="font-semibold text-sm">{slide.title}</h4>
        <p className="text-xs text-gray-600 line-clamp-2">
          {slide.description}
        </p>
      </div>

      {/* DELETE */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(slide);
        }}
        className="text-blue-500 hover:text-blue-700 p-2"
        title="Editar"
      >
        <Pencil size={18} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(slide.id);
        }}
        className="text-red-500 hover:text-red-700 p-2"
        title="Eliminar"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

const SlidersAdmin = () => {
  const token = localStorage.getItem('AUTH_TOKEN');

  const [slides, setSlides] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data } = await clienteAxios.get('/api/sliders');
      setSlides(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMensaje(null);

    if (!title.trim() || !description.trim()) {
      setError('Título y descripción son obligatorios');
      return;
    }

    if (!editingId && !imagen) {
      setError('La imagen es obligatoria');
      return;
    }

    const formData = new FormData();
    if (imagen) formData.append('imagen', imagen);
    formData.append('title', title);
    formData.append('description', description);

    try {
      setCargando(true);
      if (editingId) {
        await clienteAxios.post(`/api/sliders/${editingId}?_method=PUT`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMensaje('Slide actualizado correctamente');
      } else {
        await clienteAxios.post('/api/sliders', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMensaje('Slide creado correctamente');
      }

      setImagen(null);
      setPreview(null);
      setTitle('');
      setDescription('');
      setEditingId(null);
      fetchSlides();
    } catch {
      setError(editingId ? 'Error al actualizar el slide' : 'Error al crear el slide');
    } finally {
      setCargando(false);
    }
  };

  const handleEdit = (slide) => {
    setEditingId(slide.id);
    setTitle(slide.title || '');
    setDescription(slide.description || '');
    setPreview(slide.image || null);
    setImagen(null);
    setError(null);
    setMensaje(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setImagen(null);
    setPreview(null);
    setError(null);
    setMensaje(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este slide?')) return;

    try {
      await clienteAxios.delete(`/api/sliders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSlides();
    } catch {
      alert('Error al eliminar');
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = slides.findIndex(s => s.id === active.id);
    const newIndex = slides.findIndex(s => s.id === over.id);

    const newOrder = arrayMove(slides, oldIndex, newIndex);
    setSlides(newOrder);

    try {
      await clienteAxios.post(
        '/api/sliders/reorder',
        {
          order: newOrder.map((s, index) => ({
            id: s.id,
            position: index + 1,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch {
      console.error('Error guardando orden');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-6">Administrar Slider</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          placeholder="Descripción"
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        {/* DROPZONE */}
        <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#008DD2] transition">
          <ImageIcon className="text-gray-400" />
          <span className="text-sm text-gray-600">
            {editingId ? 'Cambiar imagen (opcional)' : 'Arrastrá o hacé click para subir una imagen'}
          </span>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={e => {
              setImagen(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </label>

        {preview && (
          <img
            src={preview}
            className="w-full h-48 object-cover rounded-xl border"
          />
        )}

        <div className="flex flex-wrap gap-3">
          <button
            disabled={cargando}
            className="bg-[#008DD2] text-white px-6 py-2 rounded hover:bg-[#0070aa]"
          >
            {cargando ? 'Guardando...' : editingId ? 'Actualizar slide' : 'Crear slide'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-50 flex items-center gap-2"
            >
              <X size={16} />
              Cancelar
            </button>
          )}
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}
      </form>

      {/* LISTA */}
      <h3 className="font-semibold mb-4">Orden del slider</h3>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={slides.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {slides.map(slide => (
              <SortableItem
                key={slide.id}
                slide={slide}
                onDelete={handleDelete}
                onEdit={handleEdit}
                isEditing={editingId === slide.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SlidersAdmin;
