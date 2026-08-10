"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Users,
  Video,
  TrendingUp,
  Mail,
} from "lucide-react";
import "./departments.css";

/* ---------------------------------- DATA ---------------------------------- */
const departmentsData: DepartmentData[] = [
  {
    id: 1,
    code: "CSE",
    name: "Computer Science",
    hod: "Dr. Alan Turing",
    students: 640,
    videos: 312,
    completionRate: 88,
    performance: "High",
    trend: "+12%",
    color: "blue",
  },
  {
    id: 2,
    code: "MECH",
    name: "Mechanical Engg.",
    hod: "Dr. R. Sharma",
    students: 512,
    videos: 218,
    completionRate: 74,
    performance: "Average",
    trend: "+5%",
    color: "indigo",
  },
  {
    id: 3,
    code: "EEE",
    name: "Electrical Engg.",
    hod: "Prof. K. Nair",
    students: 470,
    videos: 176,
    completionRate: 69,
    performance: "Average",
    trend: "-2%",
    color: "teal",
  },
  {
    id: 4,
    code: "BIO",
    name: "Biotechnology",
    hod: "Dr. M. Fernandes",
    students: 305,
    videos: 140,
    completionRate: 81,
    performance: "High",
    trend: "+8%",
    color: "emerald",
  },
  {
    id: 5,
    code: "MGT",
    name: "Management Studies",
    hod: "Dr. S. Rao",
    students: 410,
    videos: 95,
    completionRate: 63,
    performance: "Low",
    trend: "+1%",
    color: "amber",
  },
];

interface DepartmentData {
  id: string | number;
  name: string;
  code: string;
  hod: string;
  email?: string;
  students: number;
  videos: number;
  views?: number;
  completionRate: number;
  performance: string;
  trend: string;
  color: string;
}

export default function DepartmentOverview() {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("principal_departments_cache");
      if (cached) {
        setDepartments(JSON.parse(cached));
        setLoading(false);
      }
    } catch (_) {}

    async function fetchDepartments() {
      setError(null);
      try {
        let principalId = "";
        try {
          const saved = typeof window !== "undefined" ? (localStorage.getItem("principal") || sessionStorage.getItem("principal")) : null;
          if (saved) principalId = JSON.parse(saved)?.id || "";
        } catch { }

        const headers: Record<string, string> = {};
        if (principalId) headers["X-Principal-Id"] = String(principalId);

        let res: Response;
        try {
          res = await fetch("/api/principal/departments/", { headers, credentials: "include" });
          if (!res.ok) {
            res = await fetch("https://online-management-backend.onrender.com/api/principal/departments/", { headers, credentials: "include" });
          }
        } catch {
          res = await fetch("https://online-management-backend.onrender.com/api/principal/departments/", { headers, credentials: "include" });
        }

        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const json = await res.json();

        if (json.status === "success" && Array.isArray(json.data)) {
          const list = json.data.length > 0 ? json.data : [];
          setDepartments(list);
          try {
            sessionStorage.setItem("principal_departments_cache", JSON.stringify(list));
          } catch (_) {}
        } else {
          setDepartments([]);
        }
      } catch (err: any) {
        console.error("Departments fetch error:", err);
        setDepartments(departmentsData);
      } finally {
        setLoading(false);
      }
    }

    fetchDepartments();
  }, []);

  return (
    <div className="dept-container">
      {/* Header */}
      <div className="dept-header">
        <div className="header-left">
          <Link href="/principal/dashboard" className="back-btn">
            <ChevronLeft size={20} />
            <span>Dashboard</span>
          </Link>
          <h1>Department Overview</h1>
          <p>Monitor academic performance and content growth by department.</p>
        </div>
      </div>

      {loading ? (
        <div className="dash-skeleton-wrapper">
          <div className="dash-skeleton-kpi-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="dash-skeleton-kpi-card skeleton-shimmer" style={{ height: 180 }} />
            ))}
          </div>
        </div>
      ) : (
        /* Stats Grid */
        <div className="dept-grid">
          {departments.map((dept) => (
            <div className={`dept-card color-${dept.color}`} key={dept.name}>
              <div className="card-top">
                <div className="dept-title-area">
                  <h3>{dept.name}</h3>
                  <span className={`trend-tag ${dept.trend.startsWith('+') ? 'up' : 'down'}`}>
                    {dept.trend}
                  </span>
                </div>
              </div>

              <div className="hod-section">
                <div className="hod-avatar">
                  <Users size={20} />
                </div>
                <div className="hod-info">
                  <span className="label">Head of Dept.</span>
                  <span className="name">{dept.hod}</span>
                </div>
                <a
                  href={`mailto:${dept.email || 'hod@college.edu'}`}
                  className="contact-btn"
                  title={dept.email ? `Email ${dept.hod}: ${dept.email}` : `Send email to ${dept.hod}`}
                  onClick={(e) => {
                    if (dept.email) {
                      window.location.href = `mailto:${dept.email}`;
                    } else {
                      alert(`HOD Email: hod.${(dept.code || 'dept').toLowerCase()}@college.edu`);
                    }
                  }}
                >
                  <Mail size={16} />
                </a>
              </div>

              <div className="metrics-grid">
                <div className="metric-item">
                  <div className="metric-icon"><Users size={16} /></div>
                  <div className="metric-data">
                    <span
                      className={`value ${(dept.students ?? 0) === 0 ? 'no-data' : ''}`}
                      title={(dept.students ?? 0) === 0 ? 'No students' : `${dept.students} students`}
                    >
                      {(dept.students ?? 0) > 0 ? dept.students : 'No students'}
                    </span>
                    <span className="label">Students</span>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-icon"><TrendingUp size={16} /></div>
                  <div className="metric-data">
                    <span className="value">{(dept as any).views ?? dept.videos ?? 0}</span>
                    <span className="label">Views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}