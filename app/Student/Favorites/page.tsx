"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Play,
  Trash2,
  Search,
  Star,
  Clock,
  Video,
  X,
  Sparkles,
  ChevronRight,
  BookOpen
} from "lucide-react";
import "./favorites.css";

const API_BASE = "http://127.0.0.1:8000";

const INITIAL_FAVORITES = [
  {
    id: 101,
    title: "Introduction to Python Programming",
    category: "Programming",
    duration: "28:50",
    rating: "4.8",
    views: "1.2K views",
    date: "30 Jul 2026",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500&auto=format&fit=crop",
    video_url: ""
  },
  {
    id: 102,
    title: "Engineering Mathematics – Matrices",
    category: "Mathematics",
    duration: "16:30",
    rating: "4.9",
    views: "4.8K views",
    date: "29 Jul 2026",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500&auto=format&fit=crop",
    video_url: ""
  },
  {
    id: 103,
    title: "Digital Electronics Basics & Flip-Flops",
    category: "Digital Electronics",
    duration: "24:15",
    rating: "4.8",
    views: "2.3K views",
    date: "29 Jul 2026",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500&auto=format&fit=crop",
    video_url: ""
  },
  {
    id: 104,
    title: "Data Structures & Algorithm Fundamentals",
    category: "Programming",
    duration: "18:30",
    rating: "4.9",
    views: "5.1K views",
    date: "27 Jul 2026",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=500&auto=format&fit=crop",
    video_url: ""
  },
  {
    id: 105,
    title: "Effective Time Management & Soft Skills",
    category: "Soft Skills",
    duration: "16:30",
    rating: "4.7",
    views: "890 views",
    date: "26 Jul 2026",
    thumbnail: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=500&auto=format&fit=crop",
    video_url: ""
  }
];

export default function StudentFavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<any | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("student_favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      } else {
        setFavorites(INITIAL_FAVORITES);
        localStorage.setItem("student_favorites", JSON.stringify(INITIAL_FAVORITES));
      }
    } catch (e) {
      setFavorites(INITIAL_FAVORITES);
    }
  }, []);

  const saveFavoritesToStorage = (newList: any[]) => {
    setFavorites(newList);
    try {
      localStorage.setItem("student_favorites", JSON.stringify(newList));
    } catch (e) {}
  };

  const removeFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.filter((item) => item.id !== id);
    saveFavoritesToStorage(updated);
  };

  const clearAllFavorites = () => {
    if (confirm("Are you sure you want to remove all favorite videos?")) {
      saveFavoritesToStorage([]);
    }
  };

  const categories = ["All", ...Array.from(new Set(favorites.map((f) => f.category || "General")))];

  const filteredFavorites = favorites.filter((item) => {
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fav-page-wrapper">
      {/* Top Header Bar */}
      <header className="fav-header-bar">
        <div className="fav-title-area">
          <div className="fav-icon-box">
            <Heart size={22} fill="#ec4899" color="#ec4899" />
          </div>
          <div>
            <h1>My Favorite Lectures</h1>
            <p>Your saved video lectures for quick revision & reference</p>
          </div>
        </div>

        <span className="fav-count-chip">
          {favorites.length} Saved {favorites.length === 1 ? "Video" : "Videos"}
        </span>
      </header>

      {/* Controls Bar */}
      <div className="fav-controls-bar">
        <div className="fav-search-input-wrap">
          <Search size={16} className="fav-search-icon" />
          <input
            type="text"
            placeholder="Search favorite lectures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="fav-categories-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`fav-cat-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {favorites.length > 0 && (
          <button className="fav-clear-btn" onClick={clearAllFavorites}>
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {/* Main Grid View */}
      {filteredFavorites.length === 0 ? (
        <div className="fav-empty-box">
          <Heart size={48} opacity={0.3} className="text-pink-500" />
          <h3>No Favorite Videos Found</h3>
          <p>
            {searchQuery || selectedCategory !== "All"
              ? "No favorite videos matched your search or category filter."
              : "You haven't added any video lectures to your favorites yet."}
          </p>
          <Link href="/Student/MyVideos" className="fav-browse-btn">
            Browse All Videos <ChevronRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="fav-grid">
          {filteredFavorites.map((item) => (
            <div
              key={item.id}
              className="fav-card"
              onClick={() => setActiveVideo(item)}
            >
              <div className="fav-thumb-box">
                <img src={item.thumbnail} alt={item.title} />
                <span className="fav-cat-badge">{item.category}</span>
                <button
                  className="fav-heart-remove-btn"
                  title="Remove from Favorites"
                  onClick={(e) => removeFavorite(item.id, e)}
                >
                  <Heart size={16} fill="#ec4899" />
                </button>

                <button className="fav-play-center">
                  <Play size={20} fill="white" className="ml-0.5" />
                </button>
                <span className="fav-dur-tag">{item.duration}</span>
              </div>

              <div className="fav-card-body">
                <h3>{item.title}</h3>
                <div className="fav-meta-row">
                  <span className="fav-star-rating">
                    <Star size={12} fill="#f59e0b" color="#f59e0b" /> {item.rating || "4.8"}
                  </span>
                  <span>{item.views || "1K views"}</span>
                </div>

                <div className="fav-card-actions">
                  <button className="fav-watch-btn">
                    <Play size={12} fill="white" /> Watch Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fav-modal-overlay" onClick={() => setActiveVideo(null)}>
          <div className="fav-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="fav-modal-header">
              <h2>{activeVideo.title}</h2>
              <button className="fav-modal-close" onClick={() => setActiveVideo(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="fav-modal-video">
              {activeVideo.video_url ? (
                <video src={activeVideo.video_url} controls autoPlay />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                  <Video size={40} className="text-blue-500 animate-pulse" />
                  <span className="text-sm font-medium">Playing {activeVideo.title}...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
