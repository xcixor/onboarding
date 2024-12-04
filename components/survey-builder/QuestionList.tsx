// components/survey-builder/QuestionList.tsx
import { Question } from "@/@types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface QuestionListProps {
  questions: Question[];
  selectedQuestionId: string | null;
  onQuestionSelect: (id: string) => void;
  onAddQuestion: () => void;
  onReorderQuestions?: (questions: Question[]) => void;
}

export function QuestionList({
  questions,
  selectedQuestionId,
  onQuestionSelect,
  onAddQuestion,
  onReorderQuestions,
}: QuestionListProps) {
  const getQuestionPreview = (question: Question) => {
    switch (question.type) {
      case "MULTIPLE_CHOICE":
      case "SINGLE_CHOICE":
        return (
          <div className="text-sm text-muted-foreground">
            {question.options
              ?.slice(0, 2)
              .map((opt) => opt.text)
              .join(", ")}
            {(question.options?.length || 0) > 2 ? "..." : ""}
          </div>
        );
      case "TEXT":
      case "LONG_TEXT":
        return (
          <div className="text-sm text-muted-foreground">Text response</div>
        );
      case "EMAIL":
        return <div className="text-sm text-muted-foreground">Email input</div>;
      case "NUMBER":
        return (
          <div className="text-sm text-muted-foreground">Number input</div>
        );
      case "DATE":
        return <div className="text-sm text-muted-foreground">Date picker</div>;
      case "TIME":
        return <div className="text-sm text-muted-foreground">Time picker</div>;
      case "RATING":
        return (
          <div className="text-sm text-muted-foreground">Rating scale</div>
        );
      case "FILE_UPLOAD":
        return <div className="text-sm text-muted-foreground">File upload</div>;
      case "CHECKBOX":
        return (
          <div className="text-sm text-muted-foreground">Checkbox options</div>
        );
      default:
        return null;
    }
  };

  const handleDragEnd = useCallback(
    (result: any) => {
      if (!result.destination || !onReorderQuestions) return;

      const items = Array.from(questions);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      // Update order property for each question
      const updatedQuestions = items.map((question, index) => ({
        ...question,
        order: index,
      }));

      onReorderQuestions(updatedQuestions);
    },
    [questions, onReorderQuestions],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Questions</h3>
        <Button onClick={onAddQuestion} size="sm">
          Add Question
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex-1 space-y-2 overflow-y-auto"
            >
              {questions?.map((question, index) => (
                <Draggable
                  key={question.id}
                  draggableId={question.id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`cursor-pointer p-3 ${
                        selectedQuestionId === question.id
                          ? "border-primary"
                          : ""
                      }`}
                      onClick={() => onQuestionSelect(question.id)}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          {...provided.dragHandleProps}
                          className="mt-1 text-muted-foreground"
                        >
                          <DragHandleDots2Icon />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">
                            {question.title || "Untitled Question"}
                          </div>
                          {getQuestionPreview(question)}
                          {question.required && (
                            <div className="mt-1 text-xs text-red-500">
                              Required
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
