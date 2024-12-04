import { SurveyBuilder } from "@/components/survey-builder/SurveyBuilder";
import { getLoggedInUser } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { QuestionType } from "@/types/index";

type PageProps = {
  params: {
    surveyId: string;
  };
};
const page = async ({ params: { surveyId } }) => {
  const user = await getLoggedInUser();
  if (!user) {
    return redirect(
      `/auth/signin?callbackUrl=/dashboard/surveys/${surveyId}/edit`,
    );
  }
  const survey = await db.survey.findUnique({
    where: {
      id: surveyId,
    },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
        include: {
          options: {
            orderBy: {
              order: "asc",
            },
          },
          explanation: true,
          validation: true,
          logic: true,
        },
      },
    },
  });
  if (!survey) {
    return <div>Survey not found</div>;
  }
  const initialSurvey = {
    id: survey.id,
    title: survey.title,
    description: survey.description,
    createdAt: survey.createdAt,
    updatedAt: survey.updatedAt,
    published: survey.published,
    questions: survey.questions.map((question) => ({
      ...question,
      type: question.type as QuestionType,
    })),
    createdById: survey.createdById,
  };
  return (
    <div className="p-6">
      <SurveyBuilder initialSurvey={initialSurvey} />
    </div>
  );
};

export default page;
