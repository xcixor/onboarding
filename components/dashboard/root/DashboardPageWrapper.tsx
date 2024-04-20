import React from "react";
import InfoCard from "./InfoCard";
import CoursesList from "@/components/CoursesList";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CheckCircle, Clock } from "lucide-react";

type Props = {
  userId: string;
};

const DashboardPageWrapper = async ({ userId }: Props) => {
  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-pes-red">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
};

export default DashboardPageWrapper;
