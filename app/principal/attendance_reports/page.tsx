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
    <div className="min-h-screen bg-slate-50 p-3 sm:p-6 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header */}
        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link href="/principal/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors group">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Attendance Reports</h1>
            <p className="text-xs sm:text-sm text-slate-500">Monitor college-wide attendance trends & student warnings.</p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <button 
              onClick={() => {
                const csvHeader = "ID,Name,Department,Attendance,Status,Streak\n";
                const csvRows = attendanceList.map(s => `"${s.id}","${s.name}","${s.dept}","${s.attendance}%","${s.status}","${s.streak}"`).join("\n");
                const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `Attendance_Report_${new Date().toISOString().slice(0,10)}.csv`;
                a.click();
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 rounded-xl sm:rounded-lg transition-all active:scale-[0.98]"
            >
              <Download size={16} />
              <span>Export Log</span>
            </button>
            <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl sm:rounded-lg transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]">
              <Calendar size={16} />
              <span className="truncate">Manual Attendance</span>
            </button>
          </div>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {summaryStats.map((stat, idx) => {
            const StatIcon = iconMap[stat.iconName] || Users;
            return (
              <div key={idx} className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${stat.bg} ${stat.color}`}>
                    <StatIcon size={18} className="sm:w-[22px] sm:h-[22px]" />
                  </div>
                  {stat.trendUp !== null && (
                    <span className={`flex items-center gap-0.5 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${stat.trendUp ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                      {stat.trendUp ? <ArrowUpRight size={10} className="sm:w-3 sm:h-3" /> : <ArrowDownRight size={10} className="sm:w-3 sm:h-3" />}
                      <span>{stat.trend}</span>
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">{stat.label}</p>
                  <p className="text-lg sm:text-2xl font-black text-slate-800 mt-0.5">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Students List (Left 2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between bg-slate-50/50">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search student ID or name..." 
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all shadow-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter size={15} className="text-slate-400 flex-shrink-0 ml-1" />
                  <select 
                    className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white font-medium text-slate-700 cursor-pointer shadow-sm"
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

              {/* Mobile Card List View (visible below sm) */}
              <div className="block sm:hidden divide-y divide-slate-100">
                {filteredData.map((item, idx) => (
                  <div key={idx} className="p-3.5 space-y-2.5 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-slate-800 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium truncate">{item.id} • {item.dept}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                        item.status === 'Safe' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.status === 'At Risk' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100/60">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                          <div 
                            className={`h-full rounded-full ${
                              item.attendance >= 75 ? 'bg-emerald-500' : 
                              item.attendance >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                            }`} 
                            style={{ width: `${item.attendance}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-slate-800">{item.attendance}%</span>
                      </div>
                      <span className="text-slate-500 font-semibold text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">Streak: {item.streak}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop & Tablet Table View (hidden on small screens) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/80 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                    <tr className="border-b border-slate-100">
                      <th className="px-4 md:px-6 py-3.5">Student</th>
                      <th className="px-4 md:px-6 py-3.5">Department</th>
                      <th className="px-4 md:px-6 py-3.5">Attendance %</th>
                      <th className="px-4 md:px-6 py-3.5">Status</th>
                      <th className="px-4 md:px-6 py-3.5">Streak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors group">
                        <td className="px-4 md:px-6 py-3.5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800 text-sm">{item.name}</span>
                            <span className="text-xs text-slate-400 font-mono">{item.id}</span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-3.5 text-xs md:text-sm text-slate-600 font-medium">{item.dept}</td>
                        <td className="px-4 md:px-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-16 md:w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  item.attendance >= 75 ? 'bg-emerald-500' : 
                                  item.attendance >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                                }`} 
                                style={{ width: `${item.attendance}%` }}
                              />
                            </div>
                            <span className="text-xs md:text-sm font-bold text-slate-800">{item.attendance}%</span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'Safe' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            item.status === 'At Risk' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3.5 text-xs md:text-sm text-slate-600 font-medium">{item.streak}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Dept Analytics & Alert Sidebar (Right 1/3) */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base">
                <Users size={18} className="text-blue-500" />
                <span>Dept. Comparison</span>
              </h3>
              <div className="space-y-4 sm:space-y-5">
                {deptList.map((dept, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-slate-700">{dept.name}</span>
                      <span className="font-bold text-slate-800">{dept.rate}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${dept.color}`} 
                        style={{ width: `${dept.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert Card */}
            <div className="bg-gradient-to-br from-rose-500 to-red-600 p-4 sm:p-6 rounded-xl sm:rounded-2xl text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10 space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <h3 className="font-bold text-sm sm:text-base">Attendance Warning</h3>
                </div>
                <p className="text-rose-100 text-xs sm:text-sm leading-relaxed">
                  There are <span className="font-extrabold text-white underline decoration-rose-300">{warningCount} students</span> currently below the 75% mandatory threshold.
                </p>
                <button className="w-full py-2.5 bg-white text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-50 transition-all shadow-sm active:scale-[0.98]">
                  Send Bulk Warning Emails
                </button>
              </div>
              <UserX size={90} className="absolute -bottom-4 -right-4 text-white opacity-20 -rotate-12 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
