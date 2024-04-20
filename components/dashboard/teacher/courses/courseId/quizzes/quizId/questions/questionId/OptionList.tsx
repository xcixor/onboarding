"use client";

import { Option } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil, Trash2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import OptionTitleForm from "./OptionTitleForm";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface OptionsListProps {
  items: Option[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  courseId: string;
  quizId: string;
  questionId: string;
  // onEdit: (id: string) => void;
}

export default function OptionsList({
  items,
  onReorder,
  courseId,
  quizId,
  questionId,
}: OptionsListProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [options, setOptions] = useState(items);

  const [isEditingOptionTitle, setIsEditingOptionTitle] =
    useState<boolean>(false);
  const [editingTitleId, setEditingTitleId] = useState<string>("");

  const handleEdit = (id: string) => {
    setIsEditingOptionTitle(true);
    setEditingTitleId(id);
  };
  const toggleEditingOptionTitle = () =>
    setIsEditingOptionTitle((current) => !current);
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `/api/courses/${courseId}/quizzes/${quizId}/questions/${questionId}/options/${id}`
      );

      toast.success("Option deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      toggleEditingOptionTitle();
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setOptions(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(options);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedOptions = items.slice(startIndex, endIndex + 1);

    setOptions(items);

    const bulkUpdateData = updatedOptions.map((options) => ({
      id: options.id,
      position: items.findIndex((item) => item.id === options.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="options">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {options.map((option, index) => (
              <Draggable key={option.id} draggableId={option.id} index={index}>
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      option.isAnswer &&
                        "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        option.isAnswer && "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {isEditingOptionTitle && editingTitleId === option.id ? (
                      <OptionTitleForm
                        courseId={courseId}
                        questionId={questionId}
                        quizId={quizId}
                        initialData={{
                          title: option.title,
                        }}
                        optionId={editingTitleId}
                        toggleEditingOptionTitle={toggleEditingOptionTitle}
                      />
                    ) : (
                      <>
                        {option.title}
                        <Pencil
                          onClick={() => handleEdit(option.id)}
                          className="w-4 h-4 cursor-pointer hover:opacity-75 transition ml-5"
                        />
                      </>
                    )}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          option.isAnswer && "bg-sky-700"
                        )}
                      >
                        {option.isAnswer ? "Correct Answer" : "Incorrect"}
                      </Badge>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(option.id)}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
