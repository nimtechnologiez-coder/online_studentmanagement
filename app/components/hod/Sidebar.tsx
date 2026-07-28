"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Video,
  FileText,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

import "./sidebar.css";

const menu = [
  {
    title: "Main",
    items: [
      {
        name: "Dashboard",
        href: "/hod/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Students",
        href: "/hod/students",
        icon: Users,
      },
    ],
  },
  {
    title: "Academic",
    items: [
      {
        name: "Videos",
        href: "/hod/videos",
        icon: Video,
      },

    ],
  },
  {
    title: "Analytics",
    items: [
      {
        name: "Performance",
        href: "/hod/performance",
        icon: BarChart3,
      },
    ],
  },
];

export default function HODSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
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
      {/* Mobile Header Toggle */}
      <div className="mobile-header-bar">
        <div className="mobile-brand">
          <div className="logo-circle text-sm">H</div>
          <span className="mobile-brand-title">HOD Portal</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Theme Toggle */}
          <button
            className="mobile-toggle-btn text-slate-300 hover:text-white"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Backdrop overlay for mobile screens */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeMobileSidebar}
        />
      )}

      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Mobile close icon inside sidebar header */}
        <div className="sidebar-mobile-close">
          <button onClick={closeMobileSidebar} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-circle">H</div>
          {(!collapsed || mobileOpen) && (
            <div className="logo-text">
              <h2>HOD Portal</h2>
              <p>Management System</p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="sidebar-menu">
          {menu.map((group) => (
            <div key={group.title} className="menu-group">
              {(!collapsed || mobileOpen) && (
                <span className="menu-title">{group.title}</span>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileSidebar}
                    className={`menu-item ${active ? "active" : ""}`}
                    title={collapsed && !mobileOpen ? item.name : undefined}
                  >
                    <Icon size={20} className="menu-item-icon" />
                    {(!collapsed || mobileOpen) && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Card */}
        <div className="sidebar-user">
          <img
            src="https://api.dicebear.com/7.x/initials/svg?seed=HOD"
            alt="User Avatar"
          />
          {(!collapsed || mobileOpen) && (
            <div className="user-details">
              <h4>Dr. Alan Turing</h4>
              <p>Computer Science</p>
            </div>
          )}
        </div>

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

        {/* Logout */}
        <button className="logout-btn mt-2" onClick={handleLogout}>
          <LogOut size={18} />
          {(!collapsed || mobileOpen) && <span>Logout</span>}
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Collapse sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>
    </>
  );
}