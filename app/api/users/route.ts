import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendEmail } from "@/lib/email/mailer";
import { EMAILTYPES } from "@/constants";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    const duplicate = await db.user.findUnique({ where: { email: email } });

    if (duplicate) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 },
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        password: hashPassword,
        email,
      },
    });
    await db.profile.create({ data: { userId: user.id, firstName, lastName } });
    const emailVerificationResponse = await sendEmail({
      toEmail: email,
      emailType: EMAILTYPES.EMAILVERIFICATION,
      extraArgs: {
        userId: user.id,
      },
    });
    if (emailVerificationResponse.status === 200) {
      return NextResponse.json(
        { message: "User Created.", userId: user.id },
        { status: 201 },
      );
    }
    return NextResponse.json(
      {
        message: "User Created but verificiation email not sent.",
        userId: user.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
