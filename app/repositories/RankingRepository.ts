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
  static async getRanking(type: 'weekly' | 'general'): Promise<ApiResponse<{ top_players: RankingItem[] }>> {
    try {
      // O backend usa /rancking com 'ck' e aceita page e size
      const response = await apiClient.get<any>(`/rancking?page=0&size=50`);
      
      const loggedStr = localStorage.getItem("quiz_user");
      const activeUsername = loggedStr ? JSON.parse(loggedStr).username : "";

      const top_players: RankingItem[] = response.content.map((item: any, index: number) => ({
        rank: index + 1, // backend não retorna rank, apenas ordem paginada
        name: item.name,
        username: item.username,
        points: item.points || 0,
        profileImage: item.profileImage || "N/A",
        isCurrentUser: item.username === activeUsername
      }));

      // A API retorna a lista não ordenada por padrão? 
      // Se não vier ordenada do backend (espera-se que venha), ordenamos aqui por segurança
      top_players.sort((a, b) => b.points - a.points);
      top_players.forEach((player, index) => {
        player.rank = index + 1;
      });

      return { status: "success", data: { top_players } };
    } catch (error: any) {
      return { status: "error", data: null as any, error: { code: "FETCH_ERROR", message: error.message } };
    }
  }
}
