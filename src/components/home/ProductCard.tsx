import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

type Props = {
  id: number;
  image: string;
  name: string;
  price: number | string;
  max_price?: number | null;
  inStock: boolean;
  categoryName?: string;
};

const CALL_NUMBER = "+254731030404";
const WHATSAPP_NUMBER = "254731030404";

const ProductCard = ({ id, image, name, price, max_price, inStock, categoryName }: Props) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const displayPrice = useMemo(() => {
    const p = Number(price || 0);
    return `KSh${p.toLocaleString()}.00`;
  }, [price]);

  const waText = encodeURIComponent(`Hi, I want to order: ${name}`);
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  const toggleWishlist = () => setIsWishlisted(!isWishlisted);

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="group relative cursor-pointer h-full flex flex-col rounded-2xl overflow-hidden bg-white shadow-subtle hover:shadow-luxury transition-all duration-500 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
        <img
          src={image}
          alt={`${name} - Premium Building Materials | National Simba Cements`}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          fetchPriority={id <= 5 ? "high" : "auto"}
        />
        
        {/* Overlay Badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist();
          }}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-slate-900 hover:bg-premium-accent hover:text-white transition-all duration-300 shadow-md"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Stock Badge */}
        <div className="absolute left-4 top-4">
          {inStock ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white">
              <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse"></span>
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-premium-accent transition-colors">
          {name}
        </h3>

        {/* Price */}
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-xl font-black text-premium-accent">{displayPrice}</span>
          {max_price && (
            <span className="text-xs text-slate-400 line-through">
              KSh{Number(max_price).toLocaleString()}.00
            </span>
          )}
        </div>

        {/* Category */}
        {categoryName && (
          <div className="mb-4 inline-block">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {categoryName}
            </span>
          </div>
        )}

        {/* Action Buttons - Hidden until hover */}
        <div className="mt-auto flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-700 px-4 py-3 text-sm font-bold text-white hover:shadow-lg transition-all duration-300"
          >
            Order via WhatsApp
          </a>
          <a
            href={`tel:${CALL_NUMBER}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex w-full items-center justify-center rounded-xl border-2 border-premium-accent bg-white px-4 py-3 text-sm font-bold text-premium-accent hover:bg-premium-accent hover:text-white transition-all duration-300"
          >
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
