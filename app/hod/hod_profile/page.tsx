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

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://online-management-backend.onrender.com";

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const savedHod = typeof window !== "undefined" ? localStorage.getItem("hod") || sessionStorage.getItem("hod") : null;
      let hodId = "";
      if (savedHod) {
        try {
          const parsed = JSON.parse(savedHod);
          hodId = parsed?.id || "";
        } catch (e) { }
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
        if (json.data.cover_photo) {
          setCoverBg(`url(${json.data.cover_photo}) center/cover no-repeat`);
        }
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
        } catch (e) { }
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
            className="relative h-36 md:h-48 transition-all"
            style={{ background: coverBg }}
          >
            <div className="absolute right-3 top-3 md:right-4 md:top-4 z-10">
              <label
                className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-1 md:px-3 md:py-1.5 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md text-slate-800 dark:text-white border border-white/40 dark:border-slate-700/60 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
                title="Change Background Cover"
              >
                <Camera size={14} className="shrink-0" />
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
          <div className="px-4 pb-6 md:px-8 md:pb-8 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-12 md:-mt-16">
              {/* Avatar */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-indigo-600 text-white flex items-center justify-center overflow-hidden shadow-lg">
                  {avatarSrc || (profile?.avatar && !profile.avatar.includes("dicebear")) ? (
                    <img
                      src={avatarSrc || profile?.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-extrabold text-2xl md:text-4xl select-none tracking-wider">
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
                  className="absolute bottom-0 right-0 md:bottom-1 md:right-1 p-1.5 md:p-2 bg-white border border-slate-200 rounded-full shadow-sm text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                  title="Upload Profile Picture"
                >
                  <Camera size={14} className="shrink-0" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              {/* Name & Basic Info */}
              <div className="flex-1 text-center md:text-left mt-1 md:mt-2 w-full">
                <h1 className="text-xl md:text-3xl font-bold" style={{ color: "var(--p-text-primary)" }}>{name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 md:gap-4 mt-2 text-xs md:text-sm" style={{ color: "var(--p-text-muted)" }}>
                  <span className="inline-flex items-center gap-1.5 shrink-0 text-center"><BookOpen size={15} className="shrink-0" /> HOD, {department}</span>
                  <span className="inline-flex items-center justify-center gap-1.5 text-center leading-tight"><Building2 size={15} className="shrink-0" /> {college}</span>
                  <span className="inline-flex items-center gap-1.5 shrink-0 text-center"><MapPin size={15} className="shrink-0" /> India</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditEmail(email);
                  setEditPhone(phone);
                  setEditBio(profile?.bio || "");
                  setIsEditModalOpen(true);
                }}
                className="dash-action-btn btn-export shrink-0"
              >
                <Edit3 size={15} className="shrink-0" />
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
            <div className="hod-profile-rows-container">
              <div className="hod-profile-data-row">
                <span className="hod-profile-row-label">Email</span>
                <span className="hod-profile-row-value truncate">{email}</span>
              </div>
              <div className="hod-profile-data-row">
                <span className="hod-profile-row-label">Phone</span>
                <span className="hod-profile-row-value">{phone}</span>
              </div>
              <div className="hod-profile-data-row">
                <span className="hod-profile-row-label">Joined</span>
                <span className="hod-profile-row-value">{joined}</span>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="corp-card flex flex-col justify-center gap-4">
            <h3 className="font-bold flex items-center gap-2 mb-2" style={{ color: "var(--p-text-primary)" }}>
              <ShieldCheck size={18} style={{ color: "var(--p-indigo)" }} />
              Account Details
            </h3>

            <div className="hod-profile-rows-container">
              <div className="hod-profile-data-row">
                <span className="hod-profile-row-label">Username</span>
                <span className="hod-profile-row-value">{profile?.username || "hod_admin"}</span>
              </div>

              <div className="hod-profile-data-row">
                <span className="hod-profile-row-label">Department</span>
                <span className="hod-profile-row-value leading-snug" style={{ maxWidth: "60%" }}>{department}</span>
              </div>

              <div className="hod-profile-data-row">
                <span className="hod-profile-row-label">Status</span>
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
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg max-h-[calc(100vh-32px)] md:max-h-[85vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto"
            style={{ background: "var(--p-bg-card, #0f172a)", borderColor: "var(--p-border, #1e293b)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Fixed at top) */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b shrink-0"
              style={{ borderColor: "var(--p-border-table, #1e293b)", background: "var(--p-bg-card, #0f172a)" }}
            >
              <div className="flex items-center gap-2.5">
                <Edit3 size={18} style={{ color: "var(--p-indigo, #4f46e5)" }} />
                <h3 className="font-bold text-base md:text-lg" style={{ color: "var(--p-text-primary, #ffffff)" }}>
                  Edit HOD Profile
                </h3>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Content (Scrollable) */}
            <form onSubmit={handleSaveProfile} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Write academic biography..."
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none resize-none"
                    style={{ background: "var(--p-bg-card)", color: "var(--p-text-primary)", borderColor: "var(--p-indigo)" }}
                  />
                </div>
              </div>

              {/* Modal Footer (Fixed at bottom) */}
              <div
                className="flex items-center justify-end gap-3 px-5 py-4 border-t shrink-0"
                style={{ borderColor: "var(--p-border-table, #1e293b)", background: "var(--p-bg-card, #0f172a)" }}
              >
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
