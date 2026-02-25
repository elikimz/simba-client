// const features = [
//   {
//     title: "Quality You Can Trust",
//     description:
//       "At Maisha Mabati Mills, quality is at the core of everything we do. Our roofing sheets are manufactured using state-of-the-art technology at our modern alu-zinc plant in Ruiru.",
//     icon: "📦",
//   },
//   {
//     title: "Amazing Offers",
//     description:
//       "We believe every Kenyan deserves access to strong, reliable roofing without overpaying. That’s why Maisha Mabati offers competitively priced solutions.",
//     icon: "💰",
//   },
//   {
//     title: "Fast & Reliable Delivery",
//     description:
//       "With an efficient production system and a strong distribution network, Maisha Mabati ensures timely and dependable delivery across Kenya.",
//     icon: "🚚",
//   },
// ];

// const FeatureStrip = () => {
//   return (
//     <section className="bg-gray-100 py-14">
//       <div className="mx-auto max-w-[1400px] px-6">
//         <div className="grid gap-10 md:grid-cols-3">
//           {features.map((f, i) => (
//             <div key={i} className="flex gap-5">
//               <div className="text-2xl text-cyan-500">{f.icon}</div>

//               <div>
//                 <h3 className="text-base font-semibold text-gray-900">
//                   {f.title}
//                 </h3>
//                 <p className="mt-2 text-sm leading-relaxed text-gray-600">
//                   {f.description}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeatureStrip;



const features = [
  {
    title: "Genuine Simba Cement",
    description:
      "We supply authentic Simba Cement and trusted construction materials sourced from reliable manufacturers to ensure strength, durability, and consistent quality for every project.",
    icon: "🧱",
  },
  {
    title: "Competitive Bulk Pricing",
    description:
      "Whether you're building a home or supplying a construction site, we offer fair and affordable pricing on cement, steel, sand, ballast, nails, and other essential materials.",
    icon: "💰",
  },
  {
    title: "Fast & Reliable Delivery",
    description:
      "With an efficient supply chain and dependable transport, we ensure timely delivery of cement and building materials to your site anywhere within our service areas.",
    icon: "🚚",
  },
];

const FeatureStrip = () => {
  return (
    <section className="bg-gray-100 py-14">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="flex gap-5">
              <div className="text-2xl text-cyan-500">{f.icon}</div>

              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureStrip;