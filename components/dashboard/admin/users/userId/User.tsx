import { Profile, User } from "@prisma/client";
import React from "react";
import UserTypeForm from "./UserTypeForm";
import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  user: User & { profile: Profile };
};

const UserComponent = ({ user }: Props) => {
  const translate = useTranslations("UserComponent");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{translate("manageUser")}</h1>
        <Settings className="text-pes-blue" />
      </div>
      <div className="space-y-2 md:w-1/2">
        <div className="rounded-md bg-slate-100 p-4">
          {user.profile?.firstName}&nbsp;{user.profile?.lastName}
        </div>
        <div className="rounded-md bg-slate-100 p-4">{user.email}</div>
      </div>
      <div>
        <UserTypeForm initialData={user} />
      </div>
    </div>
  );
};

export default UserComponent;
