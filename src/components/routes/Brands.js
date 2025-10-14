import { ChevronRightIcon } from "@heroicons/react/solid";
import Image from "next/image";

const Brands = ({ brands = [] }) => {
  if (!brands.length) return null;

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 relative max-w-[95%] lg:max-w-[90%]"> 
      <hr className="mt-5 mb-2" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Brands</h2>
        <a href="#" className="flex items-center text-blue-600">
          View All
          <ChevronRightIcon className="ml-2 h-5 w-5" />
        </a>
      </div>
      <div className="flex space-x-4 overflow-x-auto">
        {brands.map((brand) => (
          <div key={brand._id} className="flex-shrink-0 w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center p-2">
            <Image
              src={brand.logo || "/images/brand-placeholder.png"}
              alt={brand.name || "Brand"}
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              sizes="40px"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
