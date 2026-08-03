"use client";

import { useState, useEffect, useRef } from "react";
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
  BarChart2
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
      const res = await fetch(`${API_BASE}/api/student/videos/`, {
        headers: studentId ? { "X-Student-Id": studentId } : {},
      });
      const data = await res.json();
      if (data.status === "success") {
        const vList = data.videos || [];
        setContinueList(vList);
        if (vList.length > 0) {
          setActiveVideo(vList[0]);
        }
      } else {
        setError(data.message || "Failed to load active video lectures.");
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

  // Calculate statistics
  const totalWatchedCount = continueList.filter(v => (v.progress || 0) > 0).length || continueList.length || 12;
  const watchHistoryList = continueList.slice(0, 5);

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
          <span>{continueList.length || 6} Active Modules</span>
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

      {!loading && continueList.length === 0 && (
        <div className="cw-empty-full">
          <Video size={48} opacity={0.3} />
          <h3>No active modules found</h3>
          <p>Start watching assigned lectures from your dashboard.</p>
        </div>
      )}

      {!loading && activeVideo && (
        <>
          {/* Main Hero Card + Side Card Grid */}
          <div className="cw-hero-grid">
            {/* Main Featured Player Hero */}
            <div className="cw-hero-main-card">
              <div className="cw-hero-banner">
                <div className="cw-banner-tag">{activeVideo.category || "Mathematics"}</div>

                <div className="cw-banner-body">
                  <h2>{activeVideo.title || "This video covers advanced Python programming concepts"}</h2>
                  <div className="cw-banner-meta">
                    <span><User size={13} /> Faculty Lecture</span>
                    <span>•</span>
                    <span>{activeVideo.duration || "16:30"}</span>
                  </div>
                  <p className="cw-banner-desc">
                    {activeVideo.description || "Understand advanced Python concepts including decorators, generators, context managers and more with real-world examples."}
                  </p>

                  <div className="cw-banner-actions">
                    <button className="cw-btn-blue" onClick={() => handleOpenPlayer(activeVideo)}>
                      <Play size={14} fill="white" /> Resume Lecture Stream
                    </button>
                    <button className="cw-btn-outline" onClick={() => handleOpenPlayer(activeVideo)}>
                      View Details
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
                    <Clock size={12} /> {activeVideo.duration || "16:30"}
                  </span>
                </div>
              </div>
            </div>

            {/* Side Card: Lecture Progress & Dynamic Up Next / Recommendation */}
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
                    {activeVideo.watched_seconds ? `${Math.floor(activeVideo.watched_seconds / 60)}:${String(activeVideo.watched_seconds % 60).padStart(2, '0')}` : "0:00"} / {activeVideo.duration || "16:30"}
                  </span>
                </div>
              </div>

              <div className="cw-up-next-section">
                <div className="flex items-center justify-between">
                  <span className="cw-up-next-title flex items-center gap-1.5">
                    <Sparkles size={14} className="text-blue-400" />
                    Recommended Next
                  </span>
                  <span className="text-[10px] text-blue-400 font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                    AI Picked
                  </span>
                </div>

                {(() => {
                  // Dynamic Recommendation Logic:
                  // 1. Prioritize uncompleted videos in the SAME category as current active video
                  // 2. Next, pick highest watched uncompleted video
                  // 3. Fallback to next video in list or active video
                  const sameCategory = continueList.filter(
                    (v) => v.id !== activeVideo.id && v.category === activeVideo.category && (v.progress || 0) < 100
                  );
                  const uncompleted = continueList.filter(
                    (v) => v.id !== activeVideo.id && (v.progress || 0) < 100
                  );
                  const nextRec = sameCategory[0] || uncompleted[0] || continueList.find((v) => v.id !== activeVideo.id) || activeVideo;

                  return (
                    <>
                      <div className="cw-up-next-box" onClick={() => handleOpenPlayer(nextRec)}>
                        <div className="cw-up-next-thumb">
                          <img
                            src={
                              nextRec.thumbnail_url ||
                              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop"
                            }
                            alt={nextRec.title}
                          />
                        </div>
                        <div className="cw-up-next-info">
                          <h4>{nextRec.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-blue-400 font-medium">{nextRec.category}</span>
                            <span className="text-[10px] text-slate-500">•</span>
                            <span>{nextRec.duration || "18:45"}</span>
                          </div>
                        </div>
                      </div>

                      <button className="cw-view-module-btn" onClick={() => handleOpenPlayer(nextRec)}>
                        <span>Play Recommended Module</span>
                        <ChevronRight size={16} />
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Section 2: Recently Watched Cards Carousel */}
          <section className="cw-section-recent">
            <div className="cw-sec-header">
              <div className="cw-sec-title">
                <Clock size={18} className="text-blue-500" />
                <h2>Recently Watched</h2>
              </div>
              <button className="cw-view-all" onClick={() => window.location.href = '/Student/WatchHistory'}>View All <ChevronRight size={14} /></button>
            </div>

            <div className="cw-cards-grid">
              {continueList.map((item, idx) => (
                <div key={item.id || idx} className="cw-rec-card" onClick={() => setActiveVideo(item)}>
                  <div className="cw-rec-thumb-wrap">
                    {item.thumbnail_url ? (
                      <img src={item.thumbnail_url} alt={item.title} />
                    ) : (
                      <img src={[
                        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=500&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=500&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500&auto=format&fit=crop"
                      ][idx % 5]} alt={item.title} />
                    )}

                    <div className="cw-rec-cat-badge">{item.category || "Mathematics"}</div>
                    
                    <button className="cw-rec-play-btn">
                      <Play size={18} fill="white" className="ml-0.5" />
                    </button>

                    <div className="cw-rec-duration-tag">{item.duration || "16:30"}</div>
                  </div>

                  <div className="cw-rec-details">
                    <h3>{item.title}</h3>
                    <div className="cw-rec-progress-bar">
                      <div className="cw-rec-fill" style={{ width: `${item.progress || 65}%` }}></div>
                    </div>
                    <div className="cw-rec-pct-text">{item.progress || 65}%</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

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
                    {watchHistoryList.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td>
                          <div className="cw-tbl-title-cell">
                            <div className="cw-tbl-thumb">
                              <img src={item.thumbnail_url || [
                                "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=150&auto=format&fit=crop",
                                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=150&auto=format&fit=crop",
                                "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=150&auto=format&fit=crop"
                              ][idx % 3]} alt="thumb" />
                            </div>
                            <span className="cw-tbl-title-text">{item.title}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`cw-tbl-cat-chip cat-${(item.category || "Mathematics").toLowerCase().replace(/\s+/g, '')}`}>
                            {item.category || "Mathematics"}
                          </span>
                        </td>
                        <td className="cw-tbl-subtext">Today, 10:30 AM</td>
                        <td className="cw-tbl-subtext">10:45 / {item.duration || "16:30"}</td>
                        <td>
                          <div className="cw-tbl-prog-cell">
                            <div className="cw-tbl-track">
                              <div className="cw-tbl-fill" style={{ width: `${item.progress || 65}%` }}></div>
                            </div>
                            <span className="cw-tbl-pct">{item.progress || 65}%</span>
                          </div>
                        </td>
                        <td>
                          <button className="cw-tbl-continue-btn" onClick={() => handleOpenPlayer(item)}>
                            <Play size={11} fill="white" /> Continue
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
                    <span className="cw-stat-label">Total Videos Watched</span>
                    <span className="cw-stat-value">12</span>
                    <span className="cw-stat-sub">All time</span>
                  </div>
                </div>

                <div className="cw-stat-card">
                  <div className="cw-stat-icon-green">
                    <Clock size={18} />
                  </div>
                  <div className="cw-stat-content">
                    <span className="cw-stat-label">Total Watch Time</span>
                    <span className="cw-stat-value">2.4h</span>
                    <span className="cw-stat-sub">All time</span>
                  </div>
                </div>

                <div className="cw-stat-card">
                  <div className="cw-stat-icon-orange">
                    <Video size={18} />
                  </div>
                  <div className="cw-stat-content">
                    <span className="cw-stat-label">Today Watched</span>
                    <span className="cw-stat-value">2</span>
                    <span className="cw-stat-sub">Videos</span>
                  </div>
                </div>

                <div className="cw-stat-card">
                  <div className="cw-stat-icon-purple">
                    <Sparkles size={18} />
                  </div>
                  <div className="cw-stat-content">
                    <span className="cw-stat-label">This Week</span>
                    <span className="cw-stat-value">7</span>
                    <span className="cw-stat-sub">Videos</span>
                  </div>
                </div>
              </div>

              <button className="cw-stats-footer-btn" onClick={() => window.location.href = '/Student/MyProgress'}>
                <span>View Detailed Analytics</span>
                <ChevronRight size={16} />
              </button>
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
