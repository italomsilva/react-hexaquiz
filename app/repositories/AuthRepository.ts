import { User } from "../types/auth";
import { delay } from "../utils/delay";
import { ApiResponse } from "../types/api";

export class AuthRepository {
  static async login(
    username: string,
    password: string,
  ): Promise<ApiResponse<User>> {
    await delay(600); // Fake latency

    if (username === "teste" && password === "12345678") {
      return {
        status: "success",
        data: {
          id: "mock-1",
          name: "Usuário Teste",
          email: "teste@gmail.com",
          username: "teste",
          totalPoints: 850,
          createdAt: new Date().toISOString(),
          profileImage: "N/A",
        },
      };
    }

    const savedUsersStr = localStorage.getItem("quiz_users_db");
    const users = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    const foundUser = users.find(
      (u: any) => u.username === username && u.password === password,
    );
    if (foundUser) {
      return {
        status: "success",
        data: {
          id: foundUser.id || Math.random().toString(36).substr(2, 9),
          name: foundUser.name,
          email: foundUser.email,
          username: foundUser.username,
          totalPoints: foundUser.totalPoints || 0,
          createdAt: foundUser.createdAt || new Date().toISOString(),
          profileImage: foundUser.profileImage,
        },
      };
    }

    return {
      status: "error",
      data: null,
      error: { code: "UNAUTHORIZED", message: "Credenciais inválidas" },
    };
  }

  static async register(
    name: string,
    email: string,
    username: string,
    password: string,
    profileImage: string,
  ): Promise<ApiResponse<User>> {
    await delay(800); // Fake latency

    if (password.length < 8) {
      return {
        status: "error",
        data: null,
        error: { code: "INVALID_PASSWORD", message: "A senha deve ter no mínimo 8 caracteres" },
      };
    }

    const savedUsersStr = localStorage.getItem("quiz_users_db");
    const users = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    if (users.find((u: any) => u.username === username || u.email === email)) {
      return {
        status: "error",
        data: null,
        error: {
          code: "USER_EXISTS",
          message: "O e-mail ou nome de usuário já está em uso",
        },
      };
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      username,
      password,
      points: 0,
      profileImage,
    };

    users.push(newUser);
    localStorage.setItem("quiz_users_db", JSON.stringify(users));

    return {
      status: "success",
      data: { id: newUser.id, name, email, username, totalPoints: 0, createdAt: new Date().toISOString(), profileImage: newUser.profileImage },
    };
  }

  static async getProfile(
    userIdStr?: string,
  ): Promise<ApiResponse<{ stats: any }>> {
    await delay(400);
    const savedActivities = localStorage.getItem("answers_log_db");
    const activities = savedActivities ? JSON.parse(savedActivities) : [];
    return {
      status: "success",
      data: {
        stats: {
          quizzesPlayed: activities.length,
          accuracy:
            activities.length > 0
              ? Math.round(
                  (activities.filter((a: any) => a.correct).length /
                    activities.length) *
                    100,
                )
              : 0,
        },
      },
    };
  }

  static async updateAvatar(userId: string, avatarUrl: string): Promise<ApiResponse<User>> {
    await delay(300);

    if (userId === "mock-1") {
      return {
        status: "success",
        data: {
          id: "mock-1",
          name: "Usuário Teste",
          email: "teste@gmail.com",
          username: "teste",
          totalPoints: 850,
          createdAt: new Date().toISOString(),
          profileImage: avatarUrl,
        },
      };
    }

    const savedUsersStr = localStorage.getItem("quiz_users_db");
    const users = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    const index = users.findIndex((u: any) => u.id === userId);

    if (index !== -1) {
      users[index].profileImage = avatarUrl;
      localStorage.setItem("quiz_users_db", JSON.stringify(users));
      
      const u = users[index];
      return {
        status: "success",
        data: {
          id: u.id,
          name: u.name,
          email: u.email,
          username: u.username,
          totalPoints: u.totalPoints || 0,
          createdAt: u.createdAt || new Date().toISOString(),
          profileImage: u.profileImage,
        },
      };
    }

    return {
      status: "error",
      data: null,
      error: { code: "NOT_FOUND", message: "Usuário não encontrado" },
    };
  }

  static async updateProfile(userId: string, data: { name?: string, username?: string, email?: string, avatarUrl?: string, newPassword?: string }): Promise<ApiResponse<User>> {
    await delay(500);

    if (data.newPassword && data.newPassword.length < 8) {
      return {
        status: "error",
        data: null,
        error: { code: "INVALID_PASSWORD", message: "A senha deve ter no mínimo 8 caracteres" },
      };
    }

    if (userId === "mock-1") {
      return {
        status: "success",
        data: {
          id: "mock-1",
          name: data.name || "Usuário Teste",
          email: data.email || "teste@gmail.com",
          username: data.username || "teste",
          totalPoints: 850,
          createdAt: new Date().toISOString(),
          profileImage: data.avatarUrl || "N/A",
        },
      };
    }

    const savedUsersStr = localStorage.getItem("quiz_users_db");
    const users = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    const index = users.findIndex((u: any) => u.id === userId);

    if (index !== -1) {
      if (data.name) users[index].name = data.name;
      if (data.username) users[index].username = data.username;
      if (data.email) users[index].email = data.email;
      if (data.avatarUrl) users[index].profileImage = data.avatarUrl;
      if (data.newPassword) users[index].password = data.newPassword;
      
      localStorage.setItem("quiz_users_db", JSON.stringify(users));
      
      const u = users[index];
      return {
        status: "success",
        data: {
          id: u.id,
          name: u.name,
          email: u.email,
          username: u.username,
          totalPoints: u.totalPoints || 0,
          createdAt: u.createdAt || new Date().toISOString(),
          profileImage: u.profileImage,
        },
      };
    }

    return {
      status: "error",
      data: null,
      error: { code: "NOT_FOUND", message: "Usuário não encontrado" },
    };
  }
}
