import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DropZoneVideoFileTypes } from "@/constants";

export async function uploadFile(
  file: File,
  uploadDir: string,
  ROOT_DIR: string,
) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = `${uploadDir}/${file.name}`;
    await writeFile(path, buffer);
    return { status: 200, message: path };
  } catch (error) {
    return { status: 500, message: error.message };
  }
}

export async function removeFile(filePath: string) {
  if (filePath) {
    try {
      // const __filename = fileURLToPath(import.meta.url);
      // const __dirname = path.dirname(__filename);
      // const filePreviousThumbnailPath = path.resolve(
      //   __dirname,
      //   `../public${filePath}`,
      // );

      fs.unlinkSync(filePath);
      return { status: 200, message: "OK" };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }
}

export default function validateImageFile(file, allowedTypes, allowedMaxSize) {
  const errors = [];
  console.log();
  if (file === null || !file || file === "undefined" || file === "null") {
    errors.push("No file provided");
    return { status: 400, message: errors };
  }

  const maxSize = allowedMaxSize * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type.`);
    return { status: 400, message: errors };
  }
  if (file.size > maxSize) {
    errors.push(`File too large: ${file.originalname}`);
    return { status: 400, message: errors };
  }
  // Handle validation errors

  if (errors.length > 0) {
    // Remove uploaded files
    // fs.unlinkSync(file.path);
    return { status: 400, message: errors };
  }
  return { status: 200, message: "OK" };
}

// export function getFileExtension(file) {
//   const extension = file.name.split(".").pop();
//   return extension;
// }

export function getFileExtension(file) {
  const extension = file.name.split(".").pop();

  // Loop through the DropZoneVideoFileTypes object to find the matching MIME type
  for (const mimeType in DropZoneVideoFileTypes) {
    if (DropZoneVideoFileTypes.hasOwnProperty(mimeType)) {
      const extensions = DropZoneVideoFileTypes[mimeType];
      if (extensions.includes(`.${extension}`)) {
        return mimeType;
      }
    }
  }

  // Return a default MIME type if no match is found
  return "application/octet-stream";
}
