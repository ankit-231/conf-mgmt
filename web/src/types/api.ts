export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ApiErrorResponse<T = any> {
  extra: T;
  message: string;
}

export class NoRefreshTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoRefreshTokenError";
  }
}

export interface PaginatedData<T> {
  count: number;
  results_count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  next_page: number | null;
  previous_page: number | null;
  page_size: number;
  results: T;
}

export type PaginatedApiResponse<T> = ApiResponse<PaginatedData<T>>;
