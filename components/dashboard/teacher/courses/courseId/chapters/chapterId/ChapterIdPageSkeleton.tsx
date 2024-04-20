import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ChapterIdPageSkeleton = () => {
  return (
    <Skeleton className="w-full h-full ">
      <div className="h-16 bg-gray-300 mb-4 " />
      <div className="flex justify-between w-full">
        <div className="p-4 flex-1">
          {Array(3)
            .fill(0)
            .map((el, index) => (
              <div key={index} className="basis-1/2 animate-pulse rounded-lg p-8 border shadow-sm mb-6">
                <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5" />
                <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5" />
              </div>
            ))}
        </div>
        <div
          role="status"
          className="flex-1 flex items-center justify-center  bg-gray-300 animate-pulse dark:bg-gray-500 my-5"
        >
          <div className="bg-gray-400 w-2/3 h-2/3 flex items-center justify-center rounded-sm">
            <svg
              className="h-10 w-10 text-gray-200 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 20"
            >
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
            </svg>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </Skeleton>
  );
};

export default ChapterIdPageSkeleton;
