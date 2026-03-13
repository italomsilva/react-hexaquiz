"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        
        <main className="flex-1 w-full max-w-md mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="space-y-2 mt-4">
            <p className="text-neon font-black tracking-widest text-xs uppercase opacity-70">
              Bem-vindo de volta
            </p>
            <h2 className="text-3xl font-black italic tracking-tight">
              OLÁ, <span className="text-neon">{user?.email.split('@')[0].toUpperCase()}</span>
            </h2>
          </section>

          {/* Featured CTA */}
          <div className="relative group overflow-hidden rounded-2xl border-2 border-neon/30 bg-surface p-1 shadow-[0_0_20px_rgba(204,255,0,0.1)] transition-all hover:border-neon hover:shadow-[0_0_30px_rgba(204,255,0,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-neon/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="relative p-8 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-neon/20 flex items-center justify-center border border-neon/40 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neon">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black italic tracking-tighter">QUIZ DIÁRIO</h3>
                <p className="text-gray-400 text-sm font-medium">Responda 10 perguntas rápidas e suba no ranking!</p>
              </div>
              <Link href="/quiz" className="w-full">
                <Button fullWidth size="lg">JOGAR AGORA</Button>
              </Link>
            </div>
          </div>

          {/* Quick Navigation Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/ranking" className="group p-6 rounded-xl bg-surface border border-border-subtle hover:border-neon/50 transition-all active:scale-95">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-lg bg-surface-elevated text-gray-400 group-hover:text-neon group-hover:bg-neon/10 transition-colors">
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

            <Link href="/profile" className="group p-6 rounded-xl bg-surface border border-border-subtle hover:border-neon/50 transition-all active:scale-95">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-lg bg-surface-elevated text-gray-400 group-hover:text-neon group-hover:bg-neon/10 transition-colors">
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
            <h4 className="text-xs font-black tracking-widest text-gray-500 uppercase">Resumo da Copa</h4>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated border border-border-subtle">
              <div className="flex items-center gap-3">
                <span className="text-xl font-black italic text-neon/60">#42</span>
                <span className="text-sm font-bold">Sua Posição</span>
              </div>
              <span className="text-xs font-black text-neon">VER GERAL</span>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
