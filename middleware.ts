import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export default withAuth(
  function middleware(req) {
    if (
      req.nextUrl.pathname.includes("/admin") &&
      !(req.nextauth?.token?.role === Role.ADMIN)
    ) {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }
    if (
      req.nextUrl.pathname.includes("/instructor") &&
      !(req.nextauth?.token?.role === Role.COACH)
    ) {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }
    if (!req.nextauth?.token?.isVerified) {
      return NextResponse.rewrite(new URL("/auth/unverified-email", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/admin", "/dashboard/:path*"],
};
