// components/survey-builder/LogicBuilder/index.tsx
import { useState } from "react";
import {
  Question,
  LogicCondition,
  LogicAction,
  LogicOperator,
  LogicActionType,
} from "@/@types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TrashIcon, PlusIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";

interface LogicBuilderProps {
  question: Question;
  allQuestions?: Question[];
  onUpdate: (logic: Question["logic"]) => void;
}

export function LogicBuilder({
  question,
  allQuestions = [],
  onUpdate,
}: LogicBuilderProps) {
  const [selectedAction, setSelectedAction] = useState<LogicActionType | null>(
    null,
  );

  // const availableQuestions = allQuestions.reduce((acc, q) => {
  //   const isAvailable = q.id !== question.id && q.order < question.order;
  //   console.log("Processing question:", {
  //     questionId: q.id,
  //     questionOrder: q.order,
  //     currentQuestionId: question.id,
  //     currentQuestionOrder: question.order,
  //     isAvailable,
  //     accumulatorLength: acc.length,
  //   });

  //   if (isAvailable) {
  //     acc.push(q);
  //   }
  //   return acc;
  // }, [] as Question[]);
  const availableQuestions = allQuestions.filter((q) => q.id !== question.id);
  const availableSkipTargets = allQuestions.filter(
    (q) => q.id !== question.id && q.order > question.order,
  );
  console.log("Available Questions:", availableSkipTargets);

  const addLogicRule = () => {
    if (!selectedAction) return;

    const newLogic = {
      id: crypto.randomUUID(),
      questionId: question.id,
      conditions: [
        {
          sourceQuestionId: "",
          operator: LogicOperator.EQUALS,
          value: "",
        },
      ],
      action: {
        type: selectedAction,
        targetQuestionIds: [],
      },
    };

    onUpdate([...(question.logic || []), newLogic]);
    setSelectedAction(null);
  };

  const updateLogicConditions = (
    logicId: string,
    conditions: LogicCondition[],
  ) => {
    onUpdate(
      question.logic?.map((logic) =>
        logic.id === logicId ? { ...logic, conditions } : logic,
      ),
    );
  };

  const updateLogicAction = (logicId: string, action: LogicAction) => {
    onUpdate(
      question.logic?.map((logic) =>
        logic.id === logicId ? { ...logic, action } : logic,
      ),
    );
  };

  const removeLogic = (logicId: string) => {
    onUpdate(question.logic?.filter((logic) => logic.id !== logicId));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select
          value={selectedAction || ""}
          onValueChange={(value) => setSelectedAction(value as LogicActionType)}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Add logic rule" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(LogicActionType).map((actionType) => (
              <SelectItem key={actionType} value={actionType}>
                {formatActionType(actionType)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addLogicRule} disabled={!selectedAction}>
          <PlusIcon className="mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="space-y-4">
        {question.logic?.map((logic) => (
          <LogicRule
            key={logic.id}
            logic={logic}
            availableQuestions={availableQuestions}
            availableSkipTargets={availableSkipTargets}
            onUpdateConditions={(conditions) =>
              updateLogicConditions(logic.id, conditions)
            }
            onUpdateAction={(action) => updateLogicAction(logic.id, action)}
            onRemove={() => removeLogic(logic.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface LogicRuleProps {
  logic: Question["logic"][0];
  availableQuestions: Question[];
  availableSkipTargets: Question[];
  onUpdateConditions: (conditions: LogicCondition[]) => void;
  onUpdateAction: (action: LogicAction) => void;
  onRemove: () => void;
}

function LogicRule({
  logic,
  availableQuestions,
  availableSkipTargets,
  onUpdateConditions,
  onUpdateAction,
  onRemove,
}: LogicRuleProps) {
  const addCondition = () => {
    onUpdateConditions([
      ...logic.conditions,
      {
        sourceQuestionId: "",
        operator: LogicOperator.EQUALS,
        value: "",
      },
    ]);
  };

  const updateCondition = (index: number, updates: Partial<LogicCondition>) => {
    onUpdateConditions(
      logic.conditions.map((condition, i) =>
        i === index ? { ...condition, ...updates } : condition,
      ),
    );
  };

  const removeCondition = (index: number) => {
    onUpdateConditions(logic.conditions.filter((_, i) => i !== index));
  };

  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{formatActionType(logic.action.type)}</h4>
        <Button variant="ghost" size="sm" onClick={onRemove}>
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label>If</Label>
        {logic.conditions.map((condition, index) => (
          <div key={index} className="flex items-center gap-2">
            <Select
              value={condition.sourceQuestionId}
              onValueChange={(value) =>
                updateCondition(index, { sourceQuestionId: value })
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select question" />
              </SelectTrigger>
              <SelectContent>
                {availableQuestions.map((q) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={condition.operator}
              onValueChange={(value) =>
                updateCondition(index, { operator: value as LogicOperator })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(LogicOperator).map((operator) => (
                  <SelectItem key={operator} value={operator}>
                    {formatOperator(operator)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={condition.value}
              onChange={(e) =>
                updateCondition(index, { value: e.target.value })
              }
              placeholder="Value"
              className="flex-1"
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeCondition(index)}
              disabled={logic.conditions.length === 1}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={addCondition}>
        <PlusIcon className="mr-2" />
        Add Condition
      </Button>

      <div className="space-y-2">
        <Label>Then</Label>
        {logic.action.type === LogicActionType.SKIP ? (
          <Select
            value={logic.action.targetQuestionIds[0] || ""}
            onValueChange={(value) =>
              onUpdateAction({
                ...logic.action,
                targetQuestionIds: [value],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select question to skip to" />
            </SelectTrigger>
            <SelectContent>
              {availableSkipTargets.map((q) => (
                <SelectItem key={q.id} value={q.id}>
                  {q.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <MultiSelect
            values={logic.action.targetQuestionIds}
            onChange={(values) =>
              onUpdateAction({
                ...logic.action,
                targetQuestionIds: values,
              })
            }
            options={availableQuestions.map((q) => ({
              label: q.title,
              value: q.id,
            }))}
          />
        )}
      </div>
    </Card>
  );
}

function formatActionType(type: LogicActionType): string {
  switch (type) {
    case LogicActionType.SHOW:
      return "Show Questions";
    case LogicActionType.HIDE:
      return "Hide Questions";
    case LogicActionType.SKIP:
      return "Skip To";
    case LogicActionType.REQUIRE:
      return "Make Required";
    default:
      return type;
  }
}

function formatOperator(operator: LogicOperator): string {
  switch (operator) {
    case LogicOperator.EQUALS:
      return "Equals";
    case LogicOperator.NOT_EQUALS:
      return "Not Equals";
    case LogicOperator.GREATER_THAN:
      return "Greater Than";
    case LogicOperator.LESS_THAN:
      return "Less Than";
    case LogicOperator.CONTAINS:
      return "Contains";
    case LogicOperator.NOT_CONTAINS:
      return "Not Contains";
    case LogicOperator.STARTS_WITH:
      return "Starts With";
    case LogicOperator.ENDS_WITH:
      return "Ends With";
    default:
      return operator;
  }
}
