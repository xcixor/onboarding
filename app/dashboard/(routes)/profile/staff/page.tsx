// app/dashboard/surveys/page.tsx
import { Suspense } from "react";
import { db } from "@/lib/db";
import { getLoggedInUser } from "@/lib/auth/utils";
import { SurveyList } from "@/components/survey-builder/SurveyList";

async function getSurveys() {
  const user = await getLoggedInUser();
  if (!user?.id) return [];

  const surveys = await db.survey.findMany({
    where: {
      createdById: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      published: true,
      createdAt: true,
      _count: {
        select: {
          questions: true,
          responses: true,
        },
      },
    },
  });

  return surveys;
}

export default async function SurveysPage() {
  const surveys = await getSurveys();

  return (
    <div className="container py-6">
      <Suspense fallback={<div>Loading surveys...</div>}>
        <SurveyList surveys={surveys} />
      </Suspense>
    </div>
  );
}
