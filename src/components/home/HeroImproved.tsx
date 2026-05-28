import { Link } from "react-router-dom";

const phoneNumber = "+254731030404";
const directionsUrl = "https://maps.app.goo.gl/hnmWMkXkQscuYyar6";
const whatsappNumber = "254731030404";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hi National Simba Cements, I would like to inquire about cement prices and delivery."
)}`;
const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8246468844367!2d35.88135!3d-0.222208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s0x0!5e0!3m2!1sen!2ske!4v1234567890`;

const HeroImproved = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-premium-dark via-premium-dark to-premium-dark overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-premium-accent rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-luxury-gold rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left Content */}
          <div className="animate-slide-up">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/20">
              <span className="inline-flex h-2 w-2 rounded-full bg-premium-accent animate-pulse"></span>
              <span className="text-sm font-semibold text-white">Premium Cement Distributor</span>
            </div>

            <h1 className="mb-6 text-5xl md:text-7xl font-display font-bold leading-tight text-white">
              Build with <span className="bg-gradient-to-r from-premium-accent to-luxury-gold bg-clip-text text-transparent">Excellence</span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-slate-300">
              National Simba Cements delivers premium building materials with unmatched quality and reliability. From residential to industrial projects, we're your trusted partner in construction.
            </p>

            {/* CTA Buttons */}
            <div className="mb-12 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-premium-accent to-luxury-gold px-8 py-4 text-lg font-bold text-premium-dark transition-all duration-300 hover:shadow-luxury hover:scale-105"
              >
                Shop Now
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-md"
              >
                Order via WhatsApp
              </a>
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-4">
                <div className="text-sm text-slate-400">Phone</div>
                <a href={`tel:${phoneNumber}`} className="text-lg font-bold text-premium-accent hover:text-luxury-gold">
                  {phoneNumber}
                </a>
              </div>
              <div className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-4">
                <div className="text-sm text-slate-400">Email</div>
                <a href="mailto:info@nationalsimbacements.site" className="text-sm font-bold text-premium-accent hover:text-luxury-gold truncate">
                  info@nationalsimbacements.site
                </a>
              </div>
              <div className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-4">
                <div className="text-sm text-slate-400">Location</div>
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-premium-accent hover:text-luxury-gold">
                  View Map
                </a>
              </div>
            </div>
          </div>

          {/* Right: Premium Map Card */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="rounded-3xl overflow-hidden shadow-luxury backdrop-blur-md border border-white/10 bg-white/5">
              <div className="relative h-[500px] overflow-hidden">
                <iframe
                  title="National Simba Cements Location"
                  src={mapEmbedUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="bg-gradient-to-r from-premium-dark to-premium-dark p-6 border-t border-white/10">
                <h3 className="text-lg font-bold text-white mb-2">Visit Our Location</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Nakuru-Nyahururu Rd, Nakuru, Kenya
                </p>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-premium-accent hover:text-luxury-gold font-semibold transition-colors"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Years in Business", value: "10+" },
            { label: "Products", value: "500+" },
            { label: "Happy Clients", value: "5000+" },
            { label: "Delivery Coverage", value: "All Kenya" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-premium-accent">{stat.value}</div>
              <div className="text-xs md:text-sm text-slate-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroImproved;
