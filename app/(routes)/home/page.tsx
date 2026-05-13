"use client";

import React from "react";
import { Header } from "@/app/components/layout/Header";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";
import { Button } from "@/app/components/ui/Button";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";

export default function HomePage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [rankingError, setRankingError] = React.useState("");
  const [currentPosition, setCurrentPosition] = React.useState<number>(0);

  // Sincronizar posição inicial do usuário
  React.useEffect(() => {
    if (user?.positionRanking) {
      setCurrentPosition(user.positionRanking);
    }
  }, [user]);

  // Se a posição for 0, tenta buscar do backend (caso o usuário tenha acabado de jogar)
  React.useEffect(() => {
    if (user?.id && currentPosition === 0) {
      import("@/app/repositories/RankingRepository").then(({ RankingRepository }) => {
        RankingRepository.getRanking().then(res => {
          if (res.status === "success" && res.data && res.data.positionRanking > 0) {
            setCurrentPosition(res.data.positionRanking);
          }
        });
      });
    }
  }, [user?.id, currentPosition]);

  const handleRankingClick = (e: React.MouseEvent) => {
    if (currentPosition === 0) {
      e.preventDefault();
      setRankingError("Responda o quiz de hoje para entrar no ranking!");
      setTimeout(() => setRankingError(""), 3000);
    }
  };

  return (
    <ProtectedRoute>
      <div 
        className="min-h-screen text-foreground flex flex-col"
        style={{
          backgroundImage: "url('https://raw.githubusercontent.com/italomsilva/dataset-images-hexaquiz/e6ee3bd1cf21eb0d7ced5b5df2907890aa776569/backgrounds/home-bg.jpg')",
          backgroundColor: theme === "dark" ? "rgba(0, 32, 34, 0.4)" : "rgba(255, 255, 255, 0.4)",
          backgroundBlendMode: theme === "dark" ? "multiply" : "",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center"
        }}
      >
        <Header />

        <main className="flex-1 w-full max-w-md mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="space-y-2 mt-4">
            <p className="text-primary font-black tracking-widest text-xs uppercase opacity-70">
              Bem-vindo de volta
            </p>
            <h2 className="text-3xl font-black italic tracking-tight">
              OLÁ, <span className="text-primary">{user?.username}</span>
            </h2>
          </section>

          {/* Featured CTA */}
          <div className="relative group overflow-hidden rounded-2xl border-2 border-primary/30 bg-surface p-1 transition-all hover:border-primary">
            <div className="relative p-8 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-surface-elevated flex items-center justify-center border border-border-subtle transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black italic tracking-tighter">QUIZ DIÁRIO</h3>
                <p className="text-gray-400 text-sm font-medium">Responda aos desafios do dia e suba no ranking!</p>
              </div>
              <Link href="/quiz" className="w-full">
                <Button fullWidth size="lg">JOGAR AGORA</Button>
              </Link>
            </div>
          </div>

          {/* Quick Navigation Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/ranking" 
              onClick={handleRankingClick}
              className="group p-6 rounded-xl bg-surface border border-border-subtle hover:border-primary/50 transition-all active:scale-95"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-lg bg-surface-elevated text-foreground/40 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17h4v-2.34a8 8 0 0 0-4-14.66h4a8 8 0 0 0-4 14.66z"></path>
                    <path d="M10 21v-4"></path>
                    <path d="M14 21v-4"></path>
                  </svg>
                </div>
                <span className="font-bold text-sm tracking-wide group-hover:text-neon transition-colors text-center">RANKING</span>
              </div>
            </Link>

            <Link href="/profile" className="group p-6 rounded-xl bg-surface border border-border-subtle hover:border-primary/50 transition-all active:scale-95">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-lg bg-surface-elevated text-foreground/40 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span className="font-bold text-sm tracking-wide group-hover:text-neon transition-colors text-center">PERFIL</span>
              </div>
            </Link>
          </div>

          {/* Quick Stats Summary (Mini Ranking) */}
          <div className="rounded-xl bg-surface border border-border-subtle p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black tracking-widest text-gray-500 uppercase">Resumo da Copa</h4>
              {rankingError && (
                <span className="text-[10px] font-bold text-red-500 animate-pulse">
                  {rankingError}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated border border-border-subtle">
              <div className="flex items-center gap-3">
                <span className="text-xl font-black italic text-foreground/60">
                  {currentPosition === 0 ? '---' : `#${currentPosition}`}
                </span>
                <span className="text-sm font-bold">Sua Posição</span>
              </div>
              <Link 
                href="/ranking" 
                onClick={handleRankingClick}
                className={`text-xs font-black cursor-pointer transition-colors ${currentPosition === 0 ? 'text-foreground/20' : 'text-primary'}`}
              >
                VER RANKING
              </Link>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
