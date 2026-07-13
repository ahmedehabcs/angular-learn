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
  id: string,
  fullName: String,
  email: string,
  role: 'admin' | 'staff' | 'customer'
}
export interface AuthResponse {
  message: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  }
}