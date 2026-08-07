"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Video,
  BarChart3,
  CalendarDays,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./sidebar.css";

const menuGroups = [
  {
    label: "OVERVIEW",
    items: [
      { title: "Dashboard", href: "/hod/dashboard", icon: LayoutDashboard },
      { title: "Students", href: "/hod/students", icon: Users },

    ],
  },
  {
    label: "ACADEMICS & ANALYTICS",
    items: [
      { title: "Video Analytics", href: "/hod/videos", icon: Video },
      { title: "Performance", href: "/hod/performance", icon: BarChart3 },
      // { title: "Attendance", href: "/hod/attendance", icon: CalendarDays },
      { title: "Profile", href: "/hod/hod_profile", icon: User },
    ],
  },
];

export default function HODSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [hodName, setHodName] = useState("Dr. Alan Turing");
  const [departmentName, setDepartmentName] = useState("Computer Science & Eng.");
  const [hodEmail, setHodEmail] = useState("");

  useEffect(() => {
    try {
      const saved =
        typeof window !== "undefined"
          ? localStorage.getItem("hod") || sessionStorage.getItem("hod") || localStorage.getItem("user")
          : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        const name =
          parsed?.hod_name ||
          parsed?.name ||
          parsed?.full_name ||
          parsed?.username ||
          "Dr. Alan Turing";
        const dept =
          parsed?.department ||
          parsed?.dept ||
          parsed?.department_name ||
          "Computer Science & Eng.";
        const email = parsed?.email || parsed?.hod_email || "";

        setHodName(name);
        setDepartmentName(dept);
        setHodEmail(email);
      }
    } catch (e) {
      console.error("Error reading HOD info:", e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hod");
    sessionStorage.removeItem("hod");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    window.location.href = "/hod/login";
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header (Visible on screens < 1024px) */}
      <div className="principal-mobile-header">
        <div className="mobile-brand flex items-center gap-2">
          <div className="sidebar-logo-icon">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="font-bold text-base block leading-tight">HOD Portal</span>
            <span className="text-xs text-slate-400">Department Dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="mobile-theme-btn-principal"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            className="mobile-menu-btn-principal"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      <div
        className={`principal-sidebar-backdrop ${mobileOpen ? "backdrop-active" : ""}`}
        onClick={closeMobileSidebar}
      />

      {/* Main Sidebar Drawer */}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Header with Sparkles Logo */}
        <div className="sidebar-header">
          <div className="sidebar-brand-wrapper">
            <div className="sidebar-logo-icon">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="sidebar-brand-text">
              <h1 className="sidebar-logo">HOD Portal</h1>
              <p className="sidebar-subtitle">Department Dashboard</p>
            </div>
          </div>
          <button className="sidebar-menu-toggle-btn" title="Toggle layout">
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Menu Groups */}
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
                      <Icon size={18} strokeWidth={2} className="sidebar-icon" />
                    </span>
                    <span className="sidebar-link-text">{menu.title}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {/* Theme Toggle Pill Switch */}
          <div className="sidebar-footer-item pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="theme-toggle-row" onClick={toggleTheme}>
              <div className="theme-toggle-label">
                <Sun size={16} className="theme-icon" />
                <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
              </div>
              <div className={`theme-switch-track ${theme === "dark" ? "switch-dark" : "switch-light"}`}>
                <div className="theme-switch-thumb" />
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="sidebar-footer-item pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="sidebar-profile-card cursor-pointer hover:opacity-90 transition-opacity" onClick={() => router.push("/hod/hod_profile")}>
              <div className="profile-avatar-box">
                <span>{hodName.replace(/^Dr\.\s*/i, '').trim().charAt(0).toUpperCase() || "H"}</span>
              </div>
              <div className="sidebar-profile-text">
                <span className="sidebar-profile-name">{hodName}</span>
                <p className="sidebar-profile-role">Head of Department</p>
                {hodEmail && (
                  <p className="sidebar-profile-email" style={{ fontSize: "11px", opacity: 0.8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {hodEmail}
                  </p>
                )}
                <p className="sidebar-profile-college">{departmentName}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="sidebar-footer-item">
            <button type="button" className="sidebar-logout-btn" onClick={handleLogout}>
              <LogOut size={16} strokeWidth={2} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}