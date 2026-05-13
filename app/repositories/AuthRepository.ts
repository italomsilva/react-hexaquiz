import { User } from "../types/auth";
import { ApiResponse } from "../types/api";
import { apiClient } from "../utils/apiClient";
import { getAvatarUrl } from "../utils/avatar";

export class AuthRepository {
  static async login(
    username: string,
    password: string,
  ): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.post<any>("/user/login", {
        username,
        password
      });

      if (response && response.tokens && response.tokens.accessToken) {
        localStorage.setItem("hexaquiz_jwt", response.tokens.accessToken);
      }

      const userData = response.user || response;
      const user: User = {
        id: userData.id,
        name: userData.name,
        username: userData.username,
        email: "N/A", // Não retornado pelo backend
        profileUser: userData.profileUser || "N/A",
        totalPoints: 0, // Será atualizado por outra rota ou mantido localmente
        createdAt: userData.createdAt || new Date().toISOString(),
        positionRanking: response.positionRanking || 0,
      };

      return {
        status: "success",
        data: user,
      };
    } catch (error: any) {
      return {
        status: "error",
        data: null,
        error: { code: "UNAUTHORIZED", message: error.message || "Credenciais inválidas" },
      };
    }
  }

  static async register(
    name: string,
    email: string,
    username: string,
    password: string,
    avatarIndex: string,
  ): Promise<ApiResponse<User>> {
    try {
      if (password.length < 8) {
        throw new Error("A senha deve ter no mínimo 8 caracteres");
      }

      const response = await apiClient.post<any>("/user/create", {
        name,
        username,
        email,
        password,
        profileUser: getAvatarUrl(avatarIndex)
      });

      // O create agora retorna um ResponseLoginDto com tokens e user
      if (response && response.tokens && response.tokens.accessToken) {
        localStorage.setItem("hexaquiz_jwt", response.tokens.accessToken);
      }

      const userData = response.user || response;

      const user: User = {
        id: userData.id,
        name: userData.name,
        username: userData.username,
        email: email, // Usamos o email passado
        profileUser: userData.profileUser || avatarIndex,
        totalPoints: 0,
        createdAt: userData.createdAt || new Date().toISOString(),
        positionRanking: response.positionRanking || 0,
      };

      return {
        status: "success",
        data: user,
      };
    } catch (error: any) {
      return {
        status: "error",
        data: null,
        error: {
          code: "REGISTRATION_ERROR",
          message: error.message || "Erro ao registrar usuário",
        },
      };
    }
  }

  static async getProfile(
    userIdStr: string,
  ): Promise<ApiResponse<{ stats: any }>> {
    try {
      const stats = await apiClient.get<any>(`/statistics/${userIdStr}`);
      const accuracyValue = stats.accuracy ?? stats.acurracy ?? 0;
      return {
        status: "success",
        data: {
          stats: {
            quizzesPlayed: stats.quizzesPlayed || 0,
            accuracy: typeof accuracyValue === 'number' ? accuracyValue.toFixed(2) : accuracyValue,
            points: stats.points || 0,
          },
        },
      };
    } catch (error: any) {
      // Se falhar (ex: sem quizzes jogados), fallback para zeros
      return {
        status: "success",
        data: {
          stats: { quizzesPlayed: 0, accuracy: 0 },
        },
      };
    }
  }

  static async updateAvatar(userId: string, avatarIndex: string): Promise<ApiResponse<User>> {
    try {
      const userData = await apiClient.patch<any>(`/user/update/image/${userId}`, {
        profileImage: getAvatarUrl(avatarIndex) // Envia a URL completa
      });
      
      const savedUserStr = localStorage.getItem("quiz_user");
      let currentUser: any = {};
      if (savedUserStr) {
        currentUser = JSON.parse(savedUserStr);
      }

      const user: User = {
        id: userData.id || currentUser.id,
        name: userData.name || currentUser.name,
        username: userData.username || currentUser.username,
        email: currentUser.email || "N/A",
        profileUser: userData.profileUser || avatarIndex,
        totalPoints: currentUser.totalPoints || 0,
        createdAt: userData.createdAt || currentUser.createdAt || new Date().toISOString(),
        positionRanking: userData.positionRanking || 0,
      };

      return {
        status: "success",
        data: user,
      };
    } catch (error: any) {
      return {
        status: "error",
        data: null,
        error: { code: "UPDATE_ERROR", message: error.message || "Erro ao atualizar avatar" },
      };
    }
  }

  static async updateProfile(userId: string, data: { name?: string, username?: string, email?: string, avatarIndex?: string, newPassword?: string }): Promise<ApiResponse<User>> {
    try {
      if (data.newPassword) {
        if (data.newPassword.length < 8) {
          throw new Error("A senha deve ter no mínimo 8 caracteres");
        }
        await apiClient.patch<any>(`/user/update/password/${userId}`, {
          password: data.newPassword
        });
      }

      if (data.avatarIndex) {
        await apiClient.patch<any>(`/user/update/image/${userId}`, {
          profileImage: getAvatarUrl(data.avatarIndex)
        });
      }

      // 3. Atualização de Nome e Usuário (PATCH /user/update/{id})
      const savedUserStr = localStorage.getItem("quiz_user");
      let currentUser: any = {};
      if (savedUserStr) {
        currentUser = JSON.parse(savedUserStr);
      }

      // Regra: envia apenas os campos que foram alterados
      const updateBody: any = {};
      if (data.name && data.name !== currentUser.name) {
        updateBody.name = data.name;
      }
      if (data.username && data.username !== currentUser.username) {
        updateBody.username = data.username;
      }

      if (Object.keys(updateBody).length > 0) {
        await apiClient.patch<any>(`/user/update/${userId}`, updateBody);
      }

      const user: User = {
        id: userId,
        name: updateBody.name !== undefined ? updateBody.name : currentUser.name,
        username: updateBody.username !== undefined ? updateBody.username : currentUser.username,
        email: data.email || currentUser.email || "N/A",
        profileUser: data.avatarIndex ? getAvatarUrl(data.avatarIndex) : (currentUser.profileUser || "N/A"),
        totalPoints: currentUser.totalPoints || 0,
        createdAt: currentUser.createdAt || new Date().toISOString(),
        positionRanking: currentUser.positionRanking || 0,
      };

      return {
        status: "success",
        data: user,
      };
    } catch (error: any) {
      return {
        status: "error",
        data: null,
        error: { code: "UPDATE_ERROR", message: error.message || "Erro ao atualizar perfil" },
      };
    }
  }
}
