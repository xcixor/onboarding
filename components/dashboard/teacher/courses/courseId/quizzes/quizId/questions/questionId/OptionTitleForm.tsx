"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OptionTitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
  quizId: string;
  optionId: string;
  questionId: string;
  toggleEditingOptionTitle: () => void;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export default function OptionTitleForm({
  initialData,
  courseId,
  quizId,
  questionId,
  optionId,
  toggleEditingOptionTitle,
}: OptionTitleFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/quizzes/${quizId}/questions/${questionId}/options/${optionId}`,
        values
      );
      toast.success("Option updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      toggleEditingOptionTitle();
    }
  };

  return (
    <div className="border  rounded-md ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="flex">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center ">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="mx-5"
              >
                Save
              </Button>
              <Button
                onClick={toggleEditingOptionTitle}
                variant="ghost"
                type="button"
                className="bg-slate-100 drop-shadow-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
