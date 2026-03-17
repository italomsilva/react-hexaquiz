"use client";

import { useState } from "react";
import { Question } from "@/app/types/quiz";

export const useQuiz = (questions: Question[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);

    if (optionId === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return {
    currentQuestionIndex,
    selectedOption,
    isAnswered,
    score,
    isFinished,
    currentQuestion,
    totalQuestions: questions.length,
    handleOptionSelect,
    handleNext,
    resetQuiz,
  };
};
