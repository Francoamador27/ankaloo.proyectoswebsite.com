# Anka Loo — sitio web (frontend)

Sitio de **Anka Loo**, empresa constructora de Córdoba (obras hidráulicas, viales, saneamiento, urbanizaciones, obras civiles). Dominio: https://ankaloo.com.ar/

## Stack
- React + Vite (SPA, sin SSR). Entrada: `index.html` → `src/main.jsx` → `src/Router.jsx` (React Router, `createBrowserRouter`).
- Tailwind CSS (`@tailwindcss/vite`).
- Casi todas las vistas se cargan con `lazy(() => import(...))` → cada una genera su propio chunk JS/CSS con hash en `/assets/`.
- Plugin propio `async-css` en `vite.config.js`: convierte los `<link rel="stylesheet">` del build en `preload` + `onload`.
- SEO por página con el componente `src/components/Head/Head.jsx` (SEOHead), que actualiza title/meta al renderizar. Como es una SPA, el `index.html` estático también tiene title y meta description por defecto (es lo que ve Google si el render falla).

## Backend
- API externa (proyecto aparte, no está en este repo) en `https://api.ankaloo.com.ar`. URL en `VITE_API_URL`, usada por `src/config/axios.js`.
- Variables de entorno (`.env.local` en desarrollo): `VITE_API_URL`, `VITE_TURNSTILE_SITE_KEY`, `VITE_ENTORNO`, `VITE_CKEDITOR_LICENSE_KEY`.
- Son variables de **build**: en producción tienen que estar cargadas en la configuración de Cloudflare Pages.

## Hosting y deploy: Cloudflare Pages
- **No hay Apache ni Nginx.** El sitio está en **Cloudflare Pages**, conectado a GitHub (`Francoamador27/ankaloo.proyectoswebsite.com`, rama `main`).
- **Cada push a `main` hace deploy automático a producción.** No pushear sin confirmar.
- Build: `npm run build` → carpeta `dist/`.
- `public/.htaccess` **no tiene efecto en Pages** (lo dejamos por si algún día se migra a Apache). Los headers en Pages van en `public/_headers` y las redirecciones en `public/_redirects`.
- Fallback SPA: si no hay `404.html`, Pages responde `index.html` con **200** a cualquier ruta inexistente, **incluidos assets que no existen** (ej. un `/assets/x.css` viejo).
- Cada deploy reemplaza todos los archivos: **los chunks con hash del build anterior dejan de existir**.

## Problema conocido: chunks viejos después de un deploy
Un navegador (o Googlebot) con el HTML/JS anterior en caché pide un `/assets/*-hash.css` que ya no existe, recibe HTML y Vite tira `Unable to preload CSS for /assets/...`.
Hubo un caso en que Google indexó la pantalla de error como descripción del sitio ("Algo salió mal. Unable to preload CSS…").

Defensas actuales (no quitarlas):
- `src/main.jsx`: listener de `vite:preloadError` que recarga una vez. Si vuelve a fallar y es solo CSS, deja renderizar igual.
- `src/components/ErrorBoundary.jsx` (`errorElement` del router): **nunca muestra `error.message` en pantalla**, solo lo manda a la consola.
- `index.html`: title, meta description, canonical y og/twitter estáticos.

Después de cambios de SEO: en Search Console, Inspección de URL → "Probar URL publicada" → "Solicitar indexación".

## Notas
- Idioma del sitio y de la comunicación: español (Argentina).
- Analytics: gtag `G-7R9SLGXN05` en `index.html`. No se usa Google Tag Manager.
- No es PWA (`public/site.webmanifest` no se usa).
