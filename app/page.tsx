"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Building2,
  Users,
  Video,
  BarChart3,
  ArrowRight,
  Shield,
  BookOpen,
  ChevronRight,
  Mail,
  HelpCircle,
  FolderLock,
  CheckCircle2,
  Lock,
  Server,
  Zap,
  Play,
  Sparkles,
  Layers,
  Globe,
  Activity,
  FileCheck,
  Eye,
  TrendingUp,
  KeyRound,
  ShieldCheck,
  Clock,
  Check,
  PieChart as PieChartIcon,
  MousePointerClick,
  ChevronDown
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [activePortalTab, setActivePortalTab] = useState<"all" | "principal" | "hod" | "student">("all");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const keysToClear = [
        "student",
        "hod",
        "principal",
        "user",
        "student_watch_later",
        "student_favorites",
        "hod_dash_cache",
        "principal_dash_cache"
      ];
      keysToClear.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePortalNavigate = (route: string) => {
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[500px] right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[1800px] left-10 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[3200px] right-10 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* ── STICKY NAVIGATION BAR ──────────────────────────── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "backdrop-blur-xl bg-[#070913]/85 border-b border-slate-800/80 shadow-2xl shadow-black/50 py-3.5" 
          : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                EduPortal
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Enterprise</span>
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#platform" className="hover:text-indigo-400 transition-colors">Platform</a>
            <a href="#portals" className="hover:text-indigo-400 transition-colors">Solutions</a>
            <a href="#analytics" className="hover:text-indigo-400 transition-colors">Analytics</a>
            <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
            <a href="#security" className="hover:text-indigo-400 transition-colors">Security</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4">
            <a 
              href="#portals" 
              className="hidden sm:inline-flex text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </a>
            <a 
              href="#portals" 
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-600/25 border border-indigo-400/30 hover:shadow-indigo-500/35 transition-all gap-2"
            >
              <span>Access Portal</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

        </div>
      </header>

      {/* ── HERO SECTION ───────────────────────────────────── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>The Operating System for Modern Higher Education</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
              One Intelligent Platform for Every Layer of{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Academic Governance.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg text-slate-300 mb-8 leading-relaxed font-normal max-w-2xl">
              EduPortal unifies institutional administration, department operations, student learning, video governance, analytics, and engagement into one secure enterprise platform.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12 w-full sm:w-auto">
              <a 
                href="#portals" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl shadow-xl shadow-indigo-600/30 transition-all border border-indigo-400/30 gap-2 hover:translate-y-[-2px]"
              >
                <span>Access Your Portal</span>
                <ArrowRight className="h-5 w-5" />
              </a>
              <a 
                href="#platform" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-2xl transition-all border border-slate-700/80 hover:border-slate-600 hover:translate-y-[-2px]"
              >
                Explore Platform
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-slate-800/80 w-full">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-white">99.9% Availability</span>
                  <span className="text-xs text-slate-400">Target Uptime SLA</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-white">256-bit Encryption</span>
                  <span className="text-xs text-slate-400">Data Protection</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-white">Role-Based Access</span>
                  <span className="text-xs text-slate-400">Strict Governance</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Dashboard Visualization */}
          <div className="lg:col-span-5 relative">
            
            {/* Ambient Radial Glow Behind Dashboard */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 via-blue-500/20 to-purple-600/30 rounded-3xl blur-[80px] pointer-events-none" />

            {/* Layered Abstract Enterprise Dashboard Card */}
            <div className="relative bg-[#0d1322]/90 backdrop-blur-xl border border-slate-700/70 rounded-3xl p-6 shadow-2xl shadow-indigo-950/80">
              
              {/* Top Bar Mockup Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-md border border-slate-700/60 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                  <span>EduPortal Command Center</span>
                </div>
              </div>

              {/* KPI Mini Row */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-medium">
                    <span>Total Students</span>
                    <Users className="h-3.5 w-3.5 text-indigo-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white">12,840</div>
                  <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +14.2% this year
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-medium">
                    <span>Active Departments</span>
                    <Building2 className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white">14 Active</div>
                  <div className="text-[11px] font-semibold text-indigo-300 mt-1">
                    100% Operational
                  </div>
                </div>
              </div>

              {/* Mini Chart Mockup */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-3">
                  <span>Student Engagement & Video Watch Activity</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">Real-Time</span>
                </div>
                {/* SVG Curve Mockup */}
                <div className="h-28 w-full relative flex items-end pt-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
                    <defs>
                      <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 65 Q 50 55, 100 60 T 200 35 T 300 15 L 300 80 L 0 80 Z"
                      fill="url(#heroGrad)"
                    />
                    <path
                      d="M0 65 Q 50 55, 100 60 T 200 35 T 300 15"
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="3"
                    />
                    <circle cx="300" cy="15" r="5" fill="#a5b4fc" stroke="#4f46e5" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Status List Mockup */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-slate-800/60 border border-slate-700/40 rounded-xl text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="h-6 w-6 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-slate-200 font-medium truncate max-w-[180px]">Lecture Video Review Approved</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Just now</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-800/60 border border-slate-700/40 rounded-xl text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="h-6 w-6 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                      <Video className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-slate-200 font-medium truncate max-w-[180px]">CSE Dept Published New Video</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">5m ago</span>
                </div>
              </div>

              {/* Floating Metric Badge Overlay */}
              <div className="absolute -bottom-5 -left-5 bg-[#121a2d] border border-indigo-500/30 rounded-2xl p-3.5 shadow-xl flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">+18.4% Engagement</div>
                  <div className="text-[11px] text-slate-400">Institutional Momentum</div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── TRUST / INSTITUTIONAL STRIP ───────────────────── */}
      <section className="bg-[#0b0e1b] border-y border-slate-800/80 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              Built for Institutions That Operate at Scale
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-1">
                01
              </div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Unified Institutional Platform
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-1">
                04
              </div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Administrative Roles
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-1">
                99.9%
              </div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Availability Target
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-1">
                360°
              </div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Academic Visibility
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── ACCESS PORTALS SECTION ──────────────────────────── */}
      <section id="portals" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4">
            Role-Based Enterprise Workspaces
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            One Platform. Every Role.
          </h2>
          <p className="text-lg text-slate-300 font-normal">
            Purpose-built workspaces for institutional leaders, academic departments, and students.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Principal Workspace */}
          <div className="group flex flex-col bg-[#0d1322] rounded-3xl border border-slate-700/70 p-8 shadow-xl hover:border-indigo-500/80 hover:shadow-2xl hover:shadow-indigo-950/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
            
            <div className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">
              01 — EXECUTIVE CONTROL
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-between">
              <span>Principal Portal</span>
              <Building2 className="h-6 w-6 text-indigo-400" />
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Gain institution-wide visibility across colleges, departments, students, approvals, compliance, and academic performance.
            </p>

            {/* Feature Bullet List */}
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                <span>Institutional Analytics</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                <span>HOD & Coordinator Management</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                <span>Approval Workflows</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                <span>Compliance & Audit Visibility</span>
              </li>
            </ul>

            {/* Miniature Dashboard Preview */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 mb-6">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-medium">
                <span>College Governance Overview</span>
                <span className="text-emerald-400 font-semibold">Active</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[85%]" />
              </div>
            </div>

            <button
              onClick={() => handlePortalNavigate("/principal/login")}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/25 transition-all gap-2 group-hover:translate-x-1"
            >
              <span>Enter Principal Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Card 2: HOD Workspace */}
          <div className="group flex flex-col bg-[#0d1322] rounded-3xl border border-slate-700/70 p-8 shadow-xl hover:border-purple-500/80 hover:shadow-2xl hover:shadow-purple-950/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

            <div className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-3">
              02 — DEPARTMENT OPERATIONS
            </div>

            <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-between">
              <span>HOD Portal</span>
              <Users className="h-6 w-6 text-purple-400" />
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Coordinate departmental resources, monitor academic engagement, review learning content, and track departmental performance.
            </p>

            {/* Feature Bullet List */}
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Department Analytics</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Video Lecture Review</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Attendance & Engagement</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Academic Resource Coordination</span>
              </li>
            </ul>

            {/* Miniature Dashboard Preview */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 mb-6">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-medium">
                <span>Department Syllabus Status</span>
                <span className="text-purple-400 font-semibold">92% Reviewed</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-[92%]" />
              </div>
            </div>

            <button
              onClick={() => handlePortalNavigate("/hod/login")}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-600/25 transition-all gap-2 group-hover:translate-x-1"
            >
              <span>Enter HOD Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Card 3: Student Workspace */}
          <div className="group flex flex-col bg-[#0d1322] rounded-3xl border border-slate-700/70 p-8 shadow-xl hover:border-emerald-500/80 hover:shadow-2xl hover:shadow-emerald-950/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

            <div className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-3">
              03 — DIGITAL LEARNING
            </div>

            <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-between">
              <span>Student Portal</span>
              <BookOpen className="h-6 w-6 text-emerald-400" />
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Give students a personalized learning workspace for video learning, progress tracking, academic information, and engagement.
            </p>

            {/* Feature Bullet List */}
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Video Learning Library</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Watch History & Progress</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Course Playlists</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Academic Resources</span>
              </li>
            </ul>

            {/* Miniature Dashboard Preview */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 mb-6">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-medium">
                <span>Personal Course Completion</span>
                <span className="text-emerald-400 font-semibold">78% Complete</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[78%]" />
              </div>
            </div>

            <button
              onClick={() => handlePortalNavigate("/Student/login")}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/25 transition-all gap-2 group-hover:translate-x-1"
            >
              <span>Enter Student Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>

      </section>

      {/* ── PLATFORM OVERVIEW (SPLIT WORKFLOW LAYOUT) ────────── */}
      <section id="platform" className="bg-[#0b0e1b] border-y border-slate-800/80 py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6">
              <div className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">
                A Single Source of Truth
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                From institutional decisions to student engagement.
              </h2>

              <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed mb-8">
                EduPortal connects the operational layers of higher education into one coordinated platform, giving leadership and academic teams the visibility they need to make faster, better-informed decisions.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Unified Data Architecture</h4>
                    <p className="text-slate-400 text-sm">Eliminate fragmented spreadsheets and isolated software. All governance streams operate on shared real-time data.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Real-Time Operational Pulse</h4>
                    <p className="text-slate-400 text-sm">Monitor student watch sessions, video publishing queues, and departmental metrics live as they happen.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Vertical Workflow Visualization */}
            <div className="lg:col-span-6">
              <div className="bg-[#0d1322] border border-slate-700/70 rounded-3xl p-8 shadow-2xl relative">
                
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center justify-between">
                  <span>Institutional Hierarchy Workflow</span>
                  <span className="text-indigo-400 font-semibold flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> End-to-End Governance
                  </span>
                </div>

                {/* Workflow Nodes */}
                <div className="relative space-y-4">
                  
                  {/* Node 1 */}
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-900/80 border border-indigo-500/30">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">01</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">College Leadership</div>
                      <div className="text-xs text-slate-400">Institutional Strategy & Approval Oversight</div>
                    </div>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full font-semibold">Executive Level</span>
                  </div>

                  <div className="flex justify-center my-1">
                    <div className="h-6 w-0.5 bg-indigo-500/40" />
                  </div>

                  {/* Node 2 */}
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/30">
                    <div className="h-10 w-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">02</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">Academic Departments (HODs)</div>
                      <div className="text-xs text-slate-400">Curriculum Coordination & Resource Management</div>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full font-semibold">Operational Level</span>
                  </div>

                  <div className="flex justify-center my-1">
                    <div className="h-6 w-0.5 bg-purple-500/40" />
                  </div>

                  {/* Node 3 */}
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30">
                    <div className="h-10 w-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">03</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">Students & Educational Content</div>
                      <div className="text-xs text-slate-400">Video Learning Repositories & Engagement</div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-semibold">Learning Level</span>
                  </div>

                  <div className="flex justify-center my-1">
                    <div className="h-6 w-0.5 bg-emerald-500/40" />
                  </div>

                  {/* Node 4 */}
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
                    <div className="h-10 w-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold">04</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">Engagement Analytics & Compliance</div>
                      <div className="text-xs text-slate-400">Continuous Monitoring & Decision Intelligence</div>
                    </div>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full font-semibold">Insight Level</span>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── CORE PLATFORM FEATURES (2x3 GRID) ──────────────── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">
            Institutional Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Everything Your Institution Needs to Operate Smarter
          </h2>
          <p className="text-lg text-slate-300 font-normal">
            A connected platform designed around the real workflows of modern academic institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="group p-8 rounded-3xl bg-[#0d1322] border border-slate-700/60 hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-950/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Governance</div>
              <h3 className="text-xl font-bold text-white mb-3">Institutional Administration</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Manage college profiles, organizational structures, settings, and operational controls from one centralized workspace.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Learn more</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="group p-8 rounded-3xl bg-[#0d1322] border border-slate-700/60 hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-950/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Departments</div>
              <h3 className="text-xl font-bold text-white mb-3">Department Management</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Create departments, assign HODs, configure academic structures, and monitor departmental performance.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>Learn more</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="group p-8 rounded-3xl bg-[#0d1322] border border-slate-700/60 hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-950/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Verification</div>
              <h3 className="text-xl font-bold text-white mb-3">Student Management</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Manage student profiles, academic information, verification workflows, active status, and institutional records.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Learn more</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="group p-8 rounded-3xl bg-[#0d1322] border border-slate-700/60 hover:border-pink-500/60 hover:shadow-xl hover:shadow-pink-950/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-6 border border-pink-500/20 group-hover:scale-110 transition-transform">
                <Video className="h-6 w-6" />
              </div>
              <div className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-2">Content</div>
              <h3 className="text-xl font-bold text-white mb-3">Video Governance</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Control lecture uploads, approvals, metadata, publishing workflows, playlists, and student viewing activity.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-pink-400 group-hover:translate-x-1 transition-transform">
              <span>Learn more</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 5 */}
          <div className="group p-8 rounded-3xl bg-[#0d1322] border border-slate-700/60 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-950/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Intelligence</div>
              <h3 className="text-xl font-bold text-white mb-3">Intelligent Analytics</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Transform institutional activity into actionable insights with real-time KPIs, engagement trends, and comparative analytics.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Learn more</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 6 */}
          <div className="group p-8 rounded-3xl bg-[#0d1322] border border-slate-700/60 hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-950/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Security</div>
              <h3 className="text-xl font-bold text-white mb-3">Enterprise Security</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Protect institutional data with role-based access, secure sessions, encrypted credentials, CSRF protection, and controlled permissions.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Learn more</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

        </div>

      </section>

      {/* ── ANALYTICS SHOWCASE SECTION ─────────────────────── */}
      <section id="analytics" className="bg-[#0b0e1b] border-y border-slate-800/80 py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">
              Institutional Visibility
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              See the Institution. Understand the Momentum.
            </h2>
            <p className="text-lg text-slate-300 font-normal">
              Turn operational data into a clear view of academic performance, student engagement, and institutional activity.
            </p>
          </div>

          {/* Dashboard Analytics Composition */}
          <div className="bg-[#0d1322] border border-slate-700/70 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="text-xs font-semibold text-slate-400 mb-1">Student Engagement</div>
                <div className="text-3xl font-extrabold text-white mb-2">94.7%</div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <TrendingUp className="h-3.5 w-3.5" /> +18.4% this month
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="text-xs font-semibold text-slate-400 mb-1">Active Students</div>
                <div className="text-3xl font-extrabold text-white mb-2">401</div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  <Users className="h-3.5 w-3.5" /> Active This Month
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="text-xs font-semibold text-slate-400 mb-1">Content Completion</div>
                <div className="text-3xl font-extrabold text-white mb-2">94.7%</div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified Completion
                </div>
              </div>

            </div>

            {/* Main Visual Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Weekly Activity Bar Chart Mockup */}
              <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-base font-bold text-white">Monthly Video Watch Activity</h4>
                    <p className="text-xs text-slate-400">Total watch sessions by week</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    This Month
                  </span>
                </div>

                <div className="h-44 w-full flex items-end justify-between gap-4 pt-6">
                  {["W1", "W2", "W3", "W4", "W5"].map((w, i) => {
                    const heights = ["h-[30%]", "h-[85%]", "h-[45%]", "h-[65%]", "h-[50%]"];
                    const isMax = i === 1;
                    return (
                      <div key={w} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div className={`w-full max-w-[48px] rounded-t-xl transition-all ${
                          isMax ? "bg-gradient-to-t from-indigo-600 to-indigo-400" : "bg-slate-800 hover:bg-slate-700"
                        } ${heights[i]}`} />
                        <span className="text-xs font-semibold text-slate-400">{w}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Department Distribution Donut Mockup */}
              <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-bold text-white">Students by Year</h4>
                    <span className="text-xs font-bold text-slate-400">Total: 2 Students</span>
                  </div>
                  <div className="flex items-center justify-center py-4">
                    <div className="h-32 w-32 rounded-full border-[10px] border-indigo-500 border-t-purple-500 border-r-emerald-500 flex items-center justify-center text-center">
                      <div>
                        <div className="text-xl font-extrabold text-white">2</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Students</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <span>III Year: 50%</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                    <span>IV Year: 50%</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── VIDEO LEARNING ECOSYSTEM SECTION ───────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">
            Video Governance Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            From Lecture Upload to Student Learning.
          </h2>
          <p className="text-lg text-slate-300 font-normal">
            Streamlined lecture video management with multi-stage verification and analytics.
          </p>
        </div>

        {/* Horizontal Workflow Steps */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-16">
          {[
            { step: "01", title: "Upload", sub: "HOD / Admin upload" },
            { step: "02", title: "Review", sub: "Quality verification" },
            { step: "03", title: "Approve", sub: "Compliance check" },
            { step: "04", title: "Publish", sub: "Catalog distribution" },
            { step: "05", title: "Watch", sub: "Student video stream" },
            { step: "06", title: "Analyze", sub: "Engagement metrics" }
          ].map((st, idx) => (
            <div key={st.step} className="p-4 rounded-2xl bg-[#0d1322] border border-slate-700/60 text-center relative group hover:border-indigo-500/60 transition-all">
              <div className="text-xs font-bold text-indigo-400 mb-1">{st.step}</div>
              <div className="text-base font-bold text-white mb-1">{st.title}</div>
              <div className="text-[11px] text-slate-400 font-medium">{st.sub}</div>
            </div>
          ))}
        </div>

        {/* Large Video Preview Card */}
        <div className="bg-[#0d1322] border border-slate-700/70 rounded-3xl p-6 sm:p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-700/80">
            {/* Video Thumbnail Placeholder Image */}
            <div className="aspect-video bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center relative">
              <div className="h-16 w-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 group-hover:scale-110 transition-transform">
                <Play className="h-7 w-7 fill-white ml-1" />
              </div>
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-bold text-indigo-300 px-3 py-1 rounded-full">
                Computer Science & Engineering
              </div>
              <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-bold text-white px-2.5 py-1 rounded-md flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-indigo-400" /> 45:20
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full mb-4">
              <CheckCircle2 className="h-3.5 w-3.5" /> Approved & Published
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
              Calculus Fundamentals & Matrix Transformations
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Comprehensive lecture series covering advanced mathematics and operational matrices for engineering students.
            </p>

            <div className="w-full space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">Student Watch Progress</span>
                <span className="text-indigo-400">1,240 Views</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[82%]" />
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ── SECURITY SECTION ───────────────────────────────── */}
      <section id="security" className="bg-[#0b0e1b] border-y border-slate-800/80 py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">
              Enterprise Trust & Safeguards
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Built for Institutional Trust.
            </h2>
            <p className="text-lg text-slate-300 font-normal">
              Academic data demands more than convenience. EduPortal is designed around secure access, controlled permissions, protected sessions, and reliable data handling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">256-bit Encryption</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Data at rest and in transit protected with standard enterprise cryptographic protocols.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Role-Based Access</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Strict principal, HOD, and student permission boundaries across all workspaces.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Secure Sessions</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Protected authentication tokens and controlled session expirations.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center flex-shrink-0">
                <FolderLock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">CSRF Protection</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Cross-Site Request Forgery mitigation on all backend API routes and authentication states.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Rate Limiting</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Network request throttling to safeguard endpoints against brute force attacks.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Audit Visibility</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Operational log records for administrative transparency and institutional oversight.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── EXECUTIVE VALUE SECTION ─────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-[#0d1322] border border-slate-700/60 text-left">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Leadership</div>
            <h3 className="text-2xl font-extrabold text-white mb-3">See the entire institution at a glance.</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Unified dashboards for high-level academic governance, departmental compliance, and institutional decision making.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0d1322] border border-slate-700/60 text-left">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Departments</div>
            <h3 className="text-2xl font-extrabold text-white mb-3">Coordinate academic operations with clarity.</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empower HODs to manage faculty resources, review educational video content, and monitor student engagement seamlessly.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0d1322] border border-slate-700/60 text-left">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Students</div>
            <h3 className="text-2xl font-extrabold text-white mb-3">Learn, engage, and track progress in one place.</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Provide students with a modern digital workspace for video lectures, watch history, and academic information.
            </p>
          </div>

        </div>
      </section>

      {/* ── FINAL CTA SECTION ──────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/80 via-slate-900 to-purple-900/80 border border-indigo-500/30 p-10 sm:p-16 text-center overflow-hidden shadow-2xl">
          
          {/* Ambient Glowing Orb behind CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Your Institution. <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                One Connected Platform.
              </span>
            </h2>

            <p className="text-lg text-slate-300 mb-10 font-normal">
              Bring administration, academic operations, learning, and analytics together with EduPortal.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#portals" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl shadow-xl shadow-indigo-600/30 transition-all border border-indigo-400/30 gap-2"
              >
                <span>Access Your Portal</span>
                <ArrowRight className="h-5 w-5" />
              </a>
              <a 
                href="#platform" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-2xl transition-all border border-slate-700/80"
              >
                Explore the Platform
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="bg-[#04060e] border-t border-slate-800/80 py-16 relative z-10 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            
            {/* Branding Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-white tracking-wide">EduPortal</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Unified governance and learning infrastructure for modern higher education institutions.
              </p>
            </div>

            {/* Column 1: Platform */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Platform</h4>
              <ul className="space-y-2.5 font-medium">
                <li><a href="#platform" className="hover:text-indigo-400 transition-colors">Administration</a></li>
                <li><a href="#platform" className="hover:text-indigo-400 transition-colors">Departments</a></li>
                <li><a href="#platform" className="hover:text-indigo-400 transition-colors">Students</a></li>
                <li><a href="#features" className="hover:text-indigo-400 transition-colors">Video Learning</a></li>
                <li><a href="#analytics" className="hover:text-indigo-400 transition-colors">Analytics</a></li>
              </ul>
            </div>

            {/* Column 2: Solutions */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Solutions</h4>
              <ul className="space-y-2.5 font-medium">
                <li><a href="#portals" className="hover:text-indigo-400 transition-colors">Principal Portal</a></li>
                <li><a href="#portals" className="hover:text-indigo-400 transition-colors">HOD Portal</a></li>
                <li><a href="#portals" className="hover:text-indigo-400 transition-colors">Student Portal</a></li>
                <li><a href="#platform" className="hover:text-indigo-400 transition-colors">Institutional Operations</a></li>
              </ul>
            </div>

            {/* Column 3: Security & Company */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Security & Trust</h4>
              <ul className="space-y-2.5 font-medium">
                <li><a href="#security" className="hover:text-indigo-400 transition-colors">Access Control</a></li>
                <li><a href="#security" className="hover:text-indigo-400 transition-colors">Data Protection</a></li>
                <li><a href="#security" className="hover:text-indigo-400 transition-colors">Secure Sessions</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
            <p>&copy; 2026 EduPortal. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#security" className="hover:text-slate-300 transition-colors">Privacy</a>
              <a href="#security" className="hover:text-slate-300 transition-colors">Terms</a>
              <a href="#security" className="hover:text-slate-300 transition-colors">Security</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}