"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  CheckSquare,
  UserX,
  AlertTriangle
} from "lucide-react";
import "./attendance.css";

// Dummy attendance data for HOD view
const initialAttendanceData = [
  {
    id: "STU-2024-001",
    name: "Alex Morgan",
    year: "3rd Year",
    section: "A",
    subject: "Data Structures",
    date: "2026-07-22",
    status: "Present",
    timeIn: "09:02 AM",
  },
  {
    id: "STU-2024-002",
    name: "Sophia Chen",
    year: "4th Year",
    section: "A",
    subject: "Cloud Computing",
    date: "2026-07-22",
    status: "Present",
    timeIn: "08:55 AM",
  },
  {
    id: "STU-2024-003",
    name: "Marcus Johnson",
    year: "2nd Year",
    section: "B",
    subject: "Database Systems",
    date: "2026-07-22",
    status: "Absent",
    timeIn: "--",
  },
  {
    id: "STU-2024-004",
    name: "Emma Watson",
    year: "3rd Year",
    section: "A",
    subject: "Data Structures",
    date: "2026-07-22",
    status: "Late",
    timeIn: "09:25 AM",
  },
  {
    id: "STU-2024-005",
    name: "David Kim",
    year: "1st Year",
    section: "C",
    subject: "Mathematics I",
    date: "2026-07-22",
    status: "Absent",
    timeIn: "--",
  },
  {
    id: "STU-2024-006",
    name: "Olivia Martinez",
    year: "4th Year",
    section: "B",
    subject: "Software Engineering",
    date: "2026-07-22",
    status: "Present",
    timeIn: "08:58 AM",
  },
];

export default function HodAttendancePage() {
  const [attendance, setAttendance] = useState(initialAttendanceData);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedDate, setSelectedDate] = useState("2026-07-22");

  const filteredAttendance = attendance.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.subject.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
    const matchesYear = selectedYear === "All" || item.year === selectedYear;

    return matchesSearch && matchesStatus && matchesYear;
  });

  const totalCount = attendance.length;
  const presentCount = attendance.filter((i) => i.status === "Present").length;
  const absentCount = attendance.filter((i) => i.status === "Absent").length;
  const lateCount = attendance.filter((i) => i.status === "Late").length;

  return (
    <div className="attendance-container">
      {/* Breadcrumb */}
      <div className="attendance-breadcrumb">
        <Link href="/hod/dashboard">
          <Home size={16} />
          <span style={{ marginLeft: "0.25rem" }}>Dashboard</span>
        </Link>
        <ChevronRight size={16} className="separator" />
        <span className="current">Attendance</span>
      </div>

      {/* Page Header */}
      <div className="attendance-header">
        <div className="attendance-title-box">
          <h1>
            <CalendarIcon className="text-blue-600" size={32} />
            Department Attendance
          </h1>
          <p>
            Monitor and track real-time daily attendance records for department students.
          </p>
        </div>

        <div className="attendance-header-actions">
          <button className="btn-secondary">
            <Download size={18} />
            Export Attendance Report
          </button>
        </div>
      </div>


      {/* Overview Statistics Cards */}
      <div className="attendance-stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Scheduled</h3>
            <div className="value">{totalCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckSquare size={24} />
          </div>
          <div className="stat-info">
            <h3>Present Today</h3>
            <div className="value">{presentCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <UserX size={24} />
          </div>
          <div className="stat-info">
            <h3>Absent Today</h3>
            <div className="value">{absentCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>Late Arrivals</h3>
            <div className="value">{lateCount}</div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="attendance-controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search student, ID, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#64748b", fontSize: "0.875rem" }}>
            <Filter size={16} />
            <span>Filters:</span>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="select-input"
          >
            <option value="All">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="select-input"
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="table-card">
        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Year & Section</th>
                <th>Subject / Lecture</th>
                <th>Check-in Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="student-info-cell">
                        <div className="avatar-circle">
                          {row.name.charAt(0)}
                        </div>
                        <div>
                          <div className="student-name">{row.name}</div>
                          <div className="student-id">{row.id}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 500, color: "#1e293b" }}>{row.year}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Sec {row.section}</div>
                    </td>

                    <td style={{ fontWeight: 500 }}>{row.subject}</td>

                    <td>{row.timeIn}</td>

                    <td>
                      {row.status === "Present" && (
                        <span className="status-badge present">
                          <CheckCircle size={12} />
                          Present
                        </span>
                      )}
                      {row.status === "Absent" && (
                        <span className="status-badge absent">
                          <XCircle size={12} />
                          Absent
                        </span>
                      )}
                      {row.status === "Late" && (
                        <span className="status-badge late">
                          <Clock size={12} />
                          Late
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                    No attendance records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Showing {filteredAttendance.length} of {attendance.length} records</span>
          <span>HOD Attendance Tracking Module</span>
        </div>
      </div>
    </div>
  );
}
