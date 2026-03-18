"use client";

import { Question } from "@/app/types/quiz";
import Image from "next/image";

interface TrueFalseQuestionProps {
  question: Question;
  selectedOption: string | null;
  isAnswered: boolean;
  onSelect: (optionId: string) => void;
}

export function TrueFalseQuestion({
  question,
  selectedOption,
  isAnswered,
  onSelect,
}: TrueFalseQuestionProps) {
  return (
    <div className="space-y-6">
      {/* Question Image */}
      {question.image && (
        <div className="relative aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-2xl border-4 border-surface-elevated shadow-2xl animate-in zoom-in duration-500">
          <Image
            src={question.image}
            alt={question.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 h-48">
        {question.options.map((option) => {
          let statusClass = "bg-surface border-border-standard text-foreground";

          if (isAnswered) {
            if (option.id === question.answer) {
              statusClass = "bg-green-500/10 border-green-500 text-green-500 ring-2 ring-green-500/50";
            } else if (option.id === selectedOption) {
              statusClass = "bg-red-500/10 border-red-500 text-red-500 ring-2 ring-red-500/50";
            } else {
              statusClass = "bg-surface border-border-subtle text-foreground/20 opacity-30";
            }
          } else if (selectedOption === option.id) {
            statusClass = "border-primary bg-primary/10 text-primary scale-[1.02] shadow-lg shadow-primary/20";
          }

          const isTrue = option.text.toLowerCase() === "verdadeiro";

          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              disabled={isAnswered}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 font-black italic uppercase transition-all duration-300 ${statusClass} active:scale-95 group relative overflow-hidden`}
            >
              {/* Background Icon Watermark */}
              <div className={`absolute -right-4 -bottom-4 text-8xl opacity-5 transition-transform duration-500 group-hover:scale-125 ${isTrue ? "text-green-500" : "text-red-500"}`}>
                   {isTrue ? "✓" : "✕"}
              </div>

              <div className={`text-3xl mb-2 ${isTrue ? "text-green-500" : "text-red-500"}`}>
                 {isTrue ? (
                   <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                 ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                 )}
              </div>
              <span className="text-xl tracking-tighter">{option.text}</span>
              
              {isAnswered && option.id === question.answer && (
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 animate-in zoom-in">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
