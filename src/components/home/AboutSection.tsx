// const AboutSection = () => {
//   return (
//     <section className="bg-white py-20">
//       <div className="mx-auto max-w-[1400px] px-6">
//         <div className="grid items-center gap-14 md:grid-cols-2">
          
//           {/* LEFT TEXT */}
//           <div>
//             <h2 className="text-2xl font-bold leading-snug text-indigo-900 md:text-3xl">
//               OUR ROOFING SHEETS ARE <br />
//               DISTINCTLY DIFFERENT
//             </h2>

//             <p className="mt-6 text-base leading-relaxed text-gray-600">
//               It is the vision and commitment of Mr Narendra Raval EBS (Guru)
//               to supply building and construction materials at affordable costs
//               to the local Kenyan population. Maisha Mabati Mills began with the
//               product of galvanised and coloured steel roofing sheets. The
//               products are largely focused on being durable, functional, strong
//               and cost-effective to enable Kenyans around the country to build
//               better standard homes.
//             </p>
//           </div>

//           {/* RIGHT IMAGE */}
//           <div className="overflow-hidden rounded-lg">
//             <img
//               src="/images/about-roof.jpg"
//               alt="Roofing"
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



const AboutSection = () => {
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
              We supply genuine Simba Cement and a wide range of construction materials
              at affordable prices for homes, contractors, and project sites across Kenya.
              From cement and steel to sand, ballast, binding wire, nails and roofing sheets,
              our focus is on durable, reliable, and cost-effective products that help you
              build strong and finish on time.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="overflow-hidden rounded-lg">
            <img
              src="/images/about-roof.jpg"
              alt="Simba Cement and building materials"
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;