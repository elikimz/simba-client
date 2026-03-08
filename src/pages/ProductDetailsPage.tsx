import { useMemo, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductQuery } from "../features/products/productsAPI";
import { addToLocalCart } from "../utils/localCart";
import SEOHelmet from "../utils/SEOHelmet";

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
  const realOriginalPrice = useMemo(() => asNumber(p?.original_price, 0), [p?.original_price]);

  const hasDiscount = realOriginalPrice > 0 && realOriginalPrice > realPrice;

  const discountPercent = useMemo(() => {
    if (!hasDiscount) return 0;
    return Math.round(((realOriginalPrice - realPrice) / realOriginalPrice) * 100);
  }, [hasDiscount, realOriginalPrice, realPrice]);

  const waText = p ? encodeURIComponent(`Hi, I want to order: ${p.name} (Qty: ${qty})`) : "";
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
    return items.reduce((sum, it) => sum + Number(it.product_price ?? 0) * (it.quantity || 0), 0);
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

    // ✅ guest => local storage cart
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
      <SEOHelmet
        title={p ? `${p.name} - Simba Cement` : "Product Details - Simba Cement"}
        description={p ? p.description || `Buy ${p.name} from Simba Cement. Price: ${kes(realPrice)}` : "View product details from Simba Cement"}
        keywords={p ? `${p.name}, cement, construction materials` : "cement, construction materials"}
        ogTitle={p ? `${p.name} - Simba Cement` : "Product Details"}
        ogDescription={p ? p.description || `Buy ${p.name}` : "View product details"}
        ogImage={activeImage || p?.image_url || undefined}
        canonicalUrl={`https://simba-cement.com/product/${id}`}
      />
      
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
              <div
                className="relative overflow-hidden rounded-2xl bg-gray-100"
                onWheel={onWheel}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={stopDrag}
                onMouseLeave={stopDrag}
              >
                <div
                  className="h-[420px] w-full select-none transition-transform"
                  style={{
                    transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
                    cursor: zoom > 1 ? "grab" : "default",
                  }}
                >
                  {hasImage ? (
                    <img
                      src={activeImage || ""}
                      alt={p.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No image available
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail gallery */}
              {images.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectImage(img)}
                      className={`h-20 w-20 flex-shrink-0 rounded-lg border-2 overflow-hidden ${
                        activeImage === img ? "border-blue-500" : "border-gray-300"
                      }`}
                    >
                      <img src={img} alt={`${p.name} ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{p.name}</h1>
                {p.category && (
                  <p className="mt-2 text-sm text-gray-600">Category: {p.category.name}</p>
                )}
              </div>

              {/* Price section */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-blue-600">{kes(realPrice)}</span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-gray-500 line-through">{kes(realOriginalPrice)}</span>
                      <span className="rounded-lg bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                        -{discountPercent}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Stock status */}
              <div>
                <p className={`text-sm font-semibold ${inStock ? "text-green-600" : "text-red-600"}`}>
                  {inStock ? `✓ In Stock (${p.stock} available)` : "Out of Stock"}
                </p>
              </div>

              {/* Description */}
              {p.description && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Description</h2>
                  <p className="mt-2 text-gray-700">{p.description}</p>
                </div>
              )}

              {/* Quantity selector */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                    className="w-16 border-0 text-center"
                    min="1"
                  />
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || addingApi}
                  className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {addingApi ? "Adding..." : "Add to Cart"}
                </button>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
                >
                  WhatsApp
                </a>
              </div>

              {/* Contact info */}
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-700">
                  Have questions? Call us at{" "}
                  <a href={`tel:${CALL_NUMBER}`} className="font-bold text-blue-600 hover:underline">
                    {CALL_NUMBER}
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
