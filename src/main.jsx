import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { Provider } from "./context/Provider";
import { registerSW } from "virtual:pwa-register";

import "./index.css";

// Fuentes
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/comfortaa/700.css";

import GTMBody from "./components/BodyVerification/GTMBody";
import InstallPWAButton from "./components/InstallPWAButton";
import { IOSInstallHint } from "./components/IOSInstallHint";

// 👉 nuevos imports

createRoot(document.getElementById("root")).render(
    <Provider>
      {/* GTM / scripts globales */}
      <GTMBody gtmId={"sadas"} />

      {/* App con router */}
      <RouterProvider router={router} />

      {/* Botón flotante para instalar la PWA (Android / Desktop) */}
      <InstallPWAButton />

      {/* Mensajito opcional para iOS (Agregar a pantalla de inicio) */}
      <IOSInstallHint />
    </Provider>
);

const registerServiceWorker = () => {
  registerSW({
    immediate: false,
  });
};

if ("requestIdleCallback" in window) {
  requestIdleCallback(registerServiceWorker);
} else {
  setTimeout(registerServiceWorker, 2000);
}
