"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/app/components/layout/Header";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";
import { Button } from "@/app/components/ui/Button";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";
import { AuthRepository } from "@/app/repositories/AuthRepository";

export default function ProfilePage() {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ quizzes_played: 0, accuracy: 0 });

  useEffect(() => {
    if (user) {
      AuthRepository.getProfile(user.id).then(res => {
        if (res.status === "success" && res.data?.stats) {
          setStats(res.data.stats);
        }
      });
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 w-full max-w-md mx-auto p-6 flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-surface border-2 border-primary p-1">
                <div className="w-full h-full rounded-full bg-surface-elevated flex items-center justify-center overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/40">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full border border-background shadow-lg hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>

            <div className="text-center">
              <h2 className={`text-2xl font-bold italic tracking-tighter uppercase`} style={{ color: theme.theme === 'dark' ? 'var(--color-primary-light)' : 'var(--color-primary-dark)' }}>@{user?.username}</h2>
              <p className="text-foreground/60 text-sm font-medium">{user?.email}</p>
              <div className="mt-4 p-3 bg-surface-elevated rounded-xl border border-border-subtle inline-block min-w-[120px]">
                <div className="text-[10px] font-black tracking-widest text-foreground/40 uppercase">XP Acumulado</div>
                <div className="text-xl font-black italic text-neon text-shadow-glow">{user?.totalPoints || 0}</div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-surface border border-border-subtle text-center space-y-1">
                <div className="text-xs font-black text-foreground/40 uppercase tracking-widest">Partidas</div>
                <div className="text-2xl font-black italic text-primary">{stats.quizzes_played}</div>
              </div>
              <div className="p-5 rounded-2xl bg-surface border border-border-subtle text-center space-y-1">
                <div className="text-xs font-black text-foreground/40 uppercase tracking-widest">Precisão</div>
                <div className="text-2xl font-black italic text-primary">{stats.accuracy}%</div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border-standard">
              <div className="pt-6">
                <Button
                  onClick={logout}
                  variant="outline"
                  fullWidth
                  className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-none"
                >
                  SAIR DA CONTA
                </Button>
              </div>
            </div>
          </section>

          <footer className="text-center pt-8">
            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
              Versão App 1.0.0-Beta
            </p>
          </footer>
        </main>
      </div>
    </ProtectedRoute>
  );
}
