"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  MoreVertical,
  MessageCircle,
  Trophy,
  ArrowUpRight
} from "lucide-react";

/* ---------------------------------- DATA ---------------------------------- */
const stats = [
  { label: "Total Doubts", value: "1,240", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-100" },
  { label: "Resolved", value: "840", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  { label: "Pending", value: "400", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  { label: "Avg. Response Time", value: "4.2 Hrs", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-100" },
];

const doubtsData = [
  { 
    id: "D-501", 
    student: "Rahul Sharma", 
    subject: "Quantum Mechanics", 
    category: "Conceptual", 
    timestamp: "2 hours ago", 
    status: "Pending", 
    priority: "High", 
    faculty: "Dr. S. Bose" 
  },
  { 
    id: "D-502", 
    student: "Priya Patel", 
    subject: "Data Structures", 
    category: "Assignment", 
    timestamp: "5 hours ago", 
    status: "Resolved", 
    priority: "Medium", 
    faculty: "Prof. A. Iyer" 
  },
  { 
    id: "D-503", 
    student: "Amit Verma", 
    subject: "Thermodynamics", 
    category: "Exam Prep", 
    timestamp: "1 day ago", 
    status: "Pending", 
    priority: "High", 
    faculty: "Dr. R. Sharma" 
  },
  { 
    id: "D-504", 
    student: "Sneha Reddy", 
    subject: "Cell Biology", 
    category: "Conceptual", 
    timestamp: "2 days ago", 
    status: "Resolved", 
    priority: "Low", 
    faculty: "Dr. M. Fernandes" 
  },
  { 
    id: "D-505", 
    student: "Vikram Singh", 
    subject: "Macroeconomics", 
    category: "Assignment", 
    timestamp: "3 days ago", 
    status: "Pending", 
    priority: "Medium", 
    faculty: "Dr. S. Rao" 
  },
];

const mostActiveSubjects = [
  { subject: "Quantum Mechanics", count: 145, growth: "+12%" },
  { subject: "Data Structures", count: 120, growth: "+5%" },
  { subject: "Thermodynamics", count: 98, growth: "-2%" },
  { subject: "Cell Biology", count: 65, growth: "+18%" },
];

export default function DoubtReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredDoubts = doubtsData.filter((d) => {
    const matchesSearch = d.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/principal/dashboard" className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-2 group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-800">Doubt Resolution Reports</h1>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
            <MessageCircle size={18} />
            View All Tickets
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl item.bg{item.bg}item.bg{item.color}`}>
                <item.icon size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{item.label}</p>
                <p className="text-2xl font-bold text-slate-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Table Section (Left 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search student or subject..." 
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter size={16} className="text-slate-400" />
                  <select 
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Doubts</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Student & Subject</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Faculty</th>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDoubts.map((doubt, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-700">{doubt.student}</span>
                            <span className="text-xs text-blue-600 font-medium">{doubt.subject}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">{doubt.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${doubt.status === 'Resolved' ? 'bg-green-500' : 'bg-amber-500'}`} />
                            <span className={`text-sm font-medium ${doubt.status === 'Resolved' ? 'text-green-700' : 'text-amber-700'}`}>
                              {doubt.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{doubt.faculty}</td>
                        <td className="px-6 py-4 text-sm text-slate-400">{doubt.timestamp}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side Analytics (Right 1/3) */}
          <div className="space-y-6">
            {/* Hot Subjects Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Trophy size={18} className="text-amber-500" />
                  Critical Subjects
                </h3>
                <span className="text-xs text-slate-400">High Volume</span>
              </div>
              <div className="space-y-4">
                {mostActiveSubjects.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700">{sub.subject}</span>
                      <span className="text-xs text-slate-400">{sub.count} active doubts</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                      {sub.growth} <ArrowUpRight size={12} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                View detailed heatmap
              </button>
            </div>

            {/* Performance Tip Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Principal's Insight</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-4">
                  "Quantum Mechanics" has seen a 12% spike in doubts this week. Consider organizing a special revision session.
                </p>
                <button className="px-4 py-2 bg-white text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition-all">
                  Schedule Meeting
                </button>
              </div>
              <MessageCircle size={80} className="absolute -bottom-4 -right-4 text-white opacity-10 rotate-12" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
