"use client";

import { Question } from "@/app/types/quiz";

interface MultipleChoiceQuestionProps {
  question: Question;
  selectedOption: string | null;
  isAnswered: boolean;
  onSelect: (optionId: string) => void;
}

export function MultipleChoiceQuestion({
  question,
  selectedOption,
  isAnswered,
  onSelect,
}: MultipleChoiceQuestionProps) {
  return (
    <div className="space-y-3">
      {question.options.map((option) => {
        let statusClass = "bg-surface border-border-standard text-foreground";

        if (isAnswered) {
          if (option.id === question.answer) {
            statusClass = "bg-green-500/10 border-green-500 text-green-500";
          } else if (option.id === selectedOption) {
            statusClass = "bg-red-500/10 border-red-500 text-red-500";
          } else {
            statusClass = "bg-surface border-border-subtle text-foreground/40 opacity-50";
          }
        } else if (selectedOption === option.id) {
          statusClass = "border-primary bg-primary/10 text-primary";
        }

        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={isAnswered}
            className={`w-full p-5 text-left rounded-xl border-2 font-bold transition-all duration-200 ${statusClass} active:scale-[0.98]`}
          >
            <div className="flex items-center justify-between">
              <span>{option.text}</span>
              {isAnswered && option.id === question.answer && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
              {isAnswered &&
                option.id === selectedOption &&
                option.id !== question.answer && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
