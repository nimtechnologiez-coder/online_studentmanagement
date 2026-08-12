"use client";

import { useState, useEffect, useRef } from "react";
import { studentFetch } from "../studentFetch";
import {
  Video,
  Play,
  Search,
  Clock,
  CheckCircle2,
  Filter,
  BookOpen,
  X,
  FileText,
  User,
  Sparkles,
  ListVideo,
  Loader2,
  AlertCircle,
  Eye,
  Heart,
  Bookmark,
} from "lucide-react";
import "./myvideos.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://online-management-backend.onrender.com";

const GRADIENTS = [
  "from-slate-900 via-blue-950 to-slate-900",
  "from-slate-900 via-indigo-950 to-slate-900",
  "from-slate-900 via-slate-800 to-slate-900",
  "from-slate-900 via-emerald-950 to-slate-900",
  "from-slate-900 via-purple-950 to-slate-900",
  "from-slate-900 via-rose-950 to-slate-900",
  "from-slate-900 via-cyan-950 to-slate-900",
];

function getStudentId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("student") || sessionStorage.getItem("student");
    if (saved) return String(JSON.parse(saved).id);
  } catch { }
  return null;
}

export default function MyVideosPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeModalVideo, setActiveModalVideo] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [favoritesMap, setFavoritesMap] = useState<Record<number, boolean>>({});
  const [watchLaterMap, setWatchLaterMap] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchVideos();
    loadMaps();
  }, []);

  function loadMaps() {
    try {
      const savedFavs = localStorage.getItem("student_favorites");
      if (savedFavs) {
        const list = JSON.parse(savedFavs).filter((item: any) => !([101, 102, 103, 104, 105].includes(item.id)));
        const map: Record<number, boolean> = {};
        list.forEach((item: any) => {
          if (item.id) map[item.id] = true;
        });
        setFavoritesMap(map);
      }

      const savedWL = localStorage.getItem("student_watch_later");
      if (savedWL) {
        const list = JSON.parse(savedWL);
        const map: Record<number, boolean> = {};
        list.forEach((item: any) => {
          if (item.id) map[item.id] = true;
        });
        setWatchLaterMap(map);
      }
    } catch (e) { }
  }

  function toggleFavorite(video: any, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const saved = localStorage.getItem("student_favorites");
      let list: any[] = saved ? JSON.parse(saved) : [];
      const isFav = favoritesMap[video.id];

      if (isFav) {
        list = list.filter((item: any) => item.id !== video.id);
      } else {
        const newItem = {
          id: video.id,
          title: video.title,
          category: video.category || "General",
          duration: video.duration || "15:00",
          rating: "4.8",
          views: `${video.views || 0} views`,
          date: video.uploaded_at || "Recently",
          thumbnail: video.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500&auto=format&fit=crop",
          video_url: video.video_url || "",
        };
        list.push(newItem);
      }

      localStorage.setItem("student_favorites", JSON.stringify(list));
      setFavoritesMap((prev) => ({ ...prev, [video.id]: !isFav }));
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  }

  function toggleWatchLater(video: any, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const saved = localStorage.getItem("student_watch_later");
      let list: any[] = saved ? JSON.parse(saved) : [];
      const isWL = watchLaterMap[video.id];

      if (isWL) {
        list = list.filter((item: any) => item.id !== video.id);
      } else {
        const newItem = {
          id: video.id,
          title: video.title,
          category: video.category || "General",
          duration: video.duration || "15:00",
          rating: "4.8",
          views: `${video.views || 0} views`,
          date: video.uploaded_at || "Recently",
          thumbnail: video.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500&auto=format&fit=crop",
          video_url: video.video_url || "",
        };
        list.push(newItem);
      }

      localStorage.setItem("student_watch_later", JSON.stringify(list));
      setWatchLaterMap((prev) => ({ ...prev, [video.id]: !isWL }));
    } catch (err) {
      console.error("Failed to toggle Watch Later:", err);
    }
  }

  async function fetchVideos(searchQ = "", cat = "") {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (searchQ) params.set("search", searchQ);
      if (cat && cat !== "All") params.set("category", cat);

      const res = await studentFetch(`/api/student/videos/?${params}`);
      const data = await res.json();
      if (data.status === "success") {
        setVideos(data.videos || []);
        const fetchedCats = Array.from(new Set(["All", ...(data.categories || [])]));
        setCategories(fetchedCats);
      } else {
        setError(data.message || "Failed to load videos.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePlayVideo(video: any) {
    setActiveModalVideo(video);
    try {
      const res = await studentFetch(`/api/student/videos/${video.id}/watch/`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === video.id ? { ...v, views: data.views, watched: true } : v
          )
        );
      }
    } catch (err) {
      console.error("Failed to record watch:", err);
    }
  }

  const videoRef = useRef<HTMLVideoElement | null>(null);

  function parseDurationToSeconds(durStr: any): number {
    if (!durStr) return 0;
    const s = String(durStr).trim();
    const parts = s.split(":");
    if (parts.length === 2) {
      const m = parseInt(parts[0], 10);
      const sec = parseInt(parts[1], 10);
      if (!isNaN(m) && !isNaN(sec)) return m * 60 + sec;
    } else if (parts.length === 3) {
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const sec = parseInt(parts[2], 10);
      if (!isNaN(h) && !isNaN(m) && !isNaN(sec)) return h * 3600 + m * 60 + sec;
    }
    const digits = s.match(/(\d+)/);
    return digits ? parseInt(digits[1], 10) * 60 : 0;
  }

  async function saveProgress(videoId: number, currentTime: number) {
    try {
      const watchedSecs = Math.floor(currentTime);
      if (watchedSecs < 0) return;
      const res = await studentFetch(`/api/student/videos/${videoId}/progress/`, {
        method: "POST",
        body: JSON.stringify({ watched_seconds: watchedSecs }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setVideos((prev) =>
          prev.map((v) => {
            if (v.id !== videoId) return v;
            const durSecs = parseDurationToSeconds(v.duration);
            const calcPct = durSecs > 0 ? Number(((watchedSecs / durSecs) * 100).toFixed(1)) : (data.progress ?? v.progress ?? 0);
            const isCompleted = data.completed ?? (calcPct >= 95.0);
            return {
              ...v,
              watched_seconds: data.watched_seconds ?? watchedSecs,
              progress: calcPct,
              watched: isCompleted,
              status: isCompleted ? "Watched" : (watchedSecs > 0 ? "In Progress" : "Not Started"),
            };
          })
        );
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("student_progress_updated"));
        }
      }
    } catch (err) {
      console.error("Failed to save progress:", err);
    }
  }

  function handleTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>, videoId: number) {
    const video = e.currentTarget;
    if (!progressTimerRef.current) {
      progressTimerRef.current = setTimeout(() => {
        progressTimerRef.current = null;
        if (video && !video.paused) {
          saveProgress(videoId, video.currentTime);
        }
      }, 2500);
    }
  }

  function handleVideoLoadedMetadata(e: React.SyntheticEvent<HTMLVideoElement>, savedSeconds: number) {
    const video = e.currentTarget;
    if (savedSeconds > 0 && video.duration && savedSeconds < video.duration * 0.95) {
      video.currentTime = savedSeconds; // Resume playback from saved position!
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
    if (activeModalVideo && videoRef.current) {
      saveProgress(activeModalVideo.id, videoRef.current.currentTime);
    }
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setActiveModalVideo(null);
  }

  function handleSearch(val: string) {
    setSearch(val);
    fetchVideos(val, selectedCategory);
  }

  function handleCategory(cat: string) {
    setSelectedCategory(cat);
    fetchVideos(search, cat);
  }

  return (
    <div className="my-videos-container">
      {/* Header */}
      <div className="my-videos-header">
        <div className="header-title-area">
          <h1>
            <ListVideo className="text-blue-600" size={32} />
            My Course Video Library
          </h1>
          <p>Stream interactive course lectures and monitor your individual module progress.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
            <Sparkles size={14} /> {videos.length} Available Lectures
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium mb-4">
          <AlertCircle size={18} className="flex-shrink-0" />
          {error}
          <button
            onClick={() => fetchVideos(search, selectedCategory)}
            className="ml-auto text-xs font-bold bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Control Bar: Search & Subject Filters */}
      <div className="controls-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by lecture title or category..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-tags">
          {categories.map((cat, idx) => (
            <button
              key={`${cat}-${idx}`}
              onClick={() => handleCategory(cat)}
              className={`tag-btn ${selectedCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton - Principal Dashboard Style */}
      {loading && (
        <div className="dash-skeleton-wrapper my-6">
          <div className="dash-skeleton-banner skeleton-shimmer" />
          <div className="dash-skeleton-kpi-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="dash-skeleton-kpi-card skeleton-shimmer" />
            ))}
          </div>
          <div className="dash-skeleton-charts-row">
            <div className="dash-skeleton-chart-large skeleton-shimmer" />
            <div className="dash-skeleton-chart-small skeleton-shimmer" />
          </div>
        </div>
      )}

      {/* Video Cards Grid */}
      {!loading && (
        <div className="videos-grid">
          {videos.length > 0 ? (
            videos.map((video, idx) => (
              <div key={video.id ?? `vid-${idx}`} className="video-card group">
                {/* Card Thumbnail */}
                <div
                  className={`thumbnail-wrapper bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]}`}
                  onClick={() => handlePlayVideo(video)}
                >
                  {(video.thumbnail_url || video.thumbnail) ? (
                    <img src={video.thumbnail_url || video.thumbnail} alt={video.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300" />
                  ) : null}
                  <span className="subject-badge relative z-10">{video.category}</span>

                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
                    <button
                      className="w-8 h-8 rounded-full bg-slate-950/70 border border-slate-700/50 flex items-center justify-center text-amber-500 hover:scale-110 transition-transform"
                      title={watchLaterMap[video.id] ? "Remove from Watch Later" : "Add to Watch Later"}
                      onClick={(e) => toggleWatchLater(video, e)}
                    >
                      <Bookmark size={15} fill={watchLaterMap[video.id] ? "#f59e0b" : "none"} color="#f59e0b" />
                    </button>

                    <button
                      className="w-8 h-8 rounded-full bg-slate-950/70 border border-slate-700/50 flex items-center justify-center text-pink-500 hover:scale-110 transition-transform"
                      title={favoritesMap[video.id] ? "Remove from Favorites" : "Add to Favorites"}
                      onClick={(e) => toggleFavorite(video, e)}
                    >
                      <Heart size={15} fill={favoritesMap[video.id] ? "#ec4899" : "none"} color="#ec4899" />
                    </button>
                  </div>

                  <div className="play-overlay relative z-10">
                    <Play size={22} fill="white" className="ml-0.5" />
                  </div>
                  <span className="duration-badge relative z-10 flex items-center gap-1">
                    <Clock size={12} /> {video.duration}
                  </span>
                </div>

                {/* Card Body */}
                <div className="video-content">
                  <div>
                    <h3 className="video-title">{video.title}</h3>
                    <p className="instructor-name flex items-center gap-1 mt-1">
                      <Eye size={13} className="text-slate-400" />
                      {video.views} views • {video.uploaded_at}
                    </p>
                  </div>

                  <div>
                    <div className="progress-area">
                      <div className="progress-header">
                        <span>Status</span>
                        <span>
                          {video.watched ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 size={13} /> Watched (100%)
                            </span>
                          ) : video.progress && video.progress > 0 ? (
                            <span className="text-blue-600 font-bold flex items-center gap-1">
                              <Clock size={13} /> In Progress ({video.progress}%)
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">Not watched</span>
                          )}
                        </span>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.min(100, Math.max(0, video.watched ? 100 : (video.progress || 0)))}%`,
                            backgroundColor: video.watched ? "#10b981" : "#2563eb",
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Watch Video Button */}
                    <button
                      className="watch-btn"
                      onClick={() => handlePlayVideo(video)}
                    >
                      <Play size={16} fill="white" />
                      {video.watched ? "Rewatch Lecture" : (video.progress && video.progress > 0 ? "Resume Watching" : "Start Watching")}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-videos-box">
              <BookOpen size={40} className="mx-auto mb-3 text-slate-300" />
              No video lectures match your search filter criteria.
            </div>
          )}
        </div>
      )}

      {/* In-Page Video Player Modal */}
      {activeModalVideo && (
        <div className="video-modal-backdrop" onClick={handleCloseModal}>
          <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {activeModalVideo.category}
                </span>
                <h2 className="text-lg font-bold text-slate-800 mt-1">{activeModalVideo.title}</h2>
                <p className="text-xs text-slate-500">{activeModalVideo.duration} • {activeModalVideo.uploaded_at}</p>
              </div>

              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            {/* HTML5 Video Player */}
            <div className="video-player-wrapper">
              <video
                ref={videoRef}
                controls
                autoPlay
                controlsList="nodownload"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover"
                src={
                  activeModalVideo.video_url && activeModalVideo.video_url.startsWith("http") && !activeModalVideo.video_url.includes("127.0.0.1")
                    ? activeModalVideo.video_url
                    : `${API_BASE}/api/student/videos/${activeModalVideo.id}/stream/`
                }
                onLoadedMetadata={(e) => handleVideoLoadedMetadata(e, activeModalVideo.watched_seconds || 0)}
                onTimeUpdate={(e) => handleTimeUpdate(e, activeModalVideo.id)}
                onEnded={(e) => handleVideoEnded(activeModalVideo.id, e.currentTarget.duration)}
              >
                Your browser does not support HTML5 video playback.
              </video>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <FileText size={14} /> Lecture Description & Overview
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeModalVideo.description || "No description provided for this lecture."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
