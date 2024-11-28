"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";

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
import { Role } from "@prisma/client";

interface UserTypeFormProps {
  initialData: User;
}

const formSchema = z.object({
  role: z.string(),
});

const roleList = [];

for (const key in Role) {
  if (isNaN(Number(key))) {
    roleList.push({ label: key, value: Role[key] });
  }
}

export default function UserTypeForm({ initialData }: UserTypeFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const translate = useTranslations("UserComponent.UserTypeForm");

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: initialData.role,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/users/${initialData.id}/role/`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.ok) {
        toast({
          title: translate("success.title"),
          description: translate("success.description"),
          variant: "default",
          className: "bg-green-300 border-0",
        });
      } else {
        toast({
          variant: "destructive",
          title: translate("error.title"),
          description: data.message,
        });
      }

      toggleEdit();
      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: translate("error.title"),
        description: translate("error.fetchError"),
      });
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        {translate("editUserType")}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>{translate("cancel")}</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              {translate("editType")}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn("mt-2 text-sm italic text-slate-500")}>
          {translate("current")} {initialData.role}
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={roleList} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {translate("save")}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}