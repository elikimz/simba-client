// type Testimonial = {
//   name: string;
//   location: string;
//   role: string;
//   message: string;
//   avatar: string;
// };

// const testimonials: Testimonial[] = [
//   {
//     name: "Mary A.",
//     location: "Nairobi",
//     role: "Sales Manager",
//     message:
//       "Fast delivery and excellent quality! I was able to complete my project on time thanks to Maisha Mabati. Their customer service is top-notch.",
//     avatar: "/images/testimonials/mary.jpg",
//   },
//   {
//     name: "Kevin O.",
//     location: "Umoja",
//     role: "Business Manager",
//     message:
//       "I’ve been using Maisha Alu-zinc sheets for all my building projects. They are strong, weather-resistant, and cost-effective. Truly a brand you can trust.",
//     avatar: "/images/about-roof.jpg",
//   },
//   {
//     name: "Alice M.",
//     location: "Buruburu",
//     role: "Computer Engineer",
//     message:
//       "Affordable roofing without compromising quality! Maisha Mabati made sure my roofing materials were delivered on time, and the sheets are flawless. Excellent service.",
//     avatar: "/images/testimonials/alice.jpg",
//   },
// ];

// const Stars = () => (
//   <div className="flex gap-1 text-yellow-400">
//     <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
//   </div>
// );

// const TestimonialsSection = () => {
//   return (
//     <section className="bg-gray-100 py-14">
//       <div className="mx-auto max-w-[1400px] px-6">
//         {/* Discount strip */}
//         <div className="rounded-2xl border border-dashed border-red-300 bg-red-50 px-6 py-6 md:px-10">
//           <div className="flex flex-col items-center justify-center gap-4 text-center md:flex-row md:text-left">
//             <h3 className="text-xl font-semibold text-red-500">
//               Super discount for your first purchase
//             </h3>

//             <button className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white hover:bg-red-600 transition">
//               Whatsapp Now
//             </button>

//             <span className="text-sm text-gray-500">
//               Use discount code in checkout page.
//             </span>
//           </div>
//         </div>

//         {/* Testimonials */}
//         <div className="mt-10 grid gap-14 md:grid-cols-3">
//           {testimonials.map((t) => (
//             <div key={`${t.name}-${t.location}`} className="flex gap-6">
//               {/* Avatar */}
//               <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white">
//                 <img
//                   src={t.avatar}
//                   alt={`${t.name} avatar`}
//                   className="h-full w-full object-cover"
//                   loading="lazy"
//                 />
//               </div>

//               {/* Content */}
//               <div>
//                 <Stars />

//                 <h4 className="mt-2 text-lg font-semibold text-gray-900">
//                   {t.name}, {t.location}
//                 </h4>

//                 <p className="text-sm text-gray-500">{t.role}</p>

//                 <p className="mt-4 text-sm leading-relaxed text-gray-400">
//                   “{t.message}”
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TestimonialsSection;





type Testimonial = {
  name: string;
  location: string;
  role: string;
  message: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    name: "James K.",
    location: "Nairobi",
    role: "Contractor",
    message:
      "I ordered Simba Cement and steel for my site and everything was delivered on time. The materials were genuine and the pricing was fair. Very reliable supplier.",
    avatar: "/images/testimonials/mary.jpg",
  },
  {
    name: "Brian O.",
    location: "Ruiru",
    role: "Site Supervisor",
    message:
      "We regularly source cement, ballast, and binding wire from them. The quality is consistent and delivery is always fast. Makes managing projects much easier.",
    avatar: "/images/about-roof.jpg",
  },
  {
    name: "Grace M.",
    location: "Thika",
    role: "Home Owner",
    message:
      "Affordable building materials without compromising on quality. My Simba Cement and roofing materials arrived exactly as ordered. Excellent service and communication.",
    avatar: "/images/testimonials/alice.jpg",
  },
];

const Stars = () => (
  <div className="flex gap-1 text-yellow-400">
    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
  </div>
);

const TestimonialsSection = () => {
  return (
    <section className="bg-gray-100 py-14">
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

        {/* Testimonials */}
        <div className="mt-10 grid gap-14 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={`${t.name}-${t.location}`} className="flex gap-6">
              {/* Avatar */}
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white">
                <img
                  src={t.avatar}
                  alt={`${t.name} avatar`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div>
                <Stars />

                <h4 className="mt-2 text-lg font-semibold text-gray-900">
                  {t.name}, {t.location}
                </h4>

                <p className="text-sm text-gray-500">{t.role}</p>

                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  “{t.message}”
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;