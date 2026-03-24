import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

export interface ApiResponse<T = unknown> {
  status: number;
  data: T;
  headers: Record<string, string>;
}

export class ApiClient {
  private readonly client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use((config) => {
      console.log(
        `→ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      );
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          console.error(`← ${error.response.status} ${error.config?.url}`);
        }
        return Promise.reject(error);
      },
    );
  }

  setAuthToken(token: string): void {
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.client.defaults.headers.common["Authorization"];
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    const res: AxiosResponse<T> = await this.client.get(endpoint, { params });
    return this.toApiResponse(res);
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const res: AxiosResponse<T> = await this.client.post(endpoint, body);
    return this.toApiResponse(res);
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const res: AxiosResponse<T> = await this.client.put(endpoint, body);
    return this.toApiResponse(res);
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const res: AxiosResponse<T> = await this.client.patch(endpoint, body);
    return this.toApiResponse(res);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const res: AxiosResponse<T> = await this.client.delete(endpoint);
    return this.toApiResponse(res);
  }

  private toApiResponse<T>(res: AxiosResponse<T>): ApiResponse<T> {
    return {
      status: res.status,
      data: res.data,
      headers: res.headers as Record<string, string>,
    };
  }
}
