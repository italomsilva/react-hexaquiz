import { User } from "../types/auth";
import { delay } from "../utils/delay";
import { ApiResponse } from "../types/api";

export class AuthRepository {
  static async login(loginUser: string, password: string): Promise<ApiResponse<User>> {
    await delay(600); // Fake latency

    // fallback mock user
    if (loginUser === "teste" && password === "12345678") {
      return { status: "success", data: { id: "mock-1", name: "Usuário Teste", email: "teste@gmail.com", login: "teste", points: 850 } };
    }

    const savedUsersStr = localStorage.getItem("quiz_users_db");
    const users = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    const foundUser = users.find((u: any) => u.login === loginUser && u.password === password);
    if (foundUser) {
      return { 
        status: "success",
        data: {
          id: foundUser.id || Math.random().toString(36).substr(2, 9),
          name: foundUser.name, 
          email: foundUser.email, 
          login: foundUser.login,
          points: foundUser.points || 0
        }
      };
    }

    return { status: "error", data: null, error: { code: "UNAUTHORIZED", message: "Credenciais inválidas" } };
  }

  static async register(name: string, email: string, loginUser: string, password: string): Promise<ApiResponse<User>> {
    await delay(800); // Fake latency

    const savedUsersStr = localStorage.getItem("quiz_users_db");
    const users = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    if (users.find((u: any) => u.login === loginUser || u.email === email)) {
      return { status: "error", data: null, error: { code: "USER_EXISTS", message: "O e-mail ou nome de usuário já está em uso" } };
    }

    const newUser = { 
      id: Math.random().toString(36).substr(2, 9),
      name, 
      email, 
      login: loginUser, 
      password,
      points: 0
    };
    
    users.push(newUser);
    localStorage.setItem("quiz_users_db", JSON.stringify(users));

    return { status: "success", data: { id: newUser.id, name, email, login: loginUser, points: 0 } };
  }

  static async getProfile(userIdStr?: string): Promise<ApiResponse<{stats: any}>> {
    await delay(400); // Fake latency
    // In a real app we would use user's JWT token server-side or pass the header
    // Here we will just look at localStorage to fetch matches stats
    
    const savedActivities = localStorage.getItem("answers_log_db");
    const activities = savedActivities ? JSON.parse(savedActivities) : [];
    
    return {
      status: "success",
      data: {
        stats: {
          quizzes_played: activities.length,
          correct_answers: activities.filter((a: any) => a.correct).length,
          accuracy: activities.length > 0 ? Math.round((activities.filter((a: any) => a.correct).length / activities.length) * 100) : 0
        }
      }
    };
  }
}
