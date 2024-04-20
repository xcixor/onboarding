import ResendEmail from "@/components/auth/ResendEmail";
import { db } from "@/lib/db";
import { Mail } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Record<"t", string>;
};
const page = async (props: Props) => {
  const user = await db.user.findUnique({
    where: {
      id: props.searchParams?.t,
    },
  });

  if (!user) {
    return notFound();
  }
  return (
    <div className="flex w-full flex-col gap-4 rounded-md p-4  shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
      <Mail className="h-8 w-8  text-green-500" />
      <h2 className="text-2xl font-bold text-primary">Almost there!</h2>
      <p className="text-primary">
        Please check your inbox and follow the link to activate your account
      </p>
      <div>
        <ResendEmail toEmail={user.email} />
      </div>
    </div>
  );
};

export default page;
