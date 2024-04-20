"use client";

import {
  DocumentReviewStatus,
  DocumentReview,
  User,
  Profile,
} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<
  DocumentReview & { owner: User & { profile: Profile } }
>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "owner",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Owner
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const owner = row.getValue("owner") as User & { profile: Profile };
    
      return (
        <div>
          {owner.profile.firstName}&nbsp;{owner.profile.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") || false;

      return (
        <Badge
          className={cn(
            "bg-slate-500 capitalize",
            status === DocumentReviewStatus.APPROVED
              ? "bg-sky-700"
              : status === DocumentReviewStatus.REVIEWED
                ? "bg-green-700"
                : "",
          )}
        >
          {status === DocumentReviewStatus.APPROVED
            ? "Approved"
            : status === DocumentReviewStatus.REVIEWED
              ? "Reviewed"
              : "Pending"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link
              href={`/dashboard/teacher/document-review/${id}`}
            >
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4 " />
                Preview
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
