import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getLatestFileMetaData } from "@/actions/get-latest-file-metadata";

export type SessionUser = Session["user"];

export const getLoggedInUser = async (): Promise<SessionUser | null> => {
  const session = await getServerSession(options);
  const user = session?.user;
  if (user) {
    if (user?.registeredUser) {
      const image = await getLatestFileMetaData(user?.id);
      user.image = image?.downloadUrl;
    }
    return user;
  }
  return null;
};
