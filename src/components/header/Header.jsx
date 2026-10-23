import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import useSWR from "swr";
import {
  Menu,
  X,
  Phone,
  User,
  ShoppingCart,
  ChevronDown,
  Briefcase,
} from "lucide-react";

import logo from "../../assets/img/logo/logo-blanco-ankaloo.png";
import logo_azul from "../../assets/img/logo/logo-ankaloo.png";
import clienteAxios from "../../config/axios";

const fetcher = (url) => clienteAxios(url).then((res) => res.data);
const ABASTECIMIENTO_HREF = "/servicios/abastecimiento-para-obras";
const INFRAESTRUCTURA_HREF = "/servicios?menu=infraestructura";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Desplegable "Servicios" (desktop)
  const [serviciosOpen, setServiciosOpen] = useState(false);
  const serviciosRef = useRef(null);
  const serviciosCloseTimer = useRef(null);

  const abrirServiciosHover = () => {
    clearTimeout(serviciosCloseTimer.current);
    setServiciosOpen(true);
  };
  const cerrarServiciosHover = () => {
    clearTimeout(serviciosCloseTimer.current);
    serviciosCloseTimer.current = setTimeout(() => setServiciosOpen(false), 150);
  };

  // Desplegable "Servicios" (mobile, acordeón)
  const [serviciosOpenMobile, setServiciosOpenMobile] = useState(false);

  const { data } = useSWR("/api/brochure", fetcher, {
    revalidateOnFocus: false,
  });
  const brochure = data?.data ?? null;

  // Limpiar el timer del hover al desmontar
  useEffect(() => {
    return () => clearTimeout(serviciosCloseTimer.current);
  }, []);

  // Cerrar el desplegable de escritorio al hacer clic afuera
  useEffect(() => {
    const onClickOutside = (e) => {
      if (serviciosRef.current && !serviciosRef.current.contains(e.target)) {
        setServiciosOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Cerrar todo al cambiar de página
  useEffect(() => {
    setServiciosOpen(false);
    setServiciosOpenMobile(false);
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // States for Auth (kept commented out as in original)
  /*
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = UseAuth({ middleware: 'guest' });
  */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const leftNav = [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/servicios" },
    { label: "Equipos", href: "/maquinarias" },
    // { label: "Calidad", href: "/calidad" },
  ];

  const rightNav = [
    // { label: "Sede", href: "/sede" },
    { label: "Quiénes Somos", href: "/quienes-somos" },
    ...(brochure
      ? [
          {
            label: "Brochure",
            href: brochure.archivo,
            external: true,
          },
        ]
      : []),
    //i { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contacto" },
    { label: "Trabaja con Nosotros", href: "/trabaja-con-nosotros" },
  ];

  // Determinar si usar estilo claro (para home sin scroll) u oscuro (para home con scroll o cualquier otra página)
  const useDarkStyle = !isHome || scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          useDarkStyle
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200"
            : "bg-white/10 backdrop-blur-md border-b border-white/20"
        }`}
      >
        <nav className="px-6 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* LOGO A LA IZQUIERDA */}
            <Link to="/" className="relative flex items-center gap-3 group">
              {/* Glow effect */}
              <div className="absolute -inset-3 bg-[#fdce27]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              {/* Logo */}
              <img
                src={useDarkStyle ? logo_azul : logo}
                alt="Anka Loo"
                width={120}
                height={48}
                className="relative z-10 object-contain w-auto h-10 transition-transform duration-500 md:h-12 group-hover:scale-105"
              />
            </Link>

            {/* NAVEGACION (Desktop) */}
            <ul className="items-center hidden gap-1 lg:flex">
              {[...leftNav, ...rightNav].map((item, i) =>
                item.label === "Servicios" ? (
                  <li
                    key={i}
                    className="relative"
                    ref={serviciosRef}
                    onMouseEnter={abrirServiciosHover}
                    onMouseLeave={cerrarServiciosHover}
                  >
                    <button
                      type="button"
                      onClick={() => setServiciosOpen((o) => !o)}
                      className={`relative px-5 py-2 text-[14px] font-bold tracking-tight transition-all duration-300 flex items-center gap-1 ${
                        useDarkStyle
                          ? "text-slate-700 hover:text-[#1c1c1c]"
                          : "text-white/90 hover:text-[#fdce27]"
                      }`}
                    >
                      Servicios
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${serviciosOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Panel desplegable */}
                    <div
                      className={`absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-200 origin-top ${
                        serviciosOpen
                          ? "opacity-100 scale-100 visible"
                          : "opacity-0 scale-95 invisible pointer-events-none"
                      }`}
                    >
                      <div className="py-2">
                        {/* Desarrollo de infraestructura */}
                        <Link
                          to={INFRAESTRUCTURA_HREF}
                          className="block px-5 py-3 text-sm font-black tracking-tight text-slate-800 hover:bg-[#fdce27]/10 hover:text-[#1c1c1c] transition-colors"
                        >
                          Desarrollo de infraestructura
                        </Link>

                        {/* Abastecimiento para obras */}
                        <Link
                          to={ABASTECIMIENTO_HREF}
                          className="block px-5 py-3 text-sm font-black tracking-tight text-slate-800 hover:bg-[#fdce27]/10 hover:text-[#1c1c1c] transition-colors border-t border-slate-100"
                        >
                          Abastecimiento para obras
                        </Link>
                      </div>
                    </div>
                  </li>
                ) : item.external ? (
                  <li key={i}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative px-5 py-2 text-[14px] font-bold tracking-tight transition-all duration-300 group ${
                        useDarkStyle
                          ? "text-slate-700 hover:text-[#1c1c1c]"
                          : "text-white/90 hover:text-[#fdce27]"
                      }`}
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#fdce27] transition-all duration-300 group-hover:w-3/4"></span>
                    </a>
                  </li>
                ) : (
                  <li key={i}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) => `
                      relative px-5 py-2 text-[14px] font-bold tracking-tight  transition-all duration-300
                      ${
                        useDarkStyle
                          ? isActive
                            ? "text-[#1c1c1c] border-b-2 border-[#fdce27]"
                            : "text-slate-700 hover:text-[#1c1c1c]"
                          : isActive
                            ? "text-[#fdce27]"
                            : "text-white/90 hover:text-[#fdce27]"
                      }
                      group
                    `}
                    >
                      {item.label}
                      <span
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#fdce27] transition-all duration-300 group-hover:w-3/4 ${({ isActive }) => (isActive ? "w-3/4" : "")}`}
                      ></span>
                    </NavLink>
                  </li>
                )
              )}
            </ul>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
                useDarkStyle
                  ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-4 invisible"
          }`}
        >
          <div className="relative p-6 mx-4 mt-3 overflow-hidden border shadow-2xl rounded-3xl border-white/10">
            <div className={`absolute inset-0 bg-white`}></div>

            <ul className="relative space-y-2">
              {[...leftNav, ...rightNav].map((item, i) =>
                item.label === "Servicios" ? (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setServiciosOpenMobile((o) => !o)}
                      className="flex items-center justify-between w-full px-6 py-4 text-base font-bold tracking-tight text-left transition-all rounded-2xl text-slate-700 hover:bg-[#fdce27]/10"
                    >
                      Servicios
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${serviciosOpenMobile ? "rotate-180" : ""}`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${serviciosOpenMobile ? "max-h-[32rem] mt-1" : "max-h-0"}`}
                    >
                      <div className="pl-4 space-y-1">
                        <Link
                          to={INFRAESTRUCTURA_HREF}
                          className="block px-4 py-3 text-sm font-bold rounded-xl text-slate-700 hover:bg-[#fdce27]/10"
                        >
                          Desarrollo de infraestructura
                        </Link>
                        <Link
                          to={ABASTECIMIENTO_HREF}
                          className="block px-4 py-3 text-sm font-bold rounded-xl text-slate-700 hover:bg-[#fdce27]/10"
                        >
                          Abastecimiento para obras
                        </Link>
                      </div>
                    </div>
                  </li>
                ) : item.external ? (
                  <li key={i}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-6 py-4 rounded-2xl text-base font-bold tracking-tight transition-all text-slate-700 hover:bg-[#fdce27]/10"
                    >
                      {item.label}
                    </a>
                  </li>
                ) : (
                  <li key={i}>
                    <NavLink
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => `
                      flex items-center px-6 py-4 rounded-2xl text-base font-bold tracking-tight transition-all
                      ${
                        isActive
                          ? "bg-[#fdce27]/15 text-[#1c1c1c] border-l-4 border-[#fdce27] translate-x-2"
                          : "text-slate-700 hover:bg-[#fdce27]/10"
                      }
                    `}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </header>

      {/* Auth / User Dropdown (Commented out sections from original) */}
      {/* 
      <div className="items-center hidden space-x-4 lg:flex">
          {!user ? (
            <>
              <Link to="/auth/login">Iniciar sesión</Link>
              <Link to="/registro">Probar Gratis</Link>
            </>
          ) : (
            <UserDropdown />
          )}
      </div>
      */}

      <style>{`
        .active-link-indicator {
          width: 75% !important;
        }
      `}</style>
    </>
  );
}
