"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-10 animate-in fade-in duration-1000">
      {/* Visual Element */}
      <div className="relative">
        <div className="text-[12rem] font-black italic text-primary/5 select-none leading-none">403</div>
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
           <div className="bg-surface-elevated p-6 rounded-3xl border border-primary/20 shadow-2xl shadow-primary/10 relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
           </div>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-3 max-w-sm">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-shadow-glow">
          ACESSO <span className="text-primary">NEGADO</span>
        </h1>
        <p className="text-foreground/40 text-sm font-medium leading-relaxed uppercase tracking-wider text-[10px]">
          Sua sessão expirou ou você não tem as permissões necessárias para visualizar este conteúdo.
        </p>
      </div>

      {/* Action */}
      <div className="w-full max-w-xs space-y-4">
        <Button fullWidth onClick={() => router.push("/login")} size="lg">
          FAZER LOGIN NOVAMENTE
        </Button>
        <p className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.5em]">
          HexaQuiz Security Protocol
        </p>
      </div>
    </div>
  );
}
