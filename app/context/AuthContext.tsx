"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { User, AuthContextType } from "../types/auth";
import { AuthRepository } from "../repositories/AuthRepository";

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
    const res = await AuthRepository.login(loginUser, password);
    if (res.status === "success" && res.data) {
      setUser(res.data);
      localStorage.setItem("quiz_user", JSON.stringify(res.data));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, loginUser: string, password: string): Promise<boolean> => {
    const res = await AuthRepository.register(name, email, loginUser, password);
    if (res.status === "success" && res.data) {
      // Logar o usuário automaticamente
      setUser(res.data);
      localStorage.setItem("quiz_user", JSON.stringify(res.data));
      return true;
    }
    return false;
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
