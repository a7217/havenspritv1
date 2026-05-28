"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminAuth", "true");
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#d1d5db] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm relative overflow-hidden">
        <div className="absolute top-3 right-3 text-gray-400">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
        </div>

        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-5">
            <Image src="/logo.jpg" alt="Haven Spirit Logo" width={40} height={40} className="rounded shrink-0 object-contain" style={{ width: 40, height: "auto" }} />
            <div className="leading-tight">
              <div className="font-bold text-[#1a2744] text-sm tracking-wide">HAVEN SPIRIT PVT. LTD.</div>
              <div className="text-[10px] text-gray-500 tracking-wider">RECRUITMENT PORTAL</div>
            </div>
          </div>

          <h2 className="text-center font-bold text-[#1a2744] text-lg tracking-wide mb-6">
            ADMIN SECURE LOGIN
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-colors"
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-colors"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p role="alert" className="text-red-500 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c8860a] hover:bg-[#a86e08] text-white font-bold py-3 rounded tracking-widest text-sm transition-colors disabled:opacity-70"
            >
              {loading ? "LOGGING IN..." : "LOG IN"}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-400">
              Contact your system administrator to reset your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
