import { Link } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
};

const MobileMenuDrawer = ({ open, onClose }: Props) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[86%] max-w-[360px] bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <div className="text-base font-semibold text-gray-900">
              Maisha Mabati
            </div>
            <div className="text-xs text-gray-500">Main Menu</div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {/* Main Menu */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Main Menu
              </div>

              <nav className="mt-3 space-y-3 text-sm font-medium text-gray-900">
                <Link to="/" onClick={onClose} className="block hover:text-indigo-900">
                  Home
                </Link>
                <Link to="/shop" onClick={onClose} className="block hover:text-indigo-900">
                  Shop
                </Link>
                <Link
                  to="/best-sellers"
                  onClick={onClose}
                  className="block hover:text-indigo-900"
                >
                  Best Sellers
                </Link>
                <Link to="/blog" onClick={onClose} className="block hover:text-indigo-900">
                  Blog
                </Link>
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="block hover:text-indigo-900"
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Category Menu */}
            <div className="mt-8">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Category Menu
              </div>

              <nav className="mt-3 space-y-3 text-sm text-gray-800">
                <Link to="/" onClick={onClose} className="block hover:text-indigo-900">
                  Home
                </Link>
                <Link
                  to="/manufacturing"
                  onClick={onClose}
                  className="block hover:text-indigo-900"
                >
                  Manufacturing
                </Link>
                <Link
                  to="/products"
                  onClick={onClose}
                  className="block hover:text-indigo-900"
                >
                  Our Products
                </Link>
                <Link
                  to="/about"
                  onClick={onClose}
                  className="block hover:text-indigo-900"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="block hover:text-indigo-900"
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Contact details */}
            <div className="mt-10 border-t pt-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Contact Details
              </div>

              <div className="mt-4 space-y-4 text-sm text-gray-700">
                <div>
                  <div className="font-semibold text-gray-900">+254789486699</div>
                  <div className="text-xs text-gray-500">
                    You can call anytime from 9 am to 6 pm.
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-gray-900">
                    info@devkisteelmaishamabati.co.ke
                  </div>
                  <div className="text-xs text-gray-500">
                    The e-mail you sent will be returned as soon as possible.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="border-t px-5 py-4 text-xs text-gray-500">
            Copyright 2026 © Maisha Mabati. All right reserved. Powered by Luxully.
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileMenuDrawer;