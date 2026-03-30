import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "CARREGANDO..." }) => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"></div>
      <p className="mt-6 text-primary font-black tracking-widest animate-pulse text-sm">
        {message}
      </p>
    </div>
  );
};
