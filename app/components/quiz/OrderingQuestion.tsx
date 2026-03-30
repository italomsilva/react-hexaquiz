"use client";

import { Question, Option } from "@/app/types/quiz";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/Button";

interface OrderingQuestionProps {
  question: Question;
  isAnswered: boolean;
  correctAnswer: string | null;
  onSelect: (answer: string) => void;
}

export function OrderingQuestion({
  question,
  isAnswered,
  correctAnswer,
  onSelect,
}: OrderingQuestionProps) {
  const [items, setItems] = useState<Option[]>([]);

  // Shuffle items on mount
  useEffect(() => {
    const shuffled = [...question.options].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  }, [question.id, question.options]);

  const moveUp = (index: number) => {
    if (index === 0 || isAnswered) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setItems(newItems);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1 || isAnswered) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setItems(newItems);
  };

  const handleSubmit = () => {
    const orderedIds = items.map(item => item.id).join(",");
    onSelect(orderedIds);
  };

  // Avaliação do render depende estritamente do prop `correctAnswer` do servidor após submissão!
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       {/* Question Image */}
      {question.image && (
        <div className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-2xl border-4 border-surface-elevated shadow-2xl">
          <Image
            src={question.image}
            alt={question.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest text-center mb-4">
          REORDENE OS ITENS ABAIXO
        </p>
        
        <div className="space-y-3">
          {items.map((item, index) => {
            let statusClass = "bg-surface border-border-standard";
            let correctIcon = null;
            
            if (isAnswered && correctAnswer) {
              const correctOrder = correctAnswer.split(",");
              const correctIdAtIndex = correctOrder[index];
              if (item.id === correctIdAtIndex) {
                 statusClass = "bg-green-500/10 border-green-500 text-green-500";
                 correctIcon = <span className="ml-2 font-black">✓</span>;
              } else {
                 statusClass = "bg-red-500/10 border-red-500 text-red-500";
                 correctIcon = <span className="ml-2 font-black">✕</span>;
              }
            }

            return (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${statusClass} group`}
              >
                <div className="flex-none bg-surface-elevated w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border border-border-subtle">
                   {index + 1}
                </div>

                <div className="flex-1 font-bold flex items-center">
                   {item.text}
                   {correctIcon}
                </div>

                {!isAnswered && (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1 hover:text-primary disabled:opacity-0 transition-all active:scale-90"
                      title="Mover para cima"
                      aria-label={`Mover ${item.text} para cima`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === items.length - 1}
                      className="p-1 hover:text-primary disabled:opacity-0 transition-all active:scale-90"
                      title="Mover para baixo"
                      aria-label={`Mover ${item.text} para baixo`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!isAnswered && (
        <Button
          fullWidth
          variant="primary"
          onClick={handleSubmit}
          className="animate-in slide-in-from-top-2"
        >
          CONFIRMAR ORDEM
        </Button>
      )}

      {isAnswered && correctAnswer && (
         <div className="text-center p-4 bg-surface-elevated rounded-xl border border-primary/20 animate-in zoom-in">
           <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-2">Gabarito</p>
           <div className="space-y-1">
             {correctAnswer.split(",").map((id, idx) => {
               const item = question.options.find(o => o.id === id);
               return (
                 <div key={id} className="text-sm font-black italic text-primary">
                    {idx + 1}. {item?.text}
                 </div>
               );
             })}
           </div>
         </div>
      )}
    </div>
  );
}
