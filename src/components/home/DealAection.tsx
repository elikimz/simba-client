


import React from "react";
import ProductCard from "./ProductCard";
import { useGetLatestDealQuery } from "../../features/deals/dealsAPI";

const fallbackImage = "/images/about-roof.jpg";

function kes(n: number) {
  return `KSh${Number(n || 0).toLocaleString()}.00`;
}

function finalPrice(p: {
  price: number;
  deal_price?: number | null;
  discount_percentage?: number | null;
}) {
  const base = Number(p.price ?? 0);
  if (p.deal_price != null) return Number(p.deal_price);

  const disc = p.discount_percentage != null ? Number(p.discount_percentage) : 0;
  if (disc > 0) return base * (1 - disc / 100);
  return base;
}

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const pad = (x: number) => String(x).padStart(2, "0");
  return `${pad(d)} : ${pad(h)} : ${pad(m)} : ${pad(s)}`;
}

const DealsSection = () => {
  const { data, isLoading, isError } = useGetLatestDealQuery();

  // ✅ Hooks must ALWAYS run
  const [now, setNow] = React.useState(Date.now());

  const endsAt = React.useMemo(() => {
    if (!data?.ends_at) return null;
    const t = new Date(data.ends_at).getTime();
    return Number.isFinite(t) ? t : null;
  }, [data?.ends_at]);

  React.useEffect(() => {
    if (!endsAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [endsAt]);

  // ✅ Now decide whether to render anything (silent mode)
  if (isLoading || isError || !data || !data.products || data.products.length === 0) {
    return null;
  }

  const countdownLabel = endsAt ? formatCountdown(endsAt - now) : "00 : 00 : 00 : 00";

  const products = data.products.map((p) => ({
    id: p.id,
    image: p.image_url || fallbackImage,
    name: p.name,
    price: kes(
      finalPrice({
        price: p.price,
        deal_price: p.deal_price,
        discount_percentage: p.discount_percentage,
      })
    ),
    inStock: (p.stock ?? 0) > 0,
  }));

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex flex-wrap items-center justify-between border-b pb-6">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-semibold text-red-500">{data.title}</h2>

            <span className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white">
              {countdownLabel}
            </span>

            <span className="hidden text-sm text-gray-400 md:block">
              Remains until the end of the offer
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;