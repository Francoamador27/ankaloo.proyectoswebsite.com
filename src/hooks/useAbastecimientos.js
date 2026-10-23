import useSWR from "swr";
import clienteAxios from "../config/axios";

const fetcher = (url) => clienteAxios(url).then((res) => res.data);

export const SECCION_DEFAULT = {
  titulo: "Abastecimientos para",
  titulo_destacado: "obras",
  seo_description:
    "Plantas propias de hormigón y asfalto de Anka Loo en Río Cuarto, al servicio de la logística y provisión de insumos para nuestras obras.",
};

// Adapta la respuesta de la API a la forma que usan PlantaCard / PlantaDetalle
// (la misma que tenía el antiguo src/data/abastecimientoPlantas.json).
export const toPlanta = (item) => ({
  id: item.slug,
  titulo: item.titulo,
  subtitulo: item.subtitulo,
  descripcion: item.descripcion || "",
  imagen: item.imagen_principal_url || item.imagen_portada_url,
  imagenCard: item.imagen_portada_url,
  galeria: (item.galeria || []).map((g) => g.imagen_url).filter(Boolean),
  seoTitle: item.seo_title,
  seoDescription: item.seo_description,
});

export function useAbastecimientos() {
  const { data, error, isLoading } = useSWR("/api/abastecimientos", fetcher, {
    revalidateOnFocus: false,
  });

  return {
    plantas: (data?.data || []).map(toPlanta),
    seccion: data?.seccion || SECCION_DEFAULT,
    error,
    isLoading,
  };
}

export function useAbastecimiento(slug) {
  const { data, error, isLoading } = useSWR(
    slug ? `/api/abastecimientos/${slug}` : null,
    fetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );

  return {
    planta: data?.data ? toPlanta(data.data) : null,
    error,
    isLoading,
  };
}

// Convierte HTML (descripción) a texto plano, para meta descriptions.
export const htmlToText = (html = "") =>
  html
    .replace(/<\/(li|p|h\d)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
