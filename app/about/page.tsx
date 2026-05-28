import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactFooter from "@/components/ContactFooter";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Haven Spirit Pvt. Ltd. is a GST-registered company based in Patna, Bihar. We are the authorised Payroll & Execution Partner for government-linked projects including BEPC ICT Lab Project.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Haven Spirit Pvt. Ltd.",
    description:
      "District-level Payroll & Execution Partner for government-sponsored projects in Bihar. Responsible for recruitment, salary disbursement, EPF/ESIC compliance.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activePage="about" />

      {/* Hero */}
      <div className="bg-[#1a2744] text-white py-10 sm:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-2">Established in Bihar</p>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide uppercase mb-4">About Haven Spirit</h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Haven Spirit Private Limited is a GST-registered company headquartered in Patna, Bihar,
            operating as an authorised <span className="text-white font-semibold">Payroll &amp; Execution Partner</span> for
            government-sponsored project initiatives across the state.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-5">

        {/* Who We Are */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sm:p-7">
          <h2 className="text-sm sm:text-base font-extrabold text-[#1a2744] uppercase tracking-wide mb-3">Who We Are</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Haven Spirit Pvt. Ltd. is a professionally managed private limited company working at the intersection
            of government project execution and human resource management. We are empanelled as the district-level
            <strong className="text-gray-700"> Payroll &amp; Execution Partner</strong> for multiple state government and
            central government-linked projects in Bihar.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our current flagship engagement is the <strong className="text-gray-700">BEPC ICT Lab Project</strong> awarded
            under the Bihar Education Project Council (BEPC), Government of Bihar, under RFP No. BEPC/ICT/2025-26/2984.
            Under this project, we are responsible for the end-to-end staffing, deployment, and payroll management of
            ICT Lab Instructors across government schools in Bihar.
          </p>
        </div>

        {/* What We Do */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sm:p-7">
          <h2 className="text-sm sm:text-base font-extrabold text-[#1a2744] uppercase tracking-wide mb-4">What We Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
                title: "Recruitment & Staffing",
                desc: "End-to-end candidate sourcing, screening, document verification, and final deployment for government project roles across districts of Bihar.",
              },
              {
                icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
                title: "Payroll & Salary Disbursement",
                desc: "Monthly salary processing with on-time disbursement, full EPF/ESIC statutory compliance, and generation of salary slips for all project-linked employees.",
              },
              {
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                title: "Contract & Compliance Management",
                desc: "Preparation and management of employment contracts, offer letters, joining formalities, and statutory filings in accordance with central and state labour laws.",
              },
              {
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
                title: "Attendance & Performance Monitoring",
                desc: "District-level attendance tracking, performance monitoring, and regular reporting to government agencies and project implementation units.",
              },
              {
                icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Government Tender Execution",
                desc: "Bid submission, project onboarding, and complete operational execution of government contracts including coordination with nodal agencies.",
              },
              {
                icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                title: "Candidate Status Communication",
                desc: "Transparent, real-time application status updates so every candidate stays informed from submission to final selection and deployment.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 p-3.5 rounded-lg bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 bg-[#1a2744] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner / Government Clients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sm:p-7">
          <h2 className="text-sm sm:text-base font-extrabold text-[#1a2744] uppercase tracking-wide mb-4">Government Partners & Clients</h2>
          <p className="text-gray-500 text-xs mb-4 leading-relaxed">
            Haven Spirit works under the mandate and oversight of the following government bodies and
            implementing agencies:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "BEPC", full: "Bihar Education Project Council", desc: "Nodal agency under Government of Bihar for ICT Lab project implementation in state schools.", color: "bg-blue-50 border-blue-100", dot: "bg-blue-400" },
              { name: "NHAI", full: "National Highways Authority of India", desc: "Central government body for highway infrastructure projects requiring field-level staffing.", color: "bg-amber-50 border-amber-100", dot: "bg-amber-400" },
              { name: "TCIL", full: "Telecommunications Consultants India Ltd.", desc: "Government of India enterprise coordinating telecom and ICT project implementation.", color: "bg-green-50 border-green-100", dot: "bg-green-400" },
              { name: "RailTel", full: "RailTel Corporation of India", desc: "PSU under Ministry of Railways for broadband and ICT connectivity projects.", color: "bg-purple-50 border-purple-100", dot: "bg-purple-400" },
            ].map((dept) => (
              <div key={dept.name} className={`rounded-lg px-4 py-3.5 border ${dept.color}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dept.dot}`} />
                  <p className="font-extrabold text-[#1a2744] text-sm">{dept.name}</p>
                </div>
                <p className="text-[11px] font-semibold text-gray-600 mb-1">{dept.full}</p>
                <p className="text-gray-500 text-xs leading-snug">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sm:p-7">
          <h2 className="text-sm sm:text-base font-extrabold text-[#1a2744] uppercase tracking-wide mb-4">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                title: "Transparency",
                desc: "Every recruitment step is documented and visible to candidates, agencies, and government partners alike.",
                icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
              },
              {
                title: "Accountability",
                desc: "We uphold full statutory compliance — EPF, ESIC, TDS — and maintain meticulous records for every project and employee.",
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              },
              {
                title: "Merit & Fairness",
                desc: "Selection is purely merit-based with published eligibility criteria, ensuring equal opportunity for all qualified candidates.",
                icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
              },
            ].map((v) => (
              <div key={v.title} className="flex items-start gap-3 p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div className="w-9 h-9 bg-[#f59e0b] rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={v.icon} />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-[#1a2744] text-sm">{v.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-[#1a2744] rounded-lg p-5 sm:p-7 text-white">
          <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide mb-4 text-[#f59e0b]">Company Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
            {[
              { label: "Company Name",       value: "Haven Spirit Private Limited" },
              { label: "Registration Type",  value: "Private Limited Company (Pvt. Ltd.)" },
              { label: "Registered Office",  value: "203, Akashwani Marg, Rukanpura, Patna – 800014, Bihar" },
              { label: "Operational Role",   value: "Payroll & Execution Partner — Government Projects" },
              { label: "Email",              value: "havenspirit.dir@gmail.com" },
              { label: "Phone",              value: "+91 7050322546" },
            ].map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5 border-b border-white/10 pb-2.5 last:border-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{row.label}</span>
                <span className="text-sm text-white">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <ContactFooter />
    </div>
  );
}
