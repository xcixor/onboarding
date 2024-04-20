import { mail } from "../email";
import { env } from "@/lib/env";

describe("mail", () => {
  beforeEach(() => {
    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
      }),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.only("should send an email successfully", async () => {
    const formProps = {
      to_name: "John Doe",
      message: "Hello, this is a test email!",
      to_email: "john@example.com",
    };

    const response = await mail(formProps);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: env.SERVICE_ID,
          template_id: env.TEMPLATE_ID,
          user_id: env.PUBLIC_KEY,
          template_params: {
            to_name: "John Doe",
            from_name: env.DEFAULT_FROM_NAME,
            message: "Hello, this is a test email!",
          },
        }),
      },
    );
    expect(response).toBe(200);
  });

  it("should handle failed email sending", async () => {
    // Mock a failed response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      }),
    );

    const formProps = {
      to_name: "John Doe",
      message: "Hello, this is a test email!",
      to_email: "john@example.com",
    };

    const response = await mail(formProps);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: "YOUR_SERVICE_ID",
          template_id: "YOUR_TEMPLATE_ID",
          user_id: "YOUR_PUBLIC_KEY",
          template_params: {
            to_name: "John Doe",
            from_name: "YOUR_DEFAULT_FROM_NAME",
            message: "Hello, this is a test email!",
          },
        }),
      },
    );
    expect(response).toBe(500);
  });
});
