export interface User {
  id: string;
  name: string;
  email: string;
  login: string;
  points: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (login: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, loginUser: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
