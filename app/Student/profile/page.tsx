"use client";

import React, { useState, useEffect } from "react";
import { studentFetch } from "../studentFetch";
import Link from "next/link";
import {
    Bell,
    Camera,
    Edit,
    GraduationCap,
    Building2,
    UserCheck,
    Calendar,
    Mail,
    Phone,
    Video,
    CheckCircle2,
    Clock,
    Activity,
    ArrowRight,
    TrendingUp,
    PlayCircle,
    User,
    Lock,
    Shield,
    ChevronRight,
    Loader2,
    AlertCircle
} from "lucide-react";
import "./profile.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://online-management-backend.onrender.com";

function getStudentData() {
    if (typeof window === "undefined") return null;
    try {
        const saved = localStorage.getItem("student") || sessionStorage.getItem("student");
        if (saved) return JSON.parse(saved);
    } catch (e) { }
    return null;
}

export default function StudentProfilePage() {
    const [student, setStudent] = useState<any>(null);
    const [stats, setStats] = useState<any>({
        totalVideos: 0,
        completed: 0,
        pending: 0,
        watchHours: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const sData = getStudentData();
        if (sData) setStudent(sData);
        fetchProfileData(sData?.id || 0);
    }, []);

    async function fetchProfileData(studentId: number) {
        try {
            setLoading(true);
            setError("");
            const res = await studentFetch("/api/student/progress/");
            const data = await res.json();
            if (data.status === "success") {
                if (data.student) {
                    setStudent((prev: any) => (prev ? { ...prev, ...data.student } : data.student));
                }
                if (data.stats) setStats(data.stats);
            } else {
                setError(data.message || "Failed to load profile data.");
            }
        } catch (e) {
            setError("Could not connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const studentName = student?.full_name || student?.username || "Student";
    const studentInitial = studentName.charAt(0).toUpperCase();
    const regNo = student?.username || student?.student_id || "STUDENT";
    const departmentName = student?.department_name || student?.department || "Academic Department";
    const collegeName = student?.college_name || student?.college || "College of Engineering";
    const emailAddr = student?.email || "—";
    const mobileNo = student?.phone || "—";
    const joinDateStr = student?.join_date || "—";
    const mentorName = student?.hod_name || "—";
    const yearLabel = student?.year || "I";
    const statusText = student?.status ? String(student.status).toUpperCase() : "ACTIVE";

    return (
        <div className="profile-container">
            {/* Top Header */}
            <header className="profile-header">
                <div>
                    <h1 className="profile-title">My Profile</h1>
                    <p className="profile-subtitle">
                        Manage your personal information and account settings
                    </p>
                </div>

                <div className="header-user-section">
                    <div className="user-pill">
                        <div className="user-avatar-small">{studentInitial}</div>
                        <div className="user-meta">
                            <span className="user-name">{studentName}</span>
                            <span className="user-year">{yearLabel} Year</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium mb-4">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    {error}
                    <button
                        onClick={() => fetchProfileData(student?.id || 0)}
                        className="ml-auto text-xs font-bold bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Loading Skeleton - Principal Dashboard Style */}
            {loading && (
                <div className="dash-skeleton-wrapper my-6">
                    <div className="dash-skeleton-banner skeleton-shimmer" />
                    <div className="dash-skeleton-kpi-grid">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="dash-skeleton-kpi-card skeleton-shimmer" />
                        ))}
                    </div>
                    <div className="dash-skeleton-charts-row">
                        <div className="dash-skeleton-chart-large skeleton-shimmer" />
                        <div className="dash-skeleton-chart-small skeleton-shimmer" />
                    </div>
                </div>
            )}

            {!loading && (
                <>
                    {/* Hero Profile Banner Card */}
                    <section className="profile-hero-card">
                        <div className="hero-left">
                            <div className="avatar-wrapper">
                                <div className="avatar-large">{studentInitial}</div>
                            </div>

                            <div className="hero-main-info">
                                <div className="name-status-row">
                                    <h2>{studentName}</h2>
                                    <span className="status-chip chip-active">{statusText}</span>
                                </div>
                                <span className="username-text">ID: {regNo}</span>

                                <div className="contact-meta-list">
                                    <div className="meta-item">
                                        <Mail size={14} />
                                        <span>{emailAddr}</span>
                                    </div>
                                    {mobileNo && mobileNo !== "—" && (
                                        <div className="meta-item">
                                            <Phone size={14} />
                                            <span>{mobileNo}</span>
                                        </div>
                                    )}
                                    <div className="meta-item">
                                        <Calendar size={14} />
                                        <span>Registered on {joinDateStr}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hero-right">
                            <div className="academic-grid">
                                <div className="academic-row">
                                    <span className="acad-label">
                                        <GraduationCap size={15} /> Academic Year
                                    </span>
                                    <span className="colon">:</span>
                                    <span className="acad-val">2026</span>
                                </div>

                                <div className="academic-row">
                                    <span className="acad-label">
                                        <UserCheck size={15} /> Year / Class
                                    </span>
                                    <span className="colon">:</span>
                                    <span className="acad-val">{yearLabel} Year</span>
                                </div>

                                <div className="academic-row">
                                    <span className="acad-label">
                                        <Building2 size={15} /> College
                                    </span>
                                    <span className="colon">:</span>
                                    <span className="acad-val">{collegeName}</span>
                                </div>

                                <div className="academic-row">
                                    <span className="acad-label">
                                        <Building2 size={15} /> Department
                                    </span>
                                    <span className="colon">:</span>
                                    <span className="acad-val">{departmentName}</span>
                                </div>

                                <div className="academic-row">
                                    <span className="acad-label">
                                        <User size={15} /> Mentor / HOD
                                    </span>
                                    <span className="colon">:</span>
                                    <span className="acad-val">{mentorName}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Profile Cards Grid: Learning Stats, Account Info, Quick Actions */}
                    <div className="grid-three-columns">
                        {/* Learning Stats Card */}
                        <div className="profile-card">
                            <div className="card-header-row">
                                <div className="card-title-group">
                                    <TrendingUp size={18} className="icon-purple" />
                                    <h3>Learning Stats</h3>
                                </div>
                            </div>

                            <div className="stats-2x2-grid">
                                <div className="stat-box">
                                    <div className="stat-icon-wrap icon-blue-bg">
                                        <Video size={18} />
                                    </div>
                                    <div>
                                        <div className="stat-number">{stats.totalVideos ?? 0}</div>
                                        <div className="stat-text">Total Videos</div>
                                    </div>
                                </div>

                                <div className="stat-box">
                                    <div className="stat-icon-wrap icon-emerald-bg">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <div>
                                        <div className="stat-number">{stats.completed ?? 0}</div>
                                        <div className="stat-text">Completed</div>
                                    </div>
                                </div>

                                <div className="stat-box">
                                    <div className="stat-icon-wrap icon-amber-bg">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <div className="stat-number">{stats.pending ?? 0}</div>
                                        <div className="stat-text">Pending</div>
                                    </div>
                                </div>

                                <div className="stat-box">
                                    <div className="stat-icon-wrap icon-purple-bg">
                                        <Activity size={18} />
                                    </div>
                                    <div>
                                        <div className="stat-number">{stats.watchHours ?? 0}h</div>
                                        <div className="stat-text">Watch Hours</div>
                                    </div>
                                </div>
                            </div>

                            <Link href="/Student/MyProgress" className="view-progress-link">
                                <span>View Detailed Analytics</span>
                                <ArrowRight size={15} />
                            </Link>
                        </div>

                        {/* Account Information Card */}
                        <div className="profile-card">
                            <div className="card-header-row">
                                <div className="card-title-group">
                                    <User size={18} className="icon-purple" />
                                    <h3>Account Information</h3>
                                </div>
                            </div>

                            <div className="account-info-grid">
                                <div className="info-pair">
                                    <span className="info-label">Username</span>
                                    <span className="info-colon">:</span>
                                    <span className="info-value">{regNo}</span>
                                </div>

                                <div className="info-pair">
                                    <span className="info-label">Account Status</span>
                                    <span className="info-colon">:</span>
                                    <span className="status-chip chip-active-sm">{statusText}</span>
                                </div>

                                <div className="info-pair">
                                    <span className="info-label">Email</span>
                                    <span className="info-colon">:</span>
                                    <span className="info-value">{emailAddr}</span>
                                </div>

                                <div className="info-pair">
                                    <span className="info-label">Member Since</span>
                                    <span className="info-colon">:</span>
                                    <span className="info-value">{joinDateStr}</span>
                                </div>

                                <div className="info-pair">
                                    <span className="info-label">Phone</span>
                                    <span className="info-colon">:</span>
                                    <span className="info-value">{mobileNo}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="profile-card">
                            <div className="card-header-row">
                                <div className="card-title-group">
                                    <Activity size={18} className="icon-purple" />
                                    <h3>Quick Actions</h3>
                                </div>
                            </div>

                            <div className="quick-actions-list">
                                <Link href="/Student/MyVideos" className="action-row-btn">
                                    <div className="action-left">
                                        <div className="action-icon-square purple">
                                            <Video size={16} />
                                        </div>
                                        <div className="action-text">
                                            <span className="action-title">Browse Video Lectures</span>
                                            <span className="action-sub">
                                                Watch assigned course materials
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="chevron-icon" />
                                </Link>

                                <Link href="/Student/WatchHistory" className="action-row-btn">
                                    <div className="action-left">
                                        <div className="action-icon-square blue">
                                            <Clock size={16} />
                                        </div>
                                        <div className="action-text">
                                            <span className="action-title">Watch History</span>
                                            <span className="action-sub">
                                                Review past video sessions
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="chevron-icon" />
                                </Link>

                                <Link href="/Student/MyProgress" className="action-row-btn">
                                    <div className="action-left">
                                        <div className="action-icon-square emerald">
                                            <TrendingUp size={16} />
                                        </div>
                                        <div className="action-text">
                                            <span className="action-title">My Learning Progress</span>
                                            <span className="action-sub">
                                                Check course completion analytics
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="chevron-icon" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}