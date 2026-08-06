import type { NextConfig } from "next";

// Not importing API_BASE_URL from src/config/api-endpoints.ts here: that
// module (transitively) imports via the "@/" path alias, which next.config.ts's
// build-time transpiler doesn't resolve, even though this file's own
// imports are fine. Keeping this self-contained avoids the fragile coupling.
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";
const apiOrigin = new URL(apiBaseUrl);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiOrigin.protocol.replace(":", "") as "http" | "https",
        hostname: apiOrigin.hostname,
        port: apiOrigin.port,
        pathname: "/static/**",
      },
    ],
  },
};

export default nextConfig;
