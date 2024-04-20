"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import Combobox from "@/components/ui/combobox";
import { ComboItem } from "@/@types/db";

type FormProps = {
  initialData: {
    title: string;
    purpose: string;
    coach: string;
    coaches: ComboItem[];
  };
};

const RequestReviewForm = ({ initialData }: FormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const formSchema = z.object({
    title: z.string().min(2, "Title is required."),
    purpose: z.string().min(2, "Purpose is required."),
    coach: z.string().min(2, "Coach is required."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid, errors } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/document-review/client/request", {
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
        toast({
          variant: "default",
          title: "Success",
          description: "Request made successfuly.",
          className: "bg-green-500",
        });

        router.push(`/dashboard/document-review/${response.reviewId}/`);
      }
    } catch (error) {
      console.log(error, errors);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  }

  return (
    <div className="flex h-full w-full flex-col justify-start rounded-md border bg-pes-light-blue p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="Title e.g Investor Readiness"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Editor {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {initialData.purpose && <Preview value={initialData.purpose} />}
          <FormField
            control={form.control}
            name="coach"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Combobox options={initialData.coaches} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Request Review"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RequestReviewForm;
