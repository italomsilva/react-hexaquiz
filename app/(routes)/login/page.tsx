"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useAuth } from "@/app/context/AuthContext";
import { AvatarSelector } from "@/app/components/register/AvatarSelector";
import { AVATARS } from "@/app/constants/avatars";

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (isRegisterMode && password !== confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    try {
      if (isRegisterMode) {
        const success = await register(name, email, username, password, selectedAvatar);
        if (success) {
          router.push("/home");
        } else {
          setError("Nome de usuário ou e-mail já estão em uso");
        }
      } else {
        const success = await login(username, password);
        if (success) {
          router.push("/home");
        } else {
          setError("Usuário ou senha incorretos");
        }
      }
    } catch (err) {
      setError(`Ocorreu um erro ao tentar ${isRegisterMode ? "cadastrar" : "entrar"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/40">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/40">
      <path d="M17.94 17.94a10.07 10.07 0 0 1-12.88 0"></path>
      <path d="M1 1l22 22"></path>
      <path d="M9.9 4.24a9.12 9.12 0 0 1 12.04 8.11"></path>
      <path d="M12 12a3 3 0 0 0-3 3"></path>
      <path d="M21 21l-2-2"></path>
      <path d="M3 3l2 2"></path>
      <path d="M4.24 4.24a9.12 9.12 0 0 0 8.11 12.04"></path>
    </svg>
  );

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center p-6 relative overflow-y-auto overflow-x-hidden bg-background">
      <div className="w-full max-w-sm z-10 flex flex-col items-center space-y-10 my-4">
        <div className="text-center flex flex-col items-center space-y-3">
          <h1 className="text-5xl font-black italic tracking-tighter text-primary">
            QUIZ<span className="text-foreground">2026</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-tight">
            {isRegisterMode ? "Crie sua conta para participar" : "Pronto para o hexa?"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5 bg-surface border border-border-subtle p-8 rounded-2xl shadow-2xl transition-all duration-500 overflow-hidden">
          {/* Alternador de Modo (Switcher) */}
          <div className="flex p-1 bg-background/50 border border-border-subtle rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setIsRegisterMode(false); setError(""); }}
              className={`flex-1 py-3 text-xs font-black tracking-widest rounded-lg transition-all duration-300 ${!isRegisterMode ? "bg-primary text-background" : "text-foreground/40"}`}
            >
              ENTRAR
            </button>
            <button
              type="button"
              onClick={() => { setIsRegisterMode(true); setError(""); }}
              className={`flex-1 py-3 text-xs font-black tracking-widest rounded-lg transition-all duration-300 ${isRegisterMode ? "bg-primary text-background" : "text-foreground/40"}`}
            >
              CADASTRAR
            </button>
          </div>

          <div className="space-y-5 transition-all duration-300">
            {isRegisterMode && (
              <div className="space-y-5 animate-slide-down">
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
              </div>
            )}

            <Input
              label="Usuário"
              placeholder="Seu nome de usuário"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!isRegisterMode && error && error !== "As senhas não coincidem" ? " " : ""}
            />
            
            <Input
              label="Senha"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightElement={
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:bg-foreground/5 p-1 rounded-md transition-colors"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            {isRegisterMode && (
              <div className="animate-slide-down">
                <Input
                  label="Confirmar Senha"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  rightElement={
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="hover:bg-foreground/5 p-1 rounded-md transition-colors"
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />

                <div className="pt-2">
                  <AvatarSelector 
                    selectedAvatar={selectedAvatar} 
                    onSelect={setSelectedAvatar} 
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-bold text-center animate-shake">
              {error}
            </div>
          )}

          {!isRegisterMode && (
            <div className="flex justify-end mt-1">
              <button type="button" className="text-sm font-medium text-foreground/40 hover:text-primary transition-colors">
                Redefinir Senha
              </button>
            </div>
          )}

          <Button type="submit" fullWidth disabled={isLoading} className="mt-6">
            {isLoading ? (isRegisterMode ? "Criando..." : "Entrando...") : (isRegisterMode ? "Criar Conta" : "Entrar")}
          </Button>
        </form>

        <div className="text-center text-sm font-medium text-foreground/40">
          Quiz feito para a nação brasileira 🇧🇷
        </div>
      </div>
    </main>
  );
}


