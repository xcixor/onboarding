import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

export const CourseListSkeleton = (props: Props) => {
  return (
    <div>
      <Skeleton className="w-full p-4">
        <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-4">
          {Array(8)
            .fill(0)
            .map((el, index) => (
              <div key={index} className="mb-4">
                <div className="group hover:shadow-sm transition overflow-hidden border rounded-sm p-3 h-full">
                  <div className="rounded-md bg-gray-300 w-full animate-pulse h-[120px] flex justify-center items-center">
                    <svg
                      className="w-10 h-10 text-gray-200 dark:text-gray-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2 w-9/12 h-[40px] mt-2">
                    <span className="w-11/12 bg-gray-300 h-2 rounded-full animate-pulse"></span>
                    <span className="w-9/12 bg-gray-300 h-2 rounded-full animate-pulse"></span>
                    <span className="w-9/12 bg-gray-300 h-2 rounded-full animate-pulse"></span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Skeleton>
    </div>
  );
};
