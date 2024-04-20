import { db } from "../db";
import bcrypt from "bcrypt";
import { env } from "../env";
import { EMAILTYPES } from "@/constants";
import { mail } from "./email";

interface Props {
  toEmail: string;
  subject?: string;
  message?: string;
  emailType: EMAILTYPES;
  extraArgs?: {
    userId?: string;
  };
}

export const sendEmail = async ({
  toEmail,
  emailType,
  extraArgs,
  subject,
  message,
}: Props): Promise<{ status: number; message: string }> => {
  try {
    let hashedToken;
    if (extraArgs?.userId) {
      hashedToken = await bcrypt.hash(extraArgs?.userId.toString(), 10);
    }
    switch (emailType) {
      case EMAILTYPES.EMAILVERIFICATION:
        await db.user.update({
          where: { id: extraArgs?.userId },
          data: {
            verifyToken: hashedToken,
            verifyTokenExpiry: new Date(Date.now() + 3600000),
          },
        });
        break;
      case EMAILTYPES.RESETPASSWORD:
        console.log("Reset password logic goes here");
        break;
      default:
        console.log("Default case logic goes here");
        break;
    }

    const emailVerifyLink = `${env.BASE_DOMAIN}/auth/verify-email?t=${hashedToken}`;
    const passwordResetLink = `${env.BASE_DOMAIN}/auth/reset-password?email=${toEmail}`;

    const formProps = {
      subject:
        emailType == EMAILTYPES.EMAILVERIFICATION
          ? "Email Verification"
          : emailType == EMAILTYPES.RESETPASSWORD
            ? "Password Reset"
            : subject || "",
      to_email: toEmail,
      extraArgs:
        emailType == EMAILTYPES.EMAILVERIFICATION
          ? { email_verify_link: emailVerifyLink }
          : emailType == EMAILTYPES.RESETPASSWORD
            ? { password_reset_link: passwordResetLink }
            : undefined,
      emailType: emailType,
      message: message || "",
    };

    const response = await mail(formProps);

    return response;
  } catch (error) {
    throw new Error(String(error));
  }
};
