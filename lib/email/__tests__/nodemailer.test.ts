import { mail } from "@/lib/email/nodemailer";
import { env } from "@/lib/env";

jest.setTimeout(30000); // Sets a global timeout of 30 seconds

describe("Test sending email", () => {
  let timeoutId;

  beforeAll(() => {
    timeoutId = setTimeout(() => {}, 30000);
  });

  afterAll(() => {
    clearTimeout(timeoutId);
  });

  // Your existing test
  it("should send email using real email server successfully", async () => {
    const emailProps = {
      to_email: env.TEST_RECIPIENT,
      subject: "Integration Test Email",
      message: "This is an integration test message",
    };

    const result = await mail(emailProps);

    expect(result.status).toBe(200);
    expect(result.message).toContain("Email sent successfully.");
  });

  // Test for missing email parameters
  it("should return an error if email parameters are missing", async () => {
    try {
      const result = await mail({});
    } catch (error) {
      expect(error.message).toContain("Invalid or missing email parameters.");
    }
  });

  // Test for invalid recipient email
  it("should return an error if the recipient email is incorrect", async () => {
    const emailProps = {
      to_email: "not-valid-email",
      subject: "Integration Test Email",
      message: "This is an integration test message",
    };

    try {
      const result = await mail(emailProps);
    } catch (error) {
      expect(error.message).toContain("Error: No recipients defined");
    }
  });

  // Test for missing or incorrect subject or message
  it("should return an error if there's a missing or incorrect subject", async () => {
    const emailProps = {
      to_email: env.TEST_RECIPIENT,
      subject: "",
      message: "Testing subject",
    };

    try {
      const result = await mail(emailProps);
    } catch (error) {
      expect(error.message).toContain("Invalid or missing email parameters.");
    }
  });
});