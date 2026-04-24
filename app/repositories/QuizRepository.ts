import { delay } from "../utils/delay";
import { QUESTIONS } from "../constants/questions";
import { Question, Option, QuestionType } from "../types/quiz";
import { ApiResponse } from "../types/api";
import { safeEncodeBase64 } from "../utils/crypto";

export interface QuizSession {
  index: number;
  points: number;
  finished: boolean;
  correctCount: number;
}

export class QuizRepository {
  static async getDailyQuiz(): Promise<ApiResponse<{ questions: Question[], session: QuizSession }>> {
    await delay(800); // Fake latency to load questions
    
    // Ofusca respostas dependendo do tipo da pergunta
    const sanitizedQuestions = QUESTIONS.map(q => {
      let secureAnswer = "HIDDEN";
      if (q.type === QuestionType.WORDLE || q.type === QuestionType.GUESS_THE_WORD) {
         secureAnswer = safeEncodeBase64(q.answer);
      }
      return { ...q, answer: secureAnswer };
    });

    // Recupera a sessão atual do banco de dados (por username do localStorage)
    const loggedUserStr = localStorage.getItem("quiz_user");
    let username = "anonymous";
    if (loggedUserStr) {
       username = JSON.parse(loggedUserStr).username;
    }

    const sessionsStr = localStorage.getItem("daily_quiz_attempts_db");
    let allSessions = sessionsStr ? JSON.parse(sessionsStr) : {};
    
    let userSession = allSessions[username];
    if (!userSession) {
       userSession = { index: 0, points: 0, finished: false, correctCount: 0 };
       allSessions[username] = userSession;
       localStorage.setItem("daily_quiz_attempts_db", JSON.stringify(allSessions));
    }

    return { status: "success", data: { questions: sanitizedQuestions, session: userSession } };
  }

  static async submitAnswer(questionId: string, answer: string, attempts: number): Promise<ApiResponse<{correct: boolean, points_earned: number, correct_answer_payload: string}>> {
    await delay(400); // Fake ping/pong for answering

    const question = QUESTIONS.find(q => q.id === questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    // Default uppercase format for texts like GUESS_THE_WORD
    const isCorrect = question.answer.toUpperCase() === answer.toUpperCase() || question.answer === answer;
    
    let earnedPoints = 0;
    
    if (isCorrect) {
      if (question.type === QuestionType.GUESS_THE_WORD) {
        // Penalty logic for guess the word
        const multiplier = Math.max(0, 1 - (attempts - 1) * 0.2);
        earnedPoints = Math.round(question.base_points * multiplier);
      } else {
        earnedPoints = question.base_points;
      }
    }

    // --- Record internally in DB (MOCKS) ---
    // Update user points
    const activeUserStr = localStorage.getItem("quiz_user");
    if (activeUserStr) {
      const activeUser = JSON.parse(activeUserStr);
      activeUser.points = Math.round((activeUser.points || 0) + earnedPoints);
      localStorage.setItem("quiz_user", JSON.stringify(activeUser));
      
      // Update the user record in the DB list too
      const savedUsersStr = localStorage.getItem("quiz_users_db");
      if (savedUsersStr) {
        let users = JSON.parse(savedUsersStr);
        const uIndex = users.findIndex((u: any) => u.username === activeUser.username);
        if (uIndex !== -1) {
          users[uIndex].points = activeUser.points;
          localStorage.setItem("quiz_users_db", JSON.stringify(users));
        }
      }

      // Adiciona na pontuação da Sessão atual também
      const username = activeUser.username;
      const sessionsStr = localStorage.getItem("daily_quiz_attempts_db");
      let allSessions = sessionsStr ? JSON.parse(sessionsStr) : {};
      let userSession = allSessions[username] || { index: 0, points: 0, finished: false, correctCount: 0 };
      
      userSession.points += earnedPoints;
      if (isCorrect) {
        userSession.correctCount = (userSession.correctCount || 0) + 1;
      }
      
      allSessions[username] = userSession;
      localStorage.setItem("daily_quiz_attempts_db", JSON.stringify(allSessions));
    }

    // Record activity score (simplified analytics)
    const activities = JSON.parse(localStorage.getItem("answers_log_db") || "[]");
    activities.push({
      question_id: questionId,
      correct: isCorrect,
      points: earnedPoints,
      date: new Date().toISOString()
    });
    localStorage.setItem("answers_log_db", JSON.stringify(activities));

    return {
      status: "success",
      data: {
        correct: isCorrect,
        points_earned: earnedPoints,
        // Se errou ou acertou, sempre voltamos o final correto payload agora para renderizar
        correct_answer_payload: question.answer 
      }
    };
  }

  // Novo método para o front avisar que avançou no ponteiro do Quiz para salvar o progresso
  static async advanceSession(username: string, newIndex: number, finished: boolean): Promise<ApiResponse<null>> {
     const sessionsStr = localStorage.getItem("daily_quiz_attempts_db");
     let allSessions = sessionsStr ? JSON.parse(sessionsStr) : {};
     let userSession = allSessions[username] || { index: 0, points: 0, finished: false, correctCount: 0 };
     
     userSession.index = newIndex;
     userSession.finished = finished;
     allSessions[username] = userSession;
     localStorage.setItem("daily_quiz_attempts_db", JSON.stringify(allSessions));
     return { status: "success", data: null };
  }
}
