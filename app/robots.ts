import { MetadataRoute } from "next";

const baseUrl =
  process.env.PING_DOMAIN ||
  process.env.RENDER_EXTERNAL_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://havenspirit.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
