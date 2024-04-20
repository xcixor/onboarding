import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/IconBadge";

import ChapterTitleForm from "./ChapterTitleForm";
import ChapterDescriptionForm from "./ChapterDescriptionForm";
import ChapterAccessForm from "./ChapterAccessForm";
import ChapterVideoForm from "./ChapterVideoForm";
import { Banner } from "@/components/Banner";
import { ChapterActions } from "./ChapterActions";
import { getLoggedInUser } from "@/lib/auth/utils";
import { getLatestFileMetaData } from "@/actions/get-latest-file-metadata";

interface Props {
  courseId: string;
  chapterId: string;
}

const ChapterIdPageWrapper = async ({ courseId, chapterId }: Props) => {
  const user = await getLoggedInUser();
  const userId = user?.id;

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      course: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }
  const fileMetaData = await getLatestFileMetaData(chapterId);

  const requiredFields = [chapter.title, chapter.description, fileMetaData];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course"
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
                <h1 className="text-2xl font-medium">Chapter Setup</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
                <span className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-700">
                  <p>Required fields include;</p>
                  <ul className="list-disc pl-4 text-[0.7rem]">
                    <li>Title</li>
                    <li>Description</li>
                    <li>Video</li>
                  </ul>
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
                isCourseFree={chapter.course.isFree}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <ChapterVideoForm
              initialData={chapter}
              chapterId={chapterId}
              courseId={courseId}
              fileMetaData={fileMetaData}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPageWrapper;
