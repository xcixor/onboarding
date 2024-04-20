import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Signup from "@/components/auth/Signup";

const page = () => {
  return (
    <div className="w-full rounded-md p-4 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
      <h2 className="font-bold text-2xl text-pes-red">Join us today</h2>
      <Signup />
    </div>
  );
};

export default page;