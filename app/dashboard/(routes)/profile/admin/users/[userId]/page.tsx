import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getLoggedInUser } from "@/lib/auth/utils";
import React from "react";
import UserComponent from "@/components/dashboard/admin/users/userId/User";
import { Role } from "@prisma/client";
import VerifyUser from "@/components/dashboard/admin/users/userId/VerifyUser";

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
    return (
      <div className="space-y-4 p-6">
        <UserComponent user={userToManage} />
        {!userToManage.isVerified && (
          <div>
            {!userToManage.verifyToken ? (
              <div className="space-y-2 rounded-md bg-slate-100 p-4">
                <p className="text-sm italic text-foreground text-red-500">
                  PS: This user is not verified
                </p>
                <VerifyUser userId={userToManage.id} />
              </div>
            ) : (
              <div className="space-y-2 rounded-md bg-slate-100 p-4">
                <p className="text-sm italic text-muted-foreground">
                  PS: Verification email has been sent to {userToManage.email}{" "}
                  but they are yet to verify.
                </p>
                <VerifyUser userId={userToManage.id} isResending={true} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  return <div>User not found</div>;
};

export default page;
