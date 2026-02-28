

// src/components/ProductCard.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../assets/store";
import { productsAPI } from "../../features/products/productsAPI";

import { Heart, RefreshCcw, Eye, Package, Ban, Loader2 } from "lucide-react";

type Props = {
  id: number;
  image: string;
  name: string;
  price: string;
  inStock?: boolean;
  categoryName?: string;
  availableInText?: string;
};

const WHATSAPP_NUMBER = "254731030404"; // no +
const CALL_NUMBER = "+254731030404";

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
  const dispatch = useDispatch<AppDispatch>();

  const waText = encodeURIComponent(`Hi, I want to order: ${name}`);
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  const [navLoading, setNavLoading] = useState(false);
  const [wishTick, setWishTick] = useState(0);

  const isWishlisted = useMemo(() => {
    const items = readWishlist();
    return items.some((x) => x.id === id);
  }, [id, wishTick]);

  async function handleNavigate() {
    if (navLoading) return;
    setNavLoading(true);

    try {
      await dispatch(
        productsAPI.endpoints.getProduct.initiate(id, { forceRefetch: false })
      ).unwrap();
      navigate(`/product/${id}`);
    } catch {
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
      <div className="w-full">
        {/* ✅ Image (phone-safe: no cropping) */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-100">
          {/* 
            Use aspect ratio so cards are consistent.
            - phones: 4/3
            - md+:   1/1
          */}
          <div className="aspect-[4/3] md:aspect-square w-full">
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="
                h-full w-full
                object-contain
                p-3
                transition-transform duration-500
                group-hover:scale-[1.03]
              "
            />
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={toggleWishlist}
            className={[
              "absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full",
              "border border-white/30 bg-black/25 text-white backdrop-blur",
              "hover:bg-black/35 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-white/70",
            ].join(" ")}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            title={isWishlisted ? "Wishlisted" : "Add to wishlist"}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
          </button>

          {/* Extra icons */}
          <div className="absolute right-3 top-14 flex flex-col gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white backdrop-blur">
              <RefreshCcw className="h-4 w-4" />
            </div>
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white backdrop-blur">
              <Eye className="h-4 w-4" />
            </div>
          </div>

          {/* Category badge */}
          {categoryName ? (
            <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {categoryName}
            </span>
          ) : null}
        </div>

        {/* Main info */}
        <div className="pt-3">
          <div className="flex items-start justify-between gap-3">
            <h4 className="min-w-0 flex-1 line-clamp-2 text-sm font-semibold text-gray-900">
              {name}
            </h4>

            {inStock ? (
              <span className="shrink-0 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                In stock
              </span>
            ) : (
              <span className="shrink-0 whitespace-nowrap rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                Out of stock
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-base font-extrabold tracking-tight text-gray-900">
              {price}
            </p>

            {navLoading ? (
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </span>
            ) : null}
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-gray-600">
            <span
              className={[
                "inline-flex h-7 w-7 items-center justify-center rounded-xl",
                inStock ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
              ].join(" ")}
            >
              {inStock ? <Package className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
            </span>
            <span>{inStock ? "Ready to ship" : "Currently unavailable"}</span>
          </div>

          <div
            className="
              mt-3 overflow-hidden
              max-h-0 opacity-0 transition-all duration-300
              group-hover:max-h-[220px] group-hover:opacity-100
              max-sm:max-h-[220px] max-sm:opacity-100
            "
          >
            <div className="text-xs text-gray-700">
              <span className="text-gray-500">Available in:</span>{" "}
              <span className="font-medium text-gray-800">
                {availableInText ?? "Ask seller for available colors"}
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-emerald-700"
              >
                Order via WhatsApp
              </a>

              <a
                href={`tel:${CALL_NUMBER}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-gray-900 bg-transparent px-4 py-3 text-sm font-extrabold text-gray-900 hover:bg-white/60"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}