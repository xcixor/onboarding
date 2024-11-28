"use client";

import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TranslatedHeader from "./TranslatedHeader";
import TranslatedActions from "./TranslatedActions";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <TranslatedHeader column={column} translationKey="name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <TranslatedHeader column={column} translationKey="email" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <TranslatedHeader column={column} translationKey="role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role").toString().toLowerCase();

      return <p className="capitalize text-slate-500">{role}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return <TranslatedActions id={id} />;
    },
  },
];
