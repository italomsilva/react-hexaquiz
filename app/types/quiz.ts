export enum QuestionType {
  MULTIPLE_CHOICE = 0,
  TRUE_FALSE = 1,
  GUESS_THE_WORD = 2,
  WORDLE = 3,
  ORDERING = 4,
}


export interface Option {
  id: string;
  text?: string;
  image?: string;
  questionId: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  answer: string;
  image?: string;
  basePoints: number;
  options: Option[];
}