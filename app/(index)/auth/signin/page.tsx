import Login from "@/components/auth/Login";
import { getLoggedInUser } from "@/lib/auth/utils";
import { redirect } from "next/navigation";

type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

const page = async (props: Props) => {
  const user = await getLoggedInUser();
  if (user) {
    return redirect("/dashboard");
  }
  return (
    <div className="flex w-full flex-col gap-4 rounded-md p-4  shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
      <Login
        error={props.searchParams?.error}
        callbackUrl={props.searchParams?.callbackUrl}
      />
    </div>
  );
};

export default page;
