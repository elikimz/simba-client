

// // src/components/ProductsShowcase.tsx
// import React from "react";
// import ProductCard from "./ProductCard";
// import { useListProductsQuery } from "../../features/products/productsAPI";

// function formatKES(amount: number) {
//   return `KSh${Number(amount || 0).toLocaleString()}.00`;
// }

// const fallbackImage = "/images/about-roof.jpg";

// const ProductsShowcase = () => {
//   const { data, isLoading, isError } = useListProductsQuery();

//   // ✅ Hooks always run (safe)
//   const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
//   const [sort, setSort] = React.useState<
//     "latest" | "name_asc" | "name_desc" | "price_asc" | "price_desc"
//   >("latest");

//   // ✅ Silent mode: don't show anything on loading/error/empty
//   const allProducts = data ?? [];
//   if (isLoading || isError || allProducts.length === 0) {
//     return null;
//   }

//   // ✅ build categories
//   const categoryMap = new Map<string, string>();
//   allProducts.forEach((p) => {
//     if (p.category?.id != null) {
//       categoryMap.set(String(p.category.id), p.category.name ?? "Category");
//     }
//   });

//   const categories = [{ id: "all", name: "All Categories" }].concat(
//     Array.from(categoryMap.entries())
//       .map(([id, name]) => ({ id, name }))
//       .sort((a, b) => a.name.localeCompare(b.name))
//   );

//   // ✅ filter + sort
//   const filtered = allProducts.filter((p) => {
//     if (selectedCategory === "all") return true;
//     return String(p.category?.id ?? "") === selectedCategory;
//   });

//   const sorted = [...filtered].sort((a, b) => {
//     if (sort === "name_asc") return a.name.localeCompare(b.name);
//     if (sort === "name_desc") return b.name.localeCompare(a.name);
//     if (sort === "price_asc") return a.price - b.price;
//     if (sort === "price_desc") return b.price - a.price;

//     const da = new Date(a.created_at).getTime();
//     const db = new Date(b.created_at).getTime();
//     return db - da;
//   });

//   const products = sorted.map((p) => ({
//     id: p.id,
//     image: p.image_url || fallbackImage,
//     name: p.name,
//     price: formatKES(p.price),
//     inStock: (p.stock ?? 0) > 0,
//   }));

//   // ✅ Silent mode: if filters remove everything, hide whole section
//   if (products.length === 0) return null;

//   return (
//     <section className="bg-gray-100 py-14">
//       <div className="mx-auto max-w-[1400px] px-6">
//         {/* Heading */}
//         <div className="text-center">
//           <h2 className="text-3xl font-extrabold tracking-wide text-indigo-900 md:text-4xl">
//             SIMBA CEMENT & BUILDING MATERIALS
//           </h2>
//           <p className="mx-auto mt-4 max-w-5xl text-base font-semibold text-gray-800">
//             Order genuine Simba Cement and quality construction materials including steel,
//             sand, ballast, nails, binding wire, roofing sheets and more — available for
//             bulk and retail supply with reliable delivery.
//           </p>
//         </div>

//         {/* Filters */}
//         <div className="mx-auto mt-8 max-w-5xl">
//           <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
//             {/* Category */}
//             <div className="flex w-full flex-col gap-1 sm:w-[55%]">
//               <label className="text-xs font-bold text-gray-700">Category</label>
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-300"
//               >
//                 {categories.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Sort */}
//             <div className="flex w-full flex-col gap-1 sm:w-[45%]">
//               <label className="text-xs font-bold text-gray-700">Sort</label>
//               <select
//                 value={sort}
//                 onChange={(e) => setSort(e.target.value as any)}
//                 className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-300"
//               >
//                 <option value="latest">Latest</option>
//                 <option value="name_asc">Name: A → Z</option>
//                 <option value="name_desc">Name: Z → A</option>
//                 <option value="price_asc">Price: Low → High</option>
//                 <option value="price_desc">Price: High → Low</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Grid */}
//         <div className="mt-12 grid gap-10 lg:grid-cols-5">
//           {/* Promo Banner */}
//           <div className="rounded-xl bg-gradient-to-b from-gray-950 to-gray-900 p-10 text-white">
//             <div className="text-6xl font-extrabold tracking-tight">-5%</div>

//             <div className="mt-10 text-base font-semibold text-white/80">
//               This Week Only
//             </div>

//             <div className="mt-3 text-3xl font-extrabold leading-snug">
//               Bulk Deals Available
//             </div>

//             <p className="mt-4 text-sm leading-relaxed text-white/70">
//               Order cement and building materials today and enjoy up to 5% Off on
//               selected items. Fast delivery available.
//             </p>

//             <button className="mt-10 inline-flex items-center gap-3 text-sm font-semibold text-white/90 hover:text-white">
//               Shop Now <span className="text-xl leading-none">→</span>
//             </button>
//           </div>

//           {/* Products */}
//           <div className="lg:col-span-4">
//             <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
//               {products.map((p) => (
//                 <ProductCard key={p.id} {...p} />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductsShowcase;


// src/components/ProductsShowcase.tsx
import React from "react";
import ProductCard from "./ProductCard";
import { useListProductsQuery } from "../../features/products/productsAPI";

const fallbackImage = "/images/about-roof.jpg";

function toNumber(v: unknown): number | null {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const t = v.trim();
    if (!t) return null;
    const cleaned = t.replace(/,/g, "").replace(/[^\d.]+/g, "");
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * For sorting:
 * - use max_price when present (because that's the upper end of the range)
 * - otherwise use normal price
 */
function sortPriceValue(p: any): number {
  const maxP = toNumber(p?.max_price);
  if (maxP != null) return maxP;
  const minP = toNumber(p?.price);
  return minP ?? 0;
}

const ProductsShowcase = () => {
  const { data, isLoading, isError } = useListProductsQuery();

  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [sort, setSort] = React.useState<
    "latest" | "name_asc" | "name_desc" | "price_asc" | "price_desc"
  >("latest");

  const allProducts = data ?? [];
  if (isLoading || isError || allProducts.length === 0) {
    return null;
  }

  // ✅ build categories
  const categoryMap = new Map<string, string>();
  allProducts.forEach((p: any) => {
    if (p.category?.id != null) {
      categoryMap.set(String(p.category.id), p.category.name ?? "Category");
    }
  });

  const categories = [{ id: "all", name: "All Categories" }].concat(
    Array.from(categoryMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  // ✅ filter
  const filtered = allProducts.filter((p: any) => {
    if (selectedCategory === "all") return true;
    return String(p.category?.id ?? "") === selectedCategory;
  });

  // ✅ sort
  const sorted = [...filtered].sort((a: any, b: any) => {
    if (sort === "name_asc") return a.name.localeCompare(b.name);
    if (sort === "name_desc") return b.name.localeCompare(a.name);

    if (sort === "price_asc") return sortPriceValue(a) - sortPriceValue(b);
    if (sort === "price_desc") return sortPriceValue(b) - sortPriceValue(a);

    const da = new Date(a.created_at).getTime();
    const db = new Date(b.created_at).getTime();
    return db - da;
  });

  // ✅ IMPORTANT: pass raw price + max_price through to ProductCard
  const products = sorted.map((p: any) => {
    const mapped = {
      id: p.id,
      image: p.image_url || fallbackImage,
      name: p.name,

      // ✅ let ProductCard format and show range
      price: p.price,
      max_price: p.max_price ?? null,

      inStock: (p.stock ?? 0) > 0,
      categoryName: p.category?.name ?? undefined,
      availableInText: p.available_in_text ?? undefined,
    };

    // ✅ Debug (remove later)
    console.log("[ProductsShowcase] map -> ProductCard props:", {
      id: mapped.id,
      name: mapped.name,
      price: mapped.price,
      max_price: mapped.max_price,
      priceType: typeof mapped.price,
      maxPriceType: typeof mapped.max_price,
    });

    return mapped;
  });

  if (products.length === 0) return null;

  return (
    <section className="bg-gray-100 py-14">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-wide text-indigo-900 md:text-4xl">
            SIMBA CEMENT & BUILDING MATERIALS
          </h2>
          <p className="mx-auto mt-4 max-w-5xl text-base font-semibold text-gray-800">
            Order genuine Simba Cement and quality construction materials including steel,
            sand, ballast, nails, binding wire, roofing sheets and more — available for
            bulk and retail supply with reliable delivery.
          </p>
        </div>

        {/* Filters */}
        <div className="mx-auto mt-8 max-w-5xl">
          <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Category */}
            <div className="flex w-full flex-col gap-1 sm:w-[55%]">
              <label className="text-xs font-bold text-gray-700">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-300"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex w-full flex-col gap-1 sm:w-[45%]">
              <label className="text-xs font-bold text-gray-700">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-300"
              >
                <option value="latest">Latest</option>
                <option value="name_asc">Name: A → Z</option>
                <option value="name_desc">Name: Z → A</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-12 grid gap-10 lg:grid-cols-5">
          {/* Promo Banner */}
          <div className="rounded-xl bg-gradient-to-b from-gray-950 to-gray-900 p-10 text-white">
            <div className="text-6xl font-extrabold tracking-tight">-5%</div>

            <div className="mt-10 text-base font-semibold text-white/80">
              This Week Only
            </div>

            <div className="mt-3 text-3xl font-extrabold leading-snug">
              Bulk Deals Available
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Order cement and building materials today and enjoy up to 5% Off on
              selected items. Fast delivery available.
            </p>

            <button className="mt-10 inline-flex items-center gap-3 text-sm font-semibold text-white/90 hover:text-white">
              Shop Now <span className="text-xl leading-none">→</span>
            </button>
          </div>

          {/* Products */}
          <div className="lg:col-span-4">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsShowcase;