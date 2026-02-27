

// const reasons = [
//   "Genuine Simba Cement from trusted manufacturers",
//   "Strong, durable and reliable construction materials",
//   "Consistent supply for bulk and retail orders",
//   "Competitive wholesale and site pricing",
//   "Fast and dependable delivery to your project site",
//   "Wide range of materials: cement, steel, sand, ballast, nails and more",
//   "Suitable for residential, commercial and large-scale projects",
//   "Trusted by contractors, site supervisors and home owners",
// ];

// const WhyMaisha = () => {
//   return (
//     <section className="bg-gray-100 py-14">
//       <div className="mx-auto max-w-[1400px] px-6">
//         {/* Title */}
//         <h2 className="text-center text-3xl font-bold tracking-tight">
//           <span className="text-gray-900">Why Choose </span>
//           <span className="text-indigo-900">Our Building Supplies</span>
//         </h2>

//         {/* Content */}
//         <div className="mt-10 grid gap-10 lg:grid-cols-2">
//           {/* Left image card */}
//           <div className="relative overflow-hidden rounded-2xl">
//             <img
//               src="/images/about-roof.jpg"
//               alt="Simba Cement and Building Materials"
//               className="h-[380px] w-full object-cover"
//               loading="lazy"
//             />

//             {/* overlay */}
//             <div className="absolute inset-0 bg-black/55" />

//             {/* text */}
//             <div className="absolute inset-0 p-6 md:p-8">
//               <span className="inline-flex rounded-full bg-indigo-900/90 px-3 py-1.5 text-xs font-medium text-white">
//                 Order Today
//               </span>

//               <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/80">
//                 We supply genuine Simba Cement and quality building materials
//                 suitable for all construction needs. Our products are strong,
//                 reliable and designed to help you build safely and efficiently
//                 across all project sizes.
//               </p>

//               <button className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white">
//                 Shop Now <span className="text-lg leading-none">→</span>
//               </button>
//             </div>
//           </div>

//           {/* Right checklist */}
//           <div className="flex items-center">
//             <ul className="space-y-3 text-sm text-gray-700">
//               {reasons.map((r) => (
//                 <li key={r} className="flex items-start gap-3">
//                   <span className="mt-[2px] text-base text-gray-900">✓</span>
//                   <span className="leading-relaxed">{r}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default WhyMaisha;



// src/components/WhyMaisha.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useListActiveBannersQuery } from "../../features/banner/bannerAPI"; // ✅ adjust path

const reasons = [
  "Genuine Simba Cement from trusted manufacturers",
  "Strong, durable and reliable construction materials",
  "Consistent supply for bulk and retail orders",
  "Competitive wholesale and site pricing",
  "Fast and dependable delivery to your project site",
  "Wide range of materials: cement, steel, sand, ballast, nails and more",
  "Suitable for residential, commercial and large-scale projects",
  "Trusted by contractors, site supervisors and home owners",
];

function pickBannerImageUrl(banner: any): string | null {
  const imgs = Array.isArray(banner?.images) ? [...banner.images] : [];
  if (!imgs.length) return null;

  // primary first
  const primary = imgs.find((i: any) => i.is_primary && i.url);
  if (primary?.url) return primary.url;

  // else sort_order
  imgs.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return imgs[0]?.url ?? null;
}

const WhyMaisha = () => {
  const navigate = useNavigate();

  const { data: banners, isLoading, isError } = useListActiveBannersQuery();

  const hero = useMemo(() => {
    if (!banners?.length) return null;

    // choose first banner
    const b = banners[0] as any;
    const imageUrl = pickBannerImageUrl(b);

    if (!imageUrl) return null;

    return {
      imageUrl,
      title: b.title ?? "Order Today",
      description:
        b.description ??
        "We supply genuine Simba Cement and quality building materials suitable for all construction needs.",
      ctaText: b.cta_text ?? "Shop Now",
      ctaHref: b.cta_href ?? "/products",
    };
  }, [banners]);

  // ✅ Requirement: when backend not available show nothing
  if (isLoading || isError || !hero) return null;

  return (
    <section className="bg-gray-100 py-14">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Title */}
        <h2 className="text-center text-3xl font-bold tracking-tight">
          <span className="text-gray-900">Why Choose </span>
          <span className="text-indigo-900">Our Building Supplies</span>
        </h2>

        {/* Content */}
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {/* Left image card */}
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={hero.imageUrl}
              alt="Simba Cement and Building Materials"
              className="h-[380px] w-full object-cover"
              loading="lazy"
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-black/55" />

            {/* text */}
            <div className="absolute inset-0 p-6 md:p-8">
              <span className="inline-flex rounded-full bg-indigo-900/90 px-3 py-1.5 text-xs font-medium text-white">
                {hero.title || "Order Today"}
              </span>

              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/80">
                {hero.description}
              </p>

              <button
                onClick={() => navigate(hero.ctaHref)}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white"
              >
                {hero.ctaText} <span className="text-lg leading-none">→</span>
              </button>
            </div>
          </div>

          {/* Right checklist */}
          <div className="flex items-center">
            <ul className="space-y-3 text-sm text-gray-700">
              {reasons.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <span className="mt-[2px] text-base text-gray-900">✓</span>
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyMaisha;