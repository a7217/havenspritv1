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
      <div className="bg-[#1a2744] text-white py-8 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide uppercase mb-3">About Us</h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Haven Spirit Private Limited is a GST-registered private company based in Patna, Bihar,
            operating as an authorised Payroll &amp; Execution Partner for government-linked projects across the state.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-4 sm:space-y-6">

        {/* Mission */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-sm sm:text-base font-extrabold text-[#1a2744] uppercase tracking-wide mb-3">Our Mission</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Haven Spirit Pvt. Ltd. serves as the district-level Payroll &amp; Execution Partner for
            government-sponsored projects in Bihar. We are responsible for candidate recruitment, salary
            disbursement, EPF/ESIC compliance, attendance administration, and all employment-related
            operations for project-linked staff. Our current primary engagement is the ICT Lab Project
            awarded under Bihar Education Project Council (BEPC), Government of Bihar.
          </p>
        </div>

        {/* What We Do */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-sm sm:text-base font-extrabold text-[#1a2744] uppercase tracking-wide mb-4">What We Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                title: "Recruitment & Hiring",
                desc: "End-to-end recruitment for government project roles — ICT Lab Instructors, field staff, and support personnel across districts in Bihar.",
              },
              {
                title: "Payroll Processing",
                desc: "Monthly salary disbursement with full EPF, ESIC, and statutory compliance as the employer of record for project-linked staff.",
              },
              {
                title: "Application Tracking",
                desc: "Real-time status updates keep candidates informed at every stage — from submission to final offer and deployment.",
              },
              {
                title: "Admin Dashboard",
                desc: "Administrators get full control over vacancies, tenders, applicants, and district-level deployment analytics.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                <div className="w-2 h-2 rounded-full bg-[#f59e0b] mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Departments — vertical list on mobile */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-sm sm:text-base font-extrabold text-[#1a2744] uppercase tracking-wide mb-4">Partner Departments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "BEPC", desc: "Bihar Education Project Council", color: "bg-blue-50 border-blue-100" },
              { name: "TCIL", desc: "Telecommunications Consultants India Ltd.", color: "bg-amber-50 border-amber-100" },
              { name: "RailTel", desc: "RailTel Corporation of India", color: "bg-green-50 border-green-100" },
              { name: "Kendriya Bhandar", desc: "Implementation Agency", color: "bg-purple-50 border-purple-100" },
            ].map((dept) => (
              <div key={dept.name} className={`flex items-center gap-3 rounded-lg px-4 py-3 border ${dept.color}`}>
                <div className="w-2 h-8 rounded-full bg-[#f59e0b] shrink-0" />
                <div>
                  <p className="font-extrabold text-[#1a2744] text-sm">{dept.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-snug">{dept.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-sm sm:text-base font-extrabold text-[#1a2744] uppercase tracking-wide mb-4">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                title: "Transparency",
                desc: "Every step of the recruitment process is visible and accountable.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                ),
              },
              {
                title: "Efficiency",
                desc: "Digital workflows cut hiring timelines and reduce manual delays.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
              },
              {
                title: "Fairness",
                desc: "Merit-based selection with clear eligibility criteria for all.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                ),
              },
            ].map((v) => (
              <div key={v.title} className="flex items-start gap-3 p-3 sm:p-4 border border-gray-100 rounded-lg">
                <div className="w-9 h-9 bg-[#f59e0b] rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {v.icon}
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
        <div className="bg-[#1a2744] rounded-lg p-4 sm:p-6 text-white">
          <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide mb-4 text-[#f59e0b]">Company Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
            {[
              { label: "Company Name", value: "Haven Spirit Private Limited" },
              { label: "Registration Type", value: "Private Limited Company" },
              { label: "Registered Office", value: "203, Akashwani Marg, Rukanpura, Patna – 800014" },
              { label: "Role", value: "Payroll & Execution Partner" },
              { label: "Email", value: "havenspirit.dir@gmail.com" },
              { label: "Phone", value: "+91 7050322546" },
            ].map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5 border-b border-white/10 pb-2 last:border-0">
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
