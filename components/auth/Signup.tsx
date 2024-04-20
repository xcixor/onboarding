"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const Signup = () => {
  const router = useRouter();
  const { toast } = useToast();
  const formSchema = z.object({
    firstName: z.string().min(2, "Please provide your name"),
    lastName: z.string().min(2, "Please provide your name"),
    email: z.string().email("Please provide a valid email address"),
    password: z
      .string()
      .min(8, "Password must have a minimum of 8 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).*$/,
        "Password must have a combination of lowercase and uppercase letters, a special character and at least one number.",
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const response = await res.json();
    if (!res.ok) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.message,
      });
    } else {
      router.push(`/auth/email-verification-sent?t=${response.userId}`);
      toast({
        variant: "default",
        title: "Success",
        description: response.message,
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="justify-between gap-4 md:flex">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g James Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g James Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g xyz@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormDescription>
              I agree to the
              <Link
                href="/terms"
                className="font-semibold text-pes-blue hover:text-pes-red"
              >
                {" "}
                &nbsp;Terms &nbsp;
              </Link>
              and
              <Link
                href="/privacy"
                className="font-semibold text-pes-blue hover:text-pes-red"
              >
                &nbsp;Privacy Policy.
              </Link>
            </FormDescription>
          </div>
        </FormItem>
        <Button
          type="submit"
          variant="secondary"
          className="bg-pes-blue font-semibold text-primary text-white hover:bg-pes-red"
        >
          Signup
        </Button>
      </form>
    </Form>
  );
};

export default Signup;
