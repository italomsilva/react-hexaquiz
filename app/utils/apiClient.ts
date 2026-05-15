import { ApiResponse } from "../types/api";

const envUrl ="/api";
const API_BASE_URL = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;

interface FetchOptions extends RequestInit {
  data?: any;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
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
    
    // Não envia o token para as rotas de login e register
    const isAuthRoute = endpoint.includes("/user/login") || endpoint.includes("/user/create");
    
    if (token && !isAuthRoute) {
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
        if (response.status === 401 && !isAuthRoute && endpoint !== "/user/refresh") {
          const refreshToken = typeof window !== 'undefined' ? localStorage.getItem("hexaquiz_refresh_jwt") : null;
          
          if (refreshToken) {
            if (!isRefreshing) {
              isRefreshing = true;
              
              try {
                // Fazer request direto para evitar loop infinito
                const refreshUrl = `${API_BASE_URL}/user/refresh`;
                const refreshResponse = await fetch(refreshUrl, {
                  method: 'GET',
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${refreshToken}`
                  }
                });

                if (refreshResponse.ok) {
                  const refreshData = await refreshResponse.json();
                  const newAccessToken = refreshData.accessToken;
                  
                  if (newAccessToken) {
                    localStorage.setItem("hexaquiz_jwt", newAccessToken);
                    if (refreshData.refreshToken) {
                      localStorage.setItem("hexaquiz_refresh_jwt", refreshData.refreshToken);
                    }
                    onRefreshed(newAccessToken);
                  } else {
                    throw new Error("No access token returned");
                  }
                } else {
                  throw new Error("Refresh failed");
                }
              } catch (refreshError) {
                onRefreshed(""); // Resolve pendentes com string vazia (falha)
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('api-forbidden'));
                }
                throw new Error("Sessão expirada");
              } finally {
                isRefreshing = false;
              }
            }
            
            // Aguardar o refresh terminar (com sucesso ou falha)
            const newAccessToken = await new Promise<string>((resolve) => {
              subscribeTokenRefresh((token) => resolve(token));
            });
            
            if (newAccessToken) {
              // Refazer a request original com o novo token
              const retryHeaders = { ...config.headers, "Authorization": `Bearer ${newAccessToken}` };
              const retryResponse = await fetch(url, { ...config, headers: retryHeaders });
              const retryIsJson = retryResponse.headers.get("content-type")?.includes("application/json");
              const retryData = retryIsJson ? await retryResponse.json() : null;
              
              if (!retryResponse.ok) {
                 if ((retryResponse.status === 403 || retryResponse.status === 401) && typeof window !== 'undefined') {
                   window.dispatchEvent(new CustomEvent('api-forbidden'));
                 }
                 throw new Error(retryData?.message || "Erro na requisição para a API após refresh");
              }
              return retryData as T;
            } else {
              throw new Error("Falha ao renovar sessão");
            }
          }
        }
        
        if ((response.status === 403 || response.status === 401) && typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('api-forbidden'));
        }
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
