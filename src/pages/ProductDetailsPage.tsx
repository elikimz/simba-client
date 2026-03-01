


// // src/pages/ProductDetailsPage.tsx
// import { useMemo, useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useGetProductQuery } from "../features/products/productsAPI";
// import { addToLocalCart } from "../utils/localCart";

// // ✅ guest navbar
// import MainHeader from "../components/navbar/MainHeader";
// // ✅ logged-in navbar
// import UserNavBar from "../components/navbar/userNavbar";

// // ✅ cart api (logged in)
// import { useGetMyCartQuery, useAddToCartMutation } from "../features/cart/cartAPI";

// function kes(n: number) {
//   return `KSh${Number(n || 0).toLocaleString()}.00`;
// }

// // ✅ change to your real number
// const WHATSAPP_NUMBER = "254731030404"; // no + sign for wa.me
// const CALL_NUMBER = "+254731030404";

// type ImgLike = { url: string; is_primary?: boolean; sort_order?: number };

// /** ✅ build gallery URLs from new backend (images[]) + old (image_url) */
// function buildGallery(p: any): string[] {
//   const urls: string[] = [];

//   const apiImgs: ImgLike[] = Array.isArray(p?.images) ? p.images : [];
//   const sorted = [...apiImgs].sort((a, b) => {
//     const ap = a.is_primary ? 0 : 1;
//     const bp = b.is_primary ? 0 : 1;
//     if (ap !== bp) return ap - bp;
//     return (a.sort_order ?? 0) - (b.sort_order ?? 0);
//   });

//   for (const img of sorted) {
//     if (img?.url) urls.push(String(img.url));
//   }

//   if (p?.image_url) urls.push(String(p.image_url));

//   return Array.from(new Set(urls.filter(Boolean)));
// }

// /** ✅ robust number parser (handles "2500", 2500, null, undefined) */
// function asNumber(v: any, fallback = 0) {
//   if (typeof v === "number" && Number.isFinite(v)) return v;
//   if (typeof v === "string") {
//     const n = Number(v.replace(/,/g, "").trim());
//     return Number.isFinite(n) ? n : fallback;
//   }
//   return fallback;
// }

// /** ✅ simple auth check (your app uses access_token) */
// function isLoggedIn() {
//   const token = localStorage.getItem("access_token");
//   return Boolean(token && token.trim().length > 0);
// }

// export default function ProductDetailsPage() {
//   const { productId } = useParams();
//   const navigate = useNavigate();
//   const id = Number(productId);

//   const loggedIn = isLoggedIn();

//   const { data: p, isLoading, isError } = useGetProductQuery(id, {
//     skip: !Number.isFinite(id),
//   });

//   // ✅ cart hooks for logged in users only
//   const {
//     data: cartData,
//     isLoading: cartLoading,
//     isError: cartError,
//     refetch: refetchCart,
//   } = useGetMyCartQuery(undefined, { skip: !loggedIn });

//   const [addToCartApi, { isLoading: addingApi }] = useAddToCartMutation();

//   const [qty, setQty] = useState(1);

//   // ✅ success message toast
//   const [toastOpen, setToastOpen] = useState(false);
//   const [toastText, setToastText] = useState("");
//   const [toastTitle, setToastTitle] = useState("Added to Cart");

//   // ✅ gallery state
//   const images = useMemo(() => buildGallery(p), [p]);
//   const [activeImage, setActiveImage] = useState<string | null>(null);

//   // ✅ zoom + pan state
//   const [zoom, setZoom] = useState(1);
//   const [offset, setOffset] = useState({ x: 0, y: 0 });
//   const draggingRef = useRef(false);
//   const lastRef = useRef({ x: 0, y: 0 });

//   useEffect(() => {
//     setActiveImage(images[0] ?? null);
//     setZoom(1);
//     setOffset({ x: 0, y: 0 });
//   }, [p?.id, images]);

//   // auto-close toast after 3 seconds
//   useEffect(() => {
//     if (!toastOpen) return;
//     const t = window.setTimeout(() => setToastOpen(false), 3000);
//     return () => window.clearTimeout(t);
//   }, [toastOpen]);

//   const inStock = (p?.stock ?? 0) > 0;

//   // ✅ always use parsed numbers for prices
//   const realPrice = useMemo(() => asNumber(p?.price, 0), [p?.price]);
//   const realOriginalPrice = useMemo(() => asNumber(p?.original_price, 0), [p?.original_price]);

//   const hasDiscount = realOriginalPrice > 0 && realOriginalPrice > realPrice;

//   const discountPercent = useMemo(() => {
//     if (!hasDiscount) return 0;
//     return Math.round(((realOriginalPrice - realPrice) / realOriginalPrice) * 100);
//   }, [hasDiscount, realOriginalPrice, realPrice]);

//   const waText = p ? encodeURIComponent(`Hi, I want to order: ${p.name} (Qty: ${qty})`) : "";
//   const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

//   function selectImage(img: string) {
//     setActiveImage(img);
//     setZoom(1);
//     setOffset({ x: 0, y: 0 });
//   }

//   function clamp(n: number, min: number, max: number) {
//     return Math.max(min, Math.min(max, n));
//   }

//   function onWheel(e: React.WheelEvent) {
//     if (!activeImage) return;
//     e.preventDefault();
//     const delta = e.deltaY > 0 ? -0.12 : 0.12;
//     setZoom((z) => clamp(Number((z + delta).toFixed(2)), 1, 3));
//   }

//   function onMouseDown(e: React.MouseEvent) {
//     if (!activeImage) return;
//     if (zoom <= 1) return;
//     draggingRef.current = true;
//     lastRef.current = { x: e.clientX, y: e.clientY };
//   }

//   function onMouseMove(e: React.MouseEvent) {
//     if (!draggingRef.current) return;
//     const dx = e.clientX - lastRef.current.x;
//     const dy = e.clientY - lastRef.current.y;
//     lastRef.current = { x: e.clientX, y: e.clientY };
//     setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
//   }

//   function stopDrag() {
//     draggingRef.current = false;
//   }

//   const hasImage = Boolean(activeImage);

//   const cartCount = useMemo(() => {
//     if (!loggedIn) return 0;
//     const items = cartData?.items ?? [];
//     return items.reduce((sum, it) => sum + (it.quantity || 0), 0);
//   }, [loggedIn, cartData]);

//   const cartTotal = useMemo(() => {
//     if (!loggedIn) return 0;
//     const items = cartData?.items ?? [];
//     return items.reduce((sum, it) => sum + Number(it.product_price ?? 0) * (it.quantity || 0), 0);
//   }, [loggedIn, cartData]);

//   async function handleAddToCart() {
//     if (!p) return;

//     // ✅ if logged in => use API cart
//     if (loggedIn) {
//       try {
//         await addToCartApi({ product_id: p.id, quantity: qty }).unwrap();
//         refetchCart();

//         setToastTitle("Added to Cart");
//         setToastText(`✅ Added ${qty} × ${p.name} to your account cart`);
//         setToastOpen(true);
//       } catch (e: any) {
//         if (String(e?.status) === "401") {
//           navigate("/signin", { state: { from: `/product/${p.id}` } });
//           return;
//         }
//         setToastTitle("Error");
//         setToastText(e?.data?.detail || "Failed to add to cart.");
//         setToastOpen(true);
//       }
//       return;
//     }

//     // ✅ guest => local storage cart
//     addToLocalCart({
//       product_id: p.id,
//       name: p.name,
//       price: realPrice,
//       image_url: p.image_url ?? null,
//       quantity: qty,
//     });

//     setToastTitle("Added to Cart");
//     setToastText(`✅ Added ${qty} × ${p.name} to cart`);
//     setToastOpen(true);
//   }

//   const cartRoute = loggedIn ? "/user/cart" : "/cart";

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* ✅ Navbar switches based on login */}
//       {loggedIn ? (
//         <UserNavBar
//           logoSrc="/images/logo.png"
//           searchValue=""
//           onSearchChange={() => {}}
//           cartCount={cartLoading || cartError ? 0 : cartCount}
//           cartTotalLabel={cartLoading || cartError ? "KSh0.00" : kes(cartTotal)}
//           onCartClick={() => navigate(cartRoute)}
//           wishlistCount={0}
//         />
//       ) : (
//         <MainHeader logoSrc="/images/logo.png" />
//       )}

//       {/* ✅ Success toast */}
//       {toastOpen ? (
//         <div className="fixed bottom-5 right-5 z-50 w-[320px] rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
//           <div className="flex items-start justify-between gap-3">
//             <div>
//               <div
//                 className={[
//                   "text-sm font-extrabold",
//                   toastTitle === "Error" ? "text-rose-700" : "text-emerald-700",
//                 ].join(" ")}
//               >
//                 {toastTitle}
//               </div>
//               <div className="mt-1 text-xs text-gray-700">{toastText}</div>

//               <button
//                 type="button"
//                 onClick={() => navigate(cartRoute)}
//                 className="mt-3 rounded-xl bg-gray-900 px-3 py-2 text-xs font-extrabold text-white hover:bg-black"
//               >
//                 View Cart →
//               </button>
//             </div>

//             <button
//               type="button"
//               onClick={() => setToastOpen(false)}
//               className="rounded-lg px-2 py-1 text-sm font-bold text-gray-500 hover:bg-gray-100"
//               aria-label="Close"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       ) : null}

//       {/* Page content */}
//       <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
//         {!Number.isFinite(id) ? (
//           <div className="mx-auto max-w-[1200px] rounded-2xl bg-white p-6">
//             Invalid product id.
//           </div>
//         ) : isLoading ? (
//           <div className="mx-auto max-w-[1200px] rounded-2xl bg-white p-6">
//             Loading product...
//           </div>
//         ) : isError || !p ? (
//           <div className="mx-auto max-w-[1200px] rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
//             Failed to load this product.
//           </div>
//         ) : (
//           <div className="grid gap-8 lg:grid-cols-2">
//             {/* Left: image */}
//             <div className="rounded-3xl bg-white p-4 shadow-sm">
//               <div className="relative overflow-hidden rounded-2xl bg-gray-100" onWheel={onWheel}>
//                 <div
//                   className={[
//                     "h-[420px] w-full select-none",
//                     hasImage && zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default",
//                   ].join(" ")}
//                   onMouseDown={onMouseDown}
//                   onMouseMove={onMouseMove}
//                   onMouseUp={stopDrag}
//                   onMouseLeave={stopDrag}
//                 >
//                   {hasImage ? (
//                     <img
//                       src={activeImage!}
//                       alt={p.name}
//                       draggable={false}
//                       className="h-full w-full object-contain p-2"
//                       style={{
//                         transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
//                         transformOrigin: "center",
//                         transition: draggingRef.current ? "none" : "transform 120ms ease",
//                       }}
//                     />
//                   ) : (
//                     <div className="flex h-full w-full items-center justify-center p-6 text-center">
//                       <div className="max-w-xs">
//                         <div className="text-5xl">🖼️</div>
//                         <div className="mt-3 text-sm font-semibold text-gray-700">
//                           No product image uploaded
//                         </div>
//                         <div className="mt-1 text-xs text-gray-500">
//                           Ask the seller to add an image for this item.
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Controls */}
//                 <div className="absolute right-3 top-3 flex items-center gap-2">
//                   <button
//                     type="button"
//                     disabled={!hasImage}
//                     onClick={() => setZoom((z) => clamp(Number((z - 0.2).toFixed(2)), 1, 3))}
//                     className="rounded-xl bg-white/90 px-3 py-2 text-sm font-bold shadow-sm hover:bg-white disabled:opacity-60"
//                     aria-label="Zoom out"
//                   >
//                     −
//                   </button>
//                   <button
//                     type="button"
//                     disabled={!hasImage}
//                     onClick={() => setZoom((z) => clamp(Number((z + 0.2).toFixed(2)), 1, 3))}
//                     className="rounded-xl bg-white/90 px-3 py-2 text-sm font-bold shadow-sm hover:bg-white disabled:opacity-60"
//                     aria-label="Zoom in"
//                   >
//                     +
//                   </button>
//                   <button
//                     type="button"
//                     disabled={!hasImage}
//                     onClick={() => {
//                       setZoom(1);
//                       setOffset({ x: 0, y: 0 });
//                     }}
//                     className="rounded-xl bg-white/90 px-3 py-2 text-sm font-bold shadow-sm hover:bg-white disabled:opacity-60"
//                     aria-label="Reset"
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>

//               {/* thumbnails */}
//               {images.length > 0 && (
//                 <div className="mt-4 flex flex-wrap gap-3">
//                   {images.map((img, i) => {
//                     const active = img === activeImage;
//                     return (
//                       <button
//                         key={`${img}-${i}`}
//                         type="button"
//                         onClick={() => selectImage(img)}
//                         className={[
//                           "h-20 w-20 overflow-hidden rounded-xl bg-gray-100 ring-2 transition",
//                           active ? "ring-indigo-600" : "ring-transparent hover:ring-gray-300",
//                         ].join(" ")}
//                         aria-label={`View image ${i + 1}`}
//                       >
//                         <img src={img} alt="" draggable={false} className="h-full w-full object-contain p-1" />
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}

//               <div className="mt-3 text-xs text-gray-500">
//                 Tip: Scroll on the image to zoom, then drag to move.
//               </div>
//             </div>

//             {/* Right: details */}
//             <div className="rounded-3xl bg-white p-6 shadow-sm">
//               <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{p.name}</h1>

//               <div className="mt-4 flex items-center gap-3">
//                 <div className="text-sm text-gray-600">SKU: N/A</div>

//                 {inStock ? (
//                   <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
//                     <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100">
//                       📦
//                     </span>
//                     In Stock
//                   </span>
//                 ) : (
//                   <span className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700">
//                     ⛔ Out of Stock
//                   </span>
//                 )}
//               </div>

//               {/* NOW + THEN */}
//               <div className="mt-5 flex flex-wrap items-center gap-3">
//                 <div className="text-3xl font-extrabold text-gray-900">{kes(realPrice)}</div>

//                 {hasDiscount ? (
//                   <>
//                     <div className="text-sm font-bold text-gray-500 line-through">
//                       {kes(realOriginalPrice)}
//                     </div>
//                     <span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
//                       SAVE {discountPercent}%
//                     </span>
//                   </>
//                 ) : null}
//               </div>

//               {/* WhatsApp + Call */}
//               <div className="mt-6 space-y-3">
//                 <a
//                   href={waLink}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-5 py-4 text-base font-extrabold text-white hover:bg-emerald-600"
//                 >
//                   <span className="text-xl">💬</span> Order via WhatsApp
//                 </a>

//                 <a
//                   href={`tel:${CALL_NUMBER}`}
//                   className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-900 px-5 py-4 text-base font-extrabold text-gray-900 hover:bg-gray-50"
//                 >
//                   <span className="text-xl">📞</span> Call Now
//                 </a>
//               </div>

//               {p.description ? (
//                 <p className="mt-6 text-sm leading-relaxed text-gray-700">{p.description}</p>
//               ) : null}

//               {/* Qty + Add to cart */}
//               <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
//                 <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 p-2">
//                   <button
//                     type="button"
//                     className="h-10 w-10 rounded-xl text-xl font-bold hover:bg-white"
//                     onClick={() => setQty((q) => Math.max(1, q - 1))}
//                   >
//                     −
//                   </button>
//                   <div className="w-14 text-center text-sm font-bold text-gray-900">{qty}</div>
//                   <button
//                     type="button"
//                     className="h-10 w-10 rounded-xl text-xl font-bold hover:bg-white"
//                     onClick={() => setQty((q) => q + 1)}
//                   >
//                     +
//                   </button>
//                 </div>

//                 <button
//                   type="button"
//                   disabled={!inStock || (loggedIn && addingApi)}
//                   onClick={handleAddToCart}
//                   className="flex-1 rounded-2xl border border-emerald-600 bg-white px-6 py-4 text-sm font-extrabold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
//                 >
//                   {loggedIn && addingApi ? "Adding..." : "🛒 Add to cart"}
//                 </button>
//               </div>

//               <div className="mt-6 text-sm text-gray-500">
//                 Category:{" "}
//                 <span className="font-semibold text-gray-800">{p.category?.name ?? "N/A"}</span>
//                 {" • "}
//                 Seller: <span className="font-semibold text-gray-800">{p.seller?.name ?? "N/A"}</span>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => navigate(cartRoute)}
//                 className="mt-5 w-full rounded-2xl bg-gray-900 px-6 py-4 text-sm font-extrabold text-white hover:bg-black"
//               >
//                 View Cart
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// src/pages/ProductDetailsPage.tsx
import { useMemo, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductQuery } from "../features/products/productsAPI";
import { addToLocalCart } from "../utils/localCart";

// ✅ guest navbar
import MainHeader from "../components/navbar/MainHeader";
// ✅ logged-in navbar
import UserNavBar from "../components/navbar/userNavbar";

// ✅ cart api (logged in)
import { useGetMyCartQuery, useAddToCartMutation } from "../features/cart/cartAPI";

function kes(n: number) {
  return `KSh${Number(n || 0).toLocaleString()}.00`;
}

// ✅ change to your real number
const WHATSAPP_NUMBER = "254731030404"; // no + sign for wa.me
const CALL_NUMBER = "+254731030404";

type ImgLike = { url: string; is_primary?: boolean; sort_order?: number };

/** ✅ build gallery URLs from new backend (images[]) + old (image_url) */
function buildGallery(p: any): string[] {
  const urls: string[] = [];

  const apiImgs: ImgLike[] = Array.isArray(p?.images) ? p.images : [];
  const sorted = [...apiImgs].sort((a, b) => {
    const ap = a.is_primary ? 0 : 1;
    const bp = b.is_primary ? 0 : 1;
    if (ap !== bp) return ap - bp;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  for (const img of sorted) {
    if (img?.url) urls.push(String(img.url));
  }

  if (p?.image_url) urls.push(String(p.image_url));

  return Array.from(new Set(urls.filter(Boolean)));
}

/** ✅ robust number parser (handles "2500", 2500, null, undefined) */
function asNumber(v: any, fallback = 0) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

/** ✅ simple auth check (your app uses access_token) */
function isLoggedIn() {
  const token = localStorage.getItem("access_token");
  return Boolean(token && token.trim().length > 0);
}

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const id = Number(productId);

  const loggedIn = isLoggedIn();

  const { data: p, isLoading, isError } = useGetProductQuery(id, {
    skip: !Number.isFinite(id),
  });

  // ✅ cart hooks for logged in users only
  const {
    data: cartData,
    isLoading: cartLoading,
    isError: cartError,
    refetch: refetchCart,
  } = useGetMyCartQuery(undefined, { skip: !loggedIn });

  const [addToCartApi, { isLoading: addingApi }] = useAddToCartMutation();

  const [qty, setQty] = useState(1);

  // ✅ success message toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastTitle, setToastTitle] = useState("Added to Cart");

  // ✅ gallery state
  const images = useMemo(() => buildGallery(p), [p]);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // ✅ zoom + pan state
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setActiveImage(images[0] ?? null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [p?.id, images]);

  // auto-close toast after 3 seconds
  useEffect(() => {
    if (!toastOpen) return;
    const t = window.setTimeout(() => setToastOpen(false), 3000);
    return () => window.clearTimeout(t);
  }, [toastOpen]);

  const inStock = (p?.stock ?? 0) > 0;

  // ✅ always use parsed numbers for prices
  const realPrice = useMemo(() => asNumber(p?.price, 0), [p?.price]);
  const realMaxPrice = useMemo(() => asNumber(p?.max_price, 0), [p?.max_price]);
  const realOriginalPrice = useMemo(
    () => asNumber(p?.original_price, 0),
    [p?.original_price]
  );

  // ✅ show range when max_price exists and is higher than min price
  const hasRange = useMemo(() => {
    return realMaxPrice > 0 && realMaxPrice > realPrice;
  }, [realMaxPrice, realPrice]);

  const displayPrice = useMemo(() => {
    if (!hasRange) return kes(realPrice);
    return `${kes(realPrice)} - ${kes(realMaxPrice)}`;
  }, [hasRange, realPrice, realMaxPrice]);

  // ✅ optional debug log (remove later)
  useEffect(() => {
    if (!p) return;
    console.groupCollapsed(`[ProductDetails] #${p.id} ${p.name}`);
    console.log("price:", p.price, "->", realPrice);
    console.log("max_price:", (p as any).max_price, "->", realMaxPrice);
    console.log("displayPrice:", displayPrice);
    console.groupEnd();
  }, [p, realPrice, realMaxPrice, displayPrice]);

  // ✅ discount logic stays based on min price vs original_price
  const hasDiscount = realOriginalPrice > 0 && realOriginalPrice > realPrice;

  const discountPercent = useMemo(() => {
    if (!hasDiscount) return 0;
    return Math.round(((realOriginalPrice - realPrice) / realOriginalPrice) * 100);
  }, [hasDiscount, realOriginalPrice, realPrice]);

  const waText = p
    ? encodeURIComponent(`Hi, I want to order: ${p.name} (Qty: ${qty})`)
    : "";
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  function selectImage(img: string) {
    setActiveImage(img);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }

  function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
  }

  function onWheel(e: React.WheelEvent) {
    if (!activeImage) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.12 : 0.12;
    setZoom((z) => clamp(Number((z + delta).toFixed(2)), 1, 3));
  }

  function onMouseDown(e: React.MouseEvent) {
    if (!activeImage) return;
    if (zoom <= 1) return;
    draggingRef.current = true;
    lastRef.current = { x: e.clientX, y: e.clientY };
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastRef.current.x;
    const dy = e.clientY - lastRef.current.y;
    lastRef.current = { x: e.clientX, y: e.clientY };
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  }

  function stopDrag() {
    draggingRef.current = false;
  }

  const hasImage = Boolean(activeImage);

  const cartCount = useMemo(() => {
    if (!loggedIn) return 0;
    const items = cartData?.items ?? [];
    return items.reduce((sum, it) => sum + (it.quantity || 0), 0);
  }, [loggedIn, cartData]);

  const cartTotal = useMemo(() => {
    if (!loggedIn) return 0;
    const items = cartData?.items ?? [];
    return items.reduce(
      (sum, it) => sum + Number(it.product_price ?? 0) * (it.quantity || 0),
      0
    );
  }, [loggedIn, cartData]);

  async function handleAddToCart() {
    if (!p) return;

    // ✅ if logged in => use API cart
    if (loggedIn) {
      try {
        await addToCartApi({ product_id: p.id, quantity: qty }).unwrap();
        refetchCart();

        setToastTitle("Added to Cart");
        setToastText(`✅ Added ${qty} × ${p.name} to your account cart`);
        setToastOpen(true);
      } catch (e: any) {
        if (String(e?.status) === "401") {
          navigate("/signin", { state: { from: `/product/${p.id}` } });
          return;
        }
        setToastTitle("Error");
        setToastText(e?.data?.detail || "Failed to add to cart.");
        setToastOpen(true);
      }
      return;
    }

    // ✅ guest => local storage cart (store MIN price)
    addToLocalCart({
      product_id: p.id,
      name: p.name,
      price: realPrice,
      image_url: p.image_url ?? null,
      quantity: qty,
    });

    setToastTitle("Added to Cart");
    setToastText(`✅ Added ${qty} × ${p.name} to cart`);
    setToastOpen(true);
  }

  const cartRoute = loggedIn ? "/user/cart" : "/cart";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar switches based on login */}
      {loggedIn ? (
        <UserNavBar
          logoSrc="/images/logo.png"
          searchValue=""
          onSearchChange={() => {}}
          cartCount={cartLoading || cartError ? 0 : cartCount}
          cartTotalLabel={cartLoading || cartError ? "KSh0.00" : kes(cartTotal)}
          onCartClick={() => navigate(cartRoute)}
          wishlistCount={0}
        />
      ) : (
        <MainHeader logoSrc="/images/logo.png" />
      )}

      {/* ✅ Success toast */}
      {toastOpen ? (
        <div className="fixed bottom-5 right-5 z-50 w-[320px] rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                className={[
                  "text-sm font-extrabold",
                  toastTitle === "Error" ? "text-rose-700" : "text-emerald-700",
                ].join(" ")}
              >
                {toastTitle}
              </div>
              <div className="mt-1 text-xs text-gray-700">{toastText}</div>

              <button
                type="button"
                onClick={() => navigate(cartRoute)}
                className="mt-3 rounded-xl bg-gray-900 px-3 py-2 text-xs font-extrabold text-white hover:bg-black"
              >
                View Cart →
              </button>
            </div>

            <button
              type="button"
              onClick={() => setToastOpen(false)}
              className="rounded-lg px-2 py-1 text-sm font-bold text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}

      {/* Page content */}
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {!Number.isFinite(id) ? (
          <div className="mx-auto max-w-[1200px] rounded-2xl bg-white p-6">
            Invalid product id.
          </div>
        ) : isLoading ? (
          <div className="mx-auto max-w-[1200px] rounded-2xl bg-white p-6">
            Loading product...
          </div>
        ) : isError || !p ? (
          <div className="mx-auto max-w-[1200px] rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
            Failed to load this product.
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: image */}
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="relative overflow-hidden rounded-2xl bg-gray-100" onWheel={onWheel}>
                <div
                  className={[
                    "h-[420px] w-full select-none",
                    hasImage && zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default",
                  ].join(" ")}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={stopDrag}
                  onMouseLeave={stopDrag}
                >
                  {hasImage ? (
                    <img
                      src={activeImage!}
                      alt={p.name}
                      draggable={false}
                      className="h-full w-full object-contain p-2"
                      style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                        transformOrigin: "center",
                        transition: draggingRef.current ? "none" : "transform 120ms ease",
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-6 text-center">
                      <div className="max-w-xs">
                        <div className="text-5xl">🖼️</div>
                        <div className="mt-3 text-sm font-semibold text-gray-700">
                          No product image uploaded
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Ask the seller to add an image for this item.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="absolute right-3 top-3 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!hasImage}
                    onClick={() => setZoom((z) => clamp(Number((z - 0.2).toFixed(2)), 1, 3))}
                    className="rounded-xl bg-white/90 px-3 py-2 text-sm font-bold shadow-sm hover:bg-white disabled:opacity-60"
                    aria-label="Zoom out"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    disabled={!hasImage}
                    onClick={() => setZoom((z) => clamp(Number((z + 0.2).toFixed(2)), 1, 3))}
                    className="rounded-xl bg-white/90 px-3 py-2 text-sm font-bold shadow-sm hover:bg-white disabled:opacity-60"
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    disabled={!hasImage}
                    onClick={() => {
                      setZoom(1);
                      setOffset({ x: 0, y: 0 });
                    }}
                    className="rounded-xl bg-white/90 px-3 py-2 text-sm font-bold shadow-sm hover:bg-white disabled:opacity-60"
                    aria-label="Reset"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* thumbnails */}
              {images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {images.map((img, i) => {
                    const active = img === activeImage;
                    return (
                      <button
                        key={`${img}-${i}`}
                        type="button"
                        onClick={() => selectImage(img)}
                        className={[
                          "h-20 w-20 overflow-hidden rounded-xl bg-gray-100 ring-2 transition",
                          active ? "ring-indigo-600" : "ring-transparent hover:ring-gray-300",
                        ].join(" ")}
                        aria-label={`View image ${i + 1}`}
                      >
                        <img src={img} alt="" draggable={false} className="h-full w-full object-contain p-1" />
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500">
                Tip: Scroll on the image to zoom, then drag to move.
              </div>
            </div>

            {/* Right: details */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{p.name}</h1>

              <div className="mt-4 flex items-center gap-3">
                <div className="text-sm text-gray-600">SKU: N/A</div>

                {inStock ? (
                  <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100">
                      📦
                    </span>
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700">
                    ⛔ Out of Stock
                  </span>
                )}
              </div>

              {/* ✅ NOW (range aware) + THEN */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="text-3xl font-extrabold text-gray-900">
                  {displayPrice}
                </div>

                {hasDiscount ? (
                  <>
                    <div className="text-sm font-bold text-gray-500 line-through">
                      {kes(realOriginalPrice)}
                    </div>
                    <span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
                      SAVE {discountPercent}%
                    </span>
                  </>
                ) : null}
              </div>

              {/* WhatsApp + Call */}
              <div className="mt-6 space-y-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-5 py-4 text-base font-extrabold text-white hover:bg-emerald-600"
                >
                  <span className="text-xl">💬</span> Order via WhatsApp
                </a>

                <a
                  href={`tel:${CALL_NUMBER}`}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-900 px-5 py-4 text-base font-extrabold text-gray-900 hover:bg-gray-50"
                >
                  <span className="text-xl">📞</span> Call Now
                </a>
              </div>

              {p.description ? (
                <p className="mt-6 text-sm leading-relaxed text-gray-700">{p.description}</p>
              ) : null}

              {/* Qty + Add to cart */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 p-2">
                  <button
                    type="button"
                    className="h-10 w-10 rounded-xl text-xl font-bold hover:bg-white"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <div className="w-14 text-center text-sm font-bold text-gray-900">{qty}</div>
                  <button
                    type="button"
                    className="h-10 w-10 rounded-xl text-xl font-bold hover:bg-white"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!inStock || (loggedIn && addingApi)}
                  onClick={handleAddToCart}
                  className="flex-1 rounded-2xl border border-emerald-600 bg-white px-6 py-4 text-sm font-extrabold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                >
                  {loggedIn && addingApi ? "Adding..." : "🛒 Add to cart"}
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                Category:{" "}
                <span className="font-semibold text-gray-800">{p.category?.name ?? "N/A"}</span>
                {" • "}
                Seller: <span className="font-semibold text-gray-800">{p.seller?.name ?? "N/A"}</span>
              </div>

              <button
                type="button"
                onClick={() => navigate(cartRoute)}
                className="mt-5 w-full rounded-2xl bg-gray-900 px-6 py-4 text-sm font-extrabold text-white hover:bg-black"
              >
                View Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}