import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import JobOpenings from "@/components/JobOpenings";
import HowToApply from "@/components/HowToApply";
import WhyChooseUs from "@/components/WhyChooseUs";
import Stats from "@/components/Stats";
import ContactFooter from "@/components/ContactFooter";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Apply for government project vacancies in Bihar. Haven Spirit Pvt. Ltd. is the official Payroll & Execution Partner for BEPC ICT Lab Project and other government tenders.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Haven Spirit Pvt. Ltd. – Government Recruitment Portal",
    description:
      "Find and apply for government project vacancies in Bihar. Current project: BEPC ICT Lab Project (RFP No. BEPC/ICT/2025-26/2984).",
    url: "/",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <HeroSection />
      <TrustBar />
      <JobOpenings />
      <HowToApply />
      <WhyChooseUs />
      <Stats />
      <ContactFooter />
    </main>
  );
}
