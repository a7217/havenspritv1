"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type NavbarProps = {
  activePage?: "home" | "jobs" | "about" | "contact";
};

export default function Navbar({ activePage = "home" }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ backgroundColor: "#1a2744", color: "white", position: "sticky", top: 0, zIndex: 50 }} className="shadow-md">

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "white" }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "2px" }}>
            <Image src="/logo.jpg" alt="Haven Spirit Logo" width={40} height={40} className="rounded object-contain" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px", letterSpacing: "0.05em" }}>HAVEN SPIRIT PVT. LTD.</div>
            <div style={{ fontSize: "10px", color: "#d1d5db", letterSpacing: "0.1em" }}>RECRUITMENT PORTAL</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "24px", fontSize: "14px", fontWeight: 500 }}>
          <Link href="/" style={{ color: activePage === "home" ? "#f59e0b" : "white", textDecoration: "none" }}>HOME</Link>
          <Link href="/jobs" style={{ color: activePage === "jobs" ? "#f59e0b" : "white", textDecoration: "none" }}>JOB LISTINGS</Link>
          <Link href="/about" style={{ color: activePage === "about" ? "#f59e0b" : "white", textDecoration: "none" }}>ABOUT US</Link>
          <Link href="/contact" style={{ color: activePage === "contact" ? "#f59e0b" : "white", textDecoration: "none" }}>CONTACT</Link>
          <Link href="/admin/login" style={{ backgroundColor: "#f59e0b", color: "white", fontWeight: 600, padding: "8px 16px", borderRadius: "6px", textDecoration: "none", fontSize: "14px" }}>
            ADMIN LOGIN
          </Link>
        </div>

        {/* Hamburger — mobile only */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center shrink-0"
          onClick={() => setOpen((prev) => !prev)}
          style={{
            background: open ? "#243560" : "transparent",
            border: "none",
            color: "white",
            width: "44px",
            height: "44px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className="md:hidden"
        style={{ display: open ? "block" : "none", borderTop: "1px solid #243560" }}
      >
        {(["home", "jobs", "about", "contact"] as const).map((page) => {
          const label = { home: "HOME", jobs: "JOB LISTINGS", about: "ABOUT US", contact: "CONTACT" }[page];
          const href = { home: "/", jobs: "/jobs", about: "/about", contact: "/contact" }[page];
          const isActive = activePage === page;
          return (
            <Link
              key={page}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 20px",
                color: isActive ? "#f59e0b" : "white",
                fontWeight: isActive ? 600 : 400,
                backgroundColor: isActive ? "#243560" : "transparent",
                borderLeft: isActive ? "4px solid #f59e0b" : "4px solid transparent",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              {label}
            </Link>
          );
        })}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #243560" }}>
          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            style={{
              display: "block",
              backgroundColor: "#f59e0b",
              color: "white",
              fontWeight: 600,
              padding: "12px 16px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            ADMIN LOGIN
          </Link>
        </div>
      </div>

    </nav>
  );
}
