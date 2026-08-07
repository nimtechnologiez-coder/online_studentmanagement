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
  X
} from "lucide-react";
import "./PrincipalProfile.css";

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
  cover_photo?: string;
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

  // Helper to get headers with X-Principal-Id
  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    try {
      const saved =
        typeof window !== "undefined"
          ? localStorage.getItem("principal") || sessionStorage.getItem("principal")
          : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id) {
          headers["X-Principal-Id"] = String(parsed.id);
        }
      }
    } catch (e) {
      console.error("Error reading saved principal for headers:", e);
    }
    return headers;
  };

  // Fetch real profile data from Django API
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      let res: Response;
      try {
        res = await fetch("/api/principal/profile/", { method: "GET", headers, credentials: "include" });
      } catch (_) {
        res = await fetch("http://127.0.0.1:8000/api/principal/profile/", { method: "GET", headers, credentials: "include" });
      }
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
      const headers = getAuthHeaders();
      const body = JSON.stringify({
        email: editEmail,
        phone: editPhone,
        bio: editBio,
      });
      let res: Response;
      try {
        res = await fetch("/api/principal/profile/", { method: "POST", headers, credentials: "include", body });
      } catch (_) {
        res = await fetch("http://127.0.0.1:8000/api/principal/profile/", { method: "POST", headers, credentials: "include", body });
      }
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
  const [coverBg, setCoverBg] = useState<string>("linear-gradient(135deg, #2563eb 0%, #1e40af 100%)");

  const saveImageToBackend = async (payload: { avatar?: string; cover_photo?: string }) => {
    try {
      const headers = getAuthHeaders();
      const body = JSON.stringify(payload);
      let res: Response;
      try {
        res = await fetch("/api/principal/profile/", { method: "POST", headers, credentials: "include", body });
      } catch (_) {
        res = await fetch("http://127.0.0.1:8000/api/principal/profile/", { method: "POST", headers, credentials: "include", body });
      }
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setProfile(json.data);
      }
    } catch (err) {
      console.error("Failed to save image to backend:", err);
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
    <div className="p-profile-page-shell">
      {/* Banner Header */}
      <div className="p-profile-banner">
        <Link href="/principal/dashboard" className="p-profile-back-link">
          <ChevronLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
        <h2 className="p-profile-banner-title">Principal Executive Profile</h2>
        <p className="p-profile-banner-desc">Institutional leadership credentials and account configuration.</p>
      </div>

      {/* Hero Header Card */}
      <div className="p-profile-hero-card">
        <div 
          className="p-profile-cover-box" 
          style={{ 
            background: profile?.cover_photo 
              ? `url(${profile.cover_photo}) center/cover no-repeat` 
              : coverBg 
          }}
        >
          <label className="p-profile-cover-btn" title="Change Cover Photo">
            <Camera size={14} />
            <span>Cover Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </label>
        </div>

        <div className="p-profile-info-body">
          <div className="p-profile-avatar-row">
            <div className="p-profile-avatar-wrapper">
              <div className="p-profile-avatar-circle">
                {avatarSrc || (profile?.avatar && !profile.avatar.includes("dicebear")) ? (
                  <img src={avatarSrc || profile?.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>
                    {(() => {
                      const cleanName = name.replace(/^Dr\.\s*/i, '').trim();
                      const parts = cleanName.split(" ").filter(Boolean);
                      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                      return (cleanName[0] || "P").toUpperCase();
                    })()}
                  </span>
                )}
              </div>
              <label className="p-profile-avatar-upload-icon" title="Upload Profile Picture">
                <Camera size={14} />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>

            <div className="p-profile-meta">
              <h1 className="p-profile-name">{name}</h1>
              <div className="p-profile-sub-badges">
                <span className="p-profile-badge-item"><Building2 size={15} /> Principal, {college}</span>
                <span className="p-profile-badge-item"><MapPin size={15} /> India</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setEditEmail(email);
                setEditPhone(phone);
                setEditBio(profile?.bio || "");
                setIsEditModalOpen(true);
              }}
              className="p-profile-edit-trigger"
            >
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="p-profile-tabs">
            <button className="p-profile-tab-active">Overview</button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-profile-grid-layout">
        {/* Left Column Stack */}
        <div className="p-profile-col-stack">
          {/* Contact Information Card */}
          <div className="p-profile-card">
            <div className="p-profile-card-header">
              <h3 className="p-profile-card-title">
                <Mail size={18} className="p-profile-card-title-icon" />
                Contact Information
              </h3>
            </div>
            <div className="p-profile-rows-container">
              <div className="p-profile-data-row">
                <div className="p-profile-data-label-group">
                  <div className="p-profile-row-icon-box" style={{ background: "rgba(37, 99, 235, 0.12)", color: "#2563eb" }}>
                    <Mail size={16} />
                  </div>
                  <span className="p-profile-row-label">Email</span>
                </div>
                <span className="p-profile-row-value">{email}</span>
              </div>

              <div className="p-profile-data-row">
                <div className="p-profile-data-label-group">
                  <div className="p-profile-row-icon-box" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
                    <Phone size={16} />
                  </div>
                  <span className="p-profile-row-label">Phone</span>
                </div>
                <span className="p-profile-row-value">{phone}</span>
              </div>

              <div className="p-profile-data-row">
                <div className="p-profile-data-label-group">
                  <div className="p-profile-row-icon-box" style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}>
                    <Calendar size={16} />
                  </div>
                  <span className="p-profile-row-label">Joined</span>
                </div>
                <span className="p-profile-row-value">{joined}</span>
              </div>
            </div>
          </div>

          {/* Academic Biography Card */}
          <div className="p-profile-card">
            <div className="p-profile-card-header">
              <h3 className="p-profile-card-title">
                <GraduationCap size={18} className="p-profile-card-title-icon" />
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
                className="p-profile-edit-trigger"
                style={{ fontSize: 12, padding: "4px 10px", borderRadius: 8 }}
              >
                <Edit3 size={13} />
                <span>Edit Bio</span>
              </button>
            </div>
            <p className="p-profile-bio-text">
              {profile?.bio || `${name} serves as the Principal at ${college}. With extensive leadership experience in higher education, institutional growth, academic governance, and educational innovation, ${name} oversees administrative operations and student engagement programs.`}
            </p>
          </div>
        </div>

        {/* Right Column Stack */}
        <div className="p-profile-col-stack">
          {/* Account Details Card */}
          <div className="p-profile-card">
            <div className="p-profile-card-header">
              <h3 className="p-profile-card-title">
                <ShieldCheck size={18} className="p-profile-card-title-icon" />
                Account Details
              </h3>
            </div>
            
            <div className="p-profile-rows-container">
              <div className="p-profile-data-row">
                <span className="p-profile-row-label">Username</span>
                <span className="p-profile-row-value">{profile?.username || "principal"}</span>
              </div>
              
              <div className="p-profile-data-row">
                <span className="p-profile-row-label">Status</span>
                <span className="p-profile-status-pill">
                  <span className="p-profile-status-dot" />
                  {profile?.status || "Active"}
                </span>
              </div>

              <div className="p-profile-data-row">
                <span className="p-profile-row-label">Role</span>
                <span className="p-profile-row-value">Institutional Principal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="p-profile-modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="p-profile-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--p-border, #1e293b)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Edit3 size={18} style={{ color: "#2563eb" }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Edit Principal Profile</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "var(--p-text-muted)", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "var(--p-text-muted)" }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1px solid var(--p-border, #1e293b)", background: "var(--p-bg-subtle)", color: "var(--p-text-primary)", fontSize: 14 }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "var(--p-text-muted)" }}>Mobile Phone</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1px solid var(--p-border, #1e293b)", background: "var(--p-bg-subtle)", color: "var(--p-text-primary)", fontSize: 14 }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "var(--p-text-muted)" }}>Academic Biography</label>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1px solid var(--p-border, #1e293b)", background: "var(--p-bg-subtle)", color: "var(--p-text-primary)", fontSize: 14, resize: "none" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, paddingTop: 12, borderTop: "1px solid var(--p-border, #1e293b)" }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid var(--p-border, #1e293b)", background: "transparent", color: "var(--p-text-primary)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: "#2563eb", color: "#ffffff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
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
