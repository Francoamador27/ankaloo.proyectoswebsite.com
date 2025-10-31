import React, { useEffect, useState } from 'react';
import clienteAxios from '../config/axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination,Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const Testimonials = () => {
  const [testimonios, setTestimonios] = useState([]);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await clienteAxios.get('/api/testimonios');
      setTestimonios(data.data);
    };
    fetchData();
  }, []);

return (
    <section className="py-12 bg-gray-50 sm:py-16 lg:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl font-pj">
                    Lo que dicen nuestros clientes
                </h2>
            </div>

            <div className="mt-10 md:mt-16">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop={true}
                    pagination={{ clickable: true }}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {testimonios.map((t) => (
                        <SwiperSlide key={t.id}>
                            <div className="flex flex-col overflow-hidden shadow-xl rounded-xl h-full bg-white min-h-[350px]">
                                <div className="flex flex-col justify-between flex-1 p-6 lg:py-8 lg:px-7">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            {Array(5)
                                                .fill(0)
                                                .map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className="w-5 h-5 text-[#FDB241]"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                        </div>

                                        <blockquote className="flex-1 mt-6">
                                            <p className="text-lg leading-relaxed text-gray-900 font-pj">
                                                “{t.texto}”
                                            </p>
                                        </blockquote>
                                    </div>

                                    <div className="flex items-center mt-6">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}storage/uploads/${t.imagen}`}
                                            alt={t.nombre}
                                            onClick={() => {
                                                setSelectedImage(`${import.meta.env.VITE_API_URL}storage/uploads/${t.imagen}`);
                                                setOpenLightbox(true);
                                            }}
                                            className="w-12 h-12 rounded-full object-cover cursor-pointer ring-2 ring-blue-500"
                                        />
                                        <p className="ml-4 text-base font-bold text-gray-900">
                                            {t.nombre}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>

        {openLightbox && (
            <Lightbox
                open={openLightbox}
                close={() => setOpenLightbox(false)}
                slides={[{ src: selectedImage }]}
            />
        )}
    </section>
);
};

export default Testimonials;
