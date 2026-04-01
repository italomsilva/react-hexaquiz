export type ApiResponse<T> = {
  status: "success" | "error";
  data: T | null;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
};
