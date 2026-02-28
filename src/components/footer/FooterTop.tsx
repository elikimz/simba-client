



const FooterTop = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid gap-12 md:grid-cols-4">
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
        </div>
      </div>
    </section>
  );
};

export default FooterTop;