import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./DataTable";
import { columns } from "./Columns";
import { getLoggedInUser } from "@/lib/auth/utils";

const CoursesPage = async () => {
  const user = await getLoggedInUser();
  const userId = user?.id;

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
