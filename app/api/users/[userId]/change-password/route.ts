import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { getLoggedInUser } from "@/lib/auth/utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const user = await getLoggedInUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 403 });
  }

  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    const existingUser = await db.user.findUnique({
      where: { id: params.userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "That user was not found." },
        { status: 404 },
      );
    }

    const match = await bcrypt.compare(oldPassword, existingUser.password);
    if (!match) {
      return NextResponse.json(
        { message: "Unauthorized. Your old password doesn't match!" },
        { status: 403 },
      );
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashPassword,
      },
    });

    return NextResponse.json(
      { message: "Password changed successfuly." },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
