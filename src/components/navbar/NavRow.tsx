// import { Link, useNavigate } from "react-router-dom";

// const NavRow = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="w-full border-t border-gray-200 bg-white">
//       <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          
//           {/* All Categories */}
//           <button
//             onClick={() => navigate("/categories")}
//             className="flex w-full items-center justify-between rounded-2xl bg-indigo-900 px-5 py-4 text-sm font-semibold text-white sm:px-6 lg:w-[420px]"
//           >
//             <span>All Categories</span>
//             <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path d="M5.5 7.5l4.5 4.5 4.5-4.5" />
//             </svg>
//           </button>

//           {/* Links */}
//           <div className="flex items-center justify-between gap-4 lg:flex-1 lg:justify-center">
//             <nav className="no-scrollbar flex items-center gap-6 overflow-x-auto whitespace-nowrap pr-2 text-sm text-gray-900 lg:overflow-visible lg:pr-0">
              
//               <Link to="/" className="hover:text-gray-600">
//                 Home
//               </Link>

//               <Link to="/shop" className="hover:text-gray-600">
//                 Shop
//               </Link>

//               <Link to="/best-sellers" className="hover:text-gray-600">
//                 Best Sellers
//               </Link>

//               <Link to="/blog" className="hover:text-gray-600">
//                 Blog
//               </Link>

//               <Link to="/contact" className="hover:text-gray-600">
//                 Contact
//               </Link>

//               <button
//                 onClick={() => navigate("/top-offers")}
//                 className="flex items-center gap-2 font-semibold hover:text-gray-600"
//               >
//                 <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-[12px]">
//                   ⚙️
//                 </span>
//                 <span>Top Offers</span>
//                 <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                   <path d="M5.5 7.5l4.5 4.5 4.5-4.5" />
//                 </svg>
//               </button>
//             </nav>

//             {/* Help Center */}
//             <button
//               onClick={() => navigate("/help-center")}
//               className="flex shrink-0 items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
//             >
//               <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
//                 i
//               </span>
//               <span className="hidden sm:inline">Help Center</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>
//     </div>
//   );
// };

// export default NavRow;



// src/components/navbar/NavRow.tsx
import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useListProductsQuery } from "../../features/products/productsAPI"; // ✅ adjust path if needed

type Props = {
  // optional: parent can listen and filter products
  onCategorySelect?: (category: { id: number; name: string } | null) => void;
};

const NavRow = ({ onCategorySelect }: Props) => {
  const { data } = useListProductsQuery();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: number; name: string } | null>(null);

  // close dropdown on outside click
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // build categories dynamically from products response
  const categories = useMemo(() => {
    const map = new Map<number, string>();
    (data ?? []).forEach((p) => {
      if (p.category?.id != null) map.set(p.category.id, p.category.name ?? "Category");
    });

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  return (
    <div className="w-full border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          {/* All Categories */}
          <div className="relative w-full lg:w-[420px]" ref={wrapRef}>
            <button
              onClick={() => setOpen((s) => !s)}
              className="flex w-full items-center justify-between rounded-2xl bg-indigo-900 px-5 py-4 text-sm font-semibold text-white sm:px-6"
              type="button"
            >
              <span>{selected ? selected.name : "All Categories"}</span>
              <svg
                className={["h-5 w-5 transition-transform", open ? "rotate-180" : ""].join(" ")}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.5 7.5l4.5 4.5 4.5-4.5" />
              </svg>
            </button>

            {/* Dropdown (dynamic categories) */}
            {open ? (
              <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                {categories.length === 0 ? (
                  <div className="px-5 py-4 text-sm font-semibold text-gray-700">
                    No categories yet
                  </div>
                ) : (
                  <div className="max-h-[320px] overflow-auto">
                    {/* "View all categories" -> NOT a route, just selects ALL */}
                    <button
                      type="button"
                      className="w-full px-5 py-3 text-left text-sm font-bold text-gray-900 hover:bg-gray-50"
                      onClick={() => {
                        setSelected(null);
                        setOpen(false);
                        onCategorySelect?.(null);
                      }}
                    >
                      View all categories →
                    </button>

                    <div className="h-px bg-gray-100" />

                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className={[
                          "w-full px-5 py-3 text-left text-sm font-semibold hover:bg-gray-50",
                          selected?.id === c.id ? "text-indigo-900" : "text-gray-800",
                        ].join(" ")}
                        onClick={() => {
                          setSelected(c);
                          setOpen(false);
                          onCategorySelect?.(c);
                        }}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Links (unchanged) */}
          <div className="flex items-center justify-between gap-4 lg:flex-1 lg:justify-center">
            <nav className="no-scrollbar flex items-center gap-6 overflow-x-auto whitespace-nowrap pr-2 text-sm text-gray-900 lg:overflow-visible lg:pr-0">
              <Link to="/" className="hover:text-gray-600">
                Home
              </Link>

              <Link to="/shop" className="hover:text-gray-600">
                Shop
              </Link>

              <Link to="/best-sellers" className="hover:text-gray-600">
                Best Sellers
              </Link>

              <Link to="/blog" className="hover:text-gray-600">
                Blog
              </Link>

              <Link to="/contact" className="hover:text-gray-600">
                Contact
              </Link>

              <button className="flex items-center gap-2 font-semibold hover:text-gray-600" type="button">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-[12px]">
                  ⚙️
                </span>
                <span>Top Offers</span>
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.5 7.5l4.5 4.5 4.5-4.5" />
                </svg>
              </button>
            </nav>

            {/* Help Center */}
            <button
              className="flex shrink-0 items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
              type="button"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                i
              </span>
              <span className="hidden sm:inline">Help Center</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default NavRow;