import GitHubProvider, { GithubProfile } from "next-auth/providers/github";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";
import { Account, Profile, Session } from "next-auth";
import { env } from "@/lib/env";
import { db } from "@/lib/db";
import { User as NextAuthUser } from "next-auth";
import { Role } from "@prisma/client";
import { AdapterUser } from "next-auth/adapters";

interface CustomSessionCallbackData {
  session: Session;
  token: JWT;
}

type CustomJwtCallbackData = {
  token: JWT;
  user: Session["user"] | null;
  account: Account | null;
  profile?: (Profile & { picture?: string }) | undefined;
};

type CustomNextAuthUser = NextAuthUser & {
  isVerified: boolean;
};

type CustomGoogleProfile = GoogleProfile & {
  emailVerified: Date | null;
};

type CustomGithubProfile = GithubProfile & {
  emailVerified: Date | null;
};
let userRole: Role;
export const options = {
  providers: [
    GoogleProvider({
      profile(profile: CustomGoogleProfile) {
        userRole = Role.USER;
        return {
          ...profile,
          role: userRole,
          id: profile.sub,
          isVerified: true,
          registeredUser: false,
        };
      },
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "text",
          placeholder: "your-email",
        },
        password: {
          label: "password:",
          type: "password",
          placeholder: "your-password",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            return null;
          }
          const foundUser = await db.user.findUnique({
            where: { email: credentials?.email },
          });

          if (foundUser) {
            const match = await bcrypt.compare(
              credentials.password,
              foundUser.password!!,
            );

            if (match) {
              if (
                foundUser.email === env.ADMIN_EMAIL &&
                foundUser.role !== Role.ADMIN
              ) {
                const updatedUser = await db.user.update({
                  where: { id: foundUser.id },
                  data: { role: Role.ADMIN },
                });
                const { password, ...userWithoutPassword } = updatedUser;
                return { ...userWithoutPassword, registeredUser: true };
              }
              const { password, ...userWithoutPassword } = foundUser;
              return { ...userWithoutPassword, registeredUser: true };
            }
          } else {
            return null;
          }
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile, account }: CustomJwtCallbackData) {
      if (user) {
        token.isVerified = user.isVerified;
        token.registeredUser = user.registeredUser;
        token.role = user.role;
      }
      if (profile && account?.provider === "google")
        token.image = profile?.picture;
      return token;
    },

    async session({ session, token }: CustomSessionCallbackData) {
      session.user.image = token.image;
      session.user.registeredUser = token.registeredUser;
      if (session?.user) {
        const sessionUser = await db.user.findUnique({
          where: { email: session.user.email!! },
          include: { profile: true },
        });
        session.user.id = sessionUser?.id!!;
        session.user.firstName = sessionUser?.profile?.firstName as string;
        session.user.lastName = sessionUser?.profile?.lastName as string;
        session.user.role = sessionUser?.role;
      }

      return session;
    },
    signIn: async (params: {
      user: AdapterUser | CustomNextAuthUser;
      account: Account | null;
      profile?: Profile;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, any>;
    }): Promise<string | true> => {
      if (params.user.isVerified) {
        return true;
      } else {
        return `/auth/unverified-email?u=${params.user.id}`;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
