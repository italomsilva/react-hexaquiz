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

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const res = await AuthRepository.login(username, password);
    setIsLoading(false);

    if (res.status === "success" && res.data) {
      setUser(res.data);
      localStorage.setItem("quiz_user", JSON.stringify(res.data));
      router.push("/");
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, username: string, password: string, profileImage: string): Promise<boolean> => {
    setIsLoading(true);
    const res = await AuthRepository.register(name, email, username, password, profileImage);
    setIsLoading(false);

    if (res.status === "success" && res.data) {
      setUser(res.data);
      localStorage.setItem("quiz_user", JSON.stringify(res.data));
      router.push("/");
      return true;
    }
    return false;
  };

  const updateAvatar = async (avatarUrl: string): Promise<boolean> => {
    if (!user) return false;
    const res = await AuthRepository.updateAvatar(user.id, avatarUrl);
    if (res.status === "success" && res.data) {
      setUser(res.data);
      localStorage.setItem("quiz_user", JSON.stringify(res.data));
      return true;
    }
    return false;
  };

  const updateProfile = async (data: { name?: string, username?: string, email?: string, avatarUrl?: string, newPassword?: string }): Promise<boolean> => {
    if (!user) return false;
    const res = await AuthRepository.updateProfile(user.id, data);
    if (res.status === "success" && res.data) {
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
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, updateAvatar, updateProfile, logout, isLoading }}>
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
