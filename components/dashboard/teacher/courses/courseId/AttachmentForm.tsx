"use client";

import * as z from "zod";
import axios from "axios";
import { PlusCircle, File, Loader2, X, Ban } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course, GCPData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { DropZoneDocumentFileTypes } from "@/constants";
import Link from "next/link";

interface AttachmentFormProps {
  initialData: GCPData;
  courseId: string;
  isDeleting: boolean;
  attachmentId: string;
}

export default function AttachmentForm({
  initialData,
  courseId,
  isDeleting,
  attachmentId,
}: AttachmentFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      // await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      await axios.delete(`/api/gcp/asset/${id}`);

      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Attachment File
        {isDeleting ? (
          <Ban className="h-4 w-4" />
        ) : (
          <Button onClick={toggleEdit} variant="ghost">
            {isEditing && <>Cancel</>}
            {!isEditing && (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add a file
              </>
            )}
          </Button>
        )}
      </div>
      {!isEditing && (
        <>
          {!initialData && (
            <p className="mt-2 text-sm italic text-slate-500">No attachment</p>
          )}
          {initialData && (
            <div className="space-y-2">
              <div className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700">
                <Link
                  href={initialData.downloadUrl}
                  className="flex"
                  target="_blank"
                >
                  <File className="mr-2 h-4 w-4 flex-shrink-0" />
                  <p className="line-clamp-1 text-xs">
                    {initialData.assetName}
                  </p>
                </Link>
                {deletingId === initialData.id && (
                  <div>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {deletingId !== initialData.id && (
                  <button
                    onClick={() => onDelete(initialData.id)}
                    className="ml-auto transition hover:opacity-75"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            bucketFileDirectory={`courses/${courseId}/attachments`}
            toggleEdit={toggleEdit}
            fileMessage={"pdf, docx, txt, zip, rar, ppt, pptx, xls, xlsx, doc"}
            acceptedFileTypes={DropZoneDocumentFileTypes}
            assetId={attachmentId}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
}
