import logo from '../../assets/img/logo/logo_negro.png';
import logoWhatsapp from '../../assets/img/logo/logo_negro.png';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import useCont from '../../hooks/useCont';

export default function Footer() {
    const { company, contact, social } = useCont();

    return (
        <footer className="bg-[#fefbf5] border-t border-neutral-200 py-12 mt-20 text-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 items-start text-center md:text-left">

                {/* Logo y derechos */}
                <div className="flex flex-col items-center md:items-start space-y-3">
                    <img src={logo} alt={`Logo ${company.name}`} className="h-10 w-auto" />
                    <p className="text-xs text-gray-500">
                        © 2025 <a href="https://www.proyectoswebsite.com/" target='_blank' rel="noreferrer">Codenix</a>. Todos los derechos reservados.
                    </p>
                </div>

                {/* Espacio vacío para equilibrio visual */}
                <div className="hidden md:block"></div>

                {/* Redes sociales y contacto */}
                <div className="flex flex-col items-center md:items-end space-y-3">
                    <div className="flex space-x-4">
                        {social.facebook && (
                            <a
                                href={social.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                            >
                                <FaFacebook className="text-2xl" />
                            </a>
                        )}
                        {social.instagram && (
                            <a
                                href={social.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-pink-600 transition-colors"
                            >
                                <FaInstagram className="text-2xl" />
                            </a>
                        )}
                    </div>

                    <a href={`mailto:${contact.email}`} className="text-sm text-gray-500 hover:underline">
                        {contact.email}
                    </a>
                </div>
            </div>

            <FloatingWhatsApp
                phoneNumber={contact.whatsapp || "+5493510000000"}
                accountName={company.name || "Revenant Travel"}
                avatar={logoWhatsapp}
                statusMessage="Agencia de Viajes"
                chatMessage="¡Hola! 👋 ¿Listo para tu próxima aventura? ¿En qué destino podemos ayudarte?"
                placeholder="Escribe tu consulta..."
                allowEsc
                allowClickAway
                notification
                notificationSound
                darkMode={false}
            />
        </footer>
    );
}
