import DashboardHeader from "@/components/vendor/layout/DashboardHeader";
import DashboardSideBar from "@/components/vendor/layout/DashboardSideBar";
import VendorBankInfo from "@/components/vendor/VendorBankInfo";

const BankInfoPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="w-full flex justify-between items-start min-h-screen">
        <div className="w-[100px] 800px:w-[330px] h-screen">
          <DashboardSideBar active={8} />
        </div>

        <div className="w-full flex justify-center">
          <VendorBankInfo />
        </div>
      </div>
    </div>
  );
};

export default BankInfoPage;
