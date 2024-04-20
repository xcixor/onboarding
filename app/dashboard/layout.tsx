import { Navbar } from "../../components/dashboard/Navbar";
import { Sidebar } from "../../components/navbar/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 h-[80px] w-full ">
        <Navbar />
      </div>
      <div className="fixed inset-y-0 z-50 mt-[80px] hidden h-full w-56 flex-col md:flex">
        <Sidebar />
      </div>
      <main className="h-full pt-[80px] md:pl-56">{children}</main>
    </div>
  );
};

export default DashboardLayout;
