export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImage?: string;
  totalPoints: number;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
