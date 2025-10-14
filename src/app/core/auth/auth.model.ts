export interface User {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
