"use client";

import { useState, useEffect } from "react";
import {
  BarChart2,
  CheckCircle,
  Clock,
  Award,
  Video,
  Download,
  Flame,
  Target,
  Trophy,
  Zap,
  Star,
  Loader2,
  AlertCircle
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "./myprogress.css";

const API_BASE = "http://127.0.0.1:8000";

function getStudentId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("student") || sessionStorage.getItem("student");
    if (saved) return String(JSON.parse(saved).id);
  } catch {}
  return null;
}

const achievements = [
  { id: 1, title: "Fast Learner", desc: "Completed 5 videos in one day", icon: Zap, color: "bg-amber-100 text-amber-600" },
  { id: 2, title: "Database Master", desc: "100% completion in SQL", icon: Trophy, color: "bg-emerald-100 text-emerald-600" },
  { id: 3, title: "7-Day Streak", desc: "Watched lectures 7 days in a row", icon: Flame, color: "bg-orange-100 text-orange-600" },
  { id: 4, title: "Top Scholar", desc: "Maintained >85% progress score", icon: Star, color: "bg-blue-100 text-blue-600" },
];

export default function MyProgressPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [subjectBreakdown, setSubjectBreakdown] = useState<any[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProgress();
  }, []);

  async function fetchProgress() {
    try {
      setLoading(true);
      setError("");
      const studentId = getStudentId();
      const res = await fetch(`${API_BASE}/api/student/progress/`, {
        headers: studentId ? { "X-Student-Id": studentId } : {},
      });
      const data = await res.json();
      if (data.status === "success") {
        setMetrics(data.metrics);
        setSubjectBreakdown(data.subjectBreakdown || []);
        setWeeklyActivity(data.weeklyActivity || []);
      } else {
        setError(data.message || "Failed to load progress data.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="progress-container space-y-6">
      {/* Header */}
      <div className="prog-header">
        <div className="prog-title-box">
          <h1>
            <BarChart2 className="text-blue-600" size={32} />
            My Learning Progress
          </h1>
          <p>Track your course completion rate, watch time statistics, and certificates.</p>
        </div>

        <button className="download-cert-btn" onClick={handlePrintReport}>
          <Download size={16} />
          Download Progress Report
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium">
          <AlertCircle size={18} className="flex-shrink-0" />
          {error}
          <button
            onClick={fetchProgress}
            className="ml-auto text-xs font-bold bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="text-sm font-medium">Analyzing your learning metrics...</span>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Top Streak Banner & Goal Card */}
          <div className="streak-goal-card">
            <div className="streak-box">
              <div className="streak-icon-circle">
                <Flame size={28} />
              </div>
              <div>
                <h3>7-Day Learning Streak 🔥</h3>
                <p>You're on a roll! Keep watching daily to maintain your streak.</p>
              </div>
            </div>

            <div className="weekly-goal-box">
              <div className="flex justify-between items-center text-sm font-semibold mb-1">
                <span className="flex items-center gap-1.5"><Target size={16} /> Weekly Goal</span>
                <span>{metrics?.watchHours || 0} / 20 Hours</span>
              </div>
              <div className="goal-track">
                <div
                  className="goal-fill"
                  style={{ width: `${Math.min(100, Math.round(((metrics?.watchHours || 0) / 20) * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Metric Stat Cards */}
          <div className="prog-stats-grid">
            <div className="prog-stat-card">
              <div className="prog-stat-icon blue">
                <Video size={22} />
              </div>
              <div className="prog-stat-info">
                <h4>Total Assigned</h4>
                <div className="value">{metrics?.totalAssigned || 0} Videos</div>
              </div>
            </div>

            <div className="prog-stat-card">
              <div className="prog-stat-icon green">
                <CheckCircle size={22} />
              </div>
              <div className="prog-stat-info">
                <h4>Completed</h4>
                <div className="value">
                  {metrics?.completedCount || 0} Videos ({metrics?.completionRate || 0}%)
                </div>
              </div>
            </div>

            <div className="prog-stat-card">
              <div className="prog-stat-icon amber">
                <Clock size={22} />
              </div>
              <div className="prog-stat-info">
                <h4>Total Watch Time</h4>
                <div className="value">{metrics?.watchHours || 0} Hours</div>
              </div>
            </div>

            <div className="prog-stat-card">
              <div className="prog-stat-icon purple">
                <Award size={22} />
              </div>
              <div className="prog-stat-info">
                <h4>Modules Mastered</h4>
                <div className="value">{metrics?.modulesMastered || 0} Categories</div>
              </div>
            </div>
          </div>

          {/* Recharts Analytics Section */}
          <div className="prog-charts-grid">
            {/* Watch Time Trend */}
            <div className="prog-chart-card">
              <h2>Daily Watch Time (Hours)</h2>
              <p>Hours spent watching educational modules this week</p>

              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="hours" name="Hours" stroke="#2563eb" fillOpacity={1} fill="url(#hoursGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Videos Completed Trend */}
            <div className="prog-chart-card">
              <h2>Videos Completed</h2>
              <p>Number of completed video modules per day</p>

              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="videos" name="Videos" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Two Column Layout: Subject Progress & Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject Wise Progress Breakdown (Spans 2 Columns) */}
            <div className="subject-progress-card lg:col-span-2">
              <h2>Subject Completion Breakdown</h2>

              {subjectBreakdown.length === 0 ? (
                <p className="text-xs text-slate-400 mt-2">No subject categories found.</p>
              ) : (
                <div className="space-y-4">
                  {subjectBreakdown.map((item) => (
                    <div key={item.subject} className="subject-item-row">
                      <div className="subject-row-header">
                        <span className="subject-title">{item.subject}</span>
                        <span className="subject-stats-text">
                          {item.completed} of {item.total} Modules ({item.percentage}%)
                        </span>
                      </div>
                      <div className="track-bg">
                        <div
                          className="track-fill"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.percentage === 100 ? "#10b981" : "#2563eb",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Achievements & Badges Panel */}
            <div className="achievements-card">
              <h2>Badges & Achievements 🏆</h2>
              <p className="text-xs text-slate-500 mb-4">Milestones unlocked during your learning</p>

              <div className="space-y-3">
                {achievements.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div key={badge.id} className="badge-item">
                      <div className={`badge-icon ${badge.color}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4>{badge.title}</h4>
                        <p>{badge.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
