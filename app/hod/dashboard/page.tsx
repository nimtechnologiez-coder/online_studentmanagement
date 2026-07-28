"use client";

import { useState } from "react";
import "./dashboard.css";

/* ---------------- Mock Data ---------------- */

const stats = [
  {
    label: "Total Students",
    value: "356",
    sub: "All Years",
    icon: "students",
    color: "purple",
    trend: null,
  },
  {
    label: "Active Students",
    value: "320",
    sub: "89.9% of Total",
    icon: "active",
    color: "green",
    trend: null,
  },
  {
    label: "Total Videos",
    value: "42",
    sub: "All Department Videos",
    icon: "video",
    color: "orange",
    trend: null,
  },
];

const engagementData = [
  { day: "Mon", value: 40 },
  { day: "Tue", value: 62 },
  { day: "Wed", value: 65 },
  { day: "Thu", value: 88 },
  { day: "Fri", value: 78 },
  { day: "Sat", value: 68 },
  { day: "Sun", value: 45 },
];

const topStudents = [
  { rank: 1, name: "Arun Kumar", year: "III Year", score: 98 },
  { rank: 2, name: "Priya Dharshini", year: "III Year", score: 96 },
  { rank: 3, name: "Sanjay Kumar", year: "II Year", score: 94 },
  { rank: 4, name: "Kavya Sri", year: "IV Year", score: 92 },
  { rank: 5, name: "Vigneshwaran", year: "III Year", score: 90 },
];

const activities = [
  {
    id: 1,
    name: "Arun Kumar",
    action: 'completed "Python Basics"',
    time: "1 hour ago",
    icon: "play",
    color: "green",
  },
  {
    id: 2,
    name: "Priya Dharshini",
    action: 'watched "Django CRUD Operations"',
    time: "2 hours ago",
    icon: "play",
    color: "purple",
  },
  {
    id: 3,
    name: "Vigneshwaran",
    action: 'completed "Database Management Systems"',
    time: "3 hours ago",
    icon: "check",
    color: "orange",
  },
  {
    id: 4,
    name: "Kavya Sri",
    action: 'watched "HTML & CSS Fundamentals"',
    time: "5 hours ago",
    icon: "play",
    color: "blue",
  },
  {
    id: 5,
    name: "Sanjay Kumar",
    action: 'completed "Data Structures"',
    time: "6 hours ago",
    icon: "check",
    color: "red",
  },
];

const videos = [
  {
    id: 1,
    title: "Python Basics",
    sub: "Uploaded Today",
    views: 120,
    status: "Published",
    bgColor: "#3776ab",
    emoji: "🐍",
  },
  {
    id: 2,
    title: "Django CRUD Operations",
    sub: "Uploaded Yesterday",
    views: 98,
    status: "Published",
    bgColor: "#092e20",
    emoji: "⌘",
  },
  {
    id: 3,
    title: "Database Management Systems",
    sub: "Uploaded 2 Days Ago",
    views: 85,
    status: "Published",
    bgColor: "#1e2338",
    emoji: "🗄",
  },
  {
    id: 4,
    title: "HTML & CSS Fundamentals",
    sub: "Uploaded 3 Days Ago",
    views: 76,
    status: "Published",
    bgColor: "#e34c26",
    emoji: "🌐",
  },
];

const yearSegments = [
  { label: "I Year", count: 92, percent: 25.8, color: "#4f6cf7" },
  { label: "II Year", count: 88, percent: 24.7, color: "#22c55e" },
  { label: "III Year", count: 90, percent: 25.3, color: "#f97316" },
  { label: "IV Year", count: 86, percent: 24.2, color: "#06b6d4" },
];

const quickOverview = [
  { label: "Total Videos", value: "42", icon: "video-sm", color: "purple" },
  { label: "Total Views", value: "2,856", icon: "eye-sm", color: "blue" },
  { label: "Videos This Month", value: "6", icon: "calendar-sm", color: "red" },
];

const TOTAL = 356;

/* ---------------- Chart Geometry ---------------- */
const CW = 680;
const CH = 200;
const PX = 24;
const PT = 16;
const PB = 28;

function gx(i: number) {
  return PX + ((CW - PX * 2) / (engagementData.length - 1)) * i;
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
  const [calendarOpen, setCalendarOpen] = useState(false);

  const active = engagementData[hoverIdx];
  const linePoints = engagementData.map((d, i) => `${gx(i)},${gy(d.value)}`).join(" ");
  const areaPoints = `${gx(0)},${gy(0)} ${linePoints} ${gx(engagementData.length - 1)},${gy(0)}`;

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const monthName = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  let donutOffset = 0;

  return (
    <div className="hd-page">
      {/* ========== HEADER ========== */}
      <header className="hd-header">
        <div className="hd-header-left">
          <button className="hd-icon-btn" aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <span className="hd-header-title">HOD Dashboard</span>
        </div>
        <div className="hd-header-right">
          {/* Calendar */}
          <div className="hd-icon-trigger">
            <button
              className={`hd-icon-btn${calendarOpen ? " is-active" : ""}`}
              aria-label="Calendar"
              aria-expanded={calendarOpen}
              onClick={() => setCalendarOpen((prev) => !prev)}
            >
              {calendarOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" fill="#4f6cf7" stroke="#4f6cf7" strokeWidth="1.8" />
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#374151" strokeWidth="1.8" />
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              )}
            </button>

            {calendarOpen && (
              <>
                <div className="hd-dropdown-backdrop" onClick={() => setCalendarOpen(false)} />
                <div className="hd-panel hd-cal-panel">
                  <div className="hd-cal-today hd-cal-today--only">
                    <span className="hd-cal-today-num">{today.getDate()}</span>
                    <div className="hd-cal-today-info">
                      <span className="hd-cal-today-day">{dayName}</span>
                      <span className="hd-cal-today-month">{monthName}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="hd-profile">
            <div className="hd-avatar-circle">DA</div>
            <div className="hd-profile-info">
              <span className="hd-profile-name">Dr. Arun Kumar</span>
              <span className="hd-profile-role">HOD - CSE</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </header>

      <main className="hd-main">
        {/* ========== WELCOME BANNER ========== */}
        <section className="hd-banner">
          <div className="hd-banner-icon-wrap">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#3b5bdb" />
              <path d="M24 8L10 16v10c0 8.5 6 16.4 14 18.4 8-2 14-9.9 14-18.4V16L24 8z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <text x="24" y="32" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="monospace">{"</>"}</text>
            </svg>
          </div>
          <div className="hd-banner-text">
            <h1 className="hd-banner-heading">Welcome, Dr. Arun Kumar <span>👋</span></h1>
            <p className="hd-banner-sub">Head of Department</p>
            <p className="hd-banner-dept">Computer Science &amp; Engineering</p>
          </div>
          <div className="hd-banner-divider" />
          <div className="hd-banner-meta">
            <div className="hd-banner-meta-item">
              <span className="hd-banner-meta-label">Department</span>
              <span className="hd-banner-meta-value">Computer Science &amp; Engineering</span>
            </div>
            <div className="hd-banner-meta-item">
              <span className="hd-banner-meta-label">College</span>
              <span className="hd-banner-meta-value">ABC College of Engineering</span>
            </div>
          </div>
          <div className="hd-banner-illus" aria-hidden="true">
            <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
              {/* Plant */}
              <rect x="10" y="72" width="20" height="14" rx="3" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
              <path d="M20 72 C12 58 14 40 20 32 C26 40 28 58 20 72" fill="#22c55e" />
              <path d="M20 72 C26 55 36 44 44 40" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M20 72 C14 56 6 46 0 42" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Books */}
              <rect x="68" y="50" width="48" height="12" rx="3" fill="#4f6cf7" />
              <rect x="72" y="38" width="40" height="12" rx="3" fill="#1e2338" />
              <rect x="76" y="28" width="32" height="10" rx="3" fill="#6366f1" />
              <rect x="80" y="20" width="24" height="8" rx="2" fill="#4f6cf7" opacity="0.7" />
            </svg>
          </div>
        </section>

        {/* ========== STAT CARDS ========== */}
        <section className="hd-stats-grid">
          {stats.map((s) => (
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
                      cx={gx(i)}
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
                      x1={gx(hoverIdx)}
                      x2={gx(hoverIdx)}
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
                    left: `${(gx(hoverIdx) / CW) * 100}%`,
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
              <button className="hd-view-all">View All</button>
            </div>
            <ul className="hd-top-list">
              {topStudents.map((s) => (
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
              ))}
            </ul>
          </div>
        </section>

        {/* ========== BOTTOM ROW ========== */}
        <section className="hd-bottom-grid">
          {/* Recent Activity */}
          <div className="hd-card">
            <div className="hd-card-header">
              <h2 className="hd-card-title">Recent Student Activity</h2>
              <button className="hd-view-all">View All</button>
            </div>
            <ul className="hd-activity-list">
              {activities.map((a) => (
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
              ))}
            </ul>
          </div>

          {/* Recent Videos */}
          <div className="hd-card">
            <div className="hd-card-header">
              <h2 className="hd-card-title">Recent Videos</h2>
              <button className="hd-view-all">View All</button>
            </div>
            <ul className="hd-video-list">
              {videos.map((v) => (
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
              ))}
            </ul>
          </div>
        </section>

        {/* ========== BOTTOM SECOND ROW ========== */}
        <section className="hd-last-grid">
          {/* Year-wise Distribution */}
          <div className="hd-card">
            <h2 className="hd-card-title" style={{ marginBottom: 16 }}>Year-wise Student Distribution</h2>
            <div className="hd-dist-body">
              <div className="hd-donut-wrap">
                <svg viewBox="0 0 160 160" className="hd-donut-svg">
                  <g transform="rotate(-90 80 80)">
                    {yearSegments.map((seg) => {
                      const dash = (seg.percent / 100) * CIRC;
                      const el = (
                        <circle
                          key={seg.label}
                          cx="80" cy="80" r={RADIUS}
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
                  <span className="hd-donut-val">{TOTAL}</span>
                  <span className="hd-donut-lbl">Total</span>
                </div>
              </div>
              <div className="hd-year-cols">
                {yearSegments.map((seg) => (
                  <div className="hd-year-col" key={seg.label}>
                    <span className="hd-year-label" style={{ color: seg.color }}>{seg.label}</span>
                    <span className="hd-year-count" style={{ color: seg.color }}>{seg.count}</span>
                    <span className="hd-year-pct">({seg.percent}%)</span>
                    <span className="hd-year-arrow" style={{ color: seg.color }}>▲</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Overview */}
          <div className="hd-card">
            <h2 className="hd-card-title" style={{ marginBottom: 16 }}>Quick Overview</h2>
            <div className="hd-overview-grid">
              {quickOverview.map((item) => (
                <div className="hd-overview-item" key={item.label}>
                  <span className={`hd-ov-icon hd-ov-icon--${item.color}`}>
                    <OverviewIcon icon={item.icon} color={item.color} />
                  </span>
                  <span className="hd-ov-label">{item.label}</span>
                  <span className="hd-ov-value">{item.value}</span>
                </div>
              ))}
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

  if (icon === "students") return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3" stroke={c} strokeWidth="2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <circle cx="17" cy="8" r="2.5" stroke={c} strokeWidth="2" />
      <path d="M14.5 20c.3-2.6 2-4.5 4.5-5" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  if (icon === "active") return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="7" r="3" stroke={c} strokeWidth="2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M16 9l1.5 1.5L21 7" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (icon === "video") return (
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

function ActIcon({ type, color }: { type: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "#4f6cf7",
    green: "#22c55e",
    purple: "#8b5cf6",
    orange: "#f97316",
    red: "#ef4444",
  };
  const c = colorMap[color] || "#4f6cf7";
  if (type === "check") return (
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

function OverviewIcon({ icon, color }: { icon: string; color: string }) {
  const colorMap: Record<string, string> = {
    purple: "#8b5cf6", blue: "#4f6cf7", red: "#ef4444",
    teal: "#06b6d4", orange: "#f97316", yellow: "#eab308",
  };
  const c = colorMap[color] || "#4f6cf7";
  if (icon === "video-sm") return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="15" height="14" rx="2" stroke={c} strokeWidth="2" />
      <path d="M17 9l5-3v12l-5-3V9z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (icon === "eye-sm") return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke={c} strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke={c} strokeWidth="2" />
    </svg>
  );
  if (icon === "calendar-sm") return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke={c} strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  if (icon === "chart-sm") return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M3 17l6-6 4 4 8-9" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (icon === "clock-sm") return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2" />
      <path d="M12 7v5l4 2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg> 
  );
}