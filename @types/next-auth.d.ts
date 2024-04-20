import { Profile, Role } from "@prisma/client";
import { DefaultSession, User as NextAuthUser } from "next-auth";
import { DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      isVerified: boolean;
      firstName?: string;
      lastName?: string;
      role: Role;
      registeredUser: boolean;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    isVerified: boolean;
    emailVerified: Date | null;
    role: Role;
    registeredUser: boolean;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    isVerified: boolean;
    role: Role;
    image?: string;
    registeredUser: boolean;
  }
}
