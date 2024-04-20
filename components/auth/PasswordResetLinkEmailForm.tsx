"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Info, Loader2 } from "lucide-react";
import { toast } from "../ui/use-toast";
import { useState } from "react";

const PasswordResetLinkEmailForm = () => {
  const formSchema = z.object({
    email: z.string().email("Please provide a valid email address"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const [sendLinkSuccess, setSendLinkSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { email } = values;

      const url = `/api/users/send-password-reset-link?toEmail=${email}`;
      const res = await fetch(url, { method: "POST" });
      const response = await res.json();
      const { message } = response;
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });
        setError(message);
      } else {
        toast({
          variant: "default",
          title: "Link sent",
          description: "Success",
          className: "bg-green-400",
        });
        setError("");
        setSendLinkSuccess(true);
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || "Something went wrong.",
      });
    }
  }
  if (sendLinkSuccess) {
    return (
      <div className="flex items-center gap-4">
        <CheckCircle2 className="h-8 w-8 text-primary" />
        <p className="font-semibold text-primary">
          A link to reset your password has been sent to your inbox.
        </p>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col justify-center">
      <h1 className="my-4 text-2xl font-bold text-pes-red">
        Reset Your Password
      </h1>
      <p className="mb-4 font-semibold text-primary">
        Lost your password? Please enter your email address. You will receive a
        link to create a new password via email.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {!!error && (
            <div className="flex items-center gap-4">
              <Info className="h-4 w-4 font-bold text-pes-red" />
              <p className="font-bold text-pes-red">{error}</p>
            </div>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g xyz@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            variant="secondary"
            className="bg-pes-blue text-white hover:bg-pes-red"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Send Link"
            )}
          </Button>
          <div></div>
        </form>
      </Form>
    </div>
  );
};

export default PasswordResetLinkEmailForm;
