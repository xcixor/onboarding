import { CheckCircle2, MailOpen } from "lucide-react";
import { verifyEmail } from "../actions/actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import ResendEmail from "@/components/auth/ResendEmail";

type Props = {
  searchParams: Record<"t", string>;
};
const page = async (props: Props) => {
  const { user, isVerified } = await verifyEmail(props.searchParams.t);
  if (!user) {
    return notFound();
  }

  if (!isVerified) {
    return (
      <div className="flex w-full flex-col gap-4 rounded-md p-4  shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
        <span className="rounded-full bg-white p-2">
          <MailOpen className="h-16 w-16 text-green-400" />
        </span>
        <h2 className="text-2xl font-bold text-primary">
          Looks like that verification link has expired
        </h2>
        <ResendEmail toEmail={user.email} />
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col gap-4 rounded-md p-4  shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
      <span className="rounded-full bg-white p-2">
        <CheckCircle2 className="h-16 w-16 text-green-400" />
      </span>
      <h2 className="text-2xl font-bold text-primary">
        Congratulations, you email has been verified
      </h2>
      <p className="flex items-center">
        <Link href="/auth/signin" className="font-semibold text-primary">
          Click here
        </Link>
        &nbsp; to login
      </p>
    </div>
  );
};

export default page;
