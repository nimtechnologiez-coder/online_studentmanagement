"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Clock,
  Sparkles,
  User,
  X,
  FileText,
  Loader2,
  AlertCircle,
  Video,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  BarChart2,
  CheckCircle2
} from "lucide-react";
import "./continuewatching.css";

const API_BASE = "http://127.0.0.1:8000";

function getStudentId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("student") || sessionStorage.getItem("student");
    if (saved) return String(JSON.parse(saved).id);
  } catch {}
  return null;
}

export default function ContinueWatchingPage() {
  const [continueList, setContinueList] = useState<any[]>([]);
  const [watchStats, setWatchStats] = useState<any>({
    totalVideos: 0,
    completed: 0,
    pending: 0,
    watchHours: 0,
  });
  const [recentHistory, setRecentHistory] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError("");
      const studentId = getStudentId();
      
      // 1. Fetch watched videos & active sessions
      const vRes = await fetch(`${API_BASE}/api/student/videos/`, {
        headers: studentId ? { "X-Student-Id": studentId } : {},
      });
      const vData = await vRes.json();
      
      let vList: any[] = [];
      if (vData.status === "success") {
        vList = vData.videos || [];
      }

      // Filter for videos that have actual watch progress (> 0%)
      const inProgressVideos = vList.filter((v: any) => (v.progress || 0) > 0);
      setContinueList(inProgressVideos);

      if (inProgressVideos.length > 0) {
        setActiveVideo(inProgressVideos[0]);
      } else if (vList.length > 0) {
        setActiveVideo(vList[0]);
      }

      // 2. Fetch live student watch statistics
      const pRes = await fetch(`${API_BASE}/api/student/progress/`, {
        headers: studentId ? { "X-Student-Id": studentId } : {},
      });
      const pData = await pRes.json();
      if (pData.status === "success") {
        if (pData.stats) setWatchStats(pData.stats);
        if (pData.recentVideos) setRecentHistory(pData.recentVideos);
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenPlayer(item: any) {
    setActiveVideo(item);
    setIsPlayingModalOpen(true);
    try {
      const studentId = getStudentId();
      await fetch(`${API_BASE}/api/student/videos/${item.id}/watch/`, {
        method: "POST",
        headers: studentId ? { "X-Student-Id": studentId } : {},
      });
    } catch (err) {
      console.error("Failed to update watch log:", err);
    }
  }

  async function saveProgress(videoId: number, currentTime: number) {
    const studentId = getStudentId();
    if (!studentId) return;
    try {
      await fetch(`${API_BASE}/api/student/videos/${videoId}/progress/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Student-Id": studentId,
        },
        body: JSON.stringify({ watched_seconds: Math.floor(currentTime) }),
      });
    } catch (err) {
      console.error("Failed to save progress:", err);
    }
  }

  function handleTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>, videoId: number) {
    const video = e.currentTarget;
    if (!progressTimerRef.current) {
      progressTimerRef.current = setTimeout(() => {
        progressTimerRef.current = null;
        saveProgress(videoId, video.currentTime);
      }, 5000);
    }
  }

  function handleVideoEnded(videoId: number, duration: number) {
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    saveProgress(videoId, duration);
  }

  function handleCloseModal() {
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setIsPlayingModalOpen(false);
  }

  const hasWatchHistory = recentHistory.length > 0 || continueList.length > 0;

  return (
    <div className="cw-page-wrapper">
      {/* Top Main Page Header */}
      <header className="cw-main-header">
        <div className="cw-title-area">
          <div className="cw-brand-icon">
            <Play size={20} fill="#3b82f6" color="#3b82f6" />
          </div>
          <div>
            <h1>Continue Watching</h1>
            <p>Pick up right where you left off in your active modules.</p>
          </div>
        </div>

        <div className="cw-active-pill">
          <Sparkles size={14} />
          <span>{continueList.length} Active Modules</span>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="cw-error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={fetchData}>Retry</button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="cw-loading-container">
          <Loader2 size={36} className="animate-spin text-blue-500" />
          <p>Loading your learning workspace...</p>
        </div>
      )}

      {!loading && !hasWatchHistory && (
        <div className="cw-empty-card">
          <div className="cw-empty-icon-wrap">
            <Video size={32} />
          </div>
          <h3 className="cw-empty-title">No video activity found</h3>
          <p className="cw-empty-desc">
            You haven't watched any video lectures yet. Start watching your first video to track your progress and pick up where you left off.
          </p>
          <Link href="/Student/MyVideos" className="cw-empty-btn">
            <Play size={16} fill="white" />
            <span>Browse Video Lectures</span>
          </Link>
        </div>
      )}

      {!loading && hasWatchHistory && activeVideo && (
        <>
          {/* Main Hero Card + Side Card Grid */}
          <div className="cw-hero-grid">
            {/* Main Featured Player Hero */}
            <div className="cw-hero-main-card">
              <div className="cw-hero-banner">
                <div className="cw-banner-tag">{activeVideo.category || "Course Module"}</div>

                <div className="cw-banner-body">
                  <h2>{activeVideo.title}</h2>
                  <div className="cw-banner-meta">
                    <span><User size={13} /> Faculty Lecture</span>
                    <span>•</span>
                    <span>{activeVideo.duration || "15:00"}</span>
                  </div>
                  <p className="cw-banner-desc">
                    {activeVideo.description || "Pick up where you left off in your active module."}
                  </p>

                  <div className="cw-banner-actions">
                    <button className="cw-btn-blue" onClick={() => handleOpenPlayer(activeVideo)}>
                      <Play size={14} fill="white" /> Resume Lecture Stream
                    </button>
                  </div>
                </div>

                {/* Right Image/Video Thumbnail Area */}
                <div className="cw-hero-media" onClick={() => handleOpenPlayer(activeVideo)}>
                  {activeVideo.thumbnail_url ? (
                    <img src={activeVideo.thumbnail_url} alt={activeVideo.title} />
                  ) : (
                    <img src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1000&auto=format&fit=crop" alt="Hero lecture" />
                  )}
                  <button className="cw-media-play-center">
                    <Play size={28} fill="white" className="ml-1" />
                  </button>
                  <span className="cw-media-duration-badge">
                    <Clock size={12} /> {activeVideo.duration || "15:00"}
                  </span>
                </div>
              </div>
            </div>

            {/* Side Card: Lecture Progress */}
            <div className="cw-hero-side-card">
              <div className="cw-side-top">
                <div className="cw-side-header">
                  <span>Lecture Progress</span>
                  <span className="cw-side-pct">{activeVideo.progress || 0}%</span>
                </div>

                <div className="cw-side-track">
                  <div className="cw-side-fill" style={{ width: `${activeVideo.progress || 0}%` }}></div>
                </div>

                <div className="cw-side-time-row">
                  <span>You last watched</span>
                  <span className="cw-time-numbers">
                    {activeVideo.watched_seconds ? `${Math.floor(activeVideo.watched_seconds / 60)}:${String(activeVideo.watched_seconds % 60).padStart(2, '0')}` : "0:00"} / {activeVideo.duration || "15:00"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Recently Watched Cards */}
          {continueList.length > 0 && (
            <section className="cw-section-recent">
              <div className="cw-sec-header">
                <div className="cw-sec-title">
                  <Clock size={18} className="text-blue-500" />
                  <h2>In Progress Lectures</h2>
                </div>
              </div>

              <div className="cw-cards-grid">
                {continueList.map((item, idx) => (
                  <div key={item.id || idx} className="cw-rec-card" onClick={() => setActiveVideo(item)}>
                    <div className="cw-rec-thumb-wrap">
                      <img src={item.thumbnail_url || "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=500&auto=format&fit=crop"} alt={item.title} />
                      <div className="cw-rec-cat-badge">{item.category || "General"}</div>
                      <button className="cw-rec-play-btn">
                        <Play size={18} fill="white" className="ml-0.5" />
                      </button>
                      <div className="cw-rec-duration-tag">{item.duration || "15:00"}</div>
                    </div>

                    <div className="cw-rec-details">
                      <h3>{item.title}</h3>
                      <div className="cw-rec-progress-bar">
                        <div className="cw-rec-fill" style={{ width: `${item.progress || 0}%` }}></div>
                      </div>
                      <div className="cw-rec-pct-text">{item.progress || 0}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 3: Bottom 2 Columns - Watch History Table & Watch Statistics */}
          <div className="cw-bottom-grid">
            {/* Left: Watch History Table */}
            <div className="cw-card-box cw-history-box">
              <div className="cw-box-header">
                <div className="cw-box-title">
                  <RotateCcw size={16} className="text-blue-500" />
                  <h3>Watch History</h3>
                </div>
              </div>

              <div className="cw-table-responsive">
                <table className="cw-table">
                  <thead>
                    <tr>
                      <th>Video Title</th>
                      <th>Category</th>
                      <th>Watched On</th>
                      <th>Duration</th>
                      <th>Progress</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentHistory.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td>
                          <div className="cw-tbl-title-cell">
                            <span className="cw-tbl-title-text">{item.title}</span>
                          </div>
                        </td>
                        <td>
                          <span className="cw-tbl-cat-chip">
                            {item.category || item.subtitle || "Lecture"}
                          </span>
                        </td>
                        <td className="cw-tbl-subtext">{item.date || "Recent"}</td>
                        <td className="cw-tbl-subtext">{item.duration || "15:00"}</td>
                        <td>
                          <div className="cw-tbl-prog-cell">
                            <div className="cw-tbl-track">
                              <div className="cw-tbl-fill" style={{ width: `${item.progress || 0}%` }}></div>
                            </div>
                            <span className="cw-tbl-pct">{item.progress || 0}%</span>
                          </div>
                        </td>
                        <td>
                          <button className="cw-tbl-continue-btn" onClick={() => handleOpenPlayer(item)}>
                            <Play size={11} fill="white" /> Play
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Watch Statistics Grid */}
            <div className="cw-card-box cw-stats-box">
              <div className="cw-box-header">
                <div className="cw-box-title">
                  <BarChart2 size={16} className="text-blue-500" />
                  <h3>Watch Statistics</h3>
                </div>
              </div>

              <div className="cw-stats-2x2">
                <div className="cw-stat-card">
                  <div className="cw-stat-icon-blue">
                    <Play size={18} fill="#3b82f6" color="#3b82f6" />
                  </div>
                  <div className="cw-stat-content">
                    <span className="cw-stat-label">Total Videos</span>
                    <span className="cw-stat-value">{watchStats.totalVideos ?? 0}</span>
                    <span className="cw-stat-sub">Assigned lectures</span>
                  </div>
                </div>

                <div className="cw-stat-card">
                  <div className="cw-stat-icon-green">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="cw-stat-content">
                    <span className="cw-stat-label">Completed</span>
                    <span className="cw-stat-value">{watchStats.completed ?? 0}</span>
                    <span className="cw-stat-sub">Finished videos</span>
                  </div>
                </div>

                <div className="cw-stat-card">
                  <div className="cw-stat-icon-orange">
                    <Clock size={18} />
                  </div>
                  <div className="cw-stat-content">
                    <span className="cw-stat-label">Pending</span>
                    <span className="cw-stat-value">{watchStats.pending ?? 0}</span>
                    <span className="cw-stat-sub">To be watched</span>
                  </div>
                </div>

                <div className="cw-stat-card">
                  <div className="cw-stat-icon-purple">
                    <Clock size={18} />
                  </div>
                  <div className="cw-stat-content">
                    <span className="cw-stat-label">Watch Hours</span>
                    <span className="cw-stat-value">{watchStats.watchHours ?? 0}h</span>
                    <span className="cw-stat-sub">Total time invested</span>
                  </div>
                </div>
              </div>

              <Link href="/Student/MyProgress" className="cw-analytics-btn">
                <span>View Detailed Analytics</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Video Stream Modal */}
      {isPlayingModalOpen && activeVideo && (
        <div className="cw-modal-overlay" onClick={handleCloseModal}>
          <div className="cw-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cw-modal-header">
              <div>
                <span className="cw-modal-cat-tag">{activeVideo.category || "Mathematics"}</span>
                <h2>{activeVideo.title}</h2>
                <p>{activeVideo.duration} • Faculty Lecture</p>
              </div>
              <button className="cw-modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <div className="cw-modal-video-wrap">
              {activeVideo.video_url ? (
                <video
                  controls
                  autoPlay
                  controlsList="nodownload"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  src={`${API_BASE}/api/student/videos/${activeVideo.id}/stream/`}
                  onTimeUpdate={(e) => handleTimeUpdate(e, activeVideo.id)}
                  onEnded={(e) => handleVideoEnded(activeVideo.id, e.currentTarget.duration)}
                />
              ) : (
                <div className="cw-modal-no-video">
                  <Video size={40} opacity={0.4} />
                  <p>No video file stream available.</p>
                </div>
              )}
            </div>

            <div className="cw-modal-footer">
              <h4><FileText size={14} /> Lecture Summary</h4>
              <p>{activeVideo.description || "No lecture summary provided."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
