import { Question, QuestionType } from "@/app/types/quiz";

export const QUESTIONS: Question[] = [
  {
    id: "0",
    text: "Complete a escalação",
    type: QuestionType.MULTIPLE_CHOICE,
    image_url: "/images/bg-home.png",
    answer: '0',
    base_points: 100,
    options: [
      { id: '0', text: "Opção 1", image_url: "/images/bg-home.png", question_id: "0" },
      { id: '1', text: "Opção 2", image_url: "/images/bg-home.png", question_id: "0" },
      { id: '2', text: "Opção 3", image_url: "/images/bg-home.png", question_id: "0" },
      { id: '3', text: "Opção 4", image_url: "/images/bg-home.png", question_id: "0" }
    ],
  },
  {
    id: "1",
    text: "Qual país sediará a abertura da Copa do Mundo de 2026?",
    type: QuestionType.MULTIPLE_CHOICE,
    answer: '2',
    base_points: 100,
    options: [
      { id: '0', text: "Canadá", question_id: "1" },
      { id: '1', text: "Estados Unidos", question_id: "1" },
      { id: '2', text: "México", question_id: "1" },
      { id: '3', text: "Marrocos", question_id: "1" }
    ],
  },
  {
    id: '2',
    text: "A Copa de 2026 será a primeira com 48 seleções.",
    type: QuestionType.TRUE_FALSE,
    answer: '0',
    base_points: 50,
    options: [
      { id: '0', text: "Verdadeiro", question_id: "2" },
      { id: '1', text: "Falso", question_id: "2" }
    ],
  },
  {
    id: '3',
    text: "Em qual estádio será o jogo de abertura?",
    type: QuestionType.GUESS_THE_WORD,
    answer: "AZTECA",
    base_points: 200,
    options: [
      { id: 'hint', text: "Foi palco das finais de 1970 e 1986.", question_id: "3" }
    ],
  },
  {
    id: '4',
    text: "Qual estado americano receberá mais jogos da Copa?",
    type: QuestionType.WORDLE,
    answer: "TEXAS",
    base_points: 150,
    options: [],
  },
  {
    id: '5',
    text: "Cidade dos EUA que sediará a disputa do 3º lugar:",
    type: QuestionType.WORDLE,
    answer: "MIAMI",
    base_points: 150,
    options: [],
  },
  {
    id: '6',
    text: "Em qual continente será realizada a Copa de 2026?",
    type: QuestionType.MULTIPLE_CHOICE,
    answer: '1',
    base_points: 100,
    options: [
      { id: '0', text: "Europa", question_id: "6" },
      { id: '1', text: "América do Norte", question_id: "6" },
      { id: '2', text: "América do Sul", question_id: "6" },
      { id: '3', text: "Ásia", question_id: "6" }
    ],
  },
  {
    id: '7',
    text: "O que será decidido no MetLife Stadium em 19 de julho?",
    type: QuestionType.WORDLE,
    answer: "FINAL",
    base_points: 150,
    options: [],
  },
  {
    id: '8',
    text: "Qual dessas cidades canadenses é sede da Copa?",
    type: QuestionType.MULTIPLE_CHOICE,
    answer: '3',
    base_points: 100,
    options: [
      { id: '0', text: "Ottawa", question_id: "8" },
      { id: '1', text: "Montreal", question_id: "8" },
      { id: '2', text: "Quebec", question_id: "8" },
      { id: '3', text: "Toronto", question_id: "8" }
    ],
  },
  {
    id: '9',
    text: "Ordene os países sede da Copa de 2026 pelo número de cidades sede (do maior para o menor):",
    type: QuestionType.ORDERING,
    base_points: 200,
    answer: "usa,mexico,canada",
    options: [
      { id: 'canada', text: "Canadá", question_id: "9" },
      { id: 'mexico', text: "México", question_id: "9" },
      { id: 'usa', text: "Estados Unidos", question_id: "9" },
    ],
  }
];
