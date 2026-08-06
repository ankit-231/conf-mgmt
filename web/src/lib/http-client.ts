import { API_BASE_URL, API_ENDPOINTS } from "@/config/api-endpoints";
import {
  ApiErrorResponse,
  ApiResponse,
  NoRefreshTokenError,
} from "@/types/api";
import { RefreshTokenData } from "@/types/auth";
import { tokenStorage } from "@/utils/token-storage";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";

interface CustomRequestConfig extends AxiosRequestConfig {
  _retry?: boolean; // to prevent infinite retry loop
  publicRequest?: boolean;
}

type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(token!);
    }
  });
  failedQueue = [];
}

const baseURL = API_BASE_URL;

class HttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });

    this._setInterceptors();
  }

  private _setInterceptors() {
    this.client.interceptors.request.use(async (config) => {
      const customConfig = config as CustomRequestConfig;

      // if this is a public request, don't bother attaching token, just return the config
      if (customConfig.publicRequest) {
        return config;
      }
      const accessToken = await tokenStorage.getAccessToken();
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      return config;
    });

    this.client.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config as CustomRequestConfig;

        // if status is not 401 or we already tried refreshing or this is a public request (like login, BE sends 401 on wrong credentials), reject immediately
        if (
          error.response?.status !== 401 ||
          originalRequest._retry ||
          originalRequest.publicRequest
        ) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // add request to the queue and return a promise cause response interceptor needs to return a promise

          return new Promise<AxiosResponse>((resolve, reject) => {
            const resolveLogic = (token: string) => {
              if (!originalRequest.headers) {
                originalRequest.headers = {};
              }
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(this.client.request(originalRequest));
            };
            failedQueue.push({
              resolve: resolveLogic,
              reject,
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newAccessToken = await this._refreshAccessToken();

          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken); // release queued requests

          return this.client.request(originalRequest);
        } catch (refreshError) {
          await this._handleRefreshTokenFailure(refreshError);

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      },
    );
  }

  private async _refreshAccessToken(): Promise<string> {
    const refreshToken = await tokenStorage.getRefreshToken();

    if (!refreshToken) {
      await tokenStorage.clearAllTokens();
      throw new NoRefreshTokenError("No refresh token found");
    }

    const { data } = await axios.post<ApiResponse<RefreshTokenData>>(
      `${API_BASE_URL}${API_ENDPOINTS.auth.refreshToken}`,
      {
        refresh: refreshToken,
      },
    );

    await tokenStorage.saveAccessToken(data.data.access);

    return data.data.access;
  }

  private async _handleRefreshTokenFailure(refreshError: unknown) {
    processQueue(refreshError, null); // reject all queued requests

    await tokenStorage.clearAllTokens();
    if (refreshError instanceof NoRefreshTokenError) {
      console.log("No refresh token available, redirecting to login");
    }

    if (axios.isAxiosError(refreshError)) {
      console.error("Failed to refresh access token:", refreshError.message);
    }

    // if you're here, it probably means refresh token is invalid as said by backend
    // but it might also be any other kind of error
    console.log(
      "Something happened during token refresh, redirecting to login",
    );

    // full navigation (rather than router.push) so the per-request QueryClient
    // (see query-provider.tsx) and any in-memory auth state resets cleanly
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    return Promise.reject(refreshError);
  }

  private async request<T>(
    method: Method,
    url: string,
    data?: any,
    config: CustomRequestConfig = {},
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    try {
      const response = await this.client.request<ApiResponse<T>>({
        method,
        url,
        data,
        ...config,
      });

      return response;
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        console.error(
          `API responded with error for ${method} ${url}:`,
          error.response?.status,
          error.response?.data,
          "Axios message:",
          error.message,
        );
      }

      console.error(`Network or unexpected error for ${method} ${url}:`, error);

      throw error;
    }
  }

  public get<T = any>(url: string, config?: CustomRequestConfig) {
    return this.request<T>("GET", url, undefined, config);
  }

  public post<T = any>(url: string, data?: any, config?: CustomRequestConfig) {
    return this.request<T>("POST", url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: CustomRequestConfig) {
    return this.request<T>("PUT", url, data, config);
  }

  public patch<T = any>(url: string, data?: any, config?: CustomRequestConfig) {
    return this.request<T>("PATCH", url, data, config);
  }
  public delete<T = any>(url: string, config?: CustomRequestConfig) {
    return this.request<T>("DELETE", url, undefined, config);
  }
}

const httpClient = new HttpClient(baseURL);
export default httpClient;
