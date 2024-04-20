import { Ghost } from "lucide-react";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col items-center p-24 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
        <Ghost className="h-8 w-8 animate-pulse" />
        <h2>Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/" className="text-orange-600 underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}
