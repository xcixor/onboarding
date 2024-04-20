type Props = {};

export const CategoryItemSkeleton = (props: Props) => {
  return (
    <div className="rounded-2xl p-4">
      <div className="rounded-2xl bg-gray-300 w-[80px] animate-pulse h-[30px]"></div>
    </div>
  );
};
