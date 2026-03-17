import { Question, QuestionType } from "@/app/types/quiz";

export const QUESTIONS: Question[] = [
  {
    id: "1",
    title: "Qual país sediará a abertura da Copa do Mundo de 2026?",
    type: QuestionType.MULTIPLE_CHOICE,
    answer: '2',
    options: [
      { id: '0', text: "Canadá" },
      { id: '1', text: "Estados Unidos" },
      { id: '2', text: "México" },
      { id: '3', text: "Marrocos" }
    ],
  },
  {
    id: '2',
    title: "A Copa de 2026 será a primeira com 48 seleções.",
    type: QuestionType.TRUE_FALSE,
    answer: '0',
    options: [
      { id: '0', text: "Verdadeiro" },
      { id: '1', text: "Falso" }
    ],
  },
  {
    id: '3',
    title: "Em qual estádio será o jogo de abertura? (Dica: é no México)",
    type: QuestionType.GUESS_THE_WORD,
    answer: "AZTECA",
    options: [],
  },
  {
    id: '4',
    title: "Qual estado americano receberá mais jogos da Copa?",
    type: QuestionType.WORDLE,
    answer: "TEXAS",
    options: [],
  },
  {
    id: '5',
    title: "Cidade dos EUA que sediará a disputa do 3º lugar:",
    type: QuestionType.WORDLE,
    answer: "MIAMI",
    options: [],
  },
  {
    id: '6',
    title: "Em qual continente será realizada a Copa de 2026?",
    type: QuestionType.MULTIPLE_CHOICE,
    answer: '1',
    options: [
      { id: '0', text: "Europa" },
      { id: '1', text: "América do Norte" },
      { id: '2', text: "América do Sul" },
      { id: '3', text: "Ásia" }
    ],
  },
  {
    id: '7',
    title: "O que será decidido no MetLife Stadium em 19 de julho?",
    type: QuestionType.WORDLE,
    answer: "FINAL",
    options: [],
  },
  {
    id: '8',
    title: "Qual dessas cidades canadenses é sede da Copa?",
    type: QuestionType.MULTIPLE_CHOICE,
    answer: '3',
    options: [
      { id: '0', text: "Ottawa" },
      { id: '1', text: "Montreal" },
      { id: '2', text: "Quebec" },
      { id: '3', text: "Toronto" }
    ],
  }
];
