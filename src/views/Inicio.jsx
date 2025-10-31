import Contacto from "../components/Contacto";
import FeatureSection from "../components/FeatureSection";
import ServiciosFront from "../components/ServiciosFront";
import ComoComprar from "../components/Items";
import useCont from "../hooks/useCont";
import Testimonials from "./Testimonials";
import Test from "../components/test/Test";
import Mapa from "../components/Mapa/Mapa";
import SEOHead from "../components/Head/Head";
import GTMBody from "../components/BodyVerification/GTMBody";
const Inicio = () => {
    const { auth,company } = useCont();
    return (
        <>
            <div className="  ">
                <FeatureSection />
                <ComoComprar />
                <div>
                    <ServiciosFront />
                </div>
                <Testimonials />
                <Contacto />
            <SEOHead
                priority="high"  // ← ESTO ES LO IMPORTANTE
                title={`${company.name} | Los mejores tratamientos odontológicos en ${company.address ?? ""}`}
            />
            </div>
        </>
    );
}

export default Inicio;
