import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useBlocker, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ImagePlus,
  Loader,
  RefreshCw,
  Save,
  Trash2,
  UploadCloud,
  X,
  GripVertical,
  ChevronDown,
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
import PlantaCard from "../components/Cards/PlantaCard";
import EditorTexto from "../components/Abastecimiento/EditorTexto";
import Aviso, { useAviso, mensajeError, authHeaders } from "../components/Abastecimiento/Aviso";

const URL_PUBLICA = "/servicios/abastecimiento-para-obras";
const MAX_MB = 5;
const TIPOS = ["image/jpeg", "image/png", "image/webp"];

const FORM_VACIO = {
  titulo: "",
  slug: "",
  subtitulo: "",
  descripcion: "",
  seo_title: "",
  seo_description: "",
  activo: true,
};

const slugify = (txt) =>
  txt
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Devuelve un mensaje de error si el archivo no es una imagen válida
const validarArchivo = (file) => {
  if (!TIPOS.includes(file.type)) return `"${file.name}" no es JPG, PNG o WebP.`;
  if (file.size > MAX_MB * 1024 * 1024)
    return `"${file.name}" pesa ${(file.size / 1024 / 1024).toFixed(1)} MB (máximo ${MAX_MB} MB).`;
  return null;
};

let keySeq = 0;
const nuevaKey = () => `k${++keySeq}`;

// ─── Bloque numerado ───────────────────────────────────────────
function Bloque({ numero, titulo, ayuda, children }) {
  return (
    <section className="bg-white rounded-2xl border-2 border-gray-100 p-5 lg:p-7">
      <div className="flex items-start gap-4 mb-5">
        <span className="w-9 h-9 shrink-0 rounded-xl bg-[#fdce27] text-[#1c1c1c] font-black flex items-center justify-center">
          {numero}
        </span>
        <div>
          <h2 className="text-lg font-black text-[#1c1c1c] leading-tight">{titulo}</h2>
          {ayuda && <p className="text-sm text-gray-500 mt-1">{ayuda}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

// ─── Zona para una imagen ──────────────────────────────────────
function ZonaImagen({ url, onArchivo, onQuitar, aspecto, textoVacio, onError }) {
  const inputRef = useRef(null);
  const [arrastrando, setArrastrando] = useState(false);

  const recibir = (files) => {
    const file = files?.[0];
    if (!file) return;
    const err = validarArchivo(file);
    if (err) return onError(err);
    onArchivo(file);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastrando(false);
          recibir(e.dataTransfer.files);
        }}
        className={`relative ${aspecto} w-full rounded-2xl border-2 border-dashed overflow-hidden cursor-pointer transition-colors ${
          arrastrando
            ? "border-[#fdce27] bg-[#fdce27]/10"
            : url
              ? "border-transparent"
              : "border-gray-300 bg-gray-50 hover:border-[#fdce27] hover:bg-[#fdce27]/5"
        }`}
      >
        {url ? (
          <>
            <img src={url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <span className="inline-flex items-center gap-2 bg-white text-[#1c1c1c] text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl">
                <RefreshCw className="w-4 h-4" /> Cambiar imagen
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
            <p className="font-bold text-[#1c1c1c] text-sm">
              Arrastrá una imagen o <span className="underline decoration-[#fdce27] underline-offset-4">elegila</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">{textoVacio}</p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={TIPOS.join(",")}
        className="hidden"
        onChange={(e) => {
          recibir(e.target.files);
          e.target.value = "";
        }}
      />
      {url && (
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-[#fdce27]"
          >
            <RefreshCw className="w-4 h-4" /> Cambiar
          </button>
          <button
            type="button"
            onClick={onQuitar}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl border-2 border-red-100 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" /> Quitar
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Foto de galería ordenable ─────────────────────────────────
function FotoGaleria({ foto, indice, onQuitar }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: foto.key });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 ${
        isDragging ? "border-[#fdce27] shadow-2xl z-10" : "border-transparent"
      }`}
    >
      <img src={foto.url} alt="" className="w-full h-full object-cover" />
      <button
        type="button"
        {...attributes}
        {...listeners}
        title="Arrastrar para ordenar"
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      />
      <span className="absolute top-2 left-2 bg-[#1c1c1c] text-[#fdce27] text-[10px] font-black px-2 py-1 rounded-md pointer-events-none">
        {indice + 1}
      </span>
      {foto.file && (
        <span className="absolute bottom-2 left-2 bg-[#fdce27] text-[#1c1c1c] text-[9px] font-black uppercase px-2 py-1 rounded-md pointer-events-none">
          Sin guardar
        </span>
      )}
      <GripVertical className="absolute bottom-2 right-2 w-4 h-4 text-white drop-shadow pointer-events-none" />
      <button
        type="button"
        onClick={() => onQuitar(foto.key)}
        title="Quitar foto"
        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/95 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center shadow"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Vista ─────────────────────────────────────────────────────
export default function AdminAbastecimientoForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();
  const aviso = useAviso();

  const [cargando, setCargando] = useState(editando);
  const [guardando, setGuardando] = useState(false);
  const [sucio, setSucio] = useState(false);
  const [errores, setErrores] = useState({});
  const [verSeo, setVerSeo] = useState(false);

  const [form, setForm] = useState(FORM_VACIO);
  const [slugManual, setSlugManual] = useState(false);
  const [portada, setPortada] = useState({ url: null, file: null, quitar: false });
  const [principal, setPrincipal] = useState({ url: null, file: null, quitar: false });
  const [galeria, setGaleria] = useState([]); // [{ key, id?, file?, url }]
  const galeriaInput = useRef(null);
  const [arrastrandoGaleria, setArrastrandoGaleria] = useState(false);

  // Cargar datos al editar
  useEffect(() => {
    if (!editando) return;
    clienteAxios
      .get(`/api/admin/abastecimientos/${id}`, { headers: authHeaders() })
      .then(({ data }) => {
        const d = data.data;
        setForm({
          titulo: d.titulo || "",
          slug: d.slug || "",
          subtitulo: d.subtitulo || "",
          descripcion: d.descripcion || "",
          seo_title: d.seo_title || "",
          seo_description: d.seo_description || "",
          activo: Boolean(d.activo),
        });
        setSlugManual(true);
        setPortada({ url: d.imagen_portada_url, file: null, quitar: false });
        setPrincipal({ url: d.imagen_principal_url, file: null, quitar: false });
        setGaleria((d.galeria || []).map((g) => ({ key: nuevaKey(), id: g.id, url: g.imagen_url })));
        setVerSeo(Boolean(d.seo_title || d.seo_description));
      })
      .catch((err) => aviso.error(mensajeError(err, "No se pudo cargar el servicio")))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Aviso al cerrar la pestaña / navegar con cambios sin guardar
  useEffect(() => {
    if (!sucio) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [sucio]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      sucio && !guardando && currentLocation.pathname !== nextLocation.pathname,
  );

  const cambiar = (campo, valor) => {
    setSucio(true);
    setErrores((e) => ({ ...e, [campo]: undefined }));
    setForm((f) => {
      const nuevo = { ...f, [campo]: valor };
      if (campo === "titulo" && !slugManual) nuevo.slug = slugify(valor);
      return nuevo;
    });
  };

  const setImagen = (setter) => (file) => {
    setSucio(true);
    setter({ url: URL.createObjectURL(file), file, quitar: false });
  };
  const quitarImagen = (setter) => () => {
    setSucio(true);
    setter({ url: null, file: null, quitar: true });
  };

  const agregarFotos = (files) => {
    const validas = [];
    for (const file of Array.from(files || [])) {
      const err = validarArchivo(file);
      if (err) aviso.error(err);
      else validas.push({ key: nuevaKey(), file, url: URL.createObjectURL(file) });
    }
    if (validas.length) {
      setSucio(true);
      setGaleria((g) => [...g, ...validas]);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEndGaleria = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setSucio(true);
    setGaleria((g) =>
      arrayMove(
        g,
        g.findIndex((f) => f.key === active.id),
        g.findIndex((f) => f.key === over.id),
      ),
    );
  };

  // Vista previa: mismo formato que espera PlantaCard
  const preview = useMemo(
    () => ({
      id: form.slug || "vista-previa",
      titulo: form.titulo || "Título del servicio",
      subtitulo: form.subtitulo,
      imagenCard: portada.url,
      imagen: principal.url || portada.url,
    }),
    [form.slug, form.titulo, form.subtitulo, portada.url, principal.url],
  );

  const guardar = async (e) => {
    e?.preventDefault();
    if (!form.titulo.trim()) {
      setErrores({ titulo: "El título es obligatorio." });
      aviso.error("Completá el título del servicio.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "activo") fd.append(k, v ? "1" : "0");
      else fd.append(k, v ?? "");
    });

    if (portada.file) fd.append("imagen_portada", portada.file);
    else if (portada.quitar) fd.append("remove_imagen_portada", "1");
    if (principal.file) fd.append("imagen_principal", principal.file);
    else if (principal.quitar) fd.append("remove_imagen_principal", "1");

    let nuevas = 0;
    const orden = galeria.map((f) => {
      if (f.file) {
        fd.append("galeria[]", f.file);
        return `new:${nuevas++}`;
      }
      return `id:${f.id}`;
    });
    fd.append("galeria_orden", JSON.stringify(orden));

    setGuardando(true);
    try {
      await clienteAxios.post(
        editando ? `/api/admin/abastecimientos/${id}` : "/api/admin/abastecimientos",
        fd,
        { headers: authHeaders() },
      );
      setSucio(false);
      aviso.exito(editando ? "Cambios guardados" : "Servicio creado");
      setTimeout(() => navigate("/admin-dash/abastecimiento"), 600);
    } catch (err) {
      const errs = err?.response?.data?.errors || {};
      setErrores(Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, v[0]])));
      aviso.error(mensajeError(err, "No se pudo guardar"));
      setGuardando(false);
    }
  };

  const input = (campo) =>
    `w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-[#fdce27]/20 text-[#1c1c1c] ${
      errores[campo] ? "border-red-300 focus:border-red-400" : "border-gray-100 focus:border-[#fdce27]"
    }`;
  const Error = ({ campo }) =>
    errores[campo] ? <p className="text-xs font-bold text-red-500 mt-1">{errores[campo]}</p> : null;

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader className="w-12 h-12 text-[#fdce27] animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={guardar} className="max-w-[90rem] mx-auto px-4 pt-4 lg:px-8 lg:pt-8">
      {/* Encabezado */}
      <div className="mb-8">
        <Link
          to="/admin-dash/abastecimiento"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1c1c1c]"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al listado
        </Link>
        <h1 className="text-3xl lg:text-4xl font-black text-[#1c1c1c] tracking-tighter uppercase mt-3">
          {editando ? "Editar servicio" : "Nuevo servicio"}
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] items-start">
        {/* Columna izquierda */}
        <div className="space-y-6 min-w-0">
          <Bloque numero="1" titulo="Información básica">
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-gray-700">
                  Título <span className="text-red-500">*</span>
                </span>
                <input
                  className={`${input("titulo")} mt-1 text-lg font-bold`}
                  value={form.titulo}
                  maxLength={255}
                  onChange={(e) => cambiar("titulo", e.target.value)}
                  placeholder="Ej: Planta de Hormigón"
                  autoFocus={!editando}
                />
                <Error campo="titulo" />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-gray-700">Subtítulo / modelo</span>
                <input
                  className={`${input("subtitulo")} mt-1`}
                  value={form.subtitulo}
                  maxLength={255}
                  onChange={(e) => cambiar("subtitulo", e.target.value)}
                  placeholder="Ej: Planta Betonmac Neo Móvil 70/80"
                />
                <span className="text-xs text-gray-400">Aparece al pie de la tarjeta.</span>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-gray-700">Dirección de la página</span>
                <div
                  className={`mt-1 flex items-stretch rounded-xl border-2 overflow-hidden focus-within:ring-4 focus-within:ring-[#fdce27]/20 ${
                    errores.slug ? "border-red-300" : "border-gray-100 focus-within:border-[#fdce27]"
                  }`}
                >
                  <span className="hidden sm:flex items-center px-3 bg-gray-50 text-xs text-gray-400 border-r-2 border-gray-100 whitespace-nowrap">
                    {URL_PUBLICA}/
                  </span>
                  <input
                    className="flex-1 min-w-0 px-4 py-3 focus:outline-none text-[#1c1c1c]"
                    value={form.slug}
                    maxLength={255}
                    onChange={(e) => {
                      setSlugManual(true);
                      cambiar("slug", slugify(e.target.value));
                    }}
                    placeholder="se-genera-con-el-titulo"
                  />
                </div>
                <Error campo="slug" />
                <span className="text-xs text-gray-400">
                  Se genera sola a partir del título. Si la cambiás, los links viejos dejan de funcionar.
                </span>
              </label>
            </div>
          </Bloque>

          <Bloque
            numero="2"
            titulo="Descripción y características"
            ayuda="Usá viñetas para las características: en la web se muestran con la flecha amarilla ❯."
          >
            <EditorTexto
              value={form.descripcion}
              onChange={(html) => {
                if (html !== form.descripcion) cambiar("descripcion", html);
              }}
              placeholder="Ej: Capacidad de producción: hasta 70–80 m³/h."
            />
          </Bloque>

          <div className="grid gap-6 md:grid-cols-2">
            <Bloque
              numero="3"
              titulo="Imagen de portada"
              ayuda="Fondo de la tarjeta del listado. Ideal: vertical, mínimo 800×1100 px."
            >
              <ZonaImagen
                url={portada.url}
                aspecto="aspect-[4/5]"
                textoVacio={`JPG, PNG o WebP · hasta ${MAX_MB} MB`}
                onArchivo={setImagen(setPortada)}
                onQuitar={quitarImagen(setPortada)}
                onError={aviso.error}
              />
            </Bloque>

            <Bloque
              numero="4"
              titulo="Imagen principal"
              ayuda="Primera foto del detalle. Si la dejás vacía, se usa la portada."
            >
              <ZonaImagen
                url={principal.url}
                aspecto="aspect-[4/3]"
                textoVacio={`Horizontal recomendada · hasta ${MAX_MB} MB`}
                onArchivo={setImagen(setPrincipal)}
                onQuitar={quitarImagen(setPrincipal)}
                onError={aviso.error}
              />
            </Bloque>
          </div>

          <Bloque
            numero="5"
            titulo="Galería de fotos"
            ayuda="Se muestran en el detalle después de la imagen principal. Podés subir varias a la vez y arrastrarlas para ordenarlas."
          >
            <div
              onClick={() => galeriaInput.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setArrastrandoGaleria(true);
              }}
              onDragLeave={() => setArrastrandoGaleria(false)}
              onDrop={(e) => {
                e.preventDefault();
                setArrastrandoGaleria(false);
                agregarFotos(e.dataTransfer.files);
              }}
              className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                arrastrandoGaleria
                  ? "border-[#fdce27] bg-[#fdce27]/10"
                  : "border-gray-300 bg-gray-50 hover:border-[#fdce27] hover:bg-[#fdce27]/5"
              }`}
            >
              <ImagePlus className="w-9 h-9 text-gray-400 mx-auto mb-2" />
              <p className="font-bold text-sm text-[#1c1c1c]">
                Arrastrá fotos acá o <span className="underline decoration-[#fdce27] underline-offset-4">elegilas</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Varias a la vez · JPG, PNG o WebP · hasta {MAX_MB} MB cada una
              </p>
            </div>
            <input
              ref={galeriaInput}
              type="file"
              multiple
              accept={TIPOS.join(",")}
              className="hidden"
              onChange={(e) => {
                agregarFotos(e.target.files);
                e.target.value = "";
              }}
            />

            {galeria.length > 0 && (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndGaleria}>
                <SortableContext items={galeria.map((f) => f.key)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 mt-5">
                    {galeria.map((foto, i) => (
                      <FotoGaleria
                        key={foto.key}
                        foto={foto}
                        indice={i}
                        onQuitar={(key) => {
                          setSucio(true);
                          setGaleria((g) => g.filter((f) => f.key !== key));
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
            {errores["galeria.0"] && <p className="text-xs font-bold text-red-500 mt-2">{errores["galeria.0"]}</p>}
          </Bloque>

          <section className="bg-white rounded-2xl border-2 border-gray-100">
            <button
              type="button"
              onClick={() => setVerSeo((v) => !v)}
              className="w-full flex items-center justify-between p-5 lg:p-7 text-left"
            >
              <div>
                <h2 className="text-lg font-black text-[#1c1c1c]">SEO (opcional)</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Cómo aparece en Google. Si lo dejás vacío se arma con el título y la descripción.
                </p>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${verSeo ? "rotate-180" : ""}`} />
            </button>
            {verSeo && (
              <div className="px-5 lg:px-7 pb-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-bold text-gray-700">
                    Título para Google <span className="font-normal text-gray-400">({form.seo_title.length}/60 recomendado)</span>
                  </span>
                  <input
                    className={`${input("seo_title")} mt-1`}
                    value={form.seo_title}
                    maxLength={255}
                    onChange={(e) => cambiar("seo_title", e.target.value)}
                    placeholder={`${form.titulo || "Planta de Hormigón"} - Anka Loo`}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-gray-700">
                    Descripción para Google <span className="font-normal text-gray-400">({form.seo_description.length}/300)</span>
                  </span>
                  <textarea
                    rows={3}
                    maxLength={300}
                    className={`${input("seo_description")} mt-1 resize-none`}
                    value={form.seo_description}
                    onChange={(e) => cambiar("seo_description", e.target.value)}
                  />
                </label>
              </div>
            )}
          </section>
        </div>

        {/* Columna derecha: vista previa + visibilidad */}
        <aside className="space-y-6 lg:sticky lg:top-6">
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="font-black text-[#1c1c1c]">Mostrar en la web</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {form.activo ? "Visible para todos los visitantes." : "Oculto: solo lo ves en el admin."}
                </p>
              </div>
              <input
                type="checkbox"
                className="sr-only peer"
                checked={form.activo}
                onChange={(e) => cambiar("activo", e.target.checked)}
              />
              <span className="relative w-12 h-7 shrink-0 rounded-full bg-gray-300 peer-checked:bg-[#fdce27] transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:w-5 after:h-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
            </label>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
              Vista previa de la tarjeta
            </p>
            <div className="pointer-events-none select-none">
              <PlantaCard key={preview.imagenCard || "sin-portada"} planta={preview} />
            </div>
          </div>
        </aside>
      </div>

      {/* Barra inferior fija */}
      <div className="sticky bottom-0 z-20 mt-8 -mx-4 lg:-mx-8 bg-white/95 backdrop-blur border-t-2 border-gray-100">
        <div className="px-4 lg:px-8 py-4 flex items-center justify-end gap-3">
          {sucio && (
            <span className="hidden sm:inline mr-auto text-sm font-bold text-gray-500">
              Tenés cambios sin guardar
            </span>
          )}
          <Link
            to="/admin-dash/abastecimiento"
            className="px-5 py-3 rounded-xl border-2 border-gray-200 font-black uppercase tracking-wider text-xs text-gray-600 hover:border-gray-400"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={guardando}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fdce27] hover:bg-[#1c1c1c] text-[#1c1c1c] hover:text-[#fdce27] font-black uppercase tracking-wider text-xs shadow-lg transition-colors disabled:opacity-60"
          >
            {guardando ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {guardando ? "Guardando…" : editando ? "Guardar cambios" : "Crear servicio"}
          </button>
        </div>
      </div>

      {/* Confirmación al salir con cambios */}
      {blocker.state === "blocked" && (
        <div className="fixed inset-0 z-[1300] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 lg:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-black text-[#1c1c1c]">¿Salir sin guardar?</h3>
            <p className="text-gray-600 mt-3">Los cambios que hiciste en este servicio se van a perder.</p>
            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => blocker.reset()}
                className="px-5 py-3 rounded-xl border-2 border-gray-200 font-black uppercase tracking-wider text-xs text-gray-600"
              >
                Seguir editando
              </button>
              <button
                type="button"
                onClick={() => blocker.proceed()}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs"
              >
                Salir sin guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <Aviso aviso={aviso.aviso} />
    </form>
  );
}
