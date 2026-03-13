export interface LoginRequest {
  email: string;
  password: string;

}

export interface LoginResponse {
  access: string;
  refresh: string;
  profile:UserProfile;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone_number?: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone_number: string | null;
  balance: number;
  is_staff:boolean;
  is_superuser:boolean;
}
export interface Transaction {
  id: number;
  user: UserProfile;
  amount: number;
  type: string;
  status: string;
  reference: string;
  created_at: string;
  proof?:string
}