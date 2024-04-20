import { db } from "@/lib/db";
export const getCurrentEvent = async () => {
  try {
    const event = await db.event.findFirst({
      where: {
        isActive: true,
      },
    });
    if (!event) {
      return null;
    }
    return event;
  } catch (error) {
    console.log("[EVENT_ERROR]", error);
    return null;
  }
};
