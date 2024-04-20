"use client";

import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { useConfettiStore } from "@/hooks/useConfettiStore";

interface AttachmentActionsProps {
  disabled: boolean;
  courseId: string;
  attachmentId: string;
}

export const AttachmentActions = ({
  courseId,
  attachmentId,
}: AttachmentActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setIsDeleting] = useState(false);
  const toggleDeleting = () => setIsDeleting((current) => !current);

  const onDelete = async () => {
    try {
      setIsLoading(true);

      toggleDeleting();

      await axios.delete(
        `/api/courses/${courseId}/attachments/${attachmentId}`,
      );

      toast.success("Course deleted");
      router.refresh();
      router.push(`/dashboard/teacher/courses/${courseId}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      toggleDeleting();
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
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
