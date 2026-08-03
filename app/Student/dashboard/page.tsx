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

const API_BASE = "http://127.0.0.1:8000";

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
      if (saved) {
        const parsed = JSON.parse(saved);
        setStudent(parsed);
        fetchDashboardData(parsed.id);
      } else {
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
      const res = await fetch(`${API_BASE}/api/student/dashboard/`, {
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
        setTopCategories(data.topCategories || []);
        setRecommendedForYou(data.recommendedVideos || []);
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

  const completionPct =
    stats && stats.totalVideos > 0
      ? Math.round((stats.completed / stats.totalVideos) * 100)
      : 71;

  const studentName = typeof student?.full_name === "string" && student.full_name.trim() 
    ? student.full_name.trim().split(" ")[0] 
    : "Arun";

  const studentInitials =
    typeof student?.full_name === "string" && student.full_name.trim()
      ? student.full_name.trim().split(/\s+/).map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
      : "AK";

  return (
    <div className="sdb-wrapper">
      {/* Top Header Navbar */}
      <header className="sdb-header">
        <div className="sdb-brand-info">
          <div className="sdb-logo-box">SP</div>
          <div>
            <h1>Student Enterprise Portal</h1>
            <p>{student?.department ? `${student.department} Department` : "Electronics and Communication Engineering Department"}</p>
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

        <div className="sdb-header-right">
          <button className="sdb-bell-btn">
            <Bell size={18} />
            <span className="sdb-bell-badge">3</span>
          </button>

          <div className="sdb-user-pill" onClick={() => window.location.href = '/Student/profile'}>
            <div className="sdb-user-avatar">{studentInitials}</div>
            <div className="sdb-user-meta">
              <span className="sdb-user-name">{student?.full_name || "Arun Kumar"} <ChevronDown size={12} /></span>
              <span className="sdb-user-id"><ShieldCheck size={10} /> ID: {student?.student_id || student?.username || "ARUNKU140"}</span>
            </div>
          </div>
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

      {/* Loading Skeleton */}
      {loading && (
        <div className="sdb-loading-box">
          <Loader2 size={36} className="animate-spin text-blue-500" />
          <span>Loading student dashboard...</span>
        </div>
      )}

      {!loading && (
        <>
          {/* Top Row: Hero Banner (2fr) + 4 Stat Cards */}
          <div className="sdb-top-grid">
            {/* Hero Welcome Banner */}
            <div className="sdb-hero-banner">
              <div className="sdb-banner-content">
                <span className="sdb-year-chip">
                  <Sparkles size={13} /> Academic Year 2026
                </span>
                <h2>Welcome Back, {studentName}! 👋</h2>
                <p>
                  You've watched {stats?.watchHours || "1.4h"} of content so far.<br />
                  Keep it up and stay consistent!
                </p>

                <div className="sdb-hero-btns">
                  <Link href="/Student/ContinueWatching" className="sdb-btn-blue">
                    <Play size={14} fill="white" /> Resume Learning
                  </Link>
                  <Link href="/Student/MyProgress" className="sdb-btn-glass">
                    <BarChart2 size={15} /> View Detailed Analytics
                  </Link>
                </div>

                {/* Hero Mini Stats Row */}
                <div className="sdb-hero-mini-stats">
                  <div className="sdb-hstat-item">
                    <div className="sdb-hstat-icon icon-purple"><Video size={13} /></div>
                    <div className="sdb-hstat-meta">
                      <span className="sdb-hstat-val">{stats?.totalVideos ?? 7}</span>
                      <span className="sdb-hstat-lbl">Total Videos</span>
                    </div>
                  </div>

                  <div className="sdb-hstat-item">
                    <div className="sdb-hstat-icon icon-emerald"><CheckCircle2 size={13} /></div>
                    <div className="sdb-hstat-meta">
                      <span className="sdb-hstat-val">{stats?.completed ?? 5}</span>
                      <span className="sdb-hstat-lbl">Completed</span>
                    </div>
                  </div>

                  <div className="sdb-hstat-item">
                    <div className="sdb-hstat-icon icon-amber"><Clock size={13} /></div>
                    <div className="sdb-hstat-meta">
                      <span className="sdb-hstat-val">{stats?.pending ?? 2}</span>
                      <span className="sdb-hstat-lbl">Pending</span>
                    </div>
                  </div>

                  <div className="sdb-hstat-item">
                    <div className="sdb-hstat-icon icon-blue"><Play size={13} fill="white" /></div>
                    <div className="sdb-hstat-meta">
                      <span className="sdb-hstat-val">{stats?.watchHours || "1.4h"}</span>
                      <span className="sdb-hstat-lbl">Total Watched</span>
                    </div>
                  </div>
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

            {/* 4 Stat Cards matching reference image */}
            <div className="sdb-stat-card">
              <div className="sdb-stat-icon icon-blue">
                <Video size={20} />
              </div>
              <span className="sdb-stat-title">TOTAL VIDEOS WATCHED</span>
              <span className="sdb-stat-val">{stats?.totalVideos ?? 7}</span>
              <span className="sdb-stat-sub text-slate-400">All available</span>
              <div className="sdb-sparkline spark-blue"></div>
            </div>

            <div className="sdb-stat-card">
              <div className="sdb-stat-icon icon-emerald">
                <CheckCircle2 size={20} />
              </div>
              <span className="sdb-stat-title">COMPLETED</span>
              <span className="sdb-stat-val">{stats?.completed ?? 5}</span>
              <span className="sdb-stat-sub text-emerald-400">{completionPct}% finished</span>
              <div className="sdb-stat-bar-track">
                <div className="sdb-stat-bar-fill bg-emerald-500" style={{ width: `${completionPct}%` }}></div>
              </div>
            </div>

            <div className="sdb-stat-card">
              <div className="sdb-stat-icon icon-amber">
                <Calendar size={20} />
              </div>
              <span className="sdb-stat-title">TODAY WATCHED</span>
              <span className="sdb-stat-val">2</span>
              <span className="sdb-stat-sub text-amber-400">2 videos left</span>
              <div className="sdb-stat-bar-track">
                <div className="sdb-stat-bar-fill bg-amber-500" style={{ width: "50%" }}></div>
              </div>
            </div>

            <div className="sdb-stat-card">
              <div className="sdb-stat-icon icon-purple">
                <TrendingUp size={20} />
              </div>
              <span className="sdb-stat-title">THIS WEEK</span>
              <span className="sdb-stat-val">7</span>
              <span className="sdb-stat-sub text-slate-400">Total watched</span>
              <div className="sdb-sparkline spark-purple"></div>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="sdb-card-box sdb-quick-actions-box">
            <span className="sdb-quick-title">Quick Actions</span>
            <div className="sdb-quick-btns">
              <Link href="/Student/MyVideos" className="sdb-quick-btn">
                <Play size={14} className="text-blue-500" /> All Videos
              </Link>
              <Link href="/Student/WatchHistory" className="sdb-quick-btn">
                <Bookmark size={14} className="text-amber-500" /> Watch Later
              </Link>
              <Link href="/Student/profile" className="sdb-quick-btn">
                <Heart size={14} className="text-pink-500" /> Favorites
              </Link>
              <Link href="/Student/MyProgress" className="sdb-quick-btn">
                <BarChart2 size={14} className="text-purple-500" /> My Progress
              </Link>
              <Link href="/Student/profile" className="sdb-quick-btn">
                <Award size={14} className="text-emerald-500" /> Achievements
              </Link>
            </div>
          </div>

          {/* Row 2: Continue Watching (1.4fr) + Recommended For You (1.6fr) */}
          <div className="sdb-row2-grid">
            {/* 1. Continue Watching Section */}
            <div className="sdb-card-box">
              <div className="sdb-box-header">
                <div>
                  <h3>Continue Watching</h3>
                  <p>Pick up right where you left off</p>
                </div>
                <Link href="/Student/ContinueWatching" className="sdb-view-all">View All ↗</Link>
              </div>

              <div className="sdb-cw-split-container">
                {/* Featured Continue Watching Large Player */}
                <div className="sdb-cw-featured" onClick={() => window.location.href = '/Student/ContinueWatching'}>
                  <div className="sdb-cw-fthumb">
                    <img src={continueWatching[0]?.thumbnail || "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=500&auto=format&fit=crop"} alt="Featured CW" />
                    <button className="sdb-cw-fplay">
                      <Play size={20} fill="white" className="ml-0.5" />
                    </button>
                    <span className="sdb-cw-ftime">16:30</span>
                  </div>
                  <div className="sdb-cw-fmeta">
                    <h4>{continueWatching[0]?.title || "Advanced Python Concepts"}</h4>
                    <div className="sdb-cw-fprog-row">
                      <div className="sdb-cw-fprog-track">
                        <div className="sdb-cw-fprog-fill" style={{ width: `${continueWatching[0]?.progress || 65}%` }}></div>
                      </div>
                      <span>{continueWatching[0]?.progress || 65}% complete • Last watched 2 hours ago</span>
                    </div>
                  </div>
                </div>

                {/* Vertical Side List */}
                <div className="sdb-cw-side-list">
                  {(continueWatching.length > 1 ? continueWatching.slice(1, 4) : [
                    { title: "Engineering Mathematics – Matrices", progress: 40, duration: "22:18" },
                    { title: "Digital Electronics Basics", progress: 30, duration: "24:15" },
                    { title: "Data Structures Using Python", progress: 20, duration: "18:30" }
                  ]).map((item, idx) => (
                    <div key={idx} className="sdb-cw-side-item" onClick={() => window.location.href = '/Student/ContinueWatching'}>
                      <div className="sdb-cw-side-thumb">
                        <img src={item.thumbnail || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop"} alt={item.title} />
                        <span className="sdb-cw-side-dur">{item.duration || "16:30"}</span>
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
              </div>
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

              <div className="sdb-rec-cards-wrap">
                <div className="sdb-rec-cards-grid">
                  {(recommendedForYou.length > 0 ? recommendedForYou.slice(0, 4) : [
                    { id: 101, title: "Introduction to Python Programming", category: "Recommended", duration: "28:50", rating: "4.8", views: "10 views", catColor: "bg-purple-600", thumb: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500&auto=format&fit=crop" },
                    { id: 102, title: "Engineering Mathematics – Matrices", category: "Mathematics", duration: "16:30", rating: "4.8", views: "4 views", catColor: "bg-blue-600", thumb: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500&auto=format&fit=crop" },
                    { id: 103, title: "Digital Electronics Basics", category: "Soft Skills", duration: "16:30", rating: "4.8", views: "2 views", catColor: "bg-sky-500", thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500&auto=format&fit=crop" },
                    { id: 104, title: "Effective Time Management", category: "Soft Skills", duration: "16:30", rating: "4.7", views: "7 views", catColor: "bg-sky-500", thumb: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=500&auto=format&fit=crop" },
                  ]).map((rec) => (
                    <div key={rec.id} className="sdb-rec-card" onClick={() => window.location.href = '/Student/MyVideos'}>
                      <div className="sdb-rec-thumb">
                        <img src={rec.thumbnail || rec.thumb} alt={rec.title} />
                        <span className={`sdb-rec-badge ${CATEGORY_COLORS[rec.category] || rec.catColor || "bg-blue-600"}`}>{rec.category}</span>
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
                <button className="sdb-rec-next-btn" onClick={() => window.location.href = '/Student/MyVideos'}>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Recently Added Videos (Full Width Horizontal Scroll Grid) */}
          <div className="sdb-card-box sdb-bottom-box">
            <div className="sdb-box-header">
              <div>
                <h3>Recently Added Videos</h3>
              </div>
              <Link href="/Student/MyVideos" className="sdb-view-all">View All ↗</Link>
            </div>

            <div className="sdb-recent-wrap">
              <div className="sdb-recent-cards-grid">
                {(recentlyAdded.length > 0 ? recentlyAdded.slice(0, 5) : [
                  { id: 1, title: "rf", category: "Soft Skills", date: "29 Jul 2026", duration: "16:30", views: "1 view", thumbnail: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=500&auto=format&fit=crop" },
                  { id: 2, title: "This video covers advanced Python programming concepts", category: "Soft Skills", date: "30 Jul 2026", duration: "18:30", views: "3 views", thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500&auto=format&fit=crop" },
                  { id: 3, title: "Engineering Mathematics – Matrices", category: "Mathematics", date: "29 Jul 2026", duration: "22:18", views: "4 views", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500&auto=format&fit=crop" },
                  { id: 4, title: "Digital Electronics Basics", category: "Digital Electronics", date: "29 Jul 2026", duration: "24:15", views: "2 views", thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500&auto=format&fit=crop" },
                  { id: 5, title: "Data Structures Using Python", category: "Physics", date: "27 Jul 2026", duration: "18:30", views: "5 views", thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=500&auto=format&fit=crop" }
                ]).map((vid, idx) => (
                  <div key={vid.id || idx} className="sdb-recent-card" onClick={() => window.location.href = '/Student/MyVideos'}>
                    <div className="sdb-recent-thumb">
                      {vid.thumbnail ? (
                        <img src={vid.thumbnail} alt={vid.title} />
                      ) : (
                        <div className="sdb-recent-placeholder"><Video size={20} /></div>
                      )}
                      <span className="sdb-recent-dur-badge">{vid.duration || "18:30"}</span>
                    </div>

                    <div className="sdb-recent-info">
                      <h4>{vid.title}</h4>
                      <div className="sdb-recent-sub">
                        <span className="sdb-recent-cat-chip">{vid.category || "Soft Skills"}</span>
                        <span>{vid.date || "29 Jul 2026"}</span>
                        <span>•</span>
                        <span>{vid.views || "1 view"}</span>
                      </div>
                      <button className="sdb-recent-watch-btn">
                        <Play size={11} fill="white" /> Watch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="sdb-recent-next-btn" onClick={() => window.location.href = '/Student/MyVideos'}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Row 4: Top Categories (5 Horizontal Cards Grid at Bottom) */}
          <div className="sdb-card-box sdb-categories-bottom-box">
            <div className="sdb-box-header">
              <div>
                <h3>Top Categories</h3>
              </div>
              <Link href="/Student/MyVideos" className="sdb-view-all">View All ↗</Link>
            </div>

            <div className="sdb-cat-horizontal-grid">
              {(topCategories.length > 0 ? topCategories : [
                { name: "Mathematics", count: "3 videos", icon: Sigma, colorClass: "cat-icon-emerald" },
                { name: "Programming", count: "1 video", icon: Code, colorClass: "cat-icon-purple" },
                { name: "Physics", count: "1 video", icon: BookOpen, colorClass: "cat-icon-indigo" },
                { name: "Digital Electronics", count: "1 video", icon: Cpu, colorClass: "cat-icon-amber" },
                { name: "Soft Skills", count: "2 videos", icon: UserCheck, colorClass: "cat-icon-blue" },
              ]).map((cat, i) => {
                const CatConfig = CATEGORY_ICONS[cat.name] || { icon: BookOpen, colorClass: "cat-icon-blue" };
                const CatIcon = CatConfig.icon;
                return (
                  <div key={i} className="sdb-cat-hcard" onClick={() => window.location.href = `/Student/MyVideos?category=${encodeURIComponent(cat.name)}`}>
                    <div className={`sdb-cat-icon ${CatConfig.colorClass}`}>
                      <CatIcon size={20} />
                    </div>
                    <div className="sdb-cat-info">
                      <h5>{cat.name}</h5>
                      <span>{cat.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
