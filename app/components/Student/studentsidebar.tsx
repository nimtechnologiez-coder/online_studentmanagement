"use client";

import { useState, useEffect } from "react";
import { studentFetch } from "../../Student/studentFetch";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  Compass,
  Bookmark,
  Clock,
  BarChart2,
  Heart,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./studentsidebar.css";

const topMenuItems = [
  { icon: LayoutDashboard, name: "Dashboard", href: "/Student/dashboard" },
  { icon: Video, name: "All Videos", href: "/Student/MyVideos" },
  { icon: Compass, name: "Explore", href: "/Student/ContinueWatching" },
  { icon: Bookmark, name: "Watch Later", href: "/Student/WatchLater" },
  { icon: Clock, name: "Watch History", href: "/Student/WatchHistory" },
  { icon: BarChart2, name: "My Progress", href: "/Student/MyProgress" },
  { icon: Heart, name: "Favorites", href: "/Student/Favorites" },
  { icon: User, name: "Profile", href: "/Student/profile" },
];

const bottomMenuItems: any[] = [];

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [monthlyProgress, setMonthlyProgress] = useState<number>(0);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchSidebarProgress();

    const handleUpdate = () => {
      fetchSidebarProgress();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("student_progress_updated", handleUpdate);
      window.addEventListener("focus", handleUpdate);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("student_progress_updated", handleUpdate);
        window.removeEventListener("focus", handleUpdate);
      }
    };
  }, []);

  async function fetchSidebarProgress() {
    try {
      // 1. Try reading from sessionStorage cache first
      if (typeof window !== "undefined") {
        const cached = sessionStorage.getItem("student_dash_cache");
        if (cached) {
          try {
            const data = JSON.parse(cached);
            if (data?.stats) {
              setMonthlyProgress(data.stats.monthlyProgress ?? 0);
              return;
            }
          } catch (_) {}
        }
      }

      // 2. If on dashboard page and no cache exists yet, let the dashboard fetch it
      if (pathname === "/Student/dashboard") {
        return;
      }

      const res = await studentFetch("/api/student/dashboard/");
      const data = await res.json();
      if (res.ok && data.status === "success" && data.stats) {
        setMonthlyProgress(data.stats.monthlyProgress ?? 0);
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("student_dash_cache", JSON.stringify(data));
          } catch (_) {}
        }
      } else {
        setMonthlyProgress(0);
      }
    } catch (e) {
      setMonthlyProgress(0);
    }
  }

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Sticky Header Bar */}
      <div className="student-mobile-header">
        <div className="mobile-brand flex items-center gap-2">
          <div className="sp-logo-box text-sm">SP</div>
          <span className="font-bold text-white text-base">Student Portal</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="theme-toggle-btn text-slate-300 hover:text-white"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Backdrop overlay */}
      {mobileOpen && (
        <div
          className="student-sidebar-backdrop"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside className={`student-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="mobile-close-wrapper">
          <button onClick={closeMobileSidebar} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sp-logo-box">SP</div>
          {(!collapsed || mobileOpen) && (
            <div className="brand-info">
              <h2>Student Portal</h2>
              <p>Enterprise LMS</p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-menu">
          {topMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileSidebar}
                className={`menu-item ${isActive ? "active" : ""}`}
                title={collapsed && !mobileOpen ? item.name : undefined}
              >
                <Icon size={18} className="menu-icon-svg" />
                {(!collapsed || mobileOpen) && <span>{item.name}</span>}
              </Link>
            );
          })}

          {/* Promo Box (Overall Progress Ring) */}
          {(!collapsed || mobileOpen) && (
            <div className="sp-sidebar-promo-card">
              <span className="sp-promo-tag">Keep Learning Keep Growing! 🚀</span>
              <div
                className="sp-promo-ring-box cursor-pointer my-1 transition-transform hover:scale-105"
                onClick={() => {
                  closeMobileSidebar();
                  router.push("/Student/MyProgress");
                }}
                title="Click to view detailed progress analytics"
              >
                <div
                  className="sp-promo-ring-circle"
                  style={{
                    background: `conic-gradient(#2563eb ${Math.min(100, Math.max(0, monthlyProgress)) * 3.6}deg, var(--card-border, #1e293b) 0deg)`,
                  }}
                >
                  <div className="sp-promo-ring-inner">
                    <span className="sp-promo-val">{monthlyProgress}%</span>
                    <span className="sp-promo-lbl">This Month</span>
                  </div>
                </div>
              </div>
              <Link
                href="/Student/MyProgress"
                onClick={closeMobileSidebar}
                className="sp-promo-btn"
              >
                View Progress
              </Link>
            </div>
          )}

          {/* Secondary Nav Items */}
          <div className="mt-4 pt-4 border-t border-slate-800/60">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileSidebar}
                  className={`menu-item ${isActive ? "active" : ""}`}
                  title={collapsed && !mobileOpen ? item.name : undefined}
                >
                  <Icon size={18} className="menu-icon-svg" />
                  {(!collapsed || mobileOpen) && <span>{item.name}</span>}
                </Link>
              );
            })}

            <button
              className="menu-item logout-menu-item mt-1 w-full"
              title={collapsed && !mobileOpen ? "Logout" : undefined}
              onClick={() => {
                // Background backend logout call, do not block the UI redirect
                studentFetch("/api/student/logout/", { method: "POST" }).catch((e) => {
                  console.error("Backend logout error:", e);
                });

                // Immediate client-side clear & redirect
                try {
                  localStorage.removeItem("student");
                  localStorage.removeItem("student_token");
                  sessionStorage.removeItem("student");
                  sessionStorage.removeItem("student_token");
                } catch (_) {}

                router.push("/Student/login");
              }}
            >
              <LogOut size={18} className="menu-icon-svg" />
              {(!collapsed || mobileOpen) && <span>Logout</span>}
            </button>
          </div>
        </nav>

        {/* Sidebar Footer Switch */}
        <div className="sidebar-footer">
          <div className="sp-theme-switch-row">
            {(!collapsed || mobileOpen) && (
              <span className="sp-switch-label">
                <Moon size={14} /> Dark Mode
              </span>
            )}
            <label className="sp-switch">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <span className="sp-slider round"></span>
            </label>
          </div>
        </div>

        {/* Desktop Collapse Toggle Button */}
        <button
          className="sidebar-toggle-btn"
          onClick={() => {
            const nextState = !collapsed;
            setCollapsed(nextState);
            if (typeof document !== "undefined") {
              if (nextState) {
                document.body.classList.add("student-sidebar-collapsed");
              } else {
                document.body.classList.remove("student-sidebar-collapsed");
              }
            }
          }}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>
    </>
  );
}