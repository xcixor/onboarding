import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { sendEmail } from "../mailer";
import { User } from "@prisma/client";
import { EMAILTYPES } from "@/constants";

let user: User;
jest.mock("nodemailer");

describe("sendEmail", () => {
  beforeAll(async () => {
    user = await db.user.create({
      data: {
        name: "Jane Doe",
        password: "pass1234",
        email: "example@example.com",
      },
    });
  });

  afterAll(async () => {
    // Clean up the test data after all tests have run
    await db.user.deleteMany();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send email verification email", async () => {
    const mockedTransporter = {
      sendMail: jest.fn().mockResolvedValue({}),
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(
      mockedTransporter,
    );
    const toEmail = user.email;
    const emailType = EMAILTYPES.EMAILVERIFICATION;
    const userId = user.id;
    const extraArgs = {
      userId: userId,
    };
    await sendEmail({
      toEmail,
      emailType,
      extraArgs,
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: env.MAILER_USER,
        pass: env.MAILER_PASSWORD,
      },
    });

    const updatedUser = await db.user.findUnique({ where: { id: userId } });
    expect(updatedUser?.verifyToken).toBeDefined();
    expect(updatedUser?.verifyTokenExpiry).toBeDefined();

    expect(mockedTransporter.sendMail).toHaveBeenCalledWith({
      from: env.DEFAULT_FROM_EMAIL,
      to: toEmail,
      subject: "Email Verification",
      html: expect.any(String),
    });
  });

  it("should send reset password email", async () => {
    const mockedTransporter = {
      sendMail: jest.fn().mockResolvedValue({}),
    };
    (nodemailer.createTransport as jest.Mock).mockReturnValue(
      mockedTransporter,
    );

    const toEmail = user.email;
    const emailType = EMAILTYPES.RESETPASSWORD;
    const userId = user.id;
    const extraArgs = {
      userId: userId,
    };
    const subject = "Reset Password";
    const message = "Reset Password";

    await sendEmail({
      toEmail,
      emailType,
      extraArgs,
      subject,
      message,
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: env.MAILER_USER,
        pass: env.MAILER_PASSWORD,
      },
    });

    expect(mockedTransporter.sendMail).toHaveBeenCalledWith({
      from: env.DEFAULT_FROM_EMAIL,
      to: toEmail,
      subject: expect.any(String),
      html: expect.any(String),
    });
  });

  it("should handle default case", async () => {
    const mockedTransporter = {
      sendMail: jest.fn().mockResolvedValue({}),
    };
    (nodemailer.createTransport as jest.Mock).mockReturnValue(
      mockedTransporter,
    );

    const toEmail = user.email;
    const emailType = EMAILTYPES.STANDARD;
    const extraArgs = {
      userId: "",
    };
    const subject = "Test subject";
    const message = "Test message";

    await sendEmail({
      toEmail,
      emailType,
      extraArgs,
      subject,
      message,
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: env.MAILER_USER,
        pass: env.MAILER_PASSWORD,
      },
    });

    expect(mockedTransporter.sendMail).toHaveBeenCalledWith({
      from: env.DEFAULT_FROM_EMAIL,
      to: toEmail,
      subject: expect.any(String),
      html: expect.any(String),
    });
  });

  it("should throw an error if an error occurs", async () => {
    const mockedTransporter = {
      sendMail: jest.fn().mockRejectedValue(new Error("Failed to send email")),
    };
    (nodemailer.createTransport as jest.Mock).mockReturnValue(
      mockedTransporter,
    );

    const toEmail = user.email;
    const emailType = EMAILTYPES.EMAILVERIFICATION;

    await expect(
      sendEmail({
        toEmail,
        emailType,
      }),
    ).rejects.toThrow();
  });
});
