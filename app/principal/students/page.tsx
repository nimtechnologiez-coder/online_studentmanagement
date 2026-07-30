"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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
  Download,
  Filter,
  CheckCircle2,
  Trash2,
  Lock,
  Copy,
  Check,
  Building2,
  Award,
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
  college?: string;
  joinDate?: string;
}

/* ---------------------------------- CONSTANTS ---------------------------------- */

const ALL_DEPTS = "All Departments";
const ALL_STATUS = "All Status";
const ALL_PERF = "All Performance Tiers";
const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

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
  let colorClass = "fill-indigo";
  if (value >= 75) colorClass = "fill-emerald";
  else if (value >= 35) colorClass = "fill-amber";

  return (
    <div className="mini-progress">
      <div className="mini-progress-track">
        <div className={`mini-progress-fill ${colorClass}`} style={{ width: `${value}%` }} />
      </div>
      <span className="progress-percent-text">{value}%</span>
    </div>
  );
}

function initials(name: string): string {
  if (!name) return "ST";
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
  const [copied, setCopied] = useState(false);
  const display = visible ? password : "•".repeat(Math.min(password.length || 8, 10));

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="password-cell">
      <span className="password-text">{display}</span>
      <div className="password-actions">
        <button
          type="button"
          className="password-toggle-btn"
          onClick={() => setVisible((v) => !v)}
          title={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        <button
          type="button"
          className="password-toggle-btn"
          onClick={handleCopy}
          title="Copy password"
        >
          {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- MODAL -------------------------------- */

function CompletionRing({ value }: { value: number }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="completion-ring">
      <svg width="78" height="78" viewBox="0 0 78 78">
        <circle cx="39" cy="39" r={radius} className="ring-track" strokeWidth="7" fill="none" />
        <circle
          cx="39"
          cy="39"
          r={radius}
          className="ring-progress"
          strokeWidth="7"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 39 39)"
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
          <div>
            <h3 id="student-report-title">Student Academic Report</h3>
            <p className="modal-subtitle">Learning progress breakdown and history</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
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
                  <Mail size={12} />
                  {student.email}
                </span>
                <span className="modal-meta-item">
                  <Clock size={12} />
                  Last active: {student.lastLogin}
                </span>
              </div>
              <div className="modal-meta-row" style={{ marginTop: "4px" }}>
                <span className="modal-meta-item">
                  <User size={12} />
                  ID: {student.username}
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
                <span className="modal-stat-label">Assigned Videos</span>
              </div>
              <div className="modal-stat">
                <span className="modal-stat-value">{student.viewedVideos}</span>
                <span className="modal-stat-label">Viewed Courses</span>
              </div>
              <div className="modal-stat modal-stat-wide">
                <span className="modal-stat-value">{student.totalViews}</span>
                <span className="modal-stat-label">Total Watch Views</span>
              </div>
            </div>
          </div>

          <hr className="modal-divider" />

          <div className="modal-section">
            <h4>
              <PlayCircle size={15} />
              Recent Watched Videos
            </h4>
            {student.recentVideos && student.recentVideos.length > 0 ? (
              <ul className="modal-list">
                {student.recentVideos.map((title) => (
                  <li key={title}>
                    <PlayCircle size={13} className="modal-list-icon" />
                    <span>{title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="modal-empty">No video watch records available yet.</p>
            )}
          </div>

          <hr className="modal-divider" />

          <div className="modal-section">
            <h4>
              <Activity size={15} />
              Activity Log & Timeline
            </h4>
            {student.recentActivity && student.recentActivity.length > 0 ? (
              <ul className="modal-timeline">
                {student.recentActivity.map((activity, idx) => (
                  <li key={`${activity}-${idx}`}>
                    <span className="timeline-dot" />
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="modal-empty">No recent activity recorded.</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-btn-secondary" onClick={onClose}>
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- MAIN COMPONENT -------------------------------- */

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [department, setDepartment] = useState<string>(ALL_DEPTS);
  const [status, setStatus] = useState<string>(ALL_STATUS);
  const [perfTier, setPerfTier] = useState<string>(ALL_PERF);
  const [query, setQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
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
        const savedPrincipal =
          typeof window !== "undefined"
            ? localStorage.getItem("principal") || sessionStorage.getItem("principal")
            : null;
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

      const apiBase = typeof window !== "undefined" ? window.location.origin : "http://127.0.0.1:3001";
      const apiUrls = [
        "/api/principal/students/",
        `${apiBase}/api/principal/students/`,
        "http://127.0.0.1:8000/api/principal/students/",
      ];

      let response: Response | null = null;
      let lastError: Error | null = null;

      for (const url of apiUrls) {
        try {
          response = await fetch(url, { headers, credentials: "include" });
          if (response.ok) break;
          lastError = new Error(`Server error: ${response.status}`);
        } catch (fetchErr: any) {
          lastError = fetchErr;
        }
      }

      if (!response || !response.ok) {
        throw new Error(lastError?.message || "Failed to load students.");
      }
      const json = await response.json();

      if (json.status === "success" && Array.isArray(json.data)) {
        const mapped: Student[] = json.data.map((s: any) => ({
          id: s.student_id || String(s.id),
          name: s.full_name || "Unknown",
          department: s.department || "N/A",
          email: s.email || "N/A",
          username: s.username || s.student_id || "N/A",
          password: s.password || "N/A",
          college: s.college || json.college || "N/A",
          joinDate: s.join_date || "2026-07-21",
          viewedVideos: s.viewedVideos ?? 0,
          totalVideos: s.totalVideos ?? 0,
          totalViews: s.totalViews ?? 0,
          progress: s.progress ?? 0,
          status: s.status
            ? ((s.status.charAt(0).toUpperCase() + s.status.slice(1).toLowerCase()) as StudentStatus)
            : "Active",
          lastLogin: s.lastLogin || "Recently",
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
        const saved =
          typeof window !== "undefined"
            ? localStorage.getItem("principal") || sessionStorage.getItem("principal")
            : null;
        if (saved) principalId = JSON.parse(saved)?.id || "";
      } catch { }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (principalId) headers["X-Principal-Id"] = String(principalId);

      const apiBase = typeof window !== "undefined" ? window.location.origin : "http://127.0.0.1:3001";
      let res: Response;
      try {
        res = await fetch(`/api/principal/students/${deleteStudentId}/delete/`, {
          method: "POST",
          headers,
          credentials: "include",
        });
      } catch {
        res = await fetch(`http://127.0.0.1:8000/api/principal/students/${deleteStudentId}/delete/`, {
          method: "POST",
          headers,
          credentials: "include",
        });
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

  // Dynamic department options from actual data
  const departments = useMemo(() => {
    const depts = Array.from(new Set(students.map((s) => s.department).filter(Boolean)));
    depts.sort();
    return [ALL_DEPTS, ...depts];
  }, [students]);

  // CSV Export feature
  const exportToCSV = () => {
    if (students.length === 0) return;
    const headers = [
      "Student ID",
      "Full Name",
      "Department",
      "Email",
      "Username",
      "Viewed Videos",
      "Total Views",
      "Progress (%)",
      "Status",
    ];

    const rows = filteredStudents.map((s) => [
      s.id,
      `"${s.name}"`,
      `"${s.department}"`,
      `"${s.email}"`,
      `"${s.username}"`,
      s.viewedVideos,
      s.totalViews,
      s.progress,
      s.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student_performance_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats computation
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "Active").length;
  const inactiveStudents = students.filter((s) => s.status === "Inactive").length;
  const totalDepts = departments.length - 1;

  // Aggregate watch hours: each view ≈ estimated 8 min avg session, expressed in hours
  const totalWatchViews = students.reduce((sum, s) => sum + (s.totalViews || 0), 0);
  const totalWatchHours = parseFloat((totalWatchViews * 8 / 60).toFixed(1));

  // Engagement rate: students who have viewed at least 1 video / total students
  const engagedStudents = students.filter((s) => (s.viewedVideos || 0) > 0).length;
  const engagementRate = totalStudents > 0 ? Math.round((engagedStudents / totalStudents) * 100) : 0;

  // Filtered dataset
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesDept = department === ALL_DEPTS || student.department === department;
      const matchesStatus = status === ALL_STATUS || student.status === status;

      let matchesPerf = true;
      if (perfTier === "High Performance (>75%)") {
        matchesPerf = student.progress >= 75;
      } else if (perfTier === "Moderate (25-75%)") {
        matchesPerf = student.progress >= 25 && student.progress < 75;
      } else if (perfTier === "Needs Support (<25%)") {
        matchesPerf = student.progress < 25;
      }

      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        student.username.toLowerCase().includes(q) ||
        student.department.toLowerCase().includes(q);

      return matchesDept && matchesStatus && matchesPerf && matchesQuery;
    });
  }, [students, department, status, perfTier, query]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [department, status, perfTier, query, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const rangeStart = filteredStudents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, filteredStudents.length);

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
    <div className="dash-corp-main">
      {/* Sticky Header */}
      <header className="dash-corp-header">
        <div className="dash-header-brand">
          <div className="dash-corp-logo">CP</div>
          <div>
            <h1 className="dash-header-title">Student Management</h1>
            <span className="dash-header-subtitle">Institutional Academic Records & Activity</span>
          </div>
        </div>

        <div className="dash-search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by student name, email, or username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear-btn" onClick={() => setQuery("")}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="dash-header-actions">
          <button
            type="button"
            className="dash-action-btn"
            onClick={fetchStudents}
            title="Refresh Students List"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="btn-text">Sync</span>
          </button>

          <button type="button" className="dash-action-btn btn-export" onClick={exportToCSV}>
            <Download size={16} />
            <span className="btn-text">Export CSV</span>
          </button>

          <div className="dash-profile-wrapper">
            <div className="dash-profile-trigger">
              <div className="dash-profile-avatar">
                <User size={16} />
              </div>
              <span className="profile-name">Principal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dash-corp-body">
        {/* Title Header */}
        <div className="dash-page-title-row">
          <div>
            <h2>Institutional Student Records</h2>
            <p>Monitor student progress, video watch metrics, and academic engagement.</p>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="dash-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
            <button onClick={fetchStudents}>Retry</button>
          </div>
        )}

        {loading && !students.length ? (
          <div className="dash-loading-state">
            <RefreshCw size={32} className="animate-spin text-indigo-600" />
            <p>Fetching real-time student data...</p>
          </div>
        ) : (
          <>
            {/* KPI Summary Cards Grid */}
            <section className="summary-cards-grid">
              {/* Card 1: Total Students */}


              {/* Card 2: Active Students */}
              <div className="corp-card summary-card-corp">
                <div className="card-top-row">
                  <div className="summary-icon-box tone-emerald">
                    <Users size={20} />
                  </div>
                  <span className="card-trend-pill trend-up">
                    {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}%
                  </span>
                </div>
                <div className="card-bottom-row">
                  <span className="summary-card-value">{activeStudents}</span>
                  <span className="summary-card-label">Active Learning Students</span>
                </div>
              </div>

              {/* Card 3: Inactive Students */}
              <div className="corp-card summary-card-corp">
                <div className="card-top-row">
                  <div className="summary-icon-box tone-amber">
                    <AlertCircle size={20} />
                  </div>
                  <span className="card-trend-pill trend-neutral">Needs Attention</span>
                </div>
                <div className="card-bottom-row">
                  <span className="summary-card-value">{inactiveStudents}</span>
                  <span className="summary-card-label">Inactive Students</span>
                </div>
              </div>

              {/* Card 4: Active Departments */}
              <div className="corp-card summary-card-corp">
                <div className="card-top-row">
                  <div className="summary-icon-box tone-teal">
                    <Building2 size={20} />
                  </div>
                  <span className="card-trend-pill">Divisions</span>
                </div>
                <div className="card-bottom-row">
                  <span className="summary-card-value">{totalDepts}</span>
                  <span className="summary-card-label">Active Departments</span>
                </div>
              </div>

              {/* Card 5: Total Watch Hours */}
              <div className="corp-card summary-card-corp card-highlight-watch">
                <div className="card-top-row">
                  <div className="summary-icon-box tone-violet">
                    <Clock size={20} />
                  </div>
                  <span className="card-trend-pill trend-up">Learning Time</span>
                </div>
                <div className="card-bottom-row">
                  <span className="summary-card-value">
                    {totalWatchHours}
                    <span className="summary-card-unit">hrs</span>
                  </span>
                  <span className="summary-card-label">Total Watch Hours</span>
                  <span className="summary-card-sub">Aggregate learning duration across {totalWatchViews} session{totalWatchViews !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Card 6: Active Engagement Rate */}
              <div className="corp-card summary-card-corp card-highlight-engage">
                <div className="card-top-row">
                  <div className="summary-icon-box tone-rose">
                    <Activity size={20} />
                  </div>
                  <span className="card-trend-pill trend-up">Participation</span>
                </div>
                <div className="card-bottom-row">
                  <span className="summary-card-value">
                    {engagementRate}
                    <span className="summary-card-unit">%</span>
                  </span>
                  <span className="summary-card-label">Active Student Engagement</span>
                  <span className="summary-card-sub">{engagedStudents} of {totalStudents} students actively learning</span>
                </div>
              </div>
            </section>

            {/* Advanced Filters Toolbar */}
            <section className="filters-bar-corp">
              <div className="filter-select-group">
                <Filter size={15} className="text-slate-400" />
                <select
                  className="corp-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                <select
                  className="corp-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value={ALL_STATUS}>All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <select
                  className="corp-select"
                  value={perfTier}
                  onChange={(e) => setPerfTier(e.target.value)}
                >
                  <option value={ALL_PERF}>All Performance Tiers</option>
                  <option value="High Performance (>75%)">High Performance (&gt;75%)</option>
                  <option value="Moderate (25-75%)">Moderate (25-75%)</option>
                  <option value="Needs Support (<25%)">Needs Support (&lt;25%)</option>
                </select>
              </div>

              <div className="results-count">
                Showing <strong>{filteredStudents.length}</strong> student{filteredStudents.length !== 1 ? "s" : ""}
              </div>
            </section>

            {/* Students Data Table */}
            <section className="corp-card table-card-corp">
              <div className="corp-table-wrap">
                <table className="corp-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Department</th>
                      <th>Email</th>
                      <th>Username</th>
                      <th>Password</th>
                      <th style={{ textAlign: "center" }}>Viewed Videos</th>
                      <th style={{ textAlign: "center" }}>Total Views</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="empty-table-cell">
                          {students.length === 0
                            ? "No students found in the database."
                            : "No students match the selected filter criteria."}
                        </td>
                      </tr>
                    ) : (
                      paginatedStudents.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <div className="student-cell-profile">
                              <div className="avatar-circle">{initials(student.name)}</div>
                              <span className="font-semibold text-slate-800">{student.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="table-dept-pill">{student.department}</span>
                          </td>
                          <td className="text-slate-600 font-medium">{student.email}</td>
                          <td>
                            <code className="corp-code-badge">{student.username}</code>
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
                          <td style={{ textAlign: "right" }}>
                            <div className="table-actions">
                              <button
                                type="button"
                                className="action-btn-view"
                                onClick={() => setSelectedStudent(student)}
                              >
                                <Eye size={13} />
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

              {/* Polished Pagination Controls */}
              <div className="pagination-bar-corp">
                <div className="pagination-size-selector">
                  <span>Show per page:</span>
                  <select
                    className="corp-select size-select"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    {PAGE_SIZE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <span className="range-summary">
                    Showing {rangeStart}–{rangeEnd} of {filteredStudents.length}
                  </span>
                </div>

                <div className="pagination-nav">
                  <button
                    type="button"
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>

                  <div className="page-numbers">
                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`page-num-btn ${page === currentPage ? "active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Student Performance Modal */}
      {selectedStudent && (
        <StudentReportModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}

      {/* Delete Modal */}
      {deleteStudentId && (
        <div
          className="modal-backdrop"
          onClick={() => {
            if (!deleteLoading) {
              setDeleteStudentId(null);
              setDeleteStudentName("");
            }
          }}
        >
          <div className="modal-panel delete-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon-box">
              <Trash2 size={32} className="text-red-600" />
            </div>
            <h3 className="delete-title">Delete Student Record?</h3>
            <p className="delete-desc">
              Are you sure you want to delete student <strong>{deleteStudentName}</strong>? This action cannot be undone.
            </p>
            <div className="delete-actions">
              <button
                type="button"
                className="modal-btn-secondary"
                onClick={() => {
                  setDeleteStudentId(null);
                  setDeleteStudentName("");
                }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger-confirm"
                onClick={handleDeleteStudent}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}