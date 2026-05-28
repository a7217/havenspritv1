const BENEFITS = [
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Government Authorised",
    desc: "Officially empanelled by BEPC and other central/state government bodies as a certified Payroll & Execution Partner.",
    color: "bg-blue-50 border-blue-100",
    iconBg: "bg-blue-600",
  },
  {
    icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
    title: "On-Time Salary",
    desc: "Guaranteed monthly salary disbursement on fixed dates with full EPF, ESIC, and statutory deduction compliance.",
    color: "bg-green-50 border-green-100",
    iconBg: "bg-green-600",
  },
  {
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    title: "Full Transparency",
    desc: "Every step of the hiring process is documented and visible. No hidden charges, no middlemen — apply directly.",
    color: "bg-amber-50 border-amber-100",
    iconBg: "bg-amber-500",
  },
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    title: "Real-Time Status Updates",
    desc: "Track your application at every stage from submission to final deployment using your unique application ID.",
    color: "bg-purple-50 border-purple-100",
    iconBg: "bg-purple-600",
  },
  {
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
    title: "Merit-Based Hiring",
    desc: "Selection is strictly merit-based with clearly published eligibility criteria. Equal opportunity for every qualified candidate.",
    color: "bg-red-50 border-red-100",
    iconBg: "bg-red-500",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    title: "Stable Employment",
    desc: "Work on long-term government-backed projects with regular contracts, providing job security and career growth.",
    color: "bg-teal-50 border-teal-100",
    iconBg: "bg-teal-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-10 sm:py-14 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Trusted by Thousands</p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1a2744] uppercase tracking-wide">Why Choose Haven Spirit</h2>
          <p className="text-gray-500 text-sm mt-2">Your trusted partner for government project recruitment in Bihar</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className={`flex gap-4 p-4 rounded-xl border ${b.color}`}>
              <div className={`w-10 h-10 ${b.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={b.icon} />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#1a2744] text-sm mb-1">{b.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
