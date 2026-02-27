



const FooterBottom = () => {
  return (
    <section className="bg-white">
      {/* Top info strip */}
      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-2 text-center text-sm font-semibold text-gray-900">
            <div className="py-4">Fast & Reliable Delivery</div>
            <div className="py-4 border-l border-gray-200">
              Bulk & Same Day Delivery Available
            </div>
          </div>
        </div>
      </div>

      {/* Main bottom area */}
      <div className="mx-auto max-w-[1400px] px-6 py-14">
        {/* Links */}
        <div className="flex flex-wrap gap-8 text-sm text-gray-900">
          <a href="#" className="hover:text-indigo-900">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-900">Order Tracking</a>
          <a href="#" className="hover:text-indigo-900">Refund & Returns Policy</a>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-sm text-gray-400">
          Copyright 2026 © Simba Cement Wholesale Distributor. All rights reserved.
        </p>

        {/* Payment Section */}
        <div className="mt-10 flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          {/* Payment Info */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-gray-900">
              Secure Payment Options
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>M-Pesa</span>
              <span>Cash on Delivery</span>
              <span>Bank Transfer</span>
            </div>
          </div>

          {/* Mpesa */}
          <img
            src="/images/footer/mpesa.png"
            alt="Lipa na Mpesa"
            className="h-10 w-auto"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default FooterBottom;