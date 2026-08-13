"use client";

import { useState, useEffect } from "react";
import { studentFetch } from "../studentFetch";
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
  ShieldCheck,
  Loader2,
  AlertCircle,
  BarChart2,
  Star,
  ChevronRight,
  Code,
  Sigma,
  Cpu,
  Radio,
  UserCheck,
  Bookmark,
  Heart,
  Award
} from "lucide-react";
import "./dashboard.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://online-management-backend.onrender.com";

const CATEGORY_ICONS: Record<string, { icon: any; colorClass: string }> = {
  Mathematics: { icon: Sigma, colorClass: "cat-icon-emerald" },
  Programming: { icon: Code, colorClass: "cat-icon-purple" },
  Physics: { icon: BookOpen, colorClass: "cat-icon-indigo" },
  "Digital Electronics": { icon: Cpu, colorClass: "cat-icon-amber" },
  "Soft Skills": { icon: UserCheck, colorClass: "cat-icon-blue" },
};

const CATEGORY_COLORS: Record<string, string> = {
  Python: "bg-blue-600",
  DSA: "bg-emerald-600",
  DBMS: "bg-purple-600",
  Mathematics: "bg-blue-600",
  Programming: "bg-purple-600",
  "Soft Skills": "bg-sky-500",
  Physics: "bg-indigo-600",
};

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<any[]>([]);
  const [topCategories, setTopCategories] = useState<any[]>([]);
  const [recommendedForYou, setRecommendedForYou] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const saved =
        typeof window !== "undefined"
          ? localStorage.getItem("student") || sessionStorage.getItem("student")
          : null;
      
      let parsedStudent = null;
      if (saved) {
        parsedStudent = JSON.parse(saved);
        setStudent(parsedStudent);
      }

      // Try loading cached dashboard data to render UI immediately
      if (typeof window !== "undefined") {
        const cached = sessionStorage.getItem("student_dash_cache");
        if (cached) {
          try {
            const data = JSON.parse(cached);
            if (data.student) {
              setStudent((prev: any) => (prev ? { ...prev, ...data.student } : data.student));
            }
            setStats(data.stats);
            setContinueWatching(data.continueWatching || []);
            setRecentlyAdded(data.recentlyAdded || []);
            setTopCategories(data.topCategories || []);
            setRecommendedForYou(data.recommendedVideos || []);
            setLoading(false);
          } catch (_) {}
        }
      }

      fetchDashboardData(parsedStudent?.id || 0, !sessionStorage.getItem("student_dash_cache"));
    } catch (e) {
      console.error("Failed to parse student data:", e);
      setLoading(false);
    }
  }, []);

  async function fetchDashboardData(studentId: number, showLoading = true) {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError("");
      const res = await studentFetch("/api/student/dashboard/");
      const data = await res.json();
      if (res.ok && data.status === "success") {
        if (data.student) {
          setStudent((prev: any) => (prev ? { ...prev, ...data.student } : data.student));
        }
        setStats(data.stats);
        setContinueWatching(data.continueWatching || []);
        setRecentlyAdded(data.recentlyAdded || []);
        setTopCategories(data.topCategories || []);
        setRecommendedForYou(data.recommendedVideos || []);
        setError("");

        // Cache the result for instant hydration next time
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("student_dash_cache", JSON.stringify(data));
            // Trigger student sidebar to read updated progress from cache
            window.dispatchEvent(new Event("student_progress_updated"));
          } catch (_) {}
        }
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

  function formatWatchTime(totalSeconds?: number, watchHours?: number) {
    if (totalSeconds !== undefined && totalSeconds !== null && totalSeconds >= 0) {
      if (totalSeconds === 0) return "0m";
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      if (h > 0) {
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
      }
      if (m > 0) {
        return `${m}m`;
      }
      return `${s}s`;
    }
    if (watchHours !== undefined && watchHours !== null) {
      return watchHours > 0 ? `${watchHours}h` : "0m";
    }
    return "0m";
  }

  const completionPct =
    stats?.completionRate !== undefined && stats?.completionRate !== null
      ? stats.completionRate
      : (stats && stats.totalVideos > 0
          ? Math.round((stats.completed / stats.totalVideos) * 100)
          : 0);

  const pendingPct =
    stats && stats.totalVideos > 0
      ? Math.round((stats.pending / stats.totalVideos) * 100)
      : 0;

  const formattedWatchTime = formatWatchTime(stats?.totalWatchSeconds, stats?.watchHours);

  const studentName = typeof student?.full_name === "string" && student.full_name.trim()
    ? student.full_name.trim().split(" ")[0]
    : "Student";

  const studentInitials =
    typeof student?.full_name === "string" && student.full_name.trim()
      ? student.full_name.trim().split(/\s+/).map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
      : "ST";

  return (
    <div className="sdb-wrapper">
      {/* Top Header Navbar */}
      <header className="sdb-header">
        <div className="sdb-header-brand-user">
          <div className="sdb-brand-info">
            <div className="sdb-logo-box">SP</div>
            <div>
              <h1>Student Enterprise Portal</h1>
              <p>{student?.department ? `${student.department} Department` : "Academic Department"}</p>
            </div>
          </div>

          <div className="sdb-header-right">
            <div className="sdb-user-pill" onClick={() => window.location.href = '/Student/profile'}>
              <div className="sdb-user-avatar">{studentInitials}</div>
              <div className="sdb-user-meta">
                <span className="sdb-user-name">{student?.full_name || "Logged Student"} <ChevronDown size={12} /></span>
                <span className="sdb-user-id"><ShieldCheck size={10} /> ID: {student?.student_id || student?.username || "STUDENT"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sdb-search-bar">
          <Search size={16} className="sdb-search-icon" />
          <input
            type="text"
            placeholder="Search videos, topics, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                window.location.href = `/Student/MyVideos?search=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
          />
          <kbd className="sdb-kbd">⌘K</kbd>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="sdb-error-alert">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => fetchDashboardData(student?.id || 0)}>Retry</button>
        </div>
      )}

      {/* Loading Skeleton - Exact Principal Dashboard Skeleton Animation */}
      {loading ? (
        <div className="dash-skeleton-wrapper">
          <div className="dash-skeleton-banner skeleton-shimmer" />
          <div className="dash-skeleton-kpi-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="dash-skeleton-kpi-card skeleton-shimmer" />
            ))}
          </div>
          <div className="dash-skeleton-charts-row">
            <div className="dash-skeleton-chart-large skeleton-shimmer" />
            <div className="dash-skeleton-chart-small skeleton-shimmer" />
          </div>
          <div className="dash-skeleton-tables-row">
            <div className="dash-skeleton-table-card skeleton-shimmer" />
            <div className="dash-skeleton-table-card skeleton-shimmer" />
          </div>
        </div>
      ) : (
        <>
          {/* Hero Welcome Banner */}
          <div className="sdb-hero-banner mb-4">
            <div className="sdb-banner-content">
              <span className="sdb-year-chip">
                <Sparkles size={13} /> Academic Year 2026
              </span>
              <h2>Welcome Back, {studentName}! 👋</h2>
              <p>
                You've watched {formattedWatchTime} of content so far.<br />
                {stats?.completed === 0 ? "Start watching your first video lectures!" : "Keep it up and stay consistent!"}
              </p>

              <div className="sdb-hero-btns">
                <Link href="/Student/ContinueWatching" className="sdb-btn-blue">
                  <Play size={14} fill="white" /> Resume Learning
                </Link>
                <Link href="/Student/MyProgress" className="sdb-btn-glass">
                  <BarChart2 size={15} /> View Detailed Analytics
                </Link>
              </div>
            </div>

            {/* Banner Illustration */}
            <div className="sdb-banner-illustration">
              <img
                src="https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=800&auto=format&fit=crop"
                alt="Student learning"
              />
            </div>
          </div>

          {/* 4 Stat Cards 4-Column Grid */}
          <div className="sdb-stats-4col-grid mb-4">
            <div className="sdb-stat-card">
              <div className="sdb-stat-icon icon-blue">
                <Video size={20} />
              </div>
              <span className="sdb-stat-title">TOTAL VIDEOS</span>
              <span className="sdb-stat-val">{stats?.totalVideos ?? 0}</span>
              <span className="sdb-stat-sub text-slate-400">Assigned course lectures</span>
              <div className="sdb-sparkline spark-blue"></div>
            </div>

            <div className="sdb-stat-card">
              <div className="sdb-stat-icon icon-emerald">
                <CheckCircle2 size={20} />
              </div>
              <span className="sdb-stat-title">COMPLETED</span>
              <span className="sdb-stat-val">{stats?.completed ?? 0}</span>
              <span className="sdb-stat-sub text-emerald-400">{completionPct}% overall progress</span>
              <div className="sdb-stat-bar-track">
                <div className="sdb-stat-bar-fill bg-emerald-500" style={{ width: `${completionPct}%` }}></div>
              </div>
            </div>

            <div className="sdb-stat-card">
              <div className="sdb-stat-icon icon-amber">
                <Clock size={20} />
              </div>
              <span className="sdb-stat-title">PENDING</span>
              <span className="sdb-stat-val">{stats?.pending ?? 0}</span>
              <span className="sdb-stat-sub text-amber-400">Videos remaining</span>
              <div className="sdb-stat-bar-track">
                <div className="sdb-stat-bar-fill bg-amber-500" style={{ width: `${pendingPct}%` }}></div>
              </div>
            </div>

            <div className="sdb-stat-card">
              <div className="sdb-stat-icon icon-purple">
                <TrendingUp size={20} />
              </div>
              <span className="sdb-stat-title">WATCH HOURS</span>
              <span className="sdb-stat-val">{formattedWatchTime}</span>
              <span className="sdb-stat-sub text-slate-400">Total actual time watched</span>
              <div className="sdb-sparkline spark-purple"></div>
            </div>
          </div>

          {/* Quick Actions + Top Categories 2-Column Grid */}
          <div className="sdb-row2-grid sdb-quick-cat-section mb-4">
            {/* Quick Actions Card */}
            <div className="sdb-card-box">
              <div className="sdb-box-header">
                <div>
                  <h3>Quick Actions</h3>
                  <p>Shortcuts to key student portals</p>
                </div>
              </div>
              <div className="sdb-quick-btns-grid">
                <Link href="/Student/MyVideos" className="sdb-quick-btn">
                  <Play size={15} className="text-blue-500" /> All Videos
                </Link>
                <Link href="/Student/WatchHistory" className="sdb-quick-btn">
                  <Bookmark size={15} className="text-amber-500" /> Watch History
                </Link>
                <Link href="/Student/profile" className="sdb-quick-btn">
                  <Heart size={15} className="text-pink-500" /> My Profile
                </Link>
                <Link href="/Student/MyProgress" className="sdb-quick-btn">
                  <BarChart2 size={15} className="text-purple-500" /> My Progress
                </Link>
              </div>
            </div>

            {/* Top Categories Card */}
            <div className="sdb-card-box">
              <div className="sdb-box-header">
                <div>
                  <h3>Top Categories</h3>
                  <p>Explore lectures by course subjects</p>
                </div>
                <Link href="/Student/MyVideos" className="sdb-view-all">View All ↗</Link>
              </div>

              {topCategories.length > 0 ? (
                <div className="sdb-cat-horizontal-grid">
                  {topCategories.slice(0, 5).map((cat, i) => {
                    const CatConfig = CATEGORY_ICONS[cat.name] || { icon: BookOpen, colorClass: "cat-icon-blue" };
                    const CatIcon = CatConfig.icon;
                    return (
                      <div key={i} className="sdb-cat-hcard" onClick={() => window.location.href = `/Student/MyVideos?category=${encodeURIComponent(cat.name)}`}>
                        <div className={`sdb-cat-icon ${CatConfig.colorClass}`}>
                          <CatIcon size={18} />
                        </div>
                        <div className="sdb-cat-info">
                          <h5 title={cat.name}>{cat.name}</h5>
                          <span>{cat.count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 px-4 text-center text-xs text-slate-400 font-medium w-full flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl my-1">
                  No course categories found.
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Continue Watching + Recommended For You */}
          <div className="sdb-row2-grid mb-4">
            {/* 1. Continue Watching Section */}
            <div className="sdb-card-box">
              <div className="sdb-box-header">
                <div>
                  <h3>Continue Watching</h3>
                  <p>Pick up right where you left off</p>
                </div>
                <Link href="/Student/ContinueWatching" className="sdb-view-all">View All ↗</Link>
              </div>

              {continueWatching.length > 0 ? (
                <div className="sdb-cw-split-container">
                  <div className="sdb-cw-featured" onClick={() => window.location.href = '/Student/ContinueWatching'}>
                    <div className="sdb-cw-fthumb">
                      <img src={continueWatching[0]?.thumbnail || "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=500&auto=format&fit=crop"} alt="Featured CW" />
                      <button className="sdb-cw-fplay">
                        <Play size={20} fill="white" className="ml-0.5" />
                      </button>
                    </div>
                    <div className="sdb-cw-fmeta">
                      <h4>{continueWatching[0]?.title}</h4>
                      <div className="sdb-cw-fprog-row">
                        <div className="sdb-cw-fprog-track">
                          <div className="sdb-cw-fprog-fill" style={{ width: `${continueWatching[0]?.progress || 0}%` }}></div>
                        </div>
                        <span>{continueWatching[0]?.progress || 0}% complete</span>
                      </div>
                    </div>
                  </div>

                  {continueWatching.length > 1 && (
                    <div className="sdb-cw-side-list">
                      {continueWatching.slice(1, 4).map((item, idx) => (
                        <div key={idx} className="sdb-cw-side-item" onClick={() => window.location.href = '/Student/ContinueWatching'}>
                          <div className="sdb-cw-side-thumb">
                            <img src={item.thumbnail || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop"} alt={item.title} />
                          </div>
                          <div className="sdb-cw-side-info">
                            <h5>{item.title}</h5>
                            <div className="sdb-cw-side-prog">
                              <div className="sdb-cw-side-fill" style={{ width: `${item.progress}%` }}></div>
                            </div>
                            <span>{item.progress}% complete</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl my-2">
                  <Play size={28} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-500">No video activity found. Start watching your first video.</p>
                  <Link href="/Student/MyVideos" className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition">
                    Browse All Lectures
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Recommended For You */}
            <div className="sdb-card-box">
              <div className="sdb-box-header">
                <div>
                  <h3>Recommended For You</h3>
                  <p>Based on your learning activity</p>
                </div>
                <Link href="/Student/MyVideos" className="sdb-view-all">View All ↗</Link>
              </div>

              {recommendedForYou.length > 0 ? (
                <div className="sdb-rec-cards-wrap">
                  <div className="sdb-rec-cards-grid">
                    {recommendedForYou.slice(0, 4).map((rec) => (
                      <div key={rec.id} className="sdb-rec-card" onClick={() => window.location.href = '/Student/MyVideos'}>
                        <div className="sdb-rec-thumb">
                          <img src={rec.thumbnail || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500&auto=format&fit=crop"} alt={rec.title} />
                          <span className={`sdb-rec-badge ${CATEGORY_COLORS[rec.category] || "bg-blue-600"}`}>{rec.category}</span>
                          <button className="sdb-rec-play">
                            <Play size={16} fill="white" className="ml-0.5" />
                          </button>
                          <span className="sdb-rec-time">{rec.duration}</span>
                        </div>
                        <div className="sdb-rec-body">
                          <h4>{rec.title}</h4>
                          <div className="sdb-rec-meta">
                            <span className="sdb-star"><Star size={12} fill="#f59e0b" color="#f59e0b" /> {rec.rating || "4.8"}</span>
                            <span>{rec.views}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl my-2">
                  <BookOpen size={28} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-500">No recommendations available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Recently Added Videos */}
          <div className="sdb-card-box sdb-bottom-box">
            <div className="sdb-box-header">
              <div>
                <h3>Recently Added Videos</h3>
              </div>
              <Link href="/Student/MyVideos" className="sdb-view-all">View All ↗</Link>
            </div>

            {recentlyAdded.length > 0 ? (
              <div className="sdb-recent-wrap">
                <div className="sdb-recent-cards-grid">
                  {recentlyAdded.slice(0, 5).map((vid, idx) => (
                    <div key={vid.id || idx} className="sdb-recent-card" onClick={() => window.location.href = '/Student/MyVideos'}>
                      <div className="sdb-recent-thumb">
                        {vid.thumbnail ? (
                          <img src={vid.thumbnail} alt={vid.title} />
                        ) : (
                          <div className="sdb-recent-placeholder"><Video size={20} /></div>
                        )}
                        <span className="sdb-recent-dur-badge">{vid.duration || "N/A"}</span>
                      </div>

                      <div className="sdb-recent-info">
                        <h4>{vid.title}</h4>
                        <div className="sdb-recent-sub">
                          <span className="sdb-recent-cat-chip">{vid.category || "General"}</span>
                          <span>{vid.date}</span>
                        </div>
                        <button className="sdb-recent-watch-btn">
                          <Play size={11} fill="white" /> Watch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl my-2">
                <Video size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-500">No recently added videos in your department.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
