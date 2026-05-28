"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

type Tab = "profile" | "security";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  {
    key: "profile",
    label: "Admin Profile",
    icon: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />,
  },
  {
    key: "security",
    label: "Security & Password",
    icon: <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />,
  },
];

const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-colors";
const labelCls = "block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1";

const PROFILE_DEFAULTS = {
  name: "Admin User",
  email: "havenspirit.dir@gmail.com",
  phone: "+91 7050322546",
  designation: "Portal Administrator",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="font-bold text-[#1a2744] text-xs uppercase tracking-wide">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { if (window.innerWidth < 768) setSidebarOpen(false); }, []);
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const [profile, setProfile] = useState(PROFILE_DEFAULTS);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  const [passwords, setPasswords] = useState({ current: "", newPwd: "", confirm: "" });
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin/login");
      return;
    }
    setProfileLoading(true);
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setProfile({ ...PROFILE_DEFAULTS, ...d.data });
        }
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, [router]);

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      alert("Profile save nahi ho saka. Dobara try karein.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPwdError("");
    setPwdSuccess("");
    if (!passwords.current) { setPwdError("Current password daalo."); return; }
    if (passwords.newPwd.length < 6) { setPwdError("New password kam se kam 6 characters ka hona chahiye."); return; }
    if (passwords.newPwd !== passwords.confirm) { setPwdError("Passwords match nahi kar rahe."); return; }

    setPwdLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPwd }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setPasswords({ current: "", newPwd: "", confirm: "" });
      setPwdSuccess("Password update ho gaya! Naya password abhi se kaam karega.");
    } catch (e) {
      setPwdError(e instanceof Error ? e.message : "Password change failed.");
    } finally {
      setPwdLoading(false);
    }
  };

  const strength = passwords.newPwd.length > 9 ? "Strong" : passwords.newPwd.length > 6 ? "Good" : passwords.newPwd.length > 3 ? "Fair" : "Weak";
  const strengthColor = { Strong: "bg-green-500", Good: "bg-blue-400", Fair: "bg-yellow-400", Weak: "bg-red-400" }[strength];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      {sidebarOpen && <AdminSidebar activePage="settings" onClose={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-5 overflow-auto">
          <h1 className="text-xl font-extrabold text-[#1a2744] tracking-wide uppercase mb-5">Settings</h1>

          <div className="flex flex-col lg:flex-row gap-5">
            {/* Tab sidebar */}
            <aside className="lg:w-52 shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-left transition-colors border-b border-gray-50 last:border-0 ${
                      activeTab === t.key ? "bg-[#f59e0b] text-white" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">{t.icon}</svg>
                    {t.label}
                  </button>
                ))}
              </div>
            </aside>

            <div className="flex-1 min-w-0">

              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <>
                  <Section title="Admin Profile Information">
                    <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                      <div className="w-14 h-14 rounded-full bg-[#1a2744] flex items-center justify-center text-xl font-extrabold text-[#f59e0b] shrink-0">
                        {profileLoading ? "…" : profile.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{profile.name}</p>
                        <p className="text-xs text-gray-500">{profile.designation}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{profile.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {([
                        { key: "name",        label: "Full Name",    type: "text" },
                        { key: "email",       label: "Email Address", type: "email" },
                        { key: "phone",       label: "Phone Number",  type: "tel" },
                        { key: "designation", label: "Designation",   type: "text" },
                      ] as const).map(({ key, label, type }) => (
                        <div key={key}>
                          <label className={labelCls}>{label}</label>
                          <input
                            type={type}
                            value={profile[key]}
                            onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                            className={inputCls}
                          />
                        </div>
                      ))}
                    </div>
                  </Section>

                  {profileSaved && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4">
                      <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      <span className="text-sm text-green-700 font-semibold">Profile saved!</span>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={profileSaving || profileLoading}
                      className="bg-[#c8860a] hover:bg-[#a86e08] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded text-sm tracking-wider transition-colors"
                    >
                      {profileSaving ? "Saving..." : "SAVE PROFILE"}
                    </button>
                  </div>
                </>
              )}

              {/* SECURITY TAB */}
              {activeTab === "security" && (
                <Section title="Change Password">
                  <div className="space-y-4 max-w-md">
                    {pwdError && (
                      <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-xs text-red-600 font-semibold">
                        {pwdError}
                      </div>
                    )}
                    {pwdSuccess && (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2">
                        <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        <span className="text-xs text-green-700 font-semibold">{pwdSuccess}</span>
                      </div>
                    )}

                    {([
                      { key: "current", label: "Current Password",      placeholder: "Current password daalo" },
                      { key: "newPwd",  label: "New Password",           placeholder: "Naya password" },
                      { key: "confirm", label: "Confirm New Password",   placeholder: "Dobara daalo" },
                    ] as const).map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className={labelCls}>{label}</label>
                        <input
                          type="password"
                          value={passwords[key]}
                          onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className={inputCls}
                        />
                      </div>
                    ))}

                    {passwords.newPwd.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${strengthColor}`}
                            style={{ width: `${Math.min(100, (passwords.newPwd.length / 12) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 font-semibold w-12">{strength}</span>
                      </div>
                    )}

                    <button
                      onClick={handlePasswordChange}
                      disabled={pwdLoading}
                      className="bg-[#1a2744] hover:bg-[#243560] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded text-sm tracking-wider transition-colors"
                    >
                      {pwdLoading ? "Updating..." : "UPDATE PASSWORD"}
                    </button>
                  </div>
                </Section>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
