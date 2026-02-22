// // src/components/navbar/userNavbar.tsx
// import { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import MobileMenuDrawer from "../layout/MobileMenuDrawer";

// type MiniCartItem = {
//   id: number;
//   product_id: number;
//   quantity: number;
//   product_name?: string | null;
//   product_price?: number | null;
//   product_image_url?: string | null;
// };

// type Props = {
//   logoSrc?: string;

//   // Optional (so UserDashboard can control these)
//   searchValue?: string;
//   onSearchChange?: (v: string) => void;

//   cartCount?: number;
//   cartTotalLabel?: string; // e.g. "KSh0.00"
//   onCartClick?: () => void;

//   wishlistCount?: number;

//   // ✅ NEW: mini cart dropdown
//   cartItems?: MiniCartItem[];
//   cartLoading?: boolean;
//   cartError?: boolean;
// };

// function kes(n: number) {
//   return `KSh${Number(n || 0).toLocaleString()}.00`;
// }

// const UserNavBar = ({
//   logoSrc,
//   searchValue,
//   onSearchChange,
//   cartCount = 0,
//   cartTotalLabel = "KSh0.00",
//   onCartClick,
//   wishlistCount = 0,

//   cartItems = [],
//   cartLoading = false,
//   cartError = false,
// }: Props) => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [accountOpen, setAccountOpen] = useState(false);
//   const [cartOpen, setCartOpen] = useState(false);

//   const navigate = useNavigate();

//   const accountRef = useRef<HTMLDivElement | null>(null);
//   const cartRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     function onDocClick(e: MouseEvent) {
//       const t = e.target as Node;
//       if (accountRef.current && !accountRef.current.contains(t)) setAccountOpen(false);
//       if (cartRef.current && !cartRef.current.contains(t)) setCartOpen(false);
//     }
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, []);

//   function logout() {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("token_type");
//     localStorage.removeItem("user");
//     localStorage.removeItem("role");
//     navigate("/login", { replace: true });
//   }

//   const topItems = useMemo(() => cartItems.slice(0, 3), [cartItems]);

//   return (
//     <>
//       <header className="w-full bg-white">
//         <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between gap-3 py-4 sm:py-5">
//             {/* Hamburger + Logo */}
//             <div className="flex items-center gap-3 sm:gap-4">
//               <button
//                 className="p-2"
//                 aria-label="Open menu"
//                 onClick={() => setMenuOpen(true)}
//                 type="button"
//               >
//                 <div className="space-y-1.5">
//                   <span className="block h-[2px] w-6 bg-gray-800" />
//                   <span className="block h-[2px] w-6 bg-gray-800" />
//                   <span className="block h-[2px] w-6 bg-gray-800" />
//                 </div>
//               </button>

//               {logoSrc ? (
//                 <img
//                   src={logoSrc}
//                   alt="Logo"
//                   className="h-10 w-auto object-contain sm:h-14"
//                 />
//               ) : (
//                 <div className="h-10 w-24 rounded bg-gray-100 sm:h-14 sm:w-28" />
//               )}
//             </div>

//             {/* Right icons */}
//             <div className="flex items-center gap-1.5 sm:gap-3">
//               {/* Account icon (mobile) -> dropdown */}
//               <div className="relative lg:hidden" ref={accountRef}>
//                 <button
//                   className="p-2"
//                   aria-label="Account menu"
//                   onClick={() => setAccountOpen((s) => !s)}
//                   type="button"
//                 >
//                   <svg
//                     className="h-7 w-7 text-gray-900 sm:h-8 sm:w-8"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   >
//                     <path d="M20 21a8 8 0 10-16 0" />
//                     <circle cx="12" cy="8" r="4" />
//                   </svg>
//                 </button>

//                 {accountOpen ? (
//                   <div className="absolute right-0 top-12 w-52 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
//                     <button
//                       onClick={() => {
//                         setAccountOpen(false);
//                         navigate("/settings");
//                       }}
//                       className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50"
//                       type="button"
//                     >
//                       <span>Settings</span>
//                     </button>
//                     <button
//                       onClick={logout}
//                       className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"
//                       type="button"
//                     >
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 ) : null}
//               </div>

//               {/* Desktop account block */}
//               <div className="relative hidden lg:block" ref={accountRef}>
//                 <button
//                   className="flex items-center gap-2 text-left"
//                   aria-label="Account"
//                   onClick={() => setAccountOpen((s) => !s)}
//                   type="button"
//                 >
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm font-semibold text-gray-900">
//                         My Account
//                       </span>
//                       <svg
//                         className={[
//                           "h-4 w-4 text-gray-900 transition-transform",
//                           accountOpen ? "rotate-180" : "",
//                         ].join(" ")}
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path d="M5.5 7.5l4.5 4.5 4.5-4.5" />
//                       </svg>
//                     </div>
//                     <div className="text-xs text-gray-600">
//                       Manage profile & security
//                     </div>
//                   </div>
//                 </button>

//                 {accountOpen ? (
//                   <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
//                     <div className="px-4 py-3">
//                       <p className="text-sm font-bold text-gray-900">Account</p>
//                       <p className="text-xs text-gray-600">Quick actions</p>
//                     </div>
//                     <div className="h-px bg-gray-100" />

//                     <button
//                       onClick={() => {
//                         setAccountOpen(false);
//                         navigate("/settings");
//                       }}
//                       className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50"
//                       type="button"
//                     >
//                       <span>Settings</span>
//                       <span className="text-gray-400">→</span>
//                     </button>

//                     <button
//                       onClick={logout}
//                       className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"
//                       type="button"
//                     >
//                       <span>Logout</span>
//                       <span className="text-rose-300">⎋</span>
//                     </button>
//                   </div>
//                 ) : null}
//               </div>

//               {/* Wishlist */}
//               <button className="relative p-2" aria-label="Wishlist" type="button">
//                 <svg
//                   className="h-7 w-7 text-gray-900 sm:h-8 sm:w-8"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path d="M12 21s-7-4.4-9.5-8.3C.6 9.7 2.4 6 6.3 6c2 0 3.3 1.1 3.7 1.7.4-.6 1.7-1.7 3.7-1.7 3.9 0 5.7 3.7 3.8 6.7C19 16.6 12 21 12 21z" />
//                 </svg>
//                 <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-700 text-[11px] font-bold text-white">
//                   {wishlistCount}
//                 </span>
//               </button>

//               {/* ✅ Cart (with dropdown) */}
//               <div className="relative" ref={cartRef}>
//                 <button
//                   className="flex items-center gap-2"
//                   aria-label="Cart"
//                   onClick={() => setCartOpen((s) => !s)}
//                   type="button"
//                 >
//                   <div className="relative p-2">
//                     <svg
//                       className="h-7 w-7 text-gray-900 sm:h-8 sm:w-8"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <path d="M6 6h15l-1.5 9h-12z" />
//                       <path d="M6 6l-2-3H1" />
//                       <circle cx="9" cy="20" r="1" />
//                       <circle cx="18" cy="20" r="1" />
//                     </svg>

//                     <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-700 text-[11px] font-bold text-white">
//                       {cartCount}
//                     </span>
//                   </div>

//                   <div className="hidden text-right sm:block">
//                     <div className="text-xs text-gray-600">{cartCount} items</div>
//                     <div className="text-sm font-semibold text-gray-900">
//                       {cartTotalLabel}
//                     </div>
//                   </div>
//                 </button>

//                 {cartOpen ? (
//                   <div className="absolute right-0 top-14 z-50 w-[360px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
//                     <div className="px-4 py-3">
//                       <div className="flex items-center justify-between">
//                         <p className="text-sm font-extrabold text-gray-900">My Cart</p>
//                         <button
//                           type="button"
//                           onClick={() => setCartOpen(false)}
//                           className="rounded-lg px-2 py-1 text-sm font-bold text-gray-500 hover:bg-gray-100"
//                           aria-label="Close cart dropdown"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                       <p className="mt-1 text-xs text-gray-600">
//                         {cartLoading
//                           ? "Loading..."
//                           : cartError
//                           ? "Failed to load cart."
//                           : cartCount
//                           ? `${cartCount} item(s) • ${cartTotalLabel}`
//                           : "Your cart is empty."}
//                       </p>
//                     </div>

//                     <div className="h-px bg-gray-100" />

//                     <div className="max-h-[320px] overflow-auto p-4">
//                       {cartLoading ? (
//                         <div className="space-y-3">
//                           {Array.from({ length: 3 }).map((_, i) => (
//                             <div key={i} className="animate-pulse rounded-2xl border border-gray-200 p-3">
//                               <div className="flex gap-3">
//                                 <div className="h-12 w-12 rounded-xl bg-gray-200" />
//                                 <div className="flex-1">
//                                   <div className="h-3 w-3/4 rounded bg-gray-200" />
//                                   <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : cartError ? (
//                         <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
//                           Could not load cart. Please refresh.
//                         </div>
//                       ) : cartCount === 0 ? (
//                         <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
//                           <div className="text-3xl">🛒</div>
//                           <p className="mt-2 text-sm font-extrabold text-gray-900">Empty cart</p>
//                           <p className="mt-1 text-xs text-gray-600">
//                             Add items to start an order.
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="space-y-3">
//                           {topItems.map((it) => {
//                             const unit = Number(it.product_price ?? 0);
//                             const line = unit * (it.quantity || 0);
//                             return (
//                               <button
//                                 key={it.id}
//                                 type="button"
//                                 onClick={() => {
//                                   setCartOpen(false);
//                                   onCartClick?.();
//                                 }}
//                                 className="w-full rounded-2xl border border-gray-200 bg-white p-3 text-left hover:bg-gray-50"
//                               >
//                                 <div className="flex gap-3">
//                                   <div className="h-12 w-12 overflow-hidden rounded-xl bg-gray-100">
//                                     {it.product_image_url ? (
//                                       <img
//                                         src={it.product_image_url}
//                                         alt={it.product_name ?? "Product"}
//                                         className="h-full w-full object-cover"
//                                       />
//                                     ) : (
//                                       <div className="flex h-full w-full items-center justify-center text-lg">
//                                         🖼️
//                                       </div>
//                                     )}
//                                   </div>

//                                   <div className="min-w-0 flex-1">
//                                     <p className="truncate text-sm font-extrabold text-gray-900">
//                                       {it.product_name ?? `Product #${it.product_id}`}
//                                     </p>
//                                     <p className="mt-1 text-xs text-gray-600">
//                                       Qty: {it.quantity} • {kes(line)}
//                                     </p>
//                                   </div>
//                                 </div>
//                               </button>
//                             );
//                           })}

//                           {cartItems.length > 3 ? (
//                             <div className="text-center text-xs font-bold text-gray-500">
//                               +{cartItems.length - 3} more item(s)
//                             </div>
//                           ) : null}
//                         </div>
//                       )}
//                     </div>

//                     <div className="h-px bg-gray-100" />

//                     <div className="p-4">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setCartOpen(false);
//                           onCartClick?.();
//                         }}
//                         className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-black disabled:opacity-60"
//                         disabled={cartLoading || cartError || cartCount === 0}
//                       >
//                         View Cart →
//                       </button>
//                     </div>
//                   </div>
//                 ) : null}
//               </div>
//             </div>
//           </div>

//           {/* Search row (mobile/tablet) */}
//           <div className="pb-4 lg:hidden">
//             <div className="relative">
//               <input
//                 value={searchValue ?? ""}
//                 onChange={(e) => onSearchChange?.(e.target.value)}
//                 placeholder="Search for products..."
//                 className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-gray-300"
//               />
//               <button
//                 className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-gray-50"
//                 aria-label="Search"
//                 type="button"
//               >
//                 <svg
//                   className="h-5 w-5 text-gray-800"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <circle cx="11" cy="11" r="7" />
//                   <path d="M20 20l-3.5-3.5" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
//     </>
//   );
// };

// export default UserNavBar;




// src/components/navbar/userNavbar.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type MiniCartItem = {
  id: number;
  product_id: number;
  quantity: number;
  product_name?: string | null;
  product_price?: number | null;
  product_image_url?: string | null;
};

type Props = {
  logoSrc?: string;

  // Optional (so UserDashboard can control these)
  searchValue?: string;
  onSearchChange?: (v: string) => void;

  cartCount?: number;
  cartTotalLabel?: string; // e.g. "KSh0.00"
  onCartClick?: () => void;

  wishlistCount?: number;

  // ✅ NEW: mini cart dropdown
  cartItems?: MiniCartItem[];
  cartLoading?: boolean;
  cartError?: boolean;
};

function kes(n: number) {
  return `KSh${Number(n || 0).toLocaleString()}.00`;
}

const UserNavBar = ({
  logoSrc,
  searchValue,
  onSearchChange,
  cartCount = 0,
  cartTotalLabel = "KSh0.00",
  onCartClick,
  wishlistCount = 0,

  cartItems = [],
  cartLoading = false,
  cartError = false,
}: Props) => {
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const navigate = useNavigate();

  const accountRef = useRef<HTMLDivElement | null>(null);
  const cartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (accountRef.current && !accountRef.current.contains(t)) setAccountOpen(false);
      if (cartRef.current && !cartRef.current.contains(t)) setCartOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  }

  const topItems = useMemo(() => cartItems.slice(0, 3), [cartItems]);

  return (
    <>
      <header className="w-full bg-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-4 sm:py-5">
            {/* Logo only (hamburger removed) */}
            <div className="flex items-center gap-3 sm:gap-4">
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
              {/* Account icon (mobile) -> dropdown */}
              <div className="relative lg:hidden" ref={accountRef}>
                <button
                  className="p-2"
                  aria-label="Account menu"
                  onClick={() => setAccountOpen((s) => !s)}
                  type="button"
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

                {accountOpen ? (
                  <div className="absolute right-0 top-12 w-52 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                    <button
                      onClick={() => {
                        setAccountOpen(false);
                        navigate("/settings");
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50"
                      type="button"
                    >
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"
                      type="button"
                    >
                      <span>Logout</span>
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Desktop account block */}
              <div className="relative hidden lg:block" ref={accountRef}>
                <button
                  className="flex items-center gap-2 text-left"
                  aria-label="Account"
                  onClick={() => setAccountOpen((s) => !s)}
                  type="button"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        My Account
                      </span>
                      <svg
                        className={[
                          "h-4 w-4 text-gray-900 transition-transform",
                          accountOpen ? "rotate-180" : "",
                        ].join(" ")}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M5.5 7.5l4.5 4.5 4.5-4.5" />
                      </svg>
                    </div>
                    <div className="text-xs text-gray-600">
                      Manage profile & security
                    </div>
                  </div>
                </button>

                {accountOpen ? (
                  <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                    <div className="px-4 py-3">
                      <p className="text-sm font-bold text-gray-900">Account</p>
                      <p className="text-xs text-gray-600">Quick actions</p>
                    </div>
                    <div className="h-px bg-gray-100" />

                    <button
                      onClick={() => {
                        setAccountOpen(false);
                        navigate("/settings");
                      }}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50"
                      type="button"
                    >
                      <span>Settings</span>
                      <span className="text-gray-400">→</span>
                    </button>

                    <button
                      onClick={logout}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"
                      type="button"
                    >
                      <span>Logout</span>
                      <span className="text-rose-300">⎋</span>
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Wishlist */}
              <button className="relative p-2" aria-label="Wishlist" type="button">
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
                  {wishlistCount}
                </span>
              </button>

              {/* ✅ Cart (with dropdown) */}
              <div className="relative" ref={cartRef}>
                <button
                  className="flex items-center gap-2"
                  aria-label="Cart"
                  onClick={() => setCartOpen((s) => !s)}
                  type="button"
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
                      {cartCount}
                    </span>
                  </div>

                  <div className="hidden text-right sm:block">
                    <div className="text-xs text-gray-600">{cartCount} items</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {cartTotalLabel}
                    </div>
                  </div>
                </button>

                {cartOpen ? (
                  <div className="absolute right-0 top-14 z-50 w-[360px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-extrabold text-gray-900">My Cart</p>
                        <button
                          type="button"
                          onClick={() => setCartOpen(false)}
                          className="rounded-lg px-2 py-1 text-sm font-bold text-gray-500 hover:bg-gray-100"
                          aria-label="Close cart dropdown"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">
                        {cartLoading
                          ? "Loading..."
                          : cartError
                          ? "Failed to load cart."
                          : cartCount
                          ? `${cartCount} item(s) • ${cartTotalLabel}`
                          : "Your cart is empty."}
                      </p>
                    </div>

                    <div className="h-px bg-gray-100" />

                    <div className="max-h-[320px] overflow-auto p-4">
                      {cartLoading ? (
                        <div className="space-y-3">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className="animate-pulse rounded-2xl border border-gray-200 p-3"
                            >
                              <div className="flex gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gray-200" />
                                <div className="flex-1">
                                  <div className="h-3 w-3/4 rounded bg-gray-200" />
                                  <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : cartError ? (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
                          Could not load cart. Please refresh.
                        </div>
                      ) : cartCount === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
                          <div className="text-3xl">🛒</div>
                          <p className="mt-2 text-sm font-extrabold text-gray-900">
                            Empty cart
                          </p>
                          <p className="mt-1 text-xs text-gray-600">
                            Add items to start an order.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {topItems.map((it) => {
                            const unit = Number(it.product_price ?? 0);
                            const line = unit * (it.quantity || 0);
                            return (
                              <button
                                key={it.id}
                                type="button"
                                onClick={() => {
                                  setCartOpen(false);
                                  onCartClick?.();
                                }}
                                className="w-full rounded-2xl border border-gray-200 bg-white p-3 text-left hover:bg-gray-50"
                              >
                                <div className="flex gap-3">
                                  <div className="h-12 w-12 overflow-hidden rounded-xl bg-gray-100">
                                    {it.product_image_url ? (
                                      <img
                                        src={it.product_image_url}
                                        alt={it.product_name ?? "Product"}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center text-lg">
                                        🖼️
                                      </div>
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-extrabold text-gray-900">
                                      {it.product_name ?? `Product #${it.product_id}`}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-600">
                                      Qty: {it.quantity} • {kes(line)}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            );
                          })}

                          {cartItems.length > 3 ? (
                            <div className="text-center text-xs font-bold text-gray-500">
                              +{cartItems.length - 3} more item(s)
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-gray-100" />

                    <div className="p-4">
                      <button
                        type="button"
                        onClick={() => {
                          setCartOpen(false);
                          onCartClick?.();
                        }}
                        className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-black disabled:opacity-60"
                        disabled={cartLoading || cartError || cartCount === 0}
                      >
                        View Cart →
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Search row (mobile/tablet) */}
          <div className="pb-4 lg:hidden">
            <div className="relative">
              <input
                value={searchValue ?? ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search for products..."
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-gray-300"
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-gray-50"
                aria-label="Search"
                type="button"
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
    </>
  );
};

export default UserNavBar;