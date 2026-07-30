"use client";

import { useEffect, useMemo, useState } from "react";
import "./performance.css";

/* ═══════════════════════════ Types ═══════════════════════════ */

type PerfLevel = "High Performer" | "Average Performer" | "Needs Improvement";

type StudentRow = {
  id: number;
  name: string;
  avgProgress: number;
  watchMinutes: number;
  score: number;
  lastActivity: string;
  level: PerfLevel;
};

type DayPoint = { label: string; value: number };

type HodUser = {
  id?: string;
  name: string;
  department: string;
  college: string;
};

type PerformancePayload = {
  hod: HodUser;
  stats: {
    totalStudents: number;
    activeStudents: number;
    totalVideos: number;
    totalViews: number;
  };
  weeklyProgress: DayPoint[];
  watchTimeWeek: DayPoint[];
  students: StudentRow[];
  topStudents: Array<{ name: string; score: number }>;
  mostWatchedVideos: Array<{ title: string; views: number }>;
  summary: {
    high: number;
    avg: number;
    low: number;
    overallAvg: number;
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

const AVATAR_COLORS = [
  "#3b5bfa", "#15a15a", "#e8590c", "#7c3aed",
  "#0891b2", "#db2777", "#0d9488", "#d97706",
];
const avatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];
const initials = (name: string) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

function formatWatchTime(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}

/* ═══════════════════════════ Small UI pieces ═══════════════════════════ */

/* ═══════════════════════════ Small chart primitives ═══════════════════════════ */

function LineChart({
  data, yMax, yStep, stroke, fillId, gradientFrom, gradientTo, suffix = "%",
}: {
  data: DayPoint[]; yMax: number; yStep: number; stroke: string; fillId: string;
  gradientFrom: string; gradientTo: string; suffix?: string;
}) {
  const W = 620, H = 230, padL = 34, padR = 12, padT = 30, padB = 26;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const safeData = Array.isArray(data) && data.length > 0
    ? data.filter((item): item is DayPoint => Boolean(item) && typeof item.value === "number" && Number.isFinite(item.value))
    : [{ label: "No data", value: 0 }];
  const safeYMax = Math.max(yMax || 1, 10, ...safeData.map((item) => item.value || 0));
  const stepX = safeData.length > 1 ? innerW / (safeData.length - 1) : 0;
  const yTicks = Array.from({ length: Math.max(1, Math.ceil(safeYMax / yStep) + 1) }, (_, i) => i * yStep);

  const xAt = (i: number) => padL + i * stepX;
  const yAt = (v: number) => {
    const safeValue = Number.isFinite(v) ? v : 0;
    return padT + innerH - (safeValue / safeYMax) * innerH;
  };

  const linePath = safeData.map((d, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(d.value)}`).join(" ");
  const areaPath = `${linePath} L ${xAt(safeData.length - 1)} ${padT + innerH} L ${xAt(0)} ${padT + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-56">
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradientFrom} stopOpacity="0.35" />
          <stop offset="100%" stopColor={gradientTo} stopOpacity="0" />
        </linearGradient>
      </defs>

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={W - padR} y1={yAt(t)} y2={yAt(t)} stroke="#eef0f6" strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 4} textAnchor="end" className="fill-slate-400" fontSize="10">
            {t}{suffix}
          </text>
        </g>
      ))}

      <path d={areaPath} fill={`url(#${fillId})`} />
      <path d={linePath} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {safeData.map((d, i) => (
        <g key={`${d.label}-${i}`}>
          <circle cx={xAt(i)} cy={yAt(d.value)} r={4} fill="#fff" stroke={stroke} strokeWidth={2.5} />
          <text x={xAt(i)} y={yAt(d.value) - 12} textAnchor="middle" className="fill-slate-700 font-bold" fontSize="11">
            {d.value}{suffix}
          </text>
          <text x={xAt(i)} y={H - 6} textAnchor="middle" className="fill-slate-400 font-medium" fontSize="11">
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function BarChart({ data, yMax, yStep, color }: { data: DayPoint[]; yMax: number; yStep: number; color: string }) {
  const W = 620, H = 230, padL = 34, padR = 12, padT = 30, padB = 26;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const gap = 18;
  const safeData = Array.isArray(data) && data.length > 0
    ? data.filter((item): item is DayPoint => Boolean(item) && typeof item.value === "number" && Number.isFinite(item.value))
    : [{ label: "No data", value: 0 }];
  const safeYMax = Math.max(yMax || 1, 10, ...safeData.map((item) => item.value || 0));
  const barW = safeData.length > 1 ? (innerW - gap * (safeData.length - 1)) / safeData.length : Math.max(40, innerW / Math.max(safeData.length, 1));
  const yTicks = Array.from({ length: Math.max(1, Math.ceil(safeYMax / yStep) + 1) }, (_, i) => i * yStep);
  const yAt = (v: number) => {
    const safeValue = Number.isFinite(v) ? v : 0;
    return padT + innerH - (safeValue / safeYMax) * innerH;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-56">
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={W - padR} y1={yAt(t)} y2={yAt(t)} stroke="#eef0f6" strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 4} textAnchor="end" className="fill-slate-400" fontSize="10">{t}</text>
        </g>
      ))}
      {safeData.map((d, i) => {
        const x = padL + i * (barW + gap);
        const safeValue = Number.isFinite(d.value) ? d.value : 0;
        const barH = (safeValue / safeYMax) * innerH;
        const y = padT + innerH - barH;
        return (
          <g key={`${d.label}-${i}`}>
            <rect x={x} y={y} width={barW} height={barH} rx={5} fill={color} />
            <text x={x + barW / 2} y={y - 8} textAnchor="middle" className="fill-slate-700 font-bold" fontSize="11">
              {d.value}
            </text>
            <text x={x + barW / 2} y={H - 6} textAnchor="middle" className="fill-slate-400 font-medium" fontSize="11">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════ Small UI pieces ═══════════════════════════ */

function StatCard({
  icon, iconBg, label, value, sub, subClass, cardBg,
}: {
  icon: React.ReactNode; iconBg: string; label: string; value: string; sub: string;
  subClass?: string; cardBg: string;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 p-4 flex items-start gap-3 shadow-sm ${cardBg}`}>
      <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-slate-600">{label}</div>
        <div className="text-xl font-extrabold text-slate-900 leading-tight mt-0.5 truncate">{value}</div>
        <div className={`text-[12px] font-medium mt-0.5 ${subClass ?? "text-slate-500"}`}>{sub}</div>
      </div>
    </div>
  );
}

function ScorePill({ score }: { score: number }) {
  const cls =
    score >= 75 ? "bg-emerald-50 text-emerald-700"
      : score >= 50 ? "bg-amber-50 text-amber-700"
        : "bg-rose-50 text-rose-700";
  return <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-[12.5px] font-bold ${cls}`}>{score}%</span>;
}

function LevelPill({ level }: { level: PerfLevel }) {
  const cls =
    level === "High Performer" ? "bg-emerald-50 text-emerald-700"
      : level === "Average Performer" ? "bg-amber-50 text-amber-700"
        : "bg-rose-50 text-rose-700";
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-bold whitespace-nowrap ${cls}`}>{level}</span>;
}

function ProgressBar({ value }: { value: number }) {
  const color = value >= 75 ? "#15a15a" : value >= 50 ? "#e8590c" : "#dc2626";
  return (
    <div className="flex items-center gap-2.5 min-w-[140px]">
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[12.5px] font-bold text-slate-700 w-9 text-right">{value}%</span>
    </div>
  );
}

/* ═══════════════════════════ Icons ═══════════════════════════ */

const Icon = {
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#3b5bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" stroke="#3b5bfa" strokeWidth="2" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#3b5bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  TrendUp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M23 6l-9.5 9.5-5-5L1 18" stroke="#15a15a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 6h6v6" stroke="#15a15a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Trophy: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4z" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 5h3a3 3 0 01-3 5M7 5H4a3 3 0 003 5" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#d97706" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Play: ({ color = "#dc2626" }: { color?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6 4l14 8-14 8V4z" fill={color} />
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#15a15a" strokeWidth="2" />
      <path d="M8 12l3 3 5-6" stroke="#15a15a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Meh: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#d97706" strokeWidth="2" />
      <path d="M8 15h8M9 9h.01M15 9h.01" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Frown: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#dc2626" strokeWidth="2" />
      <path d="M8 16c1-1.3 2.5-2 4-2s3 .7 4 2M9 9h.01M15 9h.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  ChartLine: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 19V5M4 19h16" stroke="#3b5bfa" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 15l3-3 3 2 5-6" stroke="#3b5bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Chevron: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#374151" strokeWidth="1.8" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Building: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 21h18M6 21V4a1 1 0 011-1h6a1 1 0 011 1v17M18 21V9a1 1 0 00-1-1h-3" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#6b7280" strokeWidth="2" />
      <path d="M21 21l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Download: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Filter: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h16l-6 8v6l-4 2v-8L4 4z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="#3b5bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="#3b5bfa" strokeWidth="1.8" />
    </svg>
  ),
  Dots: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="5" r="1.6" fill="#9ca3af" />
      <circle cx="12" cy="12" r="1.6" fill="#9ca3af" />
      <circle cx="12" cy="19" r="1.6" fill="#9ca3af" />
    </svg>
  ),
};

/* ═══════════════════════════ Main Page ═══════════════════════════ */

export default function HodPerformancePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState<PerformancePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(err.message || "Failed to load performance data.");
      } finally {
        setLoading(false);
      }
    };

    loadPerformance();
  }, []);

  const students = payload?.students ?? [];
  const weeklyProgress = Array.isArray(payload?.weeklyProgress) ? payload.weeklyProgress : [];
  const watchTimeWeek = Array.isArray(payload?.watchTimeWeek) ? payload.watchTimeWeek : [];
  const topStudents = payload?.topStudents ?? [];
  const mostWatchedVideos = payload?.mostWatchedVideos ?? [];
  const summary = payload?.summary ?? { high: 0, avg: 0, low: 0, overallAvg: 0 };
  const hod = payload?.hod ?? { name: "HOD", department: "Department", college: "College" };
  const stats = payload?.stats ?? { totalStudents: 0, activeStudents: 0, totalVideos: 0, totalViews: 0 };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.name.toLowerCase().includes(q));
  }, [search, students]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const goPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  const topAvgScore = topStudents.length > 0
    ? (topStudents.reduce((s, t) => s + t.score, 0) / topStudents.length).toFixed(1)
    : "0.0";
  const maxViews = mostWatchedVideos.length > 0 ? Math.max(...mostWatchedVideos.map((v) => v.views)) : 0;
  const chartWeeklyData = weeklyProgress.length > 0 ? weeklyProgress : [{ label: "No data", value: 0 }];
  const chartWatchData = watchTimeWeek.length > 0 ? watchTimeWeek : [{ label: "No data", value: 0 }];
  const weeklyMax = Math.max(10, ...chartWeeklyData.map((item) => item.value || 0));
  const watchMax = Math.max(20, ...chartWatchData.map((item) => item.value || 0));
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
    .reduce<(number | "…")[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-7 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900">Student Performance</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Track, analyze and improve student learning performance</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button className="flex items-center gap-2 h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition">
            <Icon.Calendar />
            28 Jul 2026 – 28 Jul 2026
            <Icon.Chevron />
          </button>
          <button className="flex items-center gap-2 h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition">
            <Icon.Building />
            {hod.department}
            <Icon.Chevron />
          </button>
          <button className="flex items-center gap-2.5 h-10 pl-1.5 pr-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11.5px] font-bold shrink-0"
              style={{ background: "linear-gradient(135deg,#3b5bfa,#7c3aed)" }}
            >
              AK
            </div>
            <span className="text-left leading-tight">
              <span className="block text-[12.5px] font-bold text-slate-800">{hod.name}</span>
              <span className="block text-[10.5px] text-slate-500">HOD</span>
            </span>
            <Icon.Chevron />
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-7 py-6 flex flex-col gap-5">
        {loading && <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">Loading performance data…</div>}
        {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard icon={<Icon.Users />} iconBg="#e8ecff" cardBg="bg-[#f4f6ff]" label="Total Students" value={String(stats.totalStudents)} sub="All Department" />
          <StatCard icon={<Icon.TrendUp />} iconBg="#dcfce7" cardBg="bg-[#f2fbf5]" label="Weekly Learning Progress" value={`${chartWeeklyData.reduce((sum, item) => sum + (item.value || 0), 0)} Active`} sub="Last 7 days" subClass="text-emerald-600 font-semibold" />
          <StatCard icon={<Icon.Trophy />} iconBg="#ede9fe" cardBg="bg-[#f8f6ff]" label="Top 10 Students (Avg Score)" value={`${topAvgScore}%`} sub="Average Score" />
          <StatCard icon={<Icon.Clock />} iconBg="#fef3c7" cardBg="bg-[#fffbf0]" label="Average Watch Time" value={`${Math.round(stats.totalViews / Math.max(stats.totalStudents, 1))}m`} sub="Per Student" />
          <StatCard icon={<Icon.Play color="#dc2626" />} iconBg="#fde8e8" cardBg="bg-[#fff5f5]" label="Most Watched Video" value={mostWatchedVideos[0]?.title ?? "No videos yet"} sub={`${mostWatchedVideos[0]?.views ?? 0} Views`} />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[14.5px] font-bold text-slate-900 flex items-center gap-1.5">
                Weekly Learning Progress
                <span className="text-slate-400 font-normal text-xs">ⓘ</span>
              </h2>
              <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50">
                Last 7 Days <Icon.Chevron />
              </button>
            </div>
            <LineChart data={chartWeeklyData} yMax={weeklyMax} yStep={10} stroke="#3b5bfa" fillId="wlpFill" gradientFrom="#3b5bfa" gradientTo="#3b5bfa" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14.5px] font-bold text-slate-900">
                Top 10 Students <span className="font-medium text-slate-400">(by Average Score)</span>
              </h2>
              <a href="#" className="text-[12.5px] font-bold text-[#3b5bfa] hover:underline">View All</a>
            </div>
            <ol className="flex flex-col gap-3">
              {topStudents.length > 0 ? topStudents.map((s, i) => (
                <li key={s.name} className="flex items-center gap-3">
                  <span className="w-4 text-[12.5px] font-bold text-slate-400 shrink-0">{i + 1}.</span>
                  <span className="w-24 text-[12.5px] font-semibold text-slate-700 truncate shrink-0">{s.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-[#3b5bfa]" style={{ width: `${s.score}%` }} />
                  </div>
                  <span className="w-9 text-right text-[12.5px] font-bold text-slate-700 shrink-0">{s.score}%</span>
                </li>
              )) : <li className="text-sm text-slate-400">No student activity yet.</li>}
            </ol>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[14.5px] font-bold text-slate-900">
                Average Watch Time <span className="font-medium text-slate-400">(Minutes)</span>
              </h2>
              <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50">
                This Week <Icon.Chevron />
              </button>
            </div>
            <LineChart data={chartWatchData} yMax={watchMax} yStep={20} stroke="#7c3aed" fillId="awtFill" gradientFrom="#7c3aed" gradientTo="#7c3aed" suffix="" />
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14.5px] font-bold text-slate-900">Most Watched Videos</h2>
              <a href="#" className="text-[12.5px] font-bold text-[#3b5bfa] hover:underline">View All</a>
            </div>
            <ol className="flex flex-col gap-3.5">
              {mostWatchedVideos.length > 0 ? mostWatchedVideos.map((v, i) => (
                <li key={v.title} className="flex items-center gap-3">
                  <span className="w-4 text-[12.5px] font-bold text-slate-400 shrink-0">{i + 1}.</span>
                  <div className="w-9 h-7 rounded-md bg-slate-900 flex items-center justify-center shrink-0">
                    <Icon.Play color="#fff" />
                  </div>
                  <span className="w-28 text-[12.5px] font-semibold text-slate-700 truncate shrink-0">{v.title}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-[#3b5bfa]" style={{ width: `${maxViews > 0 ? (v.views / maxViews) * 100 : 0}%` }} />
                  </div>
                  <span className="w-16 text-right text-[12px] font-semibold text-slate-500 shrink-0">{v.views} Views</span>
                </li>
              )) : <li className="text-sm text-slate-400">No watched videos yet.</li>}
            </ol>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-[14.5px] font-bold text-slate-900 mb-2">
              Average Watch Time by Day <span className="font-medium text-slate-400">(Minutes)</span>
            </h2>
            <BarChart data={chartWatchData} yMax={watchMax} yStep={20} color="#15a15a" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-[14.5px] font-bold text-slate-900 mb-4">
              Student Performance Overview <span className="font-medium text-slate-400">(Summary)</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50/70 border border-emerald-100 p-3.5 flex items-start gap-2.5">
                <Icon.Check />
                <div>
                  <div className="text-[12px] font-semibold text-slate-600">High Performers</div>
                  <div className="text-lg font-extrabold text-slate-900 leading-tight">{summary.high}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Score ≥ 75%</div>
                </div>
              </div>
              <div className="rounded-xl bg-amber-50/70 border border-amber-100 p-3.5 flex items-start gap-2.5">
                <Icon.Meh />
                <div>
                  <div className="text-[12px] font-semibold text-slate-600">Average Performers</div>
                  <div className="text-lg font-extrabold text-slate-900 leading-tight">{summary.avg}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Score 50% – 74%</div>
                </div>
              </div>
              <div className="rounded-xl bg-rose-50/70 border border-rose-100 p-3.5 flex items-start gap-2.5">
                <Icon.Frown />
                <div>
                  <div className="text-[12px] font-semibold text-slate-600">Needs Improvement</div>
                  <div className="text-lg font-extrabold text-slate-900 leading-tight">{summary.low}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Score &lt; 50%</div>
                </div>
              </div>
              <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-3.5 flex items-start gap-2.5">
                <Icon.ChartLine />
                <div>
                  <div className="text-[12px] font-semibold text-slate-600">Overall Average Score</div>
                  <div className="text-lg font-extrabold text-slate-900 leading-tight">{summary.overallAvg}%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Department Average</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-b border-slate-200">
            <h2 className="text-[15px] font-bold text-slate-900">
              Student Performance Overview <span className="font-medium text-slate-400">(Detailed)</span>
            </h2>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="relative w-56">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><Icon.Search /></span>
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search student…"
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-[13px] outline-none focus:border-[#3b5bfa] focus:ring-2 focus:ring-[#3b5bfa]/15"
                />
              </div>
              <button className="flex items-center gap-2 h-9 px-3.5 rounded-lg border border-slate-200 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50">
                <Icon.Download /> Export
              </button>
              <button className="flex items-center gap-2 h-9 px-3.5 rounded-lg bg-[#3b5bfa] text-white text-[12.5px] font-bold hover:bg-[#2c48e0]">
                <Icon.Filter /> Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  {["#", "Student", "Avg Progress", "Watch Time", "Learning Score", "Last Activity", "Performance Level", "Action"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-extrabold uppercase tracking-wide text-slate-500 px-4 py-3 border-b border-slate-200 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slice.length > 0 ? slice.map((s, idx) => (
                  <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 text-[12.5px] font-bold text-slate-500">{(safePage - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0" style={{ background: avatarColor(s.id) }}>
                          {initials(s.name)}
                        </div>
                        <span className="text-[13px] font-bold text-slate-800 whitespace-nowrap">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><ProgressBar value={s.avgProgress} /></td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-slate-600 whitespace-nowrap">{formatWatchTime(s.watchMinutes)}</td>
                    <td className="px-4 py-3"><ScorePill score={s.score} /></td>
                    <td className="px-4 py-3 text-[12.5px] font-semibold text-slate-600 whitespace-nowrap">{s.lastActivity}</td>
                    <td className="px-4 py-3"><LevelPill level={s.level} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-blue-50 text-[#3b5bfa] text-[12px] font-bold hover:bg-blue-100">
                          <Icon.Eye /> View Details
                        </button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100">
                          <Icon.Dots />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400 text-[13.5px]">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3.5 border-t border-slate-200">
            <span className="text-[12.5px] font-semibold text-slate-500">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length} students
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goPage(safePage - 1)}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 font-bold disabled:opacity-40 hover:enabled:bg-slate-900 hover:enabled:text-white hover:enabled:border-slate-900 transition"
              >
                ‹
              </button>
              {pageNumbers.map((p, i) =>
                p === "…" ? (
                  <span key={`d${i}`} className="w-8 h-8 flex items-center justify-center text-slate-400 font-semibold">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goPage(p as number)}
                    className={`w-8 h-8 rounded-lg text-[12.5px] font-bold transition ${safePage === p ? "bg-[#3b5bfa] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900"}`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => goPage(safePage + 1)}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 font-bold disabled:opacity-40 hover:enabled:bg-slate-900 hover:enabled:text-white hover:enabled:border-slate-900 transition"
              >
                ›
              </button>
            </div>

            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="h-9 px-3 rounded-lg border border-slate-200 text-[12.5px] font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </section>
      </main>
    </div>
  );
}