"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ContactFooter from "@/components/ContactFooter";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSubmitted(true);
    } catch {
      alert("Message send karne mein error aaya. Please dobara try karein.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activePage="contact" />

      {/* Hero */}
      <div className="bg-[#1a2744] text-white py-8 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide uppercase mb-3">Contact Us</h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Have a question about a vacancy, your application, or the portal? Reach out and we will get back to you within 2 working days.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-5">

            {/* Get In Touch */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-sm sm:text-base font-extrabold text-[#1a2744] uppercase tracking-wide mb-4">Get In Touch</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </>
                    ),
                    label: "Address",
                    value: "Haven Spirit Pvt. Ltd., 203, Akashwani Marg, Near Hanuman Mandir, Rukanpura, Patna, Bihar — 800014",
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                    label: "Email",
                    value: "havenspirit.dir@gmail.com",
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
                    label: "Phone",
                    value: "+91 7050322546",
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 0c-2.5 2.5-4 5.5-4 10s1.5 7.5 4 10m0-20c2.5 2.5 4 5.5 4 10s-1.5 7.5-4 10M2 12h20" />,
                    label: "Website",
                    value: "www.havenspirit.in",
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
                    label: "Office Hours",
                    value: "Monday – Friday, 9:00 AM – 6:00 PM IST",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-[#f59e0b] rounded flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm text-gray-700 mt-0.5 break-words">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Contacts — stacked on mobile */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-sm sm:text-base font-extrabold text-[#1a2744] uppercase tracking-wide mb-3">Department Contacts</h2>
              <div className="space-y-3">
                {[
                  { dept: "BEPC ICT Lab Project", email: "havenspirit.dir@gmail.com" },
                  { dept: "HR & Payroll", email: "havenspirit.dir@gmail.com" },
                  { dept: "General Enquiry", email: "havenspirit.dir@gmail.com" },
                ].map((d) => (
                  <div key={d.dept} className="flex flex-col gap-0.5 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-semibold text-gray-800">{d.dept}</span>
                    <a href={`mailto:${d.email}`} className="text-xs text-[#f59e0b] font-medium break-all hover:underline">
                      {d.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-sm sm:text-base font-extrabold text-[#1a2744] uppercase tracking-wide mb-4">Send a Message</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-bold text-gray-800 text-base">Message Sent!</p>
                <p className="text-gray-500 text-sm mt-1">We will respond to your query within 2 working days.</p>
                <button
                  onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setSubmitted(false); }}
                  className="mt-5 text-sm text-[#f59e0b] font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Full Name *</label>
                  <input
                    type="text" required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Email Address *</label>
                  <input
                    type="email" required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Subject *</label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option>Application Status Query</option>
                    <option>Job Vacancy Enquiry</option>
                    <option>Document Submission</option>
                    <option>Technical Issue</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Message *</label>
                  <textarea
                    required rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Describe your query in detail..."
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-60 text-white font-bold py-3 rounded text-sm tracking-wider transition-colors"
                >
                  {submitting ? "Sending..." : "SEND MESSAGE"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <ContactFooter />
    </div>
  );
}
