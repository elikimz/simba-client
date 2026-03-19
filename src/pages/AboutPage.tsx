import Navbar from "../components/navbar/NavBar";
import FooterTop from "../components/footer/FooterTop";
import FooterBottom from "../components/footer/FooterBottom";
import SEOHelmet from "../utils/SEOHelmet";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title="About Simba Cement - Quality Building Materials"
        description="Learn about Simba Cement. We provide premium quality cement and construction materials with fast delivery across Kenya."
        keywords="about Simba Cement, company, quality, building materials"
        ogTitle="About Simba Cement"
        ogDescription="Premium quality cement and construction materials"
        canonicalUrl="https://www.simbacementwholesalesdistributor.co.ke/about"
      />

      <Navbar />

      <div className="mx-auto max-w-[1400px] px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-extrabold text-indigo-900 mb-4">
            About Simba Cement
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for premium quality cement and construction materials
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              At Simba Cement, we are committed to providing the highest quality cement and construction materials to builders, contractors, and homeowners across Kenya. We believe in integrity, reliability, and customer satisfaction.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to be the most trusted supplier of building materials, delivering quality products with exceptional service and competitive pricing.
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>Premium quality products</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>Fast and reliable delivery</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>Competitive pricing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>Professional customer service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>Wide range of products</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Our Product Range</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-indigo-900 mb-3">Cement</h3>
              <p className="text-gray-700">
                High-quality cement suitable for all construction projects. Available in various grades and pack sizes.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-indigo-900 mb-3">Steel & Hardware</h3>
              <p className="text-gray-700">
                Premium steel products, binding wire, nails, and hardware supplies for construction needs.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-indigo-900 mb-3">Building Materials</h3>
              <p className="text-gray-700">
                Sand, ballast, roofing sheets, and other essential building materials for all projects.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-lg mb-6 opacity-90">
            Contact us today for bulk orders, special pricing, or any inquiries about our products.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-indigo-900 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition"
          >
            Get in Touch
          </a>
        </div>
      </div>

      <FooterTop />
      <FooterBottom />
    </div>
  );
}
