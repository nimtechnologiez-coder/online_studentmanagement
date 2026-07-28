"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ShieldAlert, CheckCircle2 } from "lucide-react";
import "./login.css";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your academic email or username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/student/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        localStorage.setItem("student", JSON.stringify(data.student));
        sessionStorage.setItem("student", JSON.stringify(data.student));
        router.push("/Student/dashboard");
      } else {
        setError(data.message || "Invalid academic login credentials.");
      }
    } catch (err) {
      console.error("Student login error:", err);
      setError("Unable to connect to login server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Left panel: Info banner (hidden on smaller screen widths) */}
      <div className="login-banner-panel">
        <div className="banner-decorations" />
        
        <div className="banner-brand-logo">
          <div className="logo-badge-lg">🎓</div>
          <h2>Student Portal</h2>
        </div>

        <div className="banner-center-content">
          <h1>Accelerate Your Learning Path Today</h1>
          <p>
            Stream video lectures, complete structured modules, track progress indicators, and connect with faculty instructors seamlessly.
          </p>
        </div>

        <div className="banner-footer-text">
          © 2026 Student Enterprise Management Portal. All rights reserved.
        </div>
      </div>

      {/* Right panel: Form Card */}
      <div className="login-form-panel">
        <div className="login-form-card">
          <div className="card-header-box">
            <h2>Welcome Back</h2>
            <p>Login to resume your personalized learning modules</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 text-xs font-semibold p-3 rounded-lg mb-4 flex items-center gap-2">
              <ShieldAlert size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="form-group-item">
              <label className="form-label" htmlFor="email-input">
                Academic Email Address or Username
              </label>
              <div className="input-with-icon-wrapper">
                <Mail size={16} className="input-icon-left" />
                <input
                  id="email-input"
                  type="text"
                  placeholder="e.g. STU11 or student@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-field-input"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group-item">
              <label className="form-label" htmlFor="password-input">
                Secure Password
              </label>
              <div className="input-with-icon-wrapper">
                <Lock size={16} className="input-icon-left" />
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-field-input"
                  required
                />
                <button
                  type="button"
                  className="input-toggle-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Form Actions Row */}
            <div className="form-actions-row">
              <label className="remember-me-checkbox">
                <input type="checkbox" className="checkbox-control" />
                <span>Keep me signed in</span>
              </label>

              <Link href="#" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="submit-login-btn"
            >
              {loading ? "Authenticating..." : "Sign In to Portal"}
            </button>
          </form>

          {/* Switch Portal Link */}
          <div className="login-footer-info">
            Are you a department head?{" "}
            <Link href="/hod/login" className="portal-switch-link">
              HOD Login Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
