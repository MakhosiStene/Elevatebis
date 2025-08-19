export interface LoginCredentials {
  email:        string;
  password:     string;
  rememberMe?:  boolean;
}

export interface RegisterData {
  email: string;
  password: string;
}