"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Activity,
  AlertCircle,
  X,
} from "lucide-react";
import {
  getStoredPrincipal,
  saveStoredPrincipal,
  clearStoredPrincipal,
} from "../../utils/auth";
import "../../PrincipalLogin.css";

export default function PrincipalLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [expiredMessage, setExpiredMessage] = useState<string | null>(null);

  // Modal alert states
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"error" | "success">("error");

  useEffect(() => {
    const searchParams =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;

    const isExpiredParam = searchParams?.get("expired") === "true";

    const { expired, data } = getStoredPrincipal();

    if (isExpiredParam || expired) {
      clearStoredPrincipal();
      setExpiredMessage("Session expired. Please login again.");
      setCheckingAuth(false);
      return;
    }

    if (data) {
      router.replace("/principal/dashboard");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setModalType("error");
      setModalMessage("Please enter Username and Password");
      return;
    }

    setLoading(true);

    try {
      let response: Response;
      try {
        response = await fetch("/api/principal/login/", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username.trim(), password: password.trim() }),
        });
        if (!response.ok && response.status === 404) {
          throw new Error("404 relative route");
        }
      } catch (err) {
        response = await fetch("https://online-management-backend.onrender.com/api/principal/login/", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username.trim(), password: password.trim() }),
        });
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Retry directly against Django server if Next.js proxy returned HTML error page
        response = await fetch("https://online-management-backend.onrender.com/api/principal/login/", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username.trim(), password: password.trim() }),
        });
      }

      const result = await response.json();

      console.log("Login Response:", result);

      if (response.ok && result.status === "success") {
        saveStoredPrincipal(result.data, remember);
        setExpiredMessage(null);
        // Redirect to Principal Dashboard
        router.push("/principal/dashboard");
      } else {
        setModalType("error");
        setModalMessage(result.message || "Invalid Username or Password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setModalType("error");
      setModalMessage("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: "100vh", background: "#070b14", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 420, height: 480, borderRadius: 24, background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }} className="skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="login-page">
      {/* Background Glow Meshes */}
      <div className="bg-glow-orb glow-1"></div>
      <div className="bg-glow-orb glow-2"></div>

      {/* Main Split Layout */}
      <div className="login-wrapper">

        {/* Left Branding & Highlights Panel */}
        <div className="left-section">
          <div className="left-grid-pattern"></div>
          <div className="left-overlay"></div>

          <div className="left-content">
            {/* Top Badge */}
            <div className="system-status-pill">
              <span className="status-dot"></span>
              <span>Enterprise Portal • Secure v2.4</span>
            </div>

            {/* Brand Logo & Name */}
            <div className="brand-header">
              <div className="brand-icon-box">
                <Building2 className="brand-icon" size={24} />
              </div>
              <div className="brand-title-wrap">
                <span className="brand-eyebrow">Academic Administration</span>
                <h2 className="brand-name">Online Video Management</h2>
              </div>
            </div>

            <h1>Executive Principal Portal</h1>

            <p className="description-text">
              Unified governance platform providing principals real-time control over institutional analytics, video streaming, attendance tracking, and department metrics.
            </p>

            {/* Core Value Highlights */}
            <div className="features-list">
              <div className="feature-item">
                <CheckCircle2 size={18} className="feature-icon" />
                <span>Centralized Departmental Governance & Analytics</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 size={18} className="feature-icon" />
                <span>Real-Time Student Attendance & Doubt Resolution Reports</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 size={18} className="feature-icon" />
                <span>Encrypted Academic Video & Performance Auditing</span>
              </div>
            </div>

            {/* Left Footer Stats */}
            <div className="left-footer">
              <div className="stat-card">
                <div className="stat-header">
                  <ShieldCheck size={18} className="stat-icon" />
                  <span className="stat-value">256-bit AES</span>
                </div>
                <span className="stat-label">Bank-Grade Encryption</span>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <Activity size={18} className="stat-icon" />
                  <span className="stat-value">99.9% Uptime</span>
                </div>
                <span className="stat-label">Institutional SLA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Interactive Login Card Panel */}
        <div className="right-section">
          <div className="login-card">

            <div className="login-card-header">
              <div className="security-tag">
                <Lock size={13} />
                <span>Secure Access</span>
              </div>
              <h2>Principal Login</h2>
              <p className="subtitle">
                Access your executive dashboard using your institutional credentials.
              </p>
            </div>

            {expiredMessage && (
              <div className="session-expired-alert">
                <AlertCircle size={18} className="alert-icon" />
                <span>{expiredMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">

              {/* Username Input */}
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <User size={18} className="field-icon" />
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter institutional username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="field-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Remember Me Toggle */}
              <div className="form-options">
                <label className="remember-checkbox">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="remember-label">Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner"></span>
                    Authenticating...
                  </span>
                ) : (
                  <span className="btn-content">
                    Sign In to Dashboard
                    <ArrowRight size={18} className="btn-arrow" />
                  </span>
                )}
              </button>

            </form>

            <div className="card-footer-note">
              <ShieldCheck size={14} className="footer-shield" />
              <span>Protected by Enterprise Security. Contact administrator if needed.</span>
            </div>

          </div>
        </div>

      </div>

      {/* Modern Custom Dialog Modal */}
      {modalMessage && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setModalMessage(null)}
        >
          <div 
            className="relative w-full max-w-sm p-6 bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl text-center transform scale-100 transition-all duration-300"
            style={{ 
              background: "var(--principal-panel-dark, #0f172a)", 
              borderColor: "var(--principal-card-border, rgba(255, 255, 255, 0.08))" 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`mx-auto w-12 h-12 mb-4 rounded-full flex items-center justify-center ${modalType === 'error' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              {modalType === 'error' ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {modalType === 'error' ? 'Authentication Alert' : 'Success'}
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {modalMessage}
            </p>
            <button
              type="button"
              onClick={() => setModalMessage(null)}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
              style={{
                background: modalType === 'error' 
                  ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' 
                  : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                boxShadow: modalType === 'error'
                  ? '0 4px 12px rgba(239, 68, 68, 0.2)'
                  : '0 4px 12px rgba(16, 185, 129, 0.2)'
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
