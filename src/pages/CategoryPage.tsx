import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useListProductsQuery } from "../features/products/productsAPI";
import MainHeader from "../components/navbar/MainHeader";
import UserNavBar from "../components/navbar/userNavbar";
import FooterTop from "../components/footer/FooterTop";
import FooterBottom from "../components/footer/FooterBottom";
import SEOHelmet from "../utils/SEOHelmet";
import ProductCard from "../components/home/ProductCard";

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

function sortPriceValue(p: any): number {
  const maxP = toNumber(p?.max_price);
  if (maxP != null) return maxP;
  const minP = toNumber(p?.price);
  return minP ?? 0;
}

function isLoggedIn() {
  const token = localStorage.getItem("access_token");
  return Boolean(token && token.trim().length > 0);
}

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const id = Number(categoryId);

  const [sort, setSort] = useState<
    "latest" | "name_asc" | "name_desc" | "price_asc" | "price_desc"
  >("latest");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Always call the hook at the top level
  const { data, isLoading, isError } = useListProductsQuery({
    skip: page * pageSize,
    limit: pageSize,
    category_id: id,
  });

  const allProducts = data ?? [];

  const sorted = useMemo(() => {
    if (sort === "latest") return allProducts;
    const copy = [...allProducts];
    if (sort === "name_asc") copy.sort((a: any, b: any) => a.name.localeCompare(b.name));
    else if (sort === "name_desc") copy.sort((a: any, b: any) => b.name.localeCompare(a.name));
    else if (sort === "price_asc") copy.sort((a: any, b: any) => sortPriceValue(a) - sortPriceValue(b));
    else if (sort === "price_desc") copy.sort((a: any, b: any) => sortPriceValue(b) - sortPriceValue(a));
    return copy;
  }, [allProducts, sort]);

  const products = useMemo(() => {
    return sorted.map((p: any) => ({
      id: p.id,
      image: p.image_url || fallbackImage,
      name: p.name,
      price: p.price,
      max_price: p.max_price ?? null,
      inStock: (p.stock ?? 0) > 0,
      categoryName: p.category?.name ?? undefined,
    }));
  }, [sorted]);

  const categoryName = allProducts.length > 0 ? allProducts[0].category?.name : "Category";
  const hasNextPage = allProducts.length === pageSize;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHelmet
        title={`${categoryName} - Simba Cement`}
        description={`Browse our selection of ${categoryName} products. Quality building materials from Simba Cement with fast delivery.`}
        keywords={`${categoryName}, cement, building materials, construction supplies`}
        ogTitle={`${categoryName} - Simba Cement`}
        ogDescription={`Shop ${categoryName} products from Simba Cement`}
        canonicalUrl={`https://www.simbacementwholesalesdistributor.co.ke/category/${id}`}
      />

      {loggedIn ? (
        <UserNavBar
          logoSrc="/images/logo.png"
          searchValue=""
          onSearchChange={() => {}}
          cartCount={0}
          cartTotalLabel="KSh0.00"
          onCartClick={() => navigate("/user/cart")}
          wishlistCount={0}
        />
      ) : (
        <MainHeader logoSrc="/images/logo.png" />
      )}

      <div className="mx-auto max-w-[1400px] px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <a href="/" className="hover:text-indigo-900">Home</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">{categoryName}</span>
        </nav>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">{categoryName}</h1>
          <p className="text-gray-600">
            {products.length} product{products.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full flex-col gap-1 sm:w-[45%]">
              <label className="text-xs font-bold text-gray-700">Sort</label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as any);
                  setPage(0);
                }}
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

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading products...</p>
          </div>
        ) : isError || products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              {products.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0 || isLoading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                ← Previous
              </button>
              <span className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700">
                Page {page + 1}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!hasNextPage || isLoading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>

      <FooterTop />
      <FooterBottom />
    </div>
  );
}
