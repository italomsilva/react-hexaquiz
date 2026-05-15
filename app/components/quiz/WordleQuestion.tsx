"use client";

import { Question } from "@/app/types/quiz";
import { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/Button";
import Image from "next/image";
import { safeDecodeBase64 } from "@/app/utils/crypto";
import { normalizeText } from "@/app/utils/text";

interface WordleQuestionProps {
  question: Question;
  isAnswered: boolean;
  correctAnswer: string | null;
  onSelect: (answer: string) => void;
}

const MAX_ATTEMPTS = 6;

type LetterStatus = "correct" | "present" | "absent" | "empty";

export function WordleQuestion({
  question,
  isAnswered,
  correctAnswer,
  onSelect,
}: WordleQuestionProps) {
  const decodedLocalAnswer = normalizeText(safeDecodeBase64(question.answer));

  const targetWord = decodedLocalAnswer;
  const wordLength = targetWord.length;

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = `wordle_state_${question.id}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.guesses) setGuesses(parsed.guesses);
        if (parsed.gameOver) setGameOver(parsed.gameOver);
      } catch (e) {
        console.error("Failed to parse Wordle state", e);
      }
    }
    setIsLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(storageKey, JSON.stringify({ guesses, gameOver }));
    }
  }, [guesses, gameOver, isLoaded, storageKey]);

  // Keyboard mapping
  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ];

  const getLetterStatus = (guess: string, index: number): LetterStatus => {
    const letter = guess[index];
    if (letter === targetWord[index]) return "correct";
    if (targetWord.includes(letter)) return "present";
    return "absent";
  };

  const getKeyboardStatus = (key: string): LetterStatus | "neutral" => {
    let status: LetterStatus | "neutral" = "neutral";
    for (const guess of guesses) {
      const index = guess.indexOf(key);
      if (index !== -1) {
        const letterStatus = getLetterStatus(guess, index);
        if (letterStatus === "correct") return "correct";
        if (letterStatus === "present") status = "present";
        if (letterStatus === "absent" && status === "neutral") status = "absent";
      }
    }
    return status;
  };

  const handleKeyPress = useCallback((key: string) => {
    if (gameOver || isAnswered) return;

    if (key === "ENTER") {
      if (currentGuess.length === wordLength) {
        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess("");

        if (normalizeText(currentGuess) === targetWord) {
          setGameOver(true);
          onSelect(currentGuess);
        } else if (newGuesses.length >= MAX_ATTEMPTS) {
          setGameOver(true);
          onSelect(currentGuess); // Failed, but we select the last guess
        }
      }
    } else if (key === "⌫" || key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-ZÇÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛ]$/i.test(key) && currentGuess.length < wordLength) {
      setCurrentGuess((prev) => prev + normalizeText(key));
    }
  }, [currentGuess, gameOver, isAnswered, guesses, targetWord, wordLength, onSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyPress(e.key.toUpperCase());
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-500">
      {/* Question Image */}
      {question.image && (
        <div className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-2xl border-4 border-surface-elevated shadow-2xl mb-4">
          <Image
            src={question.image}
            alt={question.text}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Grid */}
      <div 
        className="grid w-full px-2 mx-auto" 
        style={{ 
          gridTemplateColumns: `repeat(${wordLength}, 1fr)`,
          gap: wordLength > 7 ? '0.25rem' : '0.5rem',
          maxWidth: `${wordLength * 3.5}rem`
        }}
      >
        {[...Array(MAX_ATTEMPTS)].map((_, rowIndex) => {
          const guess = guesses[rowIndex];
          const isCurrentRow = rowIndex === guesses.length;

          return [...Array(wordLength)].map((_, colIndex) => {
            let letter = "";
            let status: LetterStatus = "empty";

            if (guess) {
              letter = guess[colIndex];
              status = getLetterStatus(guess, colIndex);
            } else if (isCurrentRow) {
              letter = currentGuess[colIndex] || "";
            }

            const statusStyles = {
              correct: "bg-green-500 border-green-500 text-white animate-bounce-short",
              present: "bg-yellow-500 border-yellow-500 text-white animate-shake",
              absent: "bg-surface-elevated border-border-standard text-foreground/40",
              empty: "bg-surface border-border-standard text-foreground",
            };

            const fontSize = wordLength > 8 ? "text-base" : wordLength > 6 ? "text-xl" : "text-2xl";

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                aria-label={`Linha ${rowIndex + 1}, Coluna ${colIndex + 1}: ${letter || "Vazio"}${status !== "empty" ? `, Status: ${status}` : ""}`}
                className={`aspect-square w-full flex items-center justify-center border-2 rounded-lg ${fontSize} font-black transition-all duration-300 ${
                  statusStyles[status]
                } ${isCurrentRow && letter ? "border-primary scale-110" : ""}`}
              >
                {letter}
              </div>
            );
          });
        })}
      </div>

      {/* Keyboard */}
      <div className="w-full max-w-md space-y-2">
        {keyboardRows.map((row, i) => (
          <div key={i} className="flex justify-center gap-1.5">
            {row.map((key) => {
              const status = getKeyboardStatus(key);
              const isSpecial = key.length > 1;
              
              const statusStyles = {
                correct: "bg-green-500 text-white",
                present: "bg-yellow-500 text-white",
                absent: "bg-surface-elevated text-foreground/20",
                neutral: "bg-surface border-border-standard text-foreground",
              };

              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  aria-label={key === "⌫" ? "Apagar" : key}
                  className={`
                    ${isSpecial ? "px-4 text-xs" : "flex-1"} 
                    h-12 rounded-lg font-bold transition-all active:scale-95
                    ${statusStyles[status as keyof typeof statusStyles] || statusStyles.neutral}
                    border-b-4 border-black/20
                  `}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {isAnswered && correctAnswer && (
        <div className="text-center animate-in slide-in-from-top-4">
           <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-1">A palavra era</p>
           <p className="text-4xl font-black italic text-primary tracking-[0.2em]">{normalizeText(correctAnswer)}</p>
        </div>
      )}
    </div>
  );
}
