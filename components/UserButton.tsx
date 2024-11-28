"use client";

import profilePicPlaceholder from "@/assets/profile-pic-placeholder.png";
import { SessionUser } from "@/lib/auth/utils";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface UserMenuButtonProps {
  user: SessionUser | null;
}

export default function UserMenuButton({ user }: UserMenuButtonProps) {
  const translate = useTranslations("UserMenuButton");

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center">
              <Image
                src={user?.image || profilePicPlaceholder}
                alt="Profile picture"
                width={40}
                height={40}
                className="inline-block h-[40px] w-[40px] rounded-full object-cover"
              />
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[10000] space-y-2">
            <DropdownMenuLabel>
              {translate("hi")}, {user?.firstName || user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard">{translate("dashboard")}</Link>
            </DropdownMenuItem>
            <Button
              size="sm"
              variant="default"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" /> {translate("logout")}
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button
            className="hover:bg-pes-red"
            size="sm"
            variant="default"
            onClick={() => signIn()}
          >
            <LogIn className="mr-2 h-4 w-4" /> {translate("login")}
          </Button>
          <Link href="/auth/signup">
            <p className="relative block w-fit cursor-pointer after:absolute after:block after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:bg-pes-red after:transition after:duration-300 after:content-[''] hover:text-pes-red after:hover:scale-x-100">
              {translate("signup")}
            </p>
          </Link>
        </>
      )}
    </>
  );
}
