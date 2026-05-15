"use client";

import { Header } from "@/app/components/layout/Header";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";
import { useQuiz } from "@/app/hooks/useQuiz";
import { QuestionRenderer } from "@/app/components/quiz/QuestionRenderer";
import { LoadingScreen } from "@/app/components/ui/LoadingScreen";

export default function QuizPage() {
  const {
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
    totalQuestions,
    error,
    handleOptionSelect,
    handleNext,
  } = useQuiz();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <div className="flex-1 flex flex-col relative">
            <LoadingScreen message="CARREGANDO PARTIDA..." />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !currentQuestion) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in zoom-in duration-500">
             <div className="text-xl font-bold text-red-500">{error || "Não foi possível carregar o quiz. Tente novamente mais tarde."}</div>
             <Link href="/home" className="w-full max-w-sm">
               <Button fullWidth variant="primary">Voltar para a Home</Button>
             </Link>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

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
              <p className="text-2xl font-bold">Quiz finalizado com sucesso.</p>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <div className="p-8 rounded-2xl bg-surface border border-primary/20 shadow-xl">
                <div className="text-foreground/40 text-sm font-medium mb-2 uppercase tracking-widest">Sua pontuação</div>
                <div className="text-6xl font-black text-primary">{score}</div>
                <div className="text-primary font-bold tracking-widest mt-1">XP TOTAL</div>
              </div>

              <div className="p-4 rounded-xl bg-surface-elevated border border-border-subtle flex justify-between items-center">
                <span className="font-bold text-foreground/60 uppercase text-xs tracking-widest">Desempenho</span>
                <span className="text-xl font-black italic">
                   {correctAnswersCount} <span className="text-sm font-bold text-foreground/40">/ {totalQuestions}</span>
                </span>
              </div>
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

        <main 
          className="flex-1 w-full max-w-md mx-auto p-6 flex flex-col select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Progress Bar */}
          <div className="w-full bg-surface-elevated h-2 rounded-full mb-8 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          <div className="flex-1 flex flex-col space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-primary font-black italic tracking-widest text-sm text-shadow-glow">
                  PERGUNTA {currentQuestionIndex + 1}/{totalQuestions}
                </span>
                <span className="text-foreground/40 font-bold text-xs uppercase tracking-widest bg-surface-elevated px-3 py-1 rounded-full border border-border-subtle">
                  Vale {currentQuestion.basePoints} XP
                </span>
              </div>
              <h2 className="text-2xl font-black italic leading-tight uppercase">
                {currentQuestion.text}
              </h2>
            </div>

            <QuestionRenderer
              key={currentQuestion.id}
              question={currentQuestion}
              selectedOption={selectedOption}
              correctAnswer={correctAnswer}
              isAnswered={isAnswered}
              onSelect={handleOptionSelect}
              attempts={attempts}
            />
          </div>

          <div className="mt-8">
            <Button
              fullWidth
              size="lg"
              disabled={!isAnswered || isValidating}
              onClick={handleNext}
              className={!isAnswered ? "opacity-0 pointer-events-none" : "animate-in slide-in-from-bottom-2"}
            >
              {currentQuestionIndex === totalQuestions - 1 ? "FINALIZAR" : "PRÓXIMA"}
            </Button>
            
            {isValidating && (
              <p className="text-center font-bold text-primary mt-2 animate-pulse text-xs uppercase tracking-widest">Avaliando resposta...</p>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
