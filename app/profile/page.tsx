"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 w-full max-w-md mx-auto p-6 flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-surface border-2 border-neon p-1 shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                <div className="w-full h-full rounded-full bg-surface-elevated flex items-center justify-center overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-neon rounded-full border border-background shadow-lg hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-black italic tracking-tighter uppercase">{user?.email.split('@')[0]}</h2>
              <p className="text-gray-500 text-sm font-medium">{user?.email}</p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-surface border border-border-subtle text-center space-y-1">
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest">Partidas</div>
                <div className="text-2xl font-black italic text-neon">124</div>
              </div>
              <div className="p-5 rounded-2xl bg-surface border border-border-subtle text-center space-y-1">
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest">Precisão</div>
                <div className="text-2xl font-black italic text-neon">82%</div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#1a1a1a]">
              <div className="flex flex-col space-y-3">
                <Button variant="secondary" fullWidth className="justify-start px-6 gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  EDITAR PERFIL
                </Button>
                <Button variant="secondary" fullWidth className="justify-start px-6 gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  CONFIGURAÇÕES
                </Button>
              </div>

              <div className="pt-6">
                <Button 
                  onClick={logout}
                  variant="outline" 
                  fullWidth 
                  className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white shadow-none hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                  SAIR DA CONTA
                </Button>
              </div>
            </div>
          </section>

          <footer className="text-center pt-8">
            <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
              Versão App 1.0.0-Beta
            </p>
          </footer>
        </main>
      </div>
    </ProtectedRoute>
  );
}
