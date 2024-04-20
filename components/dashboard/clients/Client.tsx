import profilePicPlaceholder from "@/assets/profile-pic-placeholder.png";
import { ClientCoach, Profile, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CheckCircle, ExternalLink, RefreshCcw } from "lucide-react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import ConfirmClient from "./ConfirmClient";

type Props = {
  client: ClientCoach;
};
export const dynamic = "force-dynamic";
const Client = async ({ client }: Props) => {
  const clientProfile = await db.user.findUnique({
    where: { id: client.clientId },
    include: { profile: true },
  });

  const confirmRequest = async () => {
    await db.clientCoach.update({
      where: { id: client.id },
      data: { isConfirmed: true },
    });
  };

  return (
    <div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
      <div className="relative aspect-video w-full overflow-hidden rounded-md">
        <Image
          fill
          className="object-cover"
          alt={clientProfile.profile?.firstName}
          src={clientProfile?.image || profilePicPlaceholder}
        />
      </div>
      <div className="flex flex-col gap-2 pt-2">
        <div className="line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base">
          {clientProfile.profile?.firstName}&nbsp;
          {clientProfile.profile?.lastName}
        </div>
        <div className="line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base">
          <p className="text-xs font-semibold"> {clientProfile.email}</p>
        </div>
        <div className="flex flex-col gap-2">
          {client.isConfirmed ? (
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <p className="text-xs font-semibold">Client Confirmed</p>
            </span>
          ) : (
            <ConfirmClient id={client.id} />
          )}
          <Link href={`/dashboard/teacher/sessions/create/${clientProfile.id}`}>
            <Button variant="link" className="bg-sky-100">
              Schedule Session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Client;
