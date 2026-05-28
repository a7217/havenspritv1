import Link from "next/link";

const STEPS = [
  {
    num: "01",
    title: "Browse Vacancies",
    desc: "Explore all active government project openings. Filter by department, location, and experience to find your ideal role.",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    num: "02",
    title: "Fill Application",
    desc: "Complete the online form with your personal details, qualifications, and work experience. Takes less than 10 minutes.",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  },
  {
    num: "03",
    title: "Upload Documents",
    desc: "Attach your resume, Aadhaar/ID proof, and passport-size photo. All uploads are secure and confidential.",
    icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
  },
  {
    num: "04",
    title: "Track Your Status",
    desc: "Use your application ID to check real-time updates at every stage — from screening to final offer letter.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  },
];

export default function HowToApply() {
  return (
    <section className="py-10 sm:py-14 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Simple & Transparent</p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1a2744] uppercase tracking-wide">How to Apply</h2>
          <p className="text-gray-500 text-sm mt-2">Four easy steps to your next government project role</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, idx) => (
            <div key={step.num} className="relative flex flex-col items-center text-center p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-2.5 z-10 text-gray-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
              )}
              <div className="w-14 h-14 bg-[#1a2744] rounded-full flex items-center justify-center mb-3 shrink-0">
                <svg className="w-6 h-6 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                </svg>
              </div>
              <span className="text-[10px] font-black text-[#f59e0b] tracking-widest mb-1">STEP {step.num}</span>
              <h3 className="font-bold text-[#1a2744] text-sm mb-2">{step.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/jobs"
            className="inline-block bg-[#1a2744] hover:bg-[#243560] text-white font-bold uppercase px-8 py-3 rounded transition-colors tracking-wider text-sm shadow"
          >
            Start Applying Now →
          </Link>
        </div>
      </div>
    </section>
  );
}
