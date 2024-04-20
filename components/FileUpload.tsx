"use client";

import { useState } from "react";
import Dropzone from "react-dropzone";
import {
  CheckCircle2,
  Cloud,
  FileIcon,
  Loader2,
  StopCircle,
} from "lucide-react";
import { Progress } from "./ui/progress";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
// import { File } from "buffer";
import { DropZoneVideoFileTypes } from "@/constants";
import { cn } from "@/lib/utils";
import { POST } from "@/app/api/clients/route";

function checkFileType(fileType) {
  const videoFileTypes = Object.keys(DropZoneVideoFileTypes);
  return videoFileTypes.includes(fileType);
}

interface Accept {
  [key: string]: string[];
}

interface FileUploadProps {
  assetId: string;
  toggleEdit?: () => void;
  fileMessage: string;
  acceptedFileTypes: Accept | null;
  bucketFileDirectory: string;
  isVideo?: boolean;
}

const UploadDropzone = ({
  assetId,
  toggleEdit,
  fileMessage,
  acceptedFileTypes,
  bucketFileDirectory,
  isVideo,
}: FileUploadProps) => {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [readable, setReadable] = useState(null);

  const startUpload = async function (acceptedFile: File) {
    let fileToUpload = acceptedFile;
    // const customFileName = `${bucketFileDirectory}/thumbnails`;
    // if (isVideo) {
    //   try {
    //     const formData = new FormData();
    //     formData.append("file", fileToUpload);
    //     formData.append("chapterId", assetId);
    //     formData.append("videoFolder", customFileName);
    //     setIsProcessingFile(true);
    //     const response = await fetch("/api/gcp/asset/thumbnail", {
    //       method: "PUT",
    //       body: formData,
    //     });

    //     const data = await response.json();
    //     if (response.status === 200) {
    //       toast({
    //         title: "Success",
    //         description: "File processing success.",
    //         variant: "default",
    //         className: "bg-green-300 border-0",
    //       });
    //     } else {
    //       toast({
    //         variant: "destructive",
    //         title: "Error",
    //         description: data.message.toString(),
    //       });
    //     }
    //   } catch (error) {
    //     setIsError(true);
    //     console.log(error, "#CLIENT ERROR");
    //     toast({
    //       variant: "destructive",
    //       title: "Error",
    //       description: "Something went wrong!",
    //     });
    //   } finally {
    //     setIsProcessingFile(false);
    //   }
    // }
    try {
      setIsUploading(true);
      let contentType = acceptedFile.type;
      const isReadableVideoFileType = checkFileType(contentType);
      if (isVideo) {
        if (!isReadableVideoFileType) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "File type not supported",
          });
          setIsError(true);
          return;
        }
      }
      const customFileName = `${bucketFileDirectory}/${fileToUpload.name}`;

      const response = await fetch("/api/gcp/signed-url", {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify({
          contentType: contentType,
          fileName: customFileName,
        }),
      });
      const data = await response.json();
      const { url, downloadUrl, downloadExpiry, blobName } = data;

      var xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Content-Type", contentType);
      xhr.addEventListener("loadend", function () {
        setIsUploading(false);
      });
      xhr.upload.addEventListener("progress", function (event) {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100,
          );

          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("readystatechange", async function () {
        if (xhr.readyState === 4 && xhr.status == 200) {
          if (isVideo) {
            await fetch("/api/gcp/asset/thumbnail", {
              method: "POST",
              body: JSON.stringify({
                videoFolder: `${bucketFileDirectory}/thumbnails`,
                url: downloadUrl,
              }),
            });
          }
          try {
            const response = await fetch("/api/gcp/asset", {
              method: "PUT",
              body: JSON.stringify({
                fileName: fileToUpload.name,
                contentType: contentType,
                blobName: customFileName,
                downloadUrl: downloadUrl,
                downloadExpiry: downloadExpiry,
                assetId: assetId,
                assetName: fileToUpload.name,
              }),
            });
            const data = await response.json();
            if (response.status === 200) {
              toast({
                title: "Success",
                description: "Update success.",
                variant: "default",
                className: "bg-green-300 border-0",
              });
              toggleEdit();
              router.refresh();
              setIsError(false);
            } else {
              toast({
                variant: "destructive",
                title: "Error",
                description: data.message,
              });
            }
          } catch (error) { }
        } else if (xhr.readyState === 4 && xhr.status != 200) {
          console.log("errred", xhr.status, xhr.responseText);
          setIsError(true);
        }
      });
      xhr.send(fileToUpload);
    } catch (error) {
      console.log(error, "#CLIENT ERROR");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong!",
      });
    }
  };

  return (
    <Dropzone
      multiple={false}
      accept={acceptedFileTypes}
      onDrop={async (acceptedFile) => {
        // handle file uploading
        try {
          await startUpload(acceptedFile[0]);
        } catch (error) {
          console.log(error);
        }
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps({ onClick: (evt) => evt.preventDefault() })}
          className="m-4 h-64 rounded-lg border border-dashed border-gray-300"
        >
          <div className="flex h-full w-full items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <Cloud className="mb-2 h-6 w-6 text-zinc-500" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">{fileMessage}</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200">
                  <div className="grid h-full place-items-center px-3 py-2">
                    <FileIcon className="h-4 w-4 text-pes-blue" />
                  </div>
                  <div className="h-full truncate px-3 py-2 text-sm">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="mx-auto mt-4 w-full max-w-xs">
                  <Progress
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    value={uploadProgress}
                    className="h-1 flex-1 bg-zinc-200"
                  />

                  <p
                    className={cn(
                      "text-center text-sm italic",
                      uploadProgress === 100 && "text-green-500",
                    )}
                  >
                    {uploadProgress}%
                  </p>

                  {uploadProgress === 100 ? (
                    <div className="flex items-center justify-center gap-1 pt-2 text-center text-sm text-zinc-700">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    </div>
                  ) : null}
                </div>
              ) : null}
              {isError ? (
                <div className="mx-auto mt-4 w-full max-w-xs">
                  <Progress
                    indicatorColor="bg-red-500"
                    value={95}
                    className="h-1 w-full bg-zinc-200"
                  />

                  <div className="flex items-center justify-center gap-1 pt-2 text-center text-sm text-zinc-700">
                    <StopCircle className="h-3 w-3 text-red-500" />
                  </div>
                </div>
              ) : null}

              {isProcessingFile ? (
                <div className="mx-auto mt-4 flex w-full max-w-xs justify-center align-middle">
                  <p className="muted text-sm italic text-green-500">
                    Processing file...
                  </p>
                  <Loader2 className="h-4 w-4 animate-spin text-green-500" />
                </div>
              ) : null}

              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export const FileUpload = ({
  assetId,
  toggleEdit,
  fileMessage,
  acceptedFileTypes,
  bucketFileDirectory,
  isVideo = false,
}: FileUploadProps) => {
  return (
    <UploadDropzone
      isVideo={isVideo}
      assetId={assetId}
      toggleEdit={toggleEdit}
      fileMessage={fileMessage}
      acceptedFileTypes={acceptedFileTypes}
      bucketFileDirectory={bucketFileDirectory}
    />
  );
};