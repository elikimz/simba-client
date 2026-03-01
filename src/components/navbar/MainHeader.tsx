


// // src/components/MainHeader.tsx
// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { CART_KEY, cartTotals, getLocalCart } from "../../utils/localCart";

// type Props = {
//   logoSrc?: string; // optional override
// };

// function formatKES(amount: number) {
//   return `KSh${Number(amount || 0).toLocaleString()}.00`;
// }

// const MainHeader = ({ logoSrc }: Props) => {
//   const navigate = useNavigate();

//   const [cart, setCart] = useState(() => getLocalCart());

//   useEffect(() => {
//     const sync = () => setCart(getLocalCart());

//     sync();

//     window.addEventListener("local-cart-updated", sync);

//     const onStorage = (e: StorageEvent) => {
//       if (e.key === CART_KEY) sync();
//     };
//     window.addEventListener("storage", onStorage);

//     return () => {
//       window.removeEventListener("local-cart-updated", sync);
//       window.removeEventListener("storage", onStorage);
//     };
//   }, []);

//   const totals = useMemo(() => cartTotals(cart), [cart]);

//   // ✅ Vite-safe public asset URL (works on Vercel + sub-paths)
//   const fallbackLogo = `${import.meta.env.BASE_URL}logo.png`;
//   const finalLogoSrc = logoSrc ?? fallbackLogo;

//   return (
//     <header className="w-full bg-white border-b">
//       <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between py-4 sm:py-5">
//           {/* Logo */}
//           <button
//             type="button"
//             onClick={() => navigate("/")}
//             className="flex items-center"
//             aria-label="Go to homepage"
//           >
//             <img
//               src={finalLogoSrc}
//               alt="Logo"
//               className="h-12 w-auto object-contain sm:h-16"
//               loading="eager"
//               onError={(e) => {
//                 // fallback if custom logoSrc fails
//                 if (finalLogoSrc !== fallbackLogo) {
//                   (e.currentTarget as HTMLImageElement).src = fallbackLogo;
//                 }
//               }}
//             />
//           </button>

//           {/* Right side (Account + Cart) */}
//           <div className="flex items-center gap-4">
//             {/* Account */}
//             <button
//               className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-50"
//               aria-label="Account"
//               type="button"
//               onClick={() => navigate("/signin")}
//             >
//               <svg
//                 className="h-7 w-7 text-gray-900"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path d="M20 21a8 8 0 10-16 0" />
//                 <circle cx="12" cy="8" r="4" />
//               </svg>

//               <div className="text-left leading-tight">
//                 <div className="text-sm font-semibold text-gray-900">
//                   My Account
//                 </div>
//                 <div className="text-xs text-gray-600">
//                   Hello, <span className="text-gray-900">Sign In</span>
//                 </div>
//               </div>
//             </button>

//             {/* Cart */}
//             <button
//               className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-50"
//               aria-label="Cart"
//               type="button"
//               onClick={() => navigate("/cart")}
//             >
//               <div className="relative">
//                 <svg
//                   className="h-7 w-7 text-gray-900"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path d="M6 6h15l-1.5 9h-12z" />
//                   <path d="M6 6l-2-3H1" />
//                   <circle cx="9" cy="20" r="1" />
//                   <circle cx="18" cy="20" r="1" />
//                 </svg>

//                 <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-700 text-[11px] font-bold text-white">
//                   {totals.count}
//                 </span>
//               </div>

//               <div className="text-right leading-tight">
//                 <div className="text-xs text-gray-600">
//                   {totals.count} items
//                 </div>
//                 <div className="text-sm font-semibold text-gray-900">
//                   {formatKES(totals.total)}
//                 </div>
//               </div>
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default MainHeader;





// src/components/MainHeader.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CART_KEY, cartTotals, getLocalCart } from "../../utils/localCart";

type Props = {
  logoSrc?: string; // optional override
};

function formatKES(amount: number) {
  return `KSh${Number(amount || 0).toLocaleString()}.00`;
}

const MainHeader = ({ logoSrc }: Props) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => getLocalCart());

  useEffect(() => {
    const sync = () => setCart(getLocalCart());
    sync();

    window.addEventListener("local-cart-updated", sync);
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

  // ✅ Vercel-safe: use absolute public path (you confirmed /logo.png is 200 OK)
  const fallbackLogo = "/logo.png";
  const finalLogoSrc = logoSrc?.trim() ? logoSrc : fallbackLogo;

  // ✅ debug (remove later)
  console.log("Logo src:", finalLogoSrc);

  return (
    <header className="w-full bg-white border-b">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 sm:py-5">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center"
              aria-label="Go to homepage"
            >
              <img
                src={finalLogoSrc}
                alt="Logo"
                className="h-12 w-auto object-contain sm:h-16 border border-transparent"
                loading="eager"
                onError={(e) => {
                  // always fallback to /logo.png if anything fails
                  (e.currentTarget as HTMLImageElement).src = fallbackLogo;
                }}
              />
            </button>

            {/* ✅ debug proof image (remove later) */}
            {/* <img
              src="/logo.png"
              alt="Logo debug"
              className="h-10 w-auto object-contain border border-red-500"
              loading="eager"
            /> */}
          </div>

          {/* Right side (Account + Cart) */}
          <div className="flex items-center gap-4">
            {/* Account */}
            <button
              className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-50"
              aria-label="Account"
              type="button"
              onClick={() => navigate("/signin")}
            >
              <svg
                className="h-7 w-7 text-gray-900"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21a8 8 0 10-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>

              <div className="text-left leading-tight">
                <div className="text-sm font-semibold text-gray-900">
                  My Account
                </div>
                <div className="text-xs text-gray-600">
                  Hello, <span className="text-gray-900">Sign In</span>
                </div>
              </div>
            </button>

            {/* Cart */}
            <button
              className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-50"
              aria-label="Cart"
              type="button"
              onClick={() => navigate("/cart")}
            >
              <div className="relative">
                <svg
                  className="h-7 w-7 text-gray-900"
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

                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-700 text-[11px] font-bold text-white">
                  {totals.count}
                </span>
              </div>

              <div className="text-right leading-tight">
                <div className="text-xs text-gray-600">{totals.count} items</div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatKES(totals.total)}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;