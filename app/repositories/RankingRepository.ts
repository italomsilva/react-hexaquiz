import { ApiResponse } from "../types/api";
import { apiClient } from "../utils/apiClient";

export interface RankingItem {
  rank: number;
  name: string;
  username: string;
  points: number;
  profileImage?: string; 
  isCurrentUser?: boolean;
}

export class RankingRepository {
  static async getRanking(): Promise<
    ApiResponse<{
      weeklyRanking: RankingItem[];
      geralRanking: RankingItem[];
      positionRanking: number;
    }>
  > {
    try {
      const loggedStr = localStorage.getItem("quiz_user");
      if (!loggedStr) {
        throw new Error("Usuário não autenticado");
      }

      const activeUser = JSON.parse(loggedStr);
      if (!activeUser?.id) {
        throw new Error("ID do usuário não encontrado");
      }

      const response = await apiClient.get<any>(
        `/ranking/${activeUser.id}?startDate=2026-05-08&endDate=2026-05-14&page=0&size=50`,
      );

      const weeklyRanking: RankingItem[] = (response.weeklyRanking?.content || []).map(
        (item: any, index: number) => ({
          rank: index + 1,
          name: item.name,
          username: item.username,
          points: item.points || 0,
          profileImage: item.profileImage || "N/A",
          isCurrentUser: item.username === activeUser.username,
        }),
      );

      const geralRanking: RankingItem[] = (response.geralRanking?.content || []).map(
        (item: any, index: number) => ({
          rank: index + 1,
          name: item.name,
          username: item.username,
          points: item.points || 0,
          profileImage: item.profileImage || "N/A",
          isCurrentUser: item.username === activeUser.username,
        }),
      );

      return {
        status: "success",
        data: { 
          weeklyRanking, 
          geralRanking, 
          positionRanking: response.geralRanking.positionRanking ?? 0 
        },
      };
    } catch (error: any) {
      console.error("[RankingRepository Error]:", error);
      return {
        status: "error",
        data: null as any,
        error: { code: "FETCH_ERROR", message: error.message },
      };
    }
  }
}
