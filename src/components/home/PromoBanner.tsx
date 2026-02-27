// src/components/PromoBanner.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListActiveBannersQuery } from "../../features/banner/bannerAPI";

const CHANGE_INTERVAL = 10000; // 10 seconds

function collectAllImages(banners: any[] | undefined): string[] {
  if (!banners?.length) return [];

  const urls: string[] = [];

  for (const b of banners) {
    const imgs = Array.isArray(b.images) ? b.images : [];
    for (const img of imgs) {
      if (img?.url && typeof img.url === "string") {
        urls.push(img.url);
      }
    }
  }

  return Array.from(new Set(urls)); // remove duplicates
}

const PromoBanner = () => {
  const navigate = useNavigate();
  const { data: banners, isLoading, isError } = useListActiveBannersQuery();

  const images = useMemo(
    () => collectAllImages(banners as any[] | undefined),
    [banners]
  );

  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Reset index when images change
  useEffect(() => {
    setIndex(0);
  }, [images.length]);

  // Auto change every 10 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, CHANGE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [images]);

  // Requirement: show nothing if backend not available
  if (isLoading || isError || !images.length) return null;

  const currentImage = images[index];

  return (
    <section className="bg-gray-100 py-12">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
            style={{ backgroundImage: `url('${currentImage}')` }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/55" />

          {/* Right image */}
          <img
            src={currentImage}
            alt="Promotion"
            className="absolute bottom-0 right-0 hidden h-[85%] w-auto md:block transition-opacity duration-700"
            loading="lazy"
          />

          {/* Content */}
          <div className="relative z-10 grid min-h-[320px] items-center p-8 md:p-12">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full bg-indigo-900/90 px-3 py-1.5 text-xs font-medium text-white">
                Limited Offer
              </span>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white md:text-4xl">
                Get Genuine Simba Cement & <br />
                Building Materials at Great Prices
              </h2>

              <p className="mt-4 text-sm text-white/70">
                Bulk and retail supply available for cement, steel, sand,
                ballast, roofing sheets and more.
              </p>

              <button
                onClick={() => navigate("/signin")}
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
              >
                Order Now <span className="text-lg leading-none">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;