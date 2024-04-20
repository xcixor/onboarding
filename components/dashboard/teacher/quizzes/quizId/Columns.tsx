"use client";

import { Quiz } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SubmissionProps = {
  studentName: string;
  studentScore: number;
  passed: boolean;
};
export const columns: ColumnDef<SubmissionProps>[] = [
  {
    accessorKey: "studentName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "studentScore",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const studentScore = parseFloat(row.getValue("studentScore") || "0");

      return <div>{studentScore}%</div>;
    },
  },
  {
    accessorKey: "passed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Verdict
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const passed = row.getValue("passed");

      return (
        <Badge className={cn("bg-green-500", !passed && "bg-red-500")}>
          {passed ? "Pass" : "Fail"}
        </Badge>
      );
    },
  },
];
