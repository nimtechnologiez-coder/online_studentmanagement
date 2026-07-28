"use client";

import { useState, useEffect, useCallback } from "react";
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
  LucideIcon,
  RefreshCw,
  AlertCircle,
  Users,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./Principaldashboard.css";

/* ---------------------------------- TYPES ---------------------------------- */

type Tone = "indigo" | "teal" | "amber" | "emerald";

interface SummaryCard {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: Tone;
}

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
}

interface RecentView {
  student: string;
  department: string;
  video: string;
  watchTime: string;
  lastViewed: string;
}

interface DashboardData {
  summaryCards: {
    students: number;
    videos: number;
    totalViews: number;
    watchTime: string;
    activeStudents?: number;
    todayViews?: number;
  };
  dailyViews: DailyView[];
  topCategories: CategorySlice[];
  latestVideos: UploadedVideo[];
  recentViews: RecentView[];
}

/* --------------------------------- HELPERS --------------------------------- */

function ViewsTooltip(props: any) {
  const { active, payload, label } = props;
  if (!active || !payload || !payload.length) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-title">{label}</p>
      <p className="chart-tooltip-row">
        <span className="chart-tooltip-dot" style={{ background: "#3730a3" }} />
        Views: <strong>{Number(value).toLocaleString()}</strong>
      </p>
    </div>
  );
}

function CategoryTooltip(props: any) {
  const { active, payload } = props;
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  const color = item?.payload?.color ?? "#64748b";
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-row">
        <span className="chart-tooltip-dot" style={{ background: color }} />
        {item.name}: <strong>{item.value}</strong>
      </p>
    </div>
  );
}

function EmptyTableRow({ cols, message }: { cols: number; message: string }) {
  return (
    <tr>
      <td colSpan={cols} style={{ textAlign: "center", padding: "32px 16px", color: "#94a3b8", fontSize: "13px" }}>
        {message}
      </td>
    </tr>
  );
}

/* --------------------------------- COMPONENT -------------------------------- */

export default function PrincipalDashboard() {
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [dashData, setDashData] = useState<DashboardData>({
    summaryCards: { students: 0, videos: 0, totalViews: 0, watchTime: "0 Hours", activeStudents: 0, todayViews: 0 },
    dailyViews: [],
    topCategories: [],
    latestVideos: [],
    recentViews: [],
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let principalId = "";
      try {
        const savedPrincipal = typeof window !== "undefined" ? (localStorage.getItem("principal") || sessionStorage.getItem("principal")) : null;
        if (savedPrincipal) {
          const parsed = JSON.parse(savedPrincipal);
          principalId = parsed?.id || "";
        }
      } catch (e) {
        console.error("Error reading saved principal:", e);
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (principalId) {
        headers["X-Principal-Id"] = String(principalId);
      }

      let response: Response;
      try {
        response = await fetch("/api/principal/dashboard/", {
          method: "GET",
          headers,
          credentials: "include",
        });
      } catch (fetchErr) {
        // Fallback to absolute URL if relative path fails in client context
        response = await fetch("http://127.0.0.1:8000/api/principal/dashboard/", {
          method: "GET",
          headers,
          credentials: "include",
        });
      }
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const json = await response.json();

      if (json.status === "success") {
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
    summaryCards: s = { students: 0, videos: 0, totalViews: 0, watchTime: "0 Hours", activeStudents: 0, todayViews: 0 },
    dailyViews = [],
    topCategories = [],
    latestVideos = [],
    recentViews = []
  } = dashData || {};

  const cards: SummaryCard[] = [
    { label: "Total Students", value: s.students.toString(), icon: GraduationCap, tone: "indigo" },
    { label: "Total Videos", value: s.videos.toString(), icon: Video, tone: "teal" },
    { label: "Total Views", value: s.totalViews.toLocaleString(), icon: Eye, tone: "amber" },
    { label: "Watch Time", value: s.watchTime, icon: Clock, tone: "emerald" },
  ];

  if (s.activeStudents !== undefined) {
    cards.splice(1, 0, {
      label: "Active Students",
      value: s.activeStudents.toString(),
      icon: Users,
      tone: "teal",
    });
  }

  return (
    <div className="dash-main">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-left">
          <div className="dash-logo-mark">CP</div>
          <span className="dash-header-title">College Video Learning Portal</span>
        </div>

        <div className="dash-search">
          <Search size={17} strokeWidth={1.8} />
          <input type="text" placeholder="Search students, videos, departments..." />
        </div>

        <div className="dash-header-right">
          <button
            type="button"
            className="dash-icon-btn"
            onClick={fetchDashboardData}
            aria-label="Refresh dashboard"
            title="Refresh"
            disabled={loading}
          >
            <RefreshCw size={17} strokeWidth={1.8} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          </button>

          <button type="button" className="dash-icon-btn" aria-label="Notifications">
            <Bell size={19} strokeWidth={1.8} />
            <span className="dash-notif-dot" />
          </button>

          <div className="dash-profile">
            <button
              type="button"
              className="dash-profile-btn"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <div className="dash-avatar">
                <User size={18} strokeWidth={1.8} />
              </div>
              <ChevronDown size={16} strokeWidth={1.8} />
            </button>

            {profileOpen && (
              <div className="dash-profile-menu">
                <a href="/principal/profile">My Profile</a>
                <a href="/principal/settings">Settings</a>
                <button type="button">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="dash-content">
        <div className="dash-page-title">
          <div>
            <h2>Welcome, Principal</h2>
            <p>Monitor students&apos; video learning progress.</p>
          </div>
          {lastUpdated && (
            <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "12px 16px", marginBottom: "16px",
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: "8px", color: "#dc2626", fontSize: "13px"
          }}>
            <AlertCircle size={15} />
            {error}
            <button
              onClick={fetchDashboardData}
              style={{ marginLeft: "auto", fontSize: "12px", color: "#dc2626", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "#94a3b8" }}>
            <RefreshCw size={28} style={{ animation: "spin 1s linear infinite", marginBottom: "12px" }} />
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <section className="summary-grid">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <div className="summary-card" key={card.label}>
                    <div className={`summary-icon tone-${card.tone}`}>
                      <Icon size={20} strokeWidth={1.8} />
                    </div>
                    <div className="summary-body">
                      <span className="summary-value">{card.value}</span>
                      <span className="summary-label">{card.label}</span>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Charts row */}
            <section className="charts-grid">
              {/* Line chart — Daily Views */}
              <div className="card">
                <div className="card-header">
                  <h3>Daily Video Views (Last 7 Days)</h3>
                </div>
                <div className="chart-wrap">
                  {dailyViews.length === 0 ? (
                    <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "13px" }}>
                      No view data yet
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={dailyViews} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke="#eef2f7" vertical={false} />
                        <XAxis
                          dataKey="day"
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          axisLine={{ stroke: "#e2e8f0" }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          axisLine={false}
                          tickLine={false}
                          width={44}
                          allowDecimals={false}
                        />
                        <Tooltip content={<ViewsTooltip />} cursor={{ stroke: "#c7d2fe", strokeWidth: 1 }} />
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="#3730a3"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: "#3730a3" }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Pie chart — Top Categories */}
              <div className="card">
                <div className="card-header">
                  <h3>Top Viewed Categories</h3>
                </div>
                <div className="chart-wrap">
                  {topCategories.length === 0 ? (
                    <div style={{ height: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "13px", gap: "8px" }}>
                      <Video size={32} strokeWidth={1} style={{ opacity: 0.4 }} />
                      No video categories yet
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={topCategories}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={2}
                        >
                          {topCategories.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip content={<CategoryTooltip />} />
                        <Legend
                          layout="vertical"
                          align="right"
                          verticalAlign="middle"
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </section>

            {/* Latest uploaded videos */}
            <section className="card table-card">
              <div className="card-header">
                <h3>Latest Uploaded Videos</h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>{latestVideos.length} videos</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Thumbnail</th>
                      <th>Video Title</th>
                      <th>Category</th>
                      <th>Duration</th>
                      <th>Views</th>
                      <th>Upload Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestVideos.length === 0 ? (
                      <EmptyTableRow cols={6} message="No videos uploaded yet. Upload videos from the Video Management section." />
                    ) : (
                      latestVideos.map((video, idx) => (
                        <tr key={`${video.title}-${idx}`}>
                          <td>
                            <div className="video-thumb">
                              <PlayCircle size={18} strokeWidth={1.8} />
                            </div>
                          </td>
                          <td className="video-title-cell">{video.title}</td>
                          <td>{video.category}</td>
                          <td>{video.duration}</td>
                          <td>{video.views.toLocaleString()}</td>
                          <td>{video.uploadDate}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Recent video views */}
            <section className="card table-card">
              <div className="card-header">
                <h3>Recent Video Views</h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>{recentViews.length} recent</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Department</th>
                      <th>Video</th>
                      <th>Watch Time</th>
                      <th>Last Viewed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentViews.length === 0 ? (
                      <EmptyTableRow cols={5} message="No video views recorded yet. Student activity will appear here." />
                    ) : (
                      recentViews.map((row, idx) => (
                        <tr key={`${row.student}-${idx}`}>
                          <td className="video-title-cell">{row.student}</td>
                          <td>{row.department}</td>
                          <td>{row.video}</td>
                          <td>{row.watchTime}</td>
                          <td>{row.lastViewed}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
