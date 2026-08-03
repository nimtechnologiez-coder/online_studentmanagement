"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Users, 
  UserX, 
  Calendar, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  AlertCircle, 
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import "../dashboard/Principaldashboard.css";
import "../video_report/VideoReports.css";
import "../students/StudentsPage.css";

/* ---------------------------------- FALLBACK DATA ---------------------------------- */
const initialSummaryStats = [
  { label: "Overall Attendance", value: "84.2%", trend: "+2.1%", trendUp: true, iconName: "Users", color: "text-blue-600", bg: "bg-blue-100" },
  { label: "Avg. Daily Present", value: "3,410", trend: "+1.4%", trendUp: true, iconName: "CheckCircle2", color: "text-emerald-600", bg: "bg-emerald-100" },
  { label: "Below 75% Mark", value: "124", trend: "124 students", trendUp: false, iconName: "UserX", color: "text-rose-600", bg: "bg-rose-100" },
  { label: "Leave Requests", value: "12", trend: "Pending", trendUp: null, iconName: "Calendar", color: "text-amber-600", bg: "bg-amber-100" },
];

const fallbackAttendanceData = [
  { id: "S101", name: "Rahul Sharma", dept: "Computer Science", attendance: 92, status: "Safe", streak: "12 Days" },
  { id: "S102", name: "Priya Patel", dept: "Mechanical Engg.", attendance: 72, status: "At Risk", streak: "2 Days" },
  { id: "S103", name: "Amit Verma", dept: "Electrical Engg.", attendance: 64, status: "Critical", streak: "0 Days" },
  { id: "S104", name: "Sneha Reddy", dept: "Biotechnology", attendance: 88, status: "Safe", streak: "8 Days" },
  { id: "S105", name: "Vikram Singh", dept: "Computer Science", attendance: 74, status: "At Risk", streak: "4 Days" },
  { id: "S106", name: "Anjali Gupta", dept: "Management", attendance: 95, status: "Safe", streak: "20 Days" },
  { id: "S107", name: "Rohan Das", dept: "Mechanical Engg.", attendance: 58, status: "Critical", streak: "0 Days" },
];

const fallbackDeptAttendance = [
  { name: "Computer Science", rate: 89, color: "bg-blue-500" },
  { name: "Mechanical Engg.", rate: 74, color: "bg-amber-500" },
  { name: "Electrical Engg.", rate: 81, color: "bg-emerald-500" },
  { name: "Biotechnology", rate: 86, color: "bg-indigo-500" },
  { name: "Management", rate: 79, color: "bg-rose-500" },
];

const iconMap: Record<string, any> = {
  Users,
  CheckCircle2,
  UserX,
  Calendar,
};

export default function AttendanceReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [summaryStats, setSummaryStats] = useState(initialSummaryStats);
  const [attendanceList, setAttendanceList] = useState(fallbackAttendanceData);
  const [deptList, setDeptList] = useState(fallbackDeptAttendance);
  const [warningCount, setWarningCount] = useState(124);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendanceReports() {
      setLoading(true);
      try {
        let principalId = "";
        try {
          const saved = typeof window !== "undefined" ? (localStorage.getItem("principal") || sessionStorage.getItem("principal")) : null;
          if (saved) principalId = JSON.parse(saved)?.id || "";
        } catch {}

        const headers: Record<string, string> = {};
        if (principalId) headers["X-Principal-Id"] = String(principalId);

        let res: Response;
        try {
          res = await fetch("/api/principal/attendance_reports/", { headers, credentials: "include" });
          if (!res.ok) {
            res = await fetch("http://127.0.0.1:8000/api/principal/attendance_reports/", { headers, credentials: "include" });
          }
        } catch {
          res = await fetch("http://127.0.0.1:8000/api/principal/attendance_reports/", { headers, credentials: "include" });
        }

        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const json = await res.json();

        if (json.status === "success") {
          if (json.summaryStats && json.summaryStats.length > 0) setSummaryStats(json.summaryStats);
          if (json.data && json.data.length > 0) setAttendanceList(json.data);
          if (json.deptAttendance && json.deptAttendance.length > 0) setDeptList(json.deptAttendance);
          if (json.belowThresholdCount !== undefined) setWarningCount(json.belowThresholdCount);
        }
      } catch (err) {
        console.error("Attendance reports fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAttendanceReports();
  }, []);

  const filteredData = attendanceList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dash-main">
      <div className="dash-content">
        
        {/* Banner Header */}
        <div className="dash-welcome-banner mb-6">
          <div className="banner-content">
            <Link href="/principal/dashboard" className="banner-badge hover:underline">
              <ChevronLeft size={13} />
              <span>Back to Dashboard</span>
            </Link>
            <h2>Attendance Reports</h2>
            <p>Monitor college-wide attendance trends & student warnings across all departments.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const listToExport = filteredData.length > 0 ? filteredData : attendanceList;
                if (listToExport.length === 0) return;

                const headers = ["Student ID", "Full Name", "Department", "Attendance (%)", "Status", "Streak"];
                const rowsHtml = listToExport
                  .map(
                    (s) => `
                  <tr>
                    <td>${s.id}</td>
                    <td>${s.name || ""}</td>
                    <td>${s.dept || ""}</td>
                    <td>${s.attendance}%</td>
                    <td>${s.status || ""}</td>
                    <td>${s.streak || ""}</td>
                  </tr>`
                  )
                  .join("");

                const excelTemplate = `
                  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                  <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                    <!--[if gte mso 9]>
                    <xml>
                      <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                          <x:ExcelWorksheet>
                            <x:Name>Attendance Report</x:Name>
                            <x:WorksheetOptions>
                              <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                          </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                      </x:ExcelWorkbook>
                    </xml>
                    <![endif]-->
                    <style>
                      th { background-color: #4f46e5; color: #ffffff; font-weight: bold; padding: 8px; text-align: left; }
                      td { padding: 6px; border: 1px solid #cbd5e1; }
                    </style>
                  </head>
                  <body>
                    <table>
                      <thead>
                        <tr>
                          ${headers.map((h) => `<th>${h}</th>`).join("")}
                        </tr>
                      </thead>
                      <tbody>
                        ${rowsHtml}
                      </tbody>
                    </table>
                  </body>
                  </html>
                `;

                const blob = new Blob([excelTemplate], { type: "application/vnd.ms-excel;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `Attendance_Report_${new Date().toISOString().slice(0, 10)}.xls`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="dash-action-btn btn-export"
              title="Download Attendance Excel File"
            >
              <Download size={15} />
              <span className="btn-text">Export Excel</span>
            </button>
          </div>
        </div>



        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Students List (Left 2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="corp-card table-card-corp">
              <div className="corp-card-header mb-4">
                <div className="dash-search-container" style={{ maxWidth: 300 }}>
                  <Search size={15} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search student ID or name..." 
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter size={15} style={{ color: "var(--p-text-muted)" }} />
                  <select 
                    className="corp-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All Attendance Status</option>
                    <option value="Safe">Safe (&gt; 75%)</option>
                    <option value="At Risk">At Risk (70-75%)</option>
                    <option value="Critical">Critical (&lt; 70%)</option>
                  </select>
                </div>
              </div>

              {/* Desktop & Tablet Table View */}
              <div className="corp-table-wrap">
                <table className="corp-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Department</th>
                      <th>Attendance %</th>
                      <th>Status</th>
                      <th>Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="student-cell-profile">
                            <span className="font-semibold" style={{ color: "var(--p-text-primary)" }}>{item.name}</span>
                            <code className="corp-code-badge" style={{ fontSize: 11 }}>{item.id}</code>
                          </div>
                        </td>
                        <td>
                          <span className="table-dept-pill">{item.dept}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div className="w-16 md:w-20 h-2 rounded-full overflow-hidden" style={{ background: "var(--p-border-table)" }}>
                              <div 
                                className="h-full rounded-full"
                                style={{ 
                                  width: `${item.attendance}%`,
                                  background: item.attendance >= 75 ? "var(--p-emerald)" : item.attendance >= 70 ? "var(--p-amber)" : "var(--p-red)" 
                                }} 
                              />
                            </div>
                            <span className="font-bold">{item.attendance}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${
                            item.status === 'Safe' ? 'status-active' : 'status-inactive'
                          }`}>
                            <span className="status-dot" />
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: "var(--p-text-muted)", fontSize: 13 }}>{item.streak}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Dept Analytics & Alert Sidebar (Right 1/3) */}
          <div className="space-y-6">
            <div className="corp-card">
              <div className="corp-card-header">
                <h3>
                  <Users size={18} className="header-icon" style={{ color: "var(--p-indigo)" }} />
                  <span>Dept. Comparison</span>
                </h3>
              </div>
              <div className="space-y-4">
                {deptList.map((dept, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="font-semibold" style={{ color: "var(--p-text-primary)" }}>{dept.name}</span>
                      <span className="font-bold">{dept.rate}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--p-border-table)" }}>
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: `${dept.rate}%`, background: "var(--p-indigo)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert Card */}
            <div className="corp-card" style={{ background: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)", color: "#ffffff" }}>
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <h3 className="font-bold text-base text-white margin-0">Attendance Warning</h3>
                </div>
                <p className="text-rose-100 text-xs sm:text-sm leading-relaxed">
                  There are <span className="font-extrabold text-white underline decoration-rose-300">{warningCount} students</span> currently below the 75% mandatory threshold.
                </p>
                <button className="dash-action-btn w-full justify-center" style={{ background: "#ffffff", color: "#e11d48", borderColor: "#ffffff" }}>
                  Send Bulk Warning Emails
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
