import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Haven Spirit Pvt. Ltd. for queries about government project recruitment, application status, or any other concerns.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Haven Spirit Pvt. Ltd.",
    description:
      "Reach out to our team for recruitment enquiries, application status updates, or partnership queries.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
