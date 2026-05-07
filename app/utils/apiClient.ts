import { ApiResponse } from "../types/api";

const API_BASE_URL = "/api";

interface FetchOptions extends RequestInit {
  data?: any;
}

export const apiClient = {
  async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {})
    };

    // Obter o token JWT salvo no localStorage para autenticar requests
    const token = typeof window !== 'undefined' ? localStorage.getItem("hexaquiz_jwt") : null;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    if (options.data) {
      config.body = JSON.stringify(options.data);
    }

    try {
      const response = await fetch(url, config);
      
      const isJson = response.headers.get("content-type")?.includes("application/json");
      const responseData = isJson ? await response.json() : null;

      if (!response.ok) {
        throw new Error(responseData?.message || "Erro na requisição para a API");
      }

      return responseData as T;
    } catch (error: any) {
      console.error(`[API Client Error] ${endpoint}:`, error.message);
      throw error;
    }
  },

  get<T>(endpoint: string, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, data: any, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, method: "POST", data });
  },

  put<T>(endpoint: string, data: any, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, method: "PUT", data });
  },

  patch<T>(endpoint: string, data: any, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, method: "PATCH", data });
  },

  delete<T>(endpoint: string, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, method: "DELETE" });
  }
};
