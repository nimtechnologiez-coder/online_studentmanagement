"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Trash2 } from "lucide-react";
import {
  GraduationCap,
  Search,
  User,
  Eye,
  EyeOff,
  X,
  PlayCircle,
  Activity,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Users,
} from "lucide-react";
import "./StudentsPage.css";

/* ---------------------------------- TYPES ---------------------------------- */

type StudentStatus = "Active" | "Inactive";

interface Student {
  id: string;
  name: string;
  department: string;
  email: string;
  username: string;
  password: string;
  viewedVideos: number;
  totalVideos: number;
  totalViews: number;
  progress: number;
  status: StudentStatus;
  lastLogin: string;
  recentVideos: string[];
  recentActivity: string[];
}

/* ---------------------------------- CONSTANTS ---------------------------------- */

const ALL_DEPTS = "All Departments";
const ALL_STATUS = "All Status";
const statuses: Array<typeof ALL_STATUS | StudentStatus> = [ALL_STATUS, "Active", "Inactive"];
const PAGE_SIZE = 5;

/* --------------------------------- HELPERS --------------------------------- */

function StatusBadge({ status }: { status: StudentStatus }) {
  return (
    <span className={`status-badge ${status === "Active" ? "status-active" : "status-inactive"}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="mini-progress">
      <div className="mini-progress-track">
        <div className="mini-progress-fill" style={{ width: `${value}%` }} />
      </div>
      <span>{value}%</span>
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/* ------------------------------ PASSWORD CELL ------------------------------ */

function PasswordCell({ password }: { password: string }) {
  const [visible, setVisible] = useState(false);
  const display = visible ? password : "•".repeat(Math.min(password.length || 8, 10));

  return (
    <div className="password-cell">
      <span className="password-text">{display}</span>
      <button
        type="button"
        className="password-toggle-btn"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
      </button>
    </div>
  );
}

/* --------------------------------- MODAL -------------------------------- */

function CompletionRing({ value }: { value: number }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="completion-ring">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} className="ring-track" strokeWidth="7" fill="none" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          className="ring-progress"
          strokeWidth="7"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
      </svg>
      <div className="ring-label">
        <span className="ring-value">{value}%</span>
      </div>
    </div>
  );
}

function StudentReportModal({
  student,
  onClose,
}: {
  student: Student;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-report-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="student-report-title">Student Report</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-profile">
            <div className={`modal-avatar ${student.status === "Active" ? "avatar-active" : "avatar-inactive"}`}>
              {initials(student.name)}
            </div>
            <div className="modal-profile-text">
              <div className="modal-student-name">{student.name}</div>
              <div className="modal-student-dept">{student.department} Department</div>
              <div className="modal-meta-row">
                <span className="modal-meta-item">
                  <Mail size={12} strokeWidth={2} />
                  {student.email}
                </span>
                <span className="modal-meta-item">
                  <Clock size={12} strokeWidth={2} />
                  {student.lastLogin}
                </span>
              </div>
              <div className="modal-meta-row">
                <span className="modal-meta-item">
                  <User size={12} strokeWidth={2} />
                  {student.username}
                </span>
              </div>
            </div>
            <StatusBadge status={student.status} />
          </div>

          <div className="modal-highlight">
            <CompletionRing value={student.progress} />
            <div className="modal-stats-grid">
              <div className="modal-stat">
                <span className="modal-stat-value">{student.totalVideos}</span>
                <span className="modal-stat-label">Videos Available</span>
              </div>
              <div className="modal-stat">
                <span className="modal-stat-value">{student.viewedVideos}</span>
                <span className="modal-stat-label">Viewed Videos</span>
              </div>
              <div className="modal-stat modal-stat-wide">
                <span className="modal-stat-value">{student.totalViews}</span>
                <span className="modal-stat-label">Total Views</span>
              </div>
            </div>
          </div>

          <hr className="modal-divider" />

          <div className="modal-section">
            <h4>
              <PlayCircle size={15} strokeWidth={2} />
              Recent Videos
            </h4>
            {student.recentVideos.length > 0 ? (
              <ul className="modal-list">
                {student.recentVideos.map((title) => (
                  <li key={title}>
                    <PlayCircle size={13} strokeWidth={2} className="modal-list-icon" />
                    {title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="modal-empty">No videos watched yet.</p>
            )}
          </div>

          <hr className="modal-divider" />

          <div className="modal-section">
            <h4>
              <Activity size={15} strokeWidth={2} />
              Recent Activity
            </h4>
            {student.recentActivity.length > 0 ? (
              <ul className="modal-timeline">
                {student.recentActivity.map((activity, idx) => (
                  <li key={`${activity}-${idx}`}>
                    <span className="timeline-dot" />
                    {activity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="modal-empty">No recent activity.</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- COMPONENT -------------------------------- */

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [department, setDepartment] = useState<string>(ALL_DEPTS);
  const [status, setStatus] = useState<string>(ALL_STATUS);
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const [deleteStudentName, setDeleteStudentName] = useState<string>("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let principalId = "";
      try {
        const savedPrincipal = typeof window !== "undefined" ? (localStorage.getItem("principal") || sessionStorage.getItem("principal")) : null;
        if (savedPrincipal) {
          const parsed = JSON.parse(savedPrincipal);
          principalId = parsed?.id || "";
        }
      } catch (e) {
        console.error("Error reading saved principal:", e);
      }

      const headers: Record<string, string> = {};
      if (principalId) {
        headers["X-Principal-Id"] = String(principalId);
      }

      let response: Response;
      try {
        response = await fetch("/api/principal/students/", { headers, credentials: "include" });
      } catch (fetchErr) {
        response = await fetch("http://127.0.0.1:8000/api/principal/students/", { headers, credentials: "include" });
      }

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const json = await response.json();

      if (json.status === "success" && Array.isArray(json.data)) {
        // Map the backend fields to the frontend Student interface
        const mapped: Student[] = json.data.map((s: any) => ({
          id: s.student_id || String(s.id),
          name: s.full_name || "Unknown",
          department: s.department || "N/A",
          email: s.email || "N/A",
          username: s.username || s.student_id || "N/A",
          password: s.password || "N/A",
          college: s.college || json.college || "N/A",
          joinDate: s.join_date || "2026-07-21",
          endDate: s.end_date || "2030-07-21",
          viewedVideos: s.viewedVideos ?? 0,
          totalVideos: s.totalVideos ?? 0,
          totalViews: s.totalViews ?? 0,
          progress: s.progress ?? 0,
          status: s.status
            ? ((s.status.charAt(0).toUpperCase() + s.status.slice(1).toLowerCase()) as StudentStatus)
            : "Active",
          lastLogin: s.lastLogin || s.join_date || "Recently",
          recentVideos: s.recentVideos || [],
          recentActivity: s.recentActivity || [],
        }));
        setStudents(mapped);
      } else {
        throw new Error(json.message || "API error");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load students.");
      console.error("Students fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDeleteStudent = useCallback(async () => {
    if (!deleteStudentId) return;
    setDeleteLoading(true);
    try {
      let principalId = "";
      try {
        const saved = typeof window !== "undefined" ? (localStorage.getItem("principal") || sessionStorage.getItem("principal")) : null;
        if (saved) principalId = JSON.parse(saved)?.id || "";
      } catch {}

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (principalId) headers["X-Principal-Id"] = String(principalId);

      let res: Response;
      try {
        res = await fetch(`/api/principal/students/${deleteStudentId}/delete/`, { method: "POST", headers, credentials: "include" });
      } catch {
        res = await fetch(`http://127.0.0.1:8000/api/principal/students/${deleteStudentId}/delete/`, { method: "POST", headers, credentials: "include" });
      }

      const json = await res.json();
      if (json.status === "success") {
        setStudents((prev) => prev.filter((s) => s.id !== deleteStudentId));
        setDeleteStudentId(null);
        setDeleteStudentName("");
      } else {
        alert(json.message || "Failed to delete student.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Unable to delete student. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteStudentId]);

  // Build department list dynamically from actual student data
  const departments = useMemo(() => {
    const depts = Array.from(new Set(students.map((s) => s.department).filter(Boolean)));
    depts.sort();
    return [ALL_DEPTS, ...depts];
  }, [students]);

  // Derived summary stats from real data
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "Active").length;
  const inactiveStudents = students.filter((s) => s.status === "Inactive").length;

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesDept = department === ALL_DEPTS || student.department === department;
      const matchesStatus = status === ALL_STATUS || student.status === status;
      const matchesQuery =
        student.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        student.email.toLowerCase().includes(query.trim().toLowerCase()) ||
        student.username.toLowerCase().includes(query.trim().toLowerCase());
      return matchesDept && matchesStatus && matchesQuery;
    });
  }, [students, department, status, query]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [department, status, query]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [filteredStudents, currentPage]);

  const rangeStart = filteredStudents.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredStudents.length);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let p = start; p <= end; p += 1) pages.push(p);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="dash-main">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-left">
          <GraduationCap size={20} strokeWidth={1.8} className="dash-header-icon" />
          <span className="dash-header-title">Students</span>
        </div>

        <div className="dash-search">
          <Search size={17} strokeWidth={1.8} />
          <input
            type="text"
            placeholder="Search by name, email or username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="dash-header-right">
          <button
            type="button"
            className="dash-icon-btn"
            onClick={fetchStudents}
            aria-label="Refresh students"
            title="Refresh"
            disabled={loading}
          >
            <RefreshCw size={17} strokeWidth={1.8} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          </button>
          <div className="dash-profile">
            <div className="dash-avatar">
              <User size={18} strokeWidth={1.8} />
            </div>
            <span className="dash-profile-name">Principal</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="dash-content">
        <div className="dash-page-title">
          <h2>Student Management</h2>
          <p>Monitor students&apos; video learning activity.</p>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "12px 16px", marginBottom: "16px",
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: "8px", color: "#dc2626", fontSize: "13px"
          }}>
            <AlertCircle size={15} />
            {error}
            <button
              onClick={fetchStudents}
              style={{ marginLeft: "auto", fontSize: "12px", color: "#dc2626", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "#94a3b8" }}>
            <RefreshCw size={28} style={{ animation: "spin 1s linear infinite", marginBottom: "12px" }} />
            <p>Loading students data...</p>
          </div>
        ) : (
          <>
            {/* Summary cards — dynamically computed */}
            <section className="summary-grid">
              <div className="summary-card">
                <div className="summary-icon tone-indigo">
                  <GraduationCap size={20} strokeWidth={1.8} />
                </div>
                <div className="summary-body">
                  <span className="summary-value">{totalStudents}</span>
                  <span className="summary-label">Total Students</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon tone-emerald">
                  <Users size={20} strokeWidth={1.8} />
                </div>
                <div className="summary-body">
                  <span className="summary-value">{activeStudents}</span>
                  <span className="summary-label">Active Students</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon tone-amber">
                  <Eye size={20} strokeWidth={1.8} />
                </div>
                <div className="summary-body">
                  <span className="summary-value">{inactiveStudents}</span>
                  <span className="summary-label">Inactive Students</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon tone-teal">
                  <PlayCircle size={20} strokeWidth={1.8} />
                </div>
                <div className="summary-body">
                  <span className="summary-value">{departments.length - 1}</span>
                  <span className="summary-label">Departments</span>
                </div>
              </div>
            </section>

            {/* Filters */}
            <section className="filters-bar">
              <select
                className="filter-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                aria-label="Filter by department"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filter by status"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <div className="filter-search">
                <Search size={15} strokeWidth={1.8} />
                <input
                  type="text"
                  placeholder="Search by name, email..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </section>

            {/* Students table */}
            <section className="card table-card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Department</th>
                      <th>Email</th>
                      <th>Username</th>
                      <th>Password</th>
                      <th>Viewed Videos</th>
                      <th>Total Views</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right", paddingRight: "16px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.length === 0 ? (
                      <tr>
                        <td colSpan={10} style={{ textAlign: "center", padding: "40px 16px", color: "#94a3b8", fontSize: "13px" }}>
                          {students.length === 0
                            ? "No students found in the database."
                            : "No students match the current filters."}
                        </td>
                      </tr>
                    ) : (
                      paginatedStudents.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <div className="student-name-cell">
                              <div className="student-avatar">{initials(student.name)}</div>
                              <span className="student-name-text">{student.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="dept-badge">{student.department}</span>
                          </td>
                          <td className="email-text">{student.email}</td>
                          <td>
                            <code className="code-text">{student.username}</code>
                          </td>
                          <td>
                            <PasswordCell password={student.password} />
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 600 }}>{student.viewedVideos}</td>
                          <td style={{ textAlign: "center", fontWeight: 600 }}>{student.totalViews}</td>
                          <td>
                            <ProgressBar value={student.progress} />
                          </td>
                          <td>
                            <StatusBadge status={student.status} />
                          </td>
                          <td style={{ textAlign: "right", paddingRight: "16px" }}>
                            <div className="table-actions">
                              <button
                                type="button"
                                className="view-report-btn"
                                onClick={() => setSelectedStudent(student)}
                              >
                                <Eye size={13} strokeWidth={2} />
                                View Report
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination-row">
                <span className="pagination-summary">
                  {filteredStudents.length === 0
                    ? "No results"
                    : `Showing ${rangeStart}–${rangeEnd} of ${filteredStudents.length} student${filteredStudents.length !== 1 ? "s" : ""}`}
                </span>

                <div className="pagination-controls">
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={15} strokeWidth={2} />
                    Prev
                  </button>

                  <div className="pagination-pages">
                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`pagination-page ${page === currentPage ? "pagination-page-active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {selectedStudent && (
        <StudentReportModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}

      {/* Delete Confirmation Modal */}
      {deleteStudentId && (
        <div className="delete-modal-overlay" onClick={() => { if (!deleteLoading) { setDeleteStudentId(null); setDeleteStudentName(""); } }}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <Trash2 size={32} strokeWidth={1.5} />
            </div>
            <h3 className="delete-modal-title">Delete Student?</h3>
            <p className="delete-modal-desc">
              Are you sure you want to permanently delete <strong>{deleteStudentName}</strong>?{" "}
              This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-modal-cancel"
                onClick={() => { setDeleteStudentId(null); setDeleteStudentName(""); }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-modal-confirm"
                onClick={handleDeleteStudent}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}