// components/survey-builder/QuestionTypes/index.tsx
import { Question, QuestionType, QuestionOption } from "@/@types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  PlusIcon,
  MinusIcon,
  DragHandleDots2Icon,
} from "@radix-ui/react-icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface QuestionTypeEditorProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}

export function QuestionTypeEditor({
  question,
  onUpdate,
}: QuestionTypeEditorProps) {
  switch (question.type) {
    case QuestionType.MULTIPLE_CHOICE:
    case QuestionType.SINGLE_CHOICE:
    case QuestionType.CHECKBOX:
      return <ChoiceEditor question={question} onUpdate={onUpdate} />;
    case QuestionType.TEXT:
      return <TextEditor question={question} onUpdate={onUpdate} />;
    case QuestionType.LONG_TEXT:
      return <LongTextEditor question={question} onUpdate={onUpdate} />;
    case QuestionType.NUMBER:
      return <NumberEditor question={question} onUpdate={onUpdate} />;
    case QuestionType.RATING:
      return <RatingEditor question={question} onUpdate={onUpdate} />;
    case QuestionType.FILE_UPLOAD:
      return <FileUploadEditor question={question} onUpdate={onUpdate} />;
    default:
      return <DefaultEditor question={question} onUpdate={onUpdate} />;
  }
}

// Choice-based questions (Multiple Choice, Single Choice, Checkbox)
function ChoiceEditor({ question, onUpdate }: QuestionTypeEditorProps) {
  const addOption = () => {
    const newOption: QuestionOption = {
      id: crypto.randomUUID(),
      questionId: question.id,
      text: "",
      order: question.options?.length || 0,
    };

    onUpdate({
      options: [...(question.options || []), newOption],
    });
  };

  const updateOption = (optionId: string, text: string) => {
    onUpdate({
      options: question.options?.map((opt) =>
        opt.id === optionId ? { ...opt, text } : opt,
      ),
    });
  };

  const removeOption = (optionId: string) => {
    onUpdate({
      options: question.options?.filter((opt) => opt.id !== optionId),
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(question.options || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdate({
      options: items.map((item, index) => ({ ...item, order: index })),
    });
  };

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="options">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {question.options?.map((option, index) => (
                <Draggable
                  key={option.id}
                  draggableId={option.id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="mb-2 flex items-center gap-2 p-2"
                    >
                      <div {...provided.dragHandleProps}>
                        <DragHandleDots2Icon className="text-muted-foreground" />
                      </div>
                      <Input
                        value={option.text}
                        onChange={(e) =>
                          updateOption(option.id, e.target.value)
                        }
                        placeholder="Option text"
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeOption(option.id)}
                      >
                        <MinusIcon />
                      </Button>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        variant="outline"
        size="sm"
        onClick={addOption}
        className="w-full"
      >
        <PlusIcon className="mr-2" />
        Add Option
      </Button>
    </div>
  );
}

// Text input question
function TextEditor({ question, onUpdate }: QuestionTypeEditorProps) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Example: Your answer here"
        disabled
        className="bg-muted"
      />
    </div>
  );
}

// Long text input question
function LongTextEditor({ question, onUpdate }: QuestionTypeEditorProps) {
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Example: Your detailed answer here"
        disabled
        className="bg-muted"
      />
    </div>
  );
}

// Number input question
function NumberEditor({ question, onUpdate }: QuestionTypeEditorProps) {
  return (
    <div className="space-y-4">
      <Input type="number" placeholder="0" disabled className="bg-muted" />
    </div>
  );
}

// Rating question
function RatingEditor({ question, onUpdate }: QuestionTypeEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            variant="outline"
            size="lg"
            disabled
            className="h-12 w-12"
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
}

// File upload question
function FileUploadEditor({ question, onUpdate }: QuestionTypeEditorProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-dashed p-6 text-center text-muted-foreground">
        Click or drag and drop to upload files
      </div>
    </div>
  );
}

// Default editor for other question types
function DefaultEditor({ question, onUpdate }: QuestionTypeEditorProps) {
  return (
    <div className="space-y-4">
      <Input placeholder="Answer input" disabled className="bg-muted" />
    </div>
  );
}
