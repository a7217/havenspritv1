const steps = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" stroke="#1a2744" strokeWidth="2.5">
        <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z" />
        <path d="M16 24c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" strokeLinecap="round" />
        <path d="M12 32l4-4" strokeLinecap="round" />
        <path d="M36 16l-4 4" strokeLinecap="round" />
      </svg>
    ),
    label: "Why Choose Us",
    sublabel: "Experienced Contractor",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" stroke="#1a2744" strokeWidth="2.5">
        <rect x="10" y="8" width="28" height="34" rx="3" />
        <path d="M18 18h12M18 24h12M18 30h8" strokeLinecap="round" />
      </svg>
    ),
    label: "Fill Details",
    sublabel: "Pan-India Presence",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" stroke="#1a2744" strokeWidth="2.5">
        <rect x="10" y="8" width="28" height="34" rx="3" />
        <path d="M18 20h12M18 26h8" strokeLinecap="round" />
        <path d="M30 32l4 4 6-8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Upload Docs",
    sublabel: "Application Process",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" stroke="#1a2744" strokeWidth="2.5">
        <path d="M8 12h32v24a4 4 0 01-4 4H12a4 4 0 01-4-4V12z" />
        <path d="M8 12l16 14L40 12" strokeLinecap="round" />
      </svg>
    ),
    label: "Submitted",
    sublabel: "Application Submitted",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-8 sm:py-12 px-4 bg-gray-100">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
        {steps.map((step) => (
          <div key={step.label} className="flex flex-col items-center gap-2 px-2 py-3 sm:p-0">
            {step.icon}
            <p className="font-bold text-[#1a2744] text-xs sm:text-sm mt-1 leading-snug">{step.label}</p>
            <p className="text-gray-500 text-[10px] sm:text-xs leading-snug">{step.sublabel}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
