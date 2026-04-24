export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  points: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
