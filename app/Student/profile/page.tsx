"use client";

import React from "react";
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
    PlusCircle,
    User,
    Lock,
    Shield,
    ChevronRight,
} from "lucide-react";
import "./profile.css";

export default function StudentProfilePage() {
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
                    <button className="notification-btn">
                        <Bell size={18} />
                        <span className="notification-badge">3</span>
                    </button>

                    <div className="user-pill">
                        <div className="user-avatar-small">A</div>
                        <div className="user-meta">
                            <span className="user-name">Arun Kumar</span>
                            <span className="user-year">II Year</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Profile Banner Card */}
            <section className="profile-hero-card">
                <div className="hero-left">
                    <div className="avatar-wrapper">
                        <div className="avatar-large">A</div>
                        <button className="camera-btn" title="Change Photo">
                            <Camera size={14} />
                        </button>
                    </div>

                    <div className="hero-main-info">
                        <div className="name-status-row">
                            <h2>Arun Kumar</h2>
                            <span className="status-chip chip-active">ACTIVE</span>
                        </div>
                        <span className="username-text">ARUNKU140</span>

                        <div className="contact-meta-list">
                            <div className="meta-item">
                                <Mail size={14} />
                                <span>arun.kumar@student.edu</span>
                            </div>
                            <div className="meta-item">
                                <Phone size={14} />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="meta-item">
                                <Calendar size={14} />
                                <span>Member since 15 Aug 2024</span>
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
                            <span className="acad-val">II Year</span>
                        </div>

                        <div className="academic-row">
                            <span className="acad-label">
                                <Building2 size={15} /> College
                            </span>
                            <span className="colon">:</span>
                            <span className="acad-val">ABC College of Engineering</span>
                        </div>

                        <div className="academic-row">
                            <span className="acad-label">
                                <Building2 size={15} /> Department
                            </span>
                            <span className="colon">:</span>
                            <span className="acad-val">Computer Science & Engineering</span>
                        </div>

                        <div className="academic-row">
                            <span className="acad-label">
                                <User size={15} /> Mentor / HOD
                            </span>
                            <span className="colon">:</span>
                            <span className="acad-val">Dr. Priya Sharma</span>
                        </div>
                    </div>

                    <button className="edit-profile-btn">
                        <Edit size={14} />
                        <span>Edit Profile</span>
                    </button>
                </div>
            </section>

            {/* Middle Row: Learning Stats + Recent Activity */}
            <div className="grid-two-columns">
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
                                <div className="stat-number">6</div>
                                <div className="stat-text">Total Videos</div>
                            </div>
                        </div>

                        <div className="stat-box">
                            <div className="stat-icon-wrap icon-emerald-bg">
                                <CheckCircle2 size={18} />
                            </div>
                            <div>
                                <div className="stat-number">1</div>
                                <div className="stat-text">Completed</div>
                            </div>
                        </div>

                        <div className="stat-box">
                            <div className="stat-icon-wrap icon-amber-bg">
                                <Clock size={18} />
                            </div>
                            <div>
                                <div className="stat-number">5</div>
                                <div className="stat-text">Pending</div>
                            </div>
                        </div>

                        <div className="stat-box">
                            <div className="stat-icon-wrap icon-purple-bg">
                                <Activity size={18} />
                            </div>
                            <div>
                                <div className="stat-number">0.3h</div>
                                <div className="stat-text">Watch Hours</div>
                            </div>
                        </div>
                    </div>

                    <Link href="/Student/progress" className="view-progress-link">
                        <span>View My Progress</span>
                        <ArrowRight size={15} />
                    </Link>
                </div>

                {/* Recent Activity Card */}
                <div className="profile-card">
                    <div className="card-header-row">
                        <div className="card-title-group">
                            <Activity size={18} className="icon-purple" />
                            <h3>Recent Activity</h3>
                        </div>
                        <button className="text-action-btn">View All</button>
                    </div>

                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon-wrap purple">
                                <PlayCircle size={16} />
                            </div>
                            <div className="activity-desc">
                                Watched Introduction to Python Programming
                            </div>
                            <div className="activity-time">5 days ago</div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon-wrap emerald">
                                <CheckCircle2 size={16} />
                            </div>
                            <div className="activity-desc">
                                Completed Data Structures Using Python
                            </div>
                            <div className="activity-time">1 week ago</div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon-wrap amber">
                                <Clock size={16} />
                            </div>
                            <div className="activity-desc">
                                Started Digital Electronics Basics
                            </div>
                            <div className="activity-time">1 week ago</div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon-wrap blue">
                                <PlusCircle size={16} />
                            </div>
                            <div className="activity-desc">
                                Added to watchlist Engineering Mathematics
                            </div>
                            <div className="activity-time">2 weeks ago</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Account Information + Quick Actions */}
            <div className="grid-two-columns">
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
                            <span className="info-value">ARUNKU140</span>
                        </div>

                        <div className="info-pair">
                            <span className="info-label">Account Status</span>
                            <span className="info-colon">:</span>
                            <span className="status-chip chip-active-sm">Active</span>
                        </div>

                        <div className="info-pair">
                            <span className="info-label">Email</span>
                            <span className="info-colon">:</span>
                            <span className="info-value">arun.kumar@student.edu</span>
                        </div>

                        <div className="info-pair">
                            <span className="info-label">Member Since</span>
                            <span className="info-colon">:</span>
                            <span className="info-value">15 Aug 2024</span>
                        </div>

                        <div className="info-pair">
                            <span className="info-label">Phone</span>
                            <span className="info-colon">:</span>
                            <span className="info-value">+91 98765 43210</span>
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
                        <button className="action-row-btn">
                            <div className="action-left">
                                <div className="action-icon-square purple">
                                    <Edit size={16} />
                                </div>
                                <div className="action-text">
                                    <span className="action-title">Edit Profile</span>
                                    <span className="action-sub">
                                        Update your personal details
                                    </span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="chevron-icon" />
                        </button>

                        <button className="action-row-btn">
                            <div className="action-left">
                                <div className="action-icon-square blue">
                                    <Lock size={16} />
                                </div>
                                <div className="action-text">
                                    <span className="action-title">Change Password</span>
                                    <span className="action-sub">
                                        Update your account password
                                    </span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="chevron-icon" />
                        </button>

                        <button className="action-row-btn">
                            <div className="action-left">
                                <div className="action-icon-square amber">
                                    <Bell size={16} />
                                </div>
                                <div className="action-text">
                                    <span className="action-title">Notification Settings</span>
                                    <span className="action-sub">
                                        Manage your notification preferences
                                    </span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="chevron-icon" />
                        </button>

                        <button className="action-row-btn">
                            <div className="action-left">
                                <div className="action-icon-square emerald">
                                    <Shield size={16} />
                                </div>
                                <div className="action-text">
                                    <span className="action-title">Privacy Settings</span>
                                    <span className="action-sub">
                                        Manage your privacy preferences
                                    </span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="chevron-icon" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}