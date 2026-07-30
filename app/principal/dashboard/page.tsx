"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  GraduationCap,
  Video,
  Eye,
  Clock,
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
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  ArrowUpRight,
  ShieldCheck,
  Award,
  BarChart3,
  Share2,
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
  Legend,
  BarChart,
  Bar,
} from "recharts";
import "./Principaldashboard.css";

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

interface DeptPerformance {
  name: string;
  code: string;
  students: number;
  views: number;
  completionRate: number;
  hod?: string;
}

interface LiveActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  badge: string;
}

interface DashboardData {
  summaryCards: {
    students: number;
    videos: number;
    totalViews: number;
    watchTime: string;
    activeStudents?: number;
    engagementRate?: number;
    totalDepartments?: number;
  };
  dailyViews: DailyView[];
  topCategories: CategorySlice[];
  latestVideos: UploadedVideo[];
  recentViews: RecentView[];
  departmentPerformance?: DeptPerformance[];
  liveActivities?: LiveActivity[];
  collegeName?: string;
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

/* Build weekly bar data from daily views */
function buildWeeklyData(dailyViews: DailyView[]) {
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
}

/* Build department donut from departmentPerformance */
function buildDeptDonut(depts: DeptPerformance[]) {
  const palette = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#94a3b8"];
  return depts.slice(0, 5).map((d, i) => ({
    name: d.code || d.name,
    fullName: d.name,
    value: d.students,
    color: palette[i] ?? "#94a3b8",
  }));
}

/* --------------------------------- COMPONENT -------------------------------- */

export default function PrincipalDashboard() {
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [principalName, setPrincipalName] = useState<string>("Principal");

  useEffect(() => {
    try {
      const savedPrincipal =
        typeof window !== "undefined"
          ? localStorage.getItem("principal") || sessionStorage.getItem("principal")
          : null;
      if (savedPrincipal) {
        const parsed = JSON.parse(savedPrincipal);
        if (parsed?.name || parsed?.full_name || parsed?.username) {
          setPrincipalName(parsed.name || parsed.full_name || parsed.username);
        }
      }
    } catch (e) {
      console.error("Error reading principal name:", e);
    }
  }, []);

  const [dashData, setDashData] = useState<DashboardData>({
    summaryCards: {
      students: 0,
      videos: 0,
      totalViews: 0,
      watchTime: "0 Hours",
      activeStudents: 0,
      engagementRate: 0,
      totalDepartments: 0,
    },
    dailyViews: [],
    topCategories: [],
    latestVideos: [],
    recentViews: [],
    departmentPerformance: [],
    liveActivities: [],
    collegeName: "",
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let principalId = "";
      try {
        const savedPrincipal =
          typeof window !== "undefined"
            ? localStorage.getItem("principal") || sessionStorage.getItem("principal")
            : null;
        if (savedPrincipal) {
          const parsed = JSON.parse(savedPrincipal);
          principalId = parsed?.id || "";
        }
      } catch (e) {
        console.error("Error reading saved principal:", e);
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (principalId) headers["X-Principal-Id"] = String(principalId);

      const apiBase = typeof window !== "undefined" ? window.location.origin : "http://127.0.0.1:3001";
      const apiUrls = [
        "/api/principal/dashboard/",
        `${apiBase}/api/principal/dashboard/`,
        "http://127.0.0.1:8000/api/principal/dashboard/",
      ];

      let response: Response | null = null;
      let lastError: Error | null = null;

      for (const url of apiUrls) {
        try {
          response = await fetch(url, { method: "GET", headers, credentials: "include" });
          if (response.ok) break;
          lastError = new Error(`Server error: ${response.status}`);
        } catch (fetchErr: any) {
          lastError = fetchErr;
        }
      }

      if (!response || !response.ok) {
        throw new Error(lastError?.message || "Failed to load dashboard data.");
      }
      const json = await response.json();

      if (json.status === "success" && json.data) {
        setDashData(json.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(json.message || "API returned an error");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data.");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const {
    summaryCards: s = {
      students: 0, videos: 0, totalViews: 0,
      watchTime: "0 Hours", activeStudents: 0,
      engagementRate: 0, totalDepartments: 0,
    },
    dailyViews = [],
    topCategories = [],
    latestVideos = [],
    recentViews = [],
    departmentPerformance = [],
    liveActivities = [],
    collegeName = "",
  } = dashData || {};

  const engagement = s.engagementRate ?? (s.students > 0 ? Math.round(((s.activeStudents || 0) / s.students) * 100) : 0);
  const totalDepts = s.totalDepartments ?? departmentPerformance.length;

  const weeklyViews = useMemo(() => buildWeeklyData(dailyViews), [dailyViews]);
  const deptDonut = useMemo(() => buildDeptDonut(departmentPerformance ?? []), [departmentPerformance]);
  const totalDeptStudents = deptDonut.reduce((sum, d) => sum + d.value, 0);

  const filteredDeptPerformance = useMemo(() => {
    if (!searchQuery.trim()) return departmentPerformance;
    const q = searchQuery.toLowerCase();
    return departmentPerformance.filter(
      (d) => d.name.toLowerCase().includes(q) || (d.code && d.code.toLowerCase().includes(q)) || (d.hod && d.hod.toLowerCase().includes(q))
    );
  }, [departmentPerformance, searchQuery]);

  const filteredLatestVideos = useMemo(() => {
    if (!searchQuery.trim()) return latestVideos;
    const q = searchQuery.toLowerCase();
    return latestVideos.filter((v) => v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q));
  }, [latestVideos, searchQuery]);

  const filteredRecentViews = useMemo(() => {
    if (!searchQuery.trim()) return recentViews;
    const q = searchQuery.toLowerCase();
    return recentViews.filter(
      (r) => r.student.toLowerCase().includes(q) || r.department.toLowerCase().includes(q) || r.video.toLowerCase().includes(q)
    );
  }, [recentViews, searchQuery]);

  /* KPI cards below banner */
  const kpiCards = [
    {
      label: "Total Students",
      value: s.students.toLocaleString(),
      subtext: `${s.activeStudents || 0} active learners`,
      icon: Users,
      tone: "indigo",
      trend: "+8.4%",
    },
    {
      label: "Total Departments",
      value: totalDepts.toLocaleString(),
      subtext: "Active academic departments",
      icon: Building2,
      tone: "teal",
      trend: "",
    },
    {
      label: "Total Videos",
      value: s.videos.toLocaleString(),
      subtext: "Published courses & lectures",
      icon: Video,
      tone: "violet",
      trend: "+12 new",
    },
    {
      label: "Engagement / Month",
      value: `${engagement}%`,
      subtext: "Active participation rate",
      icon: TrendingUp,
      tone: "amber",
      trend: "+3.2%",
    },
  ];

  return (
    <div className="dash-corp-main">
      {/* ===== TOP HEADER ===== */}
      <header className="dash-corp-header">
        {/* Brand */}
        <div className="dash-header-brand">
          <div className="dash-corp-logo">CP</div>
          <div>
            <h1 className="dash-header-title">College Dashboard</h1>
            <span className="dash-header-subtitle">
              {collegeName ? `${collegeName}` : "Principal Analytics Portal"}
            </span>
          </div>
        </div>

        {/* Search — center */}
        <div className="dash-search-container">
          <Search size={16} className="search-icon" />
          <input
            id="dashboard-search"
            type="text"
            placeholder="Search students, videos, departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="search-kbd">⌘K</kbd>
        </div>

        {/* Right actions */}
        <div className="dash-header-actions">
          <button
            type="button"
            className="dash-action-btn"
            onClick={fetchDashboardData}
            disabled={loading}
            title="Refresh Dashboard"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            <span className="btn-text">Sync</span>
          </button>

          <div className="dash-notif-btn">
            <Bell size={17} />
            <span className="notif-badge" />
          </div>

          <div className="dash-profile-wrapper">
            <button
              type="button"
              className="dash-profile-trigger"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <div className="dash-profile-avatar"><User size={15} /></div>
              <div className="dash-profile-info">
                <span className="profile-name">{principalName}</span>
                <span className="profile-role">Administrator</span>
              </div>
              <ChevronDown size={13} className="profile-arrow" />
            </button>

            {profileOpen && (
              <div className="dash-profile-dropdown">
                <a href="/principal/principal_profile"><User size={14} /> My Profile</a>
                <a href="/principal/departments"><Building2 size={14} /> Departments</a>
                <a href="/principal/students"><Users size={14} /> Students List</a>
                <div className="dropdown-divider" />
                <button type="button" onClick={() => (window.location.href = "/")}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===== MAIN BODY ===== */}
      <main className="dash-corp-body">

        {/* Welcome Banner */}
        <section className="dash-welcome-banner">
          <div className="banner-content">
            <div className="banner-badge">
              <ShieldCheck size={14} />
              <span>Verified Institutional System</span>
            </div>
            <h2>Welcome back, {principalName} 👋</h2>
            <p>{collegeName || "Here's what's happening in your institution today."}</p>
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

        {/* ===== KPI CARDS — below welcome banner ===== */}
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

        {loading && !lastUpdated ? (
          <div className="dash-loading-state">
            <RefreshCw size={32} className="animate-spin" style={{ color: "var(--p-indigo)" }} />
            <p>Loading dashboard analytics...</p>
          </div>
        ) : (
          <>
            {/* ===== CHARTS ROW 1 — Student Engagement + Students by Dept + Video Views Bar ===== */}
            <section className="dash-charts-row">

              {/* Student Engagement Overview Area Chart */}
              <div className="corp-card chart-card chart-wide">
                <div className="corp-card-header">
                  <div>
                    <h3><TrendingUp size={17} className="header-icon" style={{ color: "#4f46e5" }} /> Student Engagement Overview</h3>
                    <p className="card-subtitle">Video watch activity (Last 7 Days)</p>
                  </div>
                  <span className="chart-badge">7 Days</span>
                </div>
                <div className="chart-container">
                  {dailyViews.length === 0 ? (
                    <div className="chart-empty-state">No engagement data available.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={dailyViews} margin={{ top: 8, right: 12, left: -24, bottom: 0 }}>
                        <defs>
                          <linearGradient id="engageGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--p-border-table)" vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--p-text-muted)" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "var(--p-text-muted)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<ViewsTooltip />} />
                        <Area type="monotone" dataKey="views" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#engageGrad)"
                          dot={{ r: 4, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Students by Department Donut */}
              <div className="corp-card chart-card">
                <div className="corp-card-header">
                  <div>
                    <h3><Users size={17} className="header-icon" style={{ color: "#3b82f6" }} /> Students by Department</h3>
                  </div>
                </div>
                <div className="chart-container donut-chart-box" style={{ position: "relative" }}>
                  {deptDonut.length === 0 ? (
                    <div className="chart-empty-state">No department data.</div>
                  ) : (
                    <>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", height: 220 }}>
                        <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={deptDonut} dataKey="value" nameKey="name" innerRadius={42} outerRadius={68} paddingAngle={3}>
                                {deptDonut.map((entry) => (
                                  <Cell key={entry.name} fill={entry.color} stroke="var(--p-bg-card)" strokeWidth={2} />
                                ))}
                              </Pie>
                              <Tooltip content={<CategoryTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="donut-center-label">
                            <span className="donut-center-value">{totalDeptStudents.toLocaleString()}</span>
                            <span className="donut-center-sub">Students</span>
                          </div>
                        </div>
                        <div className="donut-custom-legend">
                          {deptDonut.map((d) => {
                            const pct = totalDeptStudents > 0 ? Math.round((d.value / totalDeptStudents) * 100) : 0;
                            return (
                              <div className="legend-row-item" key={d.name}>
                                <span className="legend-dot" style={{ background: d.color }} />
                                <span className="legend-name">{d.name}</span>
                                <span className="legend-val">{pct}% ({d.value})</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

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
                    <div className="chart-empty-state">No view data available.</div>
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
            </section>

            {/* ===== QUICK ACTIONS + LIVE ACTIVITY ===== */}
            <section className="dash-insights-grid">
              <div className="corp-card actions-card">
                <div className="corp-card-header">
                  <h3><Zap size={18} className="header-icon" style={{ color: "#f59e0b" }} /> Executive Quick Actions</h3>
                  <span className="header-badge">Shortcuts</span>
                </div>
                <div className="quick-actions-buttons">
                  <a href="/principal/students" className="quick-btn btn-indigo">
                    <GraduationCap size={16} /><span>Manage Students</span>
                  </a>
                  <a href="/principal/departments" className="quick-btn btn-teal">
                    <Building2 size={16} /><span>Department Audit</span>
                  </a>
                  <a href="/principal/video_report" className="quick-btn btn-violet">
                    <Video size={16} /><span>Video Analytics</span>
                  </a>
                  <button onClick={fetchDashboardData} className="quick-btn btn-emerald">
                    <FileSpreadsheet size={16} /><span>Refresh Portal</span>
                  </button>
                </div>
              </div>

              <div className="corp-card live-activity-card">
                <div className="corp-card-header">
                  <h3><Activity size={18} className="header-icon" style={{ color: "#4f46e5" }} /> Real-time Activity Stream</h3>
                  <span className="header-badge live-dot-badge"><span className="pulse-dot" /> Live</span>
                </div>
                <div className="activity-feed-list">
                  {liveActivities.length === 0 ? (
                    <div className="empty-feed">No recent activity logged yet.</div>
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
            </section>

            {/* ===== DEPARTMENT MATRIX ===== */}
            {departmentPerformance.length > 0 && (
              <section className="corp-card dept-matrix-card">
                <div className="corp-card-header">
                  <div>
                    <h3><Building2 size={18} className="header-icon" style={{ color: "#4f46e5" }} /> Department Learning Performance Matrix</h3>
                    <p className="card-subtitle">Comparative breakdown of students, total video views, and video completion progress.</p>
                  </div>
                  <a href="/principal/departments" className="card-header-link">
                    View All Departments <ArrowUpRight size={14} />
                  </a>
                </div>
                <div className="dept-matrix-grid">
                  {filteredDeptPerformance.map((dept) => (
                    <div className="dept-matrix-item" key={dept.name}>
                      <div className="dept-item-top">
                        <div>
                          <span className="dept-code-pill">{dept.code || "DEPT"}</span>
                          <h4 className="dept-title">{dept.name}</h4>
                        </div>
                        <span className="dept-rate-text">{dept.completionRate}% Done</span>
                      </div>
                      <div className="dept-progress-track">
                        <div className="dept-progress-fill" style={{ width: `${Math.min(100, dept.completionRate)}%` }} />
                      </div>
                      <div className="dept-item-bottom">
                        <span><Users size={12} /> {dept.students} Students</span>
                        <span><Eye size={12} /> {dept.views} Views</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ===== TABLES GRID ROW — Recent Activity + Latest Published Videos ===== */}
            <section className="dash-tables-grid">
              {/* =====  TABLE ===== */}
              <div className="corp-card table-card-corp">
                <div className="corp-card-header">
                  <div>
                    <h3><Activity size={18} className="header-icon" style={{ color: "#0d9488" }} /> Recent Activity</h3>
                    <p className="card-subtitle">Real-time log of student video watch sessions</p>
                  </div>
                  <div className="recent-header-actions">
                    <button
                      className="table-refresh-btn"
                      onClick={fetchDashboardData}
                      disabled={loading}
                      title="Refresh Recent Activity"
                    >
                      <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                      />
                    </button>

                    <span className="table-count-badge">
                      {Math.min(filteredRecentViews.length, 4)} Logged
                    </span>

                    <a href="/principal/video_report" className="card-header-link">
                      View All <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
                <div className="corp-table-wrap">
                  <table className="corp-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Dept</th>
                        <th>Activity</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecentViews.length === 0 ? (
                        <tr><td colSpan={4} className="empty-table-cell">No recent student activity found.</td></tr>
                      ) : (
                        filteredRecentViews.slice(0, 4).map((row, idx) => (
                          <tr key={`${row.student}-${idx}`}>
                            <td>
                              <div className="student-cell-profile">
                                <div className="avatar-circle">
                                  {row.student.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
                                </div>
                                <span style={{ fontWeight: 600, color: "var(--p-text-primary)" }}>{row.student}</span>
                              </div>
                            </td>
                            <td><span className="table-dept-pill">{row.department}</span></td>
                            <td style={{ fontWeight: 500, color: "var(--p-text-primary)" }}>Watched: {row.video}</td>
                            <td style={{ color: "var(--p-text-muted)", fontSize: 12.5 }}>{row.lastViewed}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ===== LATEST VIDEOS TABLE ===== */}
              <div className="corp-card table-card-corp">
                <div className="corp-card-header">
                  <div>
                    <h3><PlayCircle size={18} className="header-icon" style={{ color: "#4f46e5" }} /> Latest Published Videos</h3>
                    <p className="card-subtitle">Recently uploaded educational videos</p>
                  </div>
                  <span className="table-count-badge">{filteredLatestVideos.length} Videos</span>
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
                      {filteredLatestVideos.length === 0 ? (
                        <tr><td colSpan={5} className="empty-table-cell">No videos match your filter.</td></tr>
                      ) : (
                        filteredLatestVideos.slice(0, 4).map((video, idx) => (
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
