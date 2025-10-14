import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoIosMenu } from "react-icons/io";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { XIcon, ChevronDownIcon,ChevronUpIcon,SearchIcon,ShoppingCartIcon } from "@heroicons/react/solid";
import dynamic from "next/dynamic";
import { CgProfile } from "react-icons/cg";

import styles from "../../styles/styles";
import { navItems } from "../../static/data";
import ClientOnly from "../common/ClientOnly";

const Cart = dynamic(() => import("../cart/Cart"), { ssr: false });

const HeaderBottom = ({ categories, handleSearchChange, searchData }) => {
  const ref = useRef();
  const router = useRouter();
  const currentPath = router.pathname;

  const { vendorInfo } = useSelector((state) => state.vendors);
  const { userInfo } = useSelector((state) => state.user);
  const isVendorLoggedIn = !!(vendorInfo && vendorInfo._id);

  const [sidebar, setSidebar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSearch = () => setShowSearch((prev) => !prev);

  const filteredResults = useMemo(() => {
    if (!searchData || !showSearch) return null;
    return searchData.map((item) => (
      <Link
        href={`/product/${item._id}`}
        key={item._id}
        className="w-full flex items-start py-3"
      >
        <Image
          src={item.images[0]?.url}
          alt={item.name}
          width={40}
          height={40}
          className="w-[40px] h-[40px] mr-5 rounded object-cover"
        />
        <h1 className="text-[#000]">{item.name}</h1>
      </Link>
    ));
  }, [searchData, showSearch]);

  return (
    <>
      <div className="w-full px-4 h-[46px] bg-slate-700 text-white flex items-center justify-between">
        {/* Left: Navigation */}
        <ul className="flex items-center gap-2 text-sm tracking-wide">
          <li
            onClick={() => setSidebar(true)}
            className="flex items-center gap-1 cursor-pointer border border-transparent hover:border-white px-3.5 py-1 
              text-sm sm:text-base md:text-[15px] lg:text-[16px] xl:text-[17px] font-medium text-white transition duration-200"
          >
            <IoIosMenu size={24} />
            All
          </li>

          <ClientOnly>
            {windowWidth >= 768 && (
              <div className={`block ${styles.normalFlex}`}>
                {navItems.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className={`px-6 cursor-pointer border-b border-transparent transition duration-200
                  ${
                    currentPath === item.url
                      ? "text-yellow-500 border-b-2 border-yellow-500 font-semibold text-sm sm:text-base md:text-[15px] lg:text-[16px] xl:text-[17px]"
                      : "text-white hover:border-white font-medium text-sm sm:text-base md:text-[15px] lg:text-[16px] xl:text-[17px]"
                  }`}
              >
                {item.title}
              </Link>

                ))}

                <Link
                  href={isVendorLoggedIn ? "/vendor/dashboard" : "/vendor/login"}
                  className="text-gray-300 hover:text-yellow-400 font-medium text-sm sm:text-base md:text-[15px] lg:text-[16px] xl:text-[17px] px-6 cursor-pointer transition duration-200"
                >
                  {isVendorLoggedIn ? "Dashboard" : "Sell"}
                </Link>
              </div>
            )}
          </ClientOnly>
        </ul>

        {/* Right: Mobile icons */}
        <ClientOnly>
          {windowWidth < 768 && (
            <>
              <Link href="/" className="w-24 cursor-pointer">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={100}
                  height={40}
                />
              </Link>

              <div className="flex items-center">
                <SearchIcon
                  className="h-6 w-6 text-white mr-4 cursor-pointer"
                  onClick={toggleSearch}
                />
                <ShoppingCartIcon
                  onClick={() => setOpenCart(!openCart)}
                  className="h-6 w-6 mr-4 text-white cursor-pointer"
                />
                <Link
                  href={userInfo?.avatar?.url ? "/profile" : "/user/login"}
                >
                  {userInfo?.avatar?.url ? (
                    <Image
                      src={userInfo.avatar.url}
                      width={35}
                      height={35}
                      alt="User Avatar"
                      className="w-[35px] h-[35px] rounded-full"
                    />
                  ) : (
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  )}
                </Link>
              </div>
              {openCart && <Cart setOpenCart={setOpenCart} />}
            </>
          )}
        </ClientOnly>
      </div>

      {/* Search Dropdown */}
      {showSearch && (
        <div className="absolute top-[6px] left-0 right-0 z-50 mx-4">
          <div className="relative bg-white p-0.5 rounded-md shadow-md">
            <input
              onChange={handleSearchChange}
              type="text"
              placeholder="Search products..."
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <XIcon
              className="absolute top-3 right-3 h-6 w-6 text-red-600 cursor-pointer"
              onClick={toggleSearch}
            />
          </div>

          {filteredResults && (
            <div className="bg-slate-50 shadow-sm mt-4 p-4 rounded-md max-h-[400px] overflow-y-auto">
              {filteredResults}
            </div>
          )}
        </div>
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -500, opacity: 0 }}
        animate={{
          x: sidebar ? 0 : -500,
          opacity: sidebar ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 z-50 w-full h-screen text-black bg-[#131921] bg-opacity-50 ${
          sidebar ? "" : "hidden"
        }`}
      >
        <div className="w-full h-full relative flex justify-between">
          <div
            ref={ref}
            className="w-[350px] h-full bg-white border border-black"
          >
            <Link
              href="/user/login"
              className="w-full bg-[#232F3E] text-white py-2 pl-2 flex items-center gap-4"
            >
              <CgProfile size={24} />
              <h3 className="font-semibold text-lg tracking-wide">Sign In</h3>
            </Link>

            <SideNavContent
              categories={categories}
              sidebar={sidebar}
              setSidebar={setSidebar}
            />

            <span
              onClick={() => setSidebar(false)}
              className="absolute top-0 left-[360px] w-10 h-10 text-black flex items-center justify-center border bg-gray-200 hover:bg-red-500 hover:text-white duration-300 cursor-pointer"
            >
              <XIcon />
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const SideNavContent = ({ categories, sidebar, setSidebar }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  return (
    <div className={`relative z-20 ${sidebar ? "" : "hidden"}`}>
      <div className="absolute w-[330px]">
        <div className="bg-white shadow-sm rounded-md pr-0 z-50 left-4 mt-2">
          {categories?.map((category) => (
            <div key={category._id} className="border-b">
              <div
                onClick={() => {
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  );
                  setSelectedSubcategory(null);
                }}
                className="flex items-center justify-between cursor-pointer hover:bg-zinc-200 px-2 py-3"
              >
                <h3>{category.name}</h3>
                {selectedCategory === category ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {selectedCategory === category && (
                <ul>
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory._id} className="ml-4 mb-2">
                      <div
                        onClick={() =>
                          setSelectedSubcategory(
                            selectedSubcategory === subcategory
                              ? null
                              : subcategory
                          )
                        }
                        className="flex items-center justify-between cursor-pointer my-4"
                      >
                        <h3>{subcategory.name}</h3>
                        {selectedSubcategory === subcategory ? (
                          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                        )}
                      </div>

                      {selectedSubcategory === subcategory && (
                        <ul className="ml-4">
                          {subcategory.subsubcategories.map((subsubcategory) => (
                            <li
                              key={subsubcategory._id}
                              className="my-2 cursor-pointer hover:bg-slate-100 p-2"
                              onClick={() => setSidebar(false)}
                            >
                              <Link
                                href={`/category/${category.slug}/${subcategory.slug}/${subsubcategory.slug}`}
                              >
                                {subsubcategory.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
