import { Skeleton } from "@/components/ui/skeleton";

const QuestionIdPageSkeleton = () => {
  return (
    <Skeleton className="w-full h-full ">
      <div className="h-16 bg-gray-300 mb-4 " />
      <div className="px-4">
        <div className="w-2/3 animate-pulse rounded-lg p-8 border shadow-sm mb-4">
          <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5" />
          <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5" />
        </div>
        <div className="animate-pulse rounded-lg p-8 border shadow-sm">
          {Array(5)
            .fill(0)
            .map((el, index) => (
              <div
                key={index}
                className="h-[40px] bg-gray-200 rounded-sm dark:bg-gray-500 mb-10"
              />
            ))}
        </div>
      </div>
    </Skeleton>
  );
};

export default QuestionIdPageSkeleton;
