"use client";

import { Question } from "@/app/types/quiz";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import Image from "next/image";
import { safeDecodeBase64 } from "@/app/utils/crypto";

interface GuessTheWordQuestionProps {
  question: Question;
  selectedOption: string | null;
  correctAnswer: string | null;
  isAnswered: boolean;
  onSelect: (answer: string) => void;
  attempts: number;
}

export function GuessTheWordQuestion({
  question,
  selectedOption,
  correctAnswer,
  isAnswered,
  onSelect,
  attempts,
}: GuessTheWordQuestionProps) {
  const [inputValue, setInputValue] = useState("");
  
  // Descriptografa o gabarito prévio (Mock de Base64) só pra desenhar o número de caixas e validar length
  const decodedLocalAnswer = safeDecodeBase64(question.answer).toUpperCase();
  
  const targetAnswerLength = decodedLocalAnswer.length;
  // Apenas revelamos totalmente na UI se isAnswered && correctAnswer estiver disponível
  const finalAnswer = isAnswered && correctAnswer ? correctAnswer.toUpperCase() : decodedLocalAnswer;

  // Reset input when question changes
  useEffect(() => {
    setInputValue("");
  }, [question.id]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue || isAnswered) return;
    onSelect(inputValue.toUpperCase());
    setInputValue(""); // Clear input after submission
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

      <div className="flex flex-col items-center space-y-6">
        {/* Attempts & Hint Display */}
        {!isAnswered && (
          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                    i < attempts 
                      ? "bg-red-500 border-red-500 scale-90 opacity-50" 
                      : i === attempts 
                        ? "bg-primary border-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" 
                        : "bg-surface border-border-standard"
                  }`}
                />
              ))}
            </div>
            
            {attempts >= 4 && question.options.length > 0 && (
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-center animate-in slide-in-from-top-2">
                <div className="text-[10px] font-black italic text-primary uppercase tracking-[0.2em] mb-1">Última Chance • Dica</div>
                <div className="text-sm font-medium text-foreground italic">"{question.options[0].text}"</div>
              </div>
            )}
          </div>
        )}

        {/* Letter Slots Display */}
        <div className="flex flex-wrap justify-center gap-2">
          {finalAnswer.split("").map((letter, index) => {
            let borderColor = "border-border-standard";
            let textColor = "text-foreground";
            let bg = "bg-surface";

            if (isAnswered && correctAnswer) {
              const fullInput = selectedOption?.toUpperCase() || "";
              const inputLetter = fullInput[index] || "";
              const correctLetter = correctAnswer.toUpperCase()[index];

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
                aria-label={`Letra ${index + 1}: ${isAnswered ? (selectedOption?.toUpperCase() || "")[index] : inputValue[index] || "Vazio"}`}
                className={`w-10 h-12 flex items-center justify-center border-b-4 rounded-t-lg font-black text-xl transition-all duration-200 ${borderColor} ${textColor} ${bg} ${!isAnswered && index === inputValue.length ? "animate-pulse" : ""}`}
              >
                {isAnswered ? (selectedOption?.toUpperCase() || "")[index] || "" : inputValue[index] || ""}
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
                  onChange={(e) => setInputValue(e.target.value.toUpperCase().slice(0, targetAnswerLength))}
                  className="w-full bg-surface border-2 border-border-standard focus:border-primary rounded-xl p-4 text-center font-bold text-lg outline-none transition-all uppercase tracking-[0.5em]"
                  placeholder="DIGITE AQUI..."
                  maxLength={targetAnswerLength}
                  aria-label="Digite sua resposta"
                />
                {inputValue.length === targetAnswerLength && (
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
             <div className="text-3xl font-black italic text-primary tracking-widest">{finalAnswer}</div>
          </div>
        )}
      </div>
    </div>
  );
}
