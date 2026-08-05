"use client";

import { useState, useEffect } from "react";
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
  Moon,
  Sparkles,
  SlidersHorizontal,
  Building2,
  PlaySquare,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./Sidebar.css";

const menuGroups = [
  {
    label: "OVERVIEW",
    items: [
      { title: "Dashboard", href: "/principal/dashboard", icon: LayoutDashboard },
      { title: "Student Management", href: "/principal/students", icon: Users },
      { title: "Department Overview", href: "/principal/departments", icon: Building2 },
    ],
  },
  {
    label: "REPORTS",
    items: [
      { title: "Video Reports", href: "/principal/video_report", icon: PlaySquare },
    ],
  },
  {
    label: "ACCOUNT",
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
  const [principalName, setPrincipalName] = useState("Principal");
  const [principalEmail, setPrincipalEmail] = useState("");
  const [collegeName, setCollegeName] = useState("Institutional Portal");

  useEffect(() => {
    try {
      const saved =
        typeof window !== "undefined"
          ? localStorage.getItem("principal") || sessionStorage.getItem("principal")
          : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        const name =
          parsed?.principal_name ||
          parsed?.name ||
          parsed?.full_name ||
          parsed?.username ||
          "Principal";
        const email =
          parsed?.principal_email || parsed?.email || "";
        const college =
          parsed?.college ||
          parsed?.college_name ||
          parsed?.institution ||
          "Institutional Portal";

        setPrincipalName(name);
        setPrincipalEmail(email);
        setCollegeName(college);
      }
    } catch (e) {
      console.error("Error reading principal info:", e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("principal");
    sessionStorage.removeItem("principal");
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
          <div className="sidebar-logo-icon">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="font-bold text-base block leading-tight">College Portal</span>
            <span className="text-xs text-slate-400">Principal Dashboard</span>
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
      {mobileOpen && (
        <div
          className="principal-sidebar-backdrop"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Header with Star Icon & Title */}
        <div className="sidebar-header">
          <div className="sidebar-brand-wrapper">
            <div className="sidebar-logo-icon">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="sidebar-brand-text">
              <h1 className="sidebar-logo">College Portal</h1>
              <p className="sidebar-subtitle">Principal Dashboard</p>
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
          <div className="theme-toggle-row" onClick={toggleTheme}>
            <div className="theme-toggle-label">
              <Sun size={16} className="theme-icon" />
              <span>Light Mode</span>
            </div>
            <div className={`theme-switch-track ${theme === "dark" ? "switch-dark" : "switch-light"}`}>
              <div className="theme-switch-thumb" />
            </div>
          </div>

          {/* Profile Card */}
          <div className="sidebar-profile-card">
            <div className="profile-avatar-box">
              <User size={20} />
            </div>
            <div className="sidebar-profile-text">
              <span className="sidebar-profile-name">{principalName}</span>
              <p className="sidebar-profile-role">Principal</p>
              {principalEmail && (
                <p className="sidebar-profile-email" style={{ fontSize: "11px", opacity: 0.8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {principalEmail}
                </p>
              )}
              <p className="sidebar-profile-college">{collegeName}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button type="button" className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={16} strokeWidth={2} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}