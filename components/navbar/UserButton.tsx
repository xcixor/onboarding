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
import { ChevronDown, LogIn, LogOut, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UserMenuButtonProps {
  user: SessionUser | null;
}

export default function UserMenuButton({ user }: UserMenuButtonProps) {
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
                className="w-10 rounded-full"
              />
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="space-y-2">
            <DropdownMenuLabel>Hi, {user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard">Profile</Link>
            </DropdownMenuItem>
            <Button
              size="sm"
              variant="default"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button className="hover:bg-pes-red" size="sm" variant="default" onClick={() => signIn()}>
            <LogIn className="mr-2 h-4 w-4" /> LogIn
          </Button>
          <Link href="/auth/signup">
            <p className="cursor-pointer relative block w-fit after:absolute after:block after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:bg-pes-red after:transition after:duration-300 after:content-[''] hover:text-pes-red after:hover:scale-x-100">
              Signup
            </p>
          </Link>
        </>
      )}
    </>
  );
}