import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const AnalyticsPageSkeleton = () => {
  return (
    <Skeleton className="w-full">
      <div className="flex sm:flex-row gap-2 mb-5">
        <div className="bg-gray-200 rounded-md w-1/2 py-3 border shadow-sm my-5 h-[100px] flex justify-center flex-col ps-4">
          <div className="w-1/3 bg-gray-300 h-2 rounded-md animate-pulse mb-2" />
          <div className="w-1/3 bg-gray-300 h-2 rounded-md animate-pulse mb-2" />
        </div>
        <div className="bg-gray-200 rounded-md w-1/2 py-3 border shadow-sm my-5 h-[100px] flex justify-center flex-col ps-4">
          <div className="w-1/3 bg-gray-300 h-2 rounded-md animate-pulse mb-2" />
          <div className="w-1/3 bg-gray-300 h-2 rounded-md animate-pulse mb-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 w-full">
        {Array(2)
          .fill(0)
          .map((el, index) => (
            <div
              key={index}
              role="status"
              className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700 md:w-1/2"
            >
              <div className="flex items-baseline mt-4 space-x-6">
                <div className="w-full bg-gray-200 rounded-t-lg h-72 dark:bg-gray-700"></div>
                <div className="w-full h-56 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-72 dark:bg-gray-700"></div>
                <div className="w-full h-64 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-80 dark:bg-gray-700"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-72 dark:bg-gray-700"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-80 dark:bg-gray-700"></div>
              </div>
              <div className="sr-only">Loading...</div>
            </div>
          ))}
      </div>
    </Skeleton>
  );
};

export default AnalyticsPageSkeleton;
