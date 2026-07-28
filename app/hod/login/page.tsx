"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
import "./loginpage.css";

export default function LoginPage() {
  // State for form inputs
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  // Handle form submission
const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/hod/login/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      }
    );

    const data = await response.json();

    console.log("HOD Login Response:", data);

    if (response.ok && data.success) {
      // Save HOD Details
      localStorage.setItem("hod", JSON.stringify(data.user));

      alert(data.message);

      // Redirect to HOD Dashboard
      window.location.href = "/hod/dashboard";
    } else {
      alert(data.message || "Invalid Username or Password");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Unable to connect to the server.");
  } finally {
    setIsLoading(false);
  }
};
 
 return (
    <div className="login-page">
      {/* Left Side: Branding/Visual */}
      <div className="login-visual">
        <div className="visual-content">
          <div className="brand-logo">EduFlow</div>
          <h1>Empowering the next generation of leaders.</h1>
          <p>
            Access your institutional dashboard to manage academic growth,
            track performance, and lead your department with data-driven insights.
          </p>
          <div className="visual-footer">
            <span>© 2024 EduFlow Institutional Portal</span>
          </div>
        </div>
        <div className="abstract-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="login-form-container">
        <div className="form-box">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {/* Username Field */}
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="input-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  Sign In <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>Not an administrator? <a href="#">Contact IT Support</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
