


// src/components/MainHeader.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// import MobileMenuDrawer from "../layout/MobileMenuDrawer";
import { CART_KEY, cartTotals, getLocalCart } from "../../utils/localCart";

type Props = {
  logoSrc?: string;
};

function formatKES(amount: number) {
  return `KSh${Number(amount || 0).toLocaleString()}.00`;
}

const MainHeader = ({ logoSrc }: Props) => {
  const [, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ local cart (no login)
  const [cart, setCart] = useState(() => getLocalCart());

  useEffect(() => {
    const sync = () => setCart(getLocalCart());

    // initial sync
    sync();

    // same tab updates
    window.addEventListener("local-cart-updated", sync);

    // other tabs/windows updates
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) sync();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("local-cart-updated", sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const totals = useMemo(() => cartTotals(cart), [cart]);

  return (
    <>
      <header className="w-full bg-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-4 sm:py-5">
            {/* Hamburger + Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                className="p-2"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <div className="space-y-1.5">
                  <span className="block h-[2px] w-6 bg-gray-800" />
                  <span className="block h-[2px] w-6 bg-gray-800" />
                  <span className="block h-[2px] w-6 bg-gray-800" />
                </div>
              </button>

              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt="Logo"
                  className="h-10 w-auto object-contain sm:h-14"
                />
              ) : (
                <div className="h-10 w-24 rounded bg-gray-100 sm:h-14 sm:w-28" />
              )}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Account icon (mobile) -> go to sign in */}
              <button
                className="p-2 lg:hidden"
                aria-label="Sign in"
                onClick={() => navigate("/signin")}
              >
                <svg
                  className="h-7 w-7 text-gray-900 sm:h-8 sm:w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21a8 8 0 10-16 0" />
                  <circle cx="12" cy="8" r="4" />
                </svg>
              </button>

              {/* Desktop account block */}
              <button
                className="hidden items-center gap-2 text-left lg:flex"
                aria-label="Account"
                onClick={() => navigate("/signin")}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      My Account
                    </span>
                    <svg
                      className="h-4 w-4 text-gray-900"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5.5 7.5l4.5 4.5 4.5-4.5" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-600">
                    Hello, <span className="text-gray-900">Sign In</span>
                  </div>
                </div>
              </button>

              {/* Wishlist (unchanged) */}
              <button className="relative p-2" aria-label="Wishlist">
                <svg
                  className="h-7 w-7 text-gray-900 sm:h-8 sm:w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 21s-7-4.4-9.5-8.3C.6 9.7 2.4 6 6.3 6c2 0 3.3 1.1 3.7 1.7.4-.6 1.7-1.7 3.7-1.7 3.9 0 5.7 3.7 3.8 6.7C19 16.6 12 21 12 21z" />
                </svg>
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-700 text-[11px] font-bold text-white">
                  1
                </span>
              </button>

              {/* Cart */}
              <button
                className="flex items-center gap-2"
                aria-label="Cart"
                onClick={() => navigate("/cart")}
              >
                <div className="relative p-2">
                  <svg
                    className="h-7 w-7 text-gray-900 sm:h-8 sm:w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 6h15l-1.5 9h-12z" />
                    <path d="M6 6l-2-3H1" />
                    <circle cx="9" cy="20" r="1" />
                    <circle cx="18" cy="20" r="1" />
                  </svg>

                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-700 text-[11px] font-bold text-white">
                    {totals.count}
                  </span>
                </div>

                <div className="hidden text-right sm:block">
                  <div className="text-xs text-gray-600">
                    {totals.count} items
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatKES(totals.total)}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Search row (mobile/tablet) */}
          <div className="pb-4 lg:hidden">
            <div className="relative">
              <input
                placeholder="Search for products..."
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-gray-300"
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-gray-50"
                aria-label="Search"
              >
                <svg
                  className="h-5 w-5 text-gray-800"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
{/* 
      <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} /> */}
    </>
  );
};

export default MainHeader;