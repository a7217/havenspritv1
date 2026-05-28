import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-[340px] md:h-[420px] flex items-center justify-center text-center text-white"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&auto=format&fit=crop&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 px-4 py-10 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wide leading-tight drop-shadow-lg">
          Official Recruitment Partner<br />For Government Projects
        </h1>
        <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-200 px-2">
          Find vacancies, submit your resume, and join crucial public sector tenders.
        </p>
        <p className="text-xs sm:text-sm text-gray-300 mt-1">Current Project: BEPC ICT Lab Project, Bihar (RFP No. BEPC/ICT/2025-26/2984)</p>
        <Link
          href="/jobs"
          className="inline-block mt-6 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold uppercase px-6 sm:px-8 py-3 rounded transition-colors tracking-wider shadow-lg text-sm sm:text-base"
        >
          View Active Vacancies
        </Link>
      </div>
    </section>
  );
}
