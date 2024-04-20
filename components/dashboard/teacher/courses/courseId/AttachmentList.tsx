"use client";

import { Attachment } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";


interface AttachmentsListProps {
  items: Attachment[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export default function AttachmentsList({
  items,
  onReorder,
  onEdit,
}: AttachmentsListProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [attachments, setAttachments] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setAttachments(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(attachments);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedAttachments = items.slice(startIndex, endIndex + 1);

    setAttachments(items);

    const bulkUpdateData = updatedAttachments.map((attachment) => ({
      id: attachment.id,
      position: items.findIndex((item) => item.id === attachment.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="attachments">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {attachments.map((attachment, index) => (
              <Draggable
                key={attachment.id}
                draggableId={attachment.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className="mb-4 flex items-center gap-x-2 rounded-md border border-slate-200 bg-slate-200 text-sm text-slate-700"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className="rounded-l-md border-r border-r-slate-200 px-2 py-3 transition hover:bg-slate-300"
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {attachment.title}
                    <div className="ml-auto flex items-center gap-x-2 pr-2">
                      <Pencil
                        onClick={() => onEdit(attachment.id)}
                        className="h-4 w-4 cursor-pointer transition hover:opacity-75"
                      />
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
