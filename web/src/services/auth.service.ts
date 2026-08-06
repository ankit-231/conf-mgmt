import { API_ENDPOINTS } from "@/config/api-endpoints";
import httpClient from "@/lib/http-client";
import {
  BlacklistTokenPayload,
  LoginData,
  LoginPayload,
  RefreshTokenPayload,
  VerifyTokenPayload,
} from "@/types/auth";

export const authService = {
  getToken: async (payload: LoginPayload) => {
    const res = await httpClient.post<LoginData>(
      API_ENDPOINTS.auth.getToken,
      payload,
      {
        publicRequest: true,
      },
    );
    return res.data;
  },
  refreshToken: async (payload: RefreshTokenPayload) => {
    const res = await httpClient.post<LoginData>(
      API_ENDPOINTS.auth.refreshToken,
      payload,
      {
        publicRequest: true,
      },
    );
    return res.data;
  },
  verifyToken: async (payload: VerifyTokenPayload) => {
    const res = await httpClient.post(API_ENDPOINTS.auth.verifyToken, payload, {
      publicRequest: true,
    });
    return res.data;
  },
  blacklistToken: async (payload: BlacklistTokenPayload) => {
    const res = await httpClient.post(
      API_ENDPOINTS.auth.blacklistToken,
      payload,
      {
        publicRequest: true,
      },
    );
    return res.data;
  },
};
