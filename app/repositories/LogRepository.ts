import { ApiResponse } from "../types/api";
import { apiClient } from "../utils/apiClient";

export interface LogUser {
  id: string;
  username: string;
  name: string;
  profileUser: string;
}

export interface LogEntry {
  date: string;
  users: LogUser[];
}

export class LogRepository {
  static async getLogs(): Promise<ApiResponse<{ log: LogEntry[] }>> {
    try {
      const response = await apiClient.get<any>("/log?date=2026-05-13");

      return {
        status: "success",
        data: response,
      };
    } catch (error: any) {
      return {
        status: "error",
        data: null as any,
        error: { code: "FETCH_ERROR", message: error.message },
      };
    }
  }
}
