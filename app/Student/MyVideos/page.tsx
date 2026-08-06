"use client";

import { useState, useEffect, useRef } from "react";
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

const API_BASE = "http://127.0.0.1:8000";

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
    } catch (e) {}
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
      const studentId = getStudentId();
      const params = new URLSearchParams();
      if (searchQ) params.set("search", searchQ);
      if (cat && cat !== "All") params.set("category", cat);

      const res = await fetch(`${API_BASE}/api/student/videos/?${params}`, {
        headers: studentId ? { "X-Student-Id": studentId } : {},
      });
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
      const studentId = getStudentId();
      const res = await fetch(`${API_BASE}/api/student/videos/${video.id}/watch/`, {
        method: "POST",
        headers: studentId ? { "X-Student-Id": studentId } : {},
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

      {/* Loading Spinner */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="text-sm font-medium">Loading videos...</span>
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
                              <CheckCircle2 size={13} /> Watched
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
                            width: video.watched ? "100%" : "0%",
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
                      {video.watched ? "Rewatch Lecture" : "Start Watching"}
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
