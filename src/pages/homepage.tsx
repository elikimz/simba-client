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
import SEOHelmet from "../utils/SEOHelmet";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title="Simba Cement - Premium Quality Cement & Construction Materials"
        description="Discover high-quality cement and construction materials from Simba Cement. Shop premium cement for your building projects with fast delivery."
        keywords="cement, construction materials, building supplies, quality cement, premium cement"
        ogTitle="Simba Cement - Premium Quality Cement"
        ogDescription="Discover high-quality cement and construction materials from Simba Cement. Perfect for your building projects."
        ogUrl="https://www.simbacementwholesalesdistributor.co.ke"
        canonicalUrl="https://www.simbacementwholesalesdistributor.co.ke"
      />
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
    </div>
  );
};

export default HomePage;
