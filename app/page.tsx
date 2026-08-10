"use client";

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
  FolderLock
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const handlePortalNavigate = (route: string) => {
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 pointer-events-none z-0" 
        style={{ backgroundImage: "url('/eduportal_bg.png')" }}
      />

      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[400px] right-1/4 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* ── HEADER NAVIGATION ──────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/85 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">EduPortal</span>
              <span className="text-xs block text-slate-400 font-medium">Enterprise Management</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-indigo-400 transition-colors">Platform Features</a>
            <a href="#portals" className="hover:text-indigo-400 transition-colors">Access Portals</a>
            <a href="#security" className="hover:text-indigo-400 transition-colors">Security & SLA</a>
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="mailto:support@eduportal.com" 
              className="text-sm font-semibold text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Support</span>
            </a>
            <a 
              href="#portals" 
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Access Portals
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ───────────────────────────────────── */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide mb-6">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>Next-Gen Academic ERP Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
            College Management <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">System</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-3xl leading-relaxed font-medium">
            A unified, modern enterprise governance and learning platform for academic administration, departmental coordination, and interactive student engagement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full sm:w-auto">
            <a 
              href="#portals" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all gap-2"
            >
              <span>Select Login Portal</span>
              <ArrowRight className="h-5 w-5" />
            </a>
            <a 
              href="#features" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all border border-slate-700/60"
            >
              Explore Features
            </a>
          </div>

          {/* Quick trust metrics */}
          <div className="grid grid-cols-3 gap-8 sm:gap-12 pt-8 border-t border-slate-800/80 w-full max-w-2xl justify-center">
            <div>
              <span className="block text-2xl sm:text-3xl font-extrabold text-white">99.9%</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mt-1">Uptime SLA</span>
            </div>
            <div className="border-x border-slate-800/80 px-4 sm:px-8">
              <span className="block text-2xl sm:text-3xl font-extrabold text-white">256-bit</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mt-1">Encryption</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-extrabold text-white">Multi-Role</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mt-1">Access Control</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── PORTALS LOGIN SECTION ───────────────────────────── */}
      <section id="portals" className="bg-slate-900/60 border-y border-slate-800 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Select Your Access Portal
            </h2>
            <p className="mt-4 text-lg text-slate-400 font-medium">
              Choose your role below to log in to your specialized dashboard workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Principal Login */}
            <div className="flex flex-col bg-gradient-to-b from-slate-800 to-slate-850 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden hover:border-indigo-500/60 hover:shadow-indigo-500/5 transition-all duration-300 group">
              <div className="p-8 flex-grow">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white text-indigo-400 transition-colors">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Principal Login</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Executive institutional control. Access college metrics, approval queues, staff allocation, and compliance reports.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <ChevronRight className="h-4.5 w-4.5 text-indigo-400" />
                    <span>Global College Settings</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <ChevronRight className="h-4.5 w-4.5 text-indigo-400" />
                    <span>HOD & Coordinator Management</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <ChevronRight className="h-4.5 w-4.5 text-indigo-400" />
                    <span>Auditing & Video Approvals</span>
                  </div>
                </div>
              </div>
              <div className="px-8 pb-8">
                <button
                  onClick={() => handlePortalNavigate("/principal/login")}
                  className="w-full inline-flex items-center justify-center px-5 py-3 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-md group-hover:shadow-indigo-600/10 gap-1.5"
                >
                  <span>Access Principal Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Card 2: HOD Login */}
            <div className="flex flex-col bg-gradient-to-b from-slate-800 to-slate-850 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden hover:border-purple-500/60 hover:shadow-purple-500/5 transition-all duration-300 group">
              <div className="p-8 flex-grow">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white text-purple-400 transition-colors">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">HOD Login</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Departmental syllabus tracking, academic resource coordination, and review queue audit parameters.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <ChevronRight className="h-4.5 w-4.5 text-purple-400" />
                    <span>Departmental Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <ChevronRight className="h-4.5 w-4.5 text-purple-400" />
                    <span>Video Lectures Queue Review</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <ChevronRight className="h-4.5 w-4.5 text-purple-400" />
                    <span>Attendance & Engagement Reports</span>
                  </div>
                </div>
              </div>
              <div className="px-8 pb-8">
                <button
                  onClick={() => handlePortalNavigate("/hod/login")}
                  className="w-full inline-flex items-center justify-center px-5 py-3 text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-md group-hover:shadow-purple-600/10 gap-1.5"
                >
                  <span>Access HOD Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Card 3: Student Login */}
            <div className="flex flex-col bg-gradient-to-b from-slate-800 to-slate-850 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden hover:border-emerald-500/60 hover:shadow-emerald-500/5 transition-all duration-300 group">
              <div className="p-8 flex-grow">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white text-emerald-400 transition-colors">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Student Login</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Access digital learning, video repositories, re-watch logs, progress tracking, and academic details.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <ChevronRight className="h-4.5 w-4.5 text-emerald-400" />
                    <span>Video Catalog & Library</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <ChevronRight className="h-4.5 w-4.5 text-emerald-400" />
                    <span>Watch Progress & Log History</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <ChevronRight className="h-4.5 w-4.5 text-emerald-400" />
                    <span>Active Doubts Forum</span>
                  </div>
                </div>
              </div>
              <div className="px-8 pb-8">
                <button
                  onClick={() => handlePortalNavigate("/Student/login")}
                  className="w-full inline-flex items-center justify-center px-5 py-3 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-md group-hover:shadow-emerald-600/10 gap-1.5"
                >
                  <span>Access Student Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── FEATURES SECTION ────────────────────────────────── */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest block mb-3">Comprehensive Coverage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Integrated Features for Higher Education
          </h2>
          <p className="mt-4 text-lg text-slate-400 font-medium">
            EduPortal provides all critical tools necessary to administer and streamline academic activities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature 1: College management */}
          <div className="bg-slate-800/40 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl transition-all shadow-md">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-5">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">College Administration</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Define college profiles, manage streams, verify settings, and oversee overall executive operational status.
            </p>
          </div>

          {/* Feature 2: Department management */}
          <div className="bg-slate-800/40 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl transition-all shadow-md">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-5">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Department Structure</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Create academic departments, assign specific HOD access accounts, and configure tailored curricula and metrics.
            </p>
          </div>

          {/* Feature 3: Student management */}
          <div className="bg-slate-800/40 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl transition-all shadow-md">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-5">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Student Verification</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Support onboarding queues, manage active status profiles, check academic reports, and approve credentials.
            </p>
          </div>

          {/* Feature 4: Video Catalog */}
          <div className="bg-slate-800/40 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl transition-all shadow-md">
            <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 mb-5">
              <Video className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Video Catalog & Approvals</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Process video lecture uploads with multi-step review stages. Monitor status, catalog playlists, and verify metadata.
            </p>
          </div>

          {/* Feature 5: Analytics */}
          <div className="bg-slate-800/40 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl transition-all shadow-md">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-5">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Visual Analytics Dashboard</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Access real-time weekly charts, monthly engagement rates, and college comparison donut distribution diagrams.
            </p>
          </div>

          {/* Feature 6: Security */}
          <div className="bg-slate-800/40 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl transition-all shadow-md">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-5">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Enterprise Security</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Role-based session locks, encrypted credentials, CSRF cross-origin cookies protection, and rate limiting controls.
            </p>
          </div>

        </div>
      </section>

      {/* ── SECURITY / TRUST BAR ───────────────────────────── */}
      <section id="security" className="py-16 bg-slate-950 border-t border-slate-800/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 mb-4 text-indigo-400 shadow-md">
              <FolderLock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">High Availability & Data Protection</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              EduPortal safeguards critical academic information through automatic data replication, 256-bit encryption standards, and active network threat defense systems.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* Branding Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-wide">EduPortal</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                EduPortal provides higher education institutions with a modern, integrated cloud platform to coordinate administration and video-based learning.
              </p>
            </div>

            {/* Links Column */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400 font-semibold">
                <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
                <li><a href="#portals" className="hover:text-indigo-400 transition-colors">Select Portal</a></li>
                <li><a href="#security" className="hover:text-indigo-400 transition-colors">Security & SLA</a></li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Support & Contact</h4>
              <ul className="space-y-2 text-sm text-slate-400 font-semibold">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-indigo-400" />
                  <a href="mailto:support@eduportal.com" className="hover:text-indigo-400 transition-colors">support@eduportal.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-400" />
                  <a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
            <p>&copy; 2026 EduPortal College Management System. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}