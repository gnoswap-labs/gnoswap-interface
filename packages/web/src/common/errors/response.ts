export interface ErrorResponse<T = unknown> {
  isError: boolean;

  status: number;

  type: string;

  message: string;

  data: T | null;
}
