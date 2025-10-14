import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { SearchIcon } from "@heroicons/react/solid";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/styles";

import dynamic from "next/dynamic";
import ClientOnly from "../common/ClientOnly";
const Cart = dynamic(() => import("../cart/Cart"), { ssr: false });
const Wishlist = dynamic(() => import("../wishlist/WishList"), { ssr: false });

const HeaderUpper = ({ handleSearchChange, searchData }) => {
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishListItems } = useSelector((state) => state.wishList);

  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // set initial width
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (windowWidth < 768) return null;

  return (
     <ClientOnly>
      <div className="w-full bg-[#131921] text-white px-4 py-2 flex justify-between flex-wrap items-center gap-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Store Logo"
            width={140}
            height={80}
            priority
            className="cursor-pointer"
          />
        </Link>

        {/* Search */}
        <div className="flex flex-1 h-10 max-w-[700px] min-w-[250px] w-full relative mx-4">
          <div className="flex items-center justify-center w-full overflow-hidden rounded-full shadow-sm border border-gray-300 bg-white">
            <input
              onChange={handleSearchChange}
              className="h-full text-base text-[#131921] flex-grow outline-none border-none px-4 bg-white"
              type="text"
              placeholder="Search products..."
            />
            <span className="w-12 h-full flex items-center justify-center bg-[#febd69] hover:bg-[#f3a847] duration-300 text-[#131921] cursor-pointer">
              <SearchIcon width={24} />
            </span>
          </div>

          {searchData?.length > 0 && (
            <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-lg z-50 py-2 max-h-[400px] overflow-y-auto">
              <h3 className="px-4 py-2 text-sm font-semibold text-gray-600">
                Search Results
              </h3>
              {searchData.map((item, index) => (
                <Link href={`/product/${item._id}`} key={index} legacyBehavior>
                  <a className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
                    <Image
                      src={item.images[0]?.url}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="rounded-md w-12 h-12 object-cover mr-4"
                      loading="lazy"
                    />
                    <span className="text-sm text-gray-800">{item.name}</span>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Icons */}
        <div className="flex gap-4">
          {/* Wishlist */}
          <div className={`${styles.normalFlex}`}>
            <div className="relative cursor-pointer" onClick={() => setOpenWishlist(true)}>
              <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
              <span className="absolute top-0 right-0 rounded-full bg-[#3bc177] w-4 h-4 text-white text-[12px] text-center">
                {wishListItems.length}
              </span>
            </div>
          </div>

          {/* Cart */}
          <div className={`${styles.normalFlex}`}>
            <div className="relative cursor-pointer" onClick={() => setOpenCart(true)}>
              <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83%)" />
              <span className="absolute top-0 right-0 rounded-full bg-[#3bc177] w-4 h-4 text-white text-[12px] text-center">
                {cartItems.length}
              </span>
            </div>
          </div>

          {/* Profile */}
          <div className={`${styles.normalFlex}`}>
            <div className="cursor-pointer">
              {userInfo?.avatar?.url ? (
                <Link href="/user/profile" legacyBehavior>
                  <Image
                    src={userInfo?.avatar?.url || "/images/user.svg"}
                    alt="User Avatar"
                    width={35}
                    height={35}
                    className="rounded-full"
                  />
                </Link>
              ) : (
                <Link href="/user/login" legacyBehavior>
                  <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Popups */}
        {openCart && <Cart setOpenCart={setOpenCart} />}
        {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
      </div>
     </ClientOnly>
  );
};

export default HeaderUpper;
