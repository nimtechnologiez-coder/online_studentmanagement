"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  GraduationCap,
  Video,
  Eye,
  Search,
  Bell,
  ChevronDown,
  User,
  PlayCircle,
  RefreshCw,
  AlertCircle,
  Users,
  TrendingUp,
  Activity,
  Zap,
  CheckCircle2,
  FileSpreadsheet,
  ArrowUpRight,
  ShieldCheck,
  Award,
  BarChart3,
  BookOpen,
  Star,
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
  LabelList,
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
  title: string;
  category: string;
  duration: string;
  views: number;
  uploadDate: string;
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
  name: string;
  year: string;
  score: number;
  views: number;
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
}

function formatCompactNumber(num: number): string {
  if (num >= 1_000_000_000) {
    const formatted = (num / 1_000_000_000).toFixed(1);
    return (formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted) + "B";
  }
  if (num >= 1_000_000) {
    const formatted = (num / 1_000_000).toFixed(1);
    return (formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted) + "M";
  }
  if (num >= 1_000) {
    const formatted = (num / 1_000).toFixed(1);
    return (formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted) + "K";
  }
  return String(num);
}

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
  const fullLabel = String(label).startsWith("W") && !String(label).startsWith("Week")
    ? `Week ${String(label).slice(1)}`
    : label;
  return (
    <div className="chart-tooltip-glass">
      <p className="chart-tooltip-title">{fullLabel}</p>
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

function DonutTooltip(props: any) {
  const { active, payload } = props;
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  return (
    <div className="chart-tooltip-glass">
      <p className="chart-tooltip-title">{item.name}</p>
      <p className="chart-tooltip-row">
        <span className="chart-tooltip-dot" style={{ background: item.payload?.color }} />
        {item.name}: <strong>{Number(item.value).toLocaleString()} students</strong>
      </p>
    </div>
  );
}

function buildWeeklyData(dailyViews: DailyView[] = []) {
  if (!dailyViews || !dailyViews.length) return [];
  const totalViews = dailyViews.reduce((sum, d) => sum + (d?.views || 0), 0);
  return [
    { week: "Week 1", views: 0 },
    { week: "Week 2", views: 0 },
    { week: "Week 3", views: totalViews },
    { week: "Week 4", views: 0 },
  ];
}

function buildStudentDonut(yearDist: YearDistItem[] = [], students: StudentPerformance[] = []) {
  const defaultYears = [
    { label: "I Year", key: "I", color: "#4f6cf7" },
    { label: "II Year", key: "II", color: "#22c55e" },
    { label: "III Year", key: "III", color: "#f97316" },
    { label: "IV Year", key: "IV", color: "#06b6d4" },
  ];

  if (yearDist && yearDist.length > 0) {
    return defaultYears.map((dy) => {
      const found = yearDist.find(
        (y) => y.label === dy.label || y.label === `${dy.key} Year` || y.label.startsWith(dy.key)
      );
      return {
        name: dy.label,
        value: found ? found.count : 0,
        color: found?.color || dy.color,
      };
    });
  }

  if (students && students.length > 0) {
    const yearGroups: Record<string, number> = {};
    students.forEach((s) => {
      if (s && s.year) {
        const normalizedKey = s.year.trim();
        yearGroups[normalizedKey] = (yearGroups[normalizedKey] || 0) + 1;
      }
    });

    return defaultYears.map((dy) => ({
      name: dy.label,
      value: yearGroups[dy.key] || yearGroups[dy.label] || 0,
      color: dy.color,
    }));
  }

  return defaultYears.map((dy) => ({
    name: dy.label,
    value: 0,
    color: dy.color,
  }));
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://online-management-backend.onrender.com";

const INITIAL_DASHBOARD_DATA: HodDashboardData = {
  summaryCards: {
    students: 0,
    videos: 0,
    totalViews: 0,
    monthViews: 0,
    watchTime: "0 Mins",
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
  hodName: "",
};

/* --------------------------------- COMPONENT -------------------------------- */

export default function HodDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [dashData, setDashData] = useState<HodDashboardData>(INITIAL_DASHBOARD_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hodDisplayName, setHodDisplayName] = useState("HOD");

  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on route change
  useEffect(() => {
    setProfileOpen(false);
  }, [pathname]);

  // Close dropdown on outside click and Escape key press
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
    try {
      const cached = sessionStorage.getItem("hod_dash_cache");
      if (cached) {
        setDashData(JSON.parse(cached));
        setLoading(false);
      }
    } catch (_) { }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);

      const savedHod = typeof window !== "undefined"
        ? localStorage.getItem("hod") || sessionStorage.getItem("hod")
        : null;

      let hodId = "";
      if (savedHod) {
        try {
          const parsed = JSON.parse(savedHod);
          hodId = parsed?.id || "";
          if (parsed?.name) setHodDisplayName(parsed.name);
        } catch (e) { }
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (hodId) headers["X-Hod-Id"] = String(hodId);

      const response = await fetch(`${API_BASE}/api/hod/dashboard/`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      const json = await response.json();

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("hod");
          sessionStorage.removeItem("hod");
        }
        router.push("/hod/login");
        return;
      }

      if (response.ok && json && json.status === "success") {
        const eng = Array.isArray(json.engagementData) ? json.engagementData : [];
        const mViews = Array.isArray(json.monthlyViews) ? json.monthlyViews : [];
        const vids = Array.isArray(json.recentVideos) ? json.recentVideos : [];
        const acts = Array.isArray(json.recentActivities) ? json.recentActivities : [];
        const topSt = Array.isArray(json.topStudents) ? json.topStudents : [];

        const dailyViews: DailyView[] = eng.map((e: any) => ({ day: e.day, views: e.value ?? 0 }));
        const monthlyViews = mViews.map((m: any) => ({ week: m.week || m.day || "", views: m.views ?? m.value ?? 0 }));

        const recentViews: RecentView[] = acts.map((a: any) => ({
          student: a.name || "",
          department: json.hod?.department || "",
          video: a.action?.replace(/^(watched|completed)\s*"?/, "").replace(/"$/, "") || "",
          watchTime: "",
          lastViewed: a.time || "",
        }));

        const latestVideos: UploadedVideo[] = vids.map((v: any) => ({
          title: v.title || "",
          category: "Department",
          duration: "—",
          views: v.views || 0,
          uploadDate: v.sub || "",
          thumbnail: undefined,
        }));

        const studentPerformance: StudentPerformance[] = topSt.map((s: any) => ({
          name: s.name || "",
          year: s.year || "I",
          score: s.score || 0,
          views: 0,
        }));

        const liveActivities: LiveActivity[] = acts.map((a: any, i: number) => ({
          id: String(a.id ?? i),
          type: a.icon || "play",
          title: a.name || "",
          description: `${a.name || ""} ${a.action || ""}`,
          time: a.time || "",
          badge: a.icon === "check" ? "Completed" : "Watched",
        }));

        const newData: HodDashboardData = {
          summaryCards: {
            students: json.stats?.totalStudents ?? 0,
            videos: json.stats?.totalVideos ?? 0,
            totalViews: json.stats?.totalViews ?? 0,
            monthViews: json.stats?.monthViews ?? 0,
            watchTime: `${json.stats?.totalViews ? json.stats.totalViews * 10 : 0} Mins`,
            activeStudents: json.stats?.activeStudents ?? 0,
            engagementRate: json.stats?.totalStudents ? Math.round(((json.stats?.activeStudents || 0) / json.stats.totalStudents) * 100) : 0,
          },
          dailyViews,
          monthlyViews,
          topCategories: [],
          latestVideos,
          recentViews,
          studentPerformance,
          liveActivities,
          yearDistribution: Array.isArray(json.yearDistribution) ? json.yearDistribution : [],
          departmentName: json.hod?.department || "",
          collegeName: json.hod?.college || "",
          hodName: json.hod?.name || hodDisplayName || "",
        };

        setDashData(newData);
        try {
          sessionStorage.setItem("hod_dash_cache", JSON.stringify(newData));
        } catch (_) { }

        if (json.hod?.name) setHodDisplayName(json.hod.name);
        setLastUpdated(new Date());
      } else {
        setError(json?.message || "Failed to load department analytics.");
      }
    } catch (err: any) {
      setError("Unable to connect to backend server.");
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
      watchTime: "0 Hours", activeStudents: 0, engagementRate: 0,
    },
    dailyViews = [],
    monthlyViews = [],
    latestVideos = [],
    recentViews = [],
    studentPerformance = [],
    liveActivities = [],
    yearDistribution = [],
    departmentName = "",
    collegeName = "",
  } = dashData || {};

  const engagement = s.engagementRate ?? (s.students > 0 ? Math.round(((s.activeStudents || 0) / s.students) * 100) : 0);

  const weeklyViews = useMemo(() => {
    if (monthlyViews && monthlyViews.length > 0) return monthlyViews;
    return buildWeeklyData(dailyViews);
  }, [monthlyViews, dailyViews]);
  const totalMonthlyViews = useMemo(() => weeklyViews.reduce((sum, w) => sum + (w.views || 0), 0), [weeklyViews]);
  const studentDonut = useMemo(() => buildStudentDonut(yearDistribution ?? [], studentPerformance ?? []), [yearDistribution, studentPerformance]);
  const totalDonutStudents = studentDonut.reduce((sum, d) => sum + d.value, 0);

  const filteredStudentPerformance = useMemo(() => {
    if (!searchQuery.trim()) return studentPerformance ?? [];
    const q = searchQuery.toLowerCase();
    return (studentPerformance ?? []).filter(
      (d) => (d?.name || "").toLowerCase().includes(q) || (d?.year || "").toLowerCase().includes(q)
    );
  }, [studentPerformance, searchQuery]);

  const filteredLatestVideos = useMemo(() => {
    if (!searchQuery.trim()) return latestVideos ?? [];
    const q = searchQuery.toLowerCase();
    return (latestVideos ?? []).filter((v) => (v?.title || "").toLowerCase().includes(q) || (v?.category || "").toLowerCase().includes(q));
  }, [latestVideos, searchQuery]);

  const filteredRecentViews = useMemo(() => {
    if (!searchQuery.trim()) return recentViews ?? [];
    const q = searchQuery.toLowerCase();
    return (recentViews ?? []).filter(
      (r) => (r?.student || "").toLowerCase().includes(q) || (r?.video || "").toLowerCase().includes(q)
    );
  }, [recentViews, searchQuery]);

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
      label: "Total Videos",
      value: s.videos.toLocaleString(),
      subtext: "Published course videos",
      icon: Video,
      tone: "violet",
      trend: "",
    },
    {
      label: "Active Students",
      value: String(s.activeStudents || 0),
      subtext: "Engaged this week",
      icon: GraduationCap,
      tone: "teal",
      trend: "",
    },
    {
      label: "Video Views (This Month)",
      value: (s.monthViews ?? s.totalViews ?? 0).toLocaleString(),
      subtext: `${(s.totalViews ?? 0).toLocaleString()} total watch sessions`,
      icon: Eye,
      tone: "amber",
      trend: "",
    },
  ];

  return (
    <div className="dash-corp-main hod-dash-container">
      {/* ===== TOP HEADER ===== */}
      <header className="dash-corp-header">
        {/* Brand */}
        <div className="dash-header-brand">
          <div className="dash-corp-logo">HD</div>
          <div>
            <h1 className="dash-header-title">HOD Dashboard</h1>
            <span className="dash-header-subtitle">
              {departmentName ? `${departmentName} — ${collegeName}` : "Department Analytics Portal"}
            </span>
          </div>
        </div>

        {/* Search — center */}
        <div className="dash-search-container">
          <Search size={16} className="search-icon" />
          <input
            id="hod-dashboard-search"
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
              className="dash-profile-trigger"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <div className="dash-profile-avatar"><User size={15} /></div>
              <div className="dash-profile-info">
                <span className="profile-name">{hodDisplayName}</span>
                <span className="profile-role">Head of Department</span>
              </div>
              <ChevronDown size={13} className={`profile-arrow ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`dash-profile-dropdown ${profileOpen ? "open" : ""}`}>
              <a href="/hod/students" onClick={() => setProfileOpen(false)}><Users size={14} /> My Students</a>
              <a href="/hod/videos" onClick={() => setProfileOpen(false)}><Video size={14} /> Videos</a>
              <div className="dropdown-divider" />
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
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
            {/* Skeleton Banner */}
            <div className="dash-skeleton-banner skeleton-shimmer" />

            {/* Skeleton KPI Grid */}
            <div className="dash-skeleton-kpi-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="dash-skeleton-kpi-card skeleton-shimmer" />
              ))}
            </div>

            {/* Skeleton Charts Row */}
            <div className="dash-skeleton-charts-row">
              <div className="dash-skeleton-chart-large skeleton-shimmer" />
              <div className="dash-skeleton-chart-small skeleton-shimmer" />
            </div>

            {/* Skeleton Tables Row */}
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
                  <span>Department Management Portal</span>
                </div>
                <h2>Welcome back, {hodDisplayName} 👋</h2>
                <p>{departmentName ? `Managing ${departmentName} — ${collegeName}` : "Here's what's happening in your department today."}</p>
              </div>
              <div className="banner-date-pill">
                <span className="banner-date-icon">📅</span>
                <div>
                  <span className="banner-date-value">
                    {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="banner-date-day">
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
                    <div className="kpi-card-body">
                      <div className="kpi-card-value">{card.value}</div>
                      <div className="kpi-card-label">{card.label}</div>
                      <div className="kpi-card-sub">{card.subtext}</div>
                    </div>
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

            {/* ===== CHARTS ROW 1 ===== */}
            <section className="dash-charts-row">

              {/* Student Engagement Area Chart */}
              <div className="corp-card chart-card chart-wide">
                <div className="corp-card-header">
                  <div>
                    <h3><TrendingUp size={17} className="header-icon" style={{ color: "#4f46e5" }} /> Student Engagement Overview</h3>
                    <p className="card-subtitle">Video watch activity (Last 7 Days)</p>
                  </div>
                  <span className="chart-badge">7 Days</span>
                </div>
                <div className="chart-container">
                  {dailyViews.length === 0 || dailyViews.every(d => (d.views || 0) === 0) ? (
                    <div className="light-students-year-empty">
                      <div className="light-students-year-empty-icon">📈</div>
                      <div className="light-students-year-empty-title">No Engagement Data Available</div>
                      <div className="light-students-year-empty-sub">No video watch activity recorded in the last 7 days.</div>
                      <div className="light-students-year-empty-hint">Activity will appear automatically when students watch videos.</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={dailyViews} margin={{ top: 32, right: 32, left: 6, bottom: 6 }}>
                        <defs>
                          <linearGradient id="hodEngageGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--p-border-table)" vertical={false} />
                        <XAxis
                          dataKey="day"
                          interval={0}
                          tick={{ fontSize: 11, fill: "var(--p-text-muted)" }}
                          axisLine={false}
                          tickLine={false}
                          dy={6}
                        />
                        <YAxis
                          domain={[0, (dataMax: number) => (dataMax > 0 ? Math.ceil(dataMax * 1.2) : "auto")]}
                          tickFormatter={formatCompactNumber}
                          tick={{ fontSize: 11, fill: "var(--p-text-muted)" }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                          width={44}
                          dx={-4}
                        />
                        <Tooltip content={<ViewsTooltip />} allowEscapeViewBox={{ x: false, y: false }} />
                        <Area
                          type="monotone"
                          dataKey="views"
                          stroke="#4f46e5"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#hodEngageGrad)"
                          dot={{ r: 4, fill: "#4f46e5", stroke: "#ffffff", strokeWidth: 2 }}
                          activeDot={{ r: 6, fill: "#6366f1", stroke: "#ffffff", strokeWidth: 2 }}
                        >
                          <LabelList
                            dataKey="views"
                            position="top"
                            offset={10}
                            fill="var(--p-text-primary)"
                            fontSize={11}
                            fontWeight={700}
                            formatter={(val: any) => (Number(val) > 0 ? formatCompactNumber(Number(val)) : "")}
                          />
                        </Area>
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* ===== STUDENTS BY YEAR DONUT (SCOPED UNIQUE UI) ===== */}
              <div className="corp-card chart-card light-students-year-card">
                <div className="corp-card-header light-students-year-header">
                  <div>
                    <h3><Users size={17} className="header-icon" style={{ color: "#3b82f6" }} /> Students by Year</h3>
                    <p className="card-subtitle">Year-wise student distribution</p>
                  </div>
                </div>
                <div className="light-students-year-chart-container">
                  {studentDonut.length === 0 || totalDonutStudents === 0 ? (
                    <div className="light-students-year-empty">
                      <div className="light-students-year-empty-icon">👨‍🎓</div>
                      <div className="light-students-year-empty-title">No Student Data Available</div>
                      <div className="light-students-year-empty-sub">No students have been added yet.</div>
                      <div className="light-students-year-empty-hint">The chart will appear automatically when data becomes available.</div>
                    </div>
                  ) : (
                    <div className="light-students-year-wrapper">
                      <div className="light-students-year-chart">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={studentDonut.filter((d) => d.value > 0)}
                              dataKey="value"
                              nameKey="name"
                              innerRadius={42}
                              outerRadius={68}
                              paddingAngle={3}
                            >
                              {studentDonut.filter((d) => d.value > 0).map((entry) => (
                                <Cell key={entry.name} fill={entry.color} stroke="var(--p-bg-card)" strokeWidth={2} />
                              ))}
                            </Pie>
                            <Tooltip content={<CategoryTooltip />} allowEscapeViewBox={{ x: true, y: true }} wrapperStyle={{ zIndex: 1000 }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="light-students-year-center-label">
                          <span className="light-students-year-center-value">{(s.students || totalDonutStudents).toLocaleString()}</span>
                          <span className="light-students-year-center-sub">Students</span>
                        </div>
                      </div>
                      <div className="light-students-year-legend">
                        {studentDonut.map((d) => {
                          const total = s.students || totalDonutStudents;
                          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
                          return (
                            <div className="light-students-year-legend-item" key={d.name} title={`${d.name}`}>
                              <span className="light-students-year-legend-dot" style={{ background: d.color }} />
                              <span className="light-students-year-legend-name">{d.name}</span>
                              <span className="light-students-year-legend-val">{pct}% ({d.value})</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Views Bar Chart (Weekly) */}
              <div className="corp-card chart-card">
                <div className="corp-card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", margin: 0, whiteSpace: "nowrap" }}>
                      <BarChart3 size={17} className="header-icon" style={{ color: "#3b82f6" }} /> Monthly Video Views
                    </h3>
                  </div>
                  <span className="chart-badge" style={{ whiteSpace: "nowrap", flexShrink: 0, padding: "4px 12px" }}>This Month</span>
                </div>
                <div className="chart-container">
                  {weeklyViews.length === 0 ? (
                    <div className="light-students-year-empty">
                      <div className="light-students-year-empty-icon">📊</div>
                      <div className="light-students-year-empty-title">No Video View Data Available</div>
                      <div className="light-students-year-empty-sub">No monthly video views have been recorded yet.</div>
                      <div className="light-students-year-empty-hint">The chart will appear automatically when students watch videos.</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={weeklyViews} margin={{ top: 28, right: 16, left: -12, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--p-border-table)" vertical={false} />
                        <XAxis
                          dataKey="week"
                          interval={0}
                          tickFormatter={(val: string) => (val.startsWith("Week ") ? `W${val.replace("Week ", "")}` : val)}
                          tick={{ fontSize: 11, fontWeight: 600, fill: "var(--p-text-muted)" }}
                          axisLine={false}
                          tickLine={false}
                          dy={4}
                        />
                        <YAxis
                          domain={[0, (dataMax: number) => (dataMax > 0 ? Math.ceil(dataMax * 1.2) : "auto")]}
                          tickFormatter={formatCompactNumber}
                          tick={{ fontSize: 11, fill: "var(--p-text-muted)" }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                          width={40}
                          dx={-4}
                        />
                        <Tooltip content={<BarTooltip />} cursor={{ fill: "var(--p-indigo-soft)" }} allowEscapeViewBox={{ x: false, y: false }} />
                        <Bar dataKey="views" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={44}>
                          <LabelList
                            dataKey="views"
                            position="top"
                            offset={8}
                            fill="var(--p-text-primary)"
                            fontSize={11}
                            fontWeight={700}
                            formatter={(val: any) => formatCompactNumber(Number(val))}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </section>

            {/* ===== ACTIVITY & TABLES GRID ===== */}
            <section className="dash-tables-grid">
              {/* Real-time Activity Stream Card */}
              <div className="corp-card live-activity-card light-activity-card">
                <div className="corp-card-header light-activity-header">
                  <h3><Activity size={18} className="header-icon" style={{ color: "#4f46e5" }} /> Activity Stream</h3>
                  <span className="header-badge live-dot-badge light-activity-live-badge"><span className="pulse-dot" /> Live</span>
                </div>
                <div className="activity-feed-list light-activity-list">
                  {liveActivities.length === 0 ? (
                    <div className="light-activity-empty">
                      <div className="light-activity-empty-icon">📈</div>
                      <div className="light-activity-empty-title">No Recent Activity</div>
                      <div className="light-activity-empty-sub">No student activity has been recorded yet.</div>
                      <div className="light-activity-empty-hint">Activity will appear here automatically when students start watching videos.</div>
                    </div>
                  ) : (
                    liveActivities.slice(0, 4).map((act) => (
                      <div key={act.id} className="feed-item light-activity-item">
                        <div className="feed-icon-dot light-activity-icon-dot"><CheckCircle2 size={14} /></div>
                        <div className="feed-body light-activity-body">
                          <div className="feed-title light-activity-title">{act.description}</div>
                          <div className="feed-meta light-activity-meta">
                            <span className="feed-badge light-activity-badge">{act.badge}</span>
                            <span className="feed-time light-activity-time">{act.time}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              {/* Latest Published Videos Table Card */}
              <div className="corp-card table-card-corp light-latest-videos-card">
                <div className="corp-card-header light-latest-videos-header">
                  <div>
                    <h3><PlayCircle size={18} className="header-icon" style={{ color: "#4f46e5" }} /> Latest Published Videos</h3>
                    <p className="card-subtitle">Recently uploaded educational videos</p>
                  </div>
                  <span className="table-count-badge light-latest-videos-badge">{filteredLatestVideos.length} Videos</span>
                </div>

                {filteredLatestVideos.length === 0 ? (
                  <div className="light-latest-videos-empty">
                    <div className="light-latest-videos-empty-icon">📹</div>
                    <div className="light-latest-videos-empty-title">No Videos Available</div>
                  </div>
                ) : (
                  <div className="corp-table-wrap light-latest-videos-table-wrap">
                    <table className="corp-table light-latest-videos-table">
                      <thead>
                        <tr>
                          <th style={{ width: 70 }}>Media</th>
                          <th>Video Title</th>
                          <th>Category</th>
                          <th style={{ width: 80, textAlign: "right" }}>Views</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLatestVideos.map((video, idx) => (
                          <tr key={`${video.title}-${idx}`} className="light-latest-videos-row">
                            <td style={{ width: 70 }}>
                              <div className="table-media-thumb">
                                <div className="table-media-fallback" style={{ display: "flex" }}>
                                  <PlayCircle size={18} />
                                </div>
                              </div>
                            </td>
                            <td style={{ fontWeight: 600, color: "var(--p-text-primary)" }}>{video.title}</td>
                            <td><span className="table-cat-badge">{video.category}</span></td>
                            <td style={{ fontWeight: 600, textAlign: "right" }}>{video.views.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}