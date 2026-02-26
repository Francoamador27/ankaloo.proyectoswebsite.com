import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "async-css",
      transformIndexHtml(html, ctx) {
        if (ctx?.server) return html;

        const cssLinkRegex = /<link\s+rel="stylesheet"\s+([^>]*href="[^"]+\.css"[^>]*)>/g;

        return html.replace(cssLinkRegex, (match, attrs) => {
          const hrefMatch = attrs.match(/href="([^"]+)"/);
          if (!hrefMatch) return match;

          const safeAttrs = attrs.replace(/\s+rel="stylesheet"/g, "");
          const preloadTag = `<link rel="preload" as="style" ${safeAttrs} onload="this.onload=null;this.rel='stylesheet'">`;
          const noscriptTag = `<noscript><link rel="stylesheet" ${safeAttrs}></noscript>`;
          return `${preloadTag}${noscriptTag}`;
        });
      },
    },
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      workbox: {
        maximumFileSizeToCacheInBytes: 3000000, // 3 MB
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "robots.txt",
      ],
      manifest: {
        name: "RevenanTravel",
        short_name: "RevenanTravel",
        description:"Tu agencia de viajes confiable para experiencias inolvidables",
                theme_color: "#1f2937", // gris oscuro elegante (podés cambiarlo por tu color de marca)
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/android-launchericon-192-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        categories: ["business", "construction", "home"],
        lang: "es-AR",
      },
    }),
  ],
});
