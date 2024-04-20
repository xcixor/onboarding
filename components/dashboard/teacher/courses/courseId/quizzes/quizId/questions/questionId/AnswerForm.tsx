"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Ban, Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Question } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Combobox from "@/components/ui/combobox";

interface AnswerFormProps {
  initialData: Question;
  courseId: string;
  quizId: string;
  questionId: string;
  options: { label: string; value: string; isAnswer: boolean }[];
  isDeleting: boolean;
}

const formSchema = z.object({
  optionId: z.string().min(1),
});

export default function AnswerForm({
  initialData,
  courseId,
  questionId,
  quizId,
  options,
  isDeleting,
}: AnswerFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      optionId: options.find((item) => item.isAnswer)?.value || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { optionId } = values;

    try {
      await axios.patch(
        `/api/courses/${courseId}/quizzes/${quizId}/questions/${questionId}/options/${optionId}/set-answer`,
      );
      toast.success("Question updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const selectedOption = options.find((item) => item.isAnswer);

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Set the correct answer from your options.
        {isDeleting ? (
          <Ban className="h-4 w-4" />
        ) : (
          <Button onClick={toggleEdit} variant="ghost">
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Set Answer
              </>
            )}
          </Button>
        )}
      </div>
      {!isEditing && (
        <p
          className={cn(
            "mt-2 text-sm",
            !selectedOption && "italic text-slate-500",
          )}
        >
          {selectedOption?.label || "Answer not added"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="optionId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
