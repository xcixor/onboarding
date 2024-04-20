import { getFileExtension } from "../files";
import { FileUploader } from "./gcp";
const { Storage } = require("@google-cloud/storage");
const gsBucketName = process.env.GS_BUCKET_NAME;
// Initialize storage
const storage = new Storage({ keyFilename: process.env.GS_CREDENTIALS });

export const UPLOAD_EXPIRY_IN_SECONDS = new Date(
  Date.now() + 24 * 60 * 60 * 1000,
);
export const DOWNLOAD_EXPIRY_IN_SECONDS = new Date(
  Date.now() + 7 * 24 * 60 * 60 * 1000,
);

export async function uploadFile(file: File, fileName: string) {
  const contentType: string = getFileExtension(file);

  const downloadExpiryDate = UPLOAD_EXPIRY_IN_SECONDS;
  const uploader = new FileUploader(
    fileName,
    contentType,
    "PUT",
    downloadExpiryDate,
  );
  const cloudResponse = await uploader.uploadFile(file);
  return cloudResponse;
}

// Delete an object
export async function deleteGCPObject(objectName) {
  try {
    await storage.bucket(gsBucketName).file(objectName).delete();
    return { status: 200 };
  } catch (error) {
    const statusCode = error.code;
    return { status: statusCode };
  }
}
