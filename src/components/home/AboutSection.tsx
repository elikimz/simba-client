



// const AboutSection = () => {
//   return (
//     <section className="bg-white py-20">
//       <div className="mx-auto max-w-[1400px] px-6">
//         <div className="grid items-center gap-14 md:grid-cols-2">
          
//           {/* LEFT TEXT */}
//           <div>
//             <h2 className="text-2xl font-bold leading-snug text-indigo-900 md:text-3xl">
//               SIMBA CEMENT & <br />
//               BUILDING MATERIALS YOU CAN TRUST
//             </h2>

//             <p className="mt-6 text-base leading-relaxed text-gray-600">
//               We supply genuine Simba Cement and a wide range of construction materials
//               at affordable prices for homes, contractors, and project sites across Kenya.
//               From cement and steel to sand, ballast, binding wire, nails and roofing sheets,
//               our focus is on durable, reliable, and cost-effective products that help you
//               build strong and finish on time.
//             </p>
//           </div>

//           {/* RIGHT IMAGE */}
//           <div className="overflow-hidden rounded-lg">
//             <img
//               src="/images/about-roof.jpg"
//               alt="Simba Cement and building materials"
//               className="w-full h-auto object-contain"
//               loading="lazy"
//             />
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutSection;




// src/components/AboutSection.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useListActiveBannersQuery } from "../../features/banner/bannerAPI"; // ✅ adjust path

const SWITCH_MS = 10000; // change every 10s

function collectAllImages(banners: any[] | undefined): string[] {
  if (!banners?.length) return [];
  const urls: string[] = [];

  for (const b of banners) {
    const imgs = Array.isArray(b.images) ? b.images : [];
    for (const img of imgs) {
      if (img?.url && typeof img.url === "string") urls.push(img.url);
    }
  }

  return Array.from(new Set(urls));
}

function pickDifferentRandom(urls: string[], current: string | null) {
  if (!urls.length) return null;
  if (urls.length === 1) return urls[0];

  let next = current;
  while (next === current) {
    next = urls[Math.floor(Math.random() * urls.length)];
  }
  return next;
}

const AboutSection = () => {
  const { data: banners, isLoading, isError } = useListActiveBannersQuery();

  const images = useMemo(
    () => collectAllImages(banners as any[] | undefined),
    [banners]
  );

  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  // pick first image when list arrives
  useEffect(() => {
    if (!images.length) {
      setCurrentImg(null);
      return;
    }
    setCurrentImg((prev) => pickDifferentRandom(images, prev));
  }, [images]);

  // switch randomly every 10s
  useEffect(() => {
    if (isLoading || isError) return;
    if (images.length <= 1) return;

    if (intervalRef.current) window.clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setCurrentImg((prev) => pickDifferentRandom(images, prev));
    }, SWITCH_MS);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [images, isLoading, isError]);

  // show nothing if backend not available / no images
  if (isLoading || isError || !currentImg) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid items-center gap-14 md:grid-cols-2">
          {/* LEFT TEXT */}
          <div>
            <h2 className="text-2xl font-bold leading-snug text-indigo-900 md:text-3xl">
              SIMBA CEMENT & <br />
              BUILDING MATERIALS YOU CAN TRUST
            </h2>

            <p className="mt-6 text-base leading-relaxed text-gray-600">
              We supply genuine Simba Cement and a wide range of construction
              materials at affordable prices for homes, contractors, and project
              sites across Kenya. From cement and steel to sand, ballast,
              binding wire, nails and roofing sheets, our focus is on durable,
              reliable, and cost-effective products that help you build strong
              and finish on time.
            </p>
          </div>

          {/* RIGHT IMAGE (from backend, random switching) */}
          <div className="overflow-hidden rounded-lg">
            <img
              src={currentImg}
              alt="Simba Cement and building materials"
              className="h-auto w-full object-contain transition-opacity duration-700"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;