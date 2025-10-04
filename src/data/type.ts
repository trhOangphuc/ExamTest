// types.ts
export type Quiz = {
  id: string;
  title: string;
  description: string;
  durationMinutes?: number;
  questions: Question[];
};

export type Question = SingleQuestion | BooleanQuestion | ShortQuestion;

export type SingleQuestion = {
  id: string;
  type: "single";
  content: string;
  choices: string[];
  correctAnswers: string[];
  explanation?: string;
};

export type BooleanQuestion = {
  id: string;
  type: "boolean";
  content: string;
  correctAnswers: ("true" | "false")[];
  explanation?: string;
};

export type ShortQuestion = {
  id: string;
  type: "short";
  content: string;
  correctAnswers: string[];
  explanation?: string;
};

export type AnswerMap = Record<string, string>;

