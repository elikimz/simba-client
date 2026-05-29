import { Link } from "react-router-dom";
import { Phone, MessageCircle, MapPin, Mail, Loader2 } from "lucide-react";
import { productsAPI } from "../../features/products/productsAPI";

const phoneNumber = "+254731030404";
const directionsUrl = "https://maps.app.goo.gl/hnmWMkXkQscuYyar6";
const whatsappNumber = "254731030404";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hi National Simba Cements, I would like to inquire about cement prices and delivery."
)}`;

const HeroImproved = () => {
  // Fetch the main product (Simba Cement 42.5N - ID 10)
  const { data: mainProduct, isLoading } = productsAPI.useGetProductQuery(10);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-700 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-700 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 py-12 sm:py-20 md:py-32">
        {/* PROMINENT CONTACT BAR - MOBILE FIRST */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center justify-center gap-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 px-3 sm:px-4 py-2 sm:py-3 hover:bg-white/20 transition-all"
          >
            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            <span className="text-xs sm:text-sm font-bold text-white hidden sm:inline">Call</span>
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600/80 backdrop-blur-md border border-green-500/30 px-3 sm:px-4 py-2 sm:py-3 hover:bg-green-600 transition-all"
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            <span className="text-xs sm:text-sm font-bold text-white hidden sm:inline">WhatsApp</span>
          </a>
          <a
            href={`mailto:info@nationalsimbacements.site`}
            className="flex items-center justify-center gap-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 px-3 sm:px-4 py-2 sm:py-3 hover:bg-white/20 transition-all"
          >
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            <span className="text-xs sm:text-sm font-bold text-white hidden sm:inline">Email</span>
          </a>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 px-3 sm:px-4 py-2 sm:py-3 hover:bg-white/20 transition-all"
          >
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            <span className="text-xs sm:text-sm font-bold text-white hidden sm:inline">Location</span>
          </a>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur-md border border-white/20">
              <span className="inline-flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-xs sm:text-sm font-semibold text-white">{mainProduct?.name || "Premium Cement Distributor"}</span>
            </div>

            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-5xl md:text-6xl font-display font-bold leading-tight text-white">
              {mainProduct?.name || "Build with Excellence"}
            </h1>

            <p className="mb-6 sm:mb-8 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-indigo-100">
              {mainProduct?.description || "National Simba Cements delivers premium building materials with unmatched quality and reliability. From residential to industrial projects, we're your trusted partner in construction."}
            </p>

            {/* CTA Buttons */}
            <div className="mb-8 flex flex-col gap-3 sm:gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-bold text-indigo-900 transition-all duration-300 hover:bg-indigo-50 hover:shadow-lg"
              >
                Shop Now
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-bold text-white transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Order via WhatsApp
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                { label: "Years", value: "10+" },
                { label: "Products", value: "500+" },
                { label: "Clients", value: "5000+" },
                { label: "Coverage", value: "All Kenya" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-white/5 backdrop-blur-md border border-white/10 p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-indigo-400">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-indigo-100 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Image - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block animate-fade-in">
            {isLoading ? (
              <div className="rounded-2xl overflow-hidden shadow-luxury backdrop-blur-md border border-white/10 bg-white/5 h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            ) : mainProduct?.image_url ? (
              <div className="rounded-2xl overflow-hidden shadow-luxury">
                <img
                  src={mainProduct.image_url}
                  alt={mainProduct.name}
                  className="w-full h-auto object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* MOBILE PRODUCT IMAGE - Shown only on mobile */}
        <div className="mt-8 lg:hidden animate-fade-in">
          {isLoading ? (
            <div className="rounded-2xl overflow-hidden shadow-luxury backdrop-blur-md border border-white/10 bg-white/5 h-[300px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          ) : mainProduct?.image_url ? (
            <div className="rounded-2xl overflow-hidden shadow-luxury">
              <img
                src={mainProduct.image_url}
                alt={mainProduct.name}
                className="w-full h-auto object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default HeroImproved;
