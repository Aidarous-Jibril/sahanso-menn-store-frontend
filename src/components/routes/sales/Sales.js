import React, { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ProductCard from "@/components/product/ProductCard";


const Sale = ({ sales }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Destructure and Filter only those sales that have started AND not ended 
  const now = new Date();
  const activeSales = sales?.filter(({ saleStart, saleEnd }) =>
    now >= new Date(saleStart) && now <= new Date(saleEnd)
  );    
  
  return (
    <div className="container mx-auto px-2 md:px-4 py-2 relative max-w-[95%] lg:max-w-[90%]">
      <div className="flex flex-col lg990:flex-row justify-between items-start lg990:items-center mb-6">
        {/* Flash Deal Countdown */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center mb-6 lg990:mb-0 lg990:mr-6 w-full lg990:w-1/3">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-700">
            FLASH DEAL
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-xl text-blue-600 mt-2">
            Hurry Up! The offer is limited. Grab while it lasts
          </p>
          <div className="bg-blue-700 text-white mt-6 p-4 rounded-lg">
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                  1192
                </div>
                <div className="text-sm sm:text-base md:text-lg lg:text-xl">
                  Days
                </div>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                :
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                  02
                </div>
                <div className="text-sm sm:text-base md:text-lg lg:text-xl">
                  Hrs
                </div>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                :
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                  04
                </div>
                <div className="text-sm sm:text-base md:text-lg lg:text-xl">
                  Min
                </div>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                :
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                  04
                </div>
                <div className="text-sm sm:text-base md:text-lg lg:text-xl">
                  Sec
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Products List with Scrollable Arrows */}
        <div className="relative w-full lg990:w-2/3">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-200"
          >
            <FaArrowLeft size={20} />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
          >
            {activeSales?.map((sale) => (
              <div key={sale._id} className="w-72 flex-shrink-0">
                <ProductCard
                  product={sale}
                  isSale={true}
                  saleEndDate={sale.saleEnd}
                />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-200"
          >
            <FaArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sale;
