"use client";

import { useState, useEffect, useRef } from "react";
import {
  PlayCircle,
  Play,
  Clock,
  CheckCircle2,
  Sparkles,
  User,
  X,
  FileText,
  Bookmark,
  Loader2,
  AlertCircle,
  Video
} from "lucide-react";
import "./continuewatching.css";

const API_BASE = "http://127.0.0.1:8000";

const GRADIENTS = [
  "from-slate-900 via-blue-950 to-slate-900",
  "from-slate-900 via-indigo-950 to-slate-900",
  "from-slate-900 via-slate-800 to-slate-900",
  "from-slate-900 via-purple-950 to-slate-900",
  "from-slate-900 via-emerald-950 to-slate-900",
  "from-slate-900 via-rose-950 to-slate-900",
];

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
    fetchContinueWatching();
  }, []);

  async function fetchContinueWatching() {
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
    // Throttle: save progress at most once every 5 seconds
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

  return (
    <div className="continue-watching-container">
      {/* Header */}
      <div className="cw-header">
        <div>
          <h1>
            <PlayCircle className="text-blue-600" size={32} />
            Continue Watching
          </h1>
          <p>Pick up right where you left off in your active course modules.</p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
          <Sparkles size={14} /> {continueList.length} Active Modules
        </span>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium mb-4">
          <AlertCircle size={18} className="flex-shrink-0" />
          {error}
          <button
            onClick={fetchContinueWatching}
            className="ml-auto text-xs font-bold bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="text-sm font-medium">Loading active lectures...</span>
          </div>
        </div>
      )}

      {!loading && continueList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200 p-8">
          <Video size={48} className="mb-3 opacity-30" />
          <h3 className="text-base font-bold text-slate-700">No active course lectures available</h3>
          <p className="text-xs text-slate-500 mt-1">Check back once your department faculty uploads video lectures.</p>
        </div>
      )}

      {!loading && activeVideo && (
        <>
          {/* Corporate Featured Media Hero Player Card */}
          <div className="hero-player-card">
            <div
              className={`player-preview-wrapper bg-gradient-to-br ${GRADIENTS[0]}`}
              onClick={() => handleOpenPlayer(activeVideo)}
            >
              <span className="hero-badge">{activeVideo.category}</span>

              <button className="big-play-btn" title="Stream Video">
                <Play size={28} fill="white" className="ml-1" />
              </button>

              <div className="hero-bottom-info">
                <span className="hero-time-badge flex items-center gap-1">
                  <Clock size={12} /> {activeVideo.duration}
                </span>
              </div>
            </div>

            <div className="video-info-bar">
              <div className="video-info-left">
                <h2>{activeVideo.title}</h2>
                <p className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1"><User size={14} className="text-slate-400" /> Faculty Lecture</span>
                  <span>•</span>
                  <span className="text-blue-600 font-semibold">{activeVideo.duration}</span>
                </p>
              </div>

              <div className="hero-progress-box">
                <div className="progress-labels">
                  <span>Lecture Progress</span>
                  <span className="text-blue-600 font-bold">{activeVideo.progress ?? 0}%</span>
                </div>
                <div className="progress-track-bg">
                  <div
                    className="progress-track-fill"
                    style={{ width: `${activeVideo.progress ?? 0}%` }}
                  ></div>
                </div>

                <button
                  className="cw-resume-btn mt-3"
                  onClick={() => handleOpenPlayer(activeVideo)}
                >
                  <Play size={16} fill="white" /> Resume Lecture Stream
                </button>
              </div>
            </div>
          </div>

          {/* Grid of In-Progress Lectures */}
          <h2 className="section-title flex items-center gap-2">
            <Bookmark size={20} className="text-blue-600" />
            All In-Progress Courses
          </h2>

          <div className="cw-grid">
            {continueList.map((item, idx) => (
              <div key={item.id || idx} className="cw-card group">
                {/* Thumbnail */}
                <div
                  className={`cw-thumb bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]}`}
                  onClick={() => handleOpenPlayer(item)}
                >
                  <span className="cw-subject-chip">{item.category}</span>
                  <div className="thumb-play-icon">
                    <Play size={20} fill="white" className="ml-0.5" />
                  </div>
                  <span className="cw-time-left flex items-center gap-1">
                    <Clock size={12} /> {item.duration}
                  </span>
                </div>

                {/* Card Content */}
                <div className="cw-body">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.views} views • {item.uploaded_at}</p>
                  </div>

                  <div>
                    <div style={{ marginBottom: "1rem" }}>
                      <div className="progress-labels">
                        <span>Progress</span>
                        <span className="text-blue-600 font-bold">{item.progress ?? 0}%</span>
                      </div>
                      <div className="progress-track-bg">
                        <div
                          className="progress-track-fill"
                          style={{ width: `${item.progress ?? 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      className="cw-resume-btn"
                      onClick={() => handleOpenPlayer(item)}
                    >
                      <Play size={16} fill="white" /> Resume Video
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Protected Video Player Popup Modal */}
      {isPlayingModalOpen && activeVideo && (
        <div className="video-modal-backdrop" onClick={handleCloseModal}>
          <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {activeVideo.category}
                </span>
                <h2 className="text-lg font-bold text-slate-800 mt-1">{activeVideo.title}</h2>
                <p className="text-xs text-slate-500">{activeVideo.duration} • {activeVideo.uploaded_at}</p>
              </div>

              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <div className="video-player-wrapper">
              {activeVideo.video_url ? (
                <video
                  controls
                  autoPlay
                  controlsList="nodownload"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-full object-cover"
                  src={`${API_BASE}/api/student/videos/${activeVideo.id}/stream/`}
                  onTimeUpdate={(e) => handleTimeUpdate(e, activeVideo.id)}
                  onEnded={(e) => handleVideoEnded(activeVideo.id, e.currentTarget.duration)}
                >
                  Your browser does not support HTML5 video playback.
                </video>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
                  <div className="text-center">
                    <Video size={40} className="mx-auto mb-3 opacity-40" />
                    <p>No video file available for this lecture.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <FileText size={14} /> Lecture Summary
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeVideo.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
