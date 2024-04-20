import { Ban } from "lucide-react";
import Link from "next/link";

type Props = {};

const Denied = (props: Props) => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col items-center p-24 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
        <Ban className="h-16 w-16 text-red-600" />
        <h2>Stop!</h2>
        <p>You do not have the required permissions to view this page.</p>
        <Link href="/" className="text-orange-600 underline">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default Denied;
