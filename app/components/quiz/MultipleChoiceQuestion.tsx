"use client";

import { Question } from "@/app/types/quiz";
import Image from "next/image";

interface MultipleChoiceQuestionProps {
  question: Question;
  selectedOption: string | null;
  correctAnswer: string | null;
  isAnswered: boolean;
  onSelect: (optionId: string) => void;
}

export function MultipleChoiceQuestion({
  question,
  selectedOption,
  correctAnswer,
  isAnswered,
  onSelect,
}: MultipleChoiceQuestionProps) {
  const hasOptionImages = question.options.some((o) => !!o.image_url);

  return (
    <div className="space-y-6">
      {/* Question Image */}
      {question.image_url && (
        <div className="relative aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-2xl border-4 border-surface-elevated shadow-2xl animate-in zoom-in duration-500">
          <Image
            src={question.image_url}
            alt={question.text}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Options */}
      <div className={hasOptionImages ? "grid grid-cols-2 gap-4" : "space-y-3"}>
        {question.options.map((option) => {
          let statusClass = "bg-surface border-border-standard text-foreground";

          if (isAnswered && correctAnswer) {
            if (option.id === correctAnswer) {
              statusClass = "bg-green-500/10 border-green-500 text-green-500 ring-2 ring-green-500/20";
            } else if (option.id === selectedOption) {
              statusClass = "bg-red-500/10 border-red-500 text-red-500 ring-2 ring-red-500/20";
            } else {
              statusClass = "bg-surface border-border-subtle text-foreground/40 opacity-50";
            }
          } else if (selectedOption === option.id) {
            statusClass = "border-primary bg-primary/10 text-primary scale-[1.02]";
          }

          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              disabled={isAnswered}
              aria-label={`${option.text}${isAnswered && correctAnswer === option.id ? " - Correto" : isAnswered && selectedOption === option.id ? " - Incorreto" : ""}`}
              aria-pressed={selectedOption === option.id}
              className={`group relative flex flex-col w-full p-3 rounded-xl border-2 font-bold transition-all duration-200 ${statusClass} active:scale-[0.98] ${
                hasOptionImages ? "items-center text-center space-y-3" : "text-left"
              }`}
            >
              {option.image_url && (
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-elevated">
                  <Image
                    src={option.image_url}
                    alt={option.text || "Option"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between w-full">
                <span className={hasOptionImages ? "w-full" : ""}>{option.text}</span>
                {!hasOptionImages && isAnswered && correctAnswer && option.id === correctAnswer && (
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
                {!hasOptionImages && isAnswered && correctAnswer &&
                  option.id === selectedOption &&
                  option.id !== correctAnswer && (
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

              {hasOptionImages && isAnswered && correctAnswer && (
                <div className="absolute top-2 right-2">
                   {option.id === correctAnswer ? (
                     <div className="bg-green-500 text-white rounded-full p-1 shadow-lg animate-in zoom-in">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     </div>
                   ) : option.id === selectedOption ? (
                     <div className="bg-red-500 text-white rounded-full p-1 shadow-lg animate-in zoom-in">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                     </div>
                   ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
