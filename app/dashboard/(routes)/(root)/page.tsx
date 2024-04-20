import { redirect } from "next/navigation";
import DashboardSkeleton from "@/components/dashboard/root/DashboardSkeleton";
import dynamic from "next/dynamic";
import { getLoggedInUser } from "@/lib/auth/utils";

const DashboardPageCustomLoading = dynamic(
  () => import("@/components/dashboard/root/DashboardPageWrapper"),
  {
    loading: () => <DashboardSkeleton />,
  },
);

export default async function Dashboard() {
  const user = await getLoggedInUser();
  const userId = user?.id;

  if (!userId) {
    redirect("/");
  }
  return <DashboardPageCustomLoading userId={userId} />;
}
