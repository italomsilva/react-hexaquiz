"use client";

import { Question } from "@/app/types/quiz";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";

interface GuessTheWordQuestionProps {
  question: Question;
  selectedOption: string | null;
  isAnswered: boolean;
  onSelect: (answer: string) => void;
}

export function GuessTheWordQuestion({
  question,
  selectedOption,
  isAnswered,
  onSelect,
}: GuessTheWordQuestionProps) {
  const [inputValue, setInputValue] = useState("");
  const targetAnswer = question.answer.toUpperCase();

  // Reset input when question changes
  useEffect(() => {
    setInputValue("");
  }, [question.id]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue || isAnswered) return;
    onSelect(inputValue.toUpperCase());
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center space-y-6">
        {/* Letter Slots Display */}
        <div className="flex flex-wrap justify-center gap-2">
          {targetAnswer.split("").map((letter, index) => {
            const currentLetter = inputValue[index] || "";
            const isFilled = !!currentLetter;
            
            let borderColor = "border-border-standard";
            let textColor = "text-foreground";
            let bg = "bg-surface";

            if (isAnswered) {
              const fullInput = selectedOption?.toUpperCase() || "";
              const inputLetter = fullInput[index] || "";
              const correctLetter = targetAnswer[index];

              if (inputLetter === correctLetter) {
                borderColor = "border-green-500";
                textColor = "text-green-500";
                bg = "bg-green-500/10";
              } else {
                borderColor = "border-red-500";
                textColor = "text-red-500";
                bg = "bg-red-500/10";
              }
            } else if (index === inputValue.length) {
              borderColor = "border-primary";
              bg = "bg-primary/5";
            }

            return (
              <div
                key={index}
                className={`w-10 h-12 flex items-center justify-center border-b-4 rounded-t-lg font-black text-xl transition-all duration-200 ${borderColor} ${textColor} ${bg} ${!isAnswered && index === inputValue.length ? "animate-pulse" : ""}`}
              >
                {isAnswered ? (selectedOption?.toUpperCase() || "")[index] || "" : currentLetter}
              </div>
            );
          })}
        </div>

        {/* Input Form */}
        {!isAnswered ? (
          <form tabIndex={0} onSubmit={handleSubmit} className="w-full space-y-4">
             <div className="relative">
                <input
                  autoFocus
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.toUpperCase().slice(0, targetAnswer.length))}
                  className="w-full bg-surface border-2 border-border-standard focus:border-primary rounded-xl p-4 text-center font-bold text-lg outline-none transition-all uppercase tracking-[0.5em]"
                  placeholder="DIGITE AQUI..."
                  maxLength={targetAnswer.length}
                />
                {inputValue.length === targetAnswer.length && (
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-bounce">
                      ENTER
                   </div>
                )}
             </div>
             <Button 
               fullWidth 
               variant="primary" 
               disabled={inputValue.length < 1}
               onClick={handleSubmit}
             >
               CONFIRMAR RESPOSTA
             </Button>
          </form>
        ) : (
          <div className="text-center space-y-2 animate-in slide-in-from-top-2">
             <div className="text-foreground/40 text-sm font-bold tracking-widest uppercase">Resposta Correta</div>
             <div className="text-3xl font-black italic text-primary tracking-widest">{targetAnswer}</div>
          </div>
        )}
      </div>
    </div>
  );
}
