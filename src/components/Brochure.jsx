import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import useSWR from "swr";
import clienteAxios from "../config/axios";
import {
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Share2,
  Link,
  RotateCw,
} from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const fetcher = (url) => clienteAxios(url).then((res) => res.data);

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
const BASE_WIDTH = 816; // ancho base de una hoja carta a 96dpi

// ── Botón de toolbar reutilizable ──────────────────────────────────────────
function ToolbarBtn({ onClick, disabled, title, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: "flex",
        alignItems: "center",
        background: "transparent",
        border: "none",
        color: disabled ? "#555" : "#e8e8e8",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: "5px 8px",
        borderRadius: 4,
        fontSize: 13,
        transition: "background .15s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = "#525252";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}

// ── Separador vertical ─────────────────────────────────────────────────────
function Sep() {
  return (
    <div
      style={{
        width: 1,
        height: 20,
        background: "#555",
        margin: "0 4px",
        flexShrink: 0,
      }}
    />
  );
}

// ── Componente principal ───────────────────────────────────────────────────
export default function Brochure() {
  const { data, isLoading } = useSWR("/api/brochure", fetcher, {
    revalidateOnFocus: false,
  });

  const brochure = data?.data ?? null;

  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [zoomIndex, setZoomIndex] = useState(2); // índice 2 = 100%
  const [rotation, setRotation] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const shareRef = useRef(null);

  const zoom = ZOOM_STEPS[zoomIndex];
  const pageWidth = Math.round(BASE_WIDTH * zoom);

  // Fetch PDF como Blob para evitar que el browser muestre su toolbar nativa
  useEffect(() => {
    if (!brochure) return;
    let objectUrl = null;
    setPdfUrl(null);
    clienteAxios
      .get("/api/brochure/stream", { responseType: "arraybuffer" })
      .then((res) => {
        const blob = new Blob([res.data], { type: "application/pdf" });
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      })
      .catch(() => setPdfUrl(null));
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [brochure]);

  // Cerrar share al click afuera
  useEffect(() => {
    const fn = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target))
        setShowShare(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Escape cierra fullscreen
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  // Bloquear scroll del body en fullscreen
  useEffect(() => {
    document.body.style.overflow = fullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  // Atajos de teclado
  useEffect(() => {
    const fn = (e) => {
      if (e.target.tagName === "INPUT") return;
      if ((e.ctrlKey || e.metaKey) && e.key === "=") {
        e.preventDefault();
        handleZoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        handleZoomOut();
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") handleNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") handlePrev();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [pageNumber, numPages, zoomIndex]);

  const handleZoomIn = () =>
    setZoomIndex((i) => Math.min(i + 1, ZOOM_STEPS.length - 1));
  const handleZoomOut = () => setZoomIndex((i) => Math.max(i - 1, 0));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const goToPage = (n) => {
    const clamped = Math.max(1, Math.min(n, numPages ?? 1));
    setPageNumber(clamped);
    setPageInput(String(clamped));
    setPageLoading(true);
  };
  const handleNext = () => {
    if (pageNumber < (numPages ?? 1)) goToPage(pageNumber + 1);
  };
  const handlePrev = () => {
    if (pageNumber > 1) goToPage(pageNumber - 1);
  };

  const handlePageBlur = () => {
    const n = parseInt(pageInput, 10);
    if (!isNaN(n)) goToPage(n);
    else setPageInput(String(pageNumber));
  };

  // Compartir
  const shareUrl = `${window.location.origin}/brochure`;
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: brochure?.nombre, url: shareUrl });
        return;
      } catch {
        /* cancelado */
      }
    }
    setShowShare((v) => !v);
  };
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${brochure?.nombre ?? "Brochure"} - ${shareUrl}`,
  )}`;

  // ── Loading / vacío ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-[#fdce27] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!brochure) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <FileText size={48} className="mb-4" />
        <p className="text-lg font-medium">No hay brochure disponible</p>
      </div>
    );
  }

  // ── JSX parciales (NO son componentes, son variables JSX para evitar remount) ──

  const toolbar = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 48,
        minHeight: 48,
        background: "#3c3c3c",
        borderBottom: "1px solid #2a2a2a",
        padding: "0 10px",
        gap: 4,
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {/* ── Izquierda: navegación ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        <ToolbarBtn
          onClick={handlePrev}
          disabled={pageNumber <= 1}
          title="Página anterior (←)"
        >
          <ChevronLeft size={18} />
        </ToolbarBtn>

        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <input
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onBlur={handlePageBlur}
            onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
            style={{
              width: 38,
              textAlign: "center",
              background: "#525252",
              border: "1px solid #666",
              borderRadius: 4,
              color: "#fff",
              fontSize: 13,
              padding: "3px 2px",
              outline: "none",
            }}
          />
          <span style={{ color: "#aaa", fontSize: 13 }}>
            / {numPages ?? "—"}
          </span>
        </div>

        <ToolbarBtn
          onClick={handleNext}
          disabled={pageNumber >= (numPages ?? 1)}
          title="Página siguiente (→)"
        >
          <ChevronRight size={18} />
        </ToolbarBtn>
      </div>

      {/* ── Centro: zoom + rotar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        <ToolbarBtn
          onClick={handleZoomOut}
          disabled={zoomIndex === 0}
          title="Reducir zoom (Ctrl -)"
        >
          <ZoomOut size={17} />
        </ToolbarBtn>

        <div
          style={{
            background: "#525252",
            border: "1px solid #666",
            borderRadius: 4,
            color: "#ddd",
            fontSize: 13,
            padding: "3px 8px",
            minWidth: 52,
            textAlign: "center",
          }}
        >
          {Math.round(zoom * 100)}%
        </div>

        <ToolbarBtn
          onClick={handleZoomIn}
          disabled={zoomIndex === ZOOM_STEPS.length - 1}
          title="Ampliar zoom (Ctrl +)"
        >
          <ZoomIn size={17} />
        </ToolbarBtn>

        <Sep />

        <ToolbarBtn onClick={handleRotate} title="Rotar 90°">
          <RotateCw size={16} />
        </ToolbarBtn>
      </div>

      {/* ── Derecha: compartir, fullscreen, descargar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Compartir */}
        <div style={{ position: "relative" }} ref={shareRef}>
          <ToolbarBtn onClick={handleShare} title="Compartir">
            <Share2 size={16} />
            <span
              style={{ fontSize: 12, marginLeft: 5 }}
              className="hidden sm:inline"
            >
              Compartir
            </span>
          </ToolbarBtn>

          {showShare && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 6px)",
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,.4)",
                border: "1px solid #e5e7eb",
                zIndex: 200,
                overflow: "hidden",
                width: 200,
              }}
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowShare(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  textDecoration: "none",
                  color: "#1c1c1c",
                  fontSize: 13,
                }}
                className="hover:bg-gray-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <button
                onClick={copyLink}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  width: "100%",
                  background: "none",
                  border: "none",
                  color: "#1c1c1c",
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                className="hover:bg-gray-50"
              >
                <Link size={16} color="#3b82f6" />
                {copied ? "¡Copiado!" : "Copiar link"}
              </button>
            </div>
          )}
        </div>

        <Sep />

        {/* Descargar */}
        <a
          href={brochure.archivo}
          download
          target="_blank"
          rel="noopener noreferrer"
          title="Descargar PDF"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#fdce27",
            color: "#1c1c1c",
            fontWeight: 700,
            fontSize: 13,
            padding: "5px 12px",
            borderRadius: 4,
            textDecoration: "none",
            transition: "filter .15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.filter = "brightness(.9)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
        >
          <Download size={15} />
          <span className="hidden sm:inline">Descargar</span>
        </a>
      </div>
    </div>
  );

  // ── Área de canvas del PDF ─────────────────────────────────────────────
  const pdfCanvas = (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "auto",
        background: "#525659",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "28px 20px",
      }}
    >
      {!pdfUrl ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 300,
          }}
        >
          <div className="w-10 h-10 border-4 border-[#fdce27] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setPageNumber(1);
            setPageInput("1");
          }}
          loading={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 300,
              }}
            >
              <div className="w-10 h-10 border-4 border-[#fdce27] border-t-transparent rounded-full animate-spin" />
            </div>
          }
          error={
            <div style={{ color: "#f87171", padding: 32, textAlign: "center" }}>
              No se pudo cargar el PDF.
            </div>
          }
        >
          <div style={{ position: "relative" }}>
            <Page
              key={`${pageNumber}-${zoom}-${rotation}`}
              pageNumber={pageNumber}
              width={pageWidth}
              rotate={rotation}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              onRenderSuccess={() => setPageLoading(false)}
              loading={null}
            />
            {/* Overlay de carga entre páginas */}
            {pageLoading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,.55)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="w-10 h-10 border-4 border-[#fdce27] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </Document>
      )}
    </div>
  );

  // ── Shell del visor (toolbar + canvas) ────────────────────────────────
  const viewerShell = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      {toolbar}
      {pdfCanvas}
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* VISTA NORMAL embebida en la página */}
      {!fullscreen && (
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-6">
              <h2 className="text-3xl font-black uppercase tracking-tight text-[#1c1c1c]">
                {brochure.nombre}
              </h2>
              <div className="h-1 w-16 bg-[#fdce27] mt-2" />
            </div>

            <div
              style={{
                height: "82vh",
                maxHeight: 920,
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,.3)",
              }}
            >
              {viewerShell}
            </div>
          </div>
        </section>
      )}

      {/* FULLSCREEN */}
      {fullscreen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {viewerShell}
        </div>
      )}
    </>
  );
}
