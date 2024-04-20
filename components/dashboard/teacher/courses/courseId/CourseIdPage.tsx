"use client";
import {
  ArrowLeft,
  CircleDollarSign,
  ClipboardList,
  Eye,
  File,
  LayoutDashboard,
  ListChecks,
  Loader2,
} from "lucide-react";

import { IconBadge } from "@/components/IconBadge";

import TitleForm from "./TitleForm";
import DescriptionForm from "./DescriptionForm";
import ImageForm from "./ImageForm";
import CategoryForm from "./CategoryForm";
import PriceForm from "./PriceForm";
import ChaptersForm from "./ChapterForm";
import { Banner } from "@/components/Banner";
import { Actions } from "./Actions";
import {
  Attachment,
  Category,
  Chapter,
  Course,
  GCPData,
  Plan,
  Quiz,
} from "@prisma/client";
import { useState } from "react";
import QuizForm from "./QuizForm";
import AttachmentsForm from "./AttachmentsForm";
import CourseAccessForm from "./CourseAccess";
import Link from "next/link";

interface PageProps {
  course: Course & {
    chapters: Chapter[];
    attachments: Attachment[];
    quizzes: Quiz[];
  };
  categories: Category[];
  plans: Plan[];
  gcpData: GCPData;
}
const CourseIdPage = ({ course, categories, plans, gcpData }: PageProps) => {
  const [deleting, setIsDeleting] = useState(false);
  const toggleDeleting = () => setIsDeleting((current) => !current);

  let requiredFields = [
    course.title,
    course.description,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
    gcpData,
  ];

  if (!course.isFree) {
    requiredFields.push(course.price);
  }

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="relative">
      {deleting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white opacity-60">
          <Loader2
            strokeWidth="50px"
            className="h-10 w-10 animate-spin text-red-600"
          />
        </div>
      )}
      {!course.isPublished && (
        <Banner
          variant="warning"
          label="This course is not published. It will not be visible to the students"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <div className="flex justify-between align-middle">
              <Link
                href="/dashboard/teacher/courses/"
                className="flex items-center text-sm transition hover:opacity-75"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to courses
              </Link>
              <Link
                href={`/courses/${course.id}?callbackUrl=/dashboard/teacher/courses/${course.id}`}
                className="flex items-center text-sm transition hover:opacity-75"
              >
                <Eye className="h-8 w-8 text-sky-700" />
              </Link>
            </div>

            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
            <span className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-700">
              <p>Required fields include;</p>
              <ul className="list-disc pl-4 text-[0.7rem]">
                <li>Title</li>
                <li>Description</li>
                <li>Image</li>
                <li>Category</li>
                <li>Price if the course is not free</li>
                <li>At least one published chapter</li>
              </ul>
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={course.id}
            isPublished={course.isPublished}
            toggleDeleting={toggleDeleting}
          />
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm
              initialData={course}
              courseId={course.id}
              isDeleting={deleting}
            />
            <DescriptionForm
              initialData={course}
              courseId={course.id}
              isDeleting={deleting}
            />
            <ImageForm
              initialData={course}
              courseId={course.id}
              isDeleting={deleting}
              gcpData={gcpData}
            />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              isDeleting={deleting}
            />
            <CourseAccessForm initialData={course} />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm
                initialData={course}
                courseId={course.id}
                isDeleting={deleting}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>

              <AttachmentsForm
                initialData={course}
                courseId={course.id}
                isDeleting={deleting}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChaptersForm
                initialData={course}
                courseId={course.id}
                isDeleting={deleting}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ClipboardList} />
                <h2 className="text-xl">Quizes</h2>
              </div>
              <QuizForm
                initialData={course}
                courseId={course.id}
                isDeleting={deleting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
