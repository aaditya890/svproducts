import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    // Photos in /public are already resized + compressed to WebP, so they are served straight from the CDN.
    // This avoids Vercel's on-demand image optimiser (slow first load, monthly quota on the free plan).
    unoptimized: true,
    // product images uploaded from the admin panel live in Supabase Storage
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  partialPrefetching: true,
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }];
    return ["/products/:path*", "/hero/:path*", "/brand/:path*"].map((source) => ({ source, headers: cache }));
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
