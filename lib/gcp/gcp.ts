const { Storage } = require("@google-cloud/storage");
const { env } = require("../env");

export class FileUploader {
  gsBucketName: string;
  gsLocation: string;
  blobName: any;
  contentType: string;
  method: string;
  fileName: string;
  storage: any;
  downloadExpiryDate: Date;

  constructor(
    blobName: string,
    contentType: string,
    method: string,
    downloadExpiryDate: Date,
  ) {
    this.blobName = blobName;
    this.contentType = contentType;
    this.method = method;
    //   The ID of your GCS bucket
    this.gsBucketName = env.GS_BUCKET_NAME;
    this.gsLocation = env.GS_LOCATION;
    this.fileName = `${this.gsLocation}/${this.blobName}`;
    this.downloadExpiryDate = downloadExpiryDate;

    this.storage = new Storage({ keyFilename: env.GS_CREDENTIALS });
  }

  generateSignedUrl(): Promise<{ url: string; blobName: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const options = {
          version: "v4",
          action: "write",
          expires: Date.now() + 30 * 60 * 1000, // 30 minutes
          contentType: this.contentType,
          method: this.method,
          headers: {
            "content-type": this.contentType, // Include the content-type header in the signedheaders
          },
        };

        // Get a v4 signed URL for uploading file
        const [url] = await this.storage
          .bucket(this.gsBucketName)
          .file(this.fileName)
          .getSignedUrl(options);

        resolve({ url, blobName: this.fileName });
      } catch (error) {
        reject(error);
      }
    });
  }

  generateSignedDownloadUrl(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const options = {
          version: "v4",
          action: "read",
          expires: this.downloadExpiryDate,
        };

        const [url] = await this.storage
          .bucket(this.gsBucketName)
          .file(this.fileName)
          .getSignedUrl(options);

        resolve(url);
      } catch (error) {
        reject(error);
      }
    });
  }

  async uploadFile(
    file: FormDataEntryValue,
  ): Promise<{ status: number; message: string; downloadUrl: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const signedUrl = await this.generateSignedUrl();
        const cloudResponse = await fetch(signedUrl, {
          method: this.method,
          headers: {
            "Content-Type": this.contentType,
          },
          body: file,
        });
        const downloadUrl = await this.generateSignedDownloadUrl();
        const response = {
          status: cloudResponse.status,
          message: cloudResponse.statusText,
          downloadUrl: downloadUrl,
        };
        resolve(response);
      } catch (error) {
        resolve({
          status: 500,
          message: error.message || error,
          downloadUrl: "",
        });
      }
    });
  }
  async getGenerationNumber() {
    const [metadata] = await this.storage
      .bucket(this.gsBucketName)
      .file(this.fileName)
      .getMetadata();
    const generationNumber = metadata.generation;
    return generationNumber;
  }

  async deleteBlob() {
    const generationMatchPrecondition = await this.getGenerationNumber();
    const deleteOptions = {
      ifGenerationMatch: generationMatchPrecondition || 0,
    };

    const [response] = await this.storage
      .bucket(this.gsBucketName)
      .file(this.fileName)
      .delete(deleteOptions);
  }
}
