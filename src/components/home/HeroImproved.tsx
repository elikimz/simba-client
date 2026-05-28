import { Link } from "react-router-dom";

const mapEmbedUrl = "https://www.google.com/maps?q=-0.222208,35.881353&z=16&output=embed";
const directionsUrl = "https://maps.app.goo.gl/hnmWMkXkQscuYyar6?g_st=aw";
const phoneNumber = "+254731030404";
const whatsappNumber = "254731030404";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hi National Simba Cements, I would like to inquire about cement prices and delivery."
)}`;

const HeroImproved = () => {
  return (
    <section
      id="contact"
      className="relative bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 py-16 text-white md:py-24"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-indigo-100 ring-1 ring-white/20">
              National Simba Cements Wholesale Distributor
            </p>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl">
              Premium Cement & Building Materials in Kenya
            </h1>

            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-indigo-100 md:text-xl">
              Simba Cement delivers genuine cement and quality construction
              materials with fast, reliable delivery for residential,
              commercial and industrial building projects.
            </p>

            <div className="mb-8 grid gap-3 rounded-2xl bg-white/10 p-5 text-sm shadow-2xl ring-1 ring-white/15 sm:grid-cols-2">
              <a
                href={`tel:${phoneNumber}`}
                className="rounded-xl bg-white px-4 py-3 font-bold text-indigo-950 transition hover:bg-indigo-50"
              >
                Call: {phoneNumber}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-green-500 px-4 py-3 font-bold text-white transition hover:bg-green-600"
              >
                WhatsApp: {phoneNumber}
              </a>
              <a
                href="mailto:info@nationalsimbacements.site"
                className="rounded-xl bg-indigo-800 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                info@nationalsimbacements.site
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-indigo-800 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                View Location on Google Maps
              </a>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/shop"
                className="inline-block rounded-lg bg-white px-8 py-4 text-center font-bold text-indigo-900 transition hover:bg-gray-100"
              >
                Shop Now
              </Link>
              <Link
                to="/contact"
                className="inline-block rounded-lg border-2 border-white px-8 py-4 text-center font-bold text-white transition hover:bg-white hover:text-indigo-900"
              >
                Send Message
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 text-sm text-indigo-50 sm:grid-cols-4">
              <span className="rounded-xl bg-white/10 px-4 py-3">Fast Delivery</span>
              <span className="rounded-xl bg-white/10 px-4 py-3">Quality Guaranteed</span>
              <span className="rounded-xl bg-white/10 px-4 py-3">Best Prices</span>
              <span className="rounded-xl bg-white/10 px-4 py-3">Expert Support</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 text-gray-900 shadow-2xl">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-indigo-950">Our Location</h2>
                <p className="text-sm text-gray-600">Visit or request delivery from our Google Maps pin.</p>
              </div>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-indigo-900 px-4 py-2 text-center text-sm font-bold text-white hover:bg-indigo-800"
              >
                Get Directions
              </a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <iframe
                title="National Simba Cements Google Maps location"
                src={mapEmbedUrl}
                className="h-[320px] w-full border-0 md:h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroImproved;
