import type { NextConfig } from "next";

const devDomain = process.env.REPLIT_DEV_DOMAIN ?? "";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://i.ibb.co https://ibb.co https://images.unsplash.com https://res.cloudinary.com blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' wss: ws:",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const allowedOrigins = [
  "*.worf.replit.dev",
  "*.pike.replit.dev",
  "*.janeway.replit.dev",
  "*.replit.dev",
  "*.repl.co",
];

if (devDomain) {
  allowedOrigins.push(devDomain);
}

const nextConfig: NextConfig = {
  allowedDevOrigins: allowedOrigins,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "ibb.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
