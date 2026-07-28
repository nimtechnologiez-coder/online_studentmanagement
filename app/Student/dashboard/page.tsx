"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Video,
  CheckCircle2,
  Clock,
  Play,
  Bell,
  Search,
  ChevronDown,
  User,
  BookOpen,
  Calendar,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

const GRADIENTS = [
  "from-slate-900 via-blue-950 to-slate-900",
  "from-slate-900 via-indigo-950 to-slate-900",
  "from-slate-900 via-slate-800 to-slate-900",
  "from-slate-900 via-purple-950 to-slate-900",
  "from-slate-900 via-cyan-950 to-slate-900",
  "from-slate-900 via-teal-950 to-slate-900",
];

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const saved =
        typeof window !== "undefined"
          ? localStorage.getItem("student") || sessionStorage.getItem("student")
          : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        setStudent(parsed);
        fetchDashboardData(parsed.id);
      } else {
        // If not logged in yet, try fetching default or clear loading
        fetchDashboardData(0);
      }
    } catch (e) {
      console.error("Failed to parse student data:", e);
      setLoading(false);
    }
  }, []);

  async function fetchDashboardData(studentId: number) {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://127.0.0.1:8000/api/student/dashboard/", {
        headers: { "X-Student-Id": String(studentId) },
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        if (data.student) {
          setStudent((prev: any) => (prev ? { ...prev, ...data.student } : data.student));
        }
        setStats(data.stats);
        setContinueWatching(data.continueWatching || []);
        setRecentlyAdded(data.recentlyAdded || []);
        setError("");
      } else {
        setError(data.message || "Failed to load dashboard data.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      title: "Total Videos",
      value: stats ? String(stats.totalVideos) : "—",
      change: "All available",
      icon: Video,
      color: "bg-blue-600",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Completed",
      value: stats ? String(stats.completed) : "—",
      change: stats
        ? `${Math.round((stats.completed / (stats.totalVideos || 1)) * 100)}% finished`
        : "—",
      icon: CheckCircle2,
      color: "bg-emerald-600",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Pending",
      value: stats ? String(stats.pending) : "—",
      change: stats ? `${stats.pending} videos left` : "—",
      icon: Clock,
      color: "bg-amber-500",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      title: "Watch Hrs",
      value: stats ? stats.watchHours : "—",
      change: "Total watched",
      icon: Play,
      color: "bg-indigo-600",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
  ];

  const studentInitials =
    typeof student?.full_name === "string" && student.full_name.trim()
      ? student.full_name
          .trim()
          .split(/\s+/)
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "ST";

  const completionPct =
    stats && stats.totalVideos > 0
      ? Math.round((stats.completed / stats.totalVideos) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">

      {/* Top Navbar Header */}
      <header className="bg-white rounded-2xl p-4 sm:px-6 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shadow-md shadow-blue-500/20">
            SP
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 leading-none">Student Enterprise Portal</h2>
            <p className="text-xs text-slate-500 mt-1">
              {student?.department ? `${student.department} Department` : "Loading department..."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          <div className="relative hidden md:block w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search course videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  window.location.href = `/Student/MyVideos?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <button className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
          </button>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {studentInitials}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                {student?.full_name || "Student User"} <ChevronDown size={14} className="text-slate-400" />
              </div>
              <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck size={12} /> {student?.student_id ? `ID: ${student.student_id}` : "Verified Student"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium">
          <AlertCircle size={18} className="flex-shrink-0" />
          {error}
          <button
            onClick={() => student && fetchDashboardData(student.id)}
            className="ml-auto text-xs font-bold bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="text-sm font-medium">Loading your dashboard...</span>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Hero Welcome Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 border border-slate-800">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
                <Sparkles size={14} /> Academic Year 2026
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome Back, {typeof student?.full_name === "string" && student.full_name ? student.full_name.split(" ")[0] : "Student"} 👋
              </h1>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                {stats
                  ? `You have completed ${completionPct}% of your assigned course curriculum. Keep momentum high to finish your pending modules!`
                  : "Your personalized learning dashboard. Start watching to track your progress!"}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/Student/ContinueWatching"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/30 transition"
                >
                  <Play size={16} fill="white" /> Resume Learning
                </Link>
                <Link
                  href="/Student/MyProgress"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-5 py-2.5 rounded-xl font-semibold text-sm transition"
                >
                  View Detailed Analytics
                </Link>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:border-slate-300 transition group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${card.color} w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md shadow-slate-200`}>
                      <Icon size={20} />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                      {card.change}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">{card.value}</h3>
                </div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Progress Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Course Progress</h2>
                    <p className="text-xs text-slate-500">Completion overview</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {completionPct}% done
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Completed", count: stats?.completed ?? 0, total: stats?.totalVideos ?? 0, color: "bg-emerald-500" },
                    { label: "Pending", count: stats?.pending ?? 0, total: stats?.totalVideos ?? 0, color: "bg-amber-500" },
                  ].map((bar, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                        <span className="font-bold text-slate-700">{bar.label}</span>
                        <span>{bar.count} videos</span>
                      </div>
                      <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`${bar.color} h-full rounded-full transition-all duration-700`}
                          style={{ width: bar.total > 0 ? `${Math.round((bar.count / bar.total) * 100)}%` : "0%" }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                  <TrendingUp size={14} /> {stats?.watchHours ?? "0h"} watched
                </span>
                <span>{stats?.totalVideos ?? 0} total videos</span>
              </div>
            </div>

            {/* Continue Watching */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Continue Watching</h2>
                    <p className="text-xs text-slate-500">Resume your active video lectures</p>
                  </div>
                  <Link href="/Student/ContinueWatching" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    View All <ArrowUpRight size={14} />
                  </Link>
                </div>

                {continueWatching.filter((v: any) =>
                  !searchQuery || v.title?.toLowerCase().includes(searchQuery.toLowerCase()) || v.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
                    <Video size={32} className="opacity-40" />
                    <p className="text-sm font-medium">{searchQuery ? `No results for "${searchQuery}"` : "No watch history yet"}</p>
                    <p className="text-xs">{searchQuery ? "Try a different keyword" : "Start watching a video to track your progress!"}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {continueWatching.filter((v: any) =>
                      !searchQuery || v.title?.toLowerCase().includes(searchQuery.toLowerCase()) || v.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((item: any, idx: number) => (
                      <div
                        key={item.id || idx}
                        className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between"
                      >
                        <div>
                          <div className={`h-24 rounded-lg bg-gradient-to-r ${GRADIENTS[idx % GRADIENTS.length]} p-3 flex flex-col justify-between text-white mb-3 shadow-inner`}>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full w-fit">
                              {item.badge}
                            </span>
                            <Play size={20} fill="white" className="self-center opacity-80 hover:opacity-100 transition" />
                          </div>
                          <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{item.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.subtitle}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-2">
                          <div className="flex justify-between text-xs font-semibold text-slate-600">
                            <span>Completion</span>
                            <span className="text-blue-600">{item.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full"
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                          <Link
                            href="/Student/ContinueWatching"
                            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                          >
                            <Play size={12} fill="white" /> Resume
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Grid: Recently Added Videos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-base font-bold text-slate-800">Recently Added Videos</h2>
              <Link href="/Student/MyVideos" className="text-xs font-semibold text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            <p className="text-xs text-slate-500 mb-4">New video lectures uploaded by faculty</p>

            {recentlyAdded.filter((vid: any) =>
              !searchQuery || vid.title?.toLowerCase().includes(searchQuery.toLowerCase()) || vid.category?.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                <BookOpen size={28} className="opacity-40" />
                <p className="text-sm font-medium">{searchQuery ? `No results for "${searchQuery}"` : "No videos available yet"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentlyAdded.filter((vid: any) =>
                  !searchQuery || vid.title?.toLowerCase().includes(searchQuery.toLowerCase()) || vid.category?.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((vid: any, idx: number) => (
                  <div
                    key={vid.id || idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <Video size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-1">{vid.title}</h4>
                        <span className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{vid.category}</span>
                          <span>•</span>
                          <span>{vid.duration}</span>
                          <span>•</span>
                          <span>{vid.date}</span>
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/Student/MyVideos"
                      className="flex items-center gap-1 text-xs font-semibold bg-slate-900 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition ml-2 flex-shrink-0"
                    >
                      <Play size={12} fill="white" /> Watch
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
