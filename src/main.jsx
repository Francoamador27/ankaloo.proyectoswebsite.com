import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './Router';
import { Provider } from './context/Provider';

import './index.css';

// Fuentes
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/comfortaa/700.css";
import GTMBody from './components/BodyVerification/GTMBody';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      {/* 👇 Esto se renderiza una sola vez al cargar la app */}
      <GTMBody
        gtmId={"sadas"}
      />
      {/* 👇 El resto de la app y el router */}
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
