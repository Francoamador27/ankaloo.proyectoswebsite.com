import { Search, Layout } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination,Navigation  } from 'swiper/modules';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import img1 from '../assets/img/ejemplos/ejemplo-1.jpg';
import img2 from '../assets/img/ejemplos/ejemplo-2.jpg';
import img3 from '../assets/img/ejemplos/ejemplo-3.jpg';
import img4 from '../assets/img/ejemplos/ejemplo-4.jpg';
import img5 from '../assets/img/ejemplos/ejemplo-5.jpg';
import img6 from '../assets/img/ejemplos/ejemplo-6.jpg';
import GaleriaSwiper from "./GaleriaSwiper";

export default function Ejemplos() {
  const [index, setIndex] = useState(-1);
  const isMobile = window.innerWidth < 640;
 useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const project = {
    title: "Imanes Decorativos Personalizados",
    description:
      "Creamos imanes únicos con tus fotos favoritas, ideales para decorar tu heladera, regalar a seres queridos o recordar momentos especiales. Cada imán es producido con materiales de alta calidad y un acabado brillante que realza los colores de tus recuerdos.",
    tags: [
      "Fotos personalizadas",
      "Decoración",
      "Regalos originales",
      "Hecho en Córdoba",
      "Calidad Premium",
      "Imanes brillantes"
    ],
    type: "Producto decorativo",
    mainImage: img1,
    gallery: [
      img2,
      img3,
      img4,
      img5,
      img6
    ],
    features: [
      {
        title: "Personalización total",
        description: "Cada imán se fabrica a partir de las fotos que nos enviás. Podés elegir una o varias imágenes según la cantidad."
      },
      {
        title: "Material resistente",
        description: "Usamos materiales de alta durabilidad con terminación brillante para asegurar que tus recuerdos duren en el tiempo."
      },
      {
        title: "Tamaño ideal",
        description: "Los imanes miden 6x6 cm, el formato perfecto para destacar sin ocupar demasiado espacio."
      },
      {
        title: "Producción rápida",
        description: "Fabricamos tu pedido en un plazo de 2 a 3 días hábiles desde la confirmación del diseño y pago."
      },
      {
        title: "Packaging de regalo",
        description: "Cada pedido se entrega en una cajita kraft con presentación cuidada, lista para sorprender."
      },
      {
        title: "Hecho con amor",
        description: "Nos encanta transformar momentos en objetos únicos. Cada pedido es producido artesanalmente en Córdoba."
      }
    ]
  };

  const galleryImages = [project.mainImage, ...project.gallery].map(src => ({ src }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 ">
      <p className="text-gray-400 mb-2 flex items-center gap-4 flex-wrap">
        <span className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-orange-500" />
          {project.type}
        </span>
      </p>

      <h1 className="text-4xl font-bold">{project.title}</h1>
      <p className="text-lg text-gray-400 mt-2">{project.description}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {project.tags.map((tag, i) => (
          <span key={i} className="bg-neutral-800 text-white text-sm px-3 py-1 rounded-full border border-neutral-700">
            {tag}
          </span>
        ))}
      </div>

      {/* Galería */}
      <div className="mt-8">
<GaleriaSwiper />
</div>


      {/* Características */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-orange-500 mb-6">Características</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {project.features.map((feature, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold  mb-1">🔸 {feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
