"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/home");
      } else {
        setError("E-mail ou senha incorretos");
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar entrar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Background Effect Removed */}

      <div className="w-full max-w-sm z-10 flex flex-col items-center space-y-10">
        <div className="text-center flex flex-col items-center space-y-3">
          <h1 className="text-5xl font-black italic tracking-tighter text-primary">
            QUIZ<span className="text-foreground">2026</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-tight">
            Pronto para o hexa?
          </p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-5 bg-surface border border-border-subtle p-8 rounded-2xl shadow-2xl">
          <Input
            label="E-mail"
            placeholder="teste123@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error ? " " : ""} // Basic visual indicator
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <div className="flex justify-end mt-1">
            <Link href="#" className="text-sm font-medium text-foreground/40 hover:text-primary transition-colors">
              Redefinir Senha
            </Link>
          </div>

          <Button type="submit" fullWidth disabled={isLoading} className="mt-6">
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="text-center text-sm font-medium text-foreground/40">
          Ainda não tem cadastro?{" "}
          <Link href="#" className="text-primary hover:underline underline-offset-4">
            Criar Cadastro
          </Link>
        </div>
      </div>
    </main>
  );
}
