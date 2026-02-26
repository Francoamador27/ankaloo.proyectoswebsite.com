import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, User, ShoppingCart, ChevronDown } from "lucide-react";

import logo from '../../assets/img/logo/logo_blanco.png';
import logo_azul from '../../assets/img/logo/logo_negro.png';
import { label } from 'yet-another-react-lightbox';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  // States for Auth (kept commented out as in original)
  /*
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = UseAuth({ middleware: 'guest' });
  */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftNav = [
    { label: "Inicio", href: "/" },
    { label: "Paquetes", href: "/servicios" },
    { label: "Galería", href: "/galeria" },
  ];

  const rightNav = [
    { label: "Quiénes Somos", href: "/quienes-somos" },
    {label:"Blog", href:"/blog"},
    { label: "Contacto", href: "/contacto" },
  ];

  // Determinar si usar estilo claro (para home sin scroll) u oscuro (para home con scroll o cualquier otra página)
  const useDarkStyle = !isHome || scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${useDarkStyle
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200'
          : 'bg-white/10 backdrop-blur-md border-b border-white/20'
          }`}
      >
        <nav className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* LOGO A LA IZQUIERDA */}
            <Link
              to="/"
              className="flex-shrink-0 relative group flex items-center"
            >
              <div className={`absolute -inset-4 bg-[#dc834e]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <img
                src={useDarkStyle ? logo_azul : logo}
                alt="RevenantTravel"
                className="logo-header h-10 md:h-12 w-auto object-contain transition-all duration-500 group-hover:scale-105 relative z-10"
              />
            </Link>

            {/* NAVEGACION (Desktop) */}
            <ul className="hidden lg:flex items-center gap-1">
              {[...leftNav, ...rightNav].map((item, i) => (
                <li key={i}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => `
                      relative px-5 py-2 text-[14px] font-bold tracking-tight uppercase transition-all duration-300
                      ${useDarkStyle
                        ? (isActive ? 'text-[#dc834e]' : 'text-slate-700 hover:text-[#dc834e]')
                        : (isActive ? 'text-white' : 'text-white/90 hover:text-white')
                      }
                      group
                    `}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#dc834e] transition-all duration-300 group-hover:w-3/4 ${({ isActive }) => isActive ? 'w-3/4' : ''}`}></span>
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${useDarkStyle
                ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                : 'bg-white/20 text-white hover:bg-white/30'
                }`}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${mobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
            }`}
        >
          <div className="mx-4 mt-3 p-6 rounded-3xl shadow-2xl overflow-hidden relative border border-white/10">
            <div className={`absolute inset-0 bg-white`}></div>

            <ul className="relative space-y-2">
              {[...leftNav, ...rightNav].map((item, i) => (
                <li key={i}>
                  <NavLink
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center px-6 py-4 rounded-2xl text-base font-bold tracking-tight transition-all
                      ${isActive
                        ? 'bg-[#dc834e]/10 text-[#dc834e] translate-x-2' 
                        :  'text-slate-700 hover:bg-slate-50' 
                      }
                    `}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}

              <li className="pt-4">
                <Link
                  to="/contacto"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-3 py-4 bg-[#dc834e] hover:bg-[#c77542] text-white rounded-2xl font-black text-base shadow-xl shadow-[#dc834e]/20 active:scale-95 transition-all"
                >
                  <Phone size={18} />
                  CONTACTANOS
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Auth / User Dropdown (Commented out sections from original) */}
      {/* 
      <div className="hidden lg:flex items-center space-x-4">
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
