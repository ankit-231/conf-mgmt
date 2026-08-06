import { removeTrailingSlash } from "@/utils/general";

export const API_BASE_URL = removeTrailingSlash(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1",
);

export const API_ENDPOINTS = {
  auth: {
    getToken: "/auth/token/generate/",
    refreshToken: "/auth/token/refresh/",
    verifyToken: "/auth/token/verify/",
    blacklistToken: "/auth/token/blacklist/",
  },

  users: {
    me: "/users/me/",
  },
};
