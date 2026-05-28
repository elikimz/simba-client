import { Heart } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  image_url?: string;
  image?: string;
  price?: number;
  category?: { name: string };
  categoryName?: string;
  description?: string;
}

interface ProductCardProps {
  product?: Product;
  id?: number;
  image?: string;
  name?: string;
  price?: number | string;
  categoryName?: string;
  inStock?: boolean;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product: p, id, image, name, price, categoryName, inStock = true, onAddToCart }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Support both new and old prop formats
  const productData = p || {
    id: id || 0,
    name: name || "",
    image_url: image || "",
    price: typeof price === "string" ? parseInt(price) : price || 0,
    category: categoryName ? { name: categoryName } : undefined,
  };

  const realPrice = productData.price || 0;
  const productImage = productData.image_url || productData.image || "";
  const productName = productData.name || "";
  const productCategory = productData.category || (categoryName ? { name: categoryName } : undefined);

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-subtle hover:shadow-luxury transition-all duration-300 hover:scale-105">
      {/* Product Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-50">
        {productImage ? (
          <img
            src={productImage}
            alt={`${productName} - Premium Building Materials | National Simba Cements`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-indigo-300 text-sm sm:text-base">No Image</span>
          </div>
        )}

        {/* Stock Badge */}
        {inStock && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 rounded-full bg-green-500/90 px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold text-white animate-pulse">
            In Stock
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 left-2 sm:top-3 sm:left-3 rounded-full bg-white/90 p-2 sm:p-2.5 shadow-md hover:bg-white transition-all"
        >
          <Heart
            className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        {/* Category */}
        {productCategory && (
          <p className="text-xs text-indigo-600 font-semibold mb-1 uppercase tracking-wide">
            {productCategory.name}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors">
          {productName}
        </h3>

        {/* Price */}
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-lg sm:text-2xl font-bold text-indigo-700">
            KSh {typeof realPrice === "number" ? realPrice.toLocaleString() : realPrice}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onAddToCart?.(productData as Product)}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
