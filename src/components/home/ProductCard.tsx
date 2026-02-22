


// // src/components/ProductCard.tsx
// import { useNavigate } from "react-router-dom";

// type Props = {
//   id: number;
//   image: string;
//   name: string;
//   price: string;
//   inStock?: boolean;
//   categoryName?: string;

//   // ✅ optional: if you have it later from API
//   availableInText?: string; // e.g. "GREEN, TILE RED, SKY BLUE..."
// };

// const WHATSAPP_NUMBER = "254700000000"; // no +
// const CALL_NUMBER = "+254700000000";

// const ProductCard = ({
//   id,
//   image,
//   name,
//   price,
//   inStock,
//   categoryName,
//   availableInText,
// }: Props) => {
//   const navigate = useNavigate();

//   const waText = encodeURIComponent(`Hi, I want to order: ${name}`);
//   const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

//   return (
//     <button
//       type="button"
//       onClick={() => navigate(`/product/${id}`)}
//       className="group w-full text-left"
//     >
//       {/* Card */}
//       <div className="rounded-2xl bg-white shadow-sm">
//         {/* Image */}
//         <div className="relative overflow-hidden rounded-2xl">
//           <img
//             src={image}
//             alt={name}
//             className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
//           />

//           {/* Wishlist */}
//           <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm">
//             🤍
//           </div>

//           {/* Extra icons (optional, matches screenshot vibe) */}
//           <div className="absolute right-3 top-14 flex flex-col gap-2">
//             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm">
//               🔁
//             </div>
//             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm">
//               👁️
//             </div>
//           </div>

//           {/* Dots (optional) */}
//           <div className="absolute bottom-3 left-3 rounded-xl bg-white/70 px-3 py-2 backdrop-blur">
//             <div className="flex items-center gap-2">
//               <span className="h-2 w-2 rounded-full bg-white" />
//               <span className="h-2 w-2 rounded-full bg-white" />
//               <span className="h-2 w-2 rounded-full bg-yellow-400" />
//               <span className="h-2 w-2 rounded-full bg-white" />
//             </div>
//           </div>

//           {/* Category badge */}
//           {categoryName ? (
//             <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-900 backdrop-blur">
//               {categoryName}
//             </span>
//           ) : null}
//         </div>

//         {/* Main info */}
//         <div className="p-4">
//           <h4 className="text-base font-extrabold text-gray-900">{name}</h4>

//           <p className="mt-2 text-sm text-gray-700">{price}</p>

//           {inStock ? (
//             <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-600">
//               <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
//                 📦
//               </span>
//               <span>In Stock</span>
//             </div>
//           ) : (
//             <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-rose-600">
//               <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50">
//                 ⛔
//               </span>
//               <span>Out of Stock</span>
//             </div>
//           )}

//           {/* ✅ Hover-reveal section (like screenshot) */}
//           <div
//             className="
//               mt-4
//               overflow-hidden
//               border-t border-gray-100 pt-4
//               max-h-0 opacity-0
//               transition-all duration-300
//               group-hover:max-h-[220px] group-hover:opacity-100

//               /* Mobile: show by default */
//               max-sm:max-h-[220px] max-sm:opacity-100
//             "
//           >
//             <div className="text-sm text-gray-700">
//               <span className="text-gray-500">Available in :</span>{" "}
//               <span className="font-medium text-gray-800">
//                 {availableInText ?? "Ask seller for available colors"}
//               </span>
//             </div>

//             <div className="mt-4 flex flex-col gap-3">
//               <a
//                 href={waLink}
//                 target="_blank"
//                 rel="noreferrer"
//                 onClick={(e) => e.stopPropagation()}
//                 className="flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-4 py-4 text-sm font-extrabold text-white hover:bg-emerald-600"
//               >
//                 Order via WhatsApp
//               </a>

//               <a
//                 href={`tel:${CALL_NUMBER}`}
//                 onClick={(e) => e.stopPropagation()}
//                 className="flex w-full items-center justify-center rounded-2xl border-2 border-gray-900 px-4 py-4 text-sm font-extrabold text-gray-900 hover:bg-gray-50"
//               >
//                 Call Now
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </button>
//   );
// };

// export default ProductCard;





// src/components/ProductCard.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../assets/store"; // ✅ adjust path if different
import { productsAPI } from "../../features/products/productsAPI"; // ✅ adjust path to your file

type Props = {
  id: number;
  image: string;
  name: string;
  price: string;
  inStock?: boolean;
  categoryName?: string;
  availableInText?: string;
};

const WHATSAPP_NUMBER = "254700000000"; // no +
const CALL_NUMBER = "+254700000000";

type WishlistItem = {
  id: number;
  name: string;
  image: string;
  price: string;
  inStock?: boolean;
  categoryName?: string;
  savedAt: string;
};

const LS_KEY = "wishlist_products";

function readWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeWishlist(items: WishlistItem[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export default function ProductCard({
  id,
  image,
  name,
  price,
  inStock,
  categoryName,
  availableInText,
}: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>(); // ✅ no custom hook

  const waText = encodeURIComponent(`Hi, I want to order: ${name}`);
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  const [navLoading, setNavLoading] = useState(false);
  const [wishTick, setWishTick] = useState(0); // forces re-render when localStorage changes

  const isWishlisted = useMemo(() => {
    const items = readWishlist();
    return items.some((x) => x.id === id);
  }, [id, wishTick]);

  async function handleNavigate() {
    if (navLoading) return;
    setNavLoading(true);

    try {
      // ✅ Preload product into RTK Query cache before navigating
      await dispatch(
        productsAPI.endpoints.getProduct.initiate(id, { forceRefetch: false })
      ).unwrap();

      navigate(`/product/${id}`);
    } catch {
      // Even if preload fails, still navigate (details page can show error)
      navigate(`/product/${id}`);
    } finally {
      setNavLoading(false);
    }
  }

  function toggleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    const items = readWishlist();
    const exists = items.some((x) => x.id === id);

    const next = exists
      ? items.filter((x) => x.id !== id)
      : [
          {
            id,
            name,
            image,
            price,
            inStock,
            categoryName,
            savedAt: new Date().toISOString(),
          },
          ...items,
        ];

    writeWishlist(next);
    setWishTick((n) => n + 1);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigate();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={onKeyDown}
      aria-disabled={navLoading}
      className="group w-full cursor-pointer text-left outline-none disabled:opacity-80"
    >
      {/* Card */}
      <div className="rounded-2xl bg-white shadow-sm">
        {/* Image */}
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={image}
            alt={name}
            className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* ❤️ Wishlist (click should NOT navigate) */}
          <button
            type="button"
            onClick={toggleWishlist}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? "❤️" : "🤍"}
          </button>

          {/* Extra icons (optional) */}
          <div className="absolute right-3 top-14 flex flex-col gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm">
              🔁
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm">
              👁️
            </div>
          </div>

          {/* Category badge */}
          {categoryName ? (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-900 backdrop-blur">
              {categoryName}
            </span>
          ) : null}
        </div>

        {/* Main info */}
        <div className="p-4">
          <h4 className="text-base font-extrabold text-gray-900">{name}</h4>
          <p className="mt-2 text-sm text-gray-700">{price}</p>

          {inStock ? (
            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                📦
              </span>
              <span>In Stock</span>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-rose-600">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50">
                ⛔
              </span>
              <span>Out of Stock</span>
            </div>
          )}

          {/* Hover-reveal section */}
          <div
            className="
              mt-4 overflow-hidden border-t border-gray-100 pt-4
              max-h-0 opacity-0 transition-all duration-300
              group-hover:max-h-[220px] group-hover:opacity-100
              max-sm:max-h-[220px] max-sm:opacity-100
            "
          >
            <div className="text-sm text-gray-700">
              <span className="text-gray-500">Available in :</span>{" "}
              <span className="font-medium text-gray-800">
                {availableInText ?? "Ask seller for available colors"}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-4 py-4 text-sm font-extrabold text-white hover:bg-emerald-600"
              >
                Order via WhatsApp
              </a>

              <a
                href={`tel:${CALL_NUMBER}`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex w-full items-center justify-center rounded-2xl border-2 border-gray-900 px-4 py-4 text-sm font-extrabold text-gray-900 hover:bg-gray-50"
              >
                Call Now
              </a>
            </div>

            {navLoading && (
              <div className="mt-3 text-xs font-semibold text-gray-500">
                Loading product…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}