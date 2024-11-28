import Image from "next/image";

export const LogoBW = () => {
  return (
    <Image
      className="h-[100px] w-auto"
      height={110}
      width={130}
      alt="Private Equity Support Monochrome logo"
      src="/logos/pes-mono-white.png"
    />
  );
};
