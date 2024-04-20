import { getLatestFileMetaData } from "@/actions/get-latest-file-metadata";
import Link from "next/link";
import { File, PenBoxIcon } from "lucide-react";
import DeleteDocument from "./DeleteDocument";

type Props = {
  assetId: string;
  title: string;
  reviewId: string;
  isOwnerComponent:boolean;
};

const DocumentReviewDocumentPreview = async (props: Props) => {
  const gcpData = await getLatestFileMetaData(props.assetId);

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="space-y-2">
        <div className="flex w-full items-center justify-between rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700">
          <p>{props.title}</p>
          {gcpData && (
            <Link href={gcpData.downloadUrl} className="flex" target="_blank">
              <File className="mr-2 h-4 w-4 flex-shrink-0" />
              <p className="line-clamp-1 text-xs">{gcpData.assetName}</p>
            </Link>
          )}
          <div className="flex items-center gap-2">
            {props.isOwnerComponent &&
            (
              <>
                <Link
                  href={`/dashboard/document-review/${props.reviewId}/docs/${props.assetId}`}
                  className="flex"
                >
                  <PenBoxIcon className="h-4 w-4 " />
                </Link>
                <DeleteDocument id={props.assetId} reviewId={props.reviewId} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentReviewDocumentPreview;
