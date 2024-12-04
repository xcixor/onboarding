"use client";
import { Survey } from "@/@types";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { CreateSurveyDialog } from "./CreateSurveyDialog";

interface SurveyListProps {
  surveys: Survey[];
}

export function SurveyList({ surveys }: SurveyListProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Surveys</h2>
        <CreateSurveyDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {surveys.map((survey) => (
          <Card
            key={survey.id}
            className="cursor-pointer p-4 transition-shadow hover:shadow-md"
            onClick={() => router.push(`/dashboard/surveys/${survey.id}/edit`)}
          >
            <h3 className="truncate font-semibold">{survey.title}</h3>
            {survey.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {survey.description}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <div>{survey._count?.questions || 0} questions</div>
              <div>•</div>
              <div>{survey._count?.responses || 0} responses</div>
              <div>•</div>
              <div>{survey.published ? "Published" : "Draft"}</div>
            </div>
          </Card>
        ))}

        {surveys.length === 0 && (
          <div className="col-span-full py-8 text-center text-muted-foreground">
            No surveys yet. Create your first survey to get started.
          </div>
        )}
      </div>
    </div>
  );
}
