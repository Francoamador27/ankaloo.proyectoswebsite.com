import { useMemo } from "react";
import DOMPurify from "dompurify";

// Muestra la descripción cargada con CKEditor respetando el estilo original
// de PlantaDetalle (viñetas ❯ amarillas, texto gris liviano).
export default function DescripcionHtml({ html, className = "" }) {
  const limpio = useMemo(
    () =>
      DOMPurify.sanitize(html || "", {
        ADD_ATTR: ["target", "rel"],
      }),
    [html],
  );

  if (!limpio.trim()) return null;

  return (
    <>
      <style>{`
        .abast-desc { font-size: 1.125rem; line-height: 1.625; color: #5a5a5a; font-weight: 300; }
        .abast-desc > * + * { margin-top: 0.75rem; }
        .abast-desc ul, .abast-desc ol { list-style: none; padding: 0; margin: 0; }
        .abast-desc li { position: relative; padding-left: 1.5rem; }
        .abast-desc li + li { margin-top: 0.75rem; }
        .abast-desc ul > li::before {
          content: "❯"; position: absolute; left: 0; top: 0;
          color: #fdce27; font-weight: 900;
        }
        .abast-desc ol { counter-reset: abast; }
        .abast-desc ol > li::before {
          counter-increment: abast; content: counter(abast) ".";
          position: absolute; left: 0; top: 0; color: #fdce27; font-weight: 900;
        }
        .abast-desc li ul, .abast-desc li ol { margin-top: 0.5rem; }
        .abast-desc strong, .abast-desc b { font-weight: 700; color: #1c1c1c; }
        .abast-desc h2, .abast-desc h3, .abast-desc h4 {
          color: #1c1c1c; font-weight: 900; letter-spacing: -0.025em; line-height: 1.2;
        }
        .abast-desc h2 { font-size: 1.5rem; }
        .abast-desc h3 { font-size: 1.25rem; }
        .abast-desc h4 { font-size: 1.125rem; }
        .abast-desc a { color: #1c1c1c; font-weight: 600; text-decoration: underline; text-decoration-color: #fdce27; text-underline-offset: 3px; }
        .abast-desc blockquote { border-left: 4px solid #fdce27; padding-left: 1rem; font-style: italic; }
      `}</style>
      <div
        className={`abast-desc ${className}`}
        dangerouslySetInnerHTML={{ __html: limpio }}
      />
    </>
  );
}
