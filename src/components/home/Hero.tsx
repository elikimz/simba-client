



// // src/components/Hero.tsx
// import { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useListActiveBannersQuery } from "../../features/banner/bannerAPI"; // ✅ adjust path

// const AUTOPLAY_MS = 5000;

// type Slide = {
//   id: number | string;
//   image: string;
//   title: string;
//   description: string;
//   ctaText: string;
//   ctaHref: string;
// };

// const FALLBACK_IMAGE = "/images/about-roof.jpg";

// const Hero = () => {
//   const navigate = useNavigate();

//   // ✅ fetch from backend (public endpoint)
//   const { data: banners, isLoading, isError } = useListActiveBannersQuery();

//   // ✅ Make 1 slide per IMAGE (not per banner)
//   const slides: Slide[] = useMemo(() => {
//     if (!banners?.length) return [];

//     const out: Slide[] = [];

//     for (const b of banners as any[]) {
//       const imgs = Array.isArray(b.images) ? [...b.images] : [];

//       // sort images by sort_order
//       imgs.sort(
//         (a: any, c: any) => (a.sort_order ?? 0) - (c.sort_order ?? 0)
//       );

//       // move primary to the front if present
//       const primaryIndex = imgs.findIndex((i: any) => i.is_primary);
//       if (primaryIndex > 0) {
//         const [primary] = imgs.splice(primaryIndex, 1);
//         imgs.unshift(primary);
//       }

//       // create a slide per image
//       if (imgs.length) {
//         imgs.forEach((img: any, idx: number) => {
//           out.push({
//             id: `${b.id}-${img.id ?? idx}`,
//             image: img.url || FALLBACK_IMAGE,
//             title: b.title ?? "",
//             description: b.description ?? "",
//             ctaText: b.cta_text ?? "Shop Now",
//             ctaHref: b.cta_href ?? "/products",
//           });
//         });
//       } else {
//         // banner without images
//         out.push({
//           id: `${b.id}-fallback`,
//           image: FALLBACK_IMAGE,
//           title: b.title ?? "",
//           description: b.description ?? "",
//           ctaText: b.cta_text ?? "Shop Now",
//           ctaHref: b.cta_href ?? "/products",
//         });
//       }
//     }

//     return out;
//   }, [banners]);

//   // ✅ fallback slides when API empty/error
//   const fallbackSlides: Slide[] = useMemo(
//     () => [
//       {
//         id: "fallback-1",
//         image: FALLBACK_IMAGE,
//         title: "Sheltering You\nToday & Tomorrow",
//         description:
//           "High quality galvanized and color steel roofing sheets with durable lifespan for a trusted shelter.",
//         ctaText: "Shop Now",
//         ctaHref: "/signin",
//       },
//     ],
//     []
//   );

//   const finalSlides = slides.length ? slides : fallbackSlides;

//   const [active, setActive] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);

//   // restart autoplay after user interaction
//   const restartTickRef = useRef(0);
//   const [restartKey, setRestartKey] = useState(0);

//   const bumpRestart = () => {
//     restartTickRef.current += 1;
//     setRestartKey((k) => k + 1);
//   };

//   const goPrev = () => {
//     setActive((p) => (p - 1 + finalSlides.length) % finalSlides.length);
//     bumpRestart();
//   };

//   const goNext = () => {
//     setActive((p) => (p + 1) % finalSlides.length);
//     bumpRestart();
//   };

//   const goTo = (i: number) => {
//     setActive(i);
//     bumpRestart();
//   };

//   // keep active index valid when data changes
//   useEffect(() => {
//     if (active >= finalSlides.length) setActive(0);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [finalSlides.length]);

//   // Autoplay
//   useEffect(() => {
//     if (isPaused) return;
//     if (finalSlides.length <= 1) return;

//     const id = window.setInterval(() => {
//       setActive((p) => (p + 1) % finalSlides.length);
//     }, AUTOPLAY_MS);

//     return () => window.clearInterval(id);
//   }, [isPaused, finalSlides.length, restartKey]);

//   const nextImage =
//     finalSlides.length > 1
//       ? finalSlides[(active + 1) % finalSlides.length].image
//       : finalSlides[active].image;

//   return (
//     <section className="bg-white">
//       <div className="mx-auto max-w-[1400px] px-6 py-8">
//         <div className="grid grid-cols-12 gap-6">
//           {/* LEFT WHITE SPACE */}
//           <div className="col-span-12 md:col-span-2 lg:col-span-2" />

//           {/* SLIDER */}
//           <div className="col-span-12 md:col-span-10 lg:col-span-10">
//             <div
//               className="relative overflow-hidden rounded-3xl"
//               onMouseEnter={() => setIsPaused(true)}
//               onMouseLeave={() => setIsPaused(false)}
//             >
//               {/* Track */}
//               <div
//                 className="flex transition-transform duration-500 ease-in-out"
//                 style={{ transform: `translateX(-${active * 100}%)` }}
//               >
//                 {finalSlides.map((s) => (
//                   <div key={s.id} className="relative h-[520px] w-full flex-none">
//                     {/* Background */}
//                     <div
//                       className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//                       style={{ backgroundImage: `url('${s.image}')` }}
//                     />

//                     {/* Overlay */}
//                     <div className="absolute inset-0 bg-black/45" />

//                     {/* Content */}
//                     <div className="relative z-10 flex h-full items-center">
//                       <div className="w-full px-10 md:px-14">
//                         <h1 className="max-w-3xl whitespace-pre-line text-5xl font-extrabold leading-tight text-white md:text-6xl">
//                           {s.title}
//                         </h1>

//                         {!!s.description && (
//                           <p className="mt-6 max-w-2xl text-lg text-white/70">
//                             {s.description}
//                           </p>
//                         )}

//                         <button
//                           onClick={() => navigate(s.ctaHref)}
//                           className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-indigo-900 px-10 py-4 text-lg font-semibold text-white hover:bg-indigo-950 transition"
//                         >
//                           {s.ctaText} <span className="text-2xl leading-none">→</span>
//                         </button>

//                         {/* tiny status (optional) */}
//                         {isLoading && (
//                           <p className="mt-4 text-sm text-white/60">
//                             Loading banners...
//                           </p>
//                         )}
//                         {isError && (
//                           <p className="mt-4 text-sm text-white/60">
//                             Could not load banners. Showing default.
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Left arrow */}
//               <button
//                 onClick={goPrev}
//                 disabled={finalSlides.length <= 1}
//                 className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-r-2xl bg-white/90 px-5 py-7 shadow hover:bg-white disabled:opacity-50"
//                 aria-label="Previous slide"
//               >
//                 <span className="text-3xl text-gray-800">‹</span>
//               </button>

//               {/* Right arrow */}
//               <button
//                 onClick={goNext}
//                 disabled={finalSlides.length <= 1}
//                 className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-l-2xl bg-white/90 px-5 py-7 shadow hover:bg-white disabled:opacity-50"
//                 aria-label="Next slide"
//               >
//                 <span className="text-3xl text-gray-800">›</span>
//               </button>

//               {/* Dots */}
//               <div className="absolute right-6 top-1/2 z-20 -translate-y-1/2 space-y-3">
//                 {finalSlides.map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => goTo(i)}
//                     className={`block h-2 w-2 rounded-full ${
//                       i === active ? "bg-red-500" : "bg-white/60"
//                     }`}
//                     aria-label={`Go to slide ${i + 1}`}
//                   />
//                 ))}
//               </div>

//               {/* Peek next slide strip */}
//               <div className="pointer-events-none absolute right-0 top-0 h-full w-16 md:w-20">
//                 <div
//                   className="h-full w-full bg-cover bg-center opacity-90"
//                   style={{ backgroundImage: `url('${nextImage}')` }}
//                 />
//                 <div className="absolute inset-0 bg-black/25" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;



// src/components/Hero.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useListActiveBannersQuery } from "../../features/banner/bannerAPI";

const AUTOPLAY_MS = 5000;

type Slide = {
  id: number | string;
  image: string;
  title: string;
  description: string;
};

const FALLBACK_IMAGE = "/images/about-roof.jpg";

const Hero = () => {
  const { data: banners, isLoading, isError } = useListActiveBannersQuery();

  const slides: Slide[] = useMemo(() => {
    if (!banners?.length) return [];

    const out: Slide[] = [];

    for (const b of banners as any[]) {
      const imgs = Array.isArray(b.images) ? [...b.images] : [];

      imgs.sort((a: any, c: any) => (a.sort_order ?? 0) - (c.sort_order ?? 0));

      const primaryIndex = imgs.findIndex((i: any) => i.is_primary);
      if (primaryIndex > 0) {
        const [primary] = imgs.splice(primaryIndex, 1);
        imgs.unshift(primary);
      }

      if (imgs.length) {
        imgs.forEach((img: any, idx: number) => {
          out.push({
            id: `${b.id}-${img.id ?? idx}`,
            image: img.url || FALLBACK_IMAGE,
            title: b.title ?? "",
            description: b.description ?? "",
          });
        });
      } else {
        out.push({
          id: `${b.id}-fallback`,
          image: FALLBACK_IMAGE,
          title: b.title ?? "",
          description: b.description ?? "",
        });
      }
    }

    return out;
  }, [banners]);

  const fallbackSlides: Slide[] = useMemo(
    () => [
      {
        id: "fallback-1",
        image: FALLBACK_IMAGE,
        title: "Sheltering You\nToday & Tomorrow",
        description:
          "High quality galvanized and color steel roofing sheets with durable lifespan for a trusted shelter.",
      },
    ],
    []
  );

  const finalSlides = slides.length ? slides : fallbackSlides;

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const restartTickRef = useRef(0);
  const [restartKey, setRestartKey] = useState(0);

  const bumpRestart = () => {
    restartTickRef.current += 1;
    setRestartKey((k) => k + 1);
  };

  const goPrev = () => {
    setActive((p) => (p - 1 + finalSlides.length) % finalSlides.length);
    bumpRestart();
  };

  const goNext = () => {
    setActive((p) => (p + 1) % finalSlides.length);
    bumpRestart();
  };

  const goTo = (i: number) => {
    setActive(i);
    bumpRestart();
  };

  useEffect(() => {
    if (active >= finalSlides.length) setActive(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalSlides.length]);

  useEffect(() => {
    if (isPaused) return;
    if (finalSlides.length <= 1) return;

    const id = window.setInterval(() => {
      setActive((p) => (p + 1) % finalSlides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [isPaused, finalSlides.length, restartKey]);

  const nextImage =
    finalSlides.length > 1
      ? finalSlides[(active + 1) % finalSlides.length].image
      : finalSlides[active].image;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-2 lg:col-span-2" />

          <div className="col-span-12 md:col-span-10 lg:col-span-10">
            <div
              className="relative overflow-hidden rounded-3xl"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${active * 100}%)` }}
              >
                {finalSlides.map((s) => (
                  <div key={s.id} className="relative h-[520px] w-full flex-none">
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url('${s.image}')` }}
                    />
                    <div className="absolute inset-0 bg-black/45" />

                    <div className="relative z-10 flex h-full items-center">
                      <div className="w-full px-10 md:px-14">
                        <h1 className="max-w-3xl whitespace-pre-line text-5xl font-extrabold leading-tight text-white md:text-6xl">
                          {s.title}
                        </h1>

                        {!!s.description && (
                          <p className="mt-6 max-w-2xl text-lg text-white/70">
                            {s.description}
                          </p>
                        )}

                        {isLoading && (
                          <p className="mt-4 text-sm text-white/60">Loading banners...</p>
                        )}
                        {isError && (
                          <p className="mt-4 text-sm text-white/60">
                            Could not load banners. Showing default.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={goPrev}
                disabled={finalSlides.length <= 1}
                className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-r-2xl bg-white/90 px-5 py-7 shadow hover:bg-white disabled:opacity-50"
                aria-label="Previous slide"
              >
                <span className="text-3xl text-gray-800">‹</span>
              </button>

              <button
                onClick={goNext}
                disabled={finalSlides.length <= 1}
                className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-l-2xl bg-white/90 px-5 py-7 shadow hover:bg-white disabled:opacity-50"
                aria-label="Next slide"
              >
                <span className="text-3xl text-gray-800">›</span>
              </button>

              <div className="absolute right-6 top-1/2 z-20 -translate-y-1/2 space-y-3">
                {finalSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`block h-2 w-2 rounded-full ${
                      i === active ? "bg-red-500" : "bg-white/60"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="pointer-events-none absolute right-0 top-0 h-full w-16 md:w-20">
                <div
                  className="h-full w-full bg-cover bg-center opacity-90"
                  style={{ backgroundImage: `url('${nextImage}')` }}
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;