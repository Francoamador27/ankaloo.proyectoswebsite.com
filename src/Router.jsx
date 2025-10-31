import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Inicio from "./views/Inicio";
import Login from "./views/Login";
import Register from "./views/Register";
import Product from "./layout/Product";
import AuthLayout from "./layout/AuthLayout";
import MyAccount from "./views/MyAccount";
import CheckOut from "./views/CheckOut";
import AdminLayout from "./layout/AdminLayout";
import Users from "./views/Users";
import CartAbandoment from "./views/CartAbandoment";
import DetalleOrden from "./views/DetalleOrden";
import DetalleProducto from "./views/DetalleProducto";
import DetalleCliente from "./views/DetalleCliente";
import ComoComprar from "./components/ComoComprar";
import Precios from "./components/Precios";
import Ejemplos from "./components/Ejemplos";
import PagoResultado from "./views/PagoResultado";
import NotFound from "./components/NotFound";
import ResetPassword from "./views/ResetPassword";
import Contacto from "./components/Contacto";
import Configuraciones from "./views/Configuraciones";
import QuienesSomos from "./components/QuienesSomos";
import EditarCupon from "./components/EditarCupon";
import TestimoniosForm from "./components/TestimoniosForm";
import PanelTestimonios from "./components/Testimonios/PanelTestimonios";
import EjemplosPanel from "./components/EjemplosAdmin/EjemplosPanel";
import CombosAdmin from "./views/CombosAdmin";
import CreateProducto from "./views/CreateProducto";
import Calendario from "./views/Calendario/Calendario";
import Cita from "./views/Citas/Cita";
import DoctoresList from "./views/Usuarios/DoctoresList";
import Doctor from "./views/Usuarios/Doctor";
import CitasAdmin from "./views/Citas/CitasAdmin";
import PacientesList from "./views/Usuarios/Pacientes/PacientesList";
import Paciente from "./views/Usuarios/Pacientes/Paciente";
import HistorialPaciente from "./views/Usuarios/Pacientes/HistorialPaciente";
import Servicios from "./views/Servicios";
import ServiciosFront from "./components/ServiciosFront";
import ServiciosShow from "./components/Servicios/ServiciosShow";
import Finanzas from "./components/Finanzas/Finanzas";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Inicio /> },
      { path: "/servicios", element: <ServiciosFront /> },
      { path: "/servicios/:id", element: <ServiciosShow /> },
      { path: "/como-comprar", element: <ComoComprar /> },
      { path: "/contacto", element: <Contacto /> },
      { path: "/quienes-somos", element: <QuienesSomos /> },
      { path: "/precios", element: <Precios /> },
      { path: "/ejemplos", element: <Ejemplos /> },
      { path: "/finalizar-compra", element: <CheckOut /> },
      { path: "auth/login", element: <Login /> },
      { path: "auth/reset-password", element: <ResetPassword /> },
      { path: "auth/register", element: <Register /> },
      { path: "/pagos/:estado", element: <PagoResultado /> },

    ],
  },
  {
    path: "/mi-cuenta",
    element: <AuthLayout />,
    children: [
      { index: true, element: <MyAccount /> },

    ],
  },
  {
    path: "/admin-dash",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Calendario /> },
      { path: '/admin-dash/citas', element: <CitasAdmin /> },
      { path: '/admin-dash/citas/:id', element: <Cita /> },
      { path: "ordenes/:id", element: <DetalleOrden /> }, // /admin-dash/ordenes/15
      { path: '/admin-dash/combos', element: <CombosAdmin /> },
      { path: "/admin-dash/productos/editar/:id", element: <DetalleProducto /> }, // /admin-dash/ordenes/15
      { path: "/admin-dash/clientes/:id", element: <DetalleCliente /> }, // /admin-dash/ordenes/15
      { path: '/admin-dash/usuarios', element: <Users /> },
      { path: '/admin-dash/pacientes', element: <PacientesList /> },
      { path: '/admin-dash/pacientes/:id', element: <Paciente /> },
      { path: '/admin-dash/pacientes/historial/:id', element: <HistorialPaciente /> },
      { path: '/admin-dash/doctores', element: <DoctoresList /> },
      { path: '/admin-dash/doctores/:id', element: <Doctor /> },
      { path: '/admin-dash/carritos-abandonados', element: <CartAbandoment /> },
      { path: '/admin-dash/testimonios', element: <PanelTestimonios /> },
      { path: '/admin-dash/ejemplos', element: <EjemplosPanel /> },
      { path: '/admin-dash/create-product', element: <CreateProducto /> },
      { path: '/admin-dash/tratamientos', element: <Servicios /> },
      { path: '/admin-dash/finanzas', element: <Finanzas  /> },

      {
        path: "/admin-dash/configuraciones",
        element: <Configuraciones />
      },
      {
        path: "/admin-dash/descuentos/:id",
        element: <EditarCupon />
      }

    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
