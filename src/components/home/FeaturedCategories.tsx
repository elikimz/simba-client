import { Link } from "react-router-dom";
import { useListProductsQuery } from "../../features/products/productsAPI";
import { useMemo } from "react";

const FeaturedCategories = () => {
  const { data } = useListProductsQuery({ limit: 100 });

  const categories = useMemo(() => {
    const map = new Map<number, { id: number; name: string; count: number }>();
    (data ?? []).forEach((p) => {
      if (p.category?.id != null) {
        const existing = map.get(p.category.id);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(p.category.id, {
            id: p.category.id,
            name: p.category.name ?? "Category",
            count: 1,
          });
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [data]);

  const categoryIcons: { [key: string]: string } = {
    cement: "🏭",
    steel: "🔩",
    roofing: "🏠",
    sand: "🪨",
    ballast: "⛏️",
    nails: "🔨",
    wire: "📦",
    hardware: "🔧",
  };

  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (lower.includes(key)) return icon;
    }
    return "📦";
  };

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-indigo-900 mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg">
            Browse our comprehensive range of building materials
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No categories available yet
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center hover:shadow-lg transition transform hover:scale-105"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition">
                  {getCategoryIcon(cat.name)}
                </div>
                <h3 className="text-xl font-bold text-indigo-900 mb-2 group-hover:text-indigo-700">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {cat.count} product{cat.count !== 1 ? "s" : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCategories;
