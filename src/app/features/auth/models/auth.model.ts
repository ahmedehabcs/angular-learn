export interface LoginData {
  email: string;
  password: string;
}
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}
export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  image?: string;
}
export interface AuthResponse {
  message: string;
  accessToken: string;
  user?: CurrentUser;
}
