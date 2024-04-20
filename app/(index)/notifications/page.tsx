"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import NotificationList from "@/components/notifications/NotificationList";
import { redirect } from "next/navigation";
import { Ghost, Loader2 } from "lucide-react";

const Notifications = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/");
    },
  });
  const url = `/api/notifications/${session?.user.id}/all/`;
  const { data, isLoading, error } = useSWR(url, fetcher);
  const notifications = data as Notification[] | null;

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <Loader2 className="h-4 w-4 animate-spin" />;
      </div>
    );
  }
  if (notifications && notifications.length <= 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <Ghost className="h-8 w-8" />
        <p>You do not have any notifications at the moment.</p>
      </div>
    );
  }
  if (notifications && notifications.length > 0) {
    return (
      <MaxWidthWrapper className="py-4">
        <NotificationList
          userId={session?.user?.id}
          allNotifications={notifications}
        />
      </MaxWidthWrapper>
    );
  }
};

export default Notifications;
