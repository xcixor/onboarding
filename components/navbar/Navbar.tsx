import { MobileSidebar } from "./MobileSidebar";
import NavbarRoutes from "./NavbarRoutes";
import { getLoggedInUser } from "@/lib/auth/utils";

export const Navbar = async () => {
  const user = await getLoggedInUser();

  return (
    <div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      {/* <MobileSidebar /> */}
      <NavbarRoutes user={user} />
    </div>
  );
};
