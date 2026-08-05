"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Play, Trash2, Search, Calendar, CheckCircle2, Loader2, AlertCircle, Video, X, FileText } from "lucide-react";
import "./watchhistory.css";

const API_BASE = "http://127.0.0.1:8000";

function getStudentId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("student") || sessionStorage.getItem("student");
    if (saved) return String(JSON.parse(saved).id);
  } catch {}
  return null;
}

export default function WatchHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      setLoading(true);
      setError("");
      const studentId = getStudentId();
      if (!studentId) {
        setError("You must be logged in to view watch history.");
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_BASE}/api/student/watch-history/`, {
        headers: { "X-Student-Id": studentId },
      });
      const data = await res.json();
      if (data.status === "success") {
        setHistory(data.history || []);
      } else {
        setError(data.message || "Failed to load history.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRewatch(item: any) {
    setActiveVideo(item);
    // Record the rewatch in backend
    try {
      const studentId = getStudentId();
      await fetch(`${API_BASE}/api/student/videos/${item.video_id}/watch/`, {
        method: "POST",
        headers: studentId ? { "X-Student-Id": studentId } : {},
      });
    } catch (err) {
      console.error("Failed to record rewatch:", err);
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

  function handleCloseVideoModal() {
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setActiveVideo(null);
  }

  const handleDeleteItem = async (id: number) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    try {
      const studentId = getStudentId();
      await fetch(`${API_BASE}/api/student/watch-history/${id}/delete/`, {
        method: "DELETE",
        headers: studentId ? { "X-Student-Id": studentId } : {},
      });
    } catch (err) {
      console.error("Failed to delete history item:", err);
    }
  };

  const handleClearAll = async () => {
    setHistory([]);
    try {
      const studentId = getStudentId();
      await fetch(`${API_BASE}/api/student/watch-history/clear/`, {
        method: "DELETE",
        headers: studentId ? { "X-Student-Id": studentId } : {},
      });
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  const filteredHistory = history.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="watch-history-container">
      {/* Header */}
      <div className="wh-header">
        <div className="wh-title-box">
          <h1>
            <Clock className="text-blue-600" size={32} />
            Watch History
          </h1>
          <p>View and manage all video lectures you have watched recently.</p>
        </div>

        {history.length > 0 && (
          <button className="clear-history-btn" onClick={handleClearAll}>
            <Trash2 size={16} />
            Clear All History
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium mb-4">
          <AlertCircle size={18} className="flex-shrink-0" />
          {error}
          <button
            onClick={fetchHistory}
            className="ml-auto text-xs font-bold bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search Controls */}
      <div className="wh-controls-card">
        <div className="wh-search-box">
          <Search size={18} className="wh-search-icon" />
          <input
            type="text"
            placeholder="Search history by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="wh-search-input"
          />
        </div>

        <div className="wh-stats-badge">
          Showing {filteredHistory.length} of {history.length} items
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="text-sm font-medium">Loading your watch history...</span>
          </div>
        </div>
      )}

      {/* History Items List */}
      {!loading && (
        <div className="history-list">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, idx) => (
              <div key={item.id ?? `wh-${idx}`} className="history-card">
                <div className="history-left">
                  <div className="history-thumb-icon">
                    <Play size={22} fill="#2563eb" />
                  </div>

                  <div className="history-info">
                    <h3>{item.title}</h3>
                    <div className="history-meta">
                      <span className="history-meta-item">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
                          {item.category}
                        </span>
                      </span>
                      <span className="history-meta-item">
                        <Calendar size={14} /> {item.watched_at}
                      </span>
                      <span className="history-meta-item">
                        <Clock size={14} /> {item.duration}
                      </span>
                      {item.completed && (
                        <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                          <CheckCircle2 size={14} /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="history-right">
                  <button
                    className="rewatch-btn"
                    onClick={() => handleRewatch(item)}
                  >
                    <Play size={14} /> Rewatch
                  </button>
                  <button
                    className="delete-item-btn"
                    onClick={() => handleDeleteItem(item.id)}
                    title="Remove from view"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="wh-empty-box">
              <Video size={48} className="wh-empty-icon" />
              <p className="wh-empty-title">No watch history records found.</p>
              <p className="wh-empty-sub">Start watching videos to track your progress!</p>
            </div>
          )}
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideo && (
        <div
          className="video-modal-backdrop"
          onClick={handleCloseVideoModal}
        >
          <div
            className="video-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="video-modal-header">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {activeVideo.category}
                </span>
                <h2 className="text-lg font-bold text-slate-800 mt-1">{activeVideo.title}</h2>
                <p className="text-xs text-slate-500">
                  {activeVideo.duration} • Last watched: {activeVideo.watched_at}
                </p>
              </div>
              <button
                className="modal-close-btn"
                onClick={handleCloseVideoModal}
              >
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
                  src={`${API_BASE}/api/student/videos/${activeVideo.video_id}/stream/`}
                  onTimeUpdate={(e) => handleTimeUpdate(e, activeVideo.video_id)}
                  onEnded={(e) => handleVideoEnded(activeVideo.video_id, e.currentTarget.duration)}
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
                <FileText size={14} /> Lecture Details
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Category: <strong>{activeVideo.category}</strong> &nbsp;|&nbsp;
                Duration: <strong>{activeVideo.duration}</strong> &nbsp;|&nbsp;
                Watched: <strong>{activeVideo.watched_at}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
