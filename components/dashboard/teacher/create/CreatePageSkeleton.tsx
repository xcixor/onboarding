import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const CreatePageSkeleton = () => {
  return (
    <Skeleton className="h-full flex items-center justify-center">
      <div role="status" className="animate-pulse border p-10 basis-2/3 h-2/6">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
        <div className="flex gap-4">
          <div className="h-8 bg-gray-300 rounded-sm dark:bg-gray-700 w-24 mb-4" />
          <div className="h-8 bg-gray-300 rounded-sm dark:bg-gray-700 w-24 mb-4" />
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </Skeleton>
  );
};

export default CreatePageSkeleton;
