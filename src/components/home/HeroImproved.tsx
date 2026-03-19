import { Link } from "react-router-dom";

const HeroImproved = () => {
  return (
    <section className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white py-20 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Premium Cement & Building Materials
            </h1>
            <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
              Simba Cement delivers high-quality cement and construction materials with fast, reliable delivery across Kenya. Perfect for residential, commercial, and industrial projects.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="inline-block bg-white text-indigo-900 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition text-center"
              >
                Shop Now
              </Link>
              <a
                href="#contact"
                className="inline-block border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-indigo-900 transition text-center"
              >
                Contact Us
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✓</span>
                <span className="text-sm">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">✓</span>
                <span className="text-sm">Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">✓</span>
                <span className="text-sm">Best Prices</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">✓</span>
                <span className="text-sm">Expert Support</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🏗️</div>
              <p className="text-lg font-semibold">Building Tomorrow, Today</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroImproved;
