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
import { signIn } from "next-auth/react";
import { Info } from "lucide-react";
import Link from "next/link";
import { toast } from "../ui/use-toast";
import { Icon } from "@iconify/react";

type LoginProps = {
  callbackUrl?: string;
  error?: string;
};

const Login = ({ callbackUrl, error }: LoginProps) => {
  const formSchema = z.object({
    email: z.string().email("Please provide a valid email address"),
    password: z.string().min(1, "Please provide your password"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { isSubmitting, isValid, errors } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { email, password } = values;
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: callbackUrl ?? "/dashboard/profile",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || errors,
      });
    }
  }
  return (
    <div className="">
      <h1 className="my-4 text-2xl font-bold text-pes-red">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {!!error && (
            <div className="flex items-center gap-4">
              <Info className="h-4 w-4 font-bold text-pes-red" />
              <p className="font-bold text-pes-red">
                Invalid email password combination
              </p>
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            variant="secondary"
            className="bg-pes-blue font-semibold text-white hover:bg-pes-red"
          >
            Login
          </Button>
          <div></div>
        </form>
      </Form>
      <div className="flex flex-col items-center py-4">
        <p className="text-primary">
          <Link
            href="/auth/send-reset-password-link"
            className="font-semibold text-pes-blue hover:text-pes-red"
          >
            Forgot your password?
          </Link>
        </p>
        <p className="text-pes-blue">
          If you don&apos;t have an account &nbsp;
          <Link
            href="/auth/signup"
            className="font-semibold text-pes-blue hover:text-pes-red"
          >
            click here
          </Link>
          &nbsp;to sign up
        </p>
      </div>
      {/* <div className="flex flex-col items-center">
        <p className="text-primary">Or login with your socials</p>
        <div className="flex gap-4 p-2">
          <Button variant="ghost" className="bg-secondary">
            <Icon
              icon="mdi:google"
              onClick={() => signIn("google")}
              className="h-8 w-8"
            />
          </Button>
          <Button variant="ghost" className="bg-secondary">
            <Icon
              icon="mdi:github"
              onClick={() => signIn("github")}
              className="h-8 w-8"
            />
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default Login;