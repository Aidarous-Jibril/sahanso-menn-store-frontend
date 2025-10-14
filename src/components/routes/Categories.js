import React from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/solid";
import Image from "next/image";

const Categories = ({ categories }) => {
  const fallbackImage = "/images/category-placeholder.png";

  return (
     <div className="container mx-auto px-2 md:px-4 py-4 relative max-w-[95%] lg:max-w-[90%]"> 
      
      <hr className="mt-5 mb-2" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Explore Popular Categories</h2>
        <Link href="/categories" className="flex items-center text-blue-600">
          View All
          <ChevronRightIcon className="ml-2 h-5 w-5" />
        </Link>
      </div>

      <div className="relative overflow-x-auto">
        <div className="flex flex-nowrap gap-10 items-center justify-center md:justify-start">
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex flex-col items-center text-center flex-shrink-0"
            >
              <Link href={`/category/${category.slug}`} passHref legacyBehavior>
                <a className="cursor-pointer">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-white flex items-center justify-center">
                    <Image
                      src={category.imageUrl || fallbackImage}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs md:text-sm font-medium mt-2 truncate">
                    {category.name}
                  </p>
                </a>
              </Link>
            </div>

          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
