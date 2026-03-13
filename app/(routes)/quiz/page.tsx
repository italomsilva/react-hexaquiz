"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/app/components/layout/Header";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Qual país sediará a abertura da Copa do Mundo de 2026?",
    options: ["Canadá", "Estados Unidos", "México", "Marrocos"],
    correctAnswer: 2,
  },
  {
    id: 2,
    text: "Quantas seleções participarão da Copa de 2026?",
    options: ["32", "48", "40", "64"],
    correctAnswer: 1,
  },
  {
    id: 3,
    text: "Em qual estádio será realizada a final da Copa de 2026?",
    options: ["MetLife Stadium", "Azteca", "BC Place", "SoFi Stadium"],
    correctAnswer: 0,
  }
];

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in zoom-in duration-500">
            <div className="space-y-4">
              <div className="text-primary text-6xl font-black italic tracking-widest">
                FIM!
              </div>
              <p className="text-2xl font-bold">Você acertou {score} de {QUESTIONS.length} questões.</p>
            </div>

            <div className="w-full max-w-sm p-8 rounded-2xl bg-surface border border-primary/20 shadow-xl">
              <div className="text-foreground/40 text-sm font-medium mb-2 uppercase tracking-widest">Sua pontuação</div>
              <div className="text-4xl font-black text-primary">{score * 100} XP</div>
            </div>

            <div className="flex flex-col w-full max-w-sm gap-4">
              <Link href="/home" className="w-full">
                <Button fullWidth variant="primary">VOLTAR PARA HOME</Button>
              </Link>
              <Link href="/ranking" className="w-full">
                <Button fullWidth variant="outline">VER RANKING</Button>
              </Link>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 w-full max-w-md mx-auto p-6 flex flex-col">
          {/* Progress Bar */}
          <div className="w-full bg-surface-elevated h-2 rounded-full mb-8 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>

          <div className="flex-1 flex flex-col space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-black italic tracking-widest text-sm">
                PERGUNTA {currentQuestionIndex + 1}/{QUESTIONS.length}
              </span>
              <h2 className="text-2xl font-black italic leading-tight uppercase">
                {currentQuestion.text}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                let statusClass = "bg-surface border-border-standard text-foreground";

                if (isAnswered) {
                  if (index === currentQuestion.correctAnswer) {
                    statusClass = "bg-green-500/10 border-green-500 text-green-500";
                  } else if (index === selectedOption) {
                    statusClass = "bg-red-500/10 border-red-500 text-red-500";
                  } else {
                    statusClass = "bg-surface border-border-subtle text-foreground/40 opacity-50";
                  }
                } else if (selectedOption === index) {
                  statusClass = "border-primary bg-primary/10 text-primary";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={isAnswered}
                    className={`w-full p-5 text-left rounded-xl border-2 font-bold transition-all duration-200 ${statusClass} active:scale-[0.98]`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {isAnswered && index === currentQuestion.correctAnswer && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      )}
                      {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <Button
              fullWidth
              size="lg"
              disabled={!isAnswered}
              onClick={handleNext}
              className={!isAnswered ? "opacity-0 pointer-events-none" : "animate-in slide-in-from-bottom-2"}
            >
              {currentQuestionIndex === QUESTIONS.length - 1 ? "FINALIZAR" : "PRÓXIMA"}
            </Button>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
