import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getLoggedInUser } from "@/lib/auth/utils";
import React from "react";
import UserComponent from "@/components/dashboard/admin/users/userId/User";
import { Role } from "@prisma/client";

type Props = {
  params: {
    userId: string;
  };
};

const page = async ({ params }: Props) => {
  const user = await getLoggedInUser();
  const userId = user?.id;

  if (!userId || !(user.role === Role.ADMIN)) {
    return redirect("/");
  }
  const userToManage = await db.user.findUnique({
    where: { id: params.userId },
    include: {
      profile: true,
    },
  });
  if (userToManage) {
    return <UserComponent user={userToManage} />;
  }
  return <div>User not found</div>;
};

export default page;
