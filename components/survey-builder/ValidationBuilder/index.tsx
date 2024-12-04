// components/survey-builder/ValidationBuilder/index.tsx
import { useState } from "react";
import { QuestionType, ValidationRule, ValidationRuleType } from "@/@types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { TrashIcon, PlusIcon } from "@radix-ui/react-icons";

interface ValidationBuilderProps {
  questionType: QuestionType;
  rules: ValidationRule[];
  onChange: (rules: ValidationRule[]) => void;
}

export function ValidationBuilder({
  questionType,
  rules,
  onChange,
}: ValidationBuilderProps) {
  const [selectedRule, setSelectedRule] = useState<ValidationRuleType | null>(
    null,
  );

  const availableRules = getAvailableRules(questionType);
  const usedRules = new Set(rules.map((rule) => rule.type));

  const addRule = () => {
    if (!selectedRule) return;

    const newRule: ValidationRule = {
      type: selectedRule,
      message: getDefaultMessage(selectedRule),
      value: getDefaultValue(selectedRule),
    };

    onChange([...rules, newRule]);
    setSelectedRule(null);
  };

  const updateRule = (index: number, updates: Partial<ValidationRule>) => {
    const updatedRules = rules.map((rule, i) =>
      i === index ? { ...rule, ...updates } : rule,
    );
    onChange(updatedRules);
  };

  const removeRule = (index: number) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select
          value={selectedRule || ""}
          onValueChange={(value) =>
            setSelectedRule(value as ValidationRuleType)
          }
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Add validation rule" />
          </SelectTrigger>
          <SelectContent>
            {availableRules.map((ruleType) => (
              <SelectItem
                key={ruleType}
                value={ruleType}
                disabled={usedRules.has(ruleType)}
              >
                {formatRuleType(ruleType)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addRule} disabled={!selectedRule}>
          <PlusIcon className="mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="space-y-2">
        {rules.map((rule, index) => (
          <Card key={index} className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{formatRuleType(rule.type)}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRule(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>

            {needsValue(rule.type) && (
              <Input
                type={getInputType(rule.type)}
                value={rule.value || ""}
                onChange={(e) => updateRule(index, { value: e.target.value })}
                placeholder={getValuePlaceholder(rule.type)}
              />
            )}

            <Input
              value={rule.message}
              onChange={(e) => updateRule(index, { message: e.target.value })}
              placeholder="Error message"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}

function getAvailableRules(questionType: QuestionType): ValidationRuleType[] {
  const commonRules = [ValidationRuleType.REQUIRED];

  switch (questionType) {
    case QuestionType.TEXT:
    case QuestionType.LONG_TEXT:
      return [
        ...commonRules,
        ValidationRuleType.MIN_LENGTH,
        ValidationRuleType.MAX_LENGTH,
        ValidationRuleType.REGEX,
      ];
    case QuestionType.NUMBER:
      return [
        ...commonRules,
        ValidationRuleType.MIN_VALUE,
        ValidationRuleType.MAX_VALUE,
      ];
    case QuestionType.EMAIL:
      return [...commonRules, ValidationRuleType.EMAIL];
    case QuestionType.PHONE:
      return [...commonRules, ValidationRuleType.PHONE];
    default:
      return commonRules;
  }
}

function needsValue(ruleType: ValidationRuleType): boolean {
  return ![
    ValidationRuleType.REQUIRED,
    ValidationRuleType.EMAIL,
    ValidationRuleType.PHONE,
  ].includes(ruleType);
}

function getInputType(ruleType: ValidationRuleType): string {
  switch (ruleType) {
    case ValidationRuleType.MIN_VALUE:
    case ValidationRuleType.MAX_VALUE:
    case ValidationRuleType.MIN_LENGTH:
    case ValidationRuleType.MAX_LENGTH:
      return "number";
    default:
      return "text";
  }
}

function getValuePlaceholder(ruleType: ValidationRuleType): string {
  switch (ruleType) {
    case ValidationRuleType.MIN_LENGTH:
    case ValidationRuleType.MAX_LENGTH:
      return "Enter character length";
    case ValidationRuleType.MIN_VALUE:
    case ValidationRuleType.MAX_VALUE:
      return "Enter number";
    case ValidationRuleType.REGEX:
      return "Enter regex pattern";
    default:
      return "Enter value";
  }
}

function getDefaultMessage(ruleType: ValidationRuleType): string {
  switch (ruleType) {
    case ValidationRuleType.REQUIRED:
      return "This field is required";
    case ValidationRuleType.MIN_LENGTH:
      return "Input is too short";
    case ValidationRuleType.MAX_LENGTH:
      return "Input is too long";
    case ValidationRuleType.MIN_VALUE:
      return "Value is too small";
    case ValidationRuleType.MAX_VALUE:
      return "Value is too large";
    case ValidationRuleType.EMAIL:
      return "Invalid email address";
    case ValidationRuleType.PHONE:
      return "Invalid phone number";
    case ValidationRuleType.REGEX:
      return "Invalid format";
    default:
      return "Invalid input";
  }
}

function getDefaultValue(
  ruleType: ValidationRuleType,
): string | number | undefined {
  switch (ruleType) {
    case ValidationRuleType.MIN_LENGTH:
    case ValidationRuleType.MIN_VALUE:
      return 1;
    case ValidationRuleType.MAX_LENGTH:
      return 100;
    case ValidationRuleType.MAX_VALUE:
      return 1000;
    default:
      return undefined;
  }
}

function formatRuleType(type: ValidationRuleType): string {
  return type
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}
