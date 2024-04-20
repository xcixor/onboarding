import { getLoggedInUser } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { DataTable } from "./DataTable";
import { columns } from "./Columns";

type Props = {
  quizId: string;
};

type SubmissionProps = {
  studentName: string;
  studentScore: number;
  passed: boolean;
};

async function gradeStudent(
  quizId: string,
  studentId: string,
  totalQuestions: number,
  passingPercentage: number
) {
  const user = await db.user.findUnique({
    where: { id: studentId },
    include: { responses: { include: { question: true, option: true } } },
  });

  const correctMarks = user?.responses.reduce((acc, curr) => {
    if (curr.option.isAnswer && curr.question.quizId === quizId) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);
  if (correctMarks && correctMarks >= 1) {
    const studentScore = Math.round((correctMarks / totalQuestions) * 100);
    return {
      passed: studentScore > passingPercentage,
      marks: studentScore,
    };
  }
  return {
    passed: false,
    marks: 0,
  };
}

const SubmissionsTable = async ({ quizId }: Props) => {
  const user = await getLoggedInUser();
  const studentName = user?.userId;

  if (!studentName) {
    return redirect("/");
  }

  const quiz = await db.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: {
      course: true,
      submissions: { include: { user: true } },
      questions: true,
    },
  });
  if (!quiz) {
    return notFound();
  }

  const courseTitle = quiz.course.title;
  const submissionList: SubmissionProps[] = [];

  for (const submission of quiz.submissions) {
    const grade = await gradeStudent(
      submission.quizId,
      submission.userId,
      quiz.questions.length,
      quiz.passingPercentage
    );
    submissionList.push({
      studentName: submission.user.name || submission.user.email || "Not Found",
      studentScore: grade.marks,
      passed: grade.passed,
    });
  }

  return (
    <div className="p-6">
      <div>
        <p>
          <span className="font-semibold">{quiz.title}</span>
        </p>
        <p>
          <span className="font-semibold">Course:</span> {courseTitle}
        </p>
        <p>
          <span className="font-semibold">Pass Mark:</span>{" "}
          {quiz.passingPercentage}%
        </p>
      </div>
      <DataTable columns={columns} data={submissionList} />
    </div>
  );
};

export default SubmissionsTable;
