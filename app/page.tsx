"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import "./PrincipalLogin.css";

export default function PrincipalLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter Username and Password");
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
        response = await fetch("http://127.0.0.1:8000/api/principal/login/", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username.trim(), password: password.trim() }),
        });
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Retry directly against Django server if Next.js proxy returned HTML error page
        response = await fetch("http://127.0.0.1:8000/api/principal/login/", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username.trim(), password: password.trim() }),
        });
      }

      const result = await response.json();

      console.log("Login Response:", result);

      if (response.ok && result.status === "success") {

        if (remember) {
          localStorage.setItem(
            "principal",
            JSON.stringify(result.data)
          );
        } else {
          sessionStorage.setItem(
            "principal",
            JSON.stringify(result.data)
          );
        }

        alert("Login Successful");

        // Redirect to Dashboard
        router.push("/principal/dashboard");

      } else {
        alert(result.message || "Invalid Username or Password");
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
            {/* Left Section */}
      <div className="left-section">
        <div className="left-overlay"></div>

        <div className="left-content">
          <div className="brand-mark">
            <span>OV</span>
          </div>

          <span className="eyebrow">
            Principal Portal
          </span>

          <h1>
            Online Video
            <br />
            Management System
          </h1>

          <p>
            Secure centralized access for principals to monitor students,
            departments, attendance, educational videos, analytics and reports.
          </p>

          <div className="left-footer">
            <div className="stat">
              <h3>256-bit</h3>
              <span>Encrypted Access</span>
            </div>

            <div className="divider"></div>

            <div className="stat">
              <h3>24 / 7</h3>
              <span>Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="login-card">

          <span className="login-tag">
            Secure Access
          </span>

          <h2>Principal Login</h2>

          <p className="subtitle">
            Welcome back! Login using your institution account.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="input-box">
              <label>Username</label>

              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="input-box">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Keep me signed in</span>
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          <div className="footer-note">
            Contact your administrator if you cannot access your account.
          </div>

        </div>
      </div>
    </div>
  );
}