"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Video,
  CalendarDays,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./Sidebar.css";

const menuGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/principal/dashboard", icon: LayoutDashboard },
      { title: "Student Management", href: "/principal/students", icon: Users },
      { title: "Department Overview", href: "/principal/departments", icon: GraduationCap },
    ],
  },
  {
    label: "Reports",
    items: [
      { title: "Video Reports", href: "/principal/video_report", icon: Video },
      { title: "Attendance", href: "/principal/attendance_reports", icon: CalendarDays },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Profile", href: "/principal/principal_profile", icon: User },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    router.push("/");
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header (Visible only on mobile/tablet < 1024px) */}
      <div className="principal-mobile-header">
        <div className="mobile-brand flex items-center gap-2">
          <div className="logo-circle-principal text-sm">P</div>
          <span className="font-bold text-white text-base">Principal Portal</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Theme Toggle */}
          <button
            className="mobile-theme-btn-principal text-slate-300 hover:text-white"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <button
            className="mobile-menu-btn-principal text-slate-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          className="principal-sidebar-backdrop"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Mobile close icon inside sidebar header */}
        <div className="sidebar-mobile-close-principal">
          <button onClick={closeMobileSidebar} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        {/* Logo */}
        <div className="sidebar-header">
          <span className="sidebar-eyebrow">Institutional Access</span>
          <h1 className="sidebar-logo">College Portal</h1>
          <p className="sidebar-subtitle">Principal Dashboard</p>
        </div>

        {/* Menu */}
        <nav className="sidebar-nav">
          {menuGroups.map((group) => (
            <div className="sidebar-group" key={group.label}>
              <span className="sidebar-group-label">{group.label}</span>
              {group.items.map((menu) => {
                const Icon = menu.icon;
                const active = pathname === menu.href;

                return (
                  <Link
                    key={menu.title}
                    href={menu.href}
                    onClick={closeMobileSidebar}
                    className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
                  >
                    <span className="sidebar-icon-wrap">
                      <Icon size={18} strokeWidth={1.75} className="sidebar-icon" />
                    </span>
                    <span className="sidebar-link-text">{menu.title}</span>
                    {active && <span className="sidebar-active-dot" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Profile & Theme Toggler */}
        <div className="sidebar-footer">
          {/* Theme Toggle Button */}
          <button
            className="theme-toggle-btn-sidebar"
            onClick={toggleTheme}
            style={{ marginBottom: "0.75rem", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </button>

          <div className="sidebar-profile">
            <div className="sidebar-avatar">
              <User size={18} strokeWidth={1.75} />
            </div>
            <div className="sidebar-profile-text">
              <h2 className="sidebar-profile-name">Principal</h2>
              <p className="sidebar-profile-email">principal@college.com</p>
            </div>
          </div>

          <button type="button" className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={17} strokeWidth={1.75} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}