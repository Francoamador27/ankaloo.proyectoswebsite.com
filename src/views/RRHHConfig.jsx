import React, { useState, useEffect, useRef } from "react";
import clienteAxios from "../config/axios";
import { Youtube, ImageIcon, Trash2, Save, ExternalLink } from "lucide-react";

const token = () => localStorage.getItem("AUTH_TOKEN");

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes("/embed/")) return url;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const RRHHConfig = () => {
  const [config, setConfig] = useState({ rrhh_video: "", rrhh_imagen: null });
  const [loading, setLoading] = useState(true);
  const [savingVideo, setSavingVideo] = useState(false);
  const [savingImagen, setSavingImagen] = useState(false);
  const [videoInput, setVideoInput] = useState("");
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);
  const [msgVideo, setMsgVideo] = useState({ tipo: "", texto: "" });
  const [msgImagen, setMsgImagen] = useState({ tipo: "", texto: "" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await clienteAxios.get("/api/rrhh-config", {
          headers: { Authorization: `Bearer ${token()}` },
        });
        setConfig(data);
        setVideoInput(data.rrhh_video || "");
        setImagenPreview(data.rrhh_imagen || null);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleGuardarVideo = async (e) => {
    e.preventDefault();
    setSavingVideo(true);
    setMsgVideo({ tipo: "", texto: "" });
    try {
      const { data } = await clienteAxios.post(
        "/api/rrhh-config",
        { rrhh_video: videoInput },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setConfig((prev) => ({ ...prev, rrhh_video: data.rrhh_video }));
      setMsgVideo({ tipo: "ok", texto: "Video guardado correctamente." });
    } catch {
      setMsgVideo({ tipo: "err", texto: "Error al guardar el video." });
    } finally {
      setSavingVideo(false);
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
    setMsgImagen({ tipo: "", texto: "" });
  };

  const handleGuardarImagen = async () => {
    if (!imagenFile) return;
    setSavingImagen(true);
    setMsgImagen({ tipo: "", texto: "" });
    try {
      const fd = new FormData();
      fd.append("rrhh_imagen", imagenFile);
      const { data } = await clienteAxios.post("/api/rrhh-config", fd, {
        headers: { Authorization: `Bearer ${token()}`, "Content-Type": "multipart/form-data" },
      });
      setConfig((prev) => ({ ...prev, rrhh_imagen: data.rrhh_imagen }));
      setImagenPreview(data.rrhh_imagen);
      setImagenFile(null);
      setMsgImagen({ tipo: "ok", texto: "Imagen guardada correctamente." });
    } catch {
      setMsgImagen({ tipo: "err", texto: "Error al subir la imagen." });
    } finally {
      setSavingImagen(false);
    }
  };

  const handleEliminarImagen = async () => {
    if (!window.confirm("¿Eliminar la imagen banner de RRHH?")) return;
    setSavingImagen(true);
    try {
      await clienteAxios.post(
        "/api/rrhh-config",
        { eliminar_imagen: "true" },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setConfig((prev) => ({ ...prev, rrhh_imagen: null }));
      setImagenPreview(null);
      setImagenFile(null);
      setMsgImagen({ tipo: "ok", texto: "Imagen eliminada." });
    } catch {
      setMsgImagen({ tipo: "err", texto: "Error al eliminar la imagen." });
    } finally {
      setSavingImagen(false);
    }
  };

  const embedUrl = getYouTubeEmbedUrl(videoInput);

  if (loading) return <p className="p-6 text-slate-500">Cargando configuración...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-1">Configuración</h1>
        <p className="text-slate-500 text-sm">
          Personalizá el contenido de la página "Trabaja con Nosotros".
        </p>
      </div>

      {/* ── Sección Video ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
            <Youtube size={18} className="text-red-500" />
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-sm">Video de YouTube</h2>
            <p className="text-xs text-slate-400">Se mostrará debajo del hero en la página pública.</p>
          </div>
        </div>

        <form onSubmit={handleGuardarVideo} className="p-6 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500">URL del video</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#fdce27] focus:ring-4 focus:ring-[#fdce27]/10 outline-none transition-all"
              />
              {videoInput && (
                <a
                  href={videoInput}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-xl transition-colors"
                  title="Ver video"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Preview del video */}
          {embedUrl && (
            <div className="rounded-xl overflow-hidden aspect-video bg-black border border-slate-200">
              <iframe
                src={embedUrl}
                title="Preview video RRHH"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}

          {msgVideo.texto && (
            <p className={`text-sm px-4 py-2.5 rounded-xl border ${
              msgVideo.tipo === "ok"
                ? "text-green-700 bg-green-50 border-green-200"
                : "text-red-600 bg-red-50 border-red-200"
            }`}>
              {msgVideo.texto}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingVideo}
              className="flex items-center gap-2 bg-[#fdce27] text-[#1c1c1c] font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-95 transition-all disabled:opacity-50"
            >
              <Save size={15} />
              {savingVideo ? "Guardando..." : "Guardar video"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Sección Imagen Banner ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
            <ImageIcon size={18} className="text-blue-500" />
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-sm">Imagen Banner</h2>
            <p className="text-xs text-slate-400">Imagen destacada para la sección de empleos.</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Preview imagen actual */}
          {imagenPreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src={imagenPreview}
                alt="Banner RRHH"
                className="w-full max-h-64 object-cover"
              />
              <button
                onClick={handleEliminarImagen}
                disabled={savingImagen}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors shadow"
                title="Eliminar imagen"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400 bg-slate-50">
              <ImageIcon size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Sin imagen cargada</p>
            </div>
          )}

          {/* Input file */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImagenChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-slate-200 rounded-xl py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {imagenPreview ? "Cambiar imagen" : "Seleccionar imagen"}
            </button>
            <p className="text-xs text-slate-400 mt-1.5 text-center">JPG, PNG o WebP · máx. 4 MB</p>
          </div>

          {msgImagen.texto && (
            <p className={`text-sm px-4 py-2.5 rounded-xl border ${
              msgImagen.tipo === "ok"
                ? "text-green-700 bg-green-50 border-green-200"
                : "text-red-600 bg-red-50 border-red-200"
            }`}>
              {msgImagen.texto}
            </p>
          )}

          {imagenFile && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleGuardarImagen}
                disabled={savingImagen}
                className="flex items-center gap-2 bg-[#fdce27] text-[#1c1c1c] font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-95 transition-all disabled:opacity-50"
              >
                <Save size={15} />
                {savingImagen ? "Subiendo..." : "Guardar imagen"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RRHHConfig;
