import { Link } from "react-router-dom";
import { Phone, MessageCircle, MapPin, Mail } from "lucide-react";
import { productsAPI } from "../../features/products/productsAPI";

const phoneNumber = "+254731030404";
const directionsUrl = "https://maps.app.goo.gl/hnmWMkXkQscuYyar6";
const whatsappNumber = "254731030404";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hi National Simba Cements, I would like to inquire about cement prices and delivery."
)}`;

const HeroImproved = () => {
  // Fetch the main product (Simba Cement 42.5N - ID 10)
  const { data: mainProduct } = productsAPI.useGetProductQuery(10);

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Sticky Contact Bar at Top */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-3 sm:py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-50 border border-indigo-200 px-3 sm:px-4 py-2 sm:py-3 hover:bg-indigo-100 transition-all"
            >
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-700" />
              <span className="text-xs sm:text-sm font-bold text-indigo-700 hidden sm:inline">Call</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 sm:px-4 py-2 sm:py-3 hover:bg-green-100 transition-all"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
              <span className="text-xs sm:text-sm font-bold text-green-700 hidden sm:inline">WhatsApp</span>
            </a>
            <a
              href={`mailto:info@nationalsimbacements.site`}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-50 border border-indigo-200 px-3 sm:px-4 py-2 sm:py-3 hover:bg-indigo-100 transition-all"
            >
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-700" />
              <span className="text-xs sm:text-sm font-bold text-indigo-700 hidden sm:inline">Email</span>
            </a>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-50 border border-indigo-200 px-3 sm:px-4 py-2 sm:py-3 hover:bg-indigo-100 transition-all"
            >
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-700" />
              <span className="text-xs sm:text-sm font-bold text-indigo-700 hidden sm:inline">Location</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Hero Section - Clean White Background */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 sm:py-20 md:py-32">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2">
          {/* Left: Text Content */}
          <div className="animate-slide-up">
            <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-indigo-950">
              SIMBA CEMENT & BUILDING MATERIALS YOU CAN TRUST
            </h1>

            <p className="mb-8 text-base sm:text-lg leading-relaxed text-gray-700">
              We supply genuine Simba Cement and a wide range of construction materials at affordable prices for homes, contractors, and project sites across Kenya. From cement and steel to sand, ballast, binding wire, nails and roofing sheets, our focus is on durable, reliable, and cost-effective products that help you build strong and finish on time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-700 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-bold text-white transition-all duration-300 hover:bg-indigo-800 hover:shadow-lg"
              >
                Shop Now
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-bold text-white transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                Order via WhatsApp
              </a>
            </div>
          </div>

          {/* Right: Product Image */}
          <div className="animate-fade-in">
            {mainProduct?.image_url ? (
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={mainProduct.image_url}
                  alt={mainProduct.name}
                  className="w-full h-auto object-cover"
                />
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-100 h-96 flex items-center justify-center">
                <span className="text-gray-400">Loading product image...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroImproved;
