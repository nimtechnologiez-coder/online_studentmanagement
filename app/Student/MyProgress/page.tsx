"use client";

import React, { useState, useEffect } from "react";
import { studentFetch } from "../studentFetch";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Printer,
  Phone,
  Mail,
  GraduationCap,
  PlayCircle,
  BookOpen,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  BarChart2,
  Activity,
  Award,
  Loader2,
  AlertCircle,
  ChevronRight,
  Video,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import "./myprogress.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://online-management-backend.onrender.com";

function getStudentData() {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("student") || sessionStorage.getItem("student");
    if (saved) return JSON.parse(saved);
  } catch (e) { }
  return null;
}

const CATEGORY_COLORS: Record<string, string> = {
  Programming: "#3b82f6",
  Mathematics: "#8b5cf6",
  Physics: "#ec4899",
  "Soft Skills": "#10b981",
  General: "#f59e0b",
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] || "#64748b";
}

const CustomWeeklyTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="sp-tooltip-box">
        <p className="sp-tooltip-label">{payload[0]?.payload?.date || label}</p>
        <p className="sp-tooltip-val">{payload[0]?.value?.toFixed(2)}h watched</p>
      </div>
    );
  }
  return null;
};

const CustomMonthlyTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="sp-tooltip-box">
        <p className="sp-tooltip-label">{label}</p>
        <p className="sp-tooltip-val">{payload[0]?.value}% completion</p>
      </div>
    );
  }
  return null;
};

export default function MyProgressPage() {
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState<any>({
    totalVideos: 0,
    completed: 0,
    pending: 0,
    watchHours: 0,
    completionPct: 0,
  });
  const [weeklyWatchTime, setWeeklyWatchTime] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    const sData = getStudentData();
    if (sData) setStudent(sData);
    fetchProgressData(sData?.id || 0);
  }, []);

  async function fetchProgressData(studentId: number) {
    try {
      setLoading(true);
      setError("");
      const res = await studentFetch("/api/student/progress/");
      const data = await res.json();
      if (data.status === "success") {
        if (data.student) {
          setStudent((prev: any) => (prev ? { ...prev, ...data.student } : data.student));
        }
        if (data.stats) setStats(data.stats);
        setWeeklyWatchTime(data.weeklyWatchTime || []);
        setMonthlyTrend(data.monthlyTrend || []);
        setCategoryBreakdown(data.categoryBreakdown || []);
        setRecentVideos(data.recentVideos || []);
      } else {
        setError(data.message || "Failed to load progress data.");
      }
    } catch (e) {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const studentName = student?.full_name || student?.username || "Student";
  const studentInitial = studentName.charAt(0).toUpperCase();
  const regNo = student?.username || student?.student_id || "—";
  const departmentName = student?.department_name || student?.department?.dept_name || "—";
  const collegeName = student?.college_name || student?.college?.college_name || "—";
  const emailAddr = student?.email || "—";
  const mobileNo = student?.phone || student?.mobile || "—";
  const joinDateStr = student?.join_date || "—";
  const endDateStr = student?.end_date || "—";
  const mentorName = student?.hod_name || student?.mentor_name || "—";
  const yearLabel = student?.year || "";

  const kpiCards = [
    {
      icon: <Video size={20} />,
      label: "Total Videos",
      value: stats.totalVideos,
      sub: "Available lectures",
      colorClass: "icon-blue",
    },
    {
      icon: <CheckCircle2 size={20} />,
      label: "Completed",
      value: stats.completed,
      sub: `${stats.completionPct}% of all videos`,
      colorClass: "icon-green",
    },
    {
      icon: <Clock size={20} />,
      label: "Pending",
      value: stats.pending,
      sub: "Videos to watch",
      colorClass: "icon-amber",
    },
    {
      icon: <Activity size={20} />,
      label: "Watch Hours",
      value: `${stats.watchHours}h`,
      sub: "Total time invested",
      colorClass: "icon-purple",
    },
  ];

  return (
    <div className="student-progress-layout">
      {/* Header Toolbar */}
      <div className="sp-header-bar">
        <div>
          <Link href="/Student/dashboard" className="sp-back-link">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="sp-page-title">My Learning Progress</h1>
          <p className="sp-page-subtitle">
            Real-time analytics of your video learning journey
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="sp-error-banner">
          <AlertCircle size={18} className="flex-shrink-0" />
          {error}
          <button
            onClick={() => fetchProgressData(student?.id || 0)}
            className="sp-retry-btn"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton - Principal Dashboard Style */}
      {loading && (
        <div className="dash-skeleton-wrapper my-6">
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
        </div>
      )}

      {!loading && (
        <>
          {/* Hero Profile Banner */}
          <div className="sp-hero-card">
            <div className="sp-hero-left">
              <div className="sp-avatar-big">{studentInitial}</div>
              <div className="sp-hero-details">
                <div className="sp-name-row">
                  <h2>{studentName}</h2>
                  <span className="sp-status-badge">
                    {student?.status ? student.status.toUpperCase() : "ACTIVE"}
                  </span>
                  {yearLabel && (
                    <span className="sp-year-badge">{yearLabel} Year</span>
                  )}
                </div>
                <p className="sp-roll-no">{regNo}</p>
                <div className="sp-dept-row">
                  <span className="sp-meta-item">
                    <GraduationCap size={15} /> {departmentName}
                  </span>
                </div>
                <div className="sp-contact-row">
                  <span className="sp-meta-item">
                    <Mail size={14} /> {emailAddr}
                  </span>
                  {mobileNo && mobileNo !== "—" && (
                    <span className="sp-meta-item">
                      <Phone size={14} /> {mobileNo}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="sp-hero-right">
              <div className="sp-info-grid">
                <div className="sp-info-col">
                  <span className="sp-info-label">College</span>
                  <span className="sp-info-colon">:</span>
                  <span className="sp-info-val">{collegeName}</span>
                </div>
                <div className="sp-info-col">
                  <span className="sp-info-label">Join Date</span>
                  <span className="sp-info-colon">:</span>
                  <span className="sp-info-val">{joinDateStr}</span>
                </div>
                <div className="sp-info-col">
                  <span className="sp-info-label">Expected Completion</span>
                  <span className="sp-info-colon">:</span>
                  <span className="sp-info-val">{endDateStr}</span>
                </div>
                <div className="sp-info-col">
                  <span className="sp-info-label">Mentor / HOD</span>
                  <span className="sp-info-colon">:</span>
                  <span className="sp-info-val">{mentorName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards Row */}
          <div className="sp-kpi-4grid">
            {kpiCards.map((kpi, i) => (
              <div key={i} className="sp-kpi-card">
                <div className={`sp-kpi-icon ${kpi.colorClass}`}>{kpi.icon}</div>
                <div className="sp-kpi-content">
                  <span className="sp-kpi-label">{kpi.label}</span>
                  <span className="sp-kpi-value">{kpi.value}</span>
                  <span className="sp-kpi-sub">{kpi.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Completion Bar */}
          <div className="sp-card sp-completion-bar-card">
            <div className="sp-completion-header">
              <div>
                <h3 className="sp-card-title">Overall Completion</h3>
                <p className="sp-card-subtitle">
                  {stats.completed} of {stats.totalVideos} videos completed
                </p>
              </div>
              <span className="sp-completion-pct-badge">{stats.completionPct}%</span>
            </div>
            <div className="sp-big-progress-track">
              <div
                className="sp-big-progress-fill"
                style={{ width: `${stats.completionPct}%` }}
              />
            </div>
            <div className="sp-progress-legend">
              <span className="sp-legend-item">
                <span className="sp-dot dot-blue" />
                Completed ({stats.completed})
              </span>
              <span className="sp-legend-item">
                <span className="sp-dot dot-slate" />
                Pending ({stats.pending})
              </span>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="sp-dual-charts-grid">
            {/* Weekly Watch Time */}
            <div className="sp-card">
              <div className="sp-card-header">
                <div>
                  <h3 className="sp-card-title">Weekly Watch Time</h3>
                  <p className="sp-card-subtitle">Daily video watch hours — last 7 days</p>
                </div>
                <span className="sp-chart-tag">This Week</span>
              </div>
              <div className="sp-chart-body" style={{ minHeight: 220 }}>
                {mounted && weeklyWatchTime.some(w => w.hours > 0) ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={weeklyWatchTime} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="h" />
                      <Tooltip content={<CustomWeeklyTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="hours"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        fill="url(#weekGrad)"
                        dot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : mounted ? (
                  <div className="sp-empty-chart">
                    <BarChart2 size={28} className="opacity-30" />
                    <p>No watch activity recorded yet</p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Monthly Progress Trend */}
            <div className="sp-card">
              <div className="sp-card-header">
                <div>
                  <h3 className="sp-card-title">Monthly Progress Trend</h3>
                  <p className="sp-card-subtitle">Overall completion % over last 6 months</p>
                </div>
                <span className="sp-chart-tag">Last 6 Months</span>
              </div>
              <div className="sp-chart-body" style={{ minHeight: 220 }}>
                {mounted && monthlyTrend.some(m => m.progress > 0) ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
                      <Tooltip content={<CustomMonthlyTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="progress"
                        stroke="#8b5cf6"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#trendGrad)"
                        dot={{ r: 4, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : mounted ? (
                  <div className="sp-empty-chart">
                    <TrendingUp size={28} className="opacity-30" />
                    <p>No monthly data available yet</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          {categoryBreakdown.length > 0 && (
            <div className="sp-card">
              <div className="sp-card-header mb-4">
                <div>
                  <h3 className="sp-card-title">Category-wise Completion</h3>
                  <p className="sp-card-subtitle">Progress per subject area</p>
                </div>
                <span className="sp-chart-tag">{categoryBreakdown.length} Categories</span>
              </div>
              <div className="sp-bars-list">
                {categoryBreakdown.map((cat, i) => (
                  <div key={i} className="sp-bar-item">
                    <div className="sp-bar-header">
                      <span className="sp-bar-subject">{cat.category}</span>
                      <div className="sp-bar-right">
                        <span className="sp-bar-count">{cat.completed}/{cat.total} videos</span>
                        <span className="sp-bar-percent" style={{ color: getCategoryColor(cat.category) }}>
                          {cat.percent}%
                        </span>
                      </div>
                    </div>
                    <div className="sp-bar-track">
                      <div
                        className="sp-bar-fill"
                        style={{
                          width: `${Math.min(100, Math.max(0, cat.percent || 0))}%`,
                          background: getCategoryColor(cat.category),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Video Activity Table */}
          <div className="sp-card sp-table-card">
            <div className="sp-card-header mb-3">
              <div>
                <h3 className="sp-card-title">Recent Video Activity</h3>
                <p className="sp-card-subtitle">Latest watched sessions and progress details</p>
              </div>
              <Link href="/Student/ContinueWatching" className="sp-view-all-link">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="sp-table-wrap">
              {recentVideos.length > 0 ? (
                <table className="sp-table">
                  <thead>
                    <tr>
                      <th>Video Title</th>
                      <th>Category</th>
                      <th>Duration</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Watched At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVideos.map((vid, i) => (
                      <tr key={vid.id || i}>
                        <td>
                          <div className="sp-video-cell">
                            <div className="sp-vid-thumb">
                              {vid.thumbnail ? (
                                <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover rounded" />
                              ) : (
                                <PlayCircle size={16} />
                              )}
                            </div>
                            <div>
                              <span className="sp-vid-title">{vid.title}</span>
                              <span className="sp-vid-sub">{vid.subtitle}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className="sp-cat-badge"
                            style={{
                              background: getCategoryColor(vid.category || "General") + "18",
                              color: getCategoryColor(vid.category || "General"),
                            }}
                          >
                            {vid.category || "General"}
                          </span>
                        </td>
                        <td><span className="sp-dur-text">{vid.duration || "N/A"}</span></td>
                        <td>
                          <div className="sp-progress-cell">
                            <div className="sp-mini-track">
                              <div
                                className="sp-mini-fill"
                                style={{
                                  width: `${vid.progress || 0}%`,
                                  background: getCategoryColor(vid.category || "General"),
                                }}
                              />
                            </div>
                            <span className="sp-progress-text">{vid.progress || 0}%</span>
                          </div>
                        </td>
                        <td>
                          {vid.completed ? (
                            <span className="sp-status-chip chip-green">
                              <CheckCircle2 size={12} /> Completed
                            </span>
                          ) : (
                            <span className="sp-status-chip chip-amber">
                              <Clock size={12} /> In Progress
                            </span>
                          )}
                        </td>
                        <td><span className="sp-date-text">{vid.date}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="sp-empty-table">
                  <Video size={36} className="opacity-30" />
                  <p>No video activity recorded yet.</p>
                  <Link href="/Student/MyVideos" className="sp-start-link">
                    Browse Videos <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
