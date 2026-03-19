const FooterTop = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid gap-12 md:grid-cols-5">
          {/* About Us */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900">About Us</h4>

            <p className="mt-6 text-sm leading-7 text-gray-700">
              We are a trusted supplier of genuine Simba Cement and quality
              building materials across Kenya. Our mission is to provide strong,
              reliable and affordable construction products including cement,
              steel, sand, ballast, nails and roofing materials for both bulk
              and retail customers.
            </p>
          </div>

          {/* Divider + Need Help */}
          <div className="md:pl-10 md:border-l md:border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">Need Help?</h4>

            <p className="mt-6 text-sm font-semibold text-gray-900">
              +254731030404
            </p>

            <div className="mt-4 space-y-1 text-sm text-gray-500">
              <p>Monday – Friday: 8:00 – 18:00</p>
              <p>Saturday: 9:00 – 15:00</p>
            </div>

            <a
              href="mailto:info@simbacementwholesalesdistributor.co.ke"
              className="mt-6 inline-block text-sm text-blue-600 hover:underline"
            >
              simbacement775@gmail.com
              info@simbacementwholesalesdistributor.co.ke
            </a>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              Customer Service
            </h4>

            <ul className="mt-6 space-y-4 text-sm text-gray-800">
              <li className="hover:text-indigo-900 cursor-pointer">Help Center</li>
              <li className="hover:text-indigo-900 cursor-pointer">My Account</li>
              <li className="hover:text-indigo-900 cursor-pointer">Track Orders</li>
              <li className="hover:text-indigo-900 cursor-pointer">Bulk Orders</li>
              <li className="hover:text-indigo-900 cursor-pointer">Request a Quote</li>
              <li className="hover:text-indigo-900 cursor-pointer">Return Policy</li>
            </ul>
          </div>

          {/* Store Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              Store Information
            </h4>

            <ul className="mt-6 space-y-4 text-sm text-gray-800">
              <li className="hover:text-indigo-900 cursor-pointer">About Us</li>
              <li className="hover:text-indigo-900 cursor-pointer">Contact</li>
              <li className="hover:text-indigo-900 cursor-pointer">Delivery Information</li>
              <li className="hover:text-indigo-900 cursor-pointer">
                Terms & Conditions
              </li>
              <li className="hover:text-indigo-900 cursor-pointer">
                Refund & Returns Policy
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              Follow Us
            </h4>

            <p className="mt-6 text-sm text-gray-700">
              Connect with us on social media for updates and promotions.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://www.tiktok.com/@.simbacement0?_r=1&_t=ZS-94ocZgzi50H"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition"
                aria-label="Follow us on TikTok"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 1 1-4.77-2.3A2.4 2.4 0 0 1 9.1 13.66V9.58a6.8 6.8 0 0 0-6.8 6.78 6.81 6.81 0 0 0 6.8 6.78 6.84 6.84 0 0 0 6.8-6.78v-3.39a8.62 8.62 0 0 0 3.77 1.02v-3.68a4.9 4.9 0 0 1-.77-.07z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/groups/1586964412167004/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                aria-label="Join us on Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/marymbwire?igsh=bjZucjZraWQ3cTl2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition"
                aria-label="Follow us on Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterTop;
