import { ApiResponse } from "../types/api";
import { apiClient } from "../utils/apiClient";

export interface RankingItem {
  rank: number;
  name: string;
  username: string;
  points: number;
  profileImage?: string; // Armazena o índice (ex: "0", "1")
  isCurrentUser?: boolean;
}

export class RankingRepository {
  static async getRanking(): Promise<
    ApiResponse<{ top_players: RankingItem[]; positionRanking: number }>
  > {
    try {
      const loggedStr = localStorage.getItem("quiz_user");

      const activeUser = loggedStr ? JSON.parse(loggedStr) : "";
      const response = await apiClient.get<any>(
        `/ranking/${activeUser?.id}?page=0&size=50`,
      );

      const top_players: RankingItem[] = response.content.map(
        (item: any, index: number) => ({
          rank: index + 1, // backend não retorna rank, apenas ordem paginada
          name: item.name,
          username: item.username,
          points: item.points || 0,
          profileImage: item.profileImage || "N/A",
          isCurrentUser: item.username === activeUser.username,
        }),
      );

      return {
        status: "success",
        data: { top_players, positionRanking: response.positionRanking ?? 0 },
      };
    } catch (error: any) {
      return {
        status: "error",
        data: null as any,
        error: { code: "FETCH_ERROR", message: error.message },
      };
    }
  }
}
