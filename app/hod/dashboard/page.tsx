"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Video,
  Eye,
  Search,
  Bell,
  ChevronDown,
  User,
  PlayCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Activity,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  BarChart3,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import "./Hoddashboard.css";

/* ---------------------------------- TYPES ---------------------------------- */

interface DailyView {
  day: string;
  views: number;
}

interface CategorySlice {
  name: string;
  value: number;
  color: string;
}

interface UploadedVideo {
  id: number;
  title: string;
  category: string;
  duration: string;
  views: number;
  uploadDateTime: string;
  thumbnail?: string;
}

interface RecentView {
  student: string;
  department: string;
  video: string;
  watchTime: string;
  lastViewed: string;
}

interface StudentPerformance {
  id: number;
  name: string;
  year: string;
  score: number;
  videosWatched: number;
  watchTimeMinutes: number;
  lastActivity: string;
  status: string;
  rank?: number;
}

interface LiveActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  badge: string;
}

interface YearDistItem {
  label: string;
  count: number;
  percent: number;
  color: string;
}

interface HodDashboardData {
  summaryCards: {
    students: number;
    videos: number;
    totalViews: number;
    publishedDeptVideos?: number;
    studentViews?: number;
    monthViews?: number;
    watchTime: string;
    activeStudents?: number;
    engagementRate?: number;
  };
  dailyViews: DailyView[];
  monthlyViews?: { week: string; views: number }[];
  topCategories: CategorySlice[];
  latestVideos: UploadedVideo[];
  recentViews: RecentView[];
  studentPerformance?: StudentPerformance[];
  liveActivities?: LiveActivity[];
  yearDistribution?: YearDistItem[];
  departmentName?: string;
  collegeName?: string;
  hodName?: string;
  totalPublishedDeptVideos?: number;
  mostWatchedVideos?: UploadedVideo[];
  leastWatchedVideos?: UploadedVideo[];
}

/* --------------------------------- HELPERS --------------------------------- */

function ViewsTooltip(props: any) {
  const { active, payload, label } = props;
  if (!active || !payload || !payload.length) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <div className="chart-tooltip-glass">
      <p className="chart-tooltip-title">{label}</p>
      <p className="chart-tooltip-row">
        <span className="chart-tooltip-dot" style={{ background: "#4f46e5" }} />
        Views: <strong>{Number(value).toLocaleString()}</strong>
      </p>
    </div>
  );
}

function BarTooltip(props: any) {
  const { active, payload, label } = props;
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip-glass">
      <p className="chart-tooltip-title">{label}</p>
      <p className="chart-tooltip-row">
        <span className="chart-tooltip-dot" style={{ background: "#3b82f6" }} />
        Views: <strong>{Number(payload[0]?.value ?? 0).toLocaleString()}</strong>
      </p>
    </div>
  );
}

function CategoryTooltip(props: any) {
  const { active, payload } = props;
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  const color = item?.payload?.color ?? "#6366f1";
  return (
    <div className="chart-tooltip-glass">
      <p className="chart-tooltip-row">
        <span className="chart-tooltip-dot" style={{ background: color }} />
        {item.name}: <strong>{Number(item.value).toLocaleString()} students</strong>
      </p>
    </div>
  );
}

/* Build year donut from yearDistribution */
function buildYearDonut(yearDist: YearDistItem[]) {
  const palette = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"];
  return yearDist.map((y, i) => ({
    name: y.label,
    value: y.count,
    color: y.color || palette[i % palette.length],
  }));
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://online-management-backend.onrender.com";

/* --------------------------------- COMPONENT -------------------------------- */

export default function HodDashboard() {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hodName, setHodName] = useState<string>("HOD");
  const [storedDeptName, setStoredDeptName] = useState<string>("");
  const [storedCollegeName, setStoredCollegeName] = useState<string>("");

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const savedHod = typeof window !== "undefined"
      ? localStorage.getItem("hod") || sessionStorage.getItem("hod")
      : null;

    if (!savedHod) {
      router.replace("/hod/login");
      return;
    }

    try {
      const parsed = JSON.parse(savedHod);
      if (parsed?.name || parsed?.username) {
        setHodName(parsed.name || parsed.username);
      }
      if (parsed?.department) {
        setStoredDeptName(parsed.department);
      }
      if (parsed?.college) {
        setStoredCollegeName(parsed.college);
      }
    } catch (_) {
      router.replace("/hod/login");
    }
  }, [router]);

  const [dashData, setDashData] = useState<HodDashboardData>({
    summaryCards: {
      students: 0,
      videos: 0,
      totalViews: 0,
      publishedDeptVideos: 0,
      studentViews: 0,
      monthViews: 0,
      watchTime: "0 Hours",
      activeStudents: 0,
      engagementRate: 0,
    },
    dailyViews: [],
    monthlyViews: [],
    topCategories: [],
    latestVideos: [],
    recentViews: [],
    studentPerformance: [],
    liveActivities: [],
    yearDistribution: [],
    departmentName: "",
    collegeName: "",
    mostWatchedVideos: [],
    leastWatchedVideos: [],
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("hod_dash_cache");
      if (cached) {
        setDashData(JSON.parse(cached));
        setLoading(false);
      }
    } catch (_) {}
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setError(null);
    try {
      const savedHod = typeof window !== "undefined"
        ? localStorage.getItem("hod") || sessionStorage.getItem("hod")
        : null;

      let hodId = "";
      if (savedHod) {
        try {
          const parsed = JSON.parse(savedHod);
          hodId = parsed?.id || "";
        } catch (_) {}
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (hodId) headers["X-Hod-Id"] = String(hodId);

      let response: Response;
      try {
        response = await fetch(`${API_BASE}/api/hod/dashboard/`, {
          method: "GET",
          headers,
          credentials: "include",
        });
      } catch (fetchErr: any) {
        throw new Error("Network error connecting to department dashboard API.");
      }

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("hod");
          sessionStorage.removeItem("hod");
        }
        router.replace("/hod/login");
        return;
      }

      if (!response.ok) {
        let errMessage = `Server error: ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson?.message) errMessage = errJson.message;
        } catch (_) {}
        throw new Error(errMessage);
      }
      
      const json = await response.json();

      if (json.status === "success") {
        const stats = json.stats || {};
        const mappedData: HodDashboardData = {
          summaryCards: {
            students: stats.totalStudents ?? 0,
            videos: stats.totalVideos ?? 0,
            totalViews: stats.totalViews ?? 0,
            publishedDeptVideos: stats.publishedDeptVideos ?? 0,
            studentViews: stats.studentViews ?? 0,
            monthViews: stats.monthViews ?? 0,
            watchTime: stats.watchTime ?? "0 Hours",
            activeStudents: stats.activeStudents ?? 0,
            engagementRate: stats.engagementRate ?? 0,
          },
          dailyViews: Array.isArray(json.engagementData) 
            ? json.engagementData.map((d: any) => ({ day: d.day, views: d.value ?? d.views ?? 0 }))
            : [],
          monthlyViews: Array.isArray(json.monthlyViews) ? json.monthlyViews : [],
          topCategories: Array.isArray(json.topCategories) ? json.topCategories : [],
          latestVideos: Array.isArray(json.latestVideos) ? json.latestVideos : [],
          recentViews: Array.isArray(json.recentViews) ? json.recentViews : [],
          studentPerformance: Array.isArray(json.studentPerformance) ? json.studentPerformance : [],
          liveActivities: Array.isArray(json.recentActivities) ? json.recentActivities.map((act: any, idx: number) => ({
            id: String(act.id || idx),
            type: act.type || "activity",
            title: act.title || act.description || "",
            description: act.description || "",
            time: act.time || "",
            badge: act.badge || "System",
          })) : [],
          yearDistribution: Array.isArray(json.yearDistribution) ? json.yearDistribution : [],
          departmentName: json.hod?.department || "",
          collegeName: json.hod?.college || "",
          hodName: json.hod?.name || "",
          mostWatchedVideos: Array.isArray(json.mostWatchedVideos) ? json.mostWatchedVideos : [],
          leastWatchedVideos: Array.isArray(json.leastWatchedVideos) ? json.leastWatchedVideos : [],
        };

        setDashData(mappedData);
        try {
          sessionStorage.setItem("hod_dash_cache", JSON.stringify(mappedData));
        } catch (_) {}

        if (json.hod?.name) {
          setHodName(json.hod.name);
        }
        if (json.hod?.department) {
          setStoredDeptName(json.hod.department);
        }
        if (json.hod?.college) {
          setStoredCollegeName(json.hod.college);
        }
        setLastUpdated(new Date());
      } else {
        throw new Error(json.message || "API returned an error");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load department dashboard data.");
      console.error("HOD Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const {
    summaryCards: s = {
      students: 0, videos: 0, totalViews: 0,
      watchTime: "0 Hours", activeStudents: 0,
      engagementRate: 0, publishedDeptVideos: 0,
      studentViews: 0, monthViews: 0
    },
    dailyViews = [],
    monthlyViews = [],
    studentPerformance = [],
    liveActivities: backendLiveActivities = [],
    yearDistribution = [],
    departmentName = "",
    collegeName = "",
    mostWatchedVideos = [],
    leastWatchedVideos = [],
  } = dashData || {};

  const liveActivities = backendLiveActivities;

  const engagement = s.engagementRate ?? (s.students > 0 ? Math.round(((s.activeStudents || 0) / s.students) * 100) : 0);

  const weeklyViews = useMemo(() => {
    if (monthlyViews && monthlyViews.length > 0) return monthlyViews;
    // Fallback: chunk daily views
    if (!dailyViews.length) return [];
    const weeks: { week: string; views: number }[] = [];
    const chunkSize = Math.ceil(dailyViews.length / 5);
    for (let i = 0; i < 5; i++) {
      const chunk = dailyViews.slice(i * chunkSize, (i + 1) * chunkSize);
      weeks.push({
        week: `Week ${i + 1}`,
        views: chunk.reduce((sum, d) => sum + d.views, 0),
      });
    }
    return weeks;
  }, [monthlyViews, dailyViews]);

  const yearDonut = useMemo(() => buildYearDonut(yearDistribution ?? []), [yearDistribution]);
  const totalYearStudents = yearDonut.reduce((sum, d) => sum + d.value, 0);

  const filteredStudentPerformance = useMemo(() => {
    let list = [...studentPerformance];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (d) => d.name.toLowerCase().includes(q) || (d.year && d.year.toLowerCase().includes(q))
      );
    }
    return list.slice(0, 5);
  }, [studentPerformance, searchQuery]);

  const filteredMostWatchedVideos = useMemo(() => {
    if (!searchQuery.trim()) return mostWatchedVideos;
    const q = searchQuery.toLowerCase();
    return mostWatchedVideos.filter((v) => v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q));
  }, [mostWatchedVideos, searchQuery]);

  const filteredLeastWatchedVideos = useMemo(() => {
    if (!searchQuery.trim()) return leastWatchedVideos;
    const q = searchQuery.toLowerCase();
    return leastWatchedVideos.filter((v) => v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q));
  }, [leastWatchedVideos, searchQuery]);

  /* KPI cards below banner */
  const kpiCards = [
    {
      label: "Total Students",
      value: s.students.toLocaleString(),
      subtext: `${s.activeStudents || 0} active learners`,
      icon: Users,
      tone: "indigo",
      trend: "",
    },
    {
      label: "Active Students",
      value: (s.activeStudents || 0).toLocaleString(),
      subtext: "Engaged in video lectures",
      icon: GraduationCap,
      tone: "teal",
      trend: "",
    },
    {
      label: "Department Videos",
      value: s.videos.toLocaleString(),
      subtext: `${s.publishedDeptVideos || 0} published videos`,
      icon: Video,
      tone: "violet",
      trend: "",
    },
    {
      label: "Student Engagement",
      value: `${engagement}%`,
      subtext: "Active participation rate",
      icon: TrendingUp,
      tone: "amber",
      trend: "",
    },
  ];

  return (
    <div className="dash-corp-main">
      {/* ===== TOP HEADER ===== */}
      <header className="dash-corp-header">
        {/* Brand */}
        <div className="dash-header-brand">
          <div className="dash-corp-logo">DP</div>
          <div>
            <h1 className="dash-header-title">Department Dashboard</h1>
            <span className="dash-header-subtitle" suppressHydrationWarning>
              {departmentName || storedDeptName ? `${departmentName || storedDeptName} (HOD Portal)` : "Department Analytics Portal"}
            </span>
          </div>
        </div>

        {/* Search — center */}
        <div className="dash-search-container">
          <Search size={16} className="search-icon" />
          <input
            id="dashboard-search"
            type="text"
            placeholder="Search students, videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="search-kbd">⌘K</kbd>
        </div>

        {/* Right actions */}
        <div className="dash-header-actions">
          <div className="dash-profile-wrapper" ref={profileRef}>
            <button
              type="button"
              className={`dash-profile-trigger ${profileOpen ? "active" : ""}`}
              onClick={() => setProfileOpen((v) => !v)}
            >
              <div className="dash-profile-avatar"><User size={15} /></div>
              <div className="dash-profile-info">
                <span className="profile-name" suppressHydrationWarning>{hodName}</span>
                <span className="profile-role">HOD – {departmentName || storedDeptName || "Department"}</span>
              </div>
              <ChevronDown size={13} className={`profile-arrow ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`dash-profile-dropdown ${profileOpen ? "open" : ""}`}>
              <a href="/hod/students"><Users size={14} /> My Students</a>
              <a href="/hod/videos"><Video size={14} /> Course Videos</a>
              <a href="/hod/performance"><BarChart3 size={14} /> Performance</a>
              <div className="dropdown-divider" />
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("hod");
                  sessionStorage.removeItem("hod");
                  localStorage.removeItem("user");
                  sessionStorage.removeItem("user");
                  window.location.href = "/hod/login";
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN BODY ===== */}
      <main className="dash-corp-body">
        {loading && !lastUpdated ? (
          <div className="dash-skeleton-wrapper">
            <div className="dash-skeleton-banner skeleton-shimmer" />
            <div className="dash-skeleton-kpi-grid">
              {[1, 2, 3, 4].map((i) => (
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
            {/* Welcome Banner */}
            <section className="dash-welcome-banner">
              <div className="banner-content">
                <div className="banner-badge">
                  <ShieldCheck size={14} />
                  <span>Verified Department Portal</span>
                </div>
                <h2 suppressHydrationWarning>Welcome back, {hodName} 👋</h2>
                <p suppressHydrationWarning>
                  {collegeName || storedCollegeName 
                    ? `${collegeName || storedCollegeName} — ${departmentName || storedDeptName || "Academic"} Department Portal`
                    : "Here's what's happening in your department today."}
                </p>
              </div>
              <div className="banner-date-pill">
                <span className="banner-date-icon">📅</span>
                <div>
                  <span className="banner-date-value" suppressHydrationWarning>
                    {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="banner-date-day" suppressHydrationWarning>
                    {new Date().toLocaleDateString("en-US", { weekday: "long" })}
                  </span>
                </div>
              </div>
            </section>

            {/* ===== KPI CARDS ===== */}
            <section className="kpi-cards-grid">
              {kpiCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div className={`kpi-card kpi-${card.tone}`} key={card.label}>
                    <div className="kpi-card-top">
                      <div className={`kpi-icon-box kpi-icon-${card.tone}`}>
                        <Icon size={22} />
                      </div>
                      {card.trend && (
                        <span className="kpi-trend-pill">
                          <ArrowUpRight size={11} />{card.trend}
                        </span>
                      )}
                    </div>
                    <div className="kpi-card-value">{card.value}</div>
                    <div className="kpi-card-label">{card.label}</div>
                    <div className="kpi-card-sub">{card.subtext}</div>
                  </div>
                );
              })}
            </section>

            {error && (
              <div className="dash-error-banner">
                <AlertCircle size={18} />
                <span>{error}</span>
                <button onClick={fetchDashboardData}>Try Again</button>
              </div>
            )}

            {/* ===== ROW 2: 2-COLUMN GRID (Student Engagement Trend & Students by Year) ===== */}
            <section className="dash-charts-row">
              {/* Student Engagement Area Chart */}
              <div className="corp-card chart-card">
                <div className="corp-card-header">
                  <div>
                    <h3><TrendingUp size={17} className="header-icon" style={{ color: "#4f46e5" }} /> Student Engagement Trend</h3>
                    <p className="card-subtitle">Video watch activity (Last 7 Days)</p>
                  </div>
                  <span className="chart-badge">7 Days</span>
                </div>
                <div className="chart-container">
                  {dailyViews.length === 0 ? (
                    <div className="chart-empty-state">No engagement trend data available.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={dailyViews} margin={{ top: 8, right: 12, left: -24, bottom: 0 }}>
                        <defs>
                          <linearGradient id="hodEngageGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--p-border-table)" vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--p-text-muted)" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "var(--p-text-muted)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<ViewsTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="views"
                          stroke="#4f46e5"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#hodEngageGrad)"
                          dot={{ r: 4, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Students by Year Card */}
              <div className="corp-card chart-card">
                <div className="corp-card-header" style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="kpi-icon-box kpi-icon-indigo" style={{ width: "40px", height: "40px", borderRadius: "10px" }}>
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>Students by Year</h3>
                      <p className="card-subtitle" style={{ margin: "2px 0 0" }}>Department wise student distribution</p>
                    </div>
                  </div>
                  <span className="chart-badge" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8", fontWeight: 700 }}>
                    Total: {totalYearStudents}
                  </span>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {yearDistribution.map((y) => {
                    const studentText = y.count === 1 ? "1 student" : `${y.count} students`;
                    return (
                      <div 
                        key={y.label}
                        style={{
                          background: "var(--p-bg-subtle)",
                          border: "1px solid var(--p-border-table)",
                          borderRadius: "12px",
                          padding: "16px 20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "16px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "120px" }}>
                          <span 
                            style={{ 
                              width: "10px", 
                              height: "10px", 
                              borderRadius: "50%", 
                              background: y.color,
                              display: "inline-block",
                              flexShrink: 0
                            }} 
                          />
                          <span style={{ fontWeight: 700, color: "var(--p-text-primary)", fontSize: "14px" }}>{y.label}</span>
                        </div>
                        
                        <div style={{ color: "var(--p-text-muted)", fontSize: "13.5px", minWidth: "80px" }}>
                          {studentText}
                        </div>
                        
                        <div style={{ flex: 1, height: "8px", background: "var(--p-border-table)", borderRadius: "999px", overflow: "hidden", position: "relative" }}>
                          <div 
                            style={{ 
                              height: "100%", 
                              background: y.color, 
                              width: `${y.percent}%`, 
                              borderRadius: "999px",
                              transition: "width 0.3s ease"
                            }} 
                          />
                        </div>
                        
                        <div style={{ fontWeight: 700, color: "var(--p-text-primary)", fontSize: "14px", minWidth: "40px", textAlign: "right" }}>
                          {Math.round(y.percent)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ===== ROW 3: 2-COLUMN GRID (Video Views & Executive Quick Actions) ===== */}
            <section className="dash-charts-row" style={{ marginTop: "20px" }}>
              {/* Video Views Bar Chart (Weekly) */}
              <div className="corp-card chart-card">
                <div className="corp-card-header">
                  <div>
                    <h3><BarChart3 size={17} className="header-icon" style={{ color: "#3b82f6" }} /> Video Views (This Month)</h3>
                  </div>
                  <span className="chart-badge">This Month</span>
                </div>
                <div className="chart-container">
                  {weeklyViews.length === 0 ? (
                    <div className="chart-empty-state">No monthly view data available.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={weeklyViews} margin={{ top: 8, right: 12, left: -24, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--p-border-table)" vertical={false} />
                        <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--p-text-muted)" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "var(--p-text-muted)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<BarTooltip />} cursor={{ fill: "var(--p-indigo-soft)" }} />
                        <Bar dataKey="views" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={52} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Executive Quick Actions */}
              <div className="corp-card actions-card">
                <div className="corp-card-header">
                  <h3><Zap size={18} className="header-icon" style={{ color: "#f59e0b" }} /> Executive Quick Actions</h3>
                  <span className="header-badge">Shortcuts</span>
                </div>
                <div className="quick-actions-buttons" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginTop: "12px" }}>
                  <a href="/hod/students" className="quick-btn btn-indigo">
                    <GraduationCap size={16} /><span>Manage Students</span>
                  </a>
                  <a href="/hod/videos" className="quick-btn btn-teal">
                    <Video size={16} /><span>Course Videos</span>
                  </a>
                  <a href="/hod/performance" className="quick-btn btn-violet">
                    <BarChart3 size={16} /><span>Performance Report</span>
                  </a>
                </div>
              </div>
            </section>

            {/* ===== ROW 4: 2-COLUMN GRID (Real-time System Audit Stream & Most Watched Videos) ===== */}
            <section className="dash-charts-row" style={{ marginTop: "20px" }}>
              {/* Real-time System Audit Stream */}
              <div className="corp-card live-activity-card" style={{ height: "auto" }}>
                <div className="corp-card-header">
                  <h3><Activity size={18} className="header-icon" style={{ color: "#4f46e5" }} /> Real-time System Audit Stream</h3>
                  <span className="header-badge live-dot-badge"><span className="pulse-dot" /> Live</span>
                </div>
                <div className="activity-feed-list">
                  {liveActivities.length === 0 ? (
                    <div className="empty-feed">No recent system activity logged in department.</div>
                  ) : (
                    liveActivities.slice(0, 4).map((act) => (
                      <div key={act.id} className="feed-item">
                        <div className="feed-icon-dot"><CheckCircle2 size={14} /></div>
                        <div className="feed-body">
                          <div className="feed-title">{act.description}</div>
                          <div className="feed-meta">
                            <span className="feed-badge">{act.badge}</span>
                            <span className="feed-time">{act.time}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Most Watched Videos Table */}
              <div className="corp-card table-card-corp" style={{ height: "auto" }}>
                <div className="corp-card-header">
                  <div>
                    <h3><TrendingUp size={18} className="header-icon" style={{ color: "#0d9488" }} /> Most Watched Videos</h3>
                    <p className="card-subtitle">Highest engagement department videos</p>
                  </div>
                  <div className="recent-header-actions">
                    <span className="table-count-badge">{filteredMostWatchedVideos.length} Videos</span>
                  </div>
                </div>
                <div className="corp-table-wrap">
                  <table className="corp-table">
                    <thead>
                      <tr>
                        <th>Media</th>
                        <th>Video Title</th>
                        <th>Category</th>
                        <th>Duration</th>
                        <th>Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMostWatchedVideos.length === 0 ? (
                        <tr><td colSpan={5} className="empty-table-cell">No videos found.</td></tr>
                      ) : (
                        filteredMostWatchedVideos.map((video, idx) => (
                          <tr key={`${video.title}-${idx}`}>
                            <td>
                              <div className="table-media-thumb">
                                {video.thumbnail ? (
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="table-media-img"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = "none";
                                      (e.target as HTMLElement).nextElementSibling?.removeAttribute("style");
                                    }}
                                  />
                                ) : null}
                                <div
                                  className="table-media-fallback"
                                  style={{ display: video.thumbnail ? "none" : "flex" }}
                                >
                                  <PlayCircle size={18} />
                                </div>
                              </div>
                            </td>
                            <td style={{ fontWeight: 600, color: "var(--p-text-primary)" }}>{video.title}</td>
                            <td><span className="table-cat-badge">{video.category}</span></td>
                            <td><span className="table-dur-badge">{video.duration}</span></td>
                            <td style={{ fontWeight: 600 }}>{video.views.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}