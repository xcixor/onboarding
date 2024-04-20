"use client";
import { Notification } from "@prisma/client";
import { Circle, Ghost, Trash2 } from "lucide-react";
import React, { useEffect } from "react";

type Props = {
  allNotifications: Notification[] | null;
  userId: string | null | undefined;
};

function getTimeDifference(date: Date) {
  date = new Date(date);
  if (date) {
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - date.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const weeksDiff = Math.floor(daysDiff / 7);
    const monthsDiff =
      currentDate.getMonth() +
      1 -
      (date.getMonth() + 1) +
      12 * (currentDate.getFullYear() - date.getFullYear());
    const yearsDiff = currentDate.getFullYear() - date.getFullYear();

    if (yearsDiff) {
      if (yearsDiff > 1) {
        return `${yearsDiff} years ago`;
      }
      return `${yearsDiff} year ago`;
    }
    if (monthsDiff) {
      if (monthsDiff > 1) {
        return `${monthsDiff} months ago`;
      }
      return `${monthsDiff} month ago`;
    }
    if (weeksDiff) {
      if (weeksDiff > 1) {
        return `${weeksDiff} weeks ago`;
      }
      return `${weeksDiff} week ago`;
    }
    if (daysDiff) {
      if (daysDiff > 1) {
        return `${daysDiff} days ago`;
      }
      return `${daysDiff} day ago`;
    }
    if (hoursDiff) {
      if (hoursDiff > 1) {
        return `${hoursDiff} hours ago`;
      }
      return `${hoursDiff} hour ago`;
    }
    if (minutesDiff) {
      if (minutesDiff > 1) {
        return `${minutesDiff} minutes ago`;
      }
      return `${minutesDiff} minute ago`;
    }
  }
}

const NotificationList = ({ allNotifications, userId }: Props) => {
  useEffect(() => {
    if (userId) {
      try {
        fetch(`/api/notifications/${userId}/read/`, {
          method: "PATCH",
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [userId]);
  if (!allNotifications) {
    return (
      <div className="flex flex-col items-center justify-center p-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <Ghost className="h-8 w-8" />
        <p>You do not have any notifications at the moment.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {allNotifications.map((notification) => (
        <div
          key={notification.id}
          className="p-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
        >
          <div className="flex justify-between">
            <h2 className="font-bold">{notification.title}</h2>
            {notification.isRead ? (
              <Trash2 className="text-zinc-500" />
            ) : (
              <Circle className="h-4 w-4 animate-ping" />
            )}
          </div>
          <p>{notification.message}</p>
          <p>{getTimeDifference(notification.createdAt)}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
