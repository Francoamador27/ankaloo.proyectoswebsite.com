import React, { useState, useEffect } from 'react';
import clienteAxios from '../config/axios';
import { CheckCircle, Loader, Youtube, Plus, Trash2, X } from 'lucide-react';

// ─── Sección de slider: lista de imágenes + botón agregar ────────────────────
function SliderSection({ title, subtitle, color = '#fdce27', tipo }) {
  const token = localStorage.getItem('AUTH_TOKEN');
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    clienteAxios.get(`/api/recursos-imagenes/${tipo}`)
      .then(({ data }) => setImagenes(data.data || []))
      .catch(() => setError('Error al cargar las imágenes'))
      .finally(() => setCargando(false));
  }, [tipo]);

  const MAX_MB = 5;
  const MAX_BYTES = MAX_MB * 1024 * 1024;

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (file.size > MAX_BYTES) {
      setError(`La imagen no puede pesar más de ${MAX_MB}MB. Podés comprimirla en https://www.iloveimg.com/es/comprimir-imagen`);
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('imagen', file);
      const { data } = await clienteAxios.post(`/api/recursos-imagenes/${tipo}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setImagenes(prev => [...prev, data.imagen]);
    } catch {
      setError(`Error al subir la imagen. Verificá que sea JPG/PNG/WEBP y menos de ${MAX_MB}MB. Podés comprimirla en https://www.iloveimg.com/es/comprimir-imagen`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await clienteAxios.delete(`/api/recursos-imagenes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImagenes(prev => prev.filter(img => img.id !== id));
    } catch {
      setError('Error al eliminar la imagen.');
    }
  };

  return (
    <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#1c1c1c] uppercase tracking-tight">
          {title.split(' ').map((word, i) =>
            i === title.split(' ').length - 1
              ? <span key={i} style={{ color }}> {word}</span>
              : <span key={i}>{word} </span>
          )}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl font-bold flex items-center gap-2 text-sm bg-red-50 text-red-600 border border-red-200">
          <X size={14} className="shrink-0" /> {error}
        </div>
      )}

      {/* Grid de imágenes existentes */}
      {cargando ? (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin text-[#fdce27] w-8 h-8" />
        </div>
      ) : imagenes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {imagenes.map((img) => (
            <div key={img.id} className="relative group rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50">
              <img
                src={img.path}
                alt=""
                className="w-full h-36 object-cover"
              />
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="Eliminar imagen"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-gray-400 font-medium py-4">
          Todavía no hay imágenes. Agregá la primera.
        </p>
      )}

      {/* Botón agregar */}
      <label className={`border-4 border-dashed border-gray-100 hover:border-[#fdce27] rounded-3xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-all ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
        {uploading
          ? <Loader className="text-[#fdce27] w-8 h-8 animate-spin" />
          : <Plus className="text-gray-300 w-8 h-8" />
        }
        <span className="text-sm font-bold text-gray-500">
          {uploading ? 'Subiendo imagen...' : 'Agregar imagen'}
        </span>
        <span className="text-xs text-gray-400 tracking-wider font-semibold">JPG, PNG o WEBP — máx. 5 MB</span>
        <input type="file" accept="image/*" hidden onChange={handleUpload} disabled={uploading} />
      </label>

      {imagenes.length > 0 && (
        <p className="text-xs text-gray-400 text-center font-medium">
          {imagenes.length} {imagenes.length === 1 ? 'imagen cargada' : 'imágenes cargadas'} · el orden del slider sigue el orden de subida
        </p>
      )}
    </div>
  );
}

// ─── Sección genérica con botón guardar (video, compromiso) ──────────────────
function ResourceSection({ title, subtitle, color = '#fdce27', children, onSave, saving, saved, error }) {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#1c1c1c] uppercase tracking-tight">
          {title.split(' ').map((word, i) =>
            i === title.split(' ').length - 1
              ? <span key={i} style={{ color }}> {word}</span>
              : <span key={i}>{word} </span>
          )}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      </div>

      {children}

      {error && (
        <div className="p-3 rounded-xl font-bold flex items-center gap-2 text-sm bg-red-50 text-red-600 border border-red-200">
          {error}
        </div>
      )}
      {saved && (
        <div className="p-3 rounded-xl font-bold flex items-center gap-2 text-sm bg-green-50 text-green-700 border border-green-200">
          <CheckCircle size={16} /> Guardado correctamente.
        </div>
      )}

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="w-full bg-[#1c1c1c] text-white hover:bg-[#fdce27] hover:text-[#1c1c1c] text-sm uppercase tracking-widest font-black px-6 py-4 rounded-2xl shadow-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {saving ? <><Loader size={16} className="animate-spin" /> Guardando...</> : 'Guardar'}
      </button>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function RecursosAdmin() {
  const token = localStorage.getItem('AUTH_TOKEN');
  const [cargando, setCargando] = useState(true);

  const [videoUrl, setVideoUrl] = useState('');

  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    clienteAxios.get('/api/settings').then(({ data }) => {
      setVideoUrl(data.video_quienes_somos || '');
    }).finally(() => setCargando(false));
  }, []);

  const save = async (key, fields) => {
    setSaving(s => ({ ...s, [key]: true }));
    setSaved(s => ({ ...s, [key]: false }));
    setErrors(e => ({ ...e, [key]: null }));
    try {
      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => { if (v !== null && v !== undefined) formData.append(k, v); });
      await clienteAxios.post('/api/settings', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setSaved(s => ({ ...s, [key]: true }));
      setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 3000);
    } catch {
      setErrors(e => ({ ...e, [key]: 'Error al guardar. Intentá nuevamente.' }));
    } finally {
      setSaving(s => ({ ...s, [key]: false }));
    }
  };

  if (cargando) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader className="h-10 w-10 animate-spin text-[#fdce27]" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl lg:text-4xl font-black text-[#1c1c1c] mb-2 uppercase tracking-tight">
          <span className="text-[#fdce27]">Recursos</span>
        </h1>
        <p className="text-gray-500 font-medium">Administrá las imágenes y videos que se muestran en las distintas secciones del sitio.</p>
      </div>

      {/* Imagen Corporativa — slider multi-imagen */}
      <SliderSection
        title="Imagen Corporativa"
        subtitle="Se muestran como slider en la sección 'Quiénes Somos'. Podés agregar varias fotos."
        tipo="corporativa"
      />

      {/* Imagen Calidad — slider multi-imagen */}
      <SliderSection
        title="Imagen Calidad"
        subtitle="Se muestran como slider en la página de Calidad Certificada. Podés agregar varias fotos."
        tipo="calidad"
      />

      {/* Video Quiénes Somos */}
      <ResourceSection
        title="Video Quiénes Somos"
        subtitle="URL de YouTube que se incrusta en la página Quiénes Somos."
        onSave={() => save('video', { video_quienes_somos: videoUrl })}
        saving={saving.video}
        saved={saved.video}
        error={errors.video}
      >
        <div className="space-y-3">
          <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">
            URL de YouTube
          </label>
          <div className="flex items-center gap-3 border-2 border-gray-100 hover:border-[#fdce27] focus-within:border-[#fdce27] rounded-2xl px-4 py-3 transition-all">
            <Youtube className="text-red-500 w-5 h-5 flex-shrink-0" />
            <input
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 outline-none text-sm font-medium text-gray-700 bg-transparent"
            />
          </div>
          {videoUrl && (() => {
            const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            const embedUrl = match ? `https://www.youtube.com/embed/${match[1]}` : (videoUrl.includes('/embed/') ? videoUrl : null);
            return embedUrl ? (
              <div className="rounded-2xl overflow-hidden border-2 border-gray-100 aspect-video">
                <iframe src={embedUrl} className="w-full h-full" title="Vista previa" allowFullScreen />
              </div>
            ) : <p className="text-xs text-red-500 font-semibold">URL de YouTube no reconocida.</p>;
          })()}
        </div>
      </ResourceSection>

      {/* Imagen Compromiso — slider multi-imagen */}
      <SliderSection
        title="Imagen Compromiso"
        subtitle="Se muestran como slider en la página de Compromiso Ambiental. Podés agregar varias fotos."
        color="rgb(22 163 74)"
        tipo="compromiso"
      />
    </div>
  );
}
