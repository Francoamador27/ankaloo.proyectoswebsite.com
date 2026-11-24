import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { Provider } from "./context/Provider";

import "./index.css";

// Fuentes
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

import GTMBody from "./components/BodyVerification/GTMBody";

// Si un chunk/CSS de un build anterior ya no existe (deploy nuevo), recargamos
// una sola vez para traer el index.html con los hashes actuales.
// Si vuelve a fallar, un CSS faltante no debe tirar la página entera:
// se renderiza el contenido igual (mejor eso que la pantalla de error).
window.addEventListener("vite:preloadError", (event) => {
  const KEY = "vite-preload-reload-at";
  const last = Number(sessionStorage.getItem(KEY) || 0);
  if (Date.now() - last > 10000) {
    sessionStorage.setItem(KEY, String(Date.now()));
    event.preventDefault();
    window.location.reload();
    return;
  }
  const message = String(event.payload?.message || "").toLowerCase();
  if (message.includes("unable to preload css")) {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")).render(
    <Provider>
      {/* GTM / scripts globales */}
      <GTMBody gtmId={"sadas"} />

      {/* App con router */}
      <RouterProvider router={router} />
    </Provider>
);