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
import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import Combobox from "@/components/ui/combobox";
import { ComboItem } from "@/@types/db";
import { Profile, User } from "@prisma/client";

type FormProps = {
  initialData: {
    title: string;
    purpose: string;
    coachId: string;
    coaches: ComboItem[];
  };
  reviewId?: string;
  reviewingCoach?: User & { profile: Profile };
  isOwnerComponent: boolean;
  isCoachComponent: boolean;
};

const EditReviewForm = ({
  initialData,
  reviewId,
  reviewingCoach,
  isOwnerComponent,
  isCoachComponent,
}: FormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();
  const { toast } = useToast();
  const formSchema = z.object({
    title: z.string().min(2, "Title is required."),
    purpose: z.string().min(2, "Purpose is required."),
    coachId: z.string().min(2, "Coach is required."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid, errors } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(
        `/api/document-review/client/request/${reviewId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );
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
        toggleEdit();
        router.refresh();
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
      {reviewId && isOwnerComponent && (
        <div className="flex items-center justify-between font-medium">
          <h2 className="font-semibold">Review Details</h2>
          <Button onClick={toggleEdit} variant="ghost">
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Review
              </>
            )}
          </Button>
        </div>
      )}

      {isEditing ? (
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

            <FormField
              control={form.control}
              name="coachId"
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
                "Edit Review"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <div>
          <h2>
            <span className="font-semibold">Title:</span> {initialData.title}
          </h2>
          <div>
            <span className="font-semibold">Purpose:</span>
            {initialData.purpose && <Preview value={initialData.purpose} />}
          </div>
          {!isCoachComponent && (
            <p>
              <span className="font-semibold">Coach:</span>{" "}
              {reviewingCoach.email}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EditReviewForm;
