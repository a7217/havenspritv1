import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Listings",
  description:
    "Browse all active government project vacancies in Bihar. Apply for ICT Lab Instructor, field staff, and support roles under BEPC, TCIL, RailTel, and other government tenders.",
  alternates: { canonical: "/jobs" },
  openGraph: {
    title: "Active Government Job Vacancies – Haven Spirit Pvt. Ltd.",
    description:
      "View all open vacancies for government project roles in Bihar. Submit your application online.",
    url: "/jobs",
  },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
