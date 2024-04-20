import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const CourseIdSkeleton = () => {
  return (
    <Skeleton className="w-full h-full ">
      <div className="h-16 bg-gray-300 mb-4 " />
      <div className="p-4">
        {Array(6)
          .fill(0)
          .map((el, index) => (
            <div
              className="flex justify-between sm:flex-row gap-5 mb-5"
              key={index}
            >
              <div className="basis-1/2 animate-pulse rounded-lg p-8 border shadow-sm">
                <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5" />
                <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5" />
              </div>
              <div className="basis-1/2 animate-pulse rounded-lg p-8 border shadow-sm">
                <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5" />
                <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5" />
              </div>
            </div>
          ))}
      </div>
    </Skeleton>
  );
};

export default CourseIdSkeleton;
