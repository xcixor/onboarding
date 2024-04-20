import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/mailer";
import { EMAILTYPES } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const toEmail = req.nextUrl.searchParams.get("toEmail");
  if (!toEmail) {
    return NextResponse.json(
      { message: "Please provide a valid email address" },
      { status: 500 },
    );
  }
  const user = await db.user.findUnique({ where: { email: toEmail } });

  if (!user) {
    return NextResponse.json(
      { message: "No account was found with that email" },
      { status: 500 },
    );
  }
  try {
    const toEmail = user.email;
    const emailType = EMAILTYPES.EMAILVERIFICATION;
    const userId = user.id;
    const extraArgs = {
      userId: userId,
    };
    const emailVerificationResponse = await sendEmail({
      toEmail,
      emailType,
      extraArgs,
    });
    if (emailVerificationResponse.status === 200) {
      return NextResponse.json({ message: "Success." }, { status: 200 });
    }
    return NextResponse.json(
      { message: emailVerificationResponse.message },
      { status: 200 },
    );
  } catch (error: Error | any) {
    console.log("RESEND_VERIFICATION_EMAIL", error, "500");
    // return NextResponse.json({ message: "Error", error }, { status: 500 });
    return NextResponse.json({ message: error.toString() }, { status: 500 });
  }
}
