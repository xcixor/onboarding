import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}
const MaxWidthWrapper = ({ children, className }: Props) => {
  return (
    <div className={cn("mx-auto w-full max-w-screen-xl", className)}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
