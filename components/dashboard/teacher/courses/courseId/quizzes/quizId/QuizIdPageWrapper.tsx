import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileQuestion, LayoutDashboard } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/IconBadge";
import { Banner } from "@/components/Banner";

import QuizTitleForm from "./QuizTitleForm";
import QuizDescriptionForm from "./QuizDescriptionForm";

import { QuizActions } from "./QuizActions";
import { getLoggedInUser } from "@/lib/auth/utils";
import QuestionsForm from "./QuestionsForm";
import QuizPercentageForm from "./QuizPercentage";

interface Props {
  courseId: string;
  quizId: string;
}

const QuizIdPageWrapper = async ({ courseId, quizId }: Props) => {
  const user = await getLoggedInUser();
  const userId = user?.id;

  if (!userId) {
    return redirect("/");
  }

  const quiz = await db.quiz.findUnique({
    where: {
      id: quizId,
      courseId: courseId,
    },
    include: {
      questions: true,
    },
  });

  if (!quiz) {
    return redirect("/");
  }

  const requiredFields = [
    quiz.title,
    quiz.description,
    quiz.passingPercentage,
    quiz.questions.some((question) => question.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!quiz.isPublished && (
        <Banner
          variant="warning"
          label="This quiz is unpublished. It will not be visible in the course"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/dashboard/teacher/courses/${courseId}`}
              className="mb-6 flex items-center text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to course setup
            </Link>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Quiz Setup</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
                <span className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-700">
                  <p>Required fields include;</p>
                  <ul className="list-disc pl-4 text-[0.7rem]">
                    <li>Title</li>
                    <li>Description</li>
                    <li>Passing percentage</li>
                    <li>At least one published question.</li>
                  </ul>
                </span>
              </div>
              <QuizActions
                disabled={!isComplete}
                courseId={courseId}
                quizId={quizId}
                isPublished={quiz.isPublished}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your quiz</h2>
          </div>
          <div className="mt-16 gap-6 md:w-1/2 ">
            <QuizTitleForm
              initialData={quiz}
              courseId={courseId}
              quizId={quizId}
            />
            <QuizDescriptionForm
              initialData={quiz}
              courseId={courseId}
              quizId={quizId}
            />
            <QuizPercentageForm
              initialData={quiz}
              courseId={courseId}
              quizId={quizId}
            />
          </div>
        </div>

        <div className="mt-4 space-x-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={FileQuestion} />
              <h2 className="text-xl">Questions</h2>
            </div>
            <QuestionsForm
              initialData={quiz}
              courseId={courseId}
              isDeleting={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizIdPageWrapper;
