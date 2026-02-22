const reasons = [
  "High corrosive resistance",
  "High Gloss and Scratch Resistant",
  "Unique Heat Reflection capabilities",
  "Modern appearance and greater aesthetic appeal",
  "Value for money",
  "Available in all gauges; for low medium and high cost roofing solutions",
  "Variety of colours, profiles, and customised sizes",
  "Suitable for all applications",
];

const WhyMaisha = () => {
  return (
    <section className="bg-gray-100 py-14">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Title (smaller + tighter like original site) */}
        <h2 className="text-center text-3xl font-bold tracking-tight">
          <span className="text-gray-900">Why </span>
          <span className="text-indigo-900">Maisha Mabati</span>
        </h2>

        {/* Content */}
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {/* Left image card */}
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src="/images/about-roof.jpg"
              alt="Why Maisha"
              className="h-[380px] w-full object-cover"
              loading="lazy"
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-black/55" />

            {/* text */}
            <div className="absolute inset-0 p-6 md:p-8">
              <span className="inline-flex rounded-full bg-indigo-900/90 px-3 py-1.5 text-xs font-medium text-white">
                Order Today
              </span>

              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/80">
                Our products guarantee the best quality with the KEBS Diamond
                Mark of Quality. The Mabati is rustproof, suitable for all Kenyan
                atmospheric conditions and can be used for all sorts of
                construction and application. Multiple profile options with high
                gloss shine and durable finish ensure long life.
              </p>

              <button className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white">
                Shop Now <span className="text-lg leading-none">→</span>
              </button>
            </div>
          </div>

          {/* Right checklist (smaller + cleaner) */}
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