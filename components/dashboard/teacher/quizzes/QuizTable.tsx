import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./DataTable";
import { columns } from "./Columns";
import { getLoggedInUser } from "@/lib/auth/utils";
import { Quiz } from "@prisma/client";

const CoursesPage = async () => {
  const user = await getLoggedInUser();
  const userId = user?.id;

  if (!userId) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    include: { quizzes: true },
  });

  const quizList: Quiz[] = [];

  courses.forEach((course) => {
    course.quizzes.forEach((quiz) => {
      quizList.push(quiz);
    });
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={quizList} />
    </div>
  );
};

export default CoursesPage;
