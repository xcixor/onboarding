// components/survey-builder/QuestionExplanation/index.tsx
import { useState } from "react";
import { QuestionExplanation } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  ImageIcon,
  VideoIcon,
  SpeakerLoudIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";

interface QuestionExplanationEditorProps {
  explanation?: QuestionExplanation;
  onUpdate: (explanation: QuestionExplanation | undefined) => void;
}

export function QuestionExplanationEditor({
  explanation,
  onUpdate,
}: QuestionExplanationEditorProps) {
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const handleTextChange = (text: string) => {
    if (!text && !explanation?.mediaUrl) {
      onUpdate(undefined);
      return;
    }

    onUpdate({
      ...explanation,
      text,
      id: explanation?.id || crypto.randomUUID(),
      questionId: explanation?.questionId || "",
    });
  };

  const handleMediaUpload = async (file: File) => {
    try {
      // Create a local preview
      const preview = URL.createObjectURL(file);
      setMediaPreview(preview);

      // TODO: Implement actual file upload to storage service
      // const uploadedUrl = await uploadFile(file)
      const uploadedUrl = preview; // Temporary for demonstration

      onUpdate({
        ...explanation,
        mediaUrl: uploadedUrl,
        mediaType: getMediaType(file.type),
        id: explanation?.id || crypto.randomUUID(),
        questionId: explanation?.questionId || "",
      });
    } catch (error) {
      console.error("Error uploading media:", error);
      // Handle error
    }
  };

  const removeMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
      setMediaPreview(null);
    }

    if (explanation?.mediaUrl) {
      onUpdate({
        ...explanation,
        mediaUrl: undefined,
        mediaType: undefined,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={explanation?.text || ""}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder="Add explanation or help text for this question..."
        className="min-h-[100px]"
      />

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Media Attachment</h4>
            {(explanation?.mediaUrl || mediaPreview) && (
              <Button variant="ghost" size="sm" onClick={removeMedia}>
                <CrossCircledIcon className="mr-2" />
                Remove Media
              </Button>
            )}
          </div>

          {!explanation?.mediaUrl && !mediaPreview ? (
            <div className="flex gap-4">
              <MediaUploadButton
                accept="image/*"
                icon={<ImageIcon />}
                label="Image"
                onUpload={handleMediaUpload}
              />
              <MediaUploadButton
                accept="video/*"
                icon={<VideoIcon />}
                label="Video"
                onUpload={handleMediaUpload}
              />
              <MediaUploadButton
                accept="audio/*"
                icon={<SpeakerLoudIcon />}
                label="Audio"
                onUpload={handleMediaUpload}
              />
            </div>
          ) : (
            <MediaPreview
              url={mediaPreview || explanation?.mediaUrl}
              type={explanation?.mediaType}
            />
          )}
        </div>
      </Card>
    </div>
  );
}

interface MediaUploadButtonProps {
  accept: string;
  icon: React.ReactNode;
  label: string;
  onUpload: (file: File) => void;
}

function MediaUploadButton({
  accept,
  icon,
  label,
  onUpload,
}: MediaUploadButtonProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="flex-1">
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        id={`upload-${label}`}
      />
      <label htmlFor={`upload-${label}`}>
        <Button variant="outline" className="w-full" asChild>
          <div>
            {icon}
            <span className="ml-2">{label}</span>
          </div>
        </Button>
      </label>
    </div>
  );
}

interface MediaPreviewProps {
  url?: string;
  type?: "IMAGE" | "VIDEO" | "AUDIO";
}

function MediaPreview({ url, type }: MediaPreviewProps) {
  if (!url) return null;

  switch (type) {
    case "IMAGE":
      return (
        <img
          src={url}
          alt="Question explanation"
          className="h-auto max-w-full rounded-lg"
        />
      );
    case "VIDEO":
      return <video src={url} controls className="max-w-full rounded-lg" />;
    case "AUDIO":
      return <audio src={url} controls className="w-full" />;
    default:
      return null;
  }
}

function getMediaType(
  mimeType: string,
): "IMAGE" | "VIDEO" | "AUDIO" | undefined {
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (mimeType.startsWith("audio/")) return "AUDIO";
  return undefined;
}
