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
  ShieldAlert,
  Play,
  Layers,
  Activity,
  FileCheck,
  CheckCircle2,
  Settings,
  HelpCircle,
  FolderOpen,
  PieChart,
  Calendar,
  Layers3,
  ChevronRight,
  Sparkles,
  BookOpen,
  Check,
  Landmark
} from "lucide-react";
import "./LandingPage.css";

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Clear storage on landing page mount
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
    // Scroll detection for navbar
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

  useEffect(() => {
    // Force light mode on landing page by setting classes on document element
    const html = document.documentElement;
    const hadDark = html.classList.contains("dark");
    html.classList.remove("dark");
    html.classList.add("light");
    html.classList.add("light-page");

    return () => {
      html.classList.remove("light-page");
      if (hadDark) {
        html.classList.add("dark");
        html.classList.remove("light");
      }
    };
  }, []);

  const handlePortalNavigate = (route: string) => {
    router.push(route);
  };

  const handleScrollToPortals = (e: React.MouseEvent) => {
    e.preventDefault();
    const portalsSec = document.getElementById("portals");
    if (portalsSec) {
      portalsSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans antialiased relative overflow-x-hidden">

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav className={`h-[76px] flex items-center border-b sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-[#0B1220]/95 backdrop-blur-md border-slate-800 shadow-md"
          : "bg-transparent border-white/10"
        }`}>
        <div className="saas-container w-full flex items-center justify-between">

          {/* Logo & Brand with increased spacing */}
          <div className="flex items-center gap-2 sm:gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="h-9 w-9 rounded-lg bg-[#D5A63F] flex items-center justify-center text-white shadow-md shadow-amber-500/10 flex-shrink-0">
              <GraduationCap className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-xs sm:text-[17px] font-black tracking-tight text-white block leading-tight max-w-[150px] sm:max-w-none mb-0.5">
                College Video Management
              </span>
              <span className="text-[9px] text-slate-300 font-extrabold tracking-widest uppercase hidden sm:block leading-none">
                Learn • Engage • Perform
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <a href="#home" className="text-[#D5A63F] nav-active-line-gold transition-colors">Home</a>
            <a href="#portals" className="hover:text-[#D5A63F] transition-colors">Portals</a>
          </nav>

          {/* Right Action Button (Clean Rounded Gold Enterprise SaaS) */}
          <button
            onClick={handleScrollToPortals}
            className="inline-flex items-center justify-center px-3 py-2 sm:px-6 sm:py-2.5 text-[10px] sm:text-xs font-black text-[#0B1220] bg-gradient-to-r from-[#D5A63F] to-[#C5A059] hover:from-[#c29634] hover:to-[#b28d48] rounded-full transition-all cursor-pointer shadow-md shadow-amber-500/10 gap-1 flex-shrink-0"
          >
            <span>Enter <span className="hidden sm:inline">Platform</span> →</span>
          </button>

        </div>
      </nav>

      {/* ── HERO SECTION ───────────────────────────────────── */}
      <section id="home" className="college-hero-section">
        <div className="college-hero-overlay" />

        <div className="college-hero-grid">
          <div className="college-hero-content">

            {/* Eyebrow Label with dot and gold borders */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-extrabold bg-[#D5A63F]/8 text-[#D5A63F] tracking-wider uppercase mb-6 border border-[#D5A63F]/35">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D5A63F]" />
              <span>SMARTER ACADEMICS. STRONGER TOMORROW.</span>
            </div>

            {/* Elegant Typography Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-medium tracking-wide text-white mb-6 leading-snug">
              One Platform.<br />
              Every <span className="text-[#D5A63F] font-bold">Academic Journey.</span>
            </h1>

            {/* Wider supporting paragraph */}
            <p className="text-sm text-slate-300 mb-8 leading-relaxed font-medium max-w-2xl">
              College-wide video learning, academic engagement, and performance management in one connected platform.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 w-full sm:w-auto">
              <button
                onClick={handleScrollToPortals}
                className="btn-gold-primary text-xs cursor-pointer shadow-lg rounded-full"
              >
                Explore Our Portals →
              </button>
              <a
                href="#portals"
                className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold text-white border border-white/20 hover:border-white/40 bg-transparent rounded-full transition-all"
              >
                Learn More
              </a>
            </div>

            {/* Subtle Horizontal Divider */}
            <div className="w-full h-[1px] bg-slate-800/60 my-6" />

            {/* 3 Horizontal Highlights Dark Glass Panels */}
            <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-4 w-full snap-x snap-mandatory scrollbar-none pb-2 md:pb-0">

              <div className="highlight-glass-panel flex items-start gap-3 min-w-[270px] md:min-w-0 flex-shrink-0 snap-start">
                <div className="h-7 w-7 rounded-lg bg-amber-50/10 text-[#D5A63F] flex items-center justify-center flex-shrink-0 border border-[#D5A63F]/20">
                  <Video className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-wide mb-0.5">01 — Unified Video Platform</h4>
                  <p className="text-[9px] text-slate-400 font-bold leading-tight">One connected academic ecosystem</p>
                </div>
              </div>

              <div className="highlight-glass-panel flex items-start gap-3 min-w-[270px] md:min-w-0 flex-shrink-0 snap-start">
                <div className="h-7 w-7 rounded-lg bg-amber-50/10 text-[#D5A63F] flex items-center justify-center flex-shrink-0 border border-[#D5A63F]/20">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-wide mb-0.5">02 — Better Engagement</h4>
                  <p className="text-[9px] text-slate-400 font-bold leading-tight">Track meaningful learning activity</p>
                </div>
              </div>

              <div className="highlight-glass-panel flex items-start gap-3 min-w-[270px] md:min-w-0 flex-shrink-0 snap-start">
                <div className="h-7 w-7 rounded-lg bg-amber-50/10 text-[#D5A63F] flex items-center justify-center flex-shrink-0 border border-[#D5A63F]/20">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-wide mb-0.5">03 — Stronger Outcomes</h4>
                  <p className="text-[9px] text-slate-400 font-bold leading-tight">Turn activity into useful insights</p>
                </div>
              </div>

            </div>

          </div>
          <div className="college-hero-space" />
        </div>
      </section>

      {/* ── PORTALS SECTION ────────────────────────────────── */}
      <section id="portals" className="pt-10 pb-24 bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="saas-container relative z-10">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-extrabold bg-[#D5A63F]/10 text-[#D5A63F] tracking-widest uppercase mb-4 border border-[#D5A63F]/20">
              OUR PORTALS
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B1220] tracking-tight mb-4">
              Three Portals. <span className="text-[#D5A63F]">One Connected Ecosystem.</span>
            </h2>
            <p className="text-sm text-[#64748B] font-semibold">
              Built for a smarter, more transparent, and more engaged academic environment.
            </p>
            {/* Gold horizontal divider */}
            <div className="w-12 h-[2px] bg-[#D5A63F] mx-auto mt-6" />
          </div>

          {/* Three Workspace Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Card 01: Principal Workspace (Gold theme) */}
            <div className="saas-card flex flex-col gap-4">
              {/* Card Header */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#D5A63F] bg-[#D5A63F]/10 px-3 py-1 rounded-lg">01</span>
                <span className="text-[9px] font-extrabold text-[#D5A63F] bg-amber-50 px-2.5 py-1 rounded-md border border-[#D5A63F]/20 uppercase tracking-wider">Leadership Portal</span>
              </div>

              {/* Large Icon + Title Row */}
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#F5E6CC] to-[#EAD2A8]/50 text-[#D5A63F] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#D5A63F]/10">
                  <Landmark className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-widest text-[#B45309] block uppercase mb-1">BEST FOR INSTITUTION LEADERS</span>
                  <h3 className="text-xl font-black text-[#0B1220] leading-tight">Principal Workspace</h3>
                </div>
              </div>

              <p className="text-[13px] text-[#64748B] font-semibold leading-relaxed">
                Gain institution-wide visibility across colleges, departments, students, approvals, compliance, and academic performance.
              </p>

              {/* Features Checklist */}
              <div className="portal-checklist">
                {[
                  "College-wide academic overview",
                  "Principal & HOD performance",
                  "Video engagement analytics",
                  "Reports & decision insights"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full bg-amber-50 text-[#D5A63F] flex items-center justify-center border border-[#D5A63F]/10 flex-shrink-0">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                    <span className="text-[13px] text-slate-700 font-bold">{item}</span>
                  </div>
                ))}
              </div>

              {/* Login Button */}
              <div className="portal-button-wrap">
                <button
                  onClick={() => handlePortalNavigate("/principal/login")}
                  className="w-full inline-flex items-center justify-center px-4 py-4 text-xs font-bold text-[#0B1220] bg-gradient-to-r from-[#D5A63F] to-[#C5A059] hover:from-[#c29634] hover:to-[#b28d48] rounded-lg transition-all shadow-md shadow-amber-500/10 gap-1.5 cursor-pointer"
                >
                  Login as Principal →
                </button>
              </div>
            </div>

            {/* Card 02: HOD Workspace (Amber Theme) */}
            <div className="saas-card active flex flex-col gap-4">
              {/* Card Header */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-amber-700 bg-amber-600/10 px-3 py-1 rounded-lg">02</span>
                <span className="text-[9px] font-extrabold text-amber-700 bg-orange-50 px-2.5 py-1 rounded-md border border-amber-600/20 uppercase tracking-wider">Department Portal</span>
              </div>

              {/* Large Icon + Title Row */}
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#F5D5C6] to-[#EAC2AE]/50 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-sm border border-amber-600/10">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-widest text-[#B45309] block uppercase mb-1">BEST FOR DEPARTMENT MANAGEMENT</span>
                  <h3 className="text-xl font-black text-[#0B1220] leading-tight">HOD Workspace</h3>
                </div>
              </div>

              <p className="text-[13px] text-[#64748B] font-semibold leading-relaxed">
                Coordinate departmental resources, monitor academic engagement, review learning content, and track departmental performance.
              </p>

              {/* Features Checklist */}
              <div className="portal-checklist">
                {[
                  "Department performance",
                  "Faculty video management",
                  "Student engagement tracking",
                  "Department-level reports"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full bg-orange-50 text-amber-700 flex items-center justify-center border border-amber-600/10 flex-shrink-0">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                    <span className="text-[13px] text-slate-700 font-bold">{item}</span>
                  </div>
                ))}
              </div>

              {/* Login Button */}
              <div className="portal-button-wrap">
                <button
                  onClick={() => handlePortalNavigate("/hod/login")}
                  className="w-full inline-flex items-center justify-center px-4 py-4 text-xs font-bold text-white bg-gradient-to-r from-[#B45309] to-[#92400E] hover:from-amber-700 hover:to-amber-800 rounded-lg transition-all shadow-md shadow-amber-500/10 gap-1.5 cursor-pointer"
                >
                  Login as HOD →
                </button>
              </div>
            </div>

            {/* Card 03: Student Workspace (Champagne Gold Theme) */}
            <div className="saas-card flex flex-col gap-4">
              {/* Card Header */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-yellow-600 bg-yellow-500/10 px-3 py-1 rounded-lg">03</span>
                <span className="text-[9px] font-extrabold text-[#C5A059] bg-yellow-50 px-2.5 py-1 rounded-md border border-[#C5A059]/20 uppercase tracking-wider">Learning Portal</span>
              </div>

              {/* Large Icon + Title Row */}
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#FAF5D5] to-[#EAE2C2]/50 text-yellow-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-yellow-500/10">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-widest text-[#B45309] block uppercase mb-1">BEST FOR STUDENT LEARNING</span>
                  <h3 className="text-xl font-black text-[#0B1220] leading-tight">Student Workspace</h3>
                </div>
              </div>

              <p className="text-[13px] text-[#64748B] font-semibold leading-relaxed">
                Give students a personalized learning workspace for video learning, progress tracking, academic information, and engagement.
              </p>

              {/* Features Checklist */}
              <div className="portal-checklist">
                {[
                  "Personal video library",
                  "Watch & resume learning",
                  "Learning activity history",
                  "Progress-focused experience"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center border border-yellow-500/10 flex-shrink-0">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                    <span className="text-[13px] text-slate-700 font-bold">{item}</span>
                  </div>
                ))}
              </div>

              {/* Login Button */}
              <div className="portal-button-wrap">
                <button
                  onClick={() => handlePortalNavigate("/Student/login")}
                  className="w-full inline-flex items-center justify-center px-4 py-4 text-xs font-bold text-[#0B1220] bg-gradient-to-r from-[#C5A059] to-[#A8853D] hover:from-[#b28d48] hover:to-[#916515] rounded-lg transition-all shadow-md shadow-amber-500/10 gap-1.5 cursor-pointer"
                >
                  Login as Student →
                </button>
              </div>
            </div>

          </div>

        </div>

        <div className="absolute -bottom-10 -left-10 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-[#D5A63F]/25 to-transparent blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-10 -right-10 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-[#C5A059]/30 to-transparent blur-3xl pointer-events-none z-0" />
      </section>

      {/* ── FINAL CTA SECTION ──────────────────────────────── */}
      <section className="bg-[#0B1220] text-white py-24 relative text-center gradient-wave-bg-gold bg-[url('/hero_clean_premium.png')] bg-cover bg-center bg-no-repeat overflow-hidden">
        {/* Dark Navy Blend Overlays to make text pop */}
        <div className="absolute inset-0 bg-[#0B1220]/80 z-0 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/45 via-transparent to-[#0B1220]/75 z-0" />

        <div className="saas-container relative z-10">

          <span className="text-[10px] font-black tracking-widest text-[#D5A63F] uppercase block mb-4">
            EDUPORTAL
          </span>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-white leading-tight">
            Your Institution. <span className="text-[#D5A63F]">One Connected Platform.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Bring administration, academic operations, learning, and analytics together with EduPortal.
          </p>

          <button
            onClick={() => handlePortalNavigate("/Student/login")}
            className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-bold bg-white text-[#0B1220] hover:bg-slate-100 rounded-full transition-all shadow-lg cursor-pointer"
          >
            Enter the Platform →
          </button>

        </div>
      </section>

      {/* ── FOOTER (Dark Footer Style) ─────────────────────── */}
      <footer id="footer" className="bg-[#0B1220] py-16 border-t border-slate-900 text-xs text-slate-400">
        <div className="saas-container">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-900 mb-8">

            {/* Left Col Logo info (Col 5) */}
            <div className="md:col-span-5 flex flex-col items-start gap-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#D5A63F] flex items-center justify-center text-white shadow-md shadow-amber-500/10">
                  <GraduationCap className="h-5.5 w-5.5" />
                </div>
                <span className="text-base font-extrabold text-white tracking-tight">College Video Management</span>
              </div>
              <p className="text-xs font-semibold leading-relaxed max-w-sm text-slate-400">
                Empowering Education Through Technology. Unifying compliance catalog releases and student progress metrics.
              </p>
            </div>

            {/* Right Col Links (Col 7) */}
            <div className="md:col-span-7 flex justify-end gap-16 font-bold uppercase tracking-wider text-[10px] text-slate-400">
              <div className="flex flex-col gap-3">
                <a href="#home" className="hover:text-[#D5A63F] transition-colors">About</a>
                <a href="#portals" className="hover:text-[#D5A63F] transition-colors">Features</a>
              </div>
              <div className="flex flex-col gap-3">
                <a href="#footer" className="hover:text-[#D5A63F] transition-colors">Contact</a>
                <a href="#footer" className="hover:text-[#D5A63F] transition-colors">Help</a>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-semibold text-[11px] text-slate-500">
            <p>&copy; 2025 College Video Management. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:underline">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}