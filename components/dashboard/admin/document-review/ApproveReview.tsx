"use client";

import { DocumentReviewStatus } from "@prisma/client";
import axios from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  reviewId: string;
  status: DocumentReviewStatus
};

const ApproveReview = (props: Props) => {
  const router = useRouter();
  const toggleStatus = async () => {
    try {
      const response = await fetch(
        `/api/admin/document-review/${props.reviewId}/toggle-status`,
        {
          method: "PUT",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
        return;
      }
      toast.success("Status Updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => toggleStatus()}
        className="ml-auto transition hover:opacity-75 bg-primary text-white p-2 rounded-sm"
      >
        {props.status === DocumentReviewStatus.APPROVED && (
            <p>Disapprove</p>
        )}
               {props.status === DocumentReviewStatus.PENDING && (
            <p>Approve</p>
        )}
      </button>
    </div>
  );
};

export default ApproveReview;
