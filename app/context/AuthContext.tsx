"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { User, AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem("quiz_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("quiz_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (loginUser: string, password: string): Promise<boolean> => {
    // Busca usuários cadastrados na simulação
    const savedUsersStr = localStorage.getItem("quiz_users_db");
    let users = [];
    if (savedUsersStr) {
      try {
        users = JSON.parse(savedUsersStr);
      } catch (e) {
        users = [];
      }
    }

    // 1. Verificação do usuário padrão (Fallback)
    if (loginUser === "teste" && password === "12345678") {
      const mockUser: User = { name: "Usuário Teste", email: "teste@gmail.com", login: "teste" };
      setUser(mockUser);
      localStorage.setItem("quiz_user", JSON.stringify(mockUser));
      return true;
    }

    // 2. Busca nos usuários cadastrados dinamicamente
    const foundUser = users.find((u: any) => u.login === loginUser && u.password === password);
    if (foundUser) {
      const userData: User = { name: foundUser.name, email: foundUser.email, login: foundUser.login };
      setUser(userData);
      localStorage.setItem("quiz_user", JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const register = async (name: string, email: string, loginUser: string, password: string): Promise<boolean> => {
    const savedUsersStr = localStorage.getItem("quiz_users_db");
    let users = [];
    if (savedUsersStr) {
      try {
        users = JSON.parse(savedUsersStr);
      } catch (e) {
        users = [];
      }
    }

    // Verifica se login ou email já existe
    if (users.find((u: any) => u.login === loginUser || u.email === email)) {
      return false; // Usuário já existe
    }

    const newUser = { name, email, login: loginUser, password };
    users.push(newUser);
    localStorage.setItem("quiz_users_db", JSON.stringify(users));

    // Logar o usuário automaticamente
    const userData: User = { name, email, login: loginUser };
    setUser(userData);
    localStorage.setItem("quiz_user", JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("quiz_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
