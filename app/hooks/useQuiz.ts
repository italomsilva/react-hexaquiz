"use client";

import { useState, useEffect } from "react";
import { Question, QuestionType } from "@/app/types/quiz";
import { QuizRepository } from "@/app/repositories/QuizRepository";
import { useAuth } from "@/app/context/AuthContext";
import { safeDecodeBase64 } from "@/app/utils/crypto";

export const useQuiz = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    QuizRepository.getDailyQuiz().then(res => {
      const data = res.data;
      if (data) {
        setQuestions(data.questions);
        if (data.session) {
          setCurrentQuestionIndex(data.session.index);
          setScore(data.session.points);
          setIsFinished(data.session.finished);
          setCorrectAnswersCount(data.session.correctCount || 0);
        }
      }
      setIsLoading(false);
    });
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = async (answer: string) => {
    if (isAnswered || isValidating) return;

    setIsValidating(true);
    const isGuessTheWord = currentQuestion.type === QuestionType.GUESS_THE_WORD;
    const nextAttempt = isGuessTheWord ? attempts + 1 : 1;
    
    setAttempts(nextAttempt);
    setSelectedOption(answer);

    if (isGuessTheWord) {
      const decodedAnswer = safeDecodeBase64(currentQuestion.answer).toUpperCase();
      const isCorrect = decodedAnswer === answer.toUpperCase();

      if (!isCorrect && nextAttempt < 5) {
        setIsValidating(false);
        return;
      }
    }

    const response = await QuizRepository.submitAnswer(currentQuestion.id, answer, nextAttempt, currentQuestion.basePoints);
    const result = response.data;

    setIsValidating(false);

    if (result && result.correct) {
      setScore((prev) => prev + result.points_earned);
      setCorrectAnswersCount(prev => prev + 1);
      setCorrectAnswer(result.correct_answer_payload);
      setIsAnswered(true);
    } else if (result) {
      setCorrectAnswer(result.correct_answer_payload);
      setIsAnswered(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(null);
      setCorrectAnswer(null);
      setIsAnswered(false);
      setAttempts(0);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setCorrectAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setCorrectAnswersCount(0);
    setAttempts(0);
    if (user) {
      QuizRepository.resetSession(user.username);
    }
  };

  return {
    questions,
    currentQuestionIndex,
    selectedOption,
    correctAnswer,
    isAnswered,
    score,
    correctAnswersCount,
    attempts,
    isFinished,
    isLoading,
    isValidating,
    currentQuestion,
    totalQuestions: questions.length,
    handleOptionSelect,
    handleNext,
    resetQuiz,
  };
};
