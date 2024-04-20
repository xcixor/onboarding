"use client";

import { Pencil, PlusCircle, ImageIcon, Ban } from "lucide-react";
import { useState } from "react";
import { GCPData } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { DropZoneImageFileTypes } from "@/constants";

interface AvatarFormProps {
  userId: string;
  isDeleting: boolean;
  gcpData: GCPData | null;
}

export default function AvatarForm({
  userId,
  isDeleting,
  gcpData,
}: AvatarFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course image
        {isDeleting ? (
          <Ban className="h-4 w-4" />
        ) : (
          <Button onClick={toggleEdit} variant="ghost">
            {isEditing && <>Cancel</>}
            {!isEditing && !gcpData && (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add an image
              </>
            )}
            {!isEditing && gcpData && (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Edit image
              </>
            )}
          </Button>
        )}
      </div>
      {!isEditing &&
        (!gcpData ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="Upload"
              fill
              className="rounded-md object-cover"
              src={gcpData.downloadUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            toggleEdit={toggleEdit}
            fileMessage={"png, jpg, jpeg, webp, svg, bmp, tiff, gif, webp"}
            acceptedFileTypes={DropZoneImageFileTypes}
            assetId={userId}
            bucketFileDirectory={`users/${userId}/image`}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
}
