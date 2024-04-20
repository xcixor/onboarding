import ResendEmailForm from "@/components/auth/PasswordResetLinkEmailForm";

const page = async () => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-md p-4  shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
      <ResendEmailForm />
    </div>
  );
};

export default page;
