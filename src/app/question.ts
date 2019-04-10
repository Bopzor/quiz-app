export class Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  answers: { text: string, correct: boolean }[];
}
