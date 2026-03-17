export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  GUESS_THE_WORD = "guess_the_word",
  WORDLE = "wordle",
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  answer: string;
  options: Option[];
}
