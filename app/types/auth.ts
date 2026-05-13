export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profileUser?: string; // Armazena a URL do avatar (ou índice legado)
  totalPoints: number;
  createdAt: string;
  positionRanking: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, username: string, password: string, avatarIndex: string) => Promise<boolean>;
  updateAvatar: (avatarIndex: string) => Promise<boolean>;
  updateProfile: (data: { name?: string, username?: string, email?: string, avatarIndex?: string, newPassword?: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
