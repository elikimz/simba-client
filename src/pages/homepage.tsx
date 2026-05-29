import Navbar from "../components/navbar/NavBar";
import HeroImproved from "../components/home/HeroImproved";
import FeatureStrip from "../components/home/FeatureStrip";
import FeaturedCategories from "../components/home/FeaturedCategories";
import AboutSection from "../components/home/AboutSection";
import DealsSection from "../components/home/DealAection";
import ProductsShowcase from "../components/home/ProductsShowcase";
import WhySimba from "../components/home/WhySimba";
import PromoBanner from "../components/home/PromoBanner";
import TestimonialsIntro from "../components/home/TestimonialsIntro";
import TestimonialsSection from "../components/home/Testimonials";
import LocationSection from "../components/home/LocationSection";
import FooterTop from "../components/footer/FooterTop";
import FooterBottom from "../components/footer/FooterBottom";
import SEOHelmet from "../utils/SEOHelmet";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title="National Simba Cements - Premium Cement & Building Materials"
        description="Discover high-quality cement and construction materials from National Simba Cements. Shop premium cement for your building projects with fast delivery across Kenya."
        keywords="cement, construction materials, building supplies, quality cement, premium cement"
        ogTitle="National Simba Cements - Premium Quality Cement"
        ogDescription="Discover high-quality cement and construction materials from National Simba Cements. Perfect for your building projects."
        ogUrl="https://nationalsimbacements.site"
        canonicalUrl="https://nationalsimbacements.site"
      />
      <Navbar />
      <HeroImproved />
      <LocationSection />
      <FeatureStrip />
      <FeaturedCategories />
      <AboutSection />
      <DealsSection />
      <ProductsShowcase />
      <WhySimba />
      <PromoBanner />
      <TestimonialsIntro />
      <TestimonialsSection />
      <FooterTop />
      <FooterBottom />
    </div>
  );
};

export default HomePage;
