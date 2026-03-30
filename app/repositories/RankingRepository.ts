import { delay } from "../utils/delay";

export interface RankingItem {
  rank: number;
  name: string;
  points: number;
  isCurrentUser?: boolean;
}

const STATIC_RANKING: RankingItem[] = [
  { rank: 0, name: "Pelé Eterno", points: 15000 },
  { rank: 0, name: "Fenômeno 9", points: 14500 },
  { rank: 0, name: "Gaúcho Art", points: 14200 },
  { rank: 0, name: "Neymar Jr", points: 2500 },
  { rank: 0, name: "Vinícius 7", points: 2350 },
  { rank: 0, name: "Rodrygo10", points: 2200 },
];

export class RankingRepository {
  static async getRanking(type: 'weekly' | 'general'): Promise<RankingItem[]> {
    await delay(600); // Simulate indexing load

    // Mesclar usuários do LocalStorage (onde registramos)
    const savedUsersStr = localStorage.getItem("quiz_users_db");
    const realUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    
    // Identificar usuário logado
    const loggedStr = localStorage.getItem("quiz_user");
    const activeLogin = loggedStr ? JSON.parse(loggedStr).login : "";

    let allPlayers: RankingItem[] = [
      ...STATIC_RANKING,
    ];

    realUsers.forEach((u: any) => {
      allPlayers.push({
        rank: 0,
        name: u.name,
        points: u.points || 0,
        isCurrentUser: u.login === activeLogin
      });
    });

    // Se houver um fallback do 'teste' e ele não estiver no realUsers ainda (já que é gerado na hora por fallback)
    if (activeLogin === "teste" && loggedStr && !realUsers.find((r:any) => r.login === "teste")) {
       const mockPoints = JSON.parse(loggedStr).points || 850;
       allPlayers.push({ rank: 0, name: "Usuário Teste", points: mockPoints, isCurrentUser: true });
    }

    // Sort by points descendant
    allPlayers.sort((a, b) => b.points - a.points);
    
    // Adjust ranks based on points
    allPlayers.forEach((player, index) => {
      player.rank = index + 1;
    });

    return allPlayers;
  }
}
