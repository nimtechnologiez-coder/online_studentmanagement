"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  Building2,
  Lock
} from "lucide-react";

export default function PrincipalProfile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/principal/dashboard" className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="absolute right-4 top-4">
              <button className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full transition-all">
                <Camera size={20} />
              </button>
            </div>
          </div>

          {/* Profile Info Area */}
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-1 right-1 p-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-slate-600 hover:text-blue-600 transition-colors">
                  <Edit3 size={14} />
                </button>
              </div>

              {/* Name & Basic Info */}
              <div className="flex-1 text-center md:text-left mt-2">
                <h1 className="text-3xl font-bold text-slate-800">Dr. Ananya Verma</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><Building2 size={16} /> Principal, National Institute of Technology</span>
                  <span className="flex items-center gap-1.5"><MapPin size={16} /> New Delhi, India</span>
                </div>
              </div>

              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

            {/* Action Tabs */}
            <div className="flex border-b border-slate-100 mt-8">
              <button className="px-6 py-3 text-sm font-bold border-b-2 border-blue-600 text-blue-600">Overview</button>
              <button className="px-6 py-3 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">Academic Bio</button>
              <button className="px-6 py-3 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">Certifications</button>
              <button className="px-6 py-3 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">Security</button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details & Bio */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Contact Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><Mail size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Email</span>
                  <span className="text-sm font-semibold text-slate-700">principal@nit.edu</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm"><Phone size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Phone</span>
                  <span className="text-sm font-semibold text-slate-700">+91 98765 43210</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm"><Calendar size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Joined</span>
                  <span className="text-sm font-semibold text-slate-700">Aug 2015</span>
                </div>
              </div>
            </div>

            {/* Academic Biography */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <GraduationCap className="text-blue-600" /> Academic Biography
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Dr. Ananya Verma has over 18 years of experience in higher education and institutional leadership. 
                Holding a PhD in Quantum Computing from MIT, she has published over 40 research papers in 
                internationally peer-reviewed journals. Her vision for the institution focuses on 
                integrating AI-driven learning and fostering strong industry-academia partnerships.
              </p>
            </div>

            {/* Education & Experience */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Award className="text-blue-600" /> Professional Milestones
              </h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <div className="w-0.5 h-full bg-slate-200"></div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase">2020 - Present</span>
                    <h4 className="font-bold text-slate-800">Principal, NIT</h4>
                    <p className="text-sm text-slate-500">Leading institutional strategy and digital transformation of campus learning.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                    <div className="w-0.5 h-full bg-slate-200"></div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">2015 - 2020</span>
                    <h4 className="font-bold text-slate-800">Dean of Academics</h4>
                    <p className="text-sm text-slate-500">Curriculum overhaul and implementation of Outcome-Based Education (OBE).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings & Security */}
          <div className="space-y-8">
            
            {/* Administration Settings */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-600" />
                Account Security
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <span className="text-sm font-medium text-slate-600">Change Password</span>
                  </div>
                  <ChevronLeft size={16} className="rotate-180 text-slate-300" />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <span className="text-sm font-medium text-slate-600">Two-Factor Auth</span>
                  </div>
                  <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-4">Admin Quick-Panel</h3>
                <div className="space-y-3">
                  <Link href="/principal/settings" className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-sm">
                    <span>Institutional Settings</span>
                    <ArrowUpRight size={16} />
                  </Link>
                  <Link href="/principal/logs" className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-sm">
                    <span>System Audit Logs</span>
                    <ArrowUpRight size={16} />
                  </Link>
                  <button className="w-full p-3 bg-rose-500 hover:bg-rose-600 rounded-xl text-sm font-bold transition-all">
                    Log Out
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500 opacity-20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for the arrow icon used in the quick-panel
function ArrowUpRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="15" y1="3" x2="21" y2="9"></line>
      <polyline points="9 15 3 9 12 3"></polyline>
      <line x1="15" y1="3" x2="15" y2="9"></line>
      <line x1="9 15" x2="15" y2="15"></line>
    </svg>
  );
}
