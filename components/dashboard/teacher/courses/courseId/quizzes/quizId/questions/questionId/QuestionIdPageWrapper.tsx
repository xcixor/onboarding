import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileQuestion, LayoutDashboard, Option } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/IconBadge";
import { Banner } from "@/components/Banner";

import QuestionTitleForm from "./QuestionTitleForm";

import { QuestionActions } from "./QuestionActions";
import { getLoggedInUser } from "@/lib/auth/utils";
import OptionsForm from "./OptionsForm";
import AnswerForm from "./AnswerForm";

interface Props {
  courseId: string;
  quizId: string;
  questionId: string;
}

const QuestionIdPageWrapper = async ({
  questionId,
  quizId,
  courseId,
}: Props) => {
  const user = await getLoggedInUser();
  const userId = user?.id;

  if (!userId) {
    return redirect("/");
  }

  const question = await db.question.findUnique({
    where: {
      id: questionId,
      quizId: quizId,
    },
    include: {
      options: true,
    },
  });

  if (!question) {
    return redirect("/");
  }

  const requiredFields = [
    question.title,
    question.options.length > 1,
    question.options.some((option) => option.isAnswer),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!question.isPublished && (
        <Banner
          variant="warning"
          label="This question is unpublished. It will not be visible in the quiz"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/dashboard/teacher/courses/${courseId}/quizzes/${quizId}`}
              className="mb-6 flex items-center text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to quiz setup
            </Link>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Question Setup</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
                <span className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-700">
                  <p>Required fields include;</p>
                  <ul className="list-disc pl-4 text-[0.7rem]">
                    <li>Title</li>
                    <li>Answer (only appears if you have an option)</li>
                    <li>Atleast two options</li>
                  </ul>
                </span>
              </div>
              <QuestionActions
                disabled={!isComplete}
                courseId={courseId}
                questionId={questionId}
                isPublished={question.isPublished}
                quizId={quizId}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize Your Question</h2>
          </div>
          <div className="mt-16 gap-4 md:flex">
            <div className="gap-6 md:w-1/2">
              <QuestionTitleForm
                initialData={question}
                courseId={courseId}
                questionId={questionId}
                quizId={quizId}
              />
            </div>
            <div className="gap-6 md:w-1/2">
              {question.options.length >= 1 && (
                <AnswerForm
                  initialData={question}
                  courseId={courseId}
                  questionId={questionId}
                  quizId={quizId}
                  options={question.options.map((option) => ({
                    label: option.title,
                    value: option.id,
                    isAnswer: option.isAnswer,
                  }))}
                  isDeleting={false}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 space-x-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Option} />
              <h2 className="text-xl">Options</h2>
            </div>
            <OptionsForm
              initialData={question}
              courseId={courseId}
              isDeleting={false}
              quizId={quizId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionIdPageWrapper;
