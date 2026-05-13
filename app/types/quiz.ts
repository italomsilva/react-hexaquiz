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