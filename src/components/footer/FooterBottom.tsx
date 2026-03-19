



// const FooterBottom = () => {
//   return (
//     <section className="bg-white">
//       {/* Top info strip */}
//       <div className="border-t border-gray-200">
//         <div className="mx-auto max-w-[1400px] px-6">
//           <div className="grid grid-cols-2 text-center text-sm font-semibold text-gray-900">
//             <div className="py-4">Fast & Reliable Delivery</div>
//             <div className="py-4 border-l border-gray-200">
//               Bulk & Same Day Delivery Available
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main bottom area */}
//       <div className="mx-auto max-w-[1400px] px-6 py-14">
//         {/* Links */}
//         <div className="flex flex-wrap gap-8 text-sm text-gray-900">
//           <a href="#" className="hover:text-indigo-900">Privacy Policy</a>
//           <a href="#" className="hover:text-indigo-900">Order Tracking</a>
//           <a href="#" className="hover:text-indigo-900">Refund & Returns Policy</a>
//         </div>

//         {/* Copyright */}
//         <p className="mt-6 text-sm text-gray-400">
//           Copyright 2026 © Simba Cement Wholesale Distributor. All rights reserved.
//         </p>

//         {/* Payment Section */}
//         <div className="mt-10 flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
//           {/* Payment Info */}
//           <div className="flex flex-col gap-4">
//             <p className="text-sm font-semibold text-gray-900">
//               Secure Payment Options
//             </p>

//             <div className="flex items-center gap-4 text-sm text-gray-600">
//               <span>M-Pesa</span>
//               <span>Cash on Order</span>
//               <span>Bank Transfer</span>
//             </div>
//           </div>

//           {/* Mpesa */}
//           {/* <img
//             src="/images/footer/mpesa.png"
//             alt="Lipa na Mpesa"
//             className="h-10 w-auto"
//             loading="lazy"
//           /> */}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FooterBottom;




// FooterBottom.tsx
const FooterBottom = () => {
  const whatsappNumber = "254731030404"; // ✅ put your WhatsApp number (no +)
  const phoneNumber = "+254731030404";   // ✅ put your call number

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi, I’d like to place an order / inquire about delivery."
  )}`;
  const phoneLink = `tel:${phoneNumber}`;

  return (
    <section className="bg-white relative">
      {/* Floating side buttons */}
      <div className="fixed right-4 bottom-6 z-[9999] flex flex-col gap-3">
        {/* WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 rounded-full bg-green-600 px-4 py-3 text-white shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="Chat on WhatsApp"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
            {/* WhatsApp icon */}
            <svg viewBox="0 0 32 32" className="h-6 w-6" fill="currentColor">
              <path d="M19.11 17.53c-.27-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.61.14-.18.27-.7.89-.86 1.07-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.16-1.34-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.34.98 2.64 1.11 2.82.14.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.55.58.65.21 1.25.18 1.72.11.52-.08 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.12-.25-.2-.52-.34z" />
              <path d="M26.67 5.33A13.9 13.9 0 0 0 16 .67C8.47.67 2.33 6.8 2.33 14.33c0 2.45.64 4.83 1.86 6.93L2 30.67l9.6-2.51a13.6 13.6 0 0 0 4.4.73c7.53 0 13.67-6.13 13.67-13.66 0-3.65-1.42-7.08-4-9.9zM16 26.67c-1.41 0-2.8-.27-4.1-.8l-.29-.12-5.7 1.5 1.52-5.55-.19-.29a11.9 11.9 0 0 1-1.86-6.34C5.38 8.3 10.1 3.58 16 3.58c3.16 0 6.12 1.23 8.35 3.46A11.7 11.7 0 0 1 27.8 15c0 5.9-4.8 11.67-11.8 11.67z" />
            </svg>
          </span>

          <div className="hidden sm:block">
            <div className="text-sm font-semibold leading-none">WhatsApp</div>
            <div className="text-xs opacity-90">Chat with us</div>
          </div>
        </a>

        {/* Call / Contact */}
        <a
          href={phoneLink}
          className="group flex items-center gap-3 rounded-full bg-indigo-700 px-4 py-3 text-white shadow-lg hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Call us"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
            {/* Phone icon */}
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.11a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>

          <div className="hidden sm:block">
            <div className="text-sm font-semibold leading-none">Contact</div>
            <div className="text-xs opacity-90">Call us now</div>
          </div>
        </a>
      </div>

      {/* Top info strip */}
      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-2 text-center text-sm font-semibold text-gray-900">
            <div className="py-4">Fast & Reliable Delivery</div>
            <div className="border-l border-gray-200 py-4">
              Bulk & Same Day Delivery Available
            </div>
          </div>
        </div>
      </div>

      {/* Main bottom area */}
      <div className="mx-auto max-w-[1400px] px-6 py-14">
        {/* Links */}
        <div className="flex flex-wrap gap-8 text-sm text-gray-900">
          <a href="#" className="hover:text-indigo-900">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-indigo-900">
            Order Tracking
          </a>
          <a href="#" className="hover:text-indigo-900">
            Refund & Returns Policy
          </a>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-sm text-gray-400">
          Copyright 2026 © Simba Cement Wholesale Distributor. All rights
          reserved.
        </p>

        {/* Social Media Section */}
        <div className="mt-10 flex flex-col gap-6">
          <p className="text-sm font-semibold text-gray-900">
            Follow Us on Social Media
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.tiktok.com/@.simbacement0?_r=1&_t=ZS-94ocZgzi50H"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition"
              aria-label="Follow us on TikTok"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 1 1-4.77-2.3A2.4 2.4 0 0 1 9.1 13.66V9.58a6.8 6.8 0 0 0-6.8 6.78 6.81 6.81 0 0 0 6.8 6.78 6.84 6.84 0 0 0 6.8-6.78v-3.39a8.62 8.62 0 0 0 3.77 1.02v-3.68a4.9 4.9 0 0 1-.77-.07z" />
              </svg>
            </a>
            <a
              href="https://facebook.com/groups/1586964412167004/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
              aria-label="Join us on Facebook"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/marymbwire?igsh=bjZucjZraWQ3cTl2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition"
              aria-label="Follow us on Instagram"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Payment Section */}
        <div className="mt-10 flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          {/* Payment Info */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-gray-900">
              Secure Payment Options
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>M-Pesa</span>
              <span>Cash on Order</span>
              <span>Bank Transfer</span>
            </div>
          </div>

          {/* Mpesa */}
          {/*
          <img
            src="/images/footer/mpesa.png"
            alt="Lipa na Mpesa"
            className="h-10 w-auto"
            loading="lazy"
          />
          */}
        </div>
      </div>
    </section>
  );
};

export default FooterBottom;