import Image from "next/image";

export default function ContactFooter() {
  return (
    <footer className="bg-[#1a2744] text-white">
      {/* Amber top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b]" />

      {/* Logo banner */}
      <div className="max-w-6xl mx-auto px-5 pt-6 pb-2">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <Image src="/logo.jpg" alt="Haven Spirit Logo" width={44} height={44} className="rounded object-contain" />
          </div>
          <div>
            <div className="font-bold text-base tracking-wide text-white">HAVEN SPIRIT PVT. LTD.</div>
            <div className="text-[10px] text-gray-400 tracking-widest uppercase">Official Recruitment Portal</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/10">

          {/* Contact */}
          <div className="pb-6 sm:pb-0 sm:pr-8">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="inline-block w-5 h-0.5 bg-[#f59e0b]" />
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-300 text-sm">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Haven Spirit Pvt. Ltd.,<br />203, Akashwani Marg, Near Hanuman Mandir,<br />Rukanpura, Patna, Bihar — 800014</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <svg className="w-4 h-4 shrink-0 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 7050322546</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <svg className="w-4 h-4 shrink-0 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>havenspirit.dir@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <svg className="w-4 h-4 shrink-0 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 0c-2.5 2.5-4 5.5-4 10s1.5 7.5 4 10m0-20c2.5 2.5 4 5.5 4 10s-1.5 7.5-4 10M2 12h20" />
                </svg>
                <a href="https://www.havenspirit.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#f59e0b] transition-colors">www.havenspirit.in</a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="pt-6 pb-6 sm:py-0 sm:px-8">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="inline-block w-5 h-0.5 bg-[#f59e0b]" />
              Quick Links
            </h3>
            <ul className="space-y-1">
              {[
                { label: "Home", href: "/" },
                { label: "Job Listings", href: "/jobs" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="flex items-center gap-2 text-gray-300 hover:text-[#f59e0b] transition-colors py-1.5 group"
                  >
                    <svg className="w-3.5 h-3.5 text-[#f59e0b] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    <svg className="w-3.5 h-3.5 text-gray-500 group-hover:hidden shrink-0 transition-all" fill="currentColor" viewBox="0 0 6 6">
                      <circle cx="3" cy="3" r="2" />
                    </svg>
                    <span className="text-sm">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div className="pt-6 sm:pt-0 sm:pl-8">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="inline-block w-5 h-0.5 bg-[#f59e0b]" />
              Follow Us
            </h3>
            <div className="flex gap-3">
              {[
                {
                  label: "Facebook",
                  href: "#",
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  ),
                },
                {
                  label: "Twitter/X",
                  href: "#",
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  href: "#",
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ),
                },
                {
                  label: "YouTube",
                  href: "#",
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                    </svg>
                  ),
                },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#f59e0b] flex items-center justify-center transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>

            <div className="mt-5 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">GST Registered</p>
              <p className="text-xs text-gray-300 leading-snug">
                GSTIN: 10AAHCH7157D1ZX<br />
                CIN: U78300UP2025PTC215555<br />
                Authorised Payroll & Execution Partner for Govt. Projects in Bihar.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="HS" width={18} height={18} className="rounded opacity-60" />
            © 2025 Haven Spirit Private Limited. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Government Authorized Portal
          </p>
        </div>
      </div>
    </footer>
  );
}
