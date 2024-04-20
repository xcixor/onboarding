import { getLoggedInUser } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const user = await getLoggedInUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 403 });
  }

  const values = await req.json();
  try {
    const user = await db.user.findUnique({
      where: {
        id: params.userId,
      },
      include: { profile: true },
    });

    if (!user) {
      return new NextResponse("User not found.", { status: 404 });
    }
    let updatedProfile;
    if (user.profile) {
      updatedProfile = await db.profile.update({
        where: {
          id: user.profile.id,
        },
        data: {
          ...values,
        },
      });
    } else {
      const updatedValues = { ...values, userId: user.id };
      updatedProfile = await db.profile.create({
        data: {
          ...updatedValues,
        },
      });
    }

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.log("[USER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
