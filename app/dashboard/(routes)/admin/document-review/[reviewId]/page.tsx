import { getCoaches } from "@/actions/get-coaches";
import { getDocumentReviewDocuments } from "@/actions/get-document-review-documents";
import { getReview } from "@/actions/get-review";
import DocumentReviewDocumentPreview from "@/components/dashboard/clients/docs/DocumentReviewDocumentPreview";
import EditReviewForm from "@/components/dashboard/clients/docs/EditReviewDetailsForm";
import { getLoggedInUser } from "@/lib/auth/utils";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import ApproveReview from "@/components/dashboard/admin/document-review/ApproveReview";

const page = async ({ params }: { params: { reviewId: string } }) => {
  const user = await getLoggedInUser();
  if (!user) {
    return redirect("/");
  }
  const review = await getReview(params.reviewId);
  const coaches = await getCoaches();
  const comboItems = coaches.map((coach) => ({
    label: coach.email,
    value: coach.id,
  }));
  const reviewingCoach = coaches.filter((coach) => coach.id === review.coachId);
  const documentReviewDocuments = await getDocumentReviewDocuments(
    params.reviewId,
  );

  return (
    <div className="p-12">
      <div className="flex justify-between align-middle">
        <Link
          href="/dashboard/admin/document-review"
          className="flex items-center text-sm transition hover:opacity-75"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
        <ApproveReview 
          status={review.status}
          reviewId={review.id}
        />
      </div>
      <h1 className="my-4 text-lg font-bold">Step 2: Upload Documents.</h1>

      <EditReviewForm
        initialData={{
          title: review.title,
          purpose: review.purpose,
          coachId: review.coachId,
          coaches: comboItems,
        }}
        reviewId={params.reviewId}
        reviewingCoach={reviewingCoach[0]}
        isOwnerComponent={false}
      />

      <div>
        {documentReviewDocuments.map((document) => (
          <div key={document.id}>
            <DocumentReviewDocumentPreview
              assetId={document.id}
              title={document.title}
              reviewId={review.id}
              isOwnerComponent={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
