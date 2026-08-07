"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Users,
  UserCheck,
  Video,
  Eye,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Download,
  Calendar,
  Building2,
  User,
  ChevronDown,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Award
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
import "./performance.css";

/* ═══════════════════════════ Types ═══════════════════════════ */

type HodUser = {
  id?: string;
  name: string;
  department: string;
  college?: string;
};

type StatsSummary = {
  totalStudents: number;
  activeStudents: number;
  totalVideos: number;
  totalViews: number;
  avgWatchTimeMinutes: number;
  completionRate: number;
};

type DayPoint = { label: string; value: number };

type VideoSlice = { name: string; value: number; percent: number; color: string };

type StudentRow = {
  id: number;
  name: string;
  videosWatched: number;
  videosTotal: number;
  watchTimeMinutes: number;
  completion: number;
  lastActivity: string;
};

type PerformancePayload = {
  hod: HodUser;
  dateRange: string;
  stats: StatsSummary;
  videoViewsWeek: DayPoint[];
  mostWatchedVideos: VideoSlice[];
  weeklyActiveStudents: DayPoint[];
  students: StudentRow[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

const AVATAR_COLORS = [
  "#4f46e5", "#10b981", "#f59e0b", "#8b5cf6",
  "#0d9488", "#ec4899", "#3b82f6", "#06b6d4",
];
const avatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];
const initials = (name: string) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

function formatWatchTime(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}

/* Custom Tooltips */
function ViewsTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip-glass">
        <p className="chart-tooltip-title">{label}</p>
        <p className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ background: "#4f46e5" }} />
          <span>Views: <strong>{payload[0].value.toLocaleString()}</strong></span>
        </p>
      </div>
    );
  }
  return null;
}

function ActiveStudentsTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="light-weekly-active-tooltip">
        <p className="light-weekly-active-tooltip-title">{label}</p>
        <p className="light-weekly-active-tooltip-row">
          <span className="light-weekly-active-tooltip-dot" />
          <span>Active Students: <strong>{payload[0].value}</strong></span>
        </p>
      </div>
    );
  }
  return null;
}

function DonutTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="chart-tooltip-glass">
        <p className="chart-tooltip-title">{data.name}</p>
        <p className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ background: data.payload.color }} />
          <span>Views: <strong>{data.value.toLocaleString()}</strong> ({data.payload.percent}%)</span>
        </p>
      </div>
    );
  }
  return null;
}

export default function HodPerformancePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [payload, setPayload] = useState<PerformancePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const tickColor = isDark ? "#94a3b8" : "#475569";

  useEffect(() => {
    const loadPerformance = async () => {
      setLoading(true);
      setError(null);

      const savedHod = typeof window !== "undefined" ? localStorage.getItem("hod") || sessionStorage.getItem("hod") : null;
      let hodId = "";

      if (savedHod) {
        try {
          const parsed = JSON.parse(savedHod);
          hodId = parsed?.id || "";
        } catch (err) {
          console.error("Failed to parse saved HOD data:", err);
        }
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (hodId) headers["X-Hod-Id"] = String(hodId);

      try {
        const response = await fetch(`${API_BASE}/api/hod/performance/`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

        const json = await response.json();
        if (!json || json.status !== "success") throw new Error(json?.message || "Unable to load performance data.");

        setPayload(json);
      } catch (err: any) {
        console.error("Failed to load HOD performance:", err);
        setError(err.message || "Failed to fetch department performance analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadPerformance();
  }, []);

  const hod = payload?.hod ?? { name: "HOD", department: "Department" };
  const dateRange = payload?.dateRange ?? "Last 7 Days";
  const stats = payload?.stats ?? {
    totalStudents: 0,
    activeStudents: 0,
    totalVideos: 0,
    totalViews: 0,
    avgWatchTimeMinutes: 0,
    completionRate: 0,
  };

  const videoViewsWeek = payload?.videoViewsWeek ?? [];
  const weeklyActiveStudents = payload?.weeklyActiveStudents ?? [];
  const rawStudents = payload?.students ?? [];

  const students: StudentRow[] = rawStudents.map((s: any) => ({
    id: s.id ?? Math.random(),
    name: s.name || "Student",
    videosWatched: s.videosWatched ?? 0,
    videosTotal: s.videosTotal ?? 0,
    watchTimeMinutes: s.watchTimeMinutes ?? 0,
    completion: s.completion ?? 0,
    lastActivity: s.lastActivity || "No activity",
  }));

  const rawMostWatched = payload?.mostWatchedVideos ?? [];
  const totalWatchedViews = rawMostWatched.reduce((sum: number, v: any) => sum + (v.value ?? 0), 0) || 1;

  const palette = ["#4f46e5", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
  const mostWatchedVideos: VideoSlice[] = rawMostWatched.map((v: any, i: number) => {
    const val = v.value ?? 0;
    const pct = v.percent ?? Math.round((val / totalWatchedViews) * 100);
    return {
      name: v.name ?? v.title ?? "Video",
      value: val,
      percent: pct,
      color: v.color || palette[i % palette.length],
    };
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.name.toLowerCase().includes(q));
  }, [students, search]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const safePage = Math.min(page, totalPages);
  const slice = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  const maxVideosWatched = useMemo(() => {
    return Math.max(...students.map((s) => s.videosTotal || s.videosWatched || 1), 1);
  }, [students]);

  const goPage = (p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <div className="dash-main hod-perf-container">
      <div className="dash-content">
        
        <div className="dash-welcome-banner mb-8">
          <div className="banner-content">
            <Link href="/hod/dashboard" className="banner-badge hover:underline">
              <ChevronLeft size={13} />
              <span>Back to Dashboard</span>
            </Link>
            <h2>Department Performance Analytics</h2>
            <p>Comprehensive video engagement, student completion rates, and learning metrics for {hod.department}.</p>
          </div>
        </div>

        {error && (
          <div className="dash-error-banner mb-6">
            <Activity size={18} />
            <span>{error}</span>
          </div>
        )}

        <section className="kpi-cards-grid mb-8">
          <div className="kpi-card kpi-indigo">
            <div className="kpi-card-top">
              <div className="kpi-icon-box kpi-icon-indigo"><Users size={22} /></div>
              <span className="kpi-trend-pill">+12%</span>
            </div>
            <div className="kpi-card-value">{stats.totalStudents.toLocaleString()}</div>
            <div className="kpi-card-label">Total Department Students</div>
            <div className="kpi-card-sub">Enrolled learners in department</div>
          </div>

          <div className="kpi-card kpi-teal">
            <div className="kpi-card-top">
              <div className="kpi-icon-box kpi-icon-teal"><UserCheck size={22} /></div>
              <span className="kpi-trend-pill">+8%</span>
            </div>
            <div className="kpi-card-value">{stats.activeStudents.toLocaleString()}</div>
            <div className="kpi-card-label">Active Learners</div>
            <div className="kpi-card-sub">Watched at least 1 video</div>
          </div>

          <div className="kpi-card kpi-violet">
            <div className="kpi-card-top">
              <div className="kpi-icon-box kpi-icon-violet"><Video size={22} /></div>
            </div>
            <div className="kpi-card-value">{stats.totalVideos.toLocaleString()}</div>
            <div className="kpi-card-label">Department Videos</div>
            <div className="kpi-card-sub">Published video lectures</div>
          </div>

          <div className="kpi-card kpi-amber">
            <div className="kpi-card-top">
              <div className="kpi-icon-box kpi-icon-amber"><Eye size={22} /></div>
              <span className="kpi-trend-pill">+24%</span>
            </div>
            <div className="kpi-card-value">{stats.totalViews.toLocaleString()}</div>
            <div className="kpi-card-label">Total Video Views</div>
            <div className="kpi-card-sub">Cumulative watch sessions</div>
          </div>
        </section>

        <section className="dash-charts-row mb-8">
          
          <div className="corp-card chart-card chart-wide">
            <div className="corp-card-header">
              <div>
                <h3><TrendingUp size={17} className="header-icon" style={{ color: "#4f46e5" }} /> Video Views Trend</h3>
                <p className="card-subtitle">Daily video watch count over time</p>
              </div>
              <span className="chart-badge">{dateRange}</span>
            </div>
            <div className="chart-container">
              {videoViewsWeek.length === 0 ? (
                <div className="chart-empty-state">No video view data logged.</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={videoViewsWeek} margin={{ top: 8, right: 12, left: -24, bottom: 0 }}>
                    <defs>
                      <linearGradient id="perfViewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--p-border-table)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<ViewsTooltip />} cursor={{ stroke: "var(--p-border)" }} />
                    <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#perfViewsGrad)"
                      dot={{ r: 4, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ===== MOST WATCHED VIDEOS CARD (SCOPED UNIQUE UI) ===== */}
          <div className="corp-card chart-card light-most-watched-card">
            <div className="corp-card-header light-most-watched-header">
              <div>
                <h3><PieIcon size={17} className="header-icon" style={{ color: "#3b82f6" }} /> Most Watched Videos</h3>
                <p className="card-subtitle">Popular video share</p>
              </div>
            </div>

            <div className="light-most-watched-chart-container">
              {mostWatchedVideos.length === 0 || stats.totalViews === 0 ? (
                <div className="light-most-watched-empty">
                  <div className="light-most-watched-empty-icon">📊</div>
                  <div className="light-most-watched-empty-title">No Data Available</div>
                  <div className="light-most-watched-empty-sub">No video analytics available yet.</div>
                </div>
              ) : (
                <div className="light-most-watched-wrapper">
                  <div className="light-most-watched-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={mostWatchedVideos} dataKey="value" nameKey="name" innerRadius={44} outerRadius={68} paddingAngle={4}>
                          {mostWatchedVideos.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} stroke="var(--p-bg-card)" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip content={<DonutTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="light-most-watched-center-label">
                      <span className="light-most-watched-center-value">{stats.totalViews.toLocaleString()}</span>
                      <span className="light-most-watched-center-sub">Views</span>
                    </div>
                  </div>

                  <div className="light-most-watched-legend">
                    {mostWatchedVideos.map((d) => (
                      <div className="light-most-watched-legend-item" key={d.name} title={d.name}>
                        <span className="light-most-watched-legend-dot" style={{ background: d.color }} />
                        <span className="light-most-watched-legend-name">{d.name}</span>
                        <span className="light-most-watched-legend-val">{d.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===== WEEKLY ACTIVE LEARNERS CARD (SCOPED UNIQUE UI) ===== */}
          <div className="corp-card chart-card light-weekly-active-card">
            <div className="corp-card-header light-weekly-active-header">
              <div>
                <h3><BarChart3 size={17} className="header-icon" style={{ color: "#0d9488" }} /> Weekly Active Learners</h3>
                <p className="card-subtitle">Active student participation</p>
              </div>
            </div>
            <div className="light-weekly-active-chart">
              {weeklyActiveStudents.length === 0 || weeklyActiveStudents.every((d: any) => d.value === 0) ? (
                <div className="light-weekly-active-empty">
                  <div className="light-weekly-active-empty-icon">📊</div>
                  <div className="light-weekly-active-empty-title">No Data Available</div>
                  <div className="light-weekly-active-empty-sub">No student activity logged for this week.</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={weeklyActiveStudents} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--p-border-table)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<ActiveStudentsTooltip />} cursor={{ fill: "rgba(13, 148, 136, 0.12)" }} />
                    <Bar dataKey="value" fill="#0d9488" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </section>

        {/* ===== STUDENT PERFORMANCE OVERVIEW CARD (SCOPED UNIQUE UI) ===== */}
        <section className="corp-card table-card-corp light-student-performance-card mb-8">
          <div className="corp-card-header light-student-performance-header">
            <div>
              <h3><Award size={18} className="header-icon" style={{ color: "#4f46e5" }} /> Student Performance Overview</h3>
              <p className="card-subtitle">Individual student video completion rates and watch duration</p>
            </div>

            <div className="light-student-performance-actions">
              <div className="light-student-performance-search-wrap">
                <Search size={15} className="light-student-performance-search-icon" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search student..."
                  className="light-student-performance-search-input"
                />
              </div>

              <span className="light-student-performance-badge">
                {filtered.length} Students
              </span>
            </div>
          </div>

          <div className="light-student-performance-table-wrap">
            <table className="light-student-performance-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student Name</th>
                  <th>Videos Watched</th>
                  <th>Total Watch Time</th>
                  <th>Completion Rate</th>
                  <th>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {slice.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="light-student-performance-empty-cell">
                      <div className="light-student-performance-empty">
                        <div className="light-student-performance-empty-icon">📊</div>
                        <div className="light-student-performance-empty-title">No Student Performance Data</div>
                        <div className="light-student-performance-empty-sub">No student performance records found.</div>
                        <div className="light-student-performance-empty-hint">Data will appear here once students start watching videos.</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  slice.map((s, idx) => (
                    <tr key={s.id} className="light-student-performance-row">
                      <td style={{ fontWeight: 700, color: "var(--p-text-muted)", width: 60 }}>
                        #{(safePage - 1) * pageSize + idx + 1}
                      </td>
                      <td>
                        <div className="student-cell-profile">
                          <div className="avatar-circle" style={{ background: avatarColor(s.id) }}>
                            {initials(s.name)}
                          </div>
                          <span style={{ fontWeight: 600, color: "var(--p-text-primary)" }}>{s.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="table-dur-badge" style={{ fontWeight: 600 }}>
                          {s.videosWatched} / {s.videosTotal} Videos
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: "var(--p-text-primary)" }}>
                          {formatWatchTime(s.watchTimeMinutes)}
                        </span>
                      </td>
                      <td style={{ width: 180 }}>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden dark:bg-slate-800" style={{ background: "var(--p-bg-subtle)" }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, s.completion)}%`,
                                background: s.completion >= 75 ? "#10b981" : s.completion >= 50 ? "#f59e0b" : "#ef4444"
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold w-9 text-right" style={{ color: "var(--p-text-primary)" }}>
                            {s.completion}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="text-xs" style={{ color: "var(--p-text-muted)" }}>
                          {s.lastActivity}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="light-student-performance-footer">
            <span className="light-student-performance-showing">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1} to {Math.min(safePage * pageSize, filtered.length)} of {filtered.length} students
            </span>

            <div className="light-student-performance-pagination">
              <button
                onClick={() => goPage(safePage - 1)}
                disabled={safePage === 1}
                className="light-student-performance-page-btn"
              >
                Previous
              </button>

              <span className="light-student-performance-page-text">
                Page {safePage} of {totalPages}
              </span>

              <button
                onClick={() => goPage(safePage + 1)}
                disabled={safePage === totalPages}
                className="light-student-performance-page-btn"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}