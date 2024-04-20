import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    const existingUser = await db.user.findUnique({ where: { email: email } });

    if (!existingUser) {
      return NextResponse.json(
        { message: "That user was not found." },
        { status: 404 },
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

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
