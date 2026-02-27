// src/components/TestimonialsSection.tsx
type Testimonial = {
  name: string;
  location: string;
  role: string;
  message: string;
  emoji: string;
};

const testimonials: Testimonial[] = [
  {
    name: "James K.",
    location: "Nairobi",
    role: "Contractor",
    message:
      "I ordered Simba Cement and steel for my site and everything was delivered on time. The materials were genuine and the pricing was fair. Very reliable supplier.",
    emoji: "👷🏾‍♂️",
  },
  {
    name: "Brian O.",
    location: "Ruiru",
    role: "Site Supervisor",
    message:
      "We regularly source cement, ballast, and binding wire from them. The quality is consistent and delivery is always fast. Makes managing projects much easier.",
    emoji: "🦺",
  },
  {
    name: "Grace M.",
    location: "Thika",
    role: "Home Owner",
    message:
      "Affordable building materials without compromising on quality. My Simba Cement and roofing materials arrived exactly as ordered. Excellent service and communication.",
    emoji: "🏠",
  },
];

const Stars = () => (
  <div className="flex gap-1 text-yellow-400">
    <span>★</span>
    <span>★</span>
    <span>★</span>
    <span>★</span>
    <span>★</span>
  </div>
);

const TestimonialsSection = () => {
  const items = [...testimonials, ...testimonials];

  return (
    <section className="bg-gray-100 py-14">
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee {
          animation: marqueeLeft 30s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee { animation: none; }
        }
      `}</style>

      <div className="mx-auto max-w-[1400px] px-6">
        {/* Discount strip */}
        <div className="rounded-2xl border border-dashed border-red-300 bg-red-50 px-6 py-6 md:px-10">
          <div className="flex flex-col items-center justify-center gap-4 text-center md:flex-row md:text-left">
            <h3 className="text-xl font-semibold text-red-500">
              Special discount on bulk cement orders
            </h3>

            <button className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white hover:bg-red-600 transition">
              WhatsApp Now
            </button>

            <span className="text-sm text-gray-500">
              Contact us today for the best wholesale rates.
            </span>
          </div>
        </div>

        {/* Horizontal moving testimonials */}
        <div className="mt-10 overflow-hidden">
          <div className="marquee flex w-max gap-10 pr-10">
            {items.map((t, idx) => (
              <div
                key={`${t.name}-${t.location}-${idx}`}
                className="w-[320px] shrink-0 rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* Emoji Avatar */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl">
                    {t.emoji}
                  </div>

                  <div className="min-w-0">
                    <Stars />
                    <h4 className="mt-2 truncate text-base font-semibold text-gray-900">
                      {t.name}, {t.location}
                    </h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-500">
                  “{t.message}”
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;