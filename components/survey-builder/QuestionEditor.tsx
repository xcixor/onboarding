// components/survey-builder/QuestionEditor.tsx
import { useState } from "react";
import {
  Question,
  QuestionType,
  ValidationRuleType,
  ValidationRule,
} from "@/@types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TrashIcon } from "@radix-ui/react-icons";
import { QuestionTypeEditor } from "./QuestionTypes";
import { ValidationBuilder } from "./ValidationBuilder";
import { LogicBuilder } from "./LogicBuilder";
import { QuestionExplanationEditor } from "./QuestionExplanation";

interface QuestionEditorProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  allQuestions?: Question[];
}

export function QuestionEditor({
  question,
  onUpdate,
  onDelete,
  allQuestions,
}: QuestionEditorProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const handleTypeChange = (newType: QuestionType) => {
    // Reset options when changing from choice-based to non-choice-based types
    const updates: Partial<Question> = { type: newType };
    if (
      newType !== QuestionType.MULTIPLE_CHOICE &&
      newType !== QuestionType.SINGLE_CHOICE &&
      newType !== QuestionType.CHECKBOX
    ) {
      updates.options = [];
    }
    onUpdate(updates);
  };

  const handleValidationChange = (rules: ValidationRule[]) => {
    onUpdate({
      validation: {
        ...question.validation,
        rules,
      },
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Edit Question</h3>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <TrashIcon className="mr-2" />
          Delete
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="logic">Logic</TabsTrigger>
          <TabsTrigger value="explanation">Explanation</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-4">
            <Input
              value={question.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Question text"
            />

            <div className="flex items-center justify-between">
              <Select
                value={question.type}
                onValueChange={(value) =>
                  handleTypeChange(value as QuestionType)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(QuestionType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={question.required}
                  onCheckedChange={(checked) => onUpdate({ required: checked })}
                />
                <span>Required</span>
              </div>
            </div>

            <QuestionTypeEditor question={question} onUpdate={onUpdate} />
          </div>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <ValidationBuilder
            questionType={question.type}
            rules={question.validation?.rules || []}
            onChange={handleValidationChange}
          />
        </TabsContent>

        <TabsContent value="logic" className="space-y-4">
          <LogicBuilder
            question={question}
            onUpdate={(logic) => onUpdate({ logic })}
            allQuestions={allQuestions}
          />
        </TabsContent>

        <TabsContent value="explanation" className="space-y-4">
          <QuestionExplanationEditor
            explanation={question.explanation}
            onUpdate={(explanation) => onUpdate({ explanation })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
