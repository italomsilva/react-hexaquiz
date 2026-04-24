"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await register(name, email, username, password);
      if (success) {
        router.push("/home");
      } else {
        setError("Nome de usuário ou e-mail já estão em uso");
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar criar o cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
      <div className="w-full max-w-sm z-10 flex flex-col items-center space-y-10">
        <div className="text-center flex flex-col items-center space-y-3">
          <h1 className="text-5xl font-black italic tracking-tighter text-primary">
            QUIZ<span className="text-foreground">2026</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-tight">
            Crie sua conta e participe
          </p>
        </div>

        <form onSubmit={handleRegister} className="w-full space-y-5 bg-surface border border-border-subtle p-8 rounded-2xl shadow-2xl">
          <Input
            label="Nome Completo"
            placeholder="Seu nome"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Usuário"
            placeholder="Escolha um nome de usuário"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={error ? " " : ""}
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

          <Button type="submit" fullWidth disabled={isLoading} className="mt-6">
            {isLoading ? "Criando..." : "Criar Conta"}
          </Button>
        </form>

        <div className="text-center text-sm font-medium text-foreground/40">
          Já tem cadastro?{" "}
          <Link href="/login" className="text-primary hover:underline underline-offset-4">
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
