"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MoreVertical, 
  Search, 
  Calendar,
  ArrowUpRight,
  Download,
  User
} from "lucide-react";

/* ---------------------------------- DATA ---------------------------------- */
const taskSummary = [
  { label: "Total Tasks", value: "156", color: "bg-blue-500", icon: Plus },
  { label: "Completed", value: "92", color: "bg-green-500", icon: CheckCircle2 },
  { label: "In Progress", value: "41", color: "bg-amber-500", icon: Clock },
  { label: "Overdue", value: "23", color: "bg--500", icon: AlertTriangle },
];

const tasksData = [
  { 
    id: "T-1001", 
    task: "Syllabus Mapping - Sem 4", 
    faculty: "Dr. R. Sharma", 
    dept: "Mechanical", 
    deadline: "15 Jul 2026", 
    progress: 100, 
    status: "Completed", 
    priority: "High" 
  },
  { 
    id: "T-1002", 
    task: "Internal Assessment Prep", 
    faculty: "Prof. A. Iyer", 
    dept: "Comp Science", 
    deadline: "18 Jul 2026", 
    progress: 45, 
    status: "In Progress", 
    priority: "Medium" 
  },
  { 
    id: "T-1003", 
    task: "Lab Manual Verification", 
    faculty: "Dr. M. Fernandes", 
    dept: "Biotech", 
    deadline: "10 Jul 2026", 
    progress: 20, 
    status: "Overdue", 
    priority: "High" 
  },
  { 
    id: "T-1004", 
    task: "Guest Lecture Coordination", 
    faculty: "Prof. K. Nair", 
    dept: "Electrical", 
    deadline: "22 Jul 2026", 
    progress: 10, 
    status: "In Progress", 
    priority: "Low" 
  },
  { 
    id: "T-1005", 
    task: "Course Material Upload", 
    faculty: "Dr. S. Rao", 
    dept: "Management", 
    deadline: "12 Jul 2026", 
    progress: 80, 
    status: "In Progress", 
    priority: "Medium" 
  },
];

export default function TaskReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTasks = tasksData.filter((task) => {
    const matchesSearch = task.task.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/principal/dashboard" className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-2 group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-800">Faculty Task Reports</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
              <Download size={18} />
              Export Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
              <Plus size={18} />
              Assign New Task
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {taskSummary.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl text-white ${item.color}`}>
                <item.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{item.label}</p>
                <p className="text-2xl font-bold text-slate-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search task or faculty..." 
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Filter size={16} />
              <span>Status:</span>
            </div>
            <select 
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Tasks</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Task Details</th>
                  <th className="px-6 py-4">Assigned Faculty</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700">{task.task}</span>
                        <span className="text-xs text-slate-400">{task.id} • {task.dept}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                          <User size={14} />
                        </div>
                        <span className="text-sm text-slate-600">{task.faculty}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar size={14} />
                        {task.deadline}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              task.progress === 100 ? 'bg-green-500' : 
                              task.status === 'Overdue' ? 'bg-rose-500' : 'bg-blue-500'
                            }`} 
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-500">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {task.status}
                      </span>
                    </td>
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
          {filteredTasks.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <p>No tasks found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
