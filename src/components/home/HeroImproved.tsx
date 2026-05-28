import { Link } from "react-router-dom";
import { Phone, MessageCircle, MapPin, Mail } from "lucide-react";

const phoneNumber = "+254731030404";
const directionsUrl = "https://maps.app.goo.gl/hnmWMkXkQscuYyar6";
const whatsappNumber = "254731030404";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hi National Simba Cements, I would like to inquire about cement prices and delivery."
)}`;
const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8246468844367!2d35.88135!3d-0.222208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s0x0!5e0!3m2!1sen!2ske!4v1234567890`;

const HeroImproved = () => {
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
              <span className="text-xs sm:text-sm font-semibold text-white">Premium Cement Distributor</span>
            </div>

            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-5xl md:text-6xl font-display font-bold leading-tight text-white">
              Build with <span className="text-indigo-400">Excellence</span>
            </h1>

            <p className="mb-6 sm:mb-8 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-indigo-100">
              National Simba Cements delivers premium building materials with unmatched quality and reliability. From residential to industrial projects, we're your trusted partner in construction.
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

          {/* Right: Premium Map Card - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block animate-fade-in">
            <div className="rounded-2xl overflow-hidden shadow-luxury backdrop-blur-md border border-white/10 bg-white/5">
              <div className="relative h-[400px] overflow-hidden">
                <iframe
                  title="National Simba Cements Location"
                  src={mapEmbedUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="bg-gradient-to-r from-indigo-950 to-indigo-900 p-4 sm:p-6 border-t border-white/10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Visit Our Location</h3>
                <p className="text-indigo-200 text-xs sm:text-sm mb-4">
                  Nakuru-Nyahururu Rd, Nakuru, Kenya
                </p>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors text-sm"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE MAP - Shown only on mobile */}
        <div className="mt-8 lg:hidden animate-fade-in">
          <div className="rounded-2xl overflow-hidden shadow-luxury backdrop-blur-md border border-white/10 bg-white/5">
            <div className="relative h-[300px] overflow-hidden">
              <iframe
                title="National Simba Cements Location"
                src={mapEmbedUrl}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="bg-gradient-to-r from-indigo-950 to-indigo-900 p-4 border-t border-white/10">
              <h3 className="text-base font-bold text-white mb-2">Visit Our Location</h3>
              <p className="text-indigo-200 text-xs mb-3">
                Nakuru-Nyahururu Rd, Nakuru, Kenya
              </p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors text-sm"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroImproved;
