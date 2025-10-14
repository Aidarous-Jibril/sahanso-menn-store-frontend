import DashboardHeader from "@/components/vendor/layout/DashboardHeader";
import DashboardSideBar from "@/components/vendor/layout/DashboardSideBar";
import VendorWithdraw from "@/components/vendor/VendorWithdraw";

const VendorWithdrawPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="w-full flex justify-between items-start min-h-screen">
        <div className="w-[100px] 800px:w-[330px] h-screen">
          <DashboardSideBar active={7} />
        </div>

        <div className="w-full flex justify-center">
          <VendorWithdraw />
        </div>
      </div>
    </div>
  );
};

export default VendorWithdrawPage;
