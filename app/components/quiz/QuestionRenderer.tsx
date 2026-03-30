"use client";

import { Question, QuestionType } from "@/app/types/quiz";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { TrueFalseQuestion } from "./TrueFalseQuestion";
import { GuessTheWordQuestion } from "./GuessTheWordQuestion";
import { WordleQuestion } from "./WordleQuestion";
import { OrderingQuestion } from "./OrderingQuestion";

interface QuestionRendererProps {
  question: Question;
  selectedOption: string | null;
  correctAnswer: string | null;
  isAnswered: boolean;
  onSelect: (value: string) => void;
  attempts: number;
}

export function QuestionRenderer({
  question,
  selectedOption,
  correctAnswer,
  isAnswered,
  onSelect,
  attempts,
}: QuestionRendererProps) {
  switch (question.type) {
    case QuestionType.MULTIPLE_CHOICE:
      return (
        <MultipleChoiceQuestion
          question={question}
          selectedOption={selectedOption}
          correctAnswer={correctAnswer}
          isAnswered={isAnswered}
          onSelect={onSelect}
        />
      );
    case QuestionType.TRUE_FALSE:
      return (
        <TrueFalseQuestion
          question={question}
          selectedOption={selectedOption}
          correctAnswer={correctAnswer}
          isAnswered={isAnswered}
          onSelect={onSelect}
        />
      );
    case QuestionType.GUESS_THE_WORD:
      return (
        <GuessTheWordQuestion
          question={question}
          selectedOption={selectedOption}
          correctAnswer={correctAnswer}
          isAnswered={isAnswered}
          onSelect={onSelect}
          attempts={attempts}
        />
      );
    case QuestionType.WORDLE:
      return (
        <WordleQuestion
          question={question}
          isAnswered={isAnswered}
          correctAnswer={correctAnswer}
          onSelect={onSelect}
        />
      );
    case QuestionType.ORDERING:
      return (
        <OrderingQuestion
          question={question}
          isAnswered={isAnswered}
          correctAnswer={correctAnswer}
          onSelect={onSelect}
        />
      );
    default:
      return (
        <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-xl font-bold">
          Tipo de questão desconhecido: {question.type}
        </div>
      );
  }
}
