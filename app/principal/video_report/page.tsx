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
  BarChart3,
  PieChart as PieChartIcon,
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

const statuses: Array<"All Status" | VideoStatus> = ["All Status", "Published", "Draft"];
const PAGE_SIZE = 10;

/* --------------------------------- HELPERS --------------------------------- */

function VideoStatusBadge({ status }: { status: VideoStatus }) {
  return (
    <span className={`principal-video-status-badge ${status === "Published" ? "principal-video-status-active" : "principal-video-status-inactive"}`}>
      <span className="principal-video-status-dot" />
      {status}
    </span>
  );
}

function ThumbnailBox({ label }: { label: string }) {
  return (
    <div className="principal-video-thumb-box" aria-hidden="true">
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
        <span className="ring-sub">Done</span>
      </div>
    </div>
  );
}

interface VideoDetailModalProps {
  video: Video;
  onClose: () => void;
}

function VideoDetailModal({ video, onClose }: VideoDetailModalProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card shadow-lg" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title-wrap">
              <span className="modal-category-tag">{video.category || "General"}</span>
              <h3 className="modal-title-text">{video.title}</h3>
            </div>
            <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="modal-body">
            <div className="modal-hero">
              <div className="modal-completion-col">
                <CompletionRing value={video.completionRate || 0} />
              </div>

              <div className="modal-meta-grid">
                <div className="modal-stat">
                  <span className="modal-stat-value">{video.duration || "N/A"}</span>
                  <span className="modal-stat-label">Duration</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-value">{(video.views || 0).toLocaleString()}</span>
                  <span className="modal-stat-label">Total Views</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-value">{video.uploadedDate || "N/A"}</span>
                  <span className="modal-stat-label">Uploaded</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-value">{video.uploadedBy || "System Admin"}</span>
                  <span className="modal-stat-label">Uploaded By</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-value">{video.studentsViewed || 0}</span>
                  <span className="modal-stat-label">Students Viewed</span>
                </div>
                <div className="modal-stat modal-stat-wide">
                  <span className="modal-stat-value">{video.completionRate || 0}%</span>
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
              <p className="modal-description-text">{video.description || "No description available for this video."}</p>
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

/* --------------------------------- MAIN PAGE COMPONENT -------------------------------- */

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

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://online-management-backend.onrender.com";

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("principal_video_reports_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.videos) setVideos(parsed.videos);
        if (parsed?.deptBreakdownRaw) setDeptBreakdownRaw(parsed.deptBreakdownRaw);
        setLoading(false);
      }
    } catch (_) {}

    async function fetchVideos() {
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
          res = await fetch(`${API_BASE}/api/principal/videos/`, { headers, credentials: "include" });
        } catch {
          res = await fetch("/api/principal/videos/", { headers, credentials: "include" });
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
          const deptBreak = Array.isArray(json.departmentBreakdown) ? json.departmentBreakdown : [];
          setDeptBreakdownRaw(deptBreak);
          try {
            sessionStorage.setItem("principal_video_reports_cache", JSON.stringify({ videos: normalized, deptBreakdownRaw: deptBreak }));
          } catch (_) {}
        } else {
          throw new Error(json.message || "Failed to load videos");
        }
      } catch (err: any) {
        console.error("Videos fetch error:", err);
        setError(err.message || "Failed to load video analytics.");
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, [API_BASE]);

  // Dynamic Categories Dropdown list
  const categoryOptions = useMemo(() => {
    const uniqueCats = Array.from(new Set(videos.map((v) => v.category).filter(Boolean)));
    return ["All Categories", ...uniqueCats];
  }, [videos]);

  const totalViews = useMemo(() => videos.reduce((sum, v) => sum + (v.views || 0), 0), [videos]);
  const topVideo = useMemo(
    () => videos.length > 0 ? videos.reduce((top, v) => ((v.views || 0) > (top.views || 0) ? v : top), videos[0]) : null,
    [videos]
  );

  const COLOR_PALETTE = ["#3b82f6", "#0d9488", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  const deptDonutData = useMemo(() => {
    if (deptBreakdownRaw.length > 0) {
      const sum = deptBreakdownRaw.reduce((acc, d) => acc + (d.views || 0), 0);
      return deptBreakdownRaw.map((d, idx) => ({
        name: d.department,
        value: d.views || 0,
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
        percentage: sum > 0 ? Math.round(((d.views || 0) / sum) * 100) : 0,
      }));
    }
    // Fallback if department views are present in total views
    if (totalViews > 0) {
      return [
        {
          name: "Information Technology",
          value: totalViews,
          color: COLOR_PALETTE[0],
          percentage: 100,
        }
      ];
    }
    return [];
  }, [deptBreakdownRaw, totalViews]);

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
    return Object.keys(map).map((cat) => ({
      category: cat,
      views: map[cat],
    }));
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
    <div className="principal-video-page">
      {/* Header */}
      <header className="principal-video-header">
        <div className="principal-video-header-left">
          <VideoIcon size={20} strokeWidth={1.8} className="principal-video-header-icon" />
          <span className="principal-video-header-title">Videos</span>
        </div>

        <div className="principal-video-header-search">
          <Search size={17} strokeWidth={1.8} />
          <input 
            type="text" 
            placeholder="Search Video" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
          />
        </div>

        <div className="principal-video-header-profile">
          <div className="principal-video-header-avatar">
            <User size={18} strokeWidth={1.8} />
          </div>
          <span className="principal-video-header-username">Principal</span>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="principal-video-content">
        <div className="principal-video-welcome">
          <h2 className="principal-video-welcome-title">Video Reports</h2>
          <p className="principal-video-welcome-desc">View all training videos and monitor their performance across your institution.</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="principal-video-error">
            ⚠ {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="dash-skeleton-wrapper">
            <div className="dash-skeleton-kpi-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="dash-skeleton-kpi-card skeleton-shimmer" />
              ))}
            </div>
            <div className="dash-skeleton-charts-row">
              <div className="dash-skeleton-chart-large skeleton-shimmer" style={{ height: 260 }} />
              <div className="dash-skeleton-chart-small skeleton-shimmer" style={{ height: 260 }} />
            </div>
            <div className="dash-skeleton-table-card skeleton-shimmer" style={{ height: 350 }} />
          </div>
        ) : (
          <>
            {/* Summary KPI Cards */}
            <section className="principal-video-stats-grid">
          <div className="principal-video-stat-card">
            <div className="principal-video-stat-icon principal-video-stat-icon-indigo">
              <VideoIcon size={20} strokeWidth={1.8} />
            </div>
            <div className="principal-video-stat-body">
              <span className="principal-video-stat-value">{videos.length}</span>
              <span className="principal-video-stat-label">Total Videos</span>
            </div>
          </div>

          <div className="principal-video-stat-card">
            <div className="principal-video-stat-icon principal-video-stat-icon-amber">
              <Eye size={20} strokeWidth={1.8} />
            </div>
            <div className="principal-video-stat-body">
              <span className="principal-video-stat-value">{totalViews.toLocaleString()}</span>
              <span className="principal-video-stat-label">Total Views</span>
            </div>
          </div>

          <div className="principal-video-stat-card">
            <div className="principal-video-stat-icon principal-video-stat-icon-teal">
              <FolderOpen size={20} strokeWidth={1.8} />
            </div>
            <div className="principal-video-stat-body">
              <span className="principal-video-stat-value">{categoryOptions.length > 1 ? categoryOptions.length - 1 : 0}</span>
              <span className="principal-video-stat-label">Categories</span>
            </div>
          </div>

          <div className="principal-video-stat-card">
            <div className="principal-video-stat-icon principal-video-stat-icon-emerald">
              <Star size={20} strokeWidth={1.8} />
            </div>
            <div className="principal-video-stat-body">
              <span className="principal-video-stat-value principal-video-stat-value-text">{topVideo ? topVideo.title : "—"}</span>
              <span className="principal-video-stat-label">Top Video</span>
            </div>
          </div>
        </section>

        {/* Charts Analytics Grid */}
        <section className="principal-video-charts-grid">
          {/* ===== DEPARTMENT-WISE VIDEO DISTRIBUTION CARD (SCOPED UNIQUE UI) ===== */}
          <div className="principal-video-chart-card light-department-video-card">
            <div className="principal-video-chart-header light-department-video-header">
              <div className="principal-video-chart-title light-department-video-title">
                <PieChartIcon size={18} className="principal-video-chart-icon" />
                <h3>Department-Wise Video Distribution & Views</h3>
              </div>
              <span className="principal-video-chart-badge light-department-video-badge">Institutional Audit</span>
            </div>

            <div className="principal-video-chart-body light-department-video-body">
              {deptDonutData.length === 0 || totalDeptViewsFormatted === "0" ? (
                <div className="light-department-video-empty">
                  <div className="light-department-video-empty-icon">📊</div>
                  <div className="light-department-video-empty-title">No Department Video Data</div>
                  <div className="light-department-video-empty-sub">No department-wise video distribution data is available.</div>
                  <div className="light-department-video-empty-hint">Charts will appear automatically when videos are uploaded.</div>
                </div>
              ) : (
                <div className="light-department-video-wrapper">
                  <div className="light-department-video-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deptDonutData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={48}
                          outerRadius={72}
                          paddingAngle={3}
                        >
                          {deptDonutData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.color} stroke="var(--p-bg-card, #0f172a)" strokeWidth={2} />
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
                    <div className="light-department-video-center-label">
                      <span className="light-department-video-center-value">{totalDeptViewsFormatted}</span>
                      <span className="light-department-video-center-sub">Views</span>
                    </div>
                  </div>

                  <div className="light-department-video-legend">
                    {deptDonutData.map((item) => (
                      <div key={item.name} className="light-department-video-legend-item" title={item.name}>
                        <span className="light-department-video-legend-dot" style={{ background: item.color }} />
                        <span className="light-department-video-legend-name">{item.name}</span>
                        <span className="light-department-video-legend-val">{item.value.toLocaleString()} ({item.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===== CATEGORY-WISE VIDEO VIEWS BAR CHART (SCOPED UNIQUE UI) ===== */}
          <div className="principal-video-chart-card light-category-video-card">
            <div className="principal-video-chart-header light-category-video-header">
              <div className="principal-video-chart-title light-category-video-title">
                <BarChart3 size={18} className="principal-video-chart-icon text-teal" />
                <h3>Category-Wise Total Video Views</h3>
              </div>
              <span className="principal-video-chart-badge light-category-video-badge">Performance</span>
            </div>

            <div className="principal-video-chart-body light-category-video-body">
              {categoryBarData.length === 0 || categoryBarData.every((d: any) => d.views === 0) ? (
                <div className="light-category-video-empty">
                  <div className="light-category-video-empty-icon">📊</div>
                  <div className="light-category-video-empty-title">No Category Analytics Available</div>
                  <div className="light-category-video-empty-sub">No category-wise video views have been recorded yet.</div>
                  <div className="light-category-video-empty-hint">Analytics will appear automatically when videos receive views.</div>
                </div>
              ) : (
                <div className="light-category-video-chart">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={categoryBarData}
                      margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--p-border-table, #cbd5e1)" vertical={false} />
                      <XAxis dataKey="category" tick={{ fontSize: 11, fill: "var(--p-text-muted, #64748b)" }} axisLine={false} tickLine={false} />
                      <YAxis 
                        tick={{ fontSize: 11, fill: "var(--p-text-muted, #64748b)" }} 
                        axisLine={false} 
                        tickLine={false} 
                        allowDecimals={false} 
                        domain={[0, (dataMax: number) => (dataMax > 0 ? Math.ceil(dataMax * 1.1) : 100)]}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--p-bg-card, #ffffff)",
                          borderColor: "#cbd5e1",
                          borderRadius: "12px",
                          color: "var(--p-text-primary, #0f172a)",
                          fontSize: "12px",
                          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
                        }}
                      />
                      <Bar dataKey="views" fill="#0d9488" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="principal-video-filters-bar">
          <select
            className="principal-video-filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="principal-video-filter-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <div className="principal-video-search-box video-report-search-box">
            <Search size={15} strokeWidth={1.8} className="principal-video-search-icon" />
            <input
              type="text"
              placeholder="Search Video..."
              className="principal-video-search-input video-report-search-input"
              style={{ background: "transparent", backgroundColor: "transparent" }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Video Table Card */}
        <section className="principal-video-table-card">
          <div className="principal-video-table-wrap">
            <table className="principal-video-table">
              <colgroup>
                <col className="col-thumb" />
                <col className="col-title" />
                <col className="col-category" />
                <col className="col-duration" />
                <col className="col-views" />
                <col className="col-date" />
                <col className="col-uploader" />
                <col className="col-status" />
                <col className="col-action" />
              </colgroup>
              <thead>
                <tr>
                  <th className="principal-video-th">Thumbnail</th>
                  <th className="principal-video-th">Video Title</th>
                  <th className="principal-video-th">Category</th>
                  <th className="principal-video-th">Duration</th>
                  <th className="principal-video-th">Views</th>
                  <th className="principal-video-th">Uploaded Date</th>
                  <th className="principal-video-th">Uploaded By</th>
                  <th className="principal-video-th">Status</th>
                  <th className="principal-video-th">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVideos.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="principal-video-table-empty">
                      No videos match these filters.
                    </td>
                  </tr>
                ) : (
                  paginatedVideos.map((vid) => (
                    <tr key={vid.id}>
                      <td className="principal-video-td">
                        <ThumbnailBox label={vid.thumbnail || (vid.title ? vid.title.slice(0, 2).toUpperCase() : "VD")} />
                      </td>
                      <td className="principal-video-td principal-video-cell-title" title={vid.title}>
                        {vid.title}
                      </td>
                      <td className="principal-video-td">
                        <span className="principal-video-category-badge">{vid.category || "General"}</span>
                      </td>
                      <td className="principal-video-td">{vid.duration || "N/A"}</td>
                      <td className="principal-video-td principal-video-cell-views">{(vid.views || 0).toLocaleString()}</td>
                      <td className="principal-video-td">{vid.uploadedDate || "N/A"}</td>
                      <td className="principal-video-td">
                        <span className="principal-video-uploader-truncate" title={vid.uploadedBy || "System Admin"}>
                          {vid.uploadedBy || "System Admin"}
                        </span>
                      </td>
                      <td className="principal-video-td">
                        <VideoStatusBadge status={vid.status || "Published"} />
                      </td>
                      <td className="principal-video-td">
                        <button
                          type="button"
                          className="principal-video-action-btn"
                          onClick={() => setSelectedVideo(vid)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="principal-video-pagination-footer">
            <span className="principal-video-pagination-info">
              Showing {rangeStart} to {rangeEnd} of {filteredVideos.length} videos
            </span>

            <div className="principal-video-pagination-controls">
              <button
                type="button"
                className="principal-video-page-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} strokeWidth={2} />
              </button>

              {pageNumbers.map((pageNo) => (
                <button
                  key={pageNo}
                  type="button"
                  className={`principal-video-page-btn ${pageNo === currentPage ? "principal-video-page-btn-active" : ""}`}
                  onClick={() => setCurrentPage(pageNo)}
                >
                  {pageNo}
                </button>
              ))}

              <button
                type="button"
                className="principal-video-page-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
              >
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </section>
          </>
        )}
      </main>

      {/* Video Detail Modal */}
      {selectedVideo && (
        <VideoDetailModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}