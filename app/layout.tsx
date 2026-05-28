import type { Metadata } from "next";
import { Inter, Barlow } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const baseUrl =
  process.env.PING_DOMAIN ||
  process.env.RENDER_EXTERNAL_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://havenspirit.in";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Haven Spirit Pvt. Ltd. – Government Recruitment Portal",
    template: "%s | Haven Spirit Pvt. Ltd.",
  },
  description:
    "Haven Spirit Pvt. Ltd. is an authorised Payroll & Execution Partner for government projects in Bihar. Find vacancies, apply online, and join BEPC ICT Lab Project and other government tenders.",
  keywords: [
    "government jobs Bihar",
    "BEPC ICT Lab recruitment",
    "Haven Spirit recruitment",
    "govt tender vacancy",
    "ICT Lab Instructor jobs",
    "government project jobs Bihar",
    "payroll execution partner Bihar",
    "TCIL recruitment",
    "RailTel jobs",
  ],
  authors: [{ name: "Haven Spirit Pvt. Ltd." }],
  creator: "Haven Spirit Pvt. Ltd.",
  publisher: "Haven Spirit Pvt. Ltd.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName: "Haven Spirit Pvt. Ltd.",
    title: "Haven Spirit Pvt. Ltd. – Government Recruitment Portal",
    description:
      "Official Payroll & Execution Partner for government projects in Bihar. Apply for BEPC ICT Lab and other government vacancies.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Haven Spirit Pvt. Ltd. Recruitment Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haven Spirit Pvt. Ltd. – Government Recruitment Portal",
    description:
      "Apply for government project vacancies in Bihar. Official recruitment partner for BEPC, TCIL, RailTel projects.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Haven Spirit Pvt. Ltd.",
    url: baseUrl,
    logo: `${baseUrl}/logo.jpg`,
    description:
      "Authorised Payroll & Execution Partner for government-linked projects in Bihar, India.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Patna",
      addressRegion: "Bihar",
      addressCountry: "IN",
    },
    sameAs: [],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${barlow.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
