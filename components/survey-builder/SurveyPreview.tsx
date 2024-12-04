// components/survey-builder/SurveyPreview.tsx
"use client";

import { useState } from "react";
import { Survey, Question, QuestionType, LogicActionType } from "@/@types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SurveyPreviewProps {
  survey: Survey;
}

export function SurveyPreview({ survey }: SurveyPreviewProps) {
  const [visibleQuestions, setVisibleQuestions] = useState<Set<string>>(
    new Set(survey.questions.map((q) => q.id)),
  );
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const evaluateLogic = (question: Question, value: any) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    const newVisibleQuestions = new Set(visibleQuestions);

    survey.questions.forEach((q) => {
      if (q.logic) {
        q.logic.forEach((logic) => {
          const conditionsMet = logic.conditions.every((condition) => {
            const sourceAnswer = newAnswers[condition.sourceQuestionId];
            if (sourceAnswer === undefined) return false;

            switch (condition.operator) {
              case "EQUALS":
                return sourceAnswer === condition.value;
              case "NOT_EQUALS":
                return sourceAnswer !== condition.value;
              case "GREATER_THAN":
                return sourceAnswer > condition.value;
              case "LESS_THAN":
                return sourceAnswer < condition.value;
              case "CONTAINS":
                return sourceAnswer.includes(condition.value);
              case "NOT_CONTAINS":
                return !sourceAnswer.includes(condition.value);
              case "STARTS_WITH":
                return sourceAnswer.startsWith(condition.value);
              case "ENDS_WITH":
                return sourceAnswer.endsWith(condition.value);
              default:
                return false;
            }
          });

          switch (logic.action.type) {
            case LogicActionType.SHOW:
              if (conditionsMet) {
                logic.action.targetQuestionIds.forEach((id) =>
                  newVisibleQuestions.add(id),
                );
              }
              break;
            case LogicActionType.HIDE:
              if (conditionsMet) {
                logic.action.targetQuestionIds.forEach((id) =>
                  newVisibleQuestions.delete(id),
                );
              }
              break;
            case LogicActionType.SKIP:
              if (conditionsMet && logic.action.targetQuestionIds.length > 0) {
                const targetIndex = survey.questions.findIndex(
                  (q) => q.id === logic.action.targetQuestionIds[0],
                );
                if (targetIndex > -1) {
                  setCurrentQuestionIndex(targetIndex);
                }
              }
              break;
          }
        });
      }
    });

    setVisibleQuestions(newVisibleQuestions);
  };

  const handleAnswerChange = (question: Question, value: any) => {
    evaluateLogic(question, value);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{survey.title}</h1>
        {survey.description && (
          <p className="text-muted-foreground">{survey.description}</p>
        )}
      </div>

      <div className="space-y-6">
        {survey.questions.map((question, index) => (
          <QuestionPreview
            key={question.id}
            question={question}
            visible={visibleQuestions.has(question.id)}
            answer={answers[question.id]}
            onAnswerChange={(value) => handleAnswerChange(question, value)}
          />
        ))}
      </div>
    </div>
  );
}

interface QuestionPreviewProps {
  question: Question;
  visible: boolean;
  answer: any;
  onAnswerChange: (value: any) => void;
}

function QuestionPreview({
  question,
  visible,
  answer,
  onAnswerChange,
}: QuestionPreviewProps) {
  if (!visible) return null;

  return (
    <Card className="space-y-4 p-4">
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <h3 className="text-lg font-medium">{question.title}</h3>
          {question.required && <span className="text-sm text-red-500">*</span>}
        </div>
        {question.explanation?.text && (
          <p className="text-sm text-muted-foreground">
            {question.explanation.text}
          </p>
        )}
        {question.explanation?.mediaUrl && (
          <div className="mt-2">
            {question.explanation.mediaType === "IMAGE" && (
              <img
                src={question.explanation.mediaUrl}
                alt="Question explanation"
                className="max-w-full rounded-lg"
              />
            )}
            {question.explanation.mediaType === "VIDEO" && (
              <video
                src={question.explanation.mediaUrl}
                controls
                className="max-w-full rounded-lg"
              />
            )}
            {question.explanation.mediaType === "AUDIO" && (
              <audio
                src={question.explanation.mediaUrl}
                controls
                className="w-full"
              />
            )}
          </div>
        )}
      </div>

      <div className="pt-2">
        {(() => {
          switch (question.type) {
            case QuestionType.MULTIPLE_CHOICE:
              return (
                <div className="space-y-2">
                  {question.options?.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={option.id}
                        checked={(answer || []).includes(option.id)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...(answer || []), option.id]
                            : (answer || []).filter(
                                (id: string) => id !== option.id,
                              );
                          onAnswerChange(newValue);
                        }}
                      />
                      <Label htmlFor={option.id}>{option.text}</Label>
                    </div>
                  ))}
                </div>
              );

            case QuestionType.SINGLE_CHOICE:
              return (
                <RadioGroup value={answer} onValueChange={onAnswerChange}>
                  {question.options?.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id}>{option.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
              );

            case QuestionType.TEXT:
              return (
                <Input
                  value={answer || ""}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder="Enter your answer"
                  className={cn(
                    "w-full",
                    question.validation?.rules.some(
                      (r) => r.type === "EMAIL",
                    ) && "lowercase",
                  )}
                />
              );

            case QuestionType.LONG_TEXT:
              return (
                <Textarea
                  value={answer || ""}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder="Enter your answer"
                  className="w-full resize-none"
                  rows={4}
                />
              );

            case QuestionType.NUMBER:
              return (
                <Input
                  type="number"
                  value={answer || ""}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder="Enter a number"
                  className="w-full"
                />
              );

            case QuestionType.DATE:
              return (
                <Input
                  type="date"
                  value={answer || ""}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  className="w-full"
                />
              );

            case QuestionType.TIME:
              return (
                <Input
                  type="time"
                  value={answer || ""}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  className="w-full"
                />
              );

            case QuestionType.RATING:
              return (
                <div className="flex gap-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => onAnswerChange(i + 1)}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary hover:bg-primary/10",
                        answer === i + 1 &&
                          "bg-primary text-white hover:bg-primary",
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              );

            case QuestionType.FILE_UPLOAD:
              return (
                <div className="cursor-pointer rounded-lg border-2 border-dashed p-6 text-center text-muted-foreground hover:bg-muted/50">
                  Click or drag and drop to upload files
                </div>
              );

            default:
              return <div>Unsupported question type</div>;
          }
        })()}
      </div>
    </Card>
  );
}
