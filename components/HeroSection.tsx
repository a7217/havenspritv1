"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&auto=format&fit=crop&q=80",
    label: "Education & Training",
  },
  {
    url: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1600&auto=format&fit=crop&q=80",
    label: "Government Projects",
  },
  {
    url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&auto=format&fit=crop&q=80",
    label: "Contract Management",
  },
  {
    url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&auto=format&fit=crop&q=80",
    label: "Job Recruitment",
  },
  {
    url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600&auto=format&fit=crop&q=80",
    label: "ICT Labs & Technology",
  },
  {
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80",
    label: "Government Offices",
  },
];

const INTERVAL = 5000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState<number | null>(null);
  const [fading, setFading]   = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrev(current);
      setFading(true);
      setCurrent((c) => (c + 1) % SLIDES.length);
      setTimeout(() => {
        setPrev(null);
        setFading(false);
      }, 900);
    }, INTERVAL);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const goTo = (idx: number) => {
    if (idx === current) return;
    setPrev(current);
    setFading(true);
    setCurrent(idx);
    setTimeout(() => { setPrev(null); setFading(false); }, 900);
  };

  return (
    <section className="relative w-full min-h-[340px] md:h-[420px] flex items-center justify-center text-center text-white overflow-hidden">

      {/* Previous slide (fading out) */}
      {prev !== null && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-900"
          style={{
            backgroundImage: `url('${SLIDES[prev].url}')`,
            opacity: fading ? 0 : 1,
            transitionDuration: "900ms",
          }}
        />
      )}

      {/* Current slide (fading in) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-900"
        style={{
          backgroundImage: `url('${SLIDES[current].url}')`,
          opacity: fading ? 1 : 1,
          transitionDuration: "900ms",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 px-4 py-10 max-w-3xl mx-auto">
        <div className="inline-block bg-[#f59e0b]/20 border border-[#f59e0b]/50 text-[#fcd34d] text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
          {SLIDES[current].label}
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wide leading-tight drop-shadow-lg">
          Official Recruitment Partner<br />For Government Projects
        </h1>
        <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-200 px-2">
          Find vacancies, submit your resume, and join crucial public sector tenders.
        </p>
        <p className="text-xs sm:text-sm text-gray-300 mt-1">
          Current Project: BEPC ICT Lab Project, Bihar (RFP No. BEPC/ICT/2025-26/2984)
        </p>
        <Link
          href="/jobs"
          className="inline-block mt-6 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold uppercase px-6 sm:px-8 py-3 rounded transition-colors tracking-wider shadow-lg text-sm sm:text-base"
        >
          View Active Vacancies
        </Link>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === current
                  ? "bg-[#f59e0b] w-5 h-2"
                  : "bg-white/40 hover:bg-white/70 w-2 h-2"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
