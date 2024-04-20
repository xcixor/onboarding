"use client";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
  Loader2,
} from "lucide-react";

import { IconBadge } from "@/components/IconBadge";

import TitleForm from "../TitleForm";
import DescriptionForm from "../DescriptionForm";
import ImageForm from "../ImageForm";
import CategoryForm from "../CategoryForm";
import PriceForm from "../PriceForm";
import AttachmentForm from "../AttachmentForm";
import ChaptersForm from "../ChapterForm";
import PlanForm from "../PlanForm";
import { Banner } from "@/components/Banner";
import { Actions } from "../Actions";
import { Attachment, Category, Chapter, Course, Plan } from "@prisma/client";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { useState } from "react";

import { useCategories } from "@/actions/swr/useCategories";
import { usePlans } from "@/actions/swr/usePlans";
import useCoachCourse from "@/actions/swr/useCoachCourses";

interface CourseType {
  course: Course & {
    chapters: Chapter[];
    attachments: Attachment[];
  };
}

interface PageProps {
  // course: Course & {
  //   chapters: Chapter[];
  //   attachments: Attachment[];
  // };
  // categories: Category[];
  // plans: Plan[];
  courseId: string;
  userId: string;
}

const CourseIdPage = ({ courseId, userId }: PageProps) => {
  const [deleting, setIsDeleting] = useState(false);
  const toggleDeleting = () => setIsDeleting((current) => !current);

  const { course, isCoachLoading, isCoachError } = useCoachCourse(courseId);

  const { categories, isCategoriesError, isCategoriesLoading } =
    useCategories();

  const { plans, isplansLoading, isplansError } = usePlans();

  // if (!course) {
  //   return redirect("/");
  // }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="relative">
      {deleting && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10 opacity-60">
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
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={course.id}
            isPublished={course.isPublished}
            toggleDeleting={toggleDeleting}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
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
            />
            {isCategoriesLoading ? (
              "categories loading"
            ) : (
              <CategoryForm
                initialData={course}
                courseId={course.id}
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
                isDeleting={deleting}
              />
            )}
            {isplansLoading ? (
              "plans loadign"
            ) : (
              <PlanForm
                initialData={course}
                courseId={course.id}
                options={plans.map((plan) => ({
                  label: plan.name,
                  value: plan.id,
                }))}
                isDeleting={deleting}
              />
            )}
          </div>
          <div className="space-y-6">
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
              <AttachmentForm
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
