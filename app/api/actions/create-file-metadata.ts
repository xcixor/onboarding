import { uploadFile } from "@/lib/gcp/gcp-utils";
import { db } from "@/lib/db";

type params = {
  file: File;
  assetId: string;
  fileName: string;
};
export async function createFileMetaData({ file, assetId, fileName }: params) {
  if (!file || !assetId || !fileName) {
    return {
      status: 500,
      message: "Bad Request",
    };
  }
  const downloadExpiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const cloudResponse = await uploadFile(file, fileName);
  if (cloudResponse.status !== 200) {
    return {
      status: 500,
      message: "Storage Error",
    };
  }
  try {
    await db.gCPData.upsert({
      where: { assetId: assetId },
      create: {
        assetId: assetId,
        urlExpiryDate: downloadExpiryDate,
        blobName: fileName,
        assetName: file.name,
        assetType: file.type,
        downloadUrl: cloudResponse.downloadUrl,
      },
      update: {
        urlExpiryDate: downloadExpiryDate,
        blobName: fileName,
        assetName: file.name,
        assetType: file.type,
        downloadUrl: cloudResponse.downloadUrl,
      },
    });

    return {
      status: 200,
      message: "Success",
    };
  } catch (error) {
    console.log("[METADATA_ERROR]", error);
    return {
      status: 500,
      message: `Error ${error}`,
    };
  }
}
