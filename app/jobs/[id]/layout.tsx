import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { Job } from "@/lib/models/Job";

const baseUrl =
  process.env.PING_DOMAIN ||
  process.env.RENDER_EXTERNAL_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://havenspirit.in";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    await connectDB();
    const job = await Job.findById(id)
      .select("title project location description vacancies lastDate salaryFull qualification")
      .lean() as {
        title?: string; project?: string; location?: string;
        description?: string; vacancies?: number; lastDate?: string;
        salaryFull?: string; qualification?: string;
      } | null;

    if (job) {
      const title = `${job.title} – ${job.project}`;
      const desc =
        job.description?.slice(0, 155) ||
        `Apply for ${job.title} in ${job.location}. ${job.vacancies} vacancies open. Salary: ${job.salaryFull}.`;

      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: job.description || desc,
        hiringOrganization: {
          "@type": "Organization",
          name: "Haven Spirit Pvt. Ltd.",
          sameAs: baseUrl,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location || "Bihar",
            addressRegion: "Bihar",
            addressCountry: "IN",
          },
        },
        employmentType: "FULL_TIME",
        validThrough: job.lastDate,
        totalJobOpenings: job.vacancies,
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: "INR",
          value: { "@type": "QuantitativeValue", value: job.salaryFull },
        },
        educationRequirements: job.qualification,
        datePosted: new Date().toISOString(),
      };

      return {
        title,
        description: desc,
        alternates: { canonical: `/jobs/${id}` },
        openGraph: {
          title: `${title} | Haven Spirit`,
          description: desc,
          url: `/jobs/${id}`,
          type: "website",
        },
        twitter: {
          card: "summary",
          title: `${title} | Haven Spirit`,
          description: desc,
        },
        other: {
          "script:ld+json": JSON.stringify(jsonLd),
        },
      };
    }
  } catch { /* fallback below */ }

  return {
    title: "Job Detail",
    description: "Apply for government recruitment vacancies across Bihar.",
  };
}

export default function JobDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
