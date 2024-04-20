import { CategoryItemSkeleton } from "@/components/skeletons/CategoryItemSkeleton";
import { CourseListSkeleton } from "@/components/skeletons/CourseListSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type Props = {};

const SearchPageSkeleton = (props: Props) => {
  return (
    <>
      <Skeleton className="flex flex-wrap">
        {Array(6)
          .fill(0)
          .map((el, index) => (
            <CategoryItemSkeleton key={index} />
          ))}
      </Skeleton>
      <CourseListSkeleton />
    </>
  );
};

export default SearchPageSkeleton;
