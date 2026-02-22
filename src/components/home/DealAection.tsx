import ProductCard from "./ProductCard";

const products = [
  {
    image: "/images/about-roof.jpg",
    name: "Maisha Aluzinc mabati",
    price: "KSh250.00 – KSh350.00",
    inStock: true,
  },
  {
    image: "/images/about-roof.jpg",
    name: "Maisha dumuzas corrugated",
    price: "KSh350.00 – KSh450.00",
    inStock: true,
  },
  {
    image: "/images/about-roof.jpg",
    name: "Building steel & Binding Wire",
    price: "KSh210.00",
    inStock: true,
  },
  {
    image: "/images/about-roof.jpg",
    name: "SIMBA CEMENT",
    price: "KSh600.00",
    inStock: true,
  },
  {
    image: "/images/about-roof.jpg",
    name: "Maisha Roman Tile",
    price: "KSh500.00 – KSh555.00",
    inStock: true,
  },
];

const DealsSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1400px] px-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b pb-6">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-semibold text-red-500">
              Latest Deals for This Month
            </h2>

            <span className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white">
              00 : 00 : 00 : 00
            </span>

            <span className="hidden text-sm text-gray-400 md:block">
              Remains until the end of the offer
            </span>
          </div>

          <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black">
            View All →
          </button>
        </div>

        {/* Products */}
        <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product, i) => (
            <ProductCard id={0} key={i} {...product} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default DealsSection;