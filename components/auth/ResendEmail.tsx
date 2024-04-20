"use client";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

type Props = {
  toEmail: string;
};

const ResendEmail = ({ toEmail }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleResendVerificationEmail() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/users/resend-verification-email?toEmail=${toEmail}`,
        { method: "POST" },
      );
      const response = await res.json();
      if (res.ok) {
        toast({
          className: "bg-green-300 border-0",
          variant: "default",
          title: "Success",
          description: "Verification email sent successfuly.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Something went wrong!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong!",
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Button
      variant="default"
      className="text-secondary"
      onClick={() => handleResendVerificationEmail()}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        "Click here to resend"
      )}
    </Button>
  );
};

export default ResendEmail;
