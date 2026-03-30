import { User } from "../types/auth";
import { delay } from "../utils/delay";

export class AuthRepository {
  static async login(loginUser: string, password: string): Promise<User | null> {
    await delay(600); // Fake latency

    // fallback mock user
    if (loginUser === "teste" && password === "12345678") {
      return { id: "mock-1", name: "Usuário Teste", email: "teste@gmail.com", login: "teste", points: 850 };
    }

    const savedUsersStr = localStorage.getItem("quiz_users_db");
    const users = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    const foundUser = users.find((u: any) => u.login === loginUser && u.password === password);
    if (foundUser) {
      return { 
        id: foundUser.id || Math.random().toString(36).substr(2, 9),
        name: foundUser.name, 
        email: foundUser.email, 
        login: foundUser.login,
        points: foundUser.points || 0
      };
    }

    return null;
  }

  static async register(name: string, email: string, loginUser: string, password: string): Promise<User | null> {
    await delay(800); // Fake latency

    const savedUsersStr = localStorage.getItem("quiz_users_db");
    const users = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    if (users.find((u: any) => u.login === loginUser || u.email === email)) {
      return null;
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

    return { id: newUser.id, name, email, login: loginUser, points: 0 };
  }

  static async getProfile(userIdStr?: string): Promise<any> {
    await delay(400); // Fake latency
    // In a real app we would use user's JWT token server-side or pass the header
    // Here we will just look at localStorage to fetch matches stats
    
    const savedActivities = localStorage.getItem("quiz_activities_db");
    const activities = savedActivities ? JSON.parse(savedActivities) : [];
    
    return {
      stats: {
        quizzes_played: activities.length,
        correct_answers: activities.filter((a: any) => a.correct).length,
        accuracy: activities.length > 0 ? Math.round((activities.filter((a: any) => a.correct).length / activities.length) * 100) : 0
      }
    };
  }
}
