import { Profile, Session, User } from "@prisma/client";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  session: Session & {
    coach: User & { profile: Profile };
  };
};

const SessionCard = ({ session }: Props) => {
  return (
    <div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
      <p>
        Event By: {session.coach.profile?.firstName} &nbsp;
        {session.coach.profile?.lastName} 
      </p>
      <Link
        href={session.eventURI}
        target="_blank"
        className="flex items-center gap-2 text-sky-500 hover:text-sky-400 hover:underline"
      >
        Event Details <ExternalLink className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default SessionCard;
