"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Ban, Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";

interface CommentFormProps {
  initialData: {
    comment: string;
  };
  reviewId: string;
  isDeleting: boolean;
}

const formSchema = z.object({
  comment: z.string().min(1, {
    message: "Comment is required",
  }),
});

export default function CommentForm({
  initialData,
  reviewId,
  isDeleting,
}: CommentFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { control, handleSubmit, formState } = form;
  const { isSubmitting, isValid } = formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/coaches/document-review/${reviewId}/comment/`, values);
      toast.success("Review updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course comment
        {isDeleting ? (
          <Button variant="outline" disabled>
            <Ban className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={toggleEdit} variant="ghost">
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit comment
              </>
            )}
          </Button>
        )}
      </div>
      {!isEditing && <Preview value={initialData.comment} />}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Controller
                      name="comment"
                      control={control}
                      render={({ field }) => (
                        <Editor {...field} />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              name="comment"
              control={control}
              render={({ field }) => <Preview value={field.value} />}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
