import { delay } from "../utils/delay";
import { ApiResponse } from "../types/api";

export interface RankingItem {
  rank: number;
  name: string;
  username: string;
  points: number;
  isCurrentUser?: boolean;
}

const STATIC_RANKING: RankingItem[] = [
  { rank: 0, name: "Pelé Eterno", username: "rei_pele", points: 15000 },
  { rank: 0, name: "Fenômeno 9", username: "r9", points: 14500 },
  { rank: 0, name: "Gaúcho Art", username: "r10", points: 14200 },
  { rank: 0, name: "Neymar Jr", username: "njr", points: 2500 },
  { rank: 0, name: "Vinícius 7", username: "vini_jr", points: 2350 },
  { rank: 0, name: "Rodrygo10", username: "rodrygo_go", points: 2200 },
];

export class RankingRepository {
  static async getRanking(type: 'weekly' | 'general'): Promise<ApiResponse<{ top_players: RankingItem[] }>> {
    await delay(600); // Simulate indexing load

    // Mesclar usuários do LocalStorage (onde registramos)
    const savedUsersStr = localStorage.getItem("quiz_users_db");
    const realUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    
    // Identificar usuário logado
    const loggedStr = localStorage.getItem("quiz_user");
    const activeUsername = loggedStr ? JSON.parse(loggedStr).username : "";

    let allPlayers: RankingItem[] = [
      ...STATIC_RANKING,
    ];

    realUsers.forEach((u: any) => {
      allPlayers.push({
        rank: 0,
        name: u.name,
        points: u.points || 0,
        username: u.username,
        isCurrentUser: u.username === activeUsername
      });
    });

    // Se houver um fallback do 'teste' e ele não estiver no realUsers ainda (já que é gerado na hora por fallback)
    if (activeUsername === "teste" && loggedStr && !realUsers.find((r:any) => r.username === "teste")) {
       const mockPoints = JSON.parse(loggedStr).points || 850;
       allPlayers.push({ rank: 0, name: "Usuário Teste", points: mockPoints, username: "teste", isCurrentUser: true });
    }

    // Sort by points descendant
    allPlayers.sort((a, b) => b.points - a.points);
    
    // Adjust ranks based on points
    allPlayers.forEach((player, index) => {
      player.rank = index + 1;
    });

    return { status: "success", data: { top_players: allPlayers } };
  }
}
