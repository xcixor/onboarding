"use client";

import axios from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  id: string;
  reviewId: string;
};

const DeleteDocument = (props: Props) => {
  const router = useRouter();
  const onDelete = async (id: string) => {
    try {
      const response = await fetch(
        `/api/document-review/client/request/${props.reviewId}/docs/${id}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
        return;
      }
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => onDelete(props.id)}
        className="ml-auto transition hover:opacity-75"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default DeleteDocument;
