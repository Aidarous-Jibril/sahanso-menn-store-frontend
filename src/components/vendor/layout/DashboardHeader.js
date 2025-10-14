import React, { useEffect, useState } from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineDashboard } from "react-icons/md";
import { FiPackage, FiShoppingBag, FiTrash } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import Link from "next/link";
import { CiBank, CiMoneyBill, CiSettings } from "react-icons/ci";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";
import { BsAlexa } from "react-icons/bs";
import { IoIosAddCircle, IoMdAdd } from "react-icons/io";
import {
  deleteVendorNotification,
  fetchVendorNotificationCount,
  fetchVendorNotifications,
  logoutVendor,
  markVendorNotificationAsRead,
} from "@/redux/slices/vendorSlice";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { FaBell } from "react-icons/fa";
import Image from "next/image";

const DashboardHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentPath = router.pathname;

  const { vendorInfo, notificationCount, notifications } = useSelector(
    (state) => state.vendors
  );
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchVendorNotificationCount());
  }, [dispatch]);

  const toggleNotifications = async () => {
    const newState = !showDropdown;
    setShowDropdown(newState);

    if (newState) {
      const result = await dispatch(fetchVendorNotifications());
      if (result?.payload?.length > 0) {
        result.payload.forEach((notification) => {
          if (!notification.isRead) {
            dispatch(markVendorNotificationAsRead(notification._id));
          }
        });
      }
    }
  };

  const handleVendorLogout = async () => {
    try {
      const result = await dispatch(logoutVendor());

      if (result.type === "vendor/logoutVendor/fulfilled") {
        toast.success("You have logged out successfully!");
        router.push("/vendor/login");
      } else {
        toast.error("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("An unexpected error occurred during logout.");
    }
  };

  const isActive = (path) => (currentPath === path ? "crimson" : "#555");

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      {/* Logo */}
      <Image
        src="/logo.svg"
        alt="Store Logo"
        width={140}
        height={80}
        priority
        className="cursor-pointer"
      />

      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link href="/vendor/dashboard">
            <MdOutlineDashboard
              size={25}
              className="mx-5 cursor-pointer hidden lg:block"
              color={isActive("/vendor/dashboard")}
            />
          </Link>
          <Link href="/vendor/orders">
            <FiShoppingBag
              size={25}
              className="mx-5 cursor-pointer hidden lg:block"
              color={isActive("/vendor/orders")}
            />
          </Link>
          <Link href="/vendor/products">
            <FiPackage
              size={25}
              className="mx-5 cursor-pointer hidden lg:block"
              color={isActive("/vendor/products")}
            />
          </Link>
          <Link href="/vendor/create-product">
            <IoMdAdd
              size={28}
              className="mx-5 cursor-pointer hidden lg:block"
              color={isActive("/vendor/create-product")}
            />
          </Link>
          <Link href="/vendor/sales">
            <BsAlexa
              size={25}
              className="mx-5 cursor-pointer hidden lg:block"
              color={isActive("/vendor/sales")}
            />
          </Link>
          <Link href="/vendor/create-flash-sale">
            <IoIosAddCircle
              size={25}
              className="mx-5 cursor-pointer hidden lg:block"
              color={isActive("/vendor/create-flash-sale")}
            />
          </Link>
          <Link href="/vendor/withdraw">
            <CiMoneyBill
              size={28}
              className="mx-5 cursor-pointer hidden lg:block"
              color={isActive("/vendor/withdraw")}
            />
          </Link>
          <Link href="/vendor/bank-info">
            <CiBank
              size={25}
              className="mx-5 cursor-pointer hidden lg:block"
              color={isActive("/vendor/bank-info")}
            />
          </Link>
          <Link href="/vendor/inbox">
            <BiMessageSquareDetail
              size={25}
              className="mx-5 cursor-pointer hidden lg:block"
              color={isActive("/vendor/inbox")}
            />
          </Link>
          <Link href="/vendor/coupons">
            <AiOutlineGift
              size={25}
              className="mx-5 cursor-pointer hidden lg:block"
              color={isActive("/vendor/coupons")}
            />
          </Link>
          <Link href="/vendor/refunds">
            <HiOutlineReceiptRefund
              size={25}
              className="mx-5 cursor-pointer hidden lg:block"
              color={isActive("/vendor/refunds")}
            />
          </Link>
          <Link href="/vendor/settings">
            <CiSettings
              size={26}
              className="mx-5 cursor-pointer hidden lg:block"
              color={isActive("/vendor/settings")}
            />
          </Link>

          {/* 🔔 Notification Bell */}
          <div
            className="relative mx-5 cursor-pointer hidden lg:block"
            onClick={toggleNotifications}
          >
            <FaBell size={22} className="text-green-600" />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notificationCount}
              </span>
            )}

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-[260px] bg-white shadow-lg rounded-md border border-gray-200 z-50">
                <div className="px-4 py-2 font-semibold border-b">Notifications</div>
                {notifications?.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <span>{n.message}</span>
                      <button
                        onClick={() => dispatch(deleteVendorNotification(n._id))}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Notification"
                      >
                        <FiTrash size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleVendorLogout}
            className="mx-5 cursor-pointer hidden lg:block bg-transparent border-none"
          >
            <LuLogOut size={25} color="#555" />
          </button>

          <Link href={`/vendor/settings`}>
            <Image
              src={vendorInfo?.avatar?.url || "/images/store-backup.png"}
              alt="Store Avatar"
              width={50}
              height={50}
              className="rounded-full object-cover"
              sizes="50px"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
