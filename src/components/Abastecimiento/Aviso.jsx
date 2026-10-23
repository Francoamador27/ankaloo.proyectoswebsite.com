import { useCallback, useRef, useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

// Aviso flotante simple (éxito / error) para las vistas de Abastecimiento.
export function useAviso() {
  const [aviso, setAviso] = useState(null);
  const timer = useRef(null);

  const mostrar = useCallback((tipo, texto) => {
    clearTimeout(timer.current);
    setAviso({ tipo, texto });
    timer.current = setTimeout(() => setAviso(null), 3500);
  }, []);

  return {
    aviso,
    exito: useCallback((t) => mostrar("ok", t), [mostrar]),
    error: useCallback((t) => mostrar("error", t), [mostrar]),
  };
}

export default function Aviso({ aviso }) {
  if (!aviso) return null;
  const ok = aviso.tipo === "ok";

  return (
    <div
      role="status"
      className={`fixed z-[1400] bottom-6 right-6 left-6 sm:left-auto max-w-sm flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border-2 font-semibold text-sm ${
        ok
          ? "bg-[#1c1c1c] text-white border-[#fdce27]"
          : "bg-white text-red-700 border-red-200"
      }`}
    >
      {ok ? (
        <CheckCircle className="w-5 h-5 text-[#fdce27] shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
      )}
      <span>{aviso.texto}</span>
    </div>
  );
}

// Extrae el primer mensaje legible de un error de Laravel
export const mensajeError = (err, fallback = "Ocurrió un error. Intentá de nuevo.") => {
  const data = err?.response?.data;
  if (data?.errors) {
    const primero = Object.values(data.errors)[0];
    if (Array.isArray(primero) && primero[0]) return primero[0];
  }
  return data?.message || fallback;
};

export const authHeaders = () => {
  const token = localStorage.getItem("AUTH_TOKEN");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
