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
  Send,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

export default function StudentForgotPasswordPage() {
  const router = useRouter();

  // Reset Flow Step: 1 = Email OTP, 2 = Verify OTP, 3 = Reset Password
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Timer State for Resend OTP
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.add("light-page");
    }
    return () => {
      if (typeof window !== "undefined") {
        document.documentElement.classList.remove("light-page");
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Step 1: Send OTP to Registered Email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/student/forgot-password/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setSuccessMsg(data.message || `OTP verification code sent to ${email}.`);
        setActiveStep(2);
        setTimer(60); // 60 seconds countdown for resend
      } else {
        setError(data.message || "Email not found. Please enter your registered email address.");
      }
    } catch (err) {
      setError("Unable to connect to verification server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!otpCode || otpCode.length < 6) {
      setError("Please enter the complete 6-digit OTP code sent to your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/student/forgot-password/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp_code: otpCode }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setSuccessMsg("OTP verified successfully! Create your new password.");
        setActiveStep(3);
      } else {
        setError(data.message || "Invalid OTP code provided. Please check your inbox and try again.");
      }
    } catch (err) {
      setError("Failed to verify OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Create New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New Password and Confirm Password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/student/forgot-password/reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp_code: otpCode,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        // Store success message in sessionStorage so login page can display it
        sessionStorage.setItem("login_notice", "Password updated successfully. Please sign in with your new password.");
        router.push("/Student/login");
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-['Inter'] antialiased flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white relative overflow-x-hidden">
      
      {/* Education Academic Pattern Watermark */}
      <div 
        className="absolute inset-0 bg-repeat opacity-[0.04] pointer-events-none z-0"
        style={{ backgroundImage: "url('/edu_pattern.png')", backgroundSize: "320px" }}
      />

      {/* Ambient Radial Blur Glow */}
      <div className="absolute top-[-5%] left-[10%] sm:left-[25%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-gradient-to-r from-[#4F46E5]/10 to-[#7C3AED]/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      {/* Header Navbar */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[12px] sm:rounded-[14px] bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] flex items-center justify-center font-bold text-white shadow-md shadow-[#4F46E5]/25 flex-shrink-0">
            <GraduationCap className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black tracking-tight text-[#1E293B] flex items-center gap-1.5 sm:gap-2">
              EduPortal <span className="text-[9px] sm:text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20 font-bold">Account Recovery</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
          <span className="text-[#64748B] hidden md:inline text-xs">Remember your credentials?</span>
          <Link
            href="/Student/login"
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-[12px] sm:rounded-[14px] bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white font-bold text-xs transition flex items-center gap-1 shadow-md shadow-[#4F46E5]/25"
          >
            <span>Sign In</span> <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Single Centered SaaS Card Container */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 my-auto py-8 sm:py-10">
        
        {/* Header Hero Section */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5] animate-pulse" />
            <span>Reset Password</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight">
            Forgot <span className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] bg-clip-text text-transparent">Password?</span>
          </h1>

          <p className="text-[#64748B] text-xs max-w-xs mx-auto leading-relaxed font-medium">
            {activeStep === 1 && "Enter your registered academic email to receive an OTP code."}
            {activeStep === 2 && "Enter the 6-digit OTP code sent to your registered email inbox."}
            {activeStep === 3 && "Create and confirm your new secure portal password."}
          </p>
        </div>

        {/* Central SaaS Card */}
        <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-[28px] border border-slate-200/90 shadow-xl shadow-slate-200/60 text-[#1E293B] space-y-5">
          
          {/* Timeline Stepper Progress Indicator */}
          <div className="relative border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between relative z-10 max-w-xs mx-auto">
              
              {/* Step 1 */}
              <div className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition duration-300 ${
                  activeStep === 1
                    ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md shadow-[#4F46E5]/30 scale-105"
                    : activeStep > 1
                    ? "bg-emerald-500 text-white"
                    : "bg-[#F1F5F9] text-[#64748B] border border-slate-200"
                }`}>
                  {activeStep > 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : "1"}
                </div>
                <span className={`text-[11px] font-bold ${activeStep === 1 ? "text-[#4F46E5]" : "text-[#1E293B]"}`}>Email</span>
              </div>

              {/* Connector 1 */}
              <div className={`flex-1 h-[2px] mx-2 rounded-full transition-colors duration-300 ${
                activeStep > 1 ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]" : "bg-slate-200"
              }`} />

              {/* Step 2 */}
              <div className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition duration-300 ${
                  activeStep === 2
                    ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md shadow-[#4F46E5]/30 scale-105"
                    : activeStep > 2
                    ? "bg-emerald-500 text-white"
                    : "bg-[#F1F5F9] text-[#64748B] border border-slate-200"
                }`}>
                  {activeStep > 2 ? <CheckCircle2 className="w-3.5 h-3.5" /> : "2"}
                </div>
                <span className={`text-[11px] font-bold ${activeStep === 2 ? "text-[#4F46E5]" : "text-[#1E293B]"}`}>OTP</span>
              </div>

              {/* Connector 2 */}
              <div className={`flex-1 h-[2px] mx-2 rounded-full transition-colors duration-300 ${
                activeStep > 2 ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]" : "bg-slate-200"
              }`} />

              {/* Step 3 */}
              <div className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition duration-300 ${
                  activeStep === 3
                    ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md shadow-[#4F46E5]/30 scale-105"
                    : "bg-[#F1F5F9] text-[#64748B] border border-slate-200"
                }`}>
                  3
                </div>
                <span className={`text-[11px] font-bold ${activeStep === 3 ? "text-[#4F46E5]" : "text-[#1E293B]"}`}>Reset</span>
              </div>

            </div>
          </div>

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

          {/* STEP 1: Enter Registered Email */}
          {activeStep === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">
                  Registered Academic Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[14px] text-xs sm:text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] text-white font-black text-xs sm:text-sm rounded-[14px] shadow-xl shadow-[#4F46E5]/30 hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
              >
                {loading ? (
                  "Verifying Email..."
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Reset OTP Code <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Verify OTP Code */}
          {activeStep === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">
                  6-Digit OTP Code *
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[14px] font-mono text-sm font-bold tracking-widest text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition shadow-sm"
                  />
                </div>
              </div>

              {/* Resend Timer */}
              <div className="flex items-center justify-between text-xs font-medium text-[#64748B]">
                <span>Didn't receive the code?</span>
                <button
                  type="button"
                  disabled={timer > 0 || loading}
                  onClick={() => handleSendOtp()}
                  className="font-bold text-[#4F46E5] hover:underline disabled:opacity-50 disabled:no-underline"
                >
                  {timer > 0 ? `Resend code in ${timer}s` : "Resend OTP"}
                </button>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="w-1/3 py-3 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] font-bold text-xs rounded-[14px] border border-[#CBD5E1] transition flex items-center justify-center gap-1 shadow-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-500" /> Back
                </button>

                <button
                  type="submit"
                  disabled={loading || otpCode.length < 6}
                  className="w-2/3 py-3 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] text-white font-black text-xs sm:text-sm rounded-[14px] shadow-xl shadow-[#4F46E5]/30 hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
                >
                  {loading ? "Verifying..." : "Verify OTP Code"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Create New Password */}
          {activeStep === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in duration-300">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-9 py-2.5 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[14px] text-xs sm:text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-[#4F46E5] transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full py-3.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] text-white font-black text-xs sm:text-sm rounded-[14px] shadow-xl shadow-[#4F46E5]/30 hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
              >
                {loading ? (
                  "Updating Password..."
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" /> Update Password & Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Navigation Link to Login */}
          <div className="pt-3 border-t border-slate-100 text-center text-xs text-[#64748B]">
            Remember your password?{" "}
            <Link href="/Student/login" className="font-bold text-[#4F46E5] hover:underline">
              Sign In Here
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
