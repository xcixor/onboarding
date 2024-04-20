"use client";

import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/ConfirmModal";

interface ActionsProps {
  sessionId: string;
}

export const Actions = ({ sessionId }: ActionsProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/sessions/${sessionId}`);

      toast.success("Course deleted");
      router.refresh();
      router.push(`/dashboard/teacher/sessions`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading} className="bg-red-600">
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      </ConfirmModal>
    </div>
  );
};
