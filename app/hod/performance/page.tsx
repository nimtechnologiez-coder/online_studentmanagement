"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import "./performance.css";

// Academic Term Performance Data
const monthlyPerformance = [
  { month: "Jan", avgGPA: 3.2, attendance: 88, passRate: 92 },
  { month: "Feb", avgGPA: 3.3, attendance: 90, passRate: 94 },
  { month: "Mar", avgGPA: 3.1, attendance: 85, passRate: 89 },
  { month: "Apr", avgGPA: 3.5, attendance: 93, passRate: 96 },
  { month: "May", avgGPA: 3.6, attendance: 95, passRate: 97 },
  { month: "Jun", avgGPA: 3.4, attendance: 91, passRate: 95 },
];

// Grade Distribution Data
const gradeDistribution = [
  { name: "Grade A (85-100%)", value: 140, color: "#10b981" },
  { name: "Grade B (70-84%)", value: 110, color: "#2563eb" },
  { name: "Grade C (55-69%)", value: 50, color: "#f59e0b" },
  { name: "Grade D/F (<55%)", value: 20, color: "#ef4444" },
];

// Subject Performance Breakdowns
const subjectPerformance = [
  { code: "CS-301", subject: "Data Structures & Algorithms", faculty: "Dr. Robert Vance", avgMarks: 84, passRate: 96 },
  { code: "CS-302", subject: "Database Management Systems", faculty: "Prof. Sarah Connor", avgMarks: 78, passRate: 91 },
  { code: "CS-303", subject: "Operating Systems", faculty: "Dr. Alan Turing", avgMarks: 72, passRate: 85 },
  { code: "CS-304", subject: "Computer Networks", faculty: "Prof. Grace Hopper", avgMarks: 88, passRate: 98 },
  { code: "CS-305", subject: "Software Engineering", faculty: "Dr. James Gosling", avgMarks: 81, passRate: 93 },
];

export default function HodPerformancePage() {
  const [selectedSemester, setSelectedSemester] = useState("Fall 2026");

  return (
    <div className="performance-container">
      {/* Breadcrumb */}
      <div className="performance-breadcrumb">
        <Link href="/hod/dashboard">
          <Home size={16} />
          <span style={{ marginLeft: "0.25rem" }}>Dashboard</span>
        </Link>
        <ChevronRight size={16} className="separator" />
        <span className="current">Performance Analytics</span>
      </div>

      {/* Page Header */}
      <div className="performance-header">
        <div className="performance-title-box">
          <h1>
            <TrendingUp className="text-blue-600" size={32} />
            Academic Performance Analytics
          </h1>
          <p>
            Track student academic trends, grade distributions, and subject-wise metrics.
          </p>
        </div>

        <div className="performance-actions">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm outline-none shadow-sm"
          >
            <option value="Fall 2026">Fall Semester 2026</option>
            <option value="Spring 2026">Spring Semester 2026</option>
            <option value="Fall 2025">Fall Semester 2025</option>
          </select>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition">
            <Download size={16} />
            Export Analytics Report
          </button>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Department Avg. GPA</span>
            <div className="metric-icon blue">
              <Award size={20} />
            </div>
          </div>
          <div className="metric-value">3.48 / 4.0</div>
          <div className="metric-badge positive">
            <ArrowUpRight size={14} />
            +0.12 from last semester
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Overall Pass Rate</span>
            <div className="metric-icon green">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="metric-value">94.2%</div>
          <div className="metric-badge positive">
            <ArrowUpRight size={14} />
            +2.5% improvement
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Active Subjects</span>
            <div className="metric-icon purple">
              <BookOpen size={20} />
            </div>
          </div>
          <div className="metric-value">18 Courses</div>
          <div className="metric-badge positive">
            <span>5 Faculties Assigned</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Students Evaluated</span>
            <div className="metric-icon amber">
              <Users size={20} />
            </div>
          </div>
          <div className="metric-value">320</div>
          <div className="metric-badge positive">
            <span>100% Enrolled</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid two-cols">
        {/* GPA & Pass Rate Trend Area Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <h2>Monthly GPA & Pass Rate Trends</h2>
              <p>Performance trajectory across the current academic term</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="passGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="passRate" name="Pass Rate (%)" stroke="#10b981" fillOpacity={1} fill="url(#passGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="attendance" name="Attendance (%)" stroke="#2563eb" fillOpacity={1} fill="url(#gpaGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Breakdown Pie Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <h2>Student Grade Distribution</h2>
              <p>Breakdown of overall grade achievements</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subject Wise Performance Table */}
      <div className="performance-table-card">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Subject-wise Academic Analysis</h2>
          <p className="text-sm text-slate-500">Average marks and passing rates per subject</p>
        </div>

        <div className="overflow-x-auto">
          <table className="performance-table">
            <thead>
              <tr>
                <th>Subject Code & Name</th>
                <th>Assigned Faculty</th>
                <th>Average Marks</th>
                <th>Passing Rate</th>
                <th>Performance Indicator</th>
              </tr>
            </thead>
            <tbody>
              {subjectPerformance.map((row) => (
                <tr key={row.code}>
                  <td>
                    <div className="font-semibold text-slate-800">{row.subject}</div>
                    <div className="text-xs text-slate-400">{row.code}</div>
                  </td>
                  <td className="font-medium text-slate-700">{row.faculty}</td>
                  <td className="font-semibold text-slate-800">{row.avgMarks} / 100</td>
                  <td className="font-medium text-emerald-600">{row.passRate}%</td>
                  <td style={{ width: "200px" }}>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${row.passRate}%`, backgroundColor: row.passRate >= 90 ? "#10b981" : "#2563eb" }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
