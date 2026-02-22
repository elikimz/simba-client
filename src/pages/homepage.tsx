import Navbar from "../components/navbar/NavBar";
import Hero from "../components/home/Hero";
import FeatureStrip from "../components/home/FeatureStrip";
import AboutSection from "../components/home/AboutSection";
import DealsSection from "../components/home/DealAection";
import ProductsShowcase from "../components/home/ProductsShowcase";
import WhyMaisha from "../components/home/WhyMaisha";
import PromoBanner from "../components/home/PromoBanner";
import TestimonialsIntro from "../components/home/TestimonialsIntro";
import TestimonialsSection from "../components/home/Testimonials";
import FooterTop from "../components/footer/FooterTop";
import FooterBottom from "../components/footer/FooterBottom";


const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeatureStrip />
      <AboutSection />
      <DealsSection />
      <ProductsShowcase />
      <WhyMaisha />
      <PromoBanner />
      <TestimonialsIntro />
      <TestimonialsSection />
      <FooterTop />
      <FooterBottom />
      {/* rest of page */}
    </div>
  );
};

export default HomePage;