import ResendEmail from "@/components/auth/ResendEmail";
import { MailWarning } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

type Props = {
  searchParams: Record<"u", string>;
};

const page = async (props: Props) => {
  const userId = props.searchParams.u;
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return notFound();
  }
  return (
    // <div className="flex h-full w-full flex-col items-center justify-center">
    <div className="w-full space-y-4 rounded-md p-4 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
      <MailWarning className="h-8 w-8 text-red-400" />
      <h2 className="text-2xl font-bold text-primary">
        You need to verify your email
      </h2>
      <p className="text-primary">
        We noticed your email address has not been verified. We have sent a
        verification link to your inbox Click on the link to complete the
        verification process. You might need to check your spam folder if you
        can&apos;t see it or click the resend button below.
      </p>
      <ResendEmail toEmail={user.email} />
    </div>
    // </div>
  );
};

export default page;
