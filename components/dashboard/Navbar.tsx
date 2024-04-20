import NavbarRoutes from "@/components/navbar/NavbarRoutes";

import { MobileSidebar } from "@/components/navbar/MobileSidebar";
import { getLoggedInUser } from "@/lib/auth/utils";

export const Navbar = async () => {
  const user = await getLoggedInUser();
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes user={user} />
    </div>
  );
};
