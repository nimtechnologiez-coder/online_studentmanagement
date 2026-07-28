"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Briefcase, 
  MapPin, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  MoreVertical,
  Building2,
  FileText,
  Trophy,
  ArrowUpRight,
  Download
} from "lucide-react";

/* ---------------------------------- DATA ---------------------------------- */
const summaryStats = [
  { label: "Total Interns", value: "320", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100" },
  { label: "Placements", value: "285", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-100" },
  { label: "Pending Approval", value: "45", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  { label: "Certifications", value: "210", icon: Trophy, color: "text-purple-600", bg: "bg-purple-100" },
];

const internshipData = [
  { 
    id: "INT-801", 
    student: "Rahul Sharma", 
    company: "Google", 
    role: "Software Engineering Intern", 
    location: "Bangalore, IN", 
    duration: "3 Months", 
    status: "Completed", 
    stipend: "₹45,000/mo",
    mentor: "S. Sundar" 
  },
  { 
    id: "INT-802", 
    student: "Priya Patel", 
    company: "Tesla", 
    role: "EV Battery Analyst", 
    location: "Austin, US", 
    duration: "6 Months", 
    status: "Active", 
    stipend: "$2,000/mo",
    mentor: "Elon M." 
  },
  { 
    id: "INT-803", 
    student: "Amit Verma", 
    company: "TATA Motors", 
    role: "Mechanical Design Intern", 
    location: "Pune, IN", 
    duration: "2 Months", 
    status: "Pending", 
    stipend: "₹15,000/mo",
    mentor: "R. Tata" 
  },
  { 
    id: "INT-804", 
    student: "Sneha Reddy", 
    company: "Pfizer", 
    role: "Biotech Research", 
    location: "New York, US", 
    duration: "4 Months", 
    status: "Completed", 
    stipend: "$3,000/mo",
    mentor: "Dr. Jane" 
  },
  { 
    id: "INT-805", 
    student: "Vikram Singh", 
    company: "Goldman Sachs", 
    role: "Financial Analyst Intern", 
    location: "Mumbai, IN", 
    duration: "3 Months", 
    status: "Active", 
    stipend: "₹60,000/mo",
    mentor: "M. Solomon" 
  },
];

const topCompanies = [
  { name: "Google", interns: 12, rating: 4.9, color: "bg-blue-500" },
  { name: "TATA Motors", interns: 25, rating: 4.5, color: "bg-indigo-600" },
  { name: "Tesla", interns: 8, rating: 4.8, color: "bg-red-600" },
  { name: "Microsoft", interns: 15, rating: 4.7, color: "bg-sky-500" },
];

export default function InternshipReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredInternships = internshipData.filter((item) => {
    const matchesSearch = item.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
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
            <h1 className="text-3xl font-bold text-slate-800">Internship & Industry Reports</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
              <Download size={18} />
              Export Placement Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
              <FileText size={18} />
              Verify Reports
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {summaryStats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl stat.bg{stat.bg}stat.bg{stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Table (Left 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search student or company..." 
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
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-4">Student & Role</th>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Location/Duration</th>
                      <th className="px-6 py-4">Stipend</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInternships.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-700">{item.student}</span>
                            <span className="text-xs text-slate-500">{item.role}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 size={14} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">{item.company}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-xs text-slate-500">
                            <div className="flex items-center gap-1"><MapPin size={12} /> {item.location}</div>
                            <div className="flex items-center gap-1"><Clock size={12} /> {item.duration}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-700">{item.stipend}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                            item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            item.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {item.status}
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
            </div>
          </div>

          {/* Side Analytics (Right 1/3) */}
          <div className="space-y-6">
            {/* Top Companies Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Building2 size={18} className="text-blue-500" />
                  Top Hiring Partners
                </h3>
              </div>
              <div className="space-y-4">
                {topCompanies.map((company, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-8 rounded-full ${company.color}`}></div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700">{company.name}</span>
                        <span className="text-xs text-slate-400">{company.interns} students placed</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Trophy size={12} /> {company.rating}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                View Partnership Map
              </button>
            </div>

            {/* Success Metric Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Placement Success</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-4">
                  Our current placement rate is <span className="font-bold text-white">89.2%</span>, an increase of 4% from the previous semester.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold bg-white/20 w-fit px-2 py-1 rounded">
                  <ArrowUpRight size={14} /> +12 Companies Added
                </div>
              </div>
              <Briefcase size={80} className="absolute -bottom-4 -right-4 text-white opacity-10 rotate-12" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
