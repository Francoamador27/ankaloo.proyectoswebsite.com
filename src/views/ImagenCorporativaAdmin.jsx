import React, { useState, useEffect } from 'react';
import clienteAxios from '../config/axios';
import { Image as ImageIcon, CheckCircle, Loader } from 'lucide-react';

const ImagenCorporativaAdmin = () => {
  const token = localStorage.getItem('AUTH_TOKEN');

  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cargandoObj, setCargandoObj] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await clienteAxios.get('/api/settings');
      if (data.imagen_corporativa) {
        setPreview(
          data.imagen_corporativa.startsWith('http')
            ? data.imagen_corporativa
            : `${import.meta.env.VITE_API_URL}/${data.imagen_corporativa}`
        );
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setCargandoObj(false);
    }
  };

  const onImagenChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setMensaje({ tipo: 'error', texto: 'Por favor, selecciona una imagen válida.' });
      return;
    }

    setImagen(file);
    setPreview(URL.createObjectURL(file));
    setMensaje({ tipo: '', texto: '' });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!imagen) {
       setMensaje({ tipo: 'error', texto: 'Debes seleccionar una imagen corporativa nueva primero.' });
       return;
    }

    try {
      setGuardando(true);
      setMensaje({ tipo: '', texto: '' });

      const formData = new FormData();
      formData.append('imagen_corporativa', imagen);

      // En Laravel la ruta es POST a /api/settings
      await clienteAxios.post('/api/settings', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMensaje({ tipo: 'exito', texto: 'Imagen corporativa actualizada con éxito.' });
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'Error al actualizar la imagen.' });
    } finally {
      setGuardando(false);
    }
  };

  if (cargandoObj) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader className="h-10 w-10 animate-spin text-[#fdce27]" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-10 bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl lg:text-4xl font-black text-[#1c1c1c] mb-2 uppercase tracking-tight">
          Imagen <span className="text-[#fdce27]">Corporativa</span>
        </h1>
        <p className="text-gray-500 font-medium">Controla la imagen principal representativa de la empresa.</p>
      </div>

      <div className="bg-white p-6 lg:p-10 rounded-2xl shadow-lg border border-gray-100">
        <form onSubmit={handleGuardar} className="space-y-8">
          <div>
            <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
              Subir Nueva Imagen
            </label>
            <label className="border-4 border-dashed border-gray-100 hover:border-[#fdce27] rounded-3xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-50 transition-all">
              <ImageIcon className="text-gray-300 w-16 h-16" />
              <span className="text-sm font-bold text-gray-500 text-center">
                Arrastra una imagen o haz clic para seleccionarla
              </span>
              <span className="text-xs text-gray-400 tracking-wider font-semibold">Formatos: JPG, PNG, WEBP</span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={onImagenChange}
              />
            </label>
          </div>

          {preview && (
            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 flex flex-col items-center">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 w-full text-left">Previsualización de Imagen:</h3>
              <img
                src={preview}
                alt="Imagen Corporativa"
                className="max-h-80 w-auto object-contain rounded-xl shadow-lg border-4 border-white"
              />
            </div>
          )}

          {mensaje.texto && (
            <div
              className={`p-4 rounded-xl font-bold flex items-center gap-3 text-sm ${
                mensaje.tipo === 'error'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              {mensaje.tipo === 'exito' && <CheckCircle size={20} />}
              {mensaje.texto}
            </div>
          )}

          <div className="pt-6 border-t border-gray-100 border-dashed">
            <button
              type="submit"
              disabled={guardando || !imagen}
              className="w-full bg-[#1c1c1c] text-white hover:bg-[#fdce27] hover:text-[#1c1c1c] text-sm uppercase tracking-widest font-black px-8 py-5 rounded-2xl shadow-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 border-2 border-transparent hover:border-[#1c1c1c]"
            >
              {guardando ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Imagen Corporativa'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImagenCorporativaAdmin;
