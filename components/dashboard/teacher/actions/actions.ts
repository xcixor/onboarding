import { NOTIFICATION_TYPES } from "@/constants";
import toast from "react-hot-toast";

export const sendCourseNotifications = async (courseId: string) => {
  try {
    const data = {
      title: "New Arrival",
      type: NOTIFICATION_TYPES.INFO,
    };
    const response = await fetch(`/api/courses/${courseId}/notify-students`, {
      body: JSON.stringify(data),
      method: "POST",
    });
    const responseData = await response.json();
    if (response.ok) {
      toast.success("Notification sent.");
    } else {
      toast.error(responseData.message);
    }
  } catch {
    toast.error("Something went wrong");
  }
};
