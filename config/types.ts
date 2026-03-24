export interface UserCredentials {
  username: string;
  password: string;
  role: string;
}

export interface USerFixture {
  users: {
    standard: UserCredentials;
    locked: UserCredentials;
    problem: UserCredentials;
    performance_glitch: UserCredentials;
  };
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
}

export interface ProductsFixtures {
  products: Product[];
  smoke_product: string[];
  checkout: {
    valid: CheckoutInfo;
    invalid: CheckoutInfo;
  };
}

export interface ApiResponse<T = unknown> {
  status: number;
  data: T;
  headers: Record<string, string>;
}

export interface ReqResUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface ReqResListResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
}

export type TestTag = "@smoke" | "@regression" | "@api";

export type SortOption = "az" | "za" | "lohi" | "hilo";

export interface ReqResUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface ReqResSingleResponse<T> {
  data: T;
}

export interface CreateUserRequest {
  name: string;
  job: string;
}

export interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  id: number;
  token: string;
}
