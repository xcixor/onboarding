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
  const { oldEmail, newEmail } = await req.json();
  if (!oldEmail || !newEmail) {
    return NextResponse.json(
      { message: "All fields are required." },
      { status: 400 },
    );
  }
  try {
    const user = await db.user.findUnique({
      where: {
        email: oldEmail,
        id: params.userId,
      },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    const duplicate = await db.user.findUnique({
      where: {
        email: newEmail,
      },
    });

    if (duplicate) {
      return NextResponse.json(
        { message: "Another account with a similar email already exists" },
        { status: 409 },
      );
    }

    // save old email for recovery
    if (user.profile) {
      await db.profile.update({
        where: {
          id: user.profile.id,
        },
        data: {
          oldEmail,
        },
      });
    } else {
      const profileData = { oldEmail: oldEmail, userId: user.id };
      await db.profile.create({
        data: {
          ...profileData,
        },
      });
    }

    // update user data
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { email: newEmail },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log("[USER_ID]", error);
    return NextResponse.json(
      { message: `Internal Error ${error}` },
      { status: 500 },
    );
  }
}
