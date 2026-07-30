"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import "./dashboard.css";

import cloud from "./images/cloud.png";
import { FiClock } from "react-icons/fi";

/* ---------------- Types ---------------- */

type HodUser = {
  id: string;
  name: string;
  department: string;
  college: string;
};

type HodStats = {
  totalStudents: number;
  activeStudents: number;
  totalVideos: number;
};

const DEFAULT_STATS: HodStats = {
  totalStudents: 0,
  activeStudents: 0,
  totalVideos: 0,
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

/* ---------------- Mock Data ---------------- */

const DEFAULT_ENGAGEMENT = [
  { day: "Mon", value: 0 },
  { day: "Tue", value: 0 },
  { day: "Wed", value: 0 },
  { day: "Thu", value: 0 },
  { day: "Fri", value: 0 },
  { day: "Sat", value: 0 },
  { day: "Sun", value: 0 },
];

type DashboardSection = {
  id?: number;
  rank?: number;
  name?: string;
  year?: string;
  score?: number;
  action?: string;
  time?: string;
  icon?: string;
  color?: string;
  title?: string;
  sub?: string;
  views?: number;
  status?: string;
  bgColor?: string;
  emoji?: string;
  label?: string;
  value?: string | number;
  percent?: number;
  count?: number;
  day?: string;
};

const DEFAULT_TOP_STUDENTS: DashboardSection[] = [];
const DEFAULT_ACTIVITIES: DashboardSection[] = [];
const DEFAULT_VIDEOS: DashboardSection[] = [];
const DEFAULT_YEAR_SEGMENTS: DashboardSection[] = [];
const DEFAULT_QUICK_OVERVIEW: DashboardSection[] = [];
const TOTAL = 0;

/* ---------------- Chart Geometry ---------------- */
const CW = 680;
const CH = 200;
const PX = 24;
const PT = 16;
const PB = 28;

function gx(i: number, dataLength: number) {
  return PX + ((CW - PX * 2) / (dataLength - 1)) * i;
}
function gy(v: number) {
  const usable = CH - PT - PB;
  return PT + usable - (usable * v) / 100;
}

const RADIUS = 56;
const STROKE = 20;
const CIRC = 2 * Math.PI * RADIUS;

/* ---------------- Component ---------------- */

export default function HodDashboard() {
  const [hoverIdx, setHoverIdx] = useState(3);
  const [hod, setHod] = useState<HodUser | null>(null);
  const [stats, setStats] = useState<HodStats>(DEFAULT_STATS);
  const [engagementData, setEngagementData] = useState(DEFAULT_ENGAGEMENT);
  const [topStudents, setTopStudents] = useState(DEFAULT_TOP_STUDENTS);
  const [activities, setActivities] = useState(DEFAULT_ACTIVITIES);
  const [videos, setVideos] = useState(DEFAULT_VIDEOS);
  const [yearSegments, setYearSegments] = useState(DEFAULT_YEAR_SEGMENTS);
  const [quickOverview, setQuickOverview] = useState(DEFAULT_QUICK_OVERVIEW);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const savedHod =
      typeof window !== "undefined"
        ? localStorage.getItem("hod") || sessionStorage.getItem("hod")
        : null;
    let hodId = "";

    if (savedHod) {
      try {
        const parsed = JSON.parse(savedHod);
        hodId = parsed?.id || "";
      } catch (err) {
        console.error("Failed to parse saved HOD data:", err);
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (hodId) {
      headers["X-Hod-Id"] = String(hodId);
    }

    try {
      const response = await fetch(`${API_BASE}/api/hod/dashboard/`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const text = await response.text();
      let json: any = null;

      try {
        json = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        throw new Error("The server returned an invalid response.");
      }

      if (!json || json.status !== "success") {
        throw new Error(json?.message || "Unable to load HOD dashboard data.");
      }

      setHod(json.hod ?? null);
      setStats({
        totalStudents: json.stats?.totalStudents ?? 0,
        activeStudents: json.stats?.activeStudents ?? 0,
        totalVideos: json.stats?.totalVideos ?? 0,
      });
      setEngagementData((json.engagementData || DEFAULT_ENGAGEMENT).map((item: any) => ({ day: item.day, value: item.value })));
      setTopStudents((json.topStudents || DEFAULT_TOP_STUDENTS).map((item: any) => ({ rank: item.rank, name: item.name, year: item.year, score: item.score })));
      setActivities((json.recentActivities || DEFAULT_ACTIVITIES).map((item: any) => ({ id: item.id, name: item.name, action: item.action, time: item.time, icon: item.icon, color: item.color })));
      setVideos((json.recentVideos || DEFAULT_VIDEOS).map((item: any) => ({ id: item.id, title: item.title, sub: item.sub, views: item.views, status: item.status, bgColor: item.bgColor, emoji: item.emoji })));
      setYearSegments((json.yearDistribution || DEFAULT_YEAR_SEGMENTS).map((item: any) => ({ label: item.label, count: item.count, percent: item.percent, color: item.color })));
      setQuickOverview((json.quickOverview || DEFAULT_QUICK_OVERVIEW).map((item: any) => ({ label: item.label, value: item.value, icon: item.icon, color: item.color })));
    } catch (err: any) {
      console.error("Failed to load HOD dashboard:", err);
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const renderedStats = [
    {
      label: "Total Students",
      value: String(stats.totalStudents),
      sub: "All Years",
      icon: "students",
      color: "purple",
      trend: null as "up" | null,
    },
    {
      label: "Active Students",
      value: String(stats.activeStudents),
      sub:
        stats.totalStudents > 0
          ? `${Math.round((stats.activeStudents / stats.totalStudents) * 100)}% of Total`
          : "0% of Total",
      icon: "active",
      color: "green",
      trend: null as "up" | null,
    },
    {
      label: "Total Videos",
      value: String(stats.totalVideos),
      sub: "All Department Videos",
      icon: "video",
      color: "orange",
      trend: null as "up" | null,
    },
  ];

  const active = engagementData[hoverIdx] ?? engagementData[0];
  const linePoints = engagementData.map((d, i) => `${gx(i, engagementData.length)},${gy(d.value)}`).join(" ");
  const areaPoints = `${gx(0, engagementData.length)},${gy(0)} ${linePoints} ${gx(engagementData.length - 1, engagementData.length)},${gy(0)}`;

  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const day = today.toLocaleDateString("en-US", { weekday: "short" });
  const month = today.toLocaleDateString("en-US", { month: "short" });
  const date = today.getDate();
  const year = today.getFullYear();
  const time = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  let donutOffset = 0;

  if (loading) {
    return (
      <div className="hd-page">
        <main className="hd-main">
          <p>Loading dashboard...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="hd-page">
      {/* ========== HEADER ========== */}
      <header className="hd-header">
        <div className="hd-header-left">
          <span className="hd-header-title">HOD Dashboard</span>
        </div>
        <div className="hd-header-right">
          <div className="hd-panel hd-cal-panel">
            <div className="hd-cal-date-time">
              <FiClock className="hd-cal-clock-icon" />
              <span>{day},</span>
              <span>{month}</span>
              <span>{date},</span>
              <span>{year}</span>
              <span className="hd-time">{time}</span>
            </div>
          </div>

          <div className="hd-profile">
            <div className="hd-avatar-circle">{hod?.name ? hod.name.charAt(0) : "H"}</div>
            <div className="hd-profile-info">
              <span className="hd-profile-name">{hod?.name ?? "HOD"}</span>
              <span className="hd-profile-role">{hod ? `HOD - ${hod.department}` : "HOD"}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </header>

      {error && (
        <div className="hd-error-banner" role="alert">
          {error}
        </div>
      )}

      <main className="hd-main">
        {/* ========== WELCOME BANNER ========== */}
        <section className="hd-banner">
          <div className="hd-banner-icon-wrap">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#3b5bdb" />
              <path
                d="M24 8L10 16v10c0 8.5 6 16.4 14 18.4 8-2 14-9.9 14-18.4V16L24 8z"
                fill="white"
                fillOpacity="0.2"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <text x="24" y="32" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="monospace">
                {"</>"}
              </text>
            </svg>
          </div>
          <div className="hd-banner-text">
            <h1 className="hd-banner-heading">
              Welcome, {hod?.name ?? "HOD"} <span>👋</span>
            </h1>
            <p className="hd-banner-sub">Head of Department</p>
            <p className="hd-banner-dept">{hod?.department ?? "Department"}</p>
          </div>
          <div className="hd-banner-divider" />
          <div className="hd-banner-meta">
            <div className="hd-banner-meta-item">
              <span className="hd-banner-meta-label">Department</span>
              <span className="hd-banner-meta-value">{hod?.department ?? "Department"}</span>
            </div>
            <div className="hd-banner-meta-item">
              <span className="hd-banner-meta-label">College</span>
              <span className="hd-banner-meta-value">{hod?.college ?? "College"}</span>
            </div>
          </div>
          <div className="hd-banner-illus">
            <Image src={cloud} alt="Cloud" className="hd-banner-image" loading="eager" />
          </div>
        </section>

        {/* ========== STAT CARDS ========== */}
        <section className="hd-stats-grid">
          {renderedStats.map((s) => (
            <div className="hd-stat-card" key={s.label}>
              <div className="hd-stat-top">
                <div>
                  <p className="hd-stat-label">{s.label}</p>
                  <p className="hd-stat-value">{s.value}</p>
                </div>
                <div className={`hd-stat-icon hd-stat-icon--${s.color}`}>
                  <StatSvg icon={s.icon} color={s.color} />
                </div>
              </div>
              <p className={`hd-stat-sub ${s.trend === "up" ? "hd-stat-sub--up" : ""}`}>{s.sub}</p>
            </div>
          ))}
        </section>

        {/* ========== CHART ROW ========== */}
        <section className="hd-mid-grid">
          {/* Engagement Chart */}
          <div className="hd-card">
            <div className="hd-card-header">
              <h2 className="hd-card-title">Student Engagement (This Week)</h2>
              <button className="hd-dropdown-btn">
                This Week
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="hd-chart-wrap">
              <div className="hd-chart-yaxis">
                {["100%", "75%", "50%", "25%", "0%"].map((v) => (
                  <span key={v}>{v}</span>
                ))}
              </div>
              <div className="hd-chart-area">
                <svg viewBox={`0 0 ${CW} ${CH}`} className="hd-chart-svg" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="hdAreaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f6cf7" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#4f6cf7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 25, 50, 75, 100].map((v) => (
                    <line key={v} x1={PX} x2={CW - PX} y1={gy(v)} y2={gy(v)} stroke="#f0f1f5" strokeWidth="1" />
                  ))}
                  <polygon points={areaPoints} fill="url(#hdAreaFill)" />
                  <polyline points={linePoints} fill="none" stroke="#4f6cf7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {engagementData.map((d, i) => (
                    <circle
                      key={d.day}
                      cx={gx(i, engagementData.length)}
                      cy={gy(d.value)}
                      r={hoverIdx === i ? 6 : 4}
                      fill="#fff"
                      stroke="#4f6cf7"
                      strokeWidth="2.5"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHoverIdx(i)}
                    />
                  ))}
                  {hoverIdx !== null && (
                    <line
                      x1={gx(hoverIdx, engagementData.length)}
                      x2={gx(hoverIdx, engagementData.length)}
                      y1={gy(active.value)}
                      y2={CH - PB}
                      stroke="#4f6cf7"
                      strokeDasharray="4 3"
                      strokeWidth="1.2"
                    />
                  )}
                </svg>
                <div
                  className="hd-chart-tooltip"
                  style={{
                    left: `${(gx(hoverIdx, engagementData.length) / CW) * 100}%`,
                    top: `${(gy(active.value) / CH) * 100}%`,
                  }}
                >
                  {active.value}%
                </div>
              </div>
            </div>
            <div className="hd-chart-xaxis">
              {engagementData.map((d) => (
                <span key={d.day}>{d.day}</span>
              ))}
            </div>
          </div>

          {/* Top Performing Students */}
          <div className="hd-card">
            <div className="hd-card-header">
              <h2 className="hd-card-title">Top Performing Students</h2>
            </div>
            <ul className="hd-top-list">
              {topStudents.length > 0 ? (
                topStudents.map((s) => (
                  <li className="hd-top-item" key={s.rank}>
                    <span className={`hd-rank hd-rank--${s.rank}`}>{s.rank}</span>
                    <div className="hd-top-info">
                      <span className="hd-top-name">{s.name}</span>
                      <span className="hd-top-year">{s.year}</span>
                    </div>
                    <div className="hd-bar-track">
                      <div className="hd-bar-fill" style={{ width: `${s.score}%` }} />
                    </div>
                    <span className="hd-top-score">{s.score}%</span>
                  </li>
                ))
              ) : (
                <li className="hd-top-item">
                  <span className="hd-top-name">No student activity yet.</span>
                </li>
              )}
            </ul>
          </div>
        </section>

        {/* ========== BOTTOM ROW ========== */}
        <section className="hd-bottom-grid">
          {/* Recent Activity */}
          <div className="hd-card">
            <div className="hd-card-header">
              <h2 className="hd-card-title">Recent Student Activity</h2>
            </div>
            <ul className="hd-activity-list">
              {activities.length > 0 ? (
                activities.map((a) => (
                  <li className="hd-activity-item" key={a.id}>
                    <span className={`hd-act-icon hd-act-icon--${a.color}`}>
                      <ActIcon type={a.icon} color={a.color} />
                    </span>
                    <div className="hd-act-text">
                      <span className="hd-act-name">{a.name}</span>{" "}
                      <span className="hd-act-action">{a.action}</span>
                    </div>
                    <span className="hd-act-time">{a.time}</span>
                  </li>
                ))
              ) : (
                <li className="hd-activity-item">
                  <span className="hd-act-text">No recent activity yet.</span>
                </li>
              )}
            </ul>
          </div>

          {/* Recent Videos */}
          <div className="hd-card">
            <div className="hd-card-header">
              <h2 className="hd-card-title">Recent Videos</h2>
              <a href="/hod/videos" style={{ fontSize: "12px", color: "blue" }}>
                View All
              </a>
            </div>
            <ul className="hd-video-list">
              {videos.length > 0 ? (
                videos.map((v) => (
                  <li className="hd-video-item" key={v.id}>
                    <div className="hd-video-thumb" style={{ background: v.bgColor }}>
                      <span>{v.emoji}</span>
                    </div>
                    <div className="hd-video-info">
                      <span className="hd-video-title">{v.title}</span>
                      <span className="hd-video-sub">{v.sub}</span>
                    </div>
                    <div className="hd-video-meta">
                      <span className="hd-video-views">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="#9ca3af" strokeWidth="2" />
                          <circle cx="12" cy="12" r="3" stroke="#9ca3af" strokeWidth="2" />
                        </svg>
                        {v.views} Views
                      </span>
                      <span className="hd-video-badge">{v.status}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="hd-video-item">
                  <span className="hd-video-title">No videos uploaded yet.</span>
                </li>
              )}
            </ul>
          </div>
        </section>

        {/* ========== BOTTOM SECOND ROW ========== */}
        <section className="hd-last-grid">
          {/* Year-wise Distribution */}
          <div className="hd-card">
            <h2 className="hd-card-title" style={{ marginBottom: 16 }}>
              Year-wise Student Distribution
            </h2>
            <div className="hd-dist-body">
              <div className="hd-donut-wrap">
                <svg viewBox="0 0 160 160" className="hd-donut-svg">
                  <g transform="rotate(-90 80 80)">
                    {yearSegments.map((seg) => {
                      const percent = seg.percent ?? 0;
                      const dash = (percent / 100) * CIRC;
                      const el = (
                        <circle
                          key={seg.label}
                          cx="80"
                          cy="80"
                          r={RADIUS}
                          fill="none"
                          stroke={seg.color}
                          strokeWidth={STROKE}
                          strokeDasharray={`${dash} ${CIRC - dash}`}
                          strokeDashoffset={-donutOffset}
                        />
                      );
                      donutOffset += dash;
                      return el;
                    })}
                  </g>
                </svg>
                <div className="hd-donut-center">
                  <span className="hd-donut-val">{yearSegments.reduce((sum, seg) => sum + (seg.count || 0), 0)}</span>
                  <span className="hd-donut-lbl">Total</span>
                </div>
              </div>
              <div className="hd-year-cols">
                {yearSegments.map((seg) => (
                  <div className="hd-year-col" key={seg.label}>
                    <span className="hd-year-label" style={{ color: seg.color }}>
                      {seg.label}
                    </span>
                    <span className="hd-year-count" style={{ color: seg.color }}>
                      {seg.count}
                    </span>
                    <span className="hd-year-pct">({seg.percent}%)</span>
                    <span className="hd-year-arrow" style={{ color: seg.color }}>
                      ▲
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Overview */}
          <div className="hd-card">
            <h2 className="hd-card-title" style={{ marginBottom: 16 }}>
              Quick Overview
            </h2>
            <div className="hd-overview-grid">
              {quickOverview.length > 0 ? (
                quickOverview.map((item) => (
                  <div className="hd-overview-item" key={item.label}>
                    <span className={`hd-ov-icon hd-ov-icon--${item.color}`}>
                      <OverviewIcon icon={item.icon} color={item.color} />
                    </span>
                    <span className="hd-ov-label">{item.label}</span>
                    <span className="hd-ov-value">{item.value}</span>
                  </div>
                ))
              ) : (
                <div className="hd-overview-item">
                  <span className="hd-ov-label">No overview data yet.</span>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------------- Icon Components ---------------- */

function StatSvg({ icon, color }: { icon: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "#4f6cf7",
    green: "#22c55e",
    purple: "#8b5cf6",
    orange: "#f97316",
  };
  const c = colorMap[color] || "#4f6cf7";

  if (icon === "students")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="3" stroke={c} strokeWidth="2" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={c} strokeWidth="2" strokeLinecap="round" />
        <circle cx="17" cy="8" r="2.5" stroke={c} strokeWidth="2" />
        <path d="M14.5 20c.3-2.6 2-4.5 4.5-5" stroke={c} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  if (icon === "active")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="10" cy="7" r="3" stroke={c} strokeWidth="2" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={c} strokeWidth="2" strokeLinecap="round" />
        <path d="M16 9l1.5 1.5L21 7" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (icon === "video")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="15" height="14" rx="2" stroke={c} strokeWidth="2" />
        <path d="M17 9l5-3v12l-5-3V9z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 17l6-6 4 4 8-9" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6h6v6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ActIcon({ type, color }: { type?: string; color?: string }) {
  const colorMap: Record<string, string> = {
    blue: "#4f6cf7",
    green: "#22c55e",
    purple: "#8b5cf6",
    orange: "#f97316",
    red: "#ef4444",
  };
  const c = colorMap[color || ""] || "#4f6cf7";
  if (type === "check")
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <polygon points="5,3 19,12 5,21" fill={c} />
    </svg>
  );
}

function OverviewIcon({ icon, color }: { icon?: string; color?: string }) {
  const colorMap: Record<string, string> = {
    purple: "#8b5cf6",
    blue: "#4f6cf7",
    red: "#ef4444",
    teal: "#06b6d4",
    orange: "#f97316",
    yellow: "#eab308",
  };
  const c = colorMap[color || ""] || "#4f6cf7";
  if (icon === "video-sm")
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="15" height="14" rx="2" stroke={c} strokeWidth="2" />
        <path d="M17 9l5-3v12l-5-3V9z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (icon === "eye-sm")
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke={c} strokeWidth="2" />
        <circle cx="12" cy="12" r="3" stroke={c} strokeWidth="2" />
      </svg>
    );
  if (icon === "calendar-sm")
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke={c} strokeWidth="2" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke={c} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  if (icon === "chart-sm")
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M3 17l6-6 4 4 8-9" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (icon === "clock-sm")
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2" />
        <path d="M12 7v5l4 2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}