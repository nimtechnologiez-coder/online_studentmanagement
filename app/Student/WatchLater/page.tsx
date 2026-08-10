"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Play,
  Trash2,
  Search,
  Star,
  Clock,
  Video,
  X,
  ChevronRight
} from "lucide-react";
import "./watchlater.css";

const INITIAL_WATCH_LATER = [
  {
    id: 201,
    title: "Engineering Mathematics – Matrices & Linear Algebra",
    category: "Mathematics",
    duration: "22:18",
    rating: "4.9",
    views: "3.4K views",
    date: "29 Jul 2026",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 202,
    title: "Digital Electronics Basics & Logic Gates",
    category: "Digital Electronics",
    duration: "24:15",
    rating: "4.8",
    views: "2.1K views",
    date: "29 Jul 2026",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 203,
    title: "Data Structures & Advanced Python OOP",
    category: "Programming",
    duration: "18:30",
    rating: "4.9",
    views: "4.2K views",
    date: "27 Jul 2026",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=500&auto=format&fit=crop"
  }
];

export default function StudentWatchLaterPage() {
  const [watchLater, setWatchLater] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("student_watch_later");
      if (saved) {
        setWatchLater(JSON.parse(saved));
      } else {
        setWatchLater([]);
        localStorage.setItem("student_watch_later", JSON.stringify([]));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const saveWatchLater = (newList: any[]) => {
    setWatchLater(newList);
    try {
      localStorage.setItem("student_watch_later", JSON.stringify(newList));
    } catch (e) {}
  };

  const removeWatchLater = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = watchLater.filter((item) => item.id !== id);
    saveWatchLater(updated);
  };

  const filteredList = watchLater.filter((item) =>
    !searchQuery.trim() ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="wl-page-wrapper">
      {/* Header Bar */}
      <header className="wl-header-bar">
        <div className="wl-title-area">
          <div className="wl-icon-box">
            <Bookmark size={22} fill="#f59e0b" color="#f59e0b" />
          </div>
          <div>
            <h1>Watch Later</h1>
            <p>Saved lectures and bookmarked learning materials</p>
          </div>
        </div>

        <div className="wl-search-input-wrap">
          <Search size={16} className="wl-search-icon" />
          <input
            type="text"
            placeholder="Search saved videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Loading Skeleton - Principal Dashboard Style */}
      {loading ? (
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
      ) : filteredList.length === 0 ? (
        <div className="wl-empty-box">
          <Bookmark size={48} opacity={0.3} className="text-amber-500" />
          <h3>No Watch Later Videos</h3>
          <p>
            {searchQuery
              ? "No saved lectures matched your search query."
              : "You haven't bookmarked any lectures to watch later yet."}
          </p>
          <Link href="/Student/MyVideos" className="wl-browse-btn">
            Browse All Videos <ChevronRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="wl-grid">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="wl-card"
              onClick={() => setActiveVideo(item)}
            >
              <div className="wl-thumb-box">
                <img src={item.thumbnail} alt={item.title} />
                <span className="wl-cat-badge">{item.category}</span>
                <button
                  className="wl-remove-btn"
                  title="Remove from Watch Later"
                  onClick={(e) => removeWatchLater(item.id, e)}
                >
                  <Trash2 size={15} />
                </button>

                <button className="wl-play-center">
                  <Play size={20} fill="white" className="ml-0.5" />
                </button>
                <span className="wl-dur-tag">{item.duration}</span>
              </div>

              <div className="wl-card-body">
                <h3>{item.title}</h3>
                <button className="wl-watch-btn">
                  <Play size={12} fill="white" /> Play Lecture
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="wl-modal-overlay" onClick={() => setActiveVideo(null)}>
          <div className="wl-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="wl-modal-header">
              <h2>{activeVideo.title}</h2>
              <button className="wl-modal-close" onClick={() => setActiveVideo(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="wl-modal-video">
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                <Video size={40} className="text-amber-500 animate-pulse" />
                <span className="text-sm font-medium">Streaming {activeVideo.title}...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
