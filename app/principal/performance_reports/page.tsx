"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Trophy,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Search,
  Filter,
 AlertCircle,
  Download,
  MoreHorizontal,
  Zap
} from "lucide-react";

/* ---------------------------------- DATA ---------------------------------- */
const topPerformers = [
  { name: "Ananya Iyer", id: "S101", score: 98.2, rank: 1, trend: "up", dept: "Computer Science" },
  { name: "Rahul Verma", id: "S204", score: 96.5, rank: 2, trend: "up", dept: "Electrical Engg." },
  { name: "Sneha Kapoor", id: "S112", score: 94.8, rank: 3, trend: "down", dept: "Biotechnology" },
  { name: "Vikram Seth", id: "S301", score: 92.1, rank: 4, trend: "up", dept: "Mechanical Engg." },
  { name: " laila Hassan", id: "S405", score: 91.7, rank: 5, trend: "up", dept: "Management" },
];

const performanceTiers = [
  { label: "Elite (90%+)", count: 45, color: "bg-emerald-500", icon: Trophy },
  { label: "Proficient (75-89%)", count: 210, color: "bg-blue-500", icon: Award },
  { label: "Developing (60-74%)", count: 120, color: "bg-amber-500", icon: Zap },
  { label: "Critical (<60%)", count: 32, color: "bg-rose-500", icon: TrendingDown },
];

const deptPerformance = [
  { dept: "Computer Science", avg: 88.4, target: 90, color: "blue" },
  { dept: "Biotechnology", avg: 82.1, target: 85, color: "emerald" },
  { dept: "Electrical Engg.", avg: 76.5, target: 80, color: "amber" },
  { dept: "Mechanical Engg.", avg: 72.3, target: 80, color: "rose" },
  { dept: "Management", avg: 68.9, target: 75, color: "indigo" },
];

export default function PerformanceReports() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <Link href="/principal/dashboard" className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-800">Academic Performance</h1>
            <p className="text-slate-500 text-sm">Analyzing student achievements and institutional growth.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
              <Download size={18} />
              Export Metrics
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
              <Filter size={18} />
              Advanced Filter
            </button>
          </div>
        </div>

        {/* Top Tier Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {performanceTiers.map((tier, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg text-white ${tier.color}`}>
                  <tier.icon size={20} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Tiers</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-800">{tier.count}</p>
                <span className="text-sm text-slate-500 font-medium">{tier.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Leaderboard Section (Left 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Trophy size={20} className="text-amber-500" />
                  Institutional Leaderboard
                </h3>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search student..." 
                    className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Score %</th>
                      <th className="px-6 py-4">Trend</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topPerformers
                      .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((student, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                            student.rank === 1 ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-300' : 
                            student.rank === 2 ? 'bg-slate-100 text-slate-700 ring-2 ring-slate-300' : 
                            student.rank === 3 ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-300' : 
                            'text-slate-500'
                          }`}>
                            {student.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-700">{student.name}</span>
                            <span className="text-xs text-slate-400">{student.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{student.dept}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800">{student.score}%</span>
                        </td>
                        <td className="px-6 py-4">
                          {student.trend === 'up' ? (
                            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                              <TrendingUp size={14} /> +1.2%
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-rose-600 text-xs font-bold">
                              <TrendingDown size={14} /> -0.4%
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Department Comparison (Right 1/3) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Users size={20} className="text-blue-500" />
                Dept. Performance
              </h3>
              <div className="space-y-5">
                {deptPerformance.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-600">{item.dept}</span>
                      <span className="font-bold text-slate-800">{item.avg}%</span>
                    </div>
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full bg-${item.color}-500`}
                        style={{ width: `${item.avg}%` }}
                      ></div>
                      {/* Target Marker */}
                      <div 
                        className="absolute top-0 w-0.5 h-full bg-slate-800 opacity-50" 
                        style={{ left: `${item.target}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                Institutional Target Line
              </div>
            </div>

            {/* Performance Alert Card */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={20} />
                  <h3 className="font-bold">Performance Alert</h3>
                </div>
                <p className="text-amber-50 text-sm leading-relaxed mb-4">
                  <span className="font-bold">Mechanical Engg.</span> is currently 7.7% below the institutional target.
                </p>
                <button className="px-4 py-2 bg-white text-orange-600 text-xs font-bold rounded-lg hover:bg-amber-50 transition-all shadow-sm">
                  Analyze Gaps
                </button>
              </div>
              <TrendingDown size={80} className="absolute -bottom-4 -right-4 text-white opacity-20 -rotate-12" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
