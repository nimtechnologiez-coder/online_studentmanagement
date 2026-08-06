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
  GraduationCap, 
  Building2,
  BookOpen,
  X
} from "lucide-react";
import "../performance/performance.css";

interface HodProfileData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  college: string;
  joined: string;
  avatar: string;
  cover_photo?: string;
  bio: string;
  username: string;
  status: string;
}

export default function HodProfilePage() {
  const [profile, setProfile] = useState<HodProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states for modal
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);

  // Local state for instant image preview with persistence
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [coverBg, setCoverBg] = useState<string>("linear-gradient(135deg, #4f46e5 0%, #312e81 100%)");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const savedHod = typeof window !== "undefined" ? localStorage.getItem("hod") || sessionStorage.getItem("hod") : null;
      let hodId = "";
      if (savedHod) {
        try {
          const parsed = JSON.parse(savedHod);
          hodId = parsed?.id || "";
        } catch (e) {}
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (hodId) headers["X-Hod-Id"] = String(hodId);

      const res = await fetch(`${API_BASE}/api/hod/profile/`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      const json = await res.json();
      if (json.status === "success" && json.data) {
        setProfile(json.data);
        setEditEmail(json.data.email || "hod@college.edu");
        setEditPhone(json.data.phone || "+91 98765 43210");
        setEditBio(json.data.bio || "");
      }
    } catch (err) {
      console.error("Failed to load HOD profile from API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveProfileToApi = async (payload: Partial<HodProfileData>) => {
    try {
      setSaving(true);
      const savedHod = typeof window !== "undefined" ? localStorage.getItem("hod") || sessionStorage.getItem("hod") : null;
      let hodId = "";
      if (savedHod) {
        try {
          const parsed = JSON.parse(savedHod);
          hodId = parsed?.id || "";
        } catch (e) {}
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (hodId) headers["X-Hod-Id"] = String(hodId);

      const res = await fetch(`${API_BASE}/api/hod/profile/`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.status === "success" && json.data) {
        setProfile(json.data);
        setIsEditModalOpen(false);
      } else {
        alert(json.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Failed to save profile to backend:", err);
      alert("Error saving profile changes.");
    } finally {
      setSaving(false);
    }
  };

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
        saveProfileToApi({ avatar: compressed });
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
        saveProfileToApi({ cover_photo: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfileToApi({
      email: editEmail,
      phone: editPhone,
      bio: editBio,
    });
  };

  const name = profile?.name || "Head of Department";
  const department = profile?.department || "Department";
  const college = profile?.college || "College Management";
  const joined = profile?.joined || "Aug 2018";
  const email = profile?.email || "hod@college.edu";
  const phone = profile?.phone || "+91 98765 43210";

  return (
    <div className="dash-main">
      <div className="dash-content">
        
        {/* Banner Header */}
        <div className="dash-welcome-banner mb-8">
          <div className="banner-content">
            <Link href="/hod/dashboard" className="banner-badge hover:underline">
              <ChevronLeft size={13} />
              <span>Back to Dashboard</span>
            </Link>
            <h2>Department HOD Profile</h2>
            <p>Departmental academic leadership, credentials, and account configuration.</p>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="corp-card overflow-hidden mb-8" style={{ padding: 0 }}>
          {/* Cover Photo */}
          <div 
            className="relative h-48 transition-all" 
            style={{ background: coverBg }}
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
                        return (cleanName[0] || "H").toUpperCase();
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
                  <span className="flex items-center gap-1.5"><BookOpen size={16} /> HOD, {department}</span>
                  <span className="flex items-center gap-1.5"><Building2 size={16} /> {college}</span>
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

          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Quick Contact Section */}
          <div className="corp-card flex flex-col justify-center gap-4">
            <h3 className="font-bold flex items-center gap-2 mb-2" style={{ color: "var(--p-text-primary)" }}>
              <Mail size={18} style={{ color: "var(--p-indigo)" }} />
              Quick Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl gap-4 border" style={{ background: "var(--p-bg-subtle)", borderColor: "var(--p-border, #cbd5e1)" }}>
                <span className="text-xs font-bold uppercase shrink-0" style={{ color: "var(--p-text-muted)" }}>Email</span>
                <span className="text-sm font-semibold text-right truncate" style={{ color: "var(--p-text-primary)" }}>{email}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl gap-4 border" style={{ background: "var(--p-bg-subtle)", borderColor: "var(--p-border, #cbd5e1)" }}>
                <span className="text-xs font-bold uppercase shrink-0" style={{ color: "var(--p-text-muted)" }}>Phone</span>
                <span className="text-sm font-semibold text-right" style={{ color: "var(--p-text-primary)" }}>{phone}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl gap-4 border" style={{ background: "var(--p-bg-subtle)", borderColor: "var(--p-border, #cbd5e1)" }}>
                <span className="text-xs font-bold uppercase shrink-0" style={{ color: "var(--p-text-muted)" }}>Joined</span>
                <span className="text-sm font-semibold text-right" style={{ color: "var(--p-text-primary)" }}>{joined}</span>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="corp-card flex flex-col justify-center gap-4">
            <h3 className="font-bold flex items-center gap-2 mb-2" style={{ color: "var(--p-text-primary)" }}>
              <ShieldCheck size={18} style={{ color: "var(--p-indigo)" }} />
              Account Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl gap-4 border" style={{ background: "var(--p-bg-subtle)", borderColor: "var(--p-border, #cbd5e1)" }}>
                <span className="text-xs font-bold uppercase shrink-0" style={{ color: "var(--p-text-muted)" }}>Username</span>
                <span className="text-sm font-semibold text-right" style={{ color: "var(--p-text-primary)" }}>{profile?.username || "hod_admin"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl gap-4 border" style={{ background: "var(--p-bg-subtle)", borderColor: "var(--p-border, #cbd5e1)" }}>
                <span className="text-xs font-bold uppercase shrink-0" style={{ color: "var(--p-text-muted)" }}>Department</span>
                <span className="text-sm font-semibold text-right leading-snug" style={{ color: "var(--p-text-primary)", maxWidth: "60%" }}>{department}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl gap-4 border" style={{ background: "var(--p-bg-subtle)", borderColor: "var(--p-border, #cbd5e1)" }}>
                <span className="text-xs font-bold uppercase shrink-0" style={{ color: "var(--p-text-muted)" }}>Status</span>
                <span className="status-badge status-active">
                  <span className="status-dot" />
                  {profile?.status || "Active"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Biography Section */}
        <div className="corp-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--p-text-primary)" }}>
              <GraduationCap size={18} style={{ color: "var(--p-indigo)" }} />
              Academic Biography
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
          <p className="text-sm leading-relaxed" style={{ color: "var(--p-text-muted)" }}>
            {profile?.bio || `${name} is the Head of Department for ${department} at ${college}.`}
          </p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-panel max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <Edit3 size={18} style={{ color: "var(--p-indigo)" }} />
                <h3>Edit HOD Profile</h3>
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
              {/* HOD Name - Fixed/Readonly */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase" style={{ color: "var(--p-text-muted)" }}>
                  HOD Name (Fixed)
                </label>
                <input
                  type="text"
                  value={name}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
                  style={{ background: "var(--p-bg-subtle)", color: "var(--p-text-muted)", cursor: "not-allowed", borderColor: "var(--p-border-table)" }}
                />
              </div>

              {/* Department Name - Fixed/Readonly */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase" style={{ color: "var(--p-text-muted)" }}>
                  Department (Fixed)
                </label>
                <input
                  type="text"
                  value={department}
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
                  placeholder="Write academic biography..."
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
