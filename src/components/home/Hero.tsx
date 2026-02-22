import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  image: string;
  title: string;
  description: string;
  ctaText: string;
};

const AUTOPLAY_MS = 5000;

const Hero = () => {
  const slides: Slide[] = useMemo(
    () => [
      {
        image: "/images/about-roof.jpg",
        title: "Sheltering You\nToday & Tomorrow",
        description:
          "High quality galvanized and color steel roofing sheets with durable lifespan for a trusted shelter.",
        ctaText: "Shop Now",
      },
      {
        image: "/images/about-roof.jpg",
        title: "Build With\nConfidence",
        description:
          "Trusted materials, consistent quality, and reliable delivery to your site.",
        ctaText: "Shop Now",
      },
      {
        image: "/images/about-roof.jpg",
        title: "Quality Roofing\nFor Every Home",
        description:
          "Durable, weather-resistant sheets designed for long life and great finishes.",
        ctaText: "Shop Now",
      },
      {
        image: "/images/about-roof.jpg",
        title: "Strong Foundations\nStart Here",
        description: "Explore our best sellers and top offers for this season.",
        ctaText: "Shop Now",
      },
    ],
    []
  );

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // restart autoplay after user interaction
  const restartTickRef = useRef(0);
  const [restartKey, setRestartKey] = useState(0);

  const bumpRestart = () => {
    restartTickRef.current += 1;
    setRestartKey((k) => k + 1);
  };

  const goPrev = () => {
    setActive((p) => (p - 1 + slides.length) % slides.length);
    bumpRestart();
  };

  const goNext = () => {
    setActive((p) => (p + 1) % slides.length);
    bumpRestart();
  };

  const goTo = (i: number) => {
    setActive(i);
    bumpRestart();
  };

  // Autoplay
  useEffect(() => {
    if (isPaused) return;

    const id = window.setInterval(() => {
      setActive((p) => (p + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [isPaused, slides.length, restartKey]);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT WHITE SPACE */}
          <div className="col-span-12 md:col-span-2 lg:col-span-2" />

          {/* SLIDER */}
          <div className="col-span-12 md:col-span-10 lg:col-span-10">
            <div
              className="relative overflow-hidden rounded-3xl"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Track */}
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${active * 100}%)` }}
              >
                {slides.map((s, idx) => (
                  <div key={idx} className="relative h-[520px] w-full flex-none">
                    {/* Background (HQ local image) */}
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url('${s.image}')` }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/45" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full items-center">
                      <div className="w-full px-10 md:px-14">
                        <h1 className="max-w-3xl whitespace-pre-line text-5xl font-extrabold leading-tight text-white md:text-6xl">
                          {s.title}
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg text-white/70">
                          {s.description}
                        </p>

                        <button className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-indigo-900 px-10 py-4 text-lg font-semibold text-white hover:bg-indigo-950 transition">
                          {s.ctaText}{" "}
                          <span className="text-2xl leading-none">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Left arrow */}
              <button
                onClick={goPrev}
                className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-r-2xl bg-white/90 px-5 py-7 shadow hover:bg-white"
                aria-label="Previous slide"
              >
                <span className="text-3xl text-gray-800">‹</span>
              </button>

              {/* Right arrow */}
              <button
                onClick={goNext}
                className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-l-2xl bg-white/90 px-5 py-7 shadow hover:bg-white"
                aria-label="Next slide"
              >
                <span className="text-3xl text-gray-800">›</span>
              </button>

              {/* Dots */}
              <div className="absolute right-6 top-1/2 z-20 -translate-y-1/2 space-y-3">
                {slides.map((_, i) => (
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

              {/* Peek next slide strip */}
              <div className="pointer-events-none absolute right-0 top-0 h-full w-16 md:w-20">
                <div
                  className="h-full w-full bg-cover bg-center opacity-90"
                  style={{
                    backgroundImage: `url('${
                      slides[(active + 1) % slides.length].image
                    }')`,
                  }}
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