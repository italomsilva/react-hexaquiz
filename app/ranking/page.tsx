"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

interface RankingItem {
  rank: number;
  name: string;
  points: number;
  isCurrentUser?: boolean;
}

const WEEKLY_RANKING: RankingItem[] = [
  { rank: 1, name: "Neymar Jr", points: 2500 },
  { rank: 2, name: "Vinícius 7", points: 2350 },
  { rank: 3, name: "Rodrygo10", points: 2200 },
  { rank: 15, name: "Usuário Teste", points: 850, isCurrentUser: true },
  { rank: 16, name: "Casemiro 5", points: 800 },
];

const GENERAL_RANKING: RankingItem[] = [
  { rank: 1, name: "Pelé Eterno", points: 15000 },
  { rank: 2, name: "Fenômeno 9", points: 14500 },
  { rank: 3, name: "Gaúcho Art", points: 14200 },
  { rank: 42, name: "Usuário Teste", points: 4500, isCurrentUser: true },
  { rank: 43, name: "Endrick 9", points: 4400 },
];

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<"weekly" | "general">("weekly");

  const data = activeTab === "weekly" ? WEEKLY_RANKING : GENERAL_RANKING;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 w-full max-w-md mx-auto p-6 flex flex-col space-y-6">
          <section className="space-y-4">
            <h2 className="text-3xl font-black italic tracking-tight text-center">
              CLASSIFICAÇÃO
            </h2>
            
            {/* Toggle Tabs */}
            <div className="flex p-1 bg-[#111] border border-[#222] rounded-xl">
              <button
                onClick={() => setActiveTab("weekly")}
                className={`flex-1 py-3 text-xs font-black tracking-widest rounded-lg transition-all ${
                  activeTab === "weekly" ? "bg-neon text-background shadow-[0_0_15px_rgba(204,255,0,0.3)]" : "text-gray-500"
                }`}
              >
                SEMANAL
              </button>
              <button
                onClick={() => setActiveTab("general")}
                className={`flex-1 py-3 text-xs font-black tracking-widest rounded-lg transition-all ${
                  activeTab === "general" ? "bg-neon text-background shadow-[0_0_15px_rgba(204,255,0,0.3)]" : "text-gray-500"
                }`}
              >
                GERAL
              </button>
            </div>
          </section>

          {/* Ranking List */}
          <div className="space-y-3">
            {data.map((item) => (
              <div
                key={item.rank}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  item.isCurrentUser 
                    ? "bg-neon/10 border-neon shadow-[0_0_15px_rgba(204,255,0,0.1)]" 
                    : "bg-[#0f0f0f] border-[#222]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black italic ${
                    item.rank === 1 ? "bg-yellow-500 text-background" :
                    item.rank === 2 ? "bg-gray-400 text-background" :
                    item.rank === 3 ? "bg-amber-600 text-background" :
                    "bg-[#1a1a1a] text-gray-500"
                  }`}>
                    {item.rank}
                  </div>
                  <span className={`font-bold ${item.isCurrentUser ? "text-neon" : "text-foreground"}`}>
                    {item.name}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-black text-foreground">{item.points}</span>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">PONTOS</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6 text-center">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
              Próxima atualização em <span className="text-neon">12h 45m</span>
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
