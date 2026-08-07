"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ChevronRight,
  UserCheck,
  CheckSquare,
  Square,
  ArrowRight
} from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.add("light-page");

      // Check for password update success notice from forgot-password flow
      const notice = sessionStorage.getItem("login_notice");
      if (notice) {
        setSuccessMsg(notice);
        sessionStorage.removeItem("login_notice");
      }

      const saved = localStorage.getItem("student") || sessionStorage.getItem("student");
      if (saved) {
        router.push("/Student/dashboard");
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        document.documentElement.classList.remove("light-page");
      }
    };
  }, [router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your academic email or username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://online-management-backend.onrender.com/api/student/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        localStorage.setItem("student", JSON.stringify(data.student));
        sessionStorage.setItem("student", JSON.stringify(data.student));
        router.push("/Student/dashboard");
      } else {
        setError(data.message || "Invalid academic login credentials.");
      }
    } catch (err) {
      console.error("Student login error:", err);
      setError("Unable to connect to login server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-['Inter'] antialiased flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white relative overflow-x-hidden">

      {/* Education Academic Watermark Pattern */}
      <div
        className="absolute inset-0 bg-repeat opacity-[0.04] pointer-events-none z-0"
        style={{ backgroundImage: "url('/edu_pattern.png')", backgroundSize: "320px" }}
      />

      {/* Ambient Radial Blur */}
      <div className="absolute top-[-5%] left-[10%] sm:left-[25%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-gradient-to-r from-[#4F46E5]/10 to-[#7C3AED]/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      {/* Header Navbar */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[12px] sm:rounded-[14px] bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] flex items-center justify-center font-bold text-white shadow-md shadow-[#4F46E5]/25 flex-shrink-0">
            <GraduationCap className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black tracking-tight text-[#1E293B] flex items-center gap-1.5 sm:gap-2">
              EduPortal <span className="text-[9px] sm:text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20 font-bold">Student LMS</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
          <span className="text-[#64748B] hidden md:inline text-xs">Don't have an account?</span>
          <Link
            href="/Student/signup"
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-[12px] sm:rounded-[14px] bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white font-bold text-xs transition flex items-center gap-1 shadow-md shadow-[#4F46E5]/25"
          >
            <span>Create Account</span> <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Single Centered SaaS Card Container (Exact Match to Signup Layout) */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 my-auto py-8 sm:py-10">

        {/* Header Hero Section */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5] animate-pulse" />
            <span>Student Portal Portal Sign In</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight">
            Welcome <span className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] bg-clip-text text-transparent">Back</span>
          </h1>

          <p className="text-[#64748B] text-xs max-w-xs mx-auto leading-relaxed font-medium">
            Sign in to access your course modules, video lectures, and live analytics.
          </p>
        </div>

        {/* Central SaaS Login Card */}
        <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-[28px] border border-slate-200/90 shadow-xl shadow-slate-200/60 text-[#1E293B] space-y-5">

          {/* Feedback Messages */}
          {error && (
            <div className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold p-3.5 rounded-[14px] flex items-center gap-2.5 shadow-sm">
              <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold p-3.5 rounded-[14px] flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">

            {/* Email / Username Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">
                Academic Email or Username *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu or STU101"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[14px] text-xs sm:text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition shadow-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">
                  Password *
                </label>
                <Link href="/Student/forgot-password" className="text-[11px] font-bold text-[#4F46E5] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-9 py-2.5 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[14px] text-xs sm:text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-[#4F46E5] transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div
              onClick={() => setRememberMe(!rememberMe)}
              className="p-3 rounded-[14px] bg-[#F8FAFC] border border-slate-200 flex items-center gap-2.5 cursor-pointer select-none transition hover:bg-[#F1F5F9]"
            >
              <button type="button" className="text-[#4F46E5] flex-shrink-0">
                {rememberMe ? <CheckSquare className="w-4.5 h-4.5 fill-[#4F46E5] text-white" /> : <Square className="w-4.5 h-4.5 text-slate-400" />}
              </button>
              <span className="text-[11px] sm:text-xs text-[#1E293B] font-medium leading-tight">
                Remember me on this device
              </span>
            </div>

            {/* Submit Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] text-white font-black text-xs sm:text-sm rounded-[14px] shadow-xl shadow-[#4F46E5]/30 hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  <UserCheck className="w-4 h-4" /> Sign In to Portal <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Signup Link */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-[#64748B]">
            Don't have an active student account?{" "}
            <Link href="/Student/signup" className="font-bold text-[#4F46E5] hover:underline">
              Create Account Here
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs font-medium border-t border-[#E5E7EB] bg-white/80 backdrop-blur-md text-[#64748B] gap-2.5">
        <span>© 2026 EduPortal Enterprise LMS. All rights reserved.</span>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="#" className="hover:text-[#4F46E5]">Privacy Policy</Link>
          <Link href="#" className="hover:text-[#4F46E5]">Terms of Service</Link>
          <Link href="#" className="hover:text-[#4F46E5]">System Support</Link>
        </div>
      </footer>

    </div>
  );
}
