import { redirect } from "next/navigation";
import { DataTable } from "@/components/dashboard/admin/courses/DataTable";
import { columns } from "@/components/dashboard/admin/courses/Columns";
import { getLoggedInUser } from "@/lib/auth/utils";
import { Role } from "@prisma/client";
import { getCoursesWithUserData } from "@/actions/get-all-courses-with-user";
const page = async () => {
  const user = await getLoggedInUser();
  const userId = user?.id;

  if (!userId || !(user.role === Role.ADMIN)) {
    return redirect("/");
  }
  const coursesWithUserData = await getCoursesWithUserData();

  return (
    <div className="p-6">
      <DataTable columns={columns} data={coursesWithUserData} />
    </div>
  );
};

export default page;
