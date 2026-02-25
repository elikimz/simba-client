// const PromoBanner = () => {
//   return (
//     <section className="bg-gray-100 py-12">
//       <div className="mx-auto max-w-[1400px] px-6">
//         <div className="relative overflow-hidden rounded-3xl">
//           {/* Background */}
//           <div
//             className="absolute inset-0 bg-cover bg-center"
//             style={{ backgroundImage: "url('/images/promo/promo-bg.jpg')" }}
//           />
//           {/* Dark overlay */}
//           <div className="absolute inset-0 bg-black/55" />

//           {/* Right image */}
//           <img
//             src="/images/about-roof.jpg"
//             alt="Promo"
//             className="absolute bottom-0 right-0 hidden h-[85%] w-auto md:block"
//             loading="lazy"
//           />

//           {/* Content */}
//           <div className="relative z-10 grid min-h-[320px] items-center p-8 md:p-12">
//             <div className="max-w-xl">
//               <span className="inline-flex rounded-full bg-indigo-900/90 px-3 py-1.5 text-xs font-medium text-white">
//                 On Sale
//               </span>

//               <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white md:text-4xl">
//                 Get the Right Building Mabati at the <br />
//                 Right Price Today
//               </h2>

//               <p className="mt-4 text-sm text-white/70">
//                 Shop Our Popular Discounts &amp; Offers
//               </p>

//               <button className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white">
//                 Order Now <span className="text-lg leading-none">→</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PromoBanner;





const PromoBanner = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/promo/promo-bg.jpg')" }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/55" />

          {/* Right image */}
          <img
            src="/images/about-roof.jpg"
            alt="Simba Cement Promotion"
            className="absolute bottom-0 right-0 hidden h-[85%] w-auto md:block"
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

              <button className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white">
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