import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { Notification } from "@prisma/client";
import { Bell, BellDot, Loader2 } from "lucide-react";

type Props = {
  userId: string;
};

const Notifications = ({ userId }: Props) => {
  const url = `/api/notifications/${userId}/read/`;

  const { data, isLoading, error } = useSWR(url, fetcher);
  const unReadNotifications = data as Notification[];

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }
  if (
    (unReadNotifications && unReadNotifications.length <= 0) ||
    !unReadNotifications
  ) {
    return (
      <Bell className="cursor-pointer text-pes-blue hover:text-pes-red" />
    );
  }
  if (unReadNotifications && unReadNotifications.length > 0) {
    return (
      <BellDot className="cursor-pointer text-pes-blue hover:text-pes-red" />
    );
  }
};

export default Notifications;