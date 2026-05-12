"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Header } from "@/app/components/layout/Header";
import { ProtectedRoute } from "@/app/components/layout/ProtectedRoute";
import { Button } from "@/app/components/ui/Button";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";
import { AuthRepository } from "@/app/repositories/AuthRepository";
import { AvatarSelector } from "@/app/components/register/AvatarSelector";
import { AVATARS } from "@/app/constants/avatars";

export default function ProfilePage() {
  const theme = useTheme();
  const { user, logout, updateAvatar, updateProfile } = useAuth();
  const [stats, setStats] = useState({ quizzesPlayed: 0, accuracy: 0, points: 0 });
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("0");
  
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
   const [error, setError] = useState("");
   const [successMessage, setSuccessMessage] = useState("");
   const [isLoading, setIsLoading] = useState(false);

  const hasFetchedRef = React.useRef(false);
  useEffect(() => {
    if (user && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      AuthRepository.getProfile(user.id).then(res => {
        if (res.status === "success" && res.data?.stats) {
          setStats(res.data.stats);
        }
      });
      if (user.profileUser && user.profileUser !== "N/A") {
        setSelectedAvatar(user.profileUser);
      }
      setEditName(user.name || "N/A");
      setEditUsername(user.username || "N/A");
    }
  }, [user]);

  const handleUpdateAvatar = async () => {
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    const success = await updateAvatar(selectedAvatar);
    setIsLoading(false);
    if (success) {
      setSuccessMessage("Avatar atualizado com sucesso!");
    } else {
      setError("Erro ao atualizar avatar");
    }
  };

  const handleUpdateInfo = async () => {
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    const success = await updateProfile({ 
      name: editName, 
      username: editUsername 
    });
    setIsLoading(false);
    if (success) {
      setSuccessMessage("Dados atualizados com sucesso!");
    } else {
      setError("Erro ao atualizar dados");
    }
  };

  const handleUpdatePassword = async () => {
    setError("");
    setSuccessMessage("");
    if (!newPassword) {
      setError("Digite a nova senha");
      return;
    }
    if (newPassword.length < 8) {
      setError("A nova senha deve ter no mínimo 8 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setIsLoading(true);
    const success = await updateProfile({ 
      newPassword: newPassword 
    });
    setIsLoading(false);
    if (success) {
      setSuccessMessage("Senha alterada com sucesso!");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setError("Erro ao atualizar senha");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
    
        <main className="flex-1 w-full max-w-md mx-auto p-6 flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="flex flex-col items-center space-y-4">
            {/* profile image */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-surface border-2 border-primary p-1">
                <div className="w-full h-full rounded-full bg-surface-elevated flex items-center justify-center overflow-hidden relative">
                  {user?.profileUser && user.profileUser !== "N/A" ? (
                    <Image
                      src={AVATARS[parseInt(user.profileUser)] || AVATARS[0]}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/40">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="absolute bottom-0 right-0 p-2 bg-primary rounded-full border border-background shadow-lg hover:scale-110 transition-transform cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>

            <div className="text-center">
              <h2 className={`text-2xl font-bold italic tracking-tighter uppercase`} style={{ color: theme.theme === 'dark' ? 'var(--color-primary-light)' : 'var(--color-primary-dark)' }}>@{user?.username}</h2>
              <p className="text-foreground/60 text-sm font-medium">{user?.name}</p>
              <div className="mt-4 p-3 bg-surface rounded-xl border border-border-subtle inline-block min-w-[120px]">
                <div className="text-[10px] font-black tracking-widest text-foreground/40 uppercase">Pontos</div>
                <div className="text-xl font-black italic text-neon text-shadow-glow">{stats.points || 0}</div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-surface border border-border-subtle text-center space-y-1">
                <div className="text-xs font-black text-foreground/40 uppercase tracking-widest">Partidas</div>
                <div className="text-2xl font-black italic text-primary">{stats.quizzesPlayed}</div>
              </div>
              <div className="p-5 rounded-2xl bg-surface border border-border-subtle text-center space-y-1">
                <div className="text-xs font-black text-foreground/40 uppercase tracking-widest">Precisão</div>
                <div className="text-2xl font-black italic text-primary">{stats.accuracy}%</div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border-standard">
              <Button
                onClick={() => setIsEditingProfile(true)}
                variant="outline"
                fullWidth
              >
                EDITAR PERFIL
              </Button>
              <div className="pt-2">
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
        
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface border border-border-standard rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 h-[90vh] overflow-y-auto">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black italic tracking-tighter text-primary">Editar Perfil</h3>
                <p className="text-sm font-medium text-foreground/60">Mantenha seus dados e avatar atualizados</p>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40">Avatar</label>
                  <AvatarSelector
                    selectedAvatarIndex={selectedAvatar}
                    onSelect={setSelectedAvatar}
                  />
                  <Button 
                    size="sm" 
                    fullWidth 
                    variant="outline"
                    onClick={handleUpdateAvatar} 
                    disabled={isLoading}
                  >
                    ATUALIZAR AVATAR
                  </Button>
                </div>

                <div className="space-y-4 pt-6 border-t border-border-subtle">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40">Informações Pessoais</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-foreground/40">Nome Completo</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-background/50 border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-foreground/40">Usuário</label>
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="w-full bg-background/50 border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="Seu usuário"
                      />
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    fullWidth 
                    variant="outline"
                    onClick={handleUpdateInfo} 
                    disabled={isLoading}
                  >
                    ATUALIZAR DADOS
                  </Button>
                </div>

                <div className="space-y-4 pt-6 border-t border-border-subtle">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40">Segurança</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-foreground/40">Nova Senha</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-background/50 border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="Mínimo 8 caracteres"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-foreground/40">Confirmar Senha</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-background/50 border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="Confirmação"
                      />
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    fullWidth 
                    variant="outline"
                    onClick={handleUpdatePassword} 
                    disabled={isLoading}
                  >
                    ATUALIZAR SENHA
                  </Button>
                </div>
              </div>
              
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-bold text-center animate-in fade-in zoom-in-95">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/50 text-green-500 text-xs font-bold text-center animate-in fade-in zoom-in-95">
                  {successMessage}
                </div>
              )}

              <div className="pt-4 border-t border-border-subtle">
                <Button variant="secondary" fullWidth onClick={() => { setIsEditingProfile(false); setError(""); setSuccessMessage(""); }} disabled={isLoading}>
                  FECHAR
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
