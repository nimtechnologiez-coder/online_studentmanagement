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

/* ─────────────────────────── Mock Data ─────────────────────── */

const STUDENTS: Student[] = [
  { id: 1, name: "Arun Kumar", username: "arun001", password: "Arun@2023", email: "arun@gmail.com", year: "III", joinDate: "10-Aug-23", status: "Active", phone: "+91 98400 11001", section: "A", completionRate: 98, videosWatched: 41 },
  { id: 2, name: "Priya Dharshini", username: "priya01", password: "Priya@2023", email: "priya@gmail.com", year: "II", joinDate: "12-Aug-23", status: "Active", phone: "+91 98400 11002", section: "B", completionRate: 96, videosWatched: 40 },
  { id: 3, name: "Sanjay Kumar", username: "sanjay01", password: "Sanjay@2023", email: "sanjay@gmail.com", year: "IV", joinDate: "15-Aug-23", status: "Active", phone: "+91 98400 11003", section: "A", completionRate: 94, videosWatched: 39 },
  { id: 4, name: "Kavya Sri", username: "kavya01", password: "Kavya@2023", email: "kavya@gmail.com", year: "I", joinDate: "18-Aug-23", status: "Active", phone: "+91 98400 11004", section: "C", completionRate: 92, videosWatched: 38 },
  { id: 5, name: "Vigneshwaran", username: "vignesh01", password: "Vign@2023", email: "vignesh@gmail.com", year: "III", joinDate: "20-Aug-23", status: "Active", phone: "+91 98400 11005", section: "A", completionRate: 90, videosWatched: 37 },
  { id: 6, name: "Meena Kumari", username: "meena01", password: "Meena@2023", email: "meena@gmail.com", year: "II", joinDate: "22-Aug-23", status: "Active", phone: "+91 98400 11006", section: "B", completionRate: 88, videosWatched: 36 },
  { id: 7, name: "Ravi Shankar", username: "ravi01", password: "Ravi@2023", email: "ravi@gmail.com", year: "IV", joinDate: "01-Sep-23", status: "Active", phone: "+91 98400 11007", section: "A", completionRate: 85, videosWatched: 35 },
  { id: 8, name: "Divya Priya", username: "divya01", password: "Divya@2023", email: "divya@gmail.com", year: "I", joinDate: "03-Sep-23", status: "Active", phone: "+91 98400 11008", section: "C", completionRate: 82, videosWatched: 34 },
  { id: 9, name: "Karthik Raja", username: "karthik01", password: "Kart@2023", email: "karthik@gmail.com", year: "III", joinDate: "05-Sep-23", status: "Inactive", phone: "+91 98400 11009", section: "B", completionRate: 45, videosWatched: 19 },
  { id: 10, name: "Suresh Babu", username: "suresh01", password: "Suresh@2023", email: "suresh@gmail.com", year: "II", joinDate: "07-Sep-23", status: "Active", phone: "+91 98400 11010", section: "A", completionRate: 78, videosWatched: 33 },
  { id: 11, name: "Anitha Devi", username: "anitha01", password: "Anitha@2023", email: "anitha@gmail.com", year: "IV", joinDate: "10-Sep-23", status: "Active", phone: "+91 98400 11011", section: "C", completionRate: 73, videosWatched: 31 },
  { id: 12, name: "Balaji Ram", username: "balaji01", password: "Balaji@2023", email: "balaji@gmail.com", year: "I", joinDate: "12-Sep-23", status: "Inactive", phone: "+91 98400 11012", section: "B", completionRate: 30, videosWatched: 12 },
  { id: 13, name: "Swetha Nair", username: "swetha01", password: "Sweth@2023", email: "swetha@gmail.com", year: "III", joinDate: "15-Sep-23", status: "Active", phone: "+91 98400 11013", section: "A", completionRate: 80, videosWatched: 33 },
  { id: 14, name: "Murugan S", username: "murugan01", password: "Muru@2023", email: "murugan@gmail.com", year: "II", joinDate: "18-Sep-23", status: "Inactive", phone: "+91 98400 11014", section: "C", completionRate: 42, videosWatched: 17 },
  { id: 15, name: "Lakshmi Priya", username: "lakshmi01", password: "Laksh@2023", email: "lakshmi@gmail.com", year: "IV", joinDate: "20-Sep-23", status: "Active", phone: "+91 98400 11015", section: "B", completionRate: 87, videosWatched: 36 },
  { id: 16, name: "Vijay Kumar", username: "vijay01", password: "Vijay@2023", email: "vijay@gmail.com", year: "I", joinDate: "22-Sep-23", status: "Active", phone: "+91 98400 11016", section: "A", completionRate: 75, videosWatched: 31 },
  { id: 17, name: "Nandhini S", username: "nandh01", password: "Nandh@2023", email: "nandhini@gmail.com", year: "III", joinDate: "01-Oct-23", status: "Active", phone: "+91 98400 11017", section: "C", completionRate: 83, videosWatched: 35 },
  { id: 18, name: "Ashwin Kumar", username: "ashwin01", password: "Ashw@2023", email: "ashwin@gmail.com", year: "II", joinDate: "03-Oct-23", status: "Inactive", phone: "+91 98400 11018", section: "B", completionRate: 20, videosWatched: 8 },
  { id: 19, name: "Pooja Kumari", username: "pooja01", password: "Pooja@2023", email: "pooja@gmail.com", year: "IV", joinDate: "05-Oct-23", status: "Active", phone: "+91 98400 11019", section: "A", completionRate: 91, videosWatched: 38 },
  { id: 20, name: "Harish Babu", username: "harish01", password: "Hari@2023", email: "harish@gmail.com", year: "I", joinDate: "07-Oct-23", status: "Active", phone: "+91 98400 11020", section: "C", completionRate: 69, videosWatched: 29 },
];

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

      if (!json || json.status !== "success" || !Array.isArray(json.students) || json.students.length === 0) {
        setStudents(STUDENTS);
        return;
      }

      const studentData: Student[] = (json.students || []).map((student: any) => ({
        id: student.id,
        name: student.name,
        username: student.username,
        password: student.password || "",
        email: student.email,
        year: student.year,
        joinDate: student.joinDate || "",
        status: student.status === "active" ? "Active" : "Inactive",
        phone: student.phone || "",
        section: "N/A",
        completionRate: 0,
        videosWatched: 0,
      }));

      setStudents(studentData);
    } catch (err: any) {
      console.error("Failed to load HOD students, using fallback:", err);
      setStudents(STUDENTS);
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
            <div className="stu-avatar">DA</div>
            <div>
              <span className="stu-profile-name">Dr. Arun Kumar</span>
              <span className="stu-profile-role">HOD - CSE</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
            value={STUDENTS.length}
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

        {/* ======== TOOLBAR ======== */}
        <div className="stu-toolbar">
          <div className="stu-search-wrap">
            <span className="stu-search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#6b7280" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              className="stu-search-input"
              type="text"
              placeholder="Search name, username, email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <select
            className="stu-select"
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
            className="stu-select"
            value={statusFilter}
            onChange={(e) => { setStat(e.target.value); setPage(1); }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* ======== TABLE ======== */}
        <div className="stu-table-card">
          <div className="stu-table-scroll">
            <table className="stu-table">
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
                  <td colSpan={9} className="stu-empty">
                    Loading students...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="stu-empty">
                    {error}
                  </td>
                </tr>
              ) : pageSlice.length > 0 ? (
                  pageSlice.map((s, idx) => (
                    <tr key={s.id}>
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
                    <td colSpan={9} className="stu-empty">
                      No students found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ---- Pagination footer ---- */}
          <div className="stu-footer">
            <span className="stu-showing">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} students
            </span>
            <div className="stu-pagination">
              <button
                className="stu-page-btn stu-page-btn--nav"
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
                        className={`stu-page-btn ${safePage === p ? "stu-page-btn--active" : ""}`}
                        onClick={() => goPage(p as number)}
                        aria-current={safePage === p ? "page" : undefined}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <button
                className="stu-page-btn stu-page-btn--nav"
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
                    <div className="stu-modal-field-val">{modal.videosWatched} / 42</div>
                  </div>
                  <div className="stu-modal-field stu-modal-field-full">
                    <span className="stu-modal-field-label">Completion Rate</span>
                    <div className="stu-completion-wrap">
                      <div className="stu-completion-row">
                        <span className="stu-completion-pct">{modal.completionRate}%</span>
                        <span style={{ fontSize: '11.5px', color: 'var(--stu-text-muted)' }}>{modal.videosWatched} of 42 videos</span>
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