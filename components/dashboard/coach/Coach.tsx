import profilePicPlaceholder from "@/assets/profile-pic-placeholder.png";
import { ClientCoach, Profile, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import RequestCoach from "./RequestCoach";
import { CheckCircle, ExternalLink, Link2, RefreshCcw } from "lucide-react";
import { getLatestFileMetaData } from "@/actions/get-latest-file-metadata";
import { Button } from "@/components/ui/button";

type Props = {
  coach: User & { profile: Profile };
  myCoaches: ClientCoach[];
};

const Coach = async ({ coach, myCoaches }: Props) => {
  const imageMetaData = await getLatestFileMetaData(coach.id);

  const checkIsMyCoach = (id) => {
    return myCoaches.some((coach) => coach.coachId === id && coach.isConfirmed);
  };
  const checkIsPendingRequest = (id) => {
    return myCoaches.some(
      (coach) => coach.coachId === id && !coach.isConfirmed,
    );
  };

  return (
    <div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
      <div className="relative aspect-video w-full overflow-hidden rounded-md">
        <Image
          fill
          className="object-cover"
          alt={coach.profile?.firstName}
          src={imageMetaData?.downloadUrl || profilePicPlaceholder}
        />
      </div>
      <div className="flex flex-col pt-2">
        <div className="line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base">
          {coach.profile?.firstName}&nbsp;{coach.profile?.lastName}
        </div>
        <p className="py-2 text-xs text-muted-foreground">
          {checkIsPendingRequest(coach.id) ? (
            <span className="flex items-center gap-3">
              <RefreshCcw className="h-4 w-4 text-green-400" />
              Awaiting confirmation
            </span>
          ) : checkIsMyCoach(coach.id) ? (
            <span className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-400" />
              My Coach
            </span>
          ) : (
            // <RequestCoach coachId={coach.id} />
            <Button>
              <Link href={`/dashboard/coaches/${coach.id}/request/`}>
                Request Coach
              </Link>
            </Button>
          )}
        </p>
        <Link
          href={`/instructor/${coach.id}`}
          target="_blank"
          className="flex items-center gap-2 text-sm text-pes-blue hover:text-pes-red"
        >
          About
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};

export default Coach;
