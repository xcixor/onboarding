import { redirect } from "next/navigation";
import { getLoggedInUser } from "@/lib/auth/utils";
import { Role } from "@prisma/client";

export default async function Dashboard() {
  const user = await getLoggedInUser();
  const userId = user?.id;

  if (!userId) {
    redirect("/");
  }

  if (user.role === Role.STAFF) {
    return redirect("/dashboard/profile/staff");
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2">
        Welcome, {user?.firstName} {user?.lastName}. This is your dashboard.
      </p>
    </div>
  );
}
