import { removeTrailingSlash } from "@/utils/general";

export const API_BASE_URL = removeTrailingSlash(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1",
);

// Django serves static files from the same host, under /static/ - derive it
// from API_BASE_URL's origin rather than adding another env var.
export const STATIC_BASE_URL = `${new URL(API_BASE_URL).origin}/static`;

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
