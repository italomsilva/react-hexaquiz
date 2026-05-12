"use client";

import React from "react";
import Image from "next/image";
import { AVATARS } from "@/app/constants/avatars";

interface AvatarSelectorProps {
  selectedAvatarIndex: string;
  onSelect: (index: string) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  selectedAvatarIndex,
  onSelect,
}) => {
  return (
    <div className="space-y-4">
      <label className="text-sm font-bold text-foreground/60 uppercase tracking-widest pl-1">
        Escolha seu Avatar
      </label>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
        {AVATARS.map((avatar, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index.toString())}
            className={`
              relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 group
              ${
                selectedAvatarIndex === index.toString()
                  ? "border-primary scale-105 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)]"
                  : "border-transparent hover:border-border-standard grayscale hover:grayscale-0"
              }
            `}
          >
            <Image
              src={avatar}
              alt={`Avatar ${index}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {selectedAvatarIndex === index.toString() && (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <div className="bg-primary text-black rounded-full p-0.5 scale-75">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
