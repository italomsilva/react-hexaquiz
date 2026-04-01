"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/layout/Header";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";

import { RankingRepository, RankingItem } from "@/app/repositories/RankingRepository";

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<"weekly" | "general">("weekly");
  const [data, setData] = useState<RankingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    RankingRepository.getRanking(activeTab).then(res => {
      if (res.status === "success" && res.data) {
        setData(res.data.top_players);
      }
      setIsLoading(false);
    });
  }, [activeTab]);



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
            <div className="flex p-1 bg-surface border border-border-subtle rounded-xl">
              <button
                onClick={() => setActiveTab("weekly")}
                className={`flex-1 py-3 text-xs font-black tracking-widest rounded-lg transition-all ${activeTab === "weekly" ? "bg-primary text-background" : "text-foreground/40"
                  }`}
              >
                SEMANAL
              </button>
              <button
                onClick={() => setActiveTab("general")}
                className={`flex-1 py-3 text-xs font-black tracking-widest rounded-lg transition-all ${activeTab === "general" ? "bg-primary text-background" : "text-foreground/40"
                  }`}
              >
                GERAL
              </button>
            </div>
          </section>

          {/* Ranking List */}
          <div className="space-y-3 relative min-h-[300px]">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-primary font-bold text-xs uppercase tracking-widest mt-4">Carregando Classificação...</p>
              </div>
            ) : (
              data.map((item) => (
                <div
                  key={item.rank}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all animate-in slide-in-from-bottom-2 duration-500 ${item.isCurrentUser
                      ? "bg-primary/10 border-primary"
                      : "bg-surface border-border-subtle"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black italic ${item.rank === 1 ? "bg-yellow-500 text-background shadow-lg shadow-yellow-500/50" :
                        item.rank === 2 ? "bg-foreground/20 text-foreground" :
                          item.rank === 3 ? "bg-amber-600 text-background" :
                            "bg-surface-elevated text-foreground/40"
                      }`}>
                      {item.rank}
                    </div>
                    <span className={`font-bold ${item.isCurrentUser ? "text-primary" : "text-foreground"}`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-black text-foreground">{item.points}</span>
                    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-tighter">PONTOS</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-auto pt-6 text-center">
            <p className="text-foreground/40 text-xs font-medium uppercase tracking-widest">
              Próxima atualização em <span className="text-primary">12h 45m</span>
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
