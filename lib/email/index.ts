import { mail } from "./email";

export interface EmailProps {
  toEmail: string;
  subject?: string;
  message?: string;
}

export const sendEmail = async ({
  toEmail,
  subject,
  message,
}: EmailProps): Promise<{ status: number; message: string }> => {
  try {
    const formProps = {
      subject,
      toEmail,
      message,
    };
    const response = await mail(formProps);
    return { ...response };
  } catch (error) {
    throw new Error(String(error));
  }
};
