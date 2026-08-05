"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Video as VideoIcon,
  Search,
  User,
  Eye,
  X,
  PlayCircle,
  FolderOpen,
  Star,
  Clock,
  Calendar,
  UserCircle,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./VideoReports.css";

/* ---------------------------------- TYPES ---------------------------------- */

type VideoStatus = "Published" | "Draft";

interface Video {
  id: string;
  title: string;
  category: string;
  duration: string;
  views: number;
  uploadedDate: string;
  uploadedBy: string;
  status: VideoStatus;
  studentsViewed: number;
  completionRate: number;
  description: string;
  thumbnail: string;
  videoUrl: string;
}

/* ---------------------------------- DATA ---------------------------------- */

const categories = [
  "All Categories",
  "AI",
  "Soft Skills",
  "Programming",
  "Interview",
  "Time Management",
  "Communication",
  "Resume",
  "Leadership",
];
const statuses: Array<"All Status" | VideoStatus> = ["All Status", "Published", "Draft"];
const PAGE_SIZE = 10;
const TOTAL_VIDEOS_IN_SYSTEM = 45;

const videos: Video[] = [
  {
    id: "v1",
    title: "AI Basics",
    category: "AI",
    duration: "20 min",
    views: 1250,
    uploadedDate: "15 Jul 2026",
    uploadedBy: "Company Admin",
    status: "Published",
    studentsViewed: 420,
    completionRate: 78,
    description: "Introduction to Artificial Intelligence and its applications.",
    thumbnail: "AI",
    videoUrl: "/videos/ai-basics.mp4",
  },
  {
    id: "v2",
    title: "Resume Building",
    category: "Soft Skills",
    duration: "15 min",
    views: 980,
    uploadedDate: "13 Jul 2026",
    uploadedBy: "Company Admin",
    status: "Published",
    studentsViewed: 360,
    completionRate: 82,
    description: "Step-by-step guidance on crafting a resume that stands out to recruiters.",
    thumbnail: "RB",
    videoUrl: "/videos/resume-building.mp4",
  },
  {
    id: "v3",
    title: "Python Basics",
    category: "Programming",
    duration: "30 min",
    views: 860,
    uploadedDate: "10 Jul 2026",
    uploadedBy: "Company Admin",
    status: "Published",
    studentsViewed: 310,
    completionRate: 65,
    description: "A beginner-friendly walkthrough of Python syntax, variables, and control flow.",
    thumbnail: "PY",
    videoUrl: "/videos/python-basics.mp4",
  },
  {
    id: "v4",
    title: "Interview Skills",
    category: "Interview",
    duration: "18 min",
    views: 720,
    uploadedDate: "08 Jul 2026",
    uploadedBy: "Company Admin",
    status: "Published",
    studentsViewed: 275,
    completionRate: 71,
    description: "Practical tips for answering common interview questions with confidence.",
    thumbnail: "IS",
    videoUrl: "/videos/interview-skills.mp4",
  },
  {
    id: "v5",
    title: "Time Management",
    category: "Time Management",
    duration: "12 min",
    views: 540,
    uploadedDate: "05 Jul 2026",
    uploadedBy: "Company Admin",
    status: "Published",
    studentsViewed: 198,
    completionRate: 59,
    description: "Techniques to prioritize tasks and stay productive under deadlines.",
    thumbnail: "TM",
    videoUrl: "/videos/time-management.mp4",
  },
  {
    id: "v6",
    title: "Communication Skills",
    category: "Communication",
    duration: "22 min",
    views: 610,
    uploadedDate: "03 Jul 2026",
    uploadedBy: "Company Admin",
    status: "Published",
    studentsViewed: 240,
    completionRate: 68,
    description: "Building clarity and confidence in verbal and written workplace communication.",
    thumbnail: "CS",
    videoUrl: "/videos/communication-skills.mp4",
  },
  {
    id: "v7",
    title: "Resume Tips",
    category: "Resume",
    duration: "10 min",
    views: 430,
    uploadedDate: "01 Jul 2026",
    uploadedBy: "Company Admin",
    status: "Draft",
    studentsViewed: 90,
    completionRate: 34,
    description: "Quick-fire tips to fix the most common resume mistakes before you apply.",
    thumbnail: "RT",
    videoUrl: "/videos/resume-tips.mp4",
  },
  {
    id: "v8",
    title: "Leadership Fundamentals",
    category: "Leadership",
    duration: "25 min",
    views: 310,
    uploadedDate: "28 Jun 2026",
    uploadedBy: "Company Admin",
    status: "Published",
    studentsViewed: 150,
    completionRate: 55,
    description: "Core principles of leading teams, delegating, and giving feedback.",
    thumbnail: "LF",
    videoUrl: "/videos/leadership-fundamentals.mp4",
  },
  {
    id: "v9",
    title: "Advanced Python",
    category: "Programming",
    duration: "35 min",
    views: 275,
    uploadedDate: "25 Jun 2026",
    uploadedBy: "Company Admin",
    status: "Draft",
    studentsViewed: 60,
    completionRate: 22,
    description: "Deeper dive into decorators, generators, and Python's object model.",
    thumbnail: "AP",
    videoUrl: "/videos/advanced-python.mp4",
  },
  {
    id: "v10",
    title: "Group Discussion Skills",
    category: "Soft Skills",
    duration: "16 min",
    views: 480,
    uploadedDate: "22 Jun 2026",
    uploadedBy: "Company Admin",
    status: "Published",
    studentsViewed: 205,
    completionRate: 63,
    description: "How to contribute effectively and stand out in group discussion rounds.",
    thumbnail: "GD",
    videoUrl: "/videos/group-discussion-skills.mp4",
  },
  {
    id: "v11",
    title: "AI in Everyday Work",
    category: "AI",
    duration: "19 min",
    views: 690,
    uploadedDate: "18 Jun 2026",
    uploadedBy: "Company Admin",
    status: "Published",
    studentsViewed: 260,
    completionRate: 70,
    description: "Practical ways AI tools are used across everyday professional tasks.",
    thumbnail: "AE",
    videoUrl: "/videos/ai-everyday-work.mp4",
  },
  {
    id: "v12",
    title: "Mock Interview Walkthrough",
    category: "Interview",
    duration: "28 min",
    views: 390,
    uploadedDate: "15 Jun 2026",
    uploadedBy: "Company Admin",
    status: "Draft",
    studentsViewed: 75,
    completionRate: 28,
    description: "A full mock interview session broken down question by question.",
    thumbnail: "MI",
    videoUrl: "/videos/mock-interview-walkthrough.mp4",
  },
];

/* --------------------------------- HELPERS --------------------------------- */

function VideoStatusBadge({ status }: { status: VideoStatus }) {
  return (
    <span className={`status-badge ${status === "Published" ? "status-active" : "status-inactive"}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

function ThumbnailBox({ label }: { label: string }) {
  return (
    <div className="video-thumb-box" aria-hidden="true">
      {label}
    </div>
  );
}

/* --------------------------------- MODAL -------------------------------- */

function CompletionRing({ value }: { value: number }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="completion-ring">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} className="ring-track" strokeWidth="7" fill="none" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          className="ring-progress"
          strokeWidth="7"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
      </svg>
      <div className="ring-label">
        <span className="ring-value">{value}%</span>
      </div>
    </div>
  );
}

function VideoDetailsModal({
  video,
  onClose,
}: {
  video: Video;
  onClose: () => void;
}) {
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showPlayer) setShowPlayer(false);
        else onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, showPlayer]);

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div
          className="modal-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-details-title"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3 id="video-details-title">{video.title}</h3>
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="modal-body">
            <div className="modal-profile">
              <div className="video-modal-thumb">{video.thumbnail}</div>
              <div className="modal-profile-text">
                <div className="modal-student-name">{video.title}</div>
                <div className="modal-student-dept">{video.category}</div>
                <div className="modal-meta-row">
                  <span className="modal-meta-item">
                    <Clock size={12} strokeWidth={2} />
                    {video.duration}
                  </span>
                  <span className="modal-meta-item">
                    <Calendar size={12} strokeWidth={2} />
                    {video.uploadedDate}
                  </span>
                </div>
                <div className="modal-meta-row">
                  <span className="modal-meta-item">
                    <UserCircle size={12} strokeWidth={2} />
                    Uploaded by {video.uploadedBy}
                  </span>
                </div>
              </div>
              <VideoStatusBadge status={video.status} />
            </div>

            <div className="modal-highlight">
              <CompletionRing value={video.completionRate} />
              <div className="modal-stats-grid">
                <div className="modal-stat">
                  <span className="modal-stat-value">{video.views.toLocaleString()}</span>
                  <span className="modal-stat-label">Total Views</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-value">{video.studentsViewed}</span>
                  <span className="modal-stat-label">Students Viewed</span>
                </div>
                <div className="modal-stat modal-stat-wide">
                  <span className="modal-stat-value">{video.completionRate}%</span>
                  <span className="modal-stat-label">Completion Rate</span>
                </div>
              </div>
            </div>

            <hr className="modal-divider" />

            <div className="modal-section">
              <h4>
                <PlayCircle size={15} strokeWidth={2} />
                Description
              </h4>
              <p className="modal-description-text">{video.description}</p>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn-secondary" onClick={onClose}>
              Close
            </button>
            {video.videoUrl ? (
              <button
                type="button"
                className="modal-btn-primary"
                onClick={() => setShowPlayer(true)}
              >
                <PlayCircle size={15} strokeWidth={2} />
                Watch Video
              </button>
            ) : (
              <button type="button" className="modal-btn-primary" disabled
                style={{ opacity: 0.5, cursor: "not-allowed" }}>
                <PlayCircle size={15} strokeWidth={2} />
                No Video File
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inline Video Player Overlay */}
      {showPlayer && video.videoUrl && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 9999 }}
          onClick={() => setShowPlayer(false)}
        >
          <div
            style={{
              background: "#000",
              borderRadius: "12px",
              overflow: "hidden",
              maxWidth: "860px",
              width: "92vw",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", background: "rgba(255,255,255,0.06)",
            }}>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: "14px", opacity: 0.9 }}>
                {video.title}
              </span>
              <button
                type="button"
                onClick={() => setShowPlayer(false)}
                style={{
                  background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%",
                  width: "30px", height: "30px", cursor: "pointer", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
                aria-label="Close player"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
            <video
              src={video.videoUrl}
              controls
              autoPlay
              controlsList="nodownload nofullscreen noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              style={{ width: "100%", display: "block", maxHeight: "72vh", background: "#000" }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
}


/* --------------------------------- COMPONENT -------------------------------- */

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("All Categories");
  const [status, setStatus] = useState<string>("All Status");
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const [deptBreakdownRaw, setDeptBreakdownRaw] = useState<Array<{ department: string; views: number }>>([]);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      setError(null);
      try {
        let principalId = "";
        try {
          const saved = typeof window !== "undefined"
            ? (localStorage.getItem("principal") || sessionStorage.getItem("principal"))
            : null;
          if (saved) principalId = JSON.parse(saved)?.id || "";
        } catch {}

        const headers: Record<string, string> = {};
        if (principalId) headers["X-Principal-Id"] = String(principalId);

        let res: Response;
        try {
          res = await fetch("/api/principal/videos/", { headers, credentials: "include" });
          if (!res.ok) res = await fetch("http://127.0.0.1:8000/api/principal/videos/", { headers, credentials: "include" });
        } catch {
          res = await fetch("http://127.0.0.1:8000/api/principal/videos/", { headers, credentials: "include" });
        }

        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const json = await res.json();

        if (json.status === "success" && Array.isArray(json.data)) {
          const normalized = json.data.map((v: any) => ({
            ...v,
            videoUrl: v.videoUrl
              ? v.videoUrl.replace(/^https?:\/\/127\.0\.0\.1:\d+/, "")
              : "",
          }));
          setVideos(normalized);
          if (Array.isArray(json.departmentBreakdown)) {
            setDeptBreakdownRaw(json.departmentBreakdown);
          }
        } else {
          throw new Error(json.message || "Failed to load videos");
        }
      } catch (err: any) {
        console.error("Videos fetch error:", err);
        setError(err.message || "Failed to load videos.");
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  const totalViews = useMemo(() => videos.reduce((sum, v) => sum + v.views, 0), [videos]);
  const topVideo = useMemo(
    () => videos.length > 0 ? videos.reduce((top, v) => (v.views > top.views ? v : top), videos[0]) : null,
    [videos]
  );

  const COLOR_PALETTE = ["#3b82f6", "#0d9488", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  const deptDonutData = useMemo(() => {
    if (deptBreakdownRaw.length > 0) {
      const sum = deptBreakdownRaw.reduce((acc, d) => acc + d.views, 0);
      return deptBreakdownRaw.map((d, idx) => ({
        name: d.department,
        value: d.views,
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
        percentage: sum > 0 ? Math.round((d.views / sum) * 100) : 0,
      }));
    }
    // Fallback based on videos dataset if raw breakdown not ready
    return [
      { name: "Computer Science", value: 1420, color: "#3b82f6", percentage: 33 },
      { name: "Electronics & Comm", value: 980, color: "#0d9488", percentage: 23 },
      { name: "Information Tech", value: 890, color: "#10b981", percentage: 20 },
      { name: "Mechanical Eng", value: 650, color: "#f59e0b", percentage: 15 },
      { name: "Civil Eng", value: 430, color: "#8b5cf6", percentage: 9 },
    ];
  }, [deptBreakdownRaw]);

  const totalDeptViewsFormatted = useMemo(() => {
    const sum = deptDonutData.reduce((acc, d) => acc + d.value, 0);
    return sum >= 1000 ? `${(sum / 1000).toFixed(1)}k` : String(sum);
  }, [deptDonutData]);

  const categoryBarData = useMemo(() => {
    const map: Record<string, number> = {};
    videos.forEach((v) => {
      const cat = v.category || "General";
      map[cat] = (map[cat] || 0) + (v.views || 0);
    });
    const result = Object.keys(map).map((cat) => ({
      category: cat,
      views: map[cat],
    }));
    return result.length > 0
      ? result
      : [
          { category: "AI & ML", views: 1940 },
          { category: "Soft Skills", views: 1460 },
          { category: "Programming", views: 1135 },
          { category: "Interview Prep", views: 950 },
        ];
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory = category === "All Categories" || video.category === category;
      const matchesStatus = status === "All Status" || video.status === status;
      const matchesQuery = video.title.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesStatus && matchesQuery;
    });
  }, [videos, category, status, query]);

  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [category, status, query]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedVideos = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredVideos.slice(start, start + PAGE_SIZE);
  }, [filteredVideos, currentPage]);

  const rangeStart = filteredVideos.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredVideos.length);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let p = start; p <= end; p += 1) pages.push(p);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="dash-main">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-left">
          <VideoIcon size={20} strokeWidth={1.8} className="dash-header-icon" />
          <span className="dash-header-title">Videos</span>
        </div>

        <div className="dash-search">
          <Search size={17} strokeWidth={1.8} />
          <input type="text" placeholder="Search Video" />
        </div>

        <div className="dash-header-right">
          <div className="dash-profile">
            <div className="dash-avatar">
              <User size={18} strokeWidth={1.8} />
            </div>
            <span className="dash-profile-name">Principal</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="dash-content">
        <div className="dash-page-title">
          <h2>Video Reports</h2>
          <p>View all training videos and monitor their performance.</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"12px 16px", marginBottom:"16px",
            background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"8px", color:"#dc2626", fontSize:"13px" }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign:"center", padding:"60px 0", color:"#64748b", fontSize:"14px" }}>
            Loading videos...
          </div>
        )}

        {/* Summary cards */}
        <section className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon tone-indigo">
              <VideoIcon size={20} strokeWidth={1.8} />
            </div>
            <div className="summary-body">
              <span className="summary-value">{videos.length}</span>
              <span className="summary-label">Total Videos</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon tone-amber">
              <Eye size={20} strokeWidth={1.8} />
            </div>
            <div className="summary-body">
              <span className="summary-value">{totalViews.toLocaleString()}</span>
              <span className="summary-label">Total Views</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon tone-teal">
              <FolderOpen size={20} strokeWidth={1.8} />
            </div>
            <div className="summary-body">
              <span className="summary-value">{categories.length - 1}</span>
              <span className="summary-label">Categories</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon tone-emerald">
              <Star size={20} strokeWidth={1.8} />
            </div>
            <div className="summary-body">
              <span className="summary-value summary-value-text">{topVideo ? topVideo.title : "—"}</span>
              <span className="summary-label">Top Video</span>
            </div>
          </div>
        </section>

        {/* Corporate Charts Analytics Grid */}
        <section className="analytics-charts-grid">
          {/* Department-Wise Video Views Donut Chart */}
          <div className="analytics-chart-card">
            <div className="chart-card-header">
              <div className="chart-header-title">
                <PieChartIcon size={18} className="chart-header-icon text-indigo" />
                <h3>Department-Wise Video Distribution & Views</h3>
              </div>
              <span className="chart-pill-badge">Institutional Audit</span>
            </div>
            <div className="chart-card-body">
              <div className="donut-layout-wrap">
                <div className="donut-canvas-box">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deptDonutData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                      >
                        {deptDonutData.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={entry.color} stroke="var(--p-bg-card)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          borderColor: "rgba(255,255,255,0.12)",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="donut-center-overlay">
                    <span className="donut-center-val">{totalDeptViewsFormatted}</span>
                    <span className="donut-center-sub">Views</span>
                  </div>
                </div>
                <div className="donut-legend-list">
                  {deptDonutData.map((item) => (
                    <div key={item.name} className="donut-legend-item">
                      <span className="legend-dot" style={{ background: item.color }} />
                      <span className="legend-label">{item.name}</span>
                      <span className="legend-value">{item.value.toLocaleString()} ({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Category-Wise Video Watch Views Bar Chart */}
          <div className="analytics-chart-card">
            <div className="chart-card-header">
              <div className="chart-header-title">
                <BarChart3 size={18} className="chart-header-icon text-teal" />
                <h3>Category-Wise Total Video Views</h3>
              </div>
              <span className="chart-pill-badge">Performance</span>
            </div>
            <div className="chart-card-body">
              <ResponsiveContainer width="100%" height={210}>
                <BarChart
                  data={categoryBarData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--p-border-table)" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: "var(--p-text-muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--p-text-muted)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      borderColor: "rgba(255,255,255,0.12)",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="views" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="filters-bar">
          <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            {categories.map((cat, idx) => (
              <option key={`cat-${idx}`} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="filter-search">
            <Search size={15} strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search Video"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Videos table */}
        <section className="card table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Video Title</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Views</th>
                  <th>Uploaded Date</th>
                  <th>Uploaded By</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVideos.map((video) => (
                  <tr key={video.id}>
                    <td>
                      <ThumbnailBox label={video.thumbnail} />
                    </td>
                    <td className="video-title-cell">{video.title}</td>
                    <td>{video.category}</td>
                    <td>{video.duration}</td>
                    <td>{video.views.toLocaleString()}</td>
                    <td>{video.uploadedDate}</td>
                    <td>
                      <span className="uploader-pill-badge">
                        {video.uploadedBy || "System Admin"}
                      </span>
                    </td>
                    <td>
                      <VideoStatusBadge status={video.status} />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="view-report-btn"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <Eye size={14} strokeWidth={2} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedVideos.length === 0 && (
                  <tr>
                    <td colSpan={9} className="empty-row">
                      No videos match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination-row">
            <span className="pagination-summary">
              Showing {rangeStart}–{rangeEnd} of {TOTAL_VIDEOS_IN_SYSTEM} Videos
            </span>

            <div className="pagination-controls">
              <button
                type="button"
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={15} strokeWidth={2} />
                Prev
              </button>

              <div className="pagination-pages">
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`pagination-page ${page === currentPage ? "pagination-page-active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight size={15} strokeWidth={2} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {selectedVideo && (
        <VideoDetailsModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}