import { Skeleton } from "@/components/ui/skeleton";
import { CourseListSkeleton } from "@/components/skeletons/CourseListSkeleton";

type Props = {};

const DashboardSkeleton = (props: Props) => {
  return (
    <>
      <Skeleton className="w-full h-[20px] rounded-full " />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="w-full flex flex-col gap-2">
            <div className="h-5 bg-gray-200 w-3/5" />
            <div className="h-5 w-2/5 bg-gray-200" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="w-full flex flex-col gap-2">
            <div className="h-5 bg-gray-200 w-3/5" />
            <div className="h-5 w-2/5 bg-gray-200" />
          </div>
        </div>
      </div>
      <Skeleton />
      <CourseListSkeleton />
    </>
  );
};

export default DashboardSkeleton;
