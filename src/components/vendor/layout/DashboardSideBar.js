import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";
import { CiBank, CiMoneyBill, CiSettings } from "react-icons/ci";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logoutVendor } from "@/redux/slices/vendorSlice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { BsAlexa } from "react-icons/bs";
import { IoIosAddCircle, IoMdAdd } from "react-icons/io";

const DashboardSideBar = ({ active }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  //logout vendor
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

  return (
    <div className="w-full h-[94vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10 flex flex-col justify-between">
      <div className="flex-grow">
        {/* Sidebar Items */}
        <div className="w-full flex items-center p-4">
          <Link href="/vendor/dashboard" className="w-full flex items-center">
            <MdOutlineDashboard
              size={30}
              color={`${active === 1 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-2 text-[18px] font-[400] ${
                active === 1 ? "text-[crimson]" : "text-[#555]"
              } hidden 800px:block`}
            >
              Dashboard
            </h5>
          </Link>
        </div>
        <div className="w-full flex items-center p-4">
          <Link href="/vendor/orders" className="w-full flex items-center">
            <FiShoppingBag
              size={30}
              color={`${active === 2 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-2 text-[18px] font-[400] ${
                active === 2 ? "text-[crimson]" : "text-[#555]"
              } hidden 800px:block`}
            >
              Orders
            </h5>
          </Link>
        </div>
        <div className="w-full flex items-center p-4">
          <Link href="/vendor/products" className="w-full flex items-center">
            <FiPackage
              size={30}
              color={`${active === 3 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-2 text-[18px] font-[400] ${
                active === 3 ? "text-[crimson]" : "text-[#555]"
              } hidden 800px:block`}
            >
              Products
            </h5>
          </Link>
        </div>
        <div className="w-full flex items-center p-4">
          <Link
            href="/vendor/create-product"
            className="w-full flex items-center"
          >
            <IoMdAdd size={30} color={`${active === 4 ? "crimson" : "#555"}`} />
            <h5
              className={`pl-2 text-[18px] font-[400] ${
                active === 4 ? "text-[crimson]" : "text-[#555]"
              } hidden 800px:block`}
            >
              Create Product
            </h5>
          </Link>
        </div>
        <div className="w-full flex items-center p-4">
          <Link href="/vendor/sales" className="w-full flex items-center">
            <BsAlexa size={30} color={`${active === 5 ? "crimson" : "#555"}`} />
            <h5
              className={`pl-2 text-[18px] font-[400] ${
                active === 5 ? "text-[crimson]" : "text-[#555]"
              } hidden 800px:block`}
            >
              Sales
            </h5>
          </Link>
        </div>
        <div className="w-full flex items-center p-4">
          <Link
            href="/vendor/create-flash-sale"
            className="w-full flex items-center"
          >
            <IoIosAddCircle
              size={30}
              color={`${active === 6 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-2 text-[18px] font-[400] ${
                active === 6 ? "text-[crimson]" : "text-[#555]"
              } hidden 800px:block`}
            >
              Create Sale
            </h5>
          </Link>
        </div>
        <div className="w-full flex items-center p-4">
          <Link href="/vendor/withdraw" className="w-full flex items-center">
            <CiMoneyBill
              size={30}
              color={`${active === 7 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-2 text-[18px] font-[400] ${
                active === 7 ? "text-[crimson]" : "text-[#555]"
              } hidden 800px:block`}
            >
              Withdraw Money
            </h5>
          </Link>
        </div>
        <div className="w-full flex items-center p-4">
          <Link href="/vendor/bank-info" className="w-full flex items-center">
            <CiBank size={30} color={`${active === 8 ? "crimson" : "#555"}`} />
            <h5
              className={`pl-2 text-[18px] font-[400] ${
                active === 8 ? "text-[crimson]" : "text-[#555]"
              } hidden 800px:block`}
            >
              Bank
            </h5>
          </Link>
        </div>
        <div className="w-full flex items-center p-4">
          <Link href="/vendor/inbox" className="w-full flex items-center">
            <BiMessageSquareDetail
              size={30}
              color={`${active === 9 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-2 text-[18px] font-[400] ${
                active === 9 ? "text-[crimson]" : "text-[#555]"
              } hidden 800px:block`}
            >
              Inbox
            </h5>
          </Link>
        </div>
        <div className="w-full flex items-center p-4">
          <Link href="/vendor/coupons" className="w-full flex items-center">
            <AiOutlineGift
              size={30}
              color={`${active === 10 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-2 text-[18px] font-[400] ${
                active === 10 ? "text-[crimson]" : "text-[#555]"
              } hidden 800px:block`}
            >
              Coupons
            </h5>
          </Link>
        </div>
        <div className="w-full flex items-center p-4">
          <Link href="/vendor/refunds" className="w-full flex items-center">
            <HiOutlineReceiptRefund
              size={30}
              color={`${active === 11 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-2 text-[18px] font-[400] ${
                active === 11 ? "text-[crimson]" : "text-[#555]"
              } hidden 800px:block`}
            >
              Refunds
            </h5>
          </Link>
        </div>
        <div className="w-full flex items-center p-4">
          <Link href="/vendor/settings" className="w-full flex items-center">
            <CiSettings
              size={30}
              color={`${active === 12 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-2 text-[18px] font-[400] ${
                active === 12 ? "text-[crimson]" : "text-[#555]"
              } hidden 800px:block`}
            >
              Settings
            </h5>
          </Link>
        </div>
      </div>

      {/* Logout Button */}
      <div className="w-full flex items-center p-4">
        <button
          onClick={handleVendorLogout}
          className="w-full flex items-center cursor-pointer bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300"
        >
          <LuLogOut size={30} className="text-white" />
          <h5 className="pl-2 text-[18px] font-[400] hidden 800px:block">
            Logout
          </h5>
        </button>
      </div>
    </div>
  );
};

export default DashboardSideBar;
