"use client";

import { useState, useMemo, useRef } from "react";
import "./video.css";

/* ─────────────── Types ─────────────── */
type VideoStatus = "Active" | "Inactive";

type VideoItem = {
  id: number;
  title: string;
  year: string;
  uploadedBy: string;
  uploadDate: string;
  views: number;
  status: VideoStatus;
  thumbBg: string;
  thumbIcon: string;
};

/* ─────────────── Mock Data ─────────────── */
const INITIAL_VIDEOS: VideoItem[] = [
  { id: 1, title: "Python Basics",        year: "I Year",   uploadedBy: "Dr. Arun Kumar", uploadDate: "24-Jul-2026", views: 320, status: "Active", thumbBg: "#1a1a2e", thumbIcon: "PY" },
  { id: 2, title: "Django Models",        year: "II Year",  uploadedBy: "Dr. Arun Kumar", uploadDate: "22-Jul-2026", views: 280, status: "Active", thumbBg: "#0d2137", thumbIcon: "DJ" },
  { id: 3, title: "Database Management",  year: "III Year", uploadedBy: "Dr. Meena Raj",  uploadDate: "20-Jul-2026", views: 240, status: "Active", thumbBg: "#1e0a3c", thumbIcon: "DB" },
  { id: 4, title: "Computer Networks",    year: "IV Year",  uploadedBy: "Dr. Arun Kumar", uploadDate: "18-Jul-2026", views: 198, status: "Active", thumbBg: "#0a1628", thumbIcon: "CN" },
  { id: 5, title: "Operating Systems",    year: "I Year",   uploadedBy: "Dr. Arun Kumar", uploadDate: "15-Jul-2026", views: 175, status: "Active", thumbBg: "#1a1a2e", thumbIcon: "OS" },
  { id: 6, title: "Data Structures",      year: "II Year",  uploadedBy: "Dr. Meena Raj",  uploadDate: "12-Jul-2026", views: 310, status: "Active", thumbBg: "#0d2137", thumbIcon: "DS" },
  { id: 7, title: "Machine Learning",     year: "III Year", uploadedBy: "Dr. Arun Kumar", uploadDate: "10-Jul-2026", views: 290, status: "Active", thumbBg: "#1e0a3c", thumbIcon: "ML" },
  { id: 8, title: "Web Development",      year: "IV Year",  uploadedBy: "Dr. Arun Kumar", uploadDate: "08-Jul-2026", views: 255, status: "Active", thumbBg: "#0a1628", thumbIcon: "WD" },
  { id: 9, title: "Cloud Computing",      year: "I Year",   uploadedBy: "Dr. Meena Raj",  uploadDate: "05-Jul-2026", views: 195, status: "Inactive", thumbBg: "#1a1a2e", thumbIcon: "CC" },
  { id: 10, title: "Cybersecurity",       year: "II Year",  uploadedBy: "Dr. Arun Kumar", uploadDate: "02-Jul-2026", views: 210, status: "Active", thumbBg: "#0d2137", thumbIcon: "CY" },
];

const CURRENT_HOD = "Dr. Arun Kumar";
const YEARS = ["I Year", "II Year", "III Year", "IV Year"];
const PAGE_SIZE_ALL = 4;
const PAGE_SIZE_MY  = 3;

const YEAR_COLORS: Record<string, { color: string; bg: string }> = {
  "I Year":   { color: "#4f6cf7", bg: "#eef1fe" },
  "II Year":  { color: "#4f6cf7", bg: "#eef1fe" },
  "III Year": { color: "#7c3aed", bg: "#ede9fe" },
  "IV Year":  { color: "#d97706", bg: "#fef3c7" },
};

/* ─────────────── Thumb Icon colours ─────────────── */
const ICON_COLORS: Record<string, string> = {
  PY:"#f7c35f", DJ:"#44b78b", DB:"#e06c5e", CN:"#6eb5ff",
  OS:"#a78bfa", DS:"#fb923c", ML:"#34d399", WD:"#60a5fa",
  CC:"#f472b6", CY:"#facc15",
};

function ThumbCell({ v }: { v: VideoItem }) {
  return (
    <div className="vx-thumb" style={{ background: v.thumbBg }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 4l15 8-15 8V4z" fill={ICON_COLORS[v.thumbIcon] ?? "#fff"} />
      </svg>
      <span className="vx-thumb-lbl" style={{ color: ICON_COLORS[v.thumbIcon] ?? "#fff" }}>
        {v.thumbIcon}
      </span>
    </div>
  );
}

function YearBadge({ year }: { year: string }) {
  const c = YEAR_COLORS[year] ?? { color: "#4f6cf7", bg: "#eef1fe" };
  return (
    <span className="vx-year-badge" style={{ color: c.color, background: c.bg }}>
      {year}
    </span>
  );
}

function StatusBadge({ status }: { status: VideoStatus }) {
  return (
    <span className={`vx-status ${status === "Active" ? "vx-status--active" : "vx-status--inactive"}`}>
      <span className="vx-status-dot" />
      {status}
    </span>
  );
}

function Pagination({
  page, total, pageSize, onChange,
}: { page: number; total: number; pageSize: number; onChange: (p: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safe = Math.min(page, totalPages);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - safe) <= 1)
    .reduce<(number | "…")[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="vx-pagination">
      <button className="vx-pg-nav" onClick={() => onChange(safe - 1)} disabled={safe === 1}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`d${i}`} className="vx-pg-dots">…</span>
        ) : (
          <button
            key={p}
            className={`vx-pg-num ${safe === p ? "vx-pg-num--active" : ""}`}
            onClick={() => onChange(p as number)}
          >
            {p}
          </button>
        )
      )}
      <button className="vx-pg-nav" onClick={() => onChange(safe + 1)} disabled={safe === totalPages}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

/* ─────────────── Main Component ─────────────── */
export default function HodVideosPage() {
  const [videos, setVideos]       = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [allSearch, setAllSearch] = useState("");
  const [mySearch, setMySearch]   = useState("");
  const [allPage, setAllPage]     = useState(1);
  const [myPage, setMyPage]       = useState(1);

  /* Upload form */
  const [form, setForm] = useState({
    title: "", year: "", description: "",
    videoFile: null as File | null,
    thumbFile: null as File | null,
  });
  const videoRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const patch = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  /* ── All videos filtered ── */
  const allFiltered = useMemo(() => {
    const q = allSearch.toLowerCase();
    return videos.filter(v => v.title.toLowerCase().includes(q));
  }, [videos, allSearch]);

  const allTotalPages = Math.max(1, Math.ceil(allFiltered.length / PAGE_SIZE_ALL));
  const allSafe       = Math.min(allPage, allTotalPages);
  const allSlice      = allFiltered.slice((allSafe - 1) * PAGE_SIZE_ALL, allSafe * PAGE_SIZE_ALL);

  /* ── My videos filtered ── */
  const myAll      = useMemo(() => videos.filter(v => v.uploadedBy === CURRENT_HOD), [videos]);
  const myFiltered = useMemo(() => {
    const q = mySearch.toLowerCase();
    return myAll.filter(v => v.title.toLowerCase().includes(q));
  }, [myAll, mySearch]);

  const myTotalPages = Math.max(1, Math.ceil(myFiltered.length / PAGE_SIZE_MY));
  const mySafe       = Math.min(myPage, myTotalPages);
  const mySlice      = myFiltered.slice((mySafe - 1) * PAGE_SIZE_MY, mySafe * PAGE_SIZE_MY);

  /* ── Upload submit ── */
  const handleUpload = () => {
    if (!form.title || !form.year) return;
    const initials = form.title.slice(0, 2).toUpperCase();
    const newVid: VideoItem = {
      id: Date.now(),
      title: form.title,
      year: form.year,
      uploadedBy: CURRENT_HOD,
      uploadDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-"),
      views: 0,
      status: "Active",
      thumbBg: "#1a1a2e",
      thumbIcon: initials,
    };
    setVideos(v => [newVid, ...v]);
    setForm({ title: "", year: "", description: "", videoFile: null, thumbFile: null });
    setAllPage(1);
    setMyPage(1);
  };

  return (
    <div className="vx-page">
      {/* ══════════ HEADER ══════════ */}
      <header className="vx-header">
        <div className="vx-header-left">
          <div className="vx-header-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="3" fill="#fff" fillOpacity="0.2" />
              <rect x="2" y="4" width="20" height="16" rx="3" stroke="#fff" strokeWidth="1.5" />
              <path d="M10 9l5 3-5 3V9z" fill="#fff" />
            </svg>
          </div>
          <div>
            <h1 className="vx-header-title">All Videos</h1>
            <p className="vx-header-sub">View all videos available in your department</p>
          </div>
        </div>
        <div className="vx-header-right">
          {/* Bell */}
          <button className="vx-bell">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="vx-bell-badge">3</span>
          </button>
          {/* Profile */}
          <div className="vx-profile">
            <div className="vx-avatar">AK</div>
            <div className="vx-profile-info">
              <span className="vx-profile-name">Dr. Arun Kumar</span>
              <span className="vx-profile-role">HOD – CSE</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </header>

      <main className="vx-main">
        {/* ══════════ ALL VIDEOS SECTION ══════════ */}
        <div className="vx-card">
          {/* Search + My Videos btn */}
          <div className="vx-all-toolbar">
            <div className="vx-search-wrap">
              <svg className="vx-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                className="vx-search-input"
                placeholder="Search videos by title…"
                value={allSearch}
                onChange={e => { setAllSearch(e.target.value); setAllPage(1); }}
              />
            </div>
            <a href="#my-videos" className="vx-my-btn">
              My Videos
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Table */}
          <div className="vx-table-wrap">
            <table className="vx-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>THUMBNAIL</th>
                  <th>VIDEO TITLE</th>
                  <th>YEAR</th>
                  <th>UPLOADED BY</th>
                  <th>UPLOAD DATE</th>
                  <th>VIEWS</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {allSlice.length > 0 ? allSlice.map((v, idx) => (
                  <tr key={v.id}>
                    <td className="vx-td-num">{(allSafe - 1) * PAGE_SIZE_ALL + idx + 1}</td>
                    <td><ThumbCell v={v} /></td>
                    <td className="vx-td-title">{v.title}</td>
                    <td><YearBadge year={v.year} /></td>
                    <td className="vx-td-by">{v.uploadedBy}</td>
                    <td className="vx-td-date">
                      <div className="vx-date-cell">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="4" width="18" height="18" rx="2" stroke="#9ca3af" strokeWidth="1.8" />
                          <path d="M16 2v4M8 2v4M3 10h18" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        {v.uploadDate}
                      </div>
                    </td>
                    <td className="vx-td-views">{v.views}</td>
                    <td><StatusBadge status={v.status} /></td>
                    <td>
                      <button className="vx-eye-btn">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="3" stroke="#6b7280" strokeWidth="1.8" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="vx-empty">No videos found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="vx-table-footer">
            <span className="vx-showing">
              Showing {allFiltered.length === 0 ? 0 : (allSafe - 1) * PAGE_SIZE_ALL + 1}–{Math.min(allSafe * PAGE_SIZE_ALL, allFiltered.length)} of {allFiltered.length} videos
            </span>
            <Pagination page={allSafe} total={allFiltered.length} pageSize={PAGE_SIZE_ALL} onChange={p => setAllPage(p)} />
          </div>
        </div>

        {/* ══════════ BOTTOM: MY VIDEOS + UPLOAD FORM ══════════ */}
        <div className="vx-bottom-row" id="my-videos">
          {/* ── My Videos Panel ── */}
          <div className="vx-card vx-my-panel">
            <div className="vx-my-header">
              <div className="vx-my-title-row">
                <div className="vx-my-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="#4f6cf7" strokeWidth="2" />
                    <path d="M10 9l5 3-5 3V9z" fill="#4f6cf7" />
                  </svg>
                </div>
                <div>
                  <div className="vx-my-title">My Videos</div>
                  <div className="vx-my-sub">Videos uploaded by you</div>
                </div>
              </div>
              <button className="vx-upload-top-btn" onClick={() => document.getElementById("upload-title")?.focus()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12l7-7 7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Upload Video
              </button>
            </div>

            {/* My search */}
            <div className="vx-search-wrap vx-my-search">
              <svg className="vx-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                className="vx-search-input vx-search-sm"
                placeholder="Search my videos..."
                value={mySearch}
                onChange={e => { setMySearch(e.target.value); setMyPage(1); }}
              />
            </div>

            {/* My Videos Table */}
            <div className="vx-table-wrap">
              <table className="vx-table vx-table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>THUMBNAIL</th>
                    <th>VIDEO TITLE</th>
                    <th>YEAR</th>
                    <th>UPLOAD DATE</th>
                    <th>VIEWS</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {mySlice.length > 0 ? mySlice.map((v, idx) => (
                    <tr key={v.id}>
                      <td className="vx-td-num">{(mySafe - 1) * PAGE_SIZE_MY + idx + 1}</td>
                      <td><ThumbCell v={v} /></td>
                      <td className="vx-td-title">{v.title}</td>
                      <td><YearBadge year={v.year} /></td>
                      <td>
                        <div className="vx-date-cell">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#9ca3af" strokeWidth="1.8" />
                            <path d="M16 2v4M8 2v4M3 10h18" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                          {v.uploadDate}
                        </div>
                      </td>
                      <td className="vx-td-views">{v.views}</td>
                      <td><StatusBadge status={v.status} /></td>
                      <td>
                        <div className="vx-action-group">
                          <button className="vx-eye-btn">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              <circle cx="12" cy="12" r="3" stroke="#6b7280" strokeWidth="1.8" />
                            </svg>
                          </button>
                          <button className="vx-edit-btn">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={8} className="vx-empty">No videos found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* My Videos Footer */}
            <div className="vx-table-footer">
              <span className="vx-showing">
                Showing {myFiltered.length === 0 ? 0 : (mySafe - 1) * PAGE_SIZE_MY + 1}–{Math.min(mySafe * PAGE_SIZE_MY, myFiltered.length)} of {myFiltered.length} videos
              </span>
              <Pagination page={mySafe} total={myFiltered.length} pageSize={PAGE_SIZE_MY} onChange={p => setMyPage(p)} />
            </div>
          </div>

          {/* ── Upload New Video Panel ── */}
          <div className="vx-card vx-upload-panel">
            <div className="vx-upload-header">
              <div className="vx-my-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="3" stroke="#4f6cf7" strokeWidth="2" />
                  <path d="M10 9l5 3-5 3V9z" fill="#4f6cf7" />
                </svg>
              </div>
              <h3 className="vx-upload-title">Upload New Video</h3>
            </div>

            <div className="vx-form">
              {/* Row 1: Title + Year */}
              <div className="vx-form-row">
                <div className="vx-form-group">
                  <label>Video Title</label>
                  <input
                    id="upload-title"
                    className="vx-input"
                    placeholder="Enter video title"
                    value={form.title}
                    onChange={e => patch("title", e.target.value)}
                  />
                </div>
                <div className="vx-form-group">
                  <label>Year</label>
                  <select className="vx-input vx-select" value={form.year} onChange={e => patch("year", e.target.value)}>
                    <option value="">Select Year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 2: Video File + Thumbnail */}
              <div className="vx-form-row">
                <div className="vx-form-group">
                  <label>Video File</label>
                  <div className="vx-file-box" onClick={() => videoRef.current?.click()}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 2v6h6M12 12v6M9 15l3-3 3 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{form.videoFile ? form.videoFile.name : "Choose video file (mp4, mov, etc.)"}</span>
                    <input ref={videoRef} type="file" accept="video/*" style={{ display: "none" }}
                      onChange={e => patch("videoFile", e.target.files?.[0] ?? null)} />
                  </div>
                </div>
                <div className="vx-form-group">
                  <label>Thumbnail</label>
                  <div className="vx-file-box" onClick={() => thumbRef.current?.click()}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#9ca3af" strokeWidth="1.5" />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="#9ca3af" />
                      <path d="M21 15l-5-5L5 21" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>{form.thumbFile ? form.thumbFile.name : "Choose thumbnail image (jpg, png)"}</span>
                    <input ref={thumbRef} type="file" accept="image/*" style={{ display: "none" }}
                      onChange={e => patch("thumbFile", e.target.files?.[0] ?? null)} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="vx-form-group">
                <label>Description</label>
                <textarea
                  className="vx-textarea"
                  placeholder="Enter video description"
                  rows={4}
                  value={form.description}
                  onChange={e => patch("description", e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="vx-form-btns">
                <button className="vx-btn-cancel" onClick={() => setForm({ title: "", year: "", description: "", videoFile: null, thumbFile: null })}>
                  Cancel
                </button>
                <button
                  className="vx-btn-upload"
                  onClick={handleUpload}
                  disabled={!form.title || !form.year}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Upload Video
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
