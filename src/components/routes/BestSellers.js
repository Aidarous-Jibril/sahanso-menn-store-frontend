import React, { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Loader from "../vendor/layout/Loader";
import ProductCard from "../product/ProductCard";

const BestSellers = ({ products, isLoading, error }) => {
  const scrollRef = useRef(null);

  const bestSellers = products?.length > 0
    ? products.filter((product) => product.sales > 100).sort((a, b) => b.sales - a.sales)
    : [];

  if (!products || products.length === 0) return <div>No products found</div>;
  if (bestSellers.length === 0) return <div>No best-selling products available</div>;

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  // Scroll functions
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-0 relative">
      <hr className="mt-5 mb-2" />
      <h2 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-6">
        Best Selling Products
      </h2>

      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-200"
      >
        <FaArrowLeft size={20} />
      </button>

      {/* Products Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-2 pb-4 scrollbar-hide"
      >
        {bestSellers.map((product) => (
          <div key={product._id} className="min-w-[200px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-200"
      >
        <FaArrowRight size={20} />
      </button>
    </div>
  );
};

export default BestSellers;
