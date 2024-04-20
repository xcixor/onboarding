"use client";

import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import { Chapter, GCPData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { Player } from "@/components/video/VideoPlayer";
import { DropZoneVideoFileTypes } from "@/constants";

interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
  fileMetaData: GCPData;
}

export default function ChapterVideoForm({
  initialData,
  courseId,
  chapterId,
  fileMetaData,
}: ChapterVideoFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !fileMetaData && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a video
            </>
          )}
          {!isEditing && fileMetaData && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!fileMetaData ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Player
              title={initialData.title}
              url={fileMetaData.downloadUrl}
              onEnded={null}
              thumbnailsFileUrl={initialData.vttFileUrl}
              posterUrl={""}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            isVideo={true}
            assetId={chapterId}
            toggleEdit={toggleEdit}
            fileMessage={"mp4, webm, ogg, mov, wmv, avi, 3gp, flv, mkv"}
            acceptedFileTypes={DropZoneVideoFileTypes}
            bucketFileDirectory={`courses/${courseId}/chapters/${chapterId}/video`}
          />

          <div className="mt-4 text-xs text-muted-foreground">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {fileMetaData && !isEditing && (
        <div className="mt-2 text-xs text-muted-foreground">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  );
}
