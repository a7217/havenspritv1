import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { Job } from "@/lib/models/Job";

const baseUrl =
  process.env.PING_DOMAIN ||
  process.env.RENDER_EXTERNAL_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://havenspirit.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic job pages
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const jobs = await Job.find({ isActive: true })
      .select("_id updatedAt createdAt")
      .lean();

    jobPages = jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job._id}`,
      lastModified: (job as { updatedAt?: Date; createdAt?: Date }).updatedAt ??
        (job as { updatedAt?: Date; createdAt?: Date }).createdAt ??
        new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // If DB fails, sitemap still works with static pages
  }

  return [...staticPages, ...jobPages];
}
