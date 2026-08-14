"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Send,
  UserCheck,
  Sparkles,
  ChevronRight,
  ChevronDown,
  BookOpen,
  IdCard,
  CheckSquare,
  Square,
  ArrowLeft
} from "lucide-react";

interface College {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  college_id: number;
}

interface PrincipalInfo {
  name: string;
  email: string;
}

export default function StudentSignupPage() {
  const router = useRouter();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [year, setYear] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Options & Principal state
  const [colleges, setColleges] = useState<College[]>([]);
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [principalInfo, setPrincipalInfo] = useState<PrincipalInfo | null>(null);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Feedback state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.add("light-page");
      const saved = localStorage.getItem("student") || sessionStorage.getItem("student");
      if (saved) {
        router.push("/Student/dashboard");
        return;
      }
    }
    fetchCollegesAndDepartments();

    return () => {
      if (typeof window !== "undefined") {
        document.documentElement.classList.remove("light-page");
      }
    };
  }, [router]);

  const getApiBase = () => {
    if (process.env.NEXT_PUBLIC_API_BASE) return process.env.NEXT_PUBLIC_API_BASE;
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      return "https://online-management-backend.onrender.com";
    }
    return "https://online-management-backend.onrender.com";
  };

  const fetchCollegesAndDepartments = async () => {
    const MOCK_COLLEGES: College[] = [
      { id: 1, name: "Science & Technology College" },
      { id: 2, name: "Business School" },
      { id: 3, name: "Engineering Institute" }
    ];

    const MOCK_DEPARTMENTS: Department[] = [
      { id: 1, name: "Computer Science & Engineering", college_id: 1 },
      { id: 2, name: "Information Technology", college_id: 1 },
      { id: 3, name: "Business Administration", college_id: 2 },
      { id: 4, name: "Electronics & Communication", college_id: 3 },
      { id: 5, name: "Mechanical Engineering", college_id: 3 }
    ];

    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/get-colleges/`);
      const data = await res.json();
      if (data.status === "success") {
        setColleges(data.colleges || []);
        setAllDepartments(data.departments || []);
        return;
      }
    } catch (err) {
      console.warn("Failed to load colleges & departments from API, loading local fallback data:", err);
    }

    setColleges(MOCK_COLLEGES);
    setAllDepartments(MOCK_DEPARTMENTS);
  };

  const handleCollegeChange = async (selectedId: string) => {
    setCollegeId(selectedId);
    setDepartmentId("");
    setPrincipalInfo(null);

    if (!selectedId) {
      setFilteredDepartments([]);
      return;
    }

    const depts = allDepartments.filter((d) => String(d.college_id) === String(selectedId));
    setFilteredDepartments(depts);

    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/get-principal-by-college/${selectedId}/`);
      const data = await res.json();
      if (data.status === "success") {
        setPrincipalInfo({
          name: data.principal_name,
          email: data.principal_email,
        });
      }
    } catch (err) {
      console.error("Failed to load principal details:", err);
    }
  };

  const handleSendOtp = async () => {
    setError("");
    setSuccessMsg("");

    const currentEmail = email.trim().toLowerCase();
    if (!currentEmail) {
      setError("Please enter your email address to receive the verification OTP code.");
      return;
    }

    setSendingOtp(true);

    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/student/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim() || "Student",
          email: currentEmail,
          phone: phone.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setOtpSent(true);
        setSuccessMsg(`OTP verification code sent to ${email}. Please check your inbox.`);
      } else {
        setError(data.message || "Failed to send OTP code.");
      }
    } catch (err) {
      console.warn("OTP API error, activating offline development mock (Enter OTP: 123456):", err);
      setOtpSent(true);
      setSuccessMsg(`[Offline Mode] Verification code generated! Use code: 123456`);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setSuccessMsg("");

    if (!otpCode || otpCode.length < 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    setVerifyingOtp(true);

    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/student/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp_code: otpCode.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setOtpVerified(true);
        setSuccessMsg("Email verified successfully! Proceed to academic details.");
      } else {
        setError(data.message || "Invalid OTP code provided.");
      }
    } catch (err) {
      console.warn("OTP verification API error, checking offline mock code:", err);
      if (otpCode.trim() === "123456") {
        setOtpVerified(true);
        setSuccessMsg("Email verified successfully (Offline Mode)! Proceed to academic details.");
      } else {
        setError("Invalid OTP code. [Hint: Enter 123456 for offline registration]");
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  const goToStep = (step: 1 | 2 | 3) => {
    setError("");
    setSuccessMsg("");

    if (step > 1 && !otpVerified) {
      setError("Please enter and verify your email OTP before proceeding to academic details.");
      return;
    }

    if (step === 3 && (!collegeId || !departmentId || !year)) {
      setError("Please select your College, Department, and Academic Year first.");
      return;
    }

    setActiveStep(step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!otpVerified) {
      setError("Please verify your email address using OTP before creating an account.");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the Terms & Conditions to complete your registration.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setLoading(true);

    const selectedCollege = colleges.find(c => String(c.id) === String(collegeId));
    const selectedDept = allDepartments.find(d => String(d.id) === String(departmentId));

    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/student/create-account/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          date_of_birth: dateOfBirth,
          college_id: collegeId,
          department_id: departmentId,
          year,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setSuccessMsg("Account created successfully! Redirecting to login page...");
        window.location.href = "/Student/login";
      } else {
        setError(data.message || "Registration failed. Please check form entries.");
      }
    } catch (err) {
      console.warn("Registration API error, generating local mocked account:", err);
      
      const mockStudent = {
        id: 999,
        full_name: fullName,
        email: email,
        phone: phone,
        date_of_birth: dateOfBirth,
        college_id: collegeId,
        college_name: selectedCollege ? selectedCollege.name : "Science & Technology College",
        department_id: departmentId,
        department: selectedDept ? selectedDept.name : "Computer Science & Engineering",
        year: year,
        student_id: studentId || "STU999",
        username: email.split("@")[0] || "STU999"
      };

      try {
        localStorage.setItem("student", JSON.stringify(mockStudent));
        sessionStorage.setItem("student", JSON.stringify(mockStudent));
        localStorage.setItem("student_token", "dummy_token");
      } catch (_) {}

      setSuccessMsg("Registration successful (Offline Mock Mode)! Redirecting to student login...");
      setTimeout(() => {
        window.location.href = "/Student/login";
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-['Inter'] antialiased flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white relative overflow-x-hidden">

      {/* Education Watermark Pattern */}
      <div
        className="absolute inset-0 bg-repeat opacity-[0.04] pointer-events-none z-0"
        style={{ backgroundImage: "url('/edu_pattern.png')", backgroundSize: "320px" }}
      />

      {/* Ambient Radial Blur */}
      <div className="absolute top-[-5%] left-[10%] sm:left-[25%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-gradient-to-r from-[#4F46E5]/10 to-[#7C3AED]/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      {/* Responsive Navbar */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[12px] sm:rounded-[14px] bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] flex items-center justify-center font-bold text-white shadow-md shadow-[#4F46E5]/25 flex-shrink-0">
            <GraduationCap className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black tracking-tight text-[#1E293B] flex items-center gap-1.5 sm:gap-2">
              EduPortal <span className="text-[9px] sm:text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20 font-bold">LMS</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
          <span className="text-[#64748B] hidden md:inline text-xs">Already registered?</span>
          <Link
            href="/Student/login"
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-[12px] sm:rounded-[14px] bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white font-bold text-xs transition flex items-center gap-1 shadow-md shadow-[#4F46E5]/25"
          >
            <span>Sign In</span> <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-2xl mx-auto px-3.5 sm:px-6 my-auto py-6 sm:py-8">

        {/* Header Hero Title Section */}
        <div className="text-center space-y-2 mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5] animate-pulse" />
            <span>Student Registration</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-[#1E293B] tracking-tight">
            Create Your <span className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] bg-clip-text text-transparent">Student Account</span>
          </h1>

          <p className="text-[#64748B] text-[11px] sm:text-xs max-w-xs sm:max-w-sm mx-auto leading-relaxed font-medium">
            Join thousands of verified students accessing online courses and metrics.
          </p>
        </div>

        {/* Central Registration SaaS Card */}
        <div className="bg-white/95 backdrop-blur-xl p-4.5 sm:p-7 md:p-8 rounded-[24px] sm:rounded-[28px] border border-slate-200/90 shadow-xl shadow-slate-200/60 text-[#1E293B] space-y-5 sm:space-y-6">

          {/* Responsive Stepper Progress Indicator */}
          <div className="relative border-b border-slate-100 pb-4 sm:pb-5">
            <div className="flex items-center justify-between relative z-10 max-w-md mx-auto">

              {/* Step 1 */}
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="flex items-center gap-1.5 sm:gap-2 group focus:outline-none"
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-[11px] sm:text-xs transition duration-300 ${activeStep === 1
                  ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md shadow-[#4F46E5]/30 scale-105"
                  : activeStep > 1
                    ? "bg-emerald-500 text-white"
                    : "bg-[#F1F5F9] text-[#64748B] border border-slate-200"
                  }`}>
                  {activeStep > 1 ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : "1"}
                </div>
                <div className="text-left">
                  <p className={`text-[11px] sm:text-xs font-bold ${activeStep === 1 ? "text-[#4F46E5]" : "text-[#1E293B]"}`}>Personal</p>
                </div>
              </button>

              {/* Connector 1 */}
              <div className={`flex-1 h-[2px] mx-2 sm:mx-3 rounded-full transition-colors duration-300 ${activeStep > 1 ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]" : "bg-slate-200"
                }`} />

              {/* Step 2 */}
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="flex items-center gap-1.5 sm:gap-2 group focus:outline-none"
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-[11px] sm:text-xs transition duration-300 ${activeStep === 2
                  ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md shadow-[#4F46E5]/30 scale-105"
                  : activeStep > 2
                    ? "bg-emerald-500 text-white"
                    : "bg-[#F1F5F9] text-[#64748B] border border-slate-200"
                  }`}>
                  {activeStep > 2 ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : "2"}
                </div>
                <div className="text-left">
                  <p className={`text-[11px] sm:text-xs font-bold ${activeStep === 2 ? "text-[#4F46E5]" : "text-[#1E293B]"}`}>Academic</p>
                </div>
              </button>

              {/* Connector 2 */}
              <div className={`flex-1 h-[2px] mx-2 sm:mx-3 rounded-full transition-colors duration-300 ${activeStep > 2 ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]" : "bg-slate-200"
                }`} />

              {/* Step 3 */}
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="flex items-center gap-1.5 sm:gap-2 group focus:outline-none"
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-[11px] sm:text-xs transition duration-300 ${activeStep === 3
                  ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md shadow-[#4F46E5]/30 scale-105"
                  : "bg-[#F1F5F9] text-[#64748B] border border-slate-200"
                  }`}>
                  3
                </div>
                <div className="text-left">
                  <p className={`text-[11px] sm:text-xs font-bold ${activeStep === 3 ? "text-[#4F46E5]" : "text-[#1E293B]"}`}>Security</p>
                </div>
              </button>

            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold p-3 sm:p-3.5 rounded-[14px] flex items-center gap-2.5 shadow-sm">
              <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold p-3 sm:p-3.5 rounded-[14px] flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

            {/* STEP 1: Personal Details */}
            {activeStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-300">

                {/* Full Name */}
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[14px] text-xs sm:text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition shadow-sm"
                    />
                  </div>
                </div>

                {/* Email Address with Send OTP Button */}
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">Email Address *</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        disabled={otpVerified}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError("");
                        }}
                        placeholder="student@college.edu"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[14px] text-xs sm:text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition disabled:opacity-60 shadow-sm"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={sendingOtp || otpVerified || !email}
                      onClick={handleSendOtp}
                      className="px-4 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white font-bold text-xs rounded-[14px] shadow-md shadow-[#4F46E5]/20 transition flex items-center justify-center gap-1.5 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingOtp ? (
                        "Sending..."
                      ) : otpVerified ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Verified
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" /> Send OTP Code
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* OTP Verification Box */}
                {otpSent && !otpVerified && (
                  <div className="bg-[#4F46E5]/10 border border-[#4F46E5]/20 p-3.5 sm:p-4 rounded-[14px] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] sm:text-xs font-bold text-[#4F46E5] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#4F46E5]" /> Enter 6-Digit Email Code
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        className="w-32 sm:w-36 text-center font-mono text-xs sm:text-sm font-bold px-2.5 py-2 bg-[#FFFFFF] border border-[#4F46E5]/30 text-[#1E293B] rounded-[10px] focus:ring-2 focus:ring-[#4F46E5] focus:outline-none tracking-widest shadow-sm"
                      />
                      <button
                        type="button"
                        disabled={verifyingOtp || !otpCode}
                        onClick={handleVerifyOtp}
                        className="px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold text-xs rounded-[10px] shadow hover:opacity-95 transition disabled:opacity-50"
                      >
                        {verifyingOtp ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Mobile & DOB Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  {/* Mobile Number */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">Mobile Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[14px] text-xs sm:text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[14px] text-xs sm:text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 1 Action */}
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="w-full py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-[14px] shadow-md shadow-[#4F46E5]/25 transition flex items-center justify-center gap-1.5"
                >
                  <span>Next Step: Academic Details</span> <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

            {/* STEP 2: Academic Details */}
            {activeStep === 2 && (
              <div className="space-y-3.5 sm:space-y-4 animate-in fade-in duration-300">
                {/* College Selection */}
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">College *</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      required
                      value={collegeId}
                      onChange={(e) => handleCollegeChange(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[14px] text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] appearance-none transition shadow-sm"
                    >
                      <option value="">Select College</option>
                      {colleges.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Department & Year Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">Department *</label>
                    <div className="relative">
                      <select
                        required
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        disabled={!collegeId}
                        className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[14px] text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] appearance-none transition disabled:opacity-50 shadow-sm"
                      >
                        <option value="">{collegeId ? "Select Department" : "Select College First"}</option>
                        {filteredDepartments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">Academic Year *</label>
                    <div className="relative">
                      <select
                        required
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[14px] text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] appearance-none transition shadow-sm"
                      >
                        <option value="">Select Year</option>
                        <option value="I">First Year (I)</option>
                        <option value="II">Second Year (II)</option>
                        <option value="III">Third Year (III)</option>
                        <option value="IV">Fourth Year (IV)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Student ID (Optional) */}
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">Student ID (Optional)</label>
                  <div className="relative">
                    <IdCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. STU-2026-8942"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[14px] text-xs sm:text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition shadow-sm"
                    />
                  </div>
                </div>

                {/* Read-Only Principal Info */}
                {collegeId && principalInfo && (
                  <div className="bg-[#4F46E5]/10 border border-[#4F46E5]/20 p-3 sm:p-3.5 rounded-[14px] space-y-1">
                    <h4 className="text-[11px] sm:text-xs font-bold text-[#4F46E5] flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-[#4F46E5]" /> College Principal Information (Read-Only)
                    </h4>
                    <input
                      type="text"
                      readOnly
                      value={principalInfo.name}
                      className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#4F46E5]/30 rounded-[10px] text-xs font-bold text-[#1E293B] cursor-not-allowed shadow-sm"
                    />
                  </div>
                )}

                {/* Step 2 Actions */}
                <div className="flex gap-2.5 sm:gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="w-1/2 py-2.5 sm:py-3 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] font-bold text-xs rounded-[14px] border border-[#CBD5E1] transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-500" /> Back
                  </button>

                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="w-1/2 py-2.5 sm:py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white font-bold text-xs rounded-[14px] shadow-md shadow-[#4F46E5]/25 transition flex items-center justify-center gap-1.5"
                  >
                    <span>Next: Security</span> <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Security & Credentials */}
            {activeStep === 3 && (
              <div className="space-y-3.5 sm:space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  {/* Password */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">Password *</label>
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

                  {/* Confirm Password */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="block text-[11px] sm:text-xs font-bold text-[#1E293B]">Confirm Password *</label>
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
                </div>

                {/* Terms Checkbox */}
                <div
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className="p-3 rounded-[14px] bg-[#F8FAFC] border border-slate-200 flex items-center gap-2.5 cursor-pointer select-none transition hover:bg-[#F1F5F9]"
                >
                  <button type="button" className="text-[#4F46E5] flex-shrink-0">
                    {agreeTerms ? <CheckSquare className="w-4.5 h-4.5 fill-[#4F46E5] text-white" /> : <Square className="w-4.5 h-4.5 text-slate-400" />}
                  </button>
                  <span className="text-[11px] sm:text-xs text-[#1E293B] font-medium leading-tight">
                    I agree to the <Link href="#" className="font-bold text-[#4F46E5] hover:underline">Terms & Conditions</Link> and Privacy Policy.
                  </span>
                </div>

                {/* Submit Action */}
                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    disabled={!otpVerified || !agreeTerms || loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] text-white font-black text-xs sm:text-sm rounded-[14px] shadow-xl shadow-[#4F46E5]/30 hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
                  >
                    {loading ? (
                      "Creating Account..."
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" /> Create Verified Account <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="w-full py-2 bg-transparent text-xs font-semibold text-[#64748B] hover:text-[#1E293B] transition"
                  >
                    Back to Academic Details
                  </button>
                </div>
              </div>
            )}

          </form>

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
