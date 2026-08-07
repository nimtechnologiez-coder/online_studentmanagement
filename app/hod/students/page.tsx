"use client";

import { useState, useEffect, useMemo } from "react";
import "./students.css";

/* ─────────────────────────── Types ─────────────────────────── */

type Student = {
  id: number;
  name: string;
  username: string;
  password?: string;
  email: string;
  year: string;
  joinDate: string;
  status: "Active" | "Inactive";
  phone: string;
  section: string;
  completionRate: number;
  videosWatched: number;
};

/* ─────────────────────────── Constants ─────────────────────── */

const AVATAR_COLORS = [
  "#4f6cf7", "#22c55e", "#f97316", "#8b5cf6",
  "#06b6d4", "#ec4899", "#14b8a6", "#f59e0b",
];

const PAGE_SIZE = 10;

function avatarColor(id: number) {
  return AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];
}



/* ─────────────────────────── Component ─────────────────────── */

export default function HodStudentsPage() {
  const [search, setSearch] = useState("");
  const [yearFilter, setYear] = useState("All");
  const [statusFilter, setStat] = useState("All");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hodName, setHodName] = useState("HOD");
  const [deptName, setDeptName] = useState("Department");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);

    const savedHod = typeof window !== "undefined" ? localStorage.getItem("hod") || sessionStorage.getItem("hod") : null;
    let hodId = "";

    if (savedHod) {
      try {
        const parsed = JSON.parse(savedHod);
        hodId = parsed?.id || "";
        if (parsed?.name) setHodName(parsed.name);
        if (parsed?.department || parsed?.dept_name) setDeptName(parsed.department || parsed.dept_name);
      } catch (err) {
        console.error("Failed to parse saved HOD data:", err);
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (hodId) {
      headers["X-Hod-Id"] = String(hodId);
    }

    try {
      const response = await fetch(`${API_BASE}/api/hod/students/`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const text = await response.text();
      let json: any = null;

      try {
        json = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        throw new Error("The server returned an invalid response.");
      }

      if (json && json.status === "success" && Array.isArray(json.students)) {
        const studentData: Student[] = json.students.map((student: any) => ({
          id: student.id,
          name: student.name,
          username: student.username,
          password: student.password || "",
          email: student.email,
          year: student.year || "I",
          joinDate: student.joinDate || "N/A",
          status: (student.status || "").toLowerCase() === "active" ? "Active" : "Inactive",
          phone: student.phone || "N/A",
          section: "A",
          completionRate: student.completionRate || 0,
          videosWatched: student.videosWatched || 0,
        }));
        setStudents(studentData);
      } else {
        setStudents([]);
      }
    } catch (err: any) {
      console.error("Failed to load HOD students:", err);
      setError("Unable to connect to backend server.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ---- filtered list ---- */
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        s.name.toLowerCase().includes(q) ||
        s.username.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);
      const matchYear = yearFilter === "All" || s.year === yearFilter;
      const matchStatus = statusFilter === "All" || s.status === statusFilter;
      return matchSearch && matchYear && matchStatus;
    });
  }, [students, search, yearFilter, statusFilter]);

  /* ---- pagination ---- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageSlice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  /* ---- stats ---- */
  const totalActive = students.filter((s) => s.status === "Active").length;
  const totalInactive = students.filter((s) => s.status === "Inactive").length;

  return (
    <div className="stu-page">
      {/* ======== HEADER ======== */}
      <header className="stu-header">
        <div className="stu-header-left">
          <h1>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#4f6cf7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" stroke="#4f6cf7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#4f6cf7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Students
          </h1>
          <p>Manage students in your department</p>
        </div>
        <div className="stu-header-right">
          <div className="stu-profile">
            <div className="stu-avatar">
              {(() => {
                const parts = hodName.replace(/^Dr\.\s*/i, '').trim().split(" ").filter(Boolean);
                if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                return (hodName[0] || "H").toUpperCase();
              })()}
            </div>
            <div>
              <span className="stu-profile-name">{hodName}</span>
              <span className="stu-profile-role">HOD — {deptName}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="stu-main">
        {/* ======== STAT CARDS ======== */}
        <section className="stu-stats">
         <StatCard
            icon={<UsersIcon color="#4f6cf7" />}
            color="blue"
            label="Total Students"
            value={students.length}
            sub="All Years"
          />
          <StatCard
            icon={<CheckIcon color="#22c55e" />}
            color="green"
            label="Active Students"
            value={totalActive}
            sub={students.length > 0 ? `${((totalActive / students.length) * 100).toFixed(1)}% of total` : "0% of total"}
          />
          <StatCard
            icon={<CloseIcon color="#f97316" />}
            color="orange"
            label="Inactive Students"
            value={totalInactive}
            sub="Low engagement"
          />
        </section>

        {/* ======== TOOLBAR (SCOPED UNIQUE UI) ======== */}
        <div className="stu-toolbar light-student-table-toolbar">
          <div className="stu-search-wrap light-student-table-search-wrap">
            <span className="stu-search-icon light-student-table-search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#6b7280" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              className="stu-search-input light-student-table-search-input"
              type="text"
              placeholder="Search name, username, email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <select
            className="stu-select light-student-table-select"
            value={yearFilter}
            onChange={(e) => { setYear(e.target.value); setPage(1); }}
          >
            <option value="All">All Years</option>
            <option value="I">I Year</option>
            <option value="II">II Year</option>
            <option value="III">III Year</option>
            <option value="IV">IV Year</option>
          </select>

          <select
            className="stu-select light-student-table-select"
            value={statusFilter}
            onChange={(e) => { setStat(e.target.value); setPage(1); }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* ======== TABLE CARD (SCOPED UNIQUE UI) ======== */}
        <div className="stu-table-card light-student-table-card">
          <div className="stu-table-scroll light-student-table-scroll">
            <table className="stu-table light-student-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Email</th>
                  <th>Year</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th className="stu-th-center">Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                <tr>
                  <td colSpan={9} className="stu-empty light-student-table-empty-cell">
                    Loading students...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="stu-empty light-student-table-empty-cell">
                    {error}
                  </td>
                </tr>
              ) : pageSlice.length > 0 ? (
                  pageSlice.map((s, idx) => (
                    <tr key={s.id} className="light-student-table-row">
                      <td className="stu-td-num">{(safePage - 1) * PAGE_SIZE + idx + 1}</td>

                      {/* Name */}
                      <td>
                        <div className="stu-name-cell">
                          <div
                            className="stu-avatar-sm"
                            style={{ background: avatarColor(s.id) }}
                          >
                            {s.name.charAt(0)}
                          </div>
                          <span className="stu-name-text">{s.name}</span>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="stu-td-strong">{s.username}</td>

                      {/* Password */}
                     <td>
  <span className="stu-password">
    {s.password || "—"}
  </span>
</td>

                      {/* Email */}
                      <td className="stu-td-strong">{s.email}</td>

                      {/* Year */}
                      <td>
                        <span className="stu-year-badge">{s.year}</span>
                      </td>

                      {/* Join Date */}
                      <td className="stu-td-strong">{s.joinDate}</td>

                      {/* Status */}
                      <td>
                        <StatusBadge status={s.status} />
                      </td>

                      {/* View */}
                      <td className="stu-td-center">
                        <button className="stu-view-btn" onClick={() => setModal(s)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="#4f6cf7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="3" stroke="#4f6cf7" strokeWidth="2" />
                          </svg>
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="stu-empty light-student-table-empty-cell">
                      <div className="light-student-table-empty">
                        <div className="light-student-table-empty-icon">👨‍🎓</div>
                        <div className="light-student-table-empty-title">No Students Available</div>
                        <div className="light-student-table-empty-sub">No students match your current search or filters.</div>
                        <div className="light-student-table-empty-hint">Try changing the filters or add new students.</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ---- Pagination footer ---- */}
          <div className="stu-footer light-student-table-footer">
            <span className="stu-showing light-student-table-showing">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} students
            </span>
            <div className="stu-pagination light-student-table-pagination">
              <button
                className="stu-page-btn stu-page-btn--nav light-student-table-page-btn"
                onClick={() => goPage(safePage - 1)}
                disabled={safePage === 1}
                aria-label="Previous page"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                </svg>
                Prev
              </button>

              <div className="stu-page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                  .reduce<(number | "…")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span key={`dots-${i}`} className="stu-page-dots">…</span>
                    ) : (
                      <button
                        key={p}
                        className={`stu-page-btn ${safePage === p ? "stu-page-btn--active" : ""} light-student-table-page-btn`}
                        onClick={() => goPage(p as number)}
                        aria-current={safePage === p ? "page" : undefined}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <button
                className="stu-page-btn stu-page-btn--nav light-student-table-page-btn"
                onClick={() => goPage(safePage + 1)}
                disabled={safePage === totalPages}
                aria-label="Next page"
              >
                Next
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ======== MODAL ======== */}
      {modal && (
        <div className="stu-overlay" onClick={() => setModal(null)}>
          <div className="stu-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="stu-modal-header">
              <div
                className="stu-modal-avatar"
                style={{ background: avatarColor(modal.id) }}
              >
                {modal.name.charAt(0)}
              </div>
              <div className="stu-modal-title">
                <div className="stu-modal-name">{modal.name}</div>
                <div className="stu-modal-id">
                  @{modal.username} &nbsp;·&nbsp; {modal.year} Year &nbsp;·&nbsp; Section {modal.section}
                </div>
              </div>
              <button className="stu-modal-close" onClick={() => setModal(null)} aria-label="Close">
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="stu-modal-body">
              {/* Login credentials */}
              <div className="stu-modal-section">
                <div className="stu-modal-section-title">🔐 Login Credentials</div>
                <div className="stu-modal-fields">
                  <div className="stu-modal-field">
                    <span className="stu-modal-field-label">Username</span>
                    <div className="stu-modal-field-val">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="#6b7280" strokeWidth="2" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {modal.username}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal info */}
              <div className="stu-modal-section">
                <div className="stu-modal-section-title">👤 Personal Details</div>
                <div className="stu-modal-fields">
                  <div className="stu-modal-field stu-modal-field-full">
                    <span className="stu-modal-field-label">Full Name</span>
                    <div className="stu-modal-field-val">{modal.name}</div>
                  </div>
                  <div className="stu-modal-field stu-modal-field-full">
                    <span className="stu-modal-field-label">Email</span>
                    <div className="stu-modal-field-val">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="4" width="20" height="16" rx="2" stroke="#6b7280" strokeWidth="2" />
                        <path d="M2 8l10 7 10-7" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {modal.email}
                    </div>
                  </div>
                  <div className="stu-modal-field">
                    <span className="stu-modal-field-label">Phone</span>
                    <div className="stu-modal-field-val">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2A19.8 19.8 0 013.09 4.18 2 2 0 015.07 2h3a2 2 0 012 1.72c.13.96.36 1.9.69 2.81a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.81 6.81l1.27-1.27a2 2 0 012.11-.45c.91.33 1.85.56 2.81.69A2 2 0 0122 16.92z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {modal.phone}
                    </div>
                  </div>
                  <div className="stu-modal-field">
                    <span className="stu-modal-field-label">Join Date</span>
                    <div className="stu-modal-field-val">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="#6b7280" strokeWidth="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {modal.joinDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic info */}
              <div className="stu-modal-section">
                <div className="stu-modal-section-title">📚 Academic Info</div>
                <div className="stu-modal-fields">
                  <div className="stu-modal-field">
                    <span className="stu-modal-field-label">Year</span>
                    <div className="stu-modal-field-val">{modal.year} Year</div>
                  </div>
                  <div className="stu-modal-field">
                    <span className="stu-modal-field-label">Section</span>
                    <div className="stu-modal-field-val">Section {modal.section}</div>
                  </div>
                  <div className="stu-modal-field">
                    <span className="stu-modal-field-label">Status</span>
                    <div className="stu-modal-field-val">
                      <StatusBadge status={modal.status} />
                    </div>
                  </div>
                  <div className="stu-modal-field">
                    <span className="stu-modal-field-label">Videos Watched</span>
                    <div className="stu-modal-field-val">{modal.videosWatched} / {modal.videosTotal !== undefined ? modal.videosTotal : (modal.videosWatched > 0 ? modal.videosWatched : 0)} Videos</div>
                  </div>
                  <div className="stu-modal-field stu-modal-field-full">
                    <span className="stu-modal-field-label">Completion Rate</span>
                    <div className="stu-completion-wrap">
                      <div className="stu-completion-row">
                        <span className="stu-completion-pct">{modal.completionRate}%</span>
                        <span style={{ fontSize: '11.5px', color: 'var(--stu-text-muted)' }}>{modal.videosWatched} of {modal.videosTotal !== undefined ? modal.videosTotal : (modal.videosWatched > 0 ? modal.videosWatched : 0)} videos</span>
                      </div>
                      <div className="stu-completion-bar-bg">
                        <div
                          className="stu-completion-bar-fill"
                          style={{ width: `${modal.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="stu-modal-footer">
              <button className="stu-modal-close-btn" onClick={() => setModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Sub-components ─────────────────── */

function StatCard({
  icon, color, label, value, sub,
}: {
  icon: React.ReactNode;
  color: "blue" | "green" | "orange";
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <div className="stu-stat-card">
      <div className={`stu-stat-icon stu-stat-icon--${color}`}>{icon}</div>
      <div className="stu-stat-body">
        <span className="stu-stat-label">{label}</span>
        <span className="stu-stat-val">{value}</span>
        <span className="stu-stat-sub">{sub}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Student["status"] }) {
  const cls = status === "Active" ? "stu-status--active" : "stu-status--inactive";
  return (
    <span className={`stu-status ${cls}`}>
      <span className="stu-status-dot" />
      {status}
    </span>
  );
}

/* SVG icon helpers */
function UsersIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 4L12 14.01l-3-3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <path d="M15 9l-6 6M9 9l6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}