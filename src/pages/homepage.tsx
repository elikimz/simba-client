import Navbar from "../components/navbar/NavBar";
import HeroImproved from "../components/home/HeroImproved";
import LocationSection from "../components/home/LocationSection";
import FeatureStrip from "../components/home/FeatureStrip";
import FeaturedCategories from "../components/home/FeaturedCategories";
import AboutSection from "../components/home/AboutSection";
import DealsSection from "../components/home/DealAection";
import ProductsShowcase from "../components/home/ProductsShowcase";
import WhySimba from "../components/home/WhySimba";
import PromoBanner from "../components/home/PromoBanner";
import TestimonialsIntro from "../components/home/TestimonialsIntro";
import TestimonialsSection from "../components/home/Testimonials";
import FooterTop from "../components/footer/FooterTop";
import FooterBottom from "../components/footer/FooterBottom";
import SEOHelmet from "../utils/SEOHelmet";

const HomePage = () => {
  // LocalBusiness Structured Data for Google Maps and Local SEO
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "National Simba Cements",
    "image": "https://nationalsimbacements.site/logo.png",
    "description": "Premium cement and building materials supplier in Nakuru, Kenya. Wholesale cement, construction materials, and building supplies.",
    "url": "https://nationalsimbacements.site",
    "telephone": "+254731030404",
    "email": "info@nationalsimbacements.site",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nakuru-Nyahururu Road",
      "addressLocality": "Nakuru",
      "addressRegion": "Rift Valley",
      "postalCode": "20100",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -0.222208,
      "longitude": 35.881353
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "15:00"
      }
    ],
    "priceRange": "$$",
    "sameAs": [
      "https://www.google.com/maps/place/-0.222208,35.881353"
    ],
    "areaServed": {
      "@type": "City",
      "name": "Kenya"
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title="National Simba Cements - Premium Cement & Building Materials in Nakuru, Kenya"
        description="Buy high-quality Simba Cement 42.5N and construction materials in Nakuru, Kenya. Wholesale cement supplier with fast delivery. Call +254731030404 for wholesale prices."
        keywords="cement, Simba cement, building materials, construction supplies, Nakuru cement, wholesale cement Kenya, cement supplier"
        ogTitle="National Simba Cements - Premium Quality Cement in Nakuru"
        ogDescription="Premium Simba Cement and building materials supplier in Nakuru, Kenya. Quality cement for construction projects with fast delivery."
        ogUrl="https://nationalsimbacements.site"
        canonicalUrl="https://nationalsimbacements.site"
      />
      
      {/* LocalBusiness Structured Data for Google Maps and Local Search */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

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
