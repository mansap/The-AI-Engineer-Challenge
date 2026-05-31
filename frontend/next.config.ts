import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    // On Vercel, /api/chat is handled by api/chat.py — no proxy needed.
    if (process.env.VERCEL) {
      return [];
    }
    return [
      {
        source: "/api/chat",
        destination: `${backendUrl}/api/chat`,
      },
    ];
  },
};

export default nextConfig;
