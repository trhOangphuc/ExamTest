import { useState, useEffect } from "react";
import type { AnswerMap, Quiz } from "../data/type";

export function useQuiz(quiz: Quiz) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes ? quiz.durationMinutes * 60 : 0);
  const [submitted, setSubmitted] = useState(false);

  // Timer
  useEffect(() => {
    if (!timeLeft || submitted) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  useEffect(() => {
    if (timeLeft === 0) setSubmitted(true);
  }, [timeLeft]);

  const goNext = () => setCurrent(c => Math.min(c + 1, quiz.questions.length - 1));
  const goPrev = () => setCurrent(c => Math.max(c - 1, 0));
  const jumpTo = (i: number) => setCurrent(i);
  const submit = () => setSubmitted(true);

  const score = submitted
    ? quiz.questions.filter(q => answers[q.id] && q.correctAnswers.includes(answers[q.id] as "true" | "false")).length
    : null;

  return { current, goNext, goPrev, jumpTo, answers, setAnswers, timeLeft, submit, submitted, score };
}
