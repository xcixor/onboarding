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
import { formatPrice } from "@/lib/format";

export const columns: ColumnDef<
  DocumentReview & { user: User & { profile: Profile } }
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
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reviewer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const reviewer = row.getValue("user") as User & { profile: Profile };
      return (
        <div>
          {reviewer.profile.firstName}&nbsp;{reviewer.profile.lastName}
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
              href={`/dashboard/document-review/${id}?callbackUrl=/dashboard/document-review`}
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
