"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Header } from "@/app/components/layout/Header";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";
import { LogRepository, LogEntry } from "@/app/repositories/LogRepository";
import { AVATARS } from "@/app/constants/avatars";

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    LogRepository.getLogs().then((res) => {
      if (res.status === "success" && res.data) {
        // Ordenar logs por data descendente para mostrar os mais recentes primeiro no dropdown
        const sortedLogs = [...res.data.log].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setLogs(sortedLogs);
        
        // Selecionar o dia mais recente por padrão
        if (sortedLogs.length > 0) {
          setSelectedDate(sortedLogs[0].date);
        }
      }
      setIsLoading(false);
    });
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const selectedEntry = logs.find(log => log.date === selectedDate);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 w-full max-w-5xl mx-auto p-6 flex flex-col space-y-10 animate-in fade-in duration-700">
          <header className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-1.5 bg-primary rounded-full mb-2 opacity-50 shadow-glow shadow-primary/40"></div>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-shadow-glow">
              HISTÓRICO DE <span className="text-primary">LOGS</span>
            </h1>
            <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.4em] max-w-xs">
              Histórico de atividade de usuários
            </p>
          </header>

          <div className="flex flex-col items-center space-y-12">
            {/* Dropdown Section */}
            <div className="w-full max-w-md space-y-3 animate-in slide-in-from-top-4 duration-500 delay-200">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 ml-2 block">
                Filtrar por Período
              </label>
              <div className="relative group">
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={isLoading || logs.length === 0}
                  className="w-full bg-surface border border-border-subtle rounded-[1.5rem] px-6 py-5 text-sm font-black uppercase tracking-wider appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer shadow-2xl hover:bg-surface-elevated"
                >
                  {isLoading && (
                    <option>Sincronizando registros...</option>
                  )}
                  {!isLoading && logs.length === 0 && (
                    <option>Nenhum log disponível</option>
                  )}
                  {logs.map((log) => (
                    <option key={log.date} value={log.date} className="bg-surface py-2">
                      {formatDate(log.date)}
                    </option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary transition-transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Users Content Area */}
            <div className="w-full min-h-[400px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                   <div className="relative">
                     <div className="w-16 h-16 border-4 border-primary/10 rounded-full"></div>
                     <div className="absolute top-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                   </div>
                   <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Consultando Database...</p>
                </div>
              ) : selectedEntry ? (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 fill-mode-both">
                  <div className="flex items-center gap-6">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border-subtle"></div>
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow shadow-primary"></span>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/50">
                          {selectedEntry.users.length} USUÁRIOS EM {formatDate(selectedDate)}
                        </h2>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border-subtle"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedEntry.users.length === 0 ? (
                      <div className="col-span-full py-24 text-center bg-surface/20 border-2 border-dashed border-border-subtle rounded-[2.5rem] flex flex-col items-center justify-center space-y-4">
                        <div className="text-4xl grayscale opacity-30">📅</div>
                        <p className="text-foreground/30 font-black uppercase tracking-[0.3em] text-xs">
                          Sem novos registros nesta data
                        </p>
                      </div>
                    ) : (
                      selectedEntry.users.map((user, idx) => (
                        <div
                          key={user.id}
                          className="group bg-surface hover:bg-surface-elevated border border-border-subtle hover:border-primary/40 p-6 rounded-[1.5rem] flex items-center gap-5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 animate-in slide-in-from-bottom-4"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <div className="relative">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-background border border-border-subtle relative group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 shadow-lg">
                                <Image
                                  src={user.profileUser ?? AVATARS[0]}
                                  alt={user.name}
                                  fill
                                  className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-[3px] border-surface rounded-full shadow-lg z-10"></div>
                          </div>
                          
                          <div className="flex flex-col min-w-0">
                            <span className="text-base font-black italic text-foreground group-hover:text-primary transition-colors truncate uppercase tracking-tighter leading-tight mb-1">
                              @{user.username}
                            </span>
                            <span className="text-[10px] text-foreground/40 font-black uppercase tracking-widest truncate">
                              {user.name}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                !isLoading && logs.length > 0 && (
                   <div className="text-center py-24 bg-surface/30 rounded-[2.5rem] border border-border-subtle">
                     <p className="text-foreground/40 font-black uppercase tracking-[0.4em] text-xs">Selecione uma data acima</p>
                   </div>
                )
              )}
            </div>
          </div>
        </main>

        <footer className="py-12 text-center">
             <p className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.6em]">
               Daily Logs View Mode
             </p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
