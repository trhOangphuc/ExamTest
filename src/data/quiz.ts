import type { Quiz } from "./type";

export const quizData: Quiz = {
  id: "quiz_001",
  title: "React + TS Basics",
  description: "Quick check on fundamentals",
  durationMinutes: 8,
  questions: [
    {
      id: "q1",
      type: "single",
      content: "Which is a correct React hook rule?",
      choices: [
        "Call hooks inside loops/conditions as needed",
        "Only call hooks at the top level of React functions",
        "Call hooks from any JS function"
      ],
      correctAnswers: ["Only call hooks at the top level of React functions"],
      explanation: "Rules of Hooks: top-level & only in React functions."
    },
    {
      id: "q2",
      type: "boolean",
      content: "TypeScript’s `unknown` is safer than `any`.",
      correctAnswers: ["true"],
      explanation: "`unknown` buộc phải refine trước khi dùng."
    },
    {
      id: "q3",
      type: "short",
      content: "Fill: Tailwind applies styles via utility _____.",
      correctAnswers: ["classes", "class", "utility classes"],
      explanation: "Utilities are expressed as CSS classes."
    }
  ]
};
