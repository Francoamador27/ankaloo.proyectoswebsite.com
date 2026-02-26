import { Suspense, lazy } from "react";
import FeatureSection from "../components/FeatureSection";
import DestinosCarrusel from "../components/DestinosCarrusel";
import LazyRender from "../components/LazyRender";
import useCont from "../hooks/useCont";
import SEOHead from "../components/Head/Head";

const Contacto = lazy(() => import("../components/Contacto"));
const ServiciosFront = lazy(() => import("../components/ServiciosFront"));
const ComoComprar = lazy(() => import("../components/Items"));
const Testimonials = lazy(() => import("./Testimonials"));
const Beneficios = lazy(() => import("../components/Beneficios"));
const Comparacion = lazy(() => import("../components/Comparacion"));
const Cta = lazy(() => import("../components/Cta"));
const Inicio = () => {
    const { auth, company } = useCont();
    return (
        <>
            <div className="  ">
                <FeatureSection />
                <LazyRender minHeight={320}>
                    <Suspense fallback={<div style={{ minHeight: 320 }} />}>
                        <ComoComprar />
                    </Suspense>
                </LazyRender>
                <LazyRender minHeight={520}>
                    <Suspense fallback={<div style={{ minHeight: 520 }} />}>
                        <ServiciosFront sliders />
                    </Suspense>
                </LazyRender>

                <LazyRender minHeight={520}>
                    <Suspense fallback={<div style={{ minHeight: 520 }} />}>
                        <DestinosCarrusel />
                    </Suspense>
                </LazyRender>

                <LazyRender minHeight={320}>
                    <Suspense fallback={<div style={{ minHeight: 320 }} />}>
                        <Beneficios />
                    </Suspense>
                </LazyRender>

                <LazyRender minHeight={420}>
                    <Suspense fallback={<div style={{ minHeight: 420 }} />}>
                        <Testimonials />
                    </Suspense>
                </LazyRender>
                <LazyRender minHeight={420}>
                    <Suspense fallback={<div style={{ minHeight: 420 }} />}>
                        <Contacto />
                    </Suspense>
                </LazyRender>
                <SEOHead
                    priority="high"
                    title={`${company.name} | Agencia de turismo`}
                />
            </div>
        </>
    );
}

export default Inicio;
