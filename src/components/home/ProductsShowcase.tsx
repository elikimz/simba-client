


// // src/components/ProductsShowcase.tsx
// import ProductCard from "./ProductCard";
// import { useListProductsQuery } from "../../features/products/productsAPI"; // ✅ adjust path if needed
// import React from "react";

// function formatKES(amount: number) {
//   return `KSh${Number(amount || 0).toLocaleString()}.00`;
// }

// const fallbackImage = "/images/about-roof.jpg";

// const ProductsShowcase = () => {
//   const { data, isLoading, isError, error, refetch } = useListProductsQuery();

//   // ✅ build dynamic categories from API products (no UI changes here)
//   const categoryMap = new Map<string, string>();
//   (data ?? []).forEach((p) => {
//     if (p.category?.id != null) categoryMap.set(String(p.category.id), p.category.name ?? "Category");
//   });
//   const categories = [{ id: "all", name: "All Categories" }].concat(
//     Array.from(categoryMap.entries())
//       .map(([id, name]) => ({ id, name }))
//       .sort((a, b) => a.name.localeCompare(b.name))
//   );

//   // ✅ local filter state
//   const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
//   const [sort, setSort] = React.useState<"latest" | "name_asc" | "name_desc" | "price_asc" | "price_desc">(
//     "latest"
//   );

//   // ✅ filter + sort using API data
//   const filtered = (data ?? []).filter((p) => {
//     if (selectedCategory === "all") return true;
//     return String(p.category?.id ?? "") === selectedCategory;
//   });

//   const sorted = [...filtered].sort((a, b) => {
//     if (sort === "name_asc") return a.name.localeCompare(b.name);
//     if (sort === "name_desc") return b.name.localeCompare(a.name);
//     if (sort === "price_asc") return a.price - b.price;
//     if (sort === "price_desc") return b.price - a.price;

//     // latest
//     const da = new Date(a.created_at).getTime();
//     const db = new Date(b.created_at).getTime();
//     return db - da;
//   });

//   // API returns ProductResponse[]
//   const products =
//   sorted.map((p) => ({
//     id: p.id, // ✅ add this
//     image: p.image_url || fallbackImage,
//     name: p.name,
//     price: formatKES(p.price),
//     inStock: p.stock > 0,
//     categoryName: p.category?.name,
//   })) ?? [];

//   return (
//     <section className="bg-gray-100 py-14">
//       <div className="mx-auto max-w-[1400px] px-6">
//         {/* Heading */}
//         <div className="text-center">
//           <h2 className="text-3xl font-extrabold tracking-wide text-indigo-900 md:text-4xl">
//             MAISHA MABATI PRODUCTS
//           </h2>
//           <p className="mx-auto mt-4 max-w-5xl text-base font-semibold text-gray-800">
//             Our high quality, KEBS standard roofing sheets are durable, functional and
//             strong with a wide variety to meet every customer need whether on-demand
//             or custom
//           </p>
//         </div>

//         {/* ✅ Filters (kept inside this component only) */}
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
//               Only This Week
//             </div>

//             <div className="mt-3 text-3xl font-extrabold leading-snug">
//               Across All Products
//             </div>

//             <p className="mt-4 text-sm leading-relaxed text-white/70">
//               Shop our Products and get up to 5% Off and Free shipping
//             </p>

//             <button className="mt-10 inline-flex items-center gap-3 text-sm font-semibold text-white/90 hover:text-white">
//               Shop Now <span className="text-xl leading-none">→</span>
//             </button>
//           </div>

//           {/* Products */}
//           <div className="lg:col-span-4">
//             {/* Loading */}
//             {isLoading ? (
//               <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
//                 {Array.from({ length: 8 }).map((_, i) => (
//                   <div key={i} className="animate-pulse">
//                     <div className="h-60 w-full rounded-2xl bg-gray-200" />
//                     <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
//                     <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
//                   </div>
//                 ))}
//               </div>
//             ) : isError ? (
//               <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
//                 <div className="text-sm font-bold">Failed to load products.</div>
//                 <div className="mt-1 text-xs opacity-80">
//                   {(error as any)?.data?.detail ||
//                     (error as any)?.error ||
//                     "Please try again."}
//                 </div>
//                 <button
//                   onClick={() => refetch()}
//                   className="mt-4 rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800"
//                 >
//                   Retry
//                 </button>
//               </div>
//             ) : (
//               <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
//                 {products.map((p) => (
//   <ProductCard key={p.id} {...p} />
// ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductsShowcase;






// src/components/ProductsShowcase.tsx
import ProductCard from "./ProductCard";
import { useListProductsQuery } from "../../features/products/productsAPI"; // ✅ adjust path if needed
import React from "react";

function formatKES(amount: number) {
  return `KSh${Number(amount || 0).toLocaleString()}.00`;
}

const fallbackImage = "/images/about-roof.jpg";

const ProductsShowcase = () => {
  const { data, isLoading, isError, error, refetch } = useListProductsQuery();

  // ✅ build dynamic categories from API products (no UI changes here)
  const categoryMap = new Map<string, string>();
  (data ?? []).forEach((p) => {
    if (p.category?.id != null)
      categoryMap.set(String(p.category.id), p.category.name ?? "Category");
  });

  const categories = [{ id: "all", name: "All Categories" }].concat(
    Array.from(categoryMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  // ✅ local filter state
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [sort, setSort] = React.useState<
    "latest" | "name_asc" | "name_desc" | "price_asc" | "price_desc"
  >("latest");

  // ✅ filter + sort using API data
  const filtered = (data ?? []).filter((p) => {
    if (selectedCategory === "all") return true;
    return String(p.category?.id ?? "") === selectedCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "name_asc") return a.name.localeCompare(b.name);
    if (sort === "name_desc") return b.name.localeCompare(a.name);
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;

    // latest
    const da = new Date(a.created_at).getTime();
    const db = new Date(b.created_at).getTime();
    return db - da;
  });

  // ✅ ProductCard props (category removed)
  const products =
    sorted.map((p) => ({
      id: p.id,
      image: p.image_url || fallbackImage,
      name: p.name,
      price: formatKES(p.price),
      inStock: p.stock > 0,
      // ✅ removed: categoryName: p.category?.name,
    })) ?? [];

  return (
    <section className="bg-gray-100 py-14">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-wide text-indigo-900 md:text-4xl">
            MAISHA MABATI PRODUCTS
          </h2>
          <p className="mx-auto mt-4 max-w-5xl text-base font-semibold text-gray-800">
            Our high quality, KEBS standard roofing sheets are durable, functional
            and strong with a wide variety to meet every customer need whether
            on-demand or custom
          </p>
        </div>

        {/* ✅ Filters */}
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
              Only This Week
            </div>

            <div className="mt-3 text-3xl font-extrabold leading-snug">
              Across All Products
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Shop our Products and get up to 5% Off and Free shipping
            </p>

            <button className="mt-10 inline-flex items-center gap-3 text-sm font-semibold text-white/90 hover:text-white">
              Shop Now <span className="text-xl leading-none">→</span>
            </button>
          </div>

          {/* Products */}
          <div className="lg:col-span-4">
            {isLoading ? (
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-60 w-full rounded-2xl bg-gray-200" />
                    <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
                <div className="text-sm font-bold">Failed to load products.</div>
                <div className="mt-1 text-xs opacity-80">
                  {(error as any)?.data?.detail ||
                    (error as any)?.error ||
                    "Please try again."}
                </div>
                <button
                  onClick={() => refetch()}
                  className="mt-4 rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsShowcase;