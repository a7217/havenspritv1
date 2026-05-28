"use client";
import { useState, useEffect } from "react";

type AdminHeaderProps = {
  onMenuToggle?: () => void;
};

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const [dateTimeStr, setDateTimeStr] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const date = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
      setDateTimeStr(`${date}, ${time}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="text-gray-500 hover:text-[#1a2744] transition-colors p-1"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {dateTimeStr && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-1.5">
            <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="whitespace-nowrap">{dateTimeStr}</span>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="relative text-gray-500 hover:text-[#1a2744] transition-colors p-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-[#f59e0b] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#1a2744] flex items-center justify-center text-white text-xs font-bold shrink-0">
              A
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-700">Admin</span>
              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
