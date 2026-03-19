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
  last_name?:string;
  first_name?:string;
  password?:string;
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
export interface Order {
  id: number
  software: number
  software_name?: string
  duration: string
  price_paid: number
  status: "pending" | "completed" | "cancelled"
  software_details?:any
  user_details?:any
  download_link?: string
  license_key?: string
  admin_note?: string
  client_data?:any
  files?:any;
  user?:any
  created_at: string
}