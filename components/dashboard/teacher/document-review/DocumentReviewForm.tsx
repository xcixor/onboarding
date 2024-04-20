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
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";


type FormProps = {
  initialData: {
    review: string;
  };
  documentReviewId:string;
  hasReviews:boolean
};

const DocumentReviewForm = ({ initialData, documentReviewId, hasReviews }: FormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const formSchema = z.object({
    review: z.string().min(2, "Please provide your review."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid, errors } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/coaches/document-review/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...values, documentReviewId}),
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Editor {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {initialData.review && <Preview value={initialData.review} />}

          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
              {hasReviews ? "Submit another review": "Submit Review"}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DocumentReviewForm;
