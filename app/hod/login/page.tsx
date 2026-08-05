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
      alert("Please enter Username and Password");
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
        response = await fetch("http://127.0.0.1:8000/api/hod/login/", {
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

        alert(data.message || "HOD Login Successful");

        // Redirect ONLY to HOD Dashboard
        router.push("/hod/dashboard");
      } else {
        alert(data.message || "Invalid Username or Password");
      }
    } catch (error) {
      console.error("HOD Login failed:", error);
      alert("Unable to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#070913",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
        }}
      >
        <p>Verifying authentication...</p>
      </div>
    );
  }

  return (
    <div className="login-page">
      {/* Background Glow Meshes */}
      <div className="bg-glow-orb glow-1"></div>
      <div className="bg-glow-orb glow-2"></div>

      {/* Main Split Layout Container */}
      <div className="login-wrapper">
        
        {/* Left Branding & Visual Panel */}
        <div className="left-section">
          <div className="left-grid-pattern"></div>
          <div className="left-overlay"></div>

          <div className="left-content">
            {/* Top Status Pill */}
            <div className="system-status-pill">
              <span className="status-dot"></span>
              <span>Department Governance • HOD Portal v2.4</span>
            </div>

            {/* Brand Header */}
            <div className="brand-header">
              <div className="brand-icon-box">
                <GraduationCap className="brand-icon" size={26} />
              </div>
              <div className="brand-title-wrap">
                <span className="brand-eyebrow">Academic Management</span>
                <h2 className="brand-name">EduFlow Portal</h2>
              </div>
            </div>

            <h1>Department Head Governance</h1>

            <p className="description-text">
              Empowering department heads with centralized academic monitoring, faculty management, student attendance tracking, and data-driven performance analytics.
            </p>

            {/* Core Feature List */}
            <div className="features-list">
              <div className="feature-item">
                <CheckCircle2 size={18} className="feature-icon" />
                <span>Departmental Video & Attendance Supervision</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 size={18} className="feature-icon" />
                <span>Faculty Lecture Tracking & Doubt Resolution Auditing</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 size={18} className="feature-icon" />
                <span>Encrypted Academic Progress & Performance Metrics</span>
              </div>
            </div>

            {/* Left Footer Stats */}
            <div className="left-footer">
              <div className="stat-card">
                <div className="stat-header">
                  <ShieldCheck size={18} className="stat-icon" />
                  <span className="stat-value">256-bit AES</span>
                </div>
                <span className="stat-label">Secure Authentication</span>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <Activity size={18} className="stat-icon" />
                  <span className="stat-value">99.9% SLA</span>
                </div>
                <span className="stat-label">Institutional Uptime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card Panel */}
        <div className="right-section">
          <div className="login-card">
            
            <div className="login-card-header">
              <div className="security-tag">
                <Lock size={13} />
                <span>HOD Secure Access</span>
              </div>
              <h2>HOD Sign In</h2>
              <p className="subtitle">
                Enter your HOD credentials to access your department dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="login-form">

              {/* Username Field */}
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <User size={18} className="field-icon" />
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
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="field-icon" />
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
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="form-options">
                <label className="remember-checkbox">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="remember-label">Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <span className="btn-loading">
                    <span className="spinner"></span>
                    Authenticating...
                  </span>
                ) : (
                  <span className="btn-content">
                    Sign In to HOD Dashboard
                    <ArrowRight size={18} className="btn-arrow" />
                  </span>
                )}
              </button>

            </form>

            <div className="card-footer-note">
              <ShieldCheck size={14} className="footer-shield" />
              <span>Institutional HOD Access. Need help? Contact IT Admin.</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
