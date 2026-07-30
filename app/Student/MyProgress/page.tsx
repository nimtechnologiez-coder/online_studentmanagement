"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Printer,
  Phone,
  Mail,
  GraduationCap,
  PlayCircle
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import "./myprogress.css";

const API_BASE = "http://127.0.0.1:8000";

function getStudentData() {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("student") || sessionStorage.getItem("student");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
}

// Sample fallback dataset matching screenshot visually
const defaultWeeklyWatchTime = [
  { day: "Mon", hours: 1.2 },
  { day: "Tue", hours: 2.5 },
  { day: "Wed", hours: 0.8 },
  { day: "Thu", hours: 3.0 },
  { day: "Fri", hours: 1.0 },
  { day: "Sat", hours: 0.5 },
  { day: "Sun", hours: 0.55 },
];

const defaultMonthlyTrend = [
  { month: "Dec", progress: 40 },
  { month: "Jan", progress: 55 },
  { month: "Feb", progress: 62 },
  { month: "Mar", progress: 60 },
  { month: "Apr", progress: 75 },
  { month: "May", progress: 82 },
];

export default function MyProgressPage() {
  const [student, setStudent] = useState<any>(null);
  const [weeklyWatchTime, setWeeklyWatchTime] = useState<any[]>(defaultWeeklyWatchTime);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>(defaultMonthlyTrend);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sData = getStudentData();
    if (sData) {
      setStudent(sData);
      fetchProgressData(sData.id);
    } else {
      fetchProgressData(0);
    }
  }, []);

  async function fetchProgressData(studentId: number) {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/student/progress/`, {
        headers: { "X-Student-Id": String(studentId) },
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.status === "success") {
          if (data.student) {
            setStudent((prev: any) => (prev ? { ...prev, ...data.student } : data.student));
          }
          if (data.weeklyWatchTime && data.weeklyWatchTime.length > 0) {
            setWeeklyWatchTime(data.weeklyWatchTime);
          }
          if (data.monthlyTrend && data.monthlyTrend.length > 0) {
            setMonthlyTrend(data.monthlyTrend);
          }
          if (data.recentVideos && data.recentVideos.length > 0) {
            setRecentVideos(data.recentVideos);
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch progress API:", e);
    } finally {
      setLoading(false);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  const studentName = student?.full_name || student?.username || "Student";
  const studentInitial = studentName.charAt(0).toUpperCase();
  const regNo = student?.register_number || student?.roll_number || student?.username || student?.student_id || "STU2023001";
  const departmentName = student?.department_name || student?.department?.dept_name || student?.department || "Artificial Intelligence and Data Science";
  const collegeName = student?.college_name || student?.college?.college_name || student?.college || "Green Valley Arts & Science College";
  const emailAddr = student?.email || "student@email.com";
  const mobileNo = student?.mobile && student.mobile !== "-" ? student.mobile : (student?.phone && student.phone !== "-" ? student.phone : "+91 98765 43210");
  const joinDateStr = student?.join_date && student.join_date !== "-" ? student.join_date : (student?.joinDate && student.joinDate !== "-" ? student.joinDate : "15 Aug 2023");
  const endDateStr = student?.end_date && student.end_date !== "-" ? student.end_date : (student?.endDate && student.endDate !== "-" ? student.endDate : "May 2026");
  const mentorName = student?.mentor_name && student.mentor_name !== "-" ? student.mentor_name : (student?.hod_name && student.hod_name !== "-" ? student.hod_name : "Dr. S. Harish");

  const displayWeeklyData = weeklyWatchTime.length > 0 ? weeklyWatchTime : defaultWeeklyWatchTime;
  const displayMonthlyData = monthlyTrend.length > 0 ? monthlyTrend : defaultMonthlyTrend;

  return (
    <div className="student-progress-layout">
      {/* 1. Header Toolbar */}
      <div className="sp-header-bar">
        <div>
          <Link href="/Student/dashboard" className="sp-back-link">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="sp-page-title">Student Progress Analytics</h1>
          <p className="sp-page-subtitle">
            Comprehensive learning performance and video watch report
          </p>
        </div>

        <div className="sp-action-btns">
          <button className="sp-btn sp-btn-secondary" onClick={handlePrint}>
            <Download size={15} />
            <span>Download Report</span>
          </button>
          <button className="sp-btn sp-btn-emerald" onClick={handlePrint}>
            <FileSpreadsheet size={15} />
            <span>Export Excel</span>
          </button>
          <button className="sp-btn sp-btn-secondary" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Profile Banner (Logged-in Student Data Only) */}
      <div className="sp-hero-card">
        <div className="sp-hero-left">
          <div className="sp-avatar-big">
            {studentInitial}
          </div>
          <div className="sp-hero-details">
            <div className="sp-name-row">
              <h2>{studentName}</h2>
              <span className="sp-status-badge">{student?.status ? student.status.toUpperCase() : "ACTIVE"}</span>
            </div>
            <p className="sp-roll-no">{regNo}</p>
            <div className="sp-dept-row">
              <span className="sp-meta-item">
                <GraduationCap size={15} /> {departmentName}
              </span>
            </div>
            <div className="sp-contact-row">
              <span className="sp-meta-item">
                <Mail size={14} /> {emailAddr}
              </span>
              {mobileNo !== "-" && (
                <span className="sp-meta-item">
                  <Phone size={14} /> {mobileNo}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="sp-hero-right">
          <div className="sp-info-grid">
            <div className="sp-info-col">
              <span className="sp-info-label">College</span>
              <span className="sp-info-colon">:</span>
              <span className="sp-info-val">{collegeName}</span>
            </div>
            <div className="sp-info-col">
              <span className="sp-info-label">Join Date</span>
              <span className="sp-info-colon">:</span>
              <span className="sp-info-val">{joinDateStr}</span>
            </div>
            <div className="sp-info-col">
              <span className="sp-info-label">Expected Completion</span>
              <span className="sp-info-colon">:</span>
              <span className="sp-info-val">{endDateStr}</span>
            </div>
            <div className="sp-info-col">
              <span className="sp-info-label">Mentor / HOD</span>
              <span className="sp-info-colon">:</span>
              <span className="sp-info-val">{mentorName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN GRID CONTAINER */}
      <div className="sp-main-grid-container">
        {/* Dual Charts Grid: Weekly Watch Time & Monthly Progress Trend */}
        <div className="sp-dual-charts-grid">
          <div className="sp-card">
            <div className="sp-card-header">
              <div>
                <h3 className="sp-card-title">Weekly Watch Time</h3>
                <p className="sp-card-subtitle">Daily video watch hours for current week</p>
              </div>
              <span className="sp-chart-tag">This Week</span>
            </div>
            <div className="sp-chart-body" style={{ minHeight: 210 }}>
              {mounted && (
                <ResponsiveContainer width="100%" height={210}>
                  <LineChart data={displayWeeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="h" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="sp-card">
            <div className="sp-card-header">
              <div>
                <h3 className="sp-card-title">Monthly Progress Trend</h3>
                <p className="sp-card-subtitle">Overall completion percentage over time</p>
              </div>
              <span className="sp-chart-tag">Last 6 Months</span>
            </div>
            <div className="sp-chart-body" style={{ minHeight: 210 }}>
              {mounted && (
                <ResponsiveContainer width="100%" height={210}>
                  <AreaChart data={displayMonthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="progress"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#trendGrad)"
                      dot={{ r: 3, fill: "#3b82f6" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Full-width Recent Video Activity Table Card */}
        <div className="sp-card sp-table-card">
          <div className="sp-card-header mb-3">
            <div>
              <h3 className="sp-card-title">Recent Video Activity</h3>
              <p className="sp-card-subtitle">Latest watched sessions and details</p>
            </div>
          </div>
          <div className="sp-table-wrap">
            {recentVideos.length > 0 ? (
              <table className="sp-table">
                <thead>
                  <tr>
                    <th>Video Title</th>
                    <th>Duration</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVideos.map((vid, i) => (
                    <tr key={vid.id || i}>
                      <td>
                        <div className="sp-video-cell">
                          <div className="sp-vid-thumb">
                            <PlayCircle size={16} />
                          </div>
                          <div>
                            <span className="sp-vid-title">{vid.title}</span>
                            <span className="sp-vid-sub">{vid.subtitle}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="sp-dur-text">{vid.duration}</span></td>
                      <td><span className="sp-date-text">{vid.date}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>
                No recent video activity found for this student.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


