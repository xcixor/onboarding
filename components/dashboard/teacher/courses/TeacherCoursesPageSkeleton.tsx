import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type Props = {};

export const TeacherCoursesPageSkeleton = (props: Props) => {
  return (
    <Skeleton className="p-4 h-full flex flex-col justify-between">
      <div className="flex sm:flex-col md:flex-row justify-between mb-6">
        <div className="h-[40px] bg-gray-300  rounded w-1/3" />
        <div className="h-[40px] bg-gray-600  rounded w-[120px]" />
      </div>
      <div className="animate-pulse">
        {Array(8)
          .fill(0)
          .map((el, index) => (
            <div className="h-6 bg-gray-300 mb-6 rounded" key={index} />
          ))}
      </div>
      <div className="flex justify-end gap-4 w-full">
        <div className="h-[40px] bg-gray-500  rounded w-[60px]" />
        <div className="h-[40px] bg-gray-500  rounded w-[60px]" />
      </div>
    </Skeleton>
  );
};
