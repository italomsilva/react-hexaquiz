import { Question, QuestionType } from "../types/quiz";
import { ApiResponse } from "../types/api";
import { apiClient } from "../utils/apiClient";

export interface QuizSession {
  index: number;
  points: number;
  finished: boolean;
  correctCount: number;
}

export class QuizRepository {
  static async getDailyQuiz(): Promise<ApiResponse<{ questions: Question[], session: QuizSession }>> {
    const loggedUserStr = localStorage.getItem("quiz_user");
    if (!loggedUserStr) {
       throw new Error("Usuário não autenticado");
    }
    const userId = JSON.parse(loggedUserStr).id;

    try {
      const response = await apiClient.get<any>(`/daily/${userId}`);
      
      const questions: Question[] = response.questions.map((q: any) => ({
        id: q.id,
        text: q.text,
        type: q.type as QuestionType,
        image: q.image || undefined,
        options: q.options ? q.options.map((opt: any) => ({
           id: opt.id,
           text: opt.text,
           image: opt.image || undefined,
           questionId: q.id
        })) : [],
        answer: q.answer,
        basePoints: q.basePoints || 100
      }));

      const session: QuizSession = {
        index: response.session.index || 0,
        points: response.session.points || 0,
        finished: response.session.finished || false,
        correctCount: (response.session.points || 0) / 10
      };

      return { status: "success", data: { questions, session } };
    } catch (error: any) {
      return { status: "error", data: null as any, error: { code: "FETCH_ERROR", message: error.message } };
    }
  }

  static async submitAnswer(questionId: string, answer: string, basePoints: number): Promise<ApiResponse<{correct: boolean, points_earned: number, correct_answer_payload: string}>> {
    const loggedUserStr = localStorage.getItem("quiz_user");
    if (!loggedUserStr) {
       throw new Error("Usuário não autenticado");
    }
    const user = JSON.parse(loggedUserStr);
    const userId = user.id;

    try {
      const response = await apiClient.post<any>(`/answer/${userId}`, {
        questionId,
        answer
      });

      const isCorrect = response.correct;
      // Regra de negócio exigida: acertou = ganha tudo, errou = ganha 0
      const earnedPoints = isCorrect ? basePoints : 0;

      // Adicionamos os pontos localmente no objeto do usuário para simular,
      // já que a API de pontos total ainda está em desenvolvimento.
      if (isCorrect) {
        user.totalPoints = (user.totalPoints || 0) + earnedPoints;
        localStorage.setItem("quiz_user", JSON.stringify(user));
      }

      return {
        status: "success",
        data: {
          correct: isCorrect,
          points_earned: earnedPoints,
          correct_answer_payload: response.correctAnswerPayload || response.correct_answer_payload || "" 
        }
      };
    } catch (error: any) {
       return { status: "error", data: null as any, error: { code: "SUBMIT_ERROR", message: error.message } };
    }
  }

  static async resetSession(username: string): Promise<ApiResponse<null>> {
    // Backend não suporta reset diário
    return { status: "success", data: null };
  }
}
