import { useMemo, useState } from "react";
import {
  Calendar,
  Clock3,
  Search,
  Tag,
  ArrowRight,
  HardHat,
  Factory,
  Hammer,
  Ruler,
} from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string; // "2026-02-28"
  readTime: string; // "5 min"
  category: string;
  cover: string; // image url
  author: { name: string; avatar?: string };
  featured?: boolean;
};

const posts: BlogPost[] = [
  {
    id: "1",
    title: "How to Identify Genuine Simba Cement (Avoid Counterfeits)",
    excerpt:
      "Simple checks—packaging, batch details, storage signs, and sourcing tips to ensure you buy authentic Simba Cement every time.",
    date: "2026-02-20",
    readTime: "6 min",
    category: "Cement",
    cover:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1400&q=70",
    author: { name: "Simba Cement & Steel" },
    featured: true,
  },
  {
    id: "2",
    title: "Steel Grades Explained: Mild Steel vs High Tensile (HT)",
    excerpt:
      "Learn the difference between common steel grades, what they’re used for, and how to choose the right steel for your project.",
    date: "2026-02-12",
    readTime: "5 min",
    category: "Steel",
    cover:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=70",
    author: { name: "Simba Cement & Steel" },
  },
  {
    id: "3",
    title: "Cement Types 101: OPC vs PPC vs Rapid Hardening",
    excerpt:
      "Choosing the right cement saves time and money—here’s when to use each type and what performance to expect on-site.",
    date: "2026-01-30",
    readTime: "7 min",
    category: "Cement",
    cover:
      "https://images.unsplash.com/photo-1590650516494-0c8e4a4f77ab?auto=format&fit=crop&w=1400&q=70",
    author: { name: "Simba Cement & Steel" },
  },
  {
    id: "4",
    title: "Rebar Buying Guide: Sizes, Spacing & Common Mistakes",
    excerpt:
      "From 8mm to 20mm bars—what to buy, where people go wrong, and how to store steel to prevent corrosion.",
    date: "2026-01-18",
    readTime: "6 min",
    category: "Site Tips",
    cover:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=70",
    author: { name: "Simba Cement & Steel" },
  },
  {
    id: "5",
    title: "Estimating Cement & Steel for a Slab: A Practical Starter",
    excerpt:
      "A beginner-friendly way to estimate materials for a slab—what affects quantities and how to reduce waste.",
    date: "2026-01-05",
    readTime: "8 min",
    category: "Estimations",
    cover:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1400&q=70",
    author: { name: "Simba Cement & Steel" },
  },
];

const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700">
      {children}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function categoryIcon(category: string) {
  const c = category.toLowerCase();
  if (c.includes("cement")) return <Factory className="h-3.5 w-3.5" />;
  if (c.includes("steel")) return <Hammer className="h-3.5 w-3.5" />;
  if (c.includes("site")) return <HardHat className="h-3.5 w-3.5" />;
  if (c.includes("estim")) return <Ruler className="h-3.5 w-3.5" />;
  return <Tag className="h-3.5 w-3.5" />;
}

export default function Blog() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const featured = useMemo(() => posts.find((p) => p.featured) ?? posts[0], []);
  const rest = useMemo(
    () => posts.filter((p) => p.id !== featured.id),
    [featured.id]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rest.filter((p) => {
      const matchesCat = cat === "All" ? true : p.category === cat;
      const matchesQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  }, [query, cat, rest]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-fuchsia-100/50 via-pink-100/30 to-transparent" />

      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Simba Hardware Blog
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Cement, steel, and site tips—straightforward guides for building
              right.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-[380px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cement, steel, rebar, slab…"
              className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
            />
          </div>
        </div>

        {/* Featured (NO navigation) */}
        <div className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
            <div className="relative">
              <img
                src={featured.cover}
                alt={featured.title}
                className="h-[260px] w-full object-cover lg:h-full"
                loading="lazy"
              />
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-extrabold text-white">
                  Featured
                </span>
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-slate-900">
                  {featured.category}
                </span>
              </div>
            </div>

            <div className="p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>
                  {categoryIcon(featured.category)} {featured.category}
                </Badge>
                <Badge>
                  <Calendar className="h-3.5 w-3.5" /> {formatDate(featured.date)}
                </Badge>
                <Badge>
                  <Clock3 className="h-3.5 w-3.5" /> {featured.readTime}
                </Badge>
              </div>

              <h2 className="mt-4 text-xl font-extrabold leading-snug">
                {featured.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{featured.excerpt}</p>

              <div className="mt-5 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-500">
                  By {featured.author.name}
                </div>

                <button
                  type="button"
                  className="inline-flex cursor-default items-center gap-2 rounded-2xl bg-gradient-to-b from-fuchsia-600 to-fuchsia-700 px-4 py-2 text-sm font-extrabold text-white shadow-sm"
                >
                  Read now <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-7 flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={[
                "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold transition",
                cat === c
                  ? "bg-indigo-900 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
              ].join(" ")}
            >
              {c === "All" ? <Tag className="h-4 w-4" /> : categoryIcon(c)}
              {c}
            </button>
          ))}
        </div>

        {/* Grid (NO navigation) */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative">
                <img
                  src={p.cover}
                  alt={p.title}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute left-3 top-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-extrabold text-slate-900">
                    {categoryIcon(p.category)} {p.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                    <Calendar className="h-3.5 w-3.5" /> {formatDate(p.date)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                    <Clock3 className="h-3.5 w-3.5" /> {p.readTime}
                  </span>
                </div>

                <div className="mt-3 text-base font-extrabold leading-snug text-slate-900">
                  {p.title}
                </div>
                <div className="mt-1 text-sm text-slate-600">{p.excerpt}</div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-500">
                    {p.author.name}
                  </div>
                  <div className="inline-flex items-center gap-1 text-sm font-extrabold text-fuchsia-700">
                    Read <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="text-lg font-extrabold">No posts found</div>
            <div className="mt-1 text-sm text-slate-600">
              Try a different search or category.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}