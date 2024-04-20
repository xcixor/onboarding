"use client";
import { Profile, User } from "@prisma/client";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import toast from "react-hot-toast";

type Props = {
  calendlyURL: string;
  client: User & { profile: Profile };
};

const CalendlyWidget = ({ calendlyURL, client }: Props) => {
  const prefill = {
    email: client.email,
    firstName: client.profile?.firstName,
    lastName: client.profile?.lastName,
    name: `${client.profile?.firstName} ${client.profile?.lastName}`,
  };

  useCalendlyEventListener({
    onEventScheduled: async (e) => {
      console.log(e.data.payload);
      const response = await fetch("/api/sessions/", {
        method: "POST",
        body: JSON.stringify({
          clientId: client.id,
          eventURI: e.data.payload.event.uri,
          inviteeURI: e.data.payload.invitee.uri,
          title: `New Event: ${prefill.name}`,
        }),
      });
      if (response.ok) {
        toast.success("Event scheduled");
        const { sessionId } = await response.json();
        window.location.assign(`/dashboard/teacher/sessions/${sessionId}`);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <div className="inline-widget">
      <InlineWidget url={calendlyURL} prefill={prefill} />
    </div>
  );
};

export default CalendlyWidget;
