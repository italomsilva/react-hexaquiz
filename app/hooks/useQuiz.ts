"use client";

import { useState } from "react";
import { Question, QuestionType } from "@/app/types/quiz";

export const useQuiz = (questions: Question[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [attempts, setAttempts] = useState(0); // Current question attempts

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;

    const isCorrect = optionId === currentQuestion.answer;
    const isGuessTheWord = currentQuestion.type === QuestionType.GUESS_THE_WORD;

    if (isGuessTheWord) {
      const nextAttempt = attempts + 1;
      setAttempts(nextAttempt);

      if (isCorrect) {
        // Calculate points based on attempts (20% reduction per fail)
        const multiplier = Math.max(0, 1 - (nextAttempt - 1) * 0.2);
        const earnedPoints = Math.round(currentQuestion.points * multiplier);
        setScore((prev) => prev + earnedPoints);
        setSelectedOption(optionId);
        setIsAnswered(true);
      } else if (nextAttempt >= 5) {
        // Failed after 5 attempts
        setSelectedOption(optionId);
        setIsAnswered(true);
      }
    } else {
      // Multiple choice, True/False, Wordle (standard logic)
      setSelectedOption(optionId);
      setIsAnswered(true);

      if (isCorrect) {
        setScore((prev) => prev + currentQuestion.points);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setAttempts(0);
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
    setAttempts(0);
  };

  return {
    currentQuestionIndex,
    selectedOption,
    isAnswered,
    score,
    attempts,
    isFinished,
    currentQuestion,
    totalQuestions: questions.length,
    handleOptionSelect,
    handleNext,
    resetQuiz,
  };
};
