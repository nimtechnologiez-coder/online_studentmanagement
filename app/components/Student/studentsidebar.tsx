"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Video,
  PlayCircle,
  Clock,
  BarChart2,
  Bell,
  User,
  Settings,
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

const menuItems = [
  { icon: Home, name: "Dashboard", href: "/Student/dashboard" },
  { icon: Video, name: "My Videos", href: "/Student/MyVideos" },
  { icon: PlayCircle, name: "Continue Watching", href: "/Student/ContinueWatching" },
  { icon: Clock, name: "Watch History", href: "/Student/WatchHistory" },
  { icon: BarChart2, name: "My Progress", href: "/Student/MyProgress" },
  { icon: Bell, name: "Notifications", href: "/Student/notifications" },
  { icon: User, name: "My Profile", href: "/Student/profile" },
  { icon: Settings, name: "Settings", href: "/Student/settings" },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Sticky Header Bar (Visible on mobile/tablet screens < 1024px) */}
      <div className="student-mobile-header">
        <div className="mobile-brand flex items-center gap-2">
          <div className="logo-badge text-sm">🎓</div>
          <span className="font-bold text-white text-base">Student Portal</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Theme Toggle */}
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

      {/* Backdrop overlay when mobile drawer is open */}
      {mobileOpen && (
        <div
          className="student-sidebar-backdrop"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside className={`student-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Mobile Header Close Button */}
        <div className="mobile-close-wrapper">
          <button onClick={closeMobileSidebar} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        {/* Header / Brand Logo */}
        <div className="sidebar-header">
          <div className="logo-badge">🎓</div>
          {(!collapsed || mobileOpen) && (
            <div className="brand-info">
              <h2>Student Portal</h2>
              <p>Learning Management</p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-menu">
          {menuItems.map((item) => {
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
                <Icon size={20} className="menu-icon-svg" />
                {(!collapsed || mobileOpen) && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {/* Theme Toggle Button */}
          <button
            className="theme-toggle-btn-sidebar"
            onClick={toggleTheme}
            title={collapsed && !mobileOpen ? "Toggle Theme" : undefined}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            {(!collapsed || mobileOpen) && (
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            )}
          </button>

          <button 
            className="logout-btn mt-2" 
            title={collapsed && !mobileOpen ? "Logout" : undefined}
            onClick={() => {
              try {
                localStorage.removeItem("student");
                localStorage.removeItem("student_token");
                sessionStorage.removeItem("student");
                sessionStorage.removeItem("student_token");
              } catch {}
              router.push("/Student/login");
            }}
          >
            <LogOut size={18} />
            {(!collapsed || mobileOpen) && <span>Logout</span>}
          </button>

          {(!collapsed || mobileOpen) && <p className="version-tag">Version 1.0</p>}
        </div>

        {/* Desktop Collapse Toggle Button */}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>
    </>
  );
}