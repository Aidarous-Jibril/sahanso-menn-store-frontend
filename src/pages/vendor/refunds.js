import AllRefundsPage from "@/components/vendor/AllRefundsPage";
import DashboardHeader from "@/components/vendor/layout/DashboardHeader";
import DashboardSideBar from "@/components/vendor/layout/DashboardSideBar";
import withVendorAuth from "@/lib/withVendorAuth";

const VendorAllRefundsPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden bg-gray-100">
        <div className="w-[100px] 800px:w-[330px] bg-white  ">
          <DashboardSideBar active={11} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <AllRefundsPage />
        </div>
      </div>
    </div>
  );
};

export default withVendorAuth(VendorAllRefundsPage);

