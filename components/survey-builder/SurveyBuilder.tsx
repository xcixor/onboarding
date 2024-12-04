// components/survey-builder/SurveyBuilder.tsx
"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Survey, Question, QuestionType } from "@/@types";
import { QuestionList } from "./QuestionList";
import { QuestionEditor } from "./QuestionEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { SurveyPreview } from "./SurveyPreview";

interface SurveyBuilderProps {
  initialSurvey: Survey;
}

export function SurveyBuilder({ initialSurvey }: SurveyBuilderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [survey, setSurvey] = useState<Survey>(initialSurvey);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    survey?.questions[0]?.id || null,
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const selectedQuestion = survey?.questions.find(
    (q) => q.id === selectedQuestionId,
  );

  const updateSurveyDetails = async (updates: Partial<Survey>) => {
    try {
      const response = await fetch(`/api/surveys/${survey.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update survey");

      const updatedSurvey = await response.json();
      setSurvey(updatedSurvey);
      toast({
        title: "Success",
        description: "Survey updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update survey",
        variant: "destructive",
      });
    }
  };

  const addQuestion = async () => {
    try {
      // Get the current highest order
      const currentMaxOrder = Math.max(
        ...survey.questions.map((q) => q.order),
        -1,
      );

      const response = await fetch(`/api/surveys/${survey.id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Question",
          type: QuestionType.TEXT,
          required: false,
          order: currentMaxOrder + 1, // Explicitly set the order
        }),
      });

      if (!response.ok) throw new Error("Failed to add question");

      const newQuestion = await response.json();
      setSurvey((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));
      setSelectedQuestionId(newQuestion.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add question",
        variant: "destructive",
      });
    }
  };

  const updateQuestion = useCallback(
    async (questionId: string, updates: Partial<Question>) => {
      try {
        const response = await fetch(
          `/api/surveys/${survey.id}/questions/${questionId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          },
        );

        if (!response.ok) throw new Error("Failed to update question");

        const updatedQuestion = await response.json();
        setSurvey((prev) => ({
          ...prev,
          questions: prev.questions.map((q) =>
            q.id === questionId ? updatedQuestion : q,
          ),
        }));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update question",
          variant: "destructive",
        });
      }
    },
    [survey?.id, toast],
  );

  const deleteQuestion = async (questionId: string) => {
    try {
      const response = await fetch(
        `/api/surveys/${survey.id}/questions/${questionId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete question");

      setSurvey((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.id !== questionId),
      }));
      setSelectedQuestionId(survey.questions[0]?.id || null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const handleQuestionReorder = async (reorderedQuestions: Question[]) => {
    const updatedQuestions = reorderedQuestions.map((question, index) => ({
      ...question,
      order: index,
    }));

    try {
      // Update the order in the database
      await fetch(`/api/surveys/${survey.id}/questions/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: updatedQuestions }),
      });

      setSurvey((prev) => ({
        ...prev,
        questions: updatedQuestions,
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder questions",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between border-b p-4">
        <div className="mx-4 flex flex-1 flex-col gap-2">
          <Input
            value={survey?.title}
            onChange={(e) => updateSurveyDetails({ title: e.target.value })}
            placeholder="Survey Title"
            className="text-2xl font-bold"
          />
          <Textarea
            value={survey?.description || ""}
            onChange={(e) =>
              updateSurveyDetails({ description: e.target.value })
            }
            placeholder="Survey Description"
            className="text-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? "Edit" : "Preview"}
          </Button>
          <Button
            variant={survey?.published ? "secondary" : "default"}
            onClick={() =>
              updateSurveyDetails({ published: !survey.published })
            }
          >
            {survey?.published ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 p-4">
        {!isPreviewMode ? (
          <>
            <div className="w-1/3 rounded-lg border p-4">
              <QuestionList
                questions={survey?.questions}
                selectedQuestionId={selectedQuestionId}
                onQuestionSelect={setSelectedQuestionId}
                onAddQuestion={addQuestion}
                onReorderQuestions={handleQuestionReorder}
              />
            </div>
            <div className="w-2/3 rounded-lg border p-4">
              {selectedQuestion && (
                <QuestionEditor
                  question={selectedQuestion}
                  onUpdate={(updates) =>
                    updateQuestion(selectedQuestion.id, updates)
                  }
                  onDelete={() => deleteQuestion(selectedQuestion.id)}
                  allQuestions={survey?.questions}
                />
              )}
            </div>
          </>
        ) : (
          <div className="w-full rounded-lg border p-4">
            <SurveyPreview survey={survey} />
          </div>
        )}
      </div>
    </div>
  );
}
