// // src/pages/UserDashboard.tsx
// import React, { useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import UserNavBar from "../components/navbar/userNavbar";
// import { useListProductsQuery } from "../features/products/productsAPI";
// import { useGetMyCartQuery, useAddToCartMutation } from "../features/cart/cartAPI";

// function kes(n: number) {
//   return `KSh${Number(n || 0).toLocaleString()}.00`;
// }

// const fallbackImage = "/images/about-roof.jpg";

// type Category = { id: string; name: string };

// export default function UserDashboard() {
//   const navigate = useNavigate();

//   const {
//     data: productsData,
//     isLoading: productsLoading,
//     isError: productsIsError,
//     refetch: refetchProducts,
//   } = useListProductsQuery();

//   const {
//     data: cartData,
//     isLoading: cartLoading,
//     isError: cartIsError,
//     refetch: refetchCart,
//   } = useGetMyCartQuery();

//   const [addToCart, { isLoading: adding }] = useAddToCartMutation();

//   // ✅ track which product is currently being added
//   const [addingProductId, setAddingProductId] = useState<number | null>(null);

//   const [activeCategory, setActiveCategory] = useState("all");
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState<"latest" | "price_asc" | "price_desc" | "name_asc">(
//     "latest"
//   );

//   const categories: Category[] = useMemo(() => {
//     const map = new Map<string, string>();
//     (productsData ?? []).forEach((p) => {
//       if (p.category?.id != null)
//         map.set(String(p.category.id), p.category.name ?? "Category");
//     });

//     const list = Array.from(map.entries())
//       .map(([id, name]) => ({ id, name }))
//       .sort((a, b) => a.name.localeCompare(b.name));

//     return [{ id: "all", name: "All" }, ...list];
//   }, [productsData]);

//   const activeCategoryName =
//     categories.find((c) => c.id === activeCategory)?.name ?? "All";

//   const cartCount = useMemo(() => {
//     const items = cartData?.items ?? [];
//     return items.reduce((sum, it) => sum + (it.quantity || 0), 0);
//   }, [cartData]);

//   const cartTotal = useMemo(() => {
//     const items = cartData?.items ?? [];
//     return items.reduce((sum, it) => {
//       const price = Number(it.product_price ?? 0);
//       return sum + price * (it.quantity || 0);
//     }, 0);
//   }, [cartData]);

//   const visibleProducts = useMemo(() => {
//     const q = search.trim().toLowerCase();

//     let list = (productsData ?? []).filter((p) => {
//       const catOk =
//         activeCategory === "all"
//           ? true
//           : String(p.category?.id ?? "") === activeCategory;
//       const qOk = !q ? true : p.name.toLowerCase().includes(q);
//       return catOk && qOk;
//     });

//     if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
//     if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
//     if (sort === "name_asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

//     if (sort === "latest") {
//       list = [...list].sort((a, b) => {
//         const da = new Date(a.created_at).getTime();
//         const db = new Date(b.created_at).getTime();
//         return db - da;
//       });
//     }

//     return list;
//   }, [productsData, activeCategory, search, sort]);

//   async function handleAddToCart(productId: number) {
//     try {
//       setAddingProductId(productId);
//       await addToCart({ product_id: productId, quantity: 1 }).unwrap();
//       refetchCart();
//     } catch (e: any) {
//       if (String(e?.status) === "401") {
//         navigate("/signin", { state: { from: "/user" } });
//         return;
//       }
//       alert(e?.data?.detail || "Failed to add to cart.");
//     } finally {
//       setAddingProductId(null);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <UserNavBar
//         logoSrc="/logo.png"
//         searchValue={search}
//         onSearchChange={setSearch}
//         cartCount={cartLoading || cartIsError ? 0 : cartCount}
//         cartTotalLabel={cartLoading || cartIsError ? "KSh0.00" : kes(cartTotal)}
//         cartItems={cartData?.items ?? []}
//         cartLoading={cartLoading}
//         cartError={cartIsError}
//         onCartClick={() => navigate("/cart")}
//         wishlistCount={1}
//       />

//       <main className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6 lg:px-8">
//         <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
//           {/* Sidebar */}
//           <aside className="lg:col-span-3">
//             <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5">
//               <div className="mb-4">
//                 <p className="text-sm font-extrabold text-gray-900">Dashboard</p>
//                 <p className="text-xs text-gray-600">Manage your account & shopping</p>
//               </div>

//               <nav className="space-y-1.5">
//                 <SidebarLink to="/user" active>
//                   Products
//                 </SidebarLink>
//                 <SidebarLink to="/orders">My Orders</SidebarLink>
//                 <SidebarLink to="/wishlist">Wishlist</SidebarLink>
//                 <SidebarLink to="/addresses">Addresses</SidebarLink>
//                 <SidebarLink to="/settings">Settings</SidebarLink>
//                 <SidebarLink to="/support">Support</SidebarLink>
//               </nav>

//               <div className="my-5 h-px bg-gray-100" />

//               <p className="mb-3 text-sm font-extrabold text-gray-900">Browse</p>

//               <div className="space-y-1.5">
//                 {categories.map((c) => (
//                   <button
//                     key={c.id}
//                     onClick={() => setActiveCategory(c.id)}
//                     className={[
//                       "w-full rounded-2xl px-4 py-2.5 text-left text-sm font-semibold",
//                       activeCategory === c.id
//                         ? "bg-indigo-50 text-indigo-800"
//                         : "text-gray-800 hover:bg-gray-50",
//                     ].join(" ")}
//                     type="button"
//                   >
//                     {c.name}
//                   </button>
//                 ))}
//               </div>

//               <div className="mt-5 rounded-3xl border border-gray-200 bg-gray-50 p-4">
//                 <p className="text-sm font-extrabold text-gray-900">Quick Summary</p>
//                 <div className="mt-3 grid grid-cols-2 gap-3">
//                   <SummaryCard
//                     label="Cart Items"
//                     value={cartLoading ? "..." : String(cartCount)}
//                   />
//                   <SummaryCard
//                     label="Cart Total"
//                     value={cartLoading ? "..." : kes(cartTotal)}
//                   />
//                 </div>

//                 {(cartIsError || productsIsError) ? (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       refetchCart();
//                       refetchProducts();
//                     }}
//                     className="mt-4 w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-black"
//                   >
//                     Retry Loading
//                   </button>
//                 ) : null}
//               </div>
//             </div>
//           </aside>

//           {/* Main content */}
//           <section className="lg:col-span-9">
//             <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5">
//               <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                 <div>
//                   <h1 className="text-lg font-extrabold text-gray-900 sm:text-xl">
//                     {activeCategoryName === "All" ? "All Products" : activeCategoryName}
//                   </h1>
//                   <p className="text-sm text-gray-600">
//                     {productsLoading ? "Loading..." : `${visibleProducts.length} item(s)`}
//                   </p>
//                 </div>

//                 <select
//                   value={sort}
//                   onChange={(e) => setSort(e.target.value as any)}
//                   className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-300 sm:w-[220px]"
//                 >
//                   <option value="latest">Sort: Latest</option>
//                   <option value="price_asc">Price: Low → High</option>
//                   <option value="price_desc">Price: High → Low</option>
//                   <option value="name_asc">Name: A → Z</option>
//                 </select>
//               </div>
//             </div>

//             {productsLoading ? (
//               <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
//                 {Array.from({ length: 9 }).map((_, i) => (
//                   <div
//                     key={i}
//                     className="animate-pulse rounded-3xl border border-gray-200 bg-white p-4"
//                   >
//                     <div className="mb-3 h-44 w-full rounded-2xl bg-gray-200 sm:h-48 lg:h-56" />
//                     <div className="h-4 w-3/4 rounded bg-gray-200" />
//                     <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
//                     <div className="mt-4 h-10 w-full rounded-2xl bg-gray-200" />
//                   </div>
//                 ))}
//               </div>
//             ) : productsIsError ? (
//               <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
//                 <div className="text-sm font-extrabold">Failed to load products.</div>
//                 <button
//                   onClick={() => refetchProducts()}
//                   className="mt-4 rounded-2xl bg-rose-700 px-4 py-3 text-sm font-extrabold text-white hover:bg-rose-800"
//                   type="button"
//                 >
//                   Retry
//                 </button>
//               </div>
//             ) : visibleProducts.length === 0 ? (
//               <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6">
//                 <p className="text-sm text-gray-700">
//                   No products found. Try another category or search.
//                 </p>
//               </div>
//             ) : (
//               <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
//                 {visibleProducts.map((p) => {
//                   const inStock = (p.stock ?? 0) > 0;

//                   // ✅ only THIS card shows loading
//                   const isThisAdding = adding && addingProductId === p.id;

//                   return (
//                     <div
//                       key={p.id}
//                       className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
//                     >
//                       <button
//                         type="button"
//                         onClick={() => navigate(`/product/${p.id}`)}
//                         className="mb-3 block w-full overflow-hidden rounded-2xl bg-gray-100"
//                       >
//                         <div className="flex h-44 w-full items-center justify-center sm:h-48 lg:h-56">
//                           <img
//                             src={p.image_url || fallbackImage}
//                             alt={p.name}
//                             className="h-full w-full object-contain p-2"
//                             loading="lazy"
//                           />
//                         </div>
//                       </button>

//                       <div className="flex items-start justify-between gap-3">
//                         <p className="line-clamp-2 text-sm font-extrabold text-gray-900">
//                           {p.name}
//                         </p>

//                         {inStock ? (
//                           <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
//                             In
//                           </span>
//                         ) : (
//                           <span className="shrink-0 rounded-full bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700">
//                             Out
//                           </span>
//                         )}
//                       </div>

//                       <p className="mt-2 text-base font-extrabold text-gray-900">
//                         {kes(p.price)}
//                       </p>

//                       <button
//                         onClick={() => handleAddToCart(p.id)}
//                         className="mt-3 w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-gray-800 disabled:opacity-60"
//                         disabled={!inStock || isThisAdding}
//                         type="button"
//                       >
//                         {isThisAdding ? "Adding..." : "Add to cart"}
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }

// function SidebarLink({
//   to,
//   children,
//   active,
// }: {
//   to: string;
//   children: React.ReactNode;
//   active?: boolean;
// }) {
//   return (
//     <Link
//       to={to}
//       className={[
//         "block rounded-2xl px-4 py-2.5 text-sm font-semibold",
//         active ? "bg-indigo-50 text-indigo-800" : "text-gray-800 hover:bg-gray-50",
//       ].join(" ")}
//     >
//       {children}
//     </Link>
//   );
// }

// function SummaryCard({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-3">
//       <p className="text-xs font-semibold text-gray-600">{label}</p>
//       <p className="mt-1 text-sm font-extrabold text-gray-900">{value}</p>
//     </div>
//   );
// }




// src/pages/UserDashboard.tsx
import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserNavBar from "../components/navbar/userNavbar";
import { useListProductsQuery } from "../features/products/productsAPI";
import { useGetMyCartQuery, useAddToCartMutation } from "../features/cart/cartAPI";

function kes(n: number) {
  return `KSh${Number(n || 0).toLocaleString()}.00`;
}

const fallbackImage = "/images/about-roof.jpg";

type Category = { id: string; name: string };

export default function UserDashboard() {
  const navigate = useNavigate();

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsIsError,
    refetch: refetchProducts,
  } = useListProductsQuery();

  const {
    data: cartData,
    isLoading: cartLoading,
    isError: cartIsError,
    refetch: refetchCart,
  } = useGetMyCartQuery();

  const [addToCart, { isLoading: adding }] = useAddToCartMutation();

  // ✅ track which product is currently being added
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "price_asc" | "price_desc" | "name_asc">(
    "latest"
  );

  // ✅ Mobile drawer state (sidebar)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close drawer on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const categories: Category[] = useMemo(() => {
    const map = new Map<string, string>();
    (productsData ?? []).forEach((p) => {
      if (p.category?.id != null)
        map.set(String(p.category.id), p.category.name ?? "Category");
    });

    const list = Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return [{ id: "all", name: "All" }, ...list];
  }, [productsData]);

  const activeCategoryName =
    categories.find((c) => c.id === activeCategory)?.name ?? "All";

  const cartCount = useMemo(() => {
    const items = cartData?.items ?? [];
    return items.reduce((sum, it) => sum + (it.quantity || 0), 0);
  }, [cartData]);

  const cartTotal = useMemo(() => {
    const items = cartData?.items ?? [];
    return items.reduce((sum, it) => {
      const price = Number(it.product_price ?? 0);
      return sum + price * (it.quantity || 0);
    }, 0);
  }, [cartData]);

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    let list = (productsData ?? []).filter((p) => {
      const catOk =
        activeCategory === "all"
          ? true
          : String(p.category?.id ?? "") === activeCategory;
      const qOk = !q ? true : p.name.toLowerCase().includes(q);
      return catOk && qOk;
    });

    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name_asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    if (sort === "latest") {
      list = [...list].sort((a, b) => {
        const da = new Date(a.created_at).getTime();
        const db = new Date(b.created_at).getTime();
        return db - da;
      });
    }

    return list;
  }, [productsData, activeCategory, search, sort]);

  async function handleAddToCart(productId: number) {
    try {
      setAddingProductId(productId);
      await addToCart({ product_id: productId, quantity: 1 }).unwrap();
      refetchCart();
    } catch (e: any) {
      if (String(e?.status) === "401") {
        navigate("/signin", { state: { from: "/user" } });
        return;
      }
      alert(e?.data?.detail || "Failed to add to cart.");
    } finally {
      setAddingProductId(null);
    }
  }

  function SidebarInner({ onAfterClick }: { onAfterClick?: () => void }) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="mb-4">
          <p className="text-sm font-extrabold text-gray-900">Dashboard</p>
          <p className="text-xs text-gray-600">Manage your account & shopping</p>
        </div>

        <nav className="space-y-1.5">
          <SidebarLink to="/user" active onClick={onAfterClick}>
            Products
          </SidebarLink>
          <SidebarLink to="/orders" onClick={onAfterClick}>
            My Orders
          </SidebarLink>
          <SidebarLink to="/wishlist" onClick={onAfterClick}>
            Wishlist
          </SidebarLink>
          <SidebarLink to="/addresses" onClick={onAfterClick}>
            Addresses
          </SidebarLink>
          <SidebarLink to="/settings" onClick={onAfterClick}>
            Settings
          </SidebarLink>
          <SidebarLink to="/support" onClick={onAfterClick}>
            Support
          </SidebarLink>
        </nav>

        <div className="my-5 h-px bg-gray-100" />

        <p className="mb-3 text-sm font-extrabold text-gray-900">Browse</p>

        <div className="space-y-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCategory(c.id);
                onAfterClick?.();
              }}
              className={[
                "w-full rounded-2xl px-4 py-2.5 text-left text-sm font-semibold",
                activeCategory === c.id
                  ? "bg-indigo-50 text-indigo-800"
                  : "text-gray-800 hover:bg-gray-50",
              ].join(" ")}
              type="button"
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-3xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-extrabold text-gray-900">Quick Summary</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <SummaryCard
              label="Cart Items"
              value={cartLoading ? "..." : String(cartCount)}
            />
            <SummaryCard label="Cart Total" value={cartLoading ? "..." : kes(cartTotal)} />
          </div>

          {cartIsError || productsIsError ? (
            <button
              type="button"
              onClick={() => {
                refetchCart();
                refetchProducts();
              }}
              className="mt-4 w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-black"
            >
              Retry Loading
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavBar
        logoSrc="/logo.png"
        searchValue={search}
        onSearchChange={setSearch}
        cartCount={cartLoading || cartIsError ? 0 : cartCount}
        cartTotalLabel={cartLoading || cartIsError ? "KSh0.00" : kes(cartTotal)}
        cartItems={cartData?.items ?? []}
        cartLoading={cartLoading}
        cartError={cartIsError}
        onCartClick={() => navigate("/cart")}
        wishlistCount={1}
      />

      {/* ✅ Mobile drawer (sidebar) */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* overlay */}
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          {/* panel */}
          <div className="absolute left-0 top-0 h-full w-[320px] max-w-[85vw] bg-gray-50 p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-extrabold text-gray-900">Menu</div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-extrabold text-gray-700 hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <SidebarInner onAfterClick={() => setSidebarOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <SidebarInner />
          </aside>

          {/* Main content */}
          <section className="lg:col-span-9">
            <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  {/* ✅ Hamburger (mobile/tablet only) */}
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-3 text-gray-900 hover:bg-gray-50 lg:hidden"
                    aria-label="Open filters menu"
                  >
                    <div className="space-y-1.5">
                      <span className="block h-[2px] w-6 bg-gray-900" />
                      <span className="block h-[2px] w-6 bg-gray-900" />
                      <span className="block h-[2px] w-6 bg-gray-900" />
                    </div>
                  </button>

                  <div>
                    <h1 className="text-lg font-extrabold text-gray-900 sm:text-xl">
                      {activeCategoryName === "All" ? "All Products" : activeCategoryName}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {productsLoading ? "Loading..." : `${visibleProducts.length} item(s)`}
                    </p>
                  </div>
                </div>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-300 sm:w-[220px]"
                >
                  <option value="latest">Sort: Latest</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="name_asc">Name: A → Z</option>
                </select>
              </div>
            </div>

            {productsLoading ? (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-3xl border border-gray-200 bg-white p-4"
                  >
                    <div className="mb-3 h-44 w-full rounded-2xl bg-gray-200 sm:h-48 lg:h-56" />
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
                    <div className="mt-4 h-10 w-full rounded-2xl bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : productsIsError ? (
              <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
                <div className="text-sm font-extrabold">Failed to load products.</div>
                <button
                  onClick={() => refetchProducts()}
                  className="mt-4 rounded-2xl bg-rose-700 px-4 py-3 text-sm font-extrabold text-white hover:bg-rose-800"
                  type="button"
                >
                  Retry
                </button>
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6">
                <p className="text-sm text-gray-700">
                  No products found. Try another category or search.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((p) => {
                  const inStock = (p.stock ?? 0) > 0;

                  // ✅ only THIS card shows loading
                  const isThisAdding = adding && addingProductId === p.id;

                  return (
                    <div
                      key={p.id}
                      className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => navigate(`/product/${p.id}`)}
                        className="mb-3 block w-full overflow-hidden rounded-2xl bg-gray-100"
                      >
                        <div className="flex h-44 w-full items-center justify-center sm:h-48 lg:h-56">
                          <img
                            src={p.image_url || fallbackImage}
                            alt={p.name}
                            className="h-full w-full object-contain p-2"
                            loading="lazy"
                          />
                        </div>
                      </button>

                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-2 text-sm font-extrabold text-gray-900">
                          {p.name}
                        </p>

                        {inStock ? (
                          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                            In
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700">
                            Out
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-base font-extrabold text-gray-900">
                        {kes(p.price)}
                      </p>

                      <button
                        onClick={() => handleAddToCart(p.id)}
                        className="mt-3 w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-gray-800 disabled:opacity-60"
                        disabled={!inStock || isThisAdding}
                        type="button"
                      >
                        {isThisAdding ? "Adding..." : "Add to cart"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({
  to,
  children,
  active,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={[
        "block rounded-2xl px-4 py-2.5 text-sm font-semibold",
        active ? "bg-indigo-50 text-indigo-800" : "text-gray-800 hover:bg-gray-50",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3">
      <p className="text-xs font-semibold text-gray-600">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-gray-900">{value}</p>
    </div>
  );
}