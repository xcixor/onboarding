// types/index.ts

// Survey Types
export interface Survey {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  questions: Question[];
  createdById: string;
}

// Question Types
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  TEXT = 'TEXT',
  LONG_TEXT = 'LONG_TEXT',
  EMAIL = 'EMAIL',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  TIME = 'TIME',
  PHONE = 'PHONE',
  RATING = 'RATING',
  FILE_UPLOAD = 'FILE_UPLOAD',
  CHECKBOX = 'CHECKBOX'
}

export interface Question {
  id: string;
  surveyId: string;
  title: string;
  type: QuestionType;
  required: boolean;
  order: number;
  explanation?: QuestionExplanation;
  options?: QuestionOption[];
  validation?: QuestionValidation;
  logic?: QuestionLogic[];
}

// Question Options for multiple choice, single choice, etc.
export interface QuestionOption {
  id: string;
  questionId: string;
  text: string;
  order: number;
}

// Question Explanation
export interface QuestionExplanation {
  id: string;
  questionId: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO' | 'AUDIO';
}

// Validation Rules
export interface QuestionValidation {
  id: string;
  questionId: string;
  rules: ValidationRule[];
}

export interface ValidationRule {
  type: ValidationRuleType;
  value?: string | number;
  message: string;
}

export enum ValidationRuleType {
  REQUIRED = 'REQUIRED',
  MIN_LENGTH = 'MIN_LENGTH',
  MAX_LENGTH = 'MAX_LENGTH',
  MIN_VALUE = 'MIN_VALUE',
  MAX_VALUE = 'MAX_VALUE',
  REGEX = 'REGEX',
  EMAIL = 'EMAIL',
  URL = 'URL',
  PHONE = 'PHONE',
  CUSTOM = 'CUSTOM'
}

// Logic Control
export interface QuestionLogic {
  id: string;
  questionId: string;
  conditions: LogicCondition[];
  action: LogicAction;
}

export interface LogicCondition {
  sourceQuestionId: string;
  operator: LogicOperator;
  value: string | number | boolean;
}

export enum LogicOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH'
}

export interface LogicAction {
  type: LogicActionType;
  targetQuestionIds: string[];
}

export enum LogicActionType {
  SHOW = 'SHOW',
  HIDE = 'HIDE',
  SKIP = 'SKIP',
  REQUIRE = 'REQUIRE'
}

// Form Builder State Types
export interface SurveyBuilderState {
  survey: Survey;
  currentQuestion?: Question;
  selectedQuestionId?: string;
  isPreviewMode: boolean;
  isDirty: boolean;
  history: Survey[];
  historyIndex: number;
}

// Response Types
export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId?: string;
  answers: QuestionAnswer[];
  submittedAt: Date;
}

export interface QuestionAnswer {
  questionId: string;
  value: string | string[] | number | boolean | File;
}