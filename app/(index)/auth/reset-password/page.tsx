import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Record<"email", string>;
};
const page = async (props: Props) => {
  if (!props.searchParams.email) {
    return notFound();
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 p-8 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
        <ResetPasswordForm email={props.searchParams.email} />
      </div>
    </div>
  );
};

export default page;
