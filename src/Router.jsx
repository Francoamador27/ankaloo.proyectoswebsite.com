import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";
import AdminLayout from "./layout/AdminLayout";
import ErrorBoundary from "./components/ErrorBoundary";
const Posts = lazy(() => import("./views/Posts"));
const Inicio = lazy(() => import("./views/Inicio"));
const Login = lazy(() => import("./views/Login"));
const Register = lazy(() => import("./views/Register"));
const MyAccount = lazy(() => import("./views/MyAccount"));
const CheckOut = lazy(() => import("./views/CheckOut"));
const Users = lazy(() => import("./views/Users"));
const CartAbandoment = lazy(() => import("./views/CartAbandoment"));
const DetalleOrden = lazy(() => import("./views/DetalleOrden"));
const DetalleProducto = lazy(() => import("./views/DetalleProducto"));
const DetalleCliente = lazy(() => import("./views/DetalleCliente"));
const ComoComprar = lazy(() => import("./components/ComoComprar"));
const Precios = lazy(() => import("./components/Precios"));
const Ejemplos = lazy(() => import("./components/Ejemplos"));
const Portafolio = lazy(() => import("./components/Portafolio"));
const PortafolioDetail = lazy(() => import("./components/PortafolioDetail"));
const AdminPortafolioList = lazy(() => import("./views/AdminPortafolioList"));
const AdminPortafolio = lazy(() => import("./views/AdminPortafolio"));
const PagoResultado = lazy(() => import("./views/PagoResultado"));
const NotFound = lazy(() => import("./components/NotFound"));
const ResetPassword = lazy(() => import("./views/ResetPassword"));
const Contacto = lazy(() => import("./components/Contacto"));
const Configuraciones = lazy(() => import("./views/Configuraciones"));
const QuienesSomos = lazy(() => import("./components/QuienesSomos"));
const EditarCupon = lazy(() => import("./components/EditarCupon"));
const TestimoniosForm = lazy(() => import("./components/TestimoniosForm"));
const PanelTestimonios = lazy(() => import("./components/Testimonios/PanelTestimonios"));
const GaleriaPanel = lazy(() => import("./components/GaleriaAdmin/GaleriaPanel"));
const CombosAdmin = lazy(() => import("./views/CombosAdmin"));
const CreateProducto = lazy(() => import("./views/CreateProducto"));
const Calendario = lazy(() => import("./views/Calendario/Calendario"));
const Cita = lazy(() => import("./views/Citas/Cita"));
const DoctoresList = lazy(() => import("./views/Usuarios/DoctoresList"));
const Doctor = lazy(() => import("./views/Usuarios/Doctor"));
const CitasAdmin = lazy(() => import("./views/Citas/CitasAdmin"));
const PacientesList = lazy(() => import("./views/Usuarios/Pacientes/PacientesList"));
const Usuario = lazy(() => import("./views/Usuarios/Pacientes/Paciente"));
const HistorialPaciente = lazy(() => import("./views/Usuarios/Pacientes/HistorialPaciente"));
const Servicios = lazy(() => import("./views/Servicios"));
const ServiciosShow = lazy(() => import("./components/Servicios/ServiciosShow"));
const Finanzas = lazy(() => import("./components/Finanzas/Finanzas"));
const TratamientosForm = lazy(() => import("./views/TratamientosForm"));
const EditServicios = lazy(() => import("./components/Servicios/EditServicios"));
const AdminChatbot = lazy(() => import("./views/AdminChatbot"));
const SlidersAdmin = lazy(() => import("./components/Sliders/SlidersAdmin"));
const ServiciosGrid = lazy(() => import("./components/ServiciosGrid"));
const ServicioDetails = lazy(() => import("./components/ServicioDetails"));
const ServiciosPorCategoria = lazy(() => import("./components/ServiciosPorCategoria"));
const LeadsContacto = lazy(() => import("./components/LeadsContacto"));
const LeadsRRHH = lazy(() => import("./components/LeadsRRHH"));
const TrabajaConNosotros = lazy(() => import("./components/TrabajaConNosotros"));
const BlogList = lazy(() => import("./components/Blog/BlogList"));
const BlogDetail = lazy(() => import("./components/Blog/BlogDetail"));
const Sede = lazy(() => import("./views/Sede"));
const Calidad = lazy(() => import("./views/Calidad"));
const AdminCertificadosList = lazy(() => import("./views/AdminCertificadosList"));
const AdminCertificadoForm = lazy(() => import("./views/AdminCertificadoForm"));
const AdminVideoMain = lazy(() => import("./views/AdminVideoMain"));
const CategoriasServicios = lazy(() => import("./components/CategoriasServicios"));
const ImagenCorporativaAdmin = lazy(() => import("./views/ImagenCorporativaAdmin"));
const AdminFooter = lazy(() => import("./views/AdminFooter"));




const suspense = (node) => (
  <Suspense fallback={<div style={{ minHeight: 200 }} />}>
    {node}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: suspense(<Inicio />) },
      { path: "/servicios", element: suspense(<CategoriasServicios/>) },
      { path: "/servicios/:categoria", element: suspense(<ServiciosGrid />) },
      { path: "/servicio/:slug", element: suspense(<ServicioDetails />) },
      { path: "/blog", element: suspense(<BlogList />) },
      { path: "/blog/:slug", element: suspense(<BlogDetail />) },
      { path: "/como-comprar", element: suspense(<ComoComprar />) },
      { path: "/contacto", element: suspense(<Contacto />) },
      { path: "/trabaja-con-nosotros", element: suspense(<TrabajaConNosotros />) },
      { path: "/quienes-somos", element: suspense(<QuienesSomos />) },
      { path: "/precios", element: suspense(<Precios />) },
      { path: "/maquinarias", element: suspense(<Portafolio />) },
      { path: "/maquinarias/:id", element: suspense(<PortafolioDetail />) },
      { path: "/galeria", element: suspense(<Ejemplos />) },
      { path: "/finalizar-compra", element: suspense(<CheckOut />) },
      { path: "auth/login", element: suspense(<Login />) },
      { path: "auth/reset-password", element: suspense(<ResetPassword />) },
      { path: "auth/register", element: suspense(<Register />) },
      { path: "/pagos/:estado", element: suspense(<PagoResultado />) },
      { path: "/sede", element: suspense(<Sede />) },
      { path: "/calidad", element: suspense(<Calidad />) },



    ],
  },
  {
    path: "/mi-cuenta",
    element: <AuthLayout />,
    children: [
      { index: true, element: suspense(<MyAccount />) },

    ],
  },
  {
    path: "/admin-dash",
    element: <AdminLayout />,
    children: [
      { index: true, element: suspense(<LeadsContacto />) },
      { path: '/admin-dash/citas', element: suspense(<CitasAdmin />) },
      { path: '/admin-dash/citas/:id', element: suspense(<Cita />) },
      { path: "ordenes/:id", element: suspense(<DetalleOrden />) }, // /admin-dash/ordenes/15
      { path: '/admin-dash/combos', element: suspense(<CombosAdmin />) },
      { path: "/admin-dash/productos/editar/:id", element: suspense(<DetalleProducto />) }, // /admin-dash/ordenes/15
      { path: "/admin-dash/clientes/:id", element: suspense(<DetalleCliente />) }, // /admin-dash/ordenes/15
      { path: '/admin-dash/usuarios', element: suspense(<PacientesList />) },
      { path: '/admin-dash/usuarios/nuevo', element: suspense(<Usuario />) },
      { path: '/admin-dash/usuarios/:id', element: suspense(<Usuario />) },
      { path: '/admin-dash/usuarios/historial/:id', element: suspense(<HistorialPaciente />) },
      { path: '/admin-dash/doctores', element: suspense(<DoctoresList />) },
      { path: '/admin-dash/doctores/:id', element: suspense(<Doctor />) },
      { path: '/admin-dash/carritos-abandonados', element: suspense(<CartAbandoment />) },
      { path: '/admin-dash/testimonios', element: suspense(<PanelTestimonios />) },
      { path: '/admin-dash/galeria', element: suspense(<GaleriaPanel />) },
      { path: '/admin-dash/portafolio', element: suspense(<AdminPortafolioList />) },
      { path: '/admin-dash/portafolio/new', element: suspense(<AdminPortafolio />) },
      { path: '/admin-dash/portafolio/:id', element: suspense(<AdminPortafolio />) },
      { path: '/admin-dash/sliders', element: suspense(<SlidersAdmin />) },
      { path: '/admin-dash/create-product', element: suspense(<CreateProducto />) },
      { path: '/admin-dash/servicios', element: suspense(<Servicios />) },
      { path: '/admin-dash/servicios/editar/:id', element: suspense(<EditServicios />) },
      { path: '/admin-dash/posts', element: suspense(<Posts />) },
      { path: '/admin-dash/finanzas', element: suspense(<Finanzas />) },
      { path: '/admin-dash/leads-contacto', element: suspense(<LeadsContacto />) },
      { path: '/admin-dash/leads-rrhh', element: suspense(<LeadsRRHH />) },
      {
        path: "/admin-dash/configuraciones",
        element: suspense(<Configuraciones />)
      },
      {
        path: "/admin-dash/chatbot",
        element: suspense(<AdminChatbot />)
      },
      {
        path: "/admin-dash/descuentos/:id",
        element: suspense(<EditarCupon />)
      },
      { path: '/admin-dash/certificados', element: suspense(<AdminCertificadosList />) },
      { path: '/admin-dash/certificados/new', element: suspense(<AdminCertificadoForm />) },
      { path: '/admin-dash/certificados/:id', element: suspense(<AdminCertificadoForm />) },
      { path: '/admin-dash/video-principal', element: suspense(<AdminVideoMain />) },
      { path: '/admin-dash/imagen-corporativa', element: suspense(<ImagenCorporativaAdmin />) },
      { path: '/admin-dash/footer', element: suspense(<AdminFooter />) },



    ],
  },
  {
    path: "*",
    element: suspense(<NotFound />),
  },
]);

export default router;
