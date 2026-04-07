import logo_blanco from "../../assets/img/logo/logo_ankaloo.png";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import useCont from "../../hooks/useCont";
import { Link } from "react-router-dom";

export default function Footer() {
  const { company, contact, social, footer, settings } = useCont();
  const currentYear = new Date().getFullYear();

  // No renderizar hasta que settings cargue para evitar layout shift
  if (!settings) {
    return (
      <footer className="relative border-t border-slate-200 min-h-[400px] bg-[#f8fafc]" />
    );
  }

  const footerStyle = {
    backgroundColor:
      footer.bg_type === "color" ? footer.bg_color : "transparent",
    backgroundImage:
      footer.bg_type === "image" && footer.bg_image
        ? `url(${footer.bg_image})`
        : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: footer.text_color,
  };

  return (
    <footer
      className="relative border-t border-slate-200 overflow-hidden"
      style={footerStyle}
    >
      {/* Capa de overlay para imagen con escala de grises o brillo opcional */}
      {footer.bg_type === "image" && (
        <div
          className={`absolute inset-0 z-0 ${footer.greyscale ? "grayscale contrast-125 brightness-50" : "bg-black/40"}`}
        >
          <img
            src={footer.bg_image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Elementos decorativos de fondo (solo si no es imagen) */}
      {footer.bg_type === "color" && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#fdce27]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#fdce27]/5 rounded-full blur-3xl pointer-events-none"></div>
        </>
      )}

      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo y breve descripción */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 group">
              <img
                src={footer.logo || logo_blanco}
                alt={`Logo ${company.name}`}
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p
              className="text-sm leading-relaxed font-light opacity-80"
              style={{ color: footer.text_color }}
            >
              Empresa constructora de Córdoba especializada en obras
              hidráulicas, viales, saneamiento y ambientales. Profesionales con
              tecnología de última generación.
            </p>
            {/* Redes Sociales */}
            <div className="flex gap-4 pt-4">
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 hover:bg-[#fdce27] hover:text-[#1c1c1c] rounded-full transition-all duration-300 hover:scale-110 shadow-sm"
                  title="Facebook"
                  style={{ color: footer.text_color }}
                >
                  <FaFacebook className="text-lg" />
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 hover:bg-[#fdce27] hover:text-[#1c1c1c] rounded-full transition-all duration-300 hover:scale-110 shadow-sm"
                  title="Instagram"
                  style={{ color: footer.text_color }}
                >
                  <FaInstagram className="text-lg" />
                </a>
              )}
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-black tracking-widest mb-6 text-[#fdce27]">
              Navegar
            </h3>
            <ul className="space-y-3">
              {["Inicio", "Servicios", "Maquinarias", "Quiénes Somos"].map(
                (item, idx) => {
                  const paths = [
                    "/",
                    "/servicios",
                    "/maquinarias",
                    "/quienes-somos",
                  ];
                  return (
                    <li key={idx}>
                      <Link
                        to={paths[idx]}
                        className="hover:text-[#fdce27] transition-colors text-sm font-medium opacity-70 hover:opacity-100"
                        style={{ color: footer.text_color }}
                      >
                        {item}
                      </Link>
                    </li>
                  );
                },
              )}
            </ul>
          </div>

          {/* Otros Links */}
          <div>
            <h3 className="text-lg font-black tracking-widest mb-6 text-[#fdce27]">
              Empresa
            </h3>
            <ul className="space-y-3">
              {["Contacto", "Blog", "Trabaja con Nosotros"].map((item, idx) => {
                const paths = ["/contacto", "/blog", "/trabaja-con-nosotros"];
                return (
                  <li key={idx}>
                    <Link
                      to={paths[idx]}
                      className="hover:text-[#fdce27] transition-colors text-sm font-medium opacity-70 hover:opacity-100"
                      style={{ color: footer.text_color }}
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Información de Contacto */}
          <div>
            <h3 className="text-lg font-black tracking-widest mb-6 text-[#fdce27]">
              Contacto
            </h3>
            <div className="space-y-4">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-start gap-3 hover:text-[#fdce27] transition-colors group opacity-70 hover:opacity-100"
                  style={{ color: footer.text_color }}
                >
                  <Mail
                    size={18}
                    className="flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-sm">{contact.email}</span>
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-start gap-3 hover:text-[#fdce27] transition-colors group opacity-70 hover:opacity-100"
                  style={{ color: footer.text_color }}
                >
                  <Phone
                    size={18}
                    className="flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-sm">{contact.phone}</span>
                </a>
              )}
              {company.address && (
                <div
                  className="flex items-start gap-3 opacity-70"
                  style={{ color: footer.text_color }}
                >
                  <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{company.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logos Adicionales Opcionales */}
        {(footer.logo1 || footer.logo2) && (
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12 animate-in fade-in duration-1000">
            {footer.logo1 && (
              <img
                src={footer.logo1}
                alt="Logo Partner 1"
                className="h-20 w-auto object-contain transition-all duration-500 rounded-xl bg-white p-2 shadow-2xl shadow-black/20"
              />
            )}
            {footer.logo2 && (
              <img
                src={footer.logo2}
                alt="Logo Partner 2"
                className="h-20 w-auto object-contain transition-all duration-500 rounded-xl bg-white p-2 shadow-2xl shadow-black/20"
              />
            )}
          </div>
        )}

        {/* Divisor */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

        {/* Copyright y derechos */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-60"
          style={{ color: footer.text_color }}
        >
          <div className="flex items-center gap-2">
            <p>
              © {currentYear}{" "}
              <span className="font-black" style={{ color: footer.text_color }}>
                Ankaloo Construcciones
              </span>{" "}
              — Todos los derechos reservados
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              Construyendo el futuro de Córdoba
            </p>
          </div>
        </div>
      </div>

      {/* FloatingWhatsApp */}
      {/* <FloatingWhatsApp
                phoneNumber={contact.whatsapp || "+5493510000000"}
                accountName={company.name || "Ankaloo Construcciones"}
                avatar={logo_blanco}
                statusMessage="Construcción e Infraestructura"
                chatMessage="¡Hola! 👋 ¿En qué podemos ayudarte hoy?"
                placeholder="Escribe tu mensaje..."
                allowEsc
                allowClickAway
                notification
                notificationSound
                darkMode={true}
            /> */}
    </footer>
  );
}
