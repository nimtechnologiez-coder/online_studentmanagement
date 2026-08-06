"use client";

import { useEffect, useState } from "react";
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
  Lock,
  X
} from "lucide-react";
import "../dashboard/Principaldashboard.css";
import "../video_report/VideoReports.css";
import "../students/StudentsPage.css";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  college: string;
  joined: string;
  avatar: string;
  bio: string;
  username: string;
  status: string;
}

export default function PrincipalProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Modal edit form state
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch real profile data from Django API
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/principal/profile/");
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setProfile(json.data);
        setEditEmail(json.data.email || "");
        setEditPhone(json.data.phone || "");
        setEditBio(json.data.bio || "");
      }
    } catch (err) {
      console.error("Failed to load principal profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Save updated contact information
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("http://127.0.0.1:8000/api/principal/profile/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: editEmail,
          phone: editPhone,
          bio: editBio,
        }),
      });
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setProfile(json.data);
        setIsEditModalOpen(false);
      } else {
        alert(json.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile save error:", err);
      alert("Error saving profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const name = profile?.name || "Principal";
  const college = profile?.college || "College Management";
  const joined = profile?.joined || "Aug 2015";
  const email = profile?.email || "principal@college.edu";
  const phone = profile?.phone || "+91 98765 43210";

  // Image Upload state synced directly with Database API
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [coverBg, setCoverBg] = useState<string>("linear-gradient(135deg, #4f46e5 0%, #312e81 100%)");

  const saveImageToBackend = async (payload: { avatar?: string; cover_photo?: string }) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/principal/profile/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setProfile(json.data);
      }
    } catch (err) {
      console.error("Failed to save image to backend:", err);
    }
  };

  // Helper function to compress images to crisp lightweight Base64 strings before uploading
  const compressImage = (dataUrl: string, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(dataUrl);
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawUrl = reader.result as string;
        const compressed = await compressImage(rawUrl, 300, 300, 0.85);
        setAvatarSrc(compressed);
        saveImageToBackend({ avatar: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawUrl = reader.result as string;
        const compressed = await compressImage(rawUrl, 1200, 400, 0.85);
        setCoverBg(`url(${compressed}) center/cover no-repeat`);
        saveImageToBackend({ cover_photo: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dash-main min-h-screen" style={{ padding: "28px 32px 48px" }}>
      <div className="dash-content max-w-[1440px] mx-auto">
        
        {/* Banner Header */}
        <div className="dash-welcome-banner mb-8">
          <div className="banner-content">
            <Link href="/principal/dashboard" className="banner-badge hover:underline">
              <ChevronLeft size={13} />
              <span>Back to Dashboard</span>
            </Link>
            <h2>Principal Executive Profile</h2>
            <p>Institutional leadership credentials and account configuration.</p>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="corp-card overflow-hidden mb-8" style={{ padding: 0 }}>
          {/* Cover Photo */}
          <div 
            className="relative h-48 transition-all" 
            style={{ 
              background: profile?.cover_photo 
                ? `url(${profile.cover_photo}) center/cover no-repeat` 
                : coverBg 
            }}
          >
            <div className="absolute right-4 top-4 z-10">
              <label 
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md text-slate-800 dark:text-white border border-white/40 dark:border-slate-700/60 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all" 
                title="Change Background Cover"
              >
                <Camera size={15} />
                <span>Cover Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleCoverChange} 
                />
              </label>
            </div>
          </div>

          {/* Profile Info Area */}
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-indigo-600 text-white flex items-center justify-center overflow-hidden shadow-lg">
                  {avatarSrc || (profile?.avatar && !profile.avatar.includes("dicebear")) ? (
                    <img 
                      src={avatarSrc || profile?.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-extrabold text-4xl select-none tracking-wider">
                      {(() => {
                        const cleanName = name.replace(/^Dr\.\s*/i, '').trim();
                        const parts = cleanName.split(" ").filter(Boolean);
                        if (parts.length >= 2) {
                          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                        }
                        return (cleanName[0] || "P").toUpperCase();
                      })()}
                    </span>
                  )}
                </div>
                <label 
                  className="absolute bottom-1 right-1 p-2 bg-white border border-slate-200 rounded-full shadow-sm text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                  title="Upload Profile Picture"
                >
                  <Camera size={15} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange} 
                  />
                </label>
              </div>

              {/* Name & Basic Info */}
              <div className="flex-1 text-center md:text-left mt-2">
                <h1 className="text-3xl font-bold" style={{ color: "var(--p-text-primary)" }}>{name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm" style={{ color: "var(--p-text-muted)" }}>
                  <span className="flex items-center gap-1.5"><Building2 size={16} /> Principal, {college}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={16} /> India</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setEditEmail(email);
                  setEditPhone(phone);
                  setEditBio(profile?.bio || "");
                  setIsEditModalOpen(true);
                }}
                className="dash-action-btn btn-export"
              >
                <Edit3 size={15} />
                <span className="btn-text">Edit Profile</span>
              </button>
            </div>

            {/* Action Tabs */}
            <div className="flex border-b mt-8" style={{ borderColor: "var(--p-border-table)" }}>
              <button className="px-6 py-3 text-sm font-bold border-b-2" style={{ borderColor: "var(--p-indigo)", color: "var(--p-indigo)" }}>Overview</button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          
          {/* Left Column: Details & Bio */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Contact Section */}
            <div className="corp-card grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: "var(--p-bg-subtle)", borderColor: "var(--p-border, #cbd5e1)" }}>
                <div className="p-2 rounded-lg text-indigo-600 shadow-sm" style={{ background: "var(--p-indigo-soft)" }}><Mail size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold" style={{ color: "var(--p-text-muted)" }}>Email</span>
                  <span className="text-sm font-semibold truncate" style={{ color: "var(--p-text-primary)" }}>{email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: "var(--p-bg-subtle)", borderColor: "var(--p-border, #cbd5e1)" }}>
                <div className="p-2 rounded-lg text-emerald-600 shadow-sm" style={{ background: "var(--p-emerald-soft)" }}><Phone size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold" style={{ color: "var(--p-text-muted)" }}>Phone</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--p-text-primary)" }}>{phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: "var(--p-bg-subtle)", borderColor: "var(--p-border, #cbd5e1)" }}>
                <div className="p-2 rounded-lg text-amber-600 shadow-sm" style={{ background: "var(--p-amber-soft)" }}><Calendar size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold" style={{ color: "var(--p-text-muted)" }}>Joined</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--p-text-primary)" }}>{joined}</span>
                </div>
              </div>
            </div>

            {/* Academic Biography */}
            <div className="corp-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--p-text-primary)" }}>
                  <GraduationCap style={{ color: "var(--p-indigo)" }} /> Academic Biography
                </h3>
                <button 
                  type="button" 
                  onClick={() => {
                    setEditEmail(email);
                    setEditPhone(phone);
                    setEditBio(profile?.bio || "");
                    setIsEditModalOpen(true);
                  }} 
                  className="dash-action-btn"
                  style={{ fontSize: 12, padding: "4px 10px" }}
                >
                  <Edit3 size={13} />
                  <span>Edit Bio</span>
                </button>
              </div>
              <p className="leading-relaxed" style={{ color: "var(--p-text-muted)" }}>
                {profile?.bio || `${name} serves as the Principal at ${college}. With extensive leadership experience in higher education, institutional growth, academic governance, and educational innovation, ${name} oversees administrative operations and student engagement programs.`}
              </p>
            </div>
          </div>

          {/* Right Column: Settings & Security */}
          <div className="space-y-8">
            
            {/* Administration Settings */}
            <div className="corp-card">
              <h3 className="font-bold mb-6 flex items-center gap-2" style={{ color: "var(--p-text-primary)" }}>
                <ShieldCheck size={20} style={{ color: "var(--p-indigo)" }} />
                Account Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ background: "var(--p-bg-subtle)", borderColor: "var(--p-border, #cbd5e1)" }}>
                  <span className="text-xs font-bold uppercase" style={{ color: "var(--p-text-muted)" }}>Username</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--p-text-primary)" }}>{profile?.username || "principal"}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ background: "var(--p-bg-subtle)", borderColor: "var(--p-border, #cbd5e1)" }}>
                  <span className="text-xs font-bold uppercase" style={{ color: "var(--p-text-muted)" }}>Status</span>
                  <span className="status-badge status-active">
                    <span className="status-dot" />
                    {profile?.status || "Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-panel max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <Edit3 size={18} style={{ color: "var(--p-indigo)" }} />
                <h3>Edit Principal Profile</h3>
              </div>
              <button 
                type="button"
                className="password-toggle-btn"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="modal-body">
              {/* Full Name - Fixed/Readonly */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase" style={{ color: "var(--p-text-muted)" }}>
                  Full Name (Fixed)
                </label>
                <input
                  type="text"
                  value={name}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
                  style={{ background: "var(--p-bg-subtle)", color: "var(--p-text-muted)", cursor: "not-allowed", borderColor: "var(--p-border-table)" }}
                />
              </div>

              {/* College Name - Fixed/Readonly */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase" style={{ color: "var(--p-text-muted)" }}>
                  College Name (Fixed)
                </label>
                <input
                  type="text"
                  value={college}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
                  style={{ background: "var(--p-bg-subtle)", color: "var(--p-text-muted)", cursor: "not-allowed", borderColor: "var(--p-border-table)" }}
                />
              </div>

              {/* Join Date - Fixed/Readonly */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase" style={{ color: "var(--p-text-muted)" }}>
                  Join Date (Fixed)
                </label>
                <input
                  type="text"
                  value={joined}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
                  style={{ background: "var(--p-bg-subtle)", color: "var(--p-text-muted)", cursor: "not-allowed", borderColor: "var(--p-border-table)" }}
                />
              </div>

              {/* Email Address - Editable */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase" style={{ color: "var(--p-text-primary)" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ background: "var(--p-bg-card)", color: "var(--p-text-primary)", borderColor: "var(--p-indigo)" }}
                />
              </div>

              {/* Mobile Phone - Editable */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase" style={{ color: "var(--p-text-primary)" }}>
                  Mobile Phone
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ background: "var(--p-bg-card)", color: "var(--p-text-primary)", borderColor: "var(--p-indigo)" }}
                />
              </div>

              {/* Academic Biography - Editable */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase" style={{ color: "var(--p-text-primary)" }}>
                  Academic Biography
                </label>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Write your academic biography, qualifications, and vision..."
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none resize-none"
                  style={{ background: "var(--p-bg-card)", color: "var(--p-text-primary)", borderColor: "var(--p-indigo)" }}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--p-border-table)" }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="dash-action-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="dash-action-btn btn-export"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
