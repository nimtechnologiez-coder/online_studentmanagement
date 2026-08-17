"use client";

import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Activity,
  AlertCircle,
  X
} from "lucide-react";
import "./loginpage.css";

export default function HODLoginPage() {
  const router = useRouter();

  // State for form inputs
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Modal alert states
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"error" | "success">("error");

  // Check if HOD is already logged in
  useEffect(() => {
    const savedHod =
      typeof window !== "undefined"
        ? localStorage.getItem("hod") || sessionStorage.getItem("hod")
        : null;

    if (savedHod) {
      try {
        const parsed = JSON.parse(savedHod);
        if (parsed) {
          router.replace("/hod/dashboard");
          return;
        }
      } catch (e) {
        localStorage.removeItem("hod");
        sessionStorage.removeItem("hod");
      }
    }
    setCheckingAuth(false);
  }, [router]);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setModalType("error");
      setModalMessage("Please enter Username and Password");
      return;
    }

    setIsLoading(true);

    try {
      let response: Response;
      try {
        response = await fetch("/api/hod/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: formData.username.trim(),
            password: formData.password.trim(),
          }),
        });
        if (!response.ok && response.status === 404) {
          throw new Error("404 relative route");
        }
      } catch (err) {
        response = await fetch("https://online-management-backend.onrender.com/api/hod/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: formData.username.trim(),
            password: formData.password.trim(),
          }),
        });
      }

      const data = await response.json();

      console.log("HOD Login Response:", data);

      if (response.ok && (data.success || data.status === "success")) {
        // Save HOD Details in localStorage or sessionStorage based on rememberMe
        if (formData.rememberMe) {
          localStorage.setItem("hod", JSON.stringify(data.user));
        } else {
          sessionStorage.setItem("hod", JSON.stringify(data.user));
        }

        // Redirect ONLY to HOD Dashboard
        router.push("/hod/dashboard");
      } else {
        setModalType("error");
        setModalMessage(data.message || "Invalid Username or Password");
      }
    } catch (error) {
      console.error("HOD Login failed:", error);
      setModalType("error");
      setModalMessage("Unable to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: "100vh", background: "#070913", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 420, height: 480, borderRadius: 24, background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }} className="skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="hod-login-page-shell">
      {/* Background Glow Meshes */}
      <div className="hod-login-bg-glow-orb hod-login-glow-1"></div>
      <div className="hod-login-bg-glow-orb hod-login-glow-2"></div>

      {/* Main Split Layout Container */}
      <div className="hod-login-wrapper">

        {/* Left Branding & Visual Panel */}
        <div className="hod-login-left-section">
          <div className="hod-login-left-grid-pattern"></div>
          <div className="hod-login-left-overlay"></div>

          <div className="hod-login-left-content">
            {/* Top Status Pill */}
            <div className="hod-login-system-status-pill">
              <span className="hod-login-status-dot"></span>
              <span>Department Governance • HOD Portal v2.4</span>
            </div>

            {/* Brand Header */}
            <div className="hod-login-brand-header">
              <div className="hod-login-brand-icon-box">
                <GraduationCap className="hod-login-brand-icon" size={26} />
              </div>
              <div className="hod-login-brand-title-wrap">
                <span className="hod-login-brand-eyebrow">Academic Management</span>
                <h2 className="hod-login-brand-name">EduFlow Portal</h2>
              </div>
            </div>

            <h1>Department Head Governance</h1>

            <p className="hod-login-description-text">
              Empowering department heads with centralized academic monitoring, faculty management, student attendance tracking, and data-driven performance analytics.
            </p>

            {/* Core Feature List */}
            <div className="hod-login-features-list">
              <div className="hod-login-feature-item">
                <CheckCircle2 size={18} className="hod-login-feature-icon" />
                <span>Departmental Video & Attendance Supervision</span>
              </div>
              <div className="hod-login-feature-item">
                <CheckCircle2 size={18} className="hod-login-feature-icon" />
                <span>Faculty Lecture Tracking & Doubt Resolution Auditing</span>
              </div>
              <div className="hod-login-feature-item">
                <CheckCircle2 size={18} className="hod-login-feature-icon" />
                <span>Encrypted Academic Progress & Performance Metrics</span>
              </div>
            </div>

            {/* Left Footer Stats */}
            <div className="hod-login-left-footer">
              <div className="hod-login-stat-card">
                <div className="hod-login-stat-header">
                  <ShieldCheck size={18} className="hod-login-stat-icon" />
                  <span className="hod-login-stat-value">256-bit AES</span>
                </div>
                <span className="hod-login-stat-label">Secure Authentication</span>
              </div>

              <div className="hod-login-stat-card">
                <div className="hod-login-stat-header">
                  <Activity size={18} className="hod-login-stat-icon" />
                  <span className="hod-login-stat-value">99.9% SLA</span>
                </div>
                <span className="hod-login-stat-label">Institutional Uptime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card Panel */}
        <div className="hod-login-right-section">
          <div className="hod-login-card">

            <div className="hod-login-card-header">
              <div className="hod-login-security-tag">
                <Lock size={13} />
                <span>HOD Secure Access</span>
              </div>
              <h2>HOD Sign In</h2>
              <p className="hod-login-subtitle">
                Enter your HOD credentials to access your department dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="hod-login-form">

              {/* Username Field */}
              <div className="hod-login-input-group">
                <label htmlFor="username">Username</label>
                <div className="hod-login-input-wrapper">
                  <User size={18} className="hod-login-field-icon" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter HOD username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="hod-login-input-group">
                <label htmlFor="password">Password</label>
                <div className="hod-login-input-wrapper">
                  <Lock size={18} className="hod-login-field-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="hod-login-toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="hod-login-form-options">
                <label className="hod-login-remember-checkbox">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span className="hod-login-checkbox-custom"></span>
                  <span className="hod-login-remember-label">Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="hod-login-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <span className="hod-login-btn-loading">
                    <span className="hod-login-spinner"></span>
                    Authenticating...
                  </span>
                ) : (
                  <span className="hod-login-btn-content">
                    Sign In to HOD Dashboard
                    <ArrowRight size={18} className="hod-login-btn-arrow" />
                  </span>
                )}
              </button>

            </form>

            <div className="hod-login-card-footer-note">
              <ShieldCheck size={14} className="hod-login-footer-shield" />
              <span>Institutional HOD Access. Need help? Contact IT Admin.</span>
            </div>

          </div>
        </div>

      </div>

      {/* Modern Custom Dialog Modal without page blur */}
      {modalMessage && (
        <div 
          className="hod-login-modal-backdrop"
          onClick={() => setModalMessage(null)}
        >
          <div 
            className="hod-login-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={modalType === 'error' ? "hod-login-modal-icon-box" : "hod-login-modal-icon-box success"}>
              {modalType === 'error' ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
            </div>
            <h3 className="hod-login-modal-title">
              {modalType === 'error' ? 'Authentication Alert' : 'Success'}
            </h3>
            <p className="hod-login-modal-message">
              {modalMessage}
            </p>
            <button
              type="button"
              onClick={() => setModalMessage(null)}
              className={modalType === 'error' ? "hod-login-modal-dismiss-btn" : "hod-login-modal-dismiss-btn success"}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
