export enum QuestionType {
  MULTIPLE_CHOICE = 1,
  TRUE_FALSE = 2,
  GUESS_THE_WORD = 3,
  WORDLE = 4,
  ORDERING = 5,
}


export interface Option {
  id: string;
  text?: string;
  image_url?: string;
  questionId: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  answer: string;
  image_url?: string;
  base_points: number;
  options: Option[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
}
