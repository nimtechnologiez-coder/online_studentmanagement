"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Video,
  Building2,
  User,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  Eye,
  Play,
  X,
  ChevronRight,
} from "lucide-react";
import "../dashboard/Principaldashboard.css";
import "../students/StudentsPage.css";

interface VideoItem {
  id: number;
  title: string;
  category: string;
  duration: string;
  description: string;
  status: "Pending" | "Published" | "Rejected";
  uploadedBy: string;
  department: string;
  uploadDate: string;
  views: number;
  thumbnail?: string;
  videoUrl?: string;
}

interface ApprovalCounts {
  pending: number;
  published: number;
  rejected: number;
  total: number;
}

const DEFAULT_SAMPLE_VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export default function AdminVideoApprovalPage() {
  const [activeStatusFilter, setActiveStatusFilter] = useState<"All" | "Pending" | "Published" | "Rejected">("Pending");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [pendingVideos, setPendingVideos] = useState<VideoItem[]>([]);
  const [publishedVideos, setPublishedVideos] = useState<VideoItem[]>([]);
  const [rejectedVideos, setRejectedVideos] = useState<VideoItem[]>([]);
  const [counts, setCounts] = useState<ApprovalCounts>({ pending: 0, published: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Modal State for Watching Video Preview
  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://online-management-backend.onrender.com";

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/principal/video-approvals/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.status === "success") {
        setPendingVideos(json.pendingVideos || []);
        setPublishedVideos(json.publishedVideos || []);
        setRejectedVideos(json.rejectedVideos || []);
        setCounts(json.counts || { pending: 0, published: 0, rejected: 0, total: 0 });
      } else {
        setError(json.message || "Failed to fetch video approval queue.");
      }
    } catch (err) {
      console.error("Failed to load video approvals:", err);
      setError("Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleApprove = async (videoId: number, title: string) => {
    try {
      setProcessingId(videoId);
      const res = await fetch(`${API_BASE}/api/principal/videos/${videoId}/approve/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.status === "success") {
        setActionMessage({ text: `Approved "${title}" — Status updated to Published. Visible to students now.`, type: "success" });
        setTimeout(() => setActionMessage(null), 4000);
        if (previewVideo?.id === videoId) {
          setPreviewVideo((prev) => (prev ? { ...prev, status: "Published" } : null));
        }
        fetchApprovals();
      } else {
        setActionMessage({ text: json.message || "Failed to approve video.", type: "error" });
      }
    } catch (err) {
      setActionMessage({ text: "Network error approving video.", type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (videoId: number, title: string) => {
    try {
      setProcessingId(videoId);
      const res = await fetch(`${API_BASE}/api/principal/videos/${videoId}/reject/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.status === "success") {
        setActionMessage({ text: `Rejected "${title}" — Video remains hidden from students.`, type: "success" });
        setTimeout(() => setActionMessage(null), 4000);
        if (previewVideo?.id === videoId) {
          setPreviewVideo((prev) => (prev ? { ...prev, status: "Rejected" } : null));
        }
        fetchApprovals();
      } else {
        setActionMessage({ text: json.message || "Failed to reject video.", type: "error" });
      }
    } catch (err) {
      setActionMessage({ text: "Network error rejecting video.", type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  // Combine all lists for dynamic filtering
  const allVideos = useMemo(() => {
    return [...pendingVideos, ...publishedVideos, ...rejectedVideos];
  }, [pendingVideos, publishedVideos, rejectedVideos]);

  // Extract unique departments for filter dropdown
  const departmentList = useMemo(() => {
    const set = new Set<string>();
    allVideos.forEach((v) => {
      if (v.department) set.add(v.department);
    });
    return ["All", ...Array.from(set)];
  }, [allVideos]);

  // Filtered dataset based on search, status tab, and department
  const filteredVideos = useMemo(() => {
    return allVideos.filter((v) => {
      const matchesStatus = activeStatusFilter === "All" || v.status === activeStatusFilter;
      const matchesDept = selectedDepartment === "All" || v.department === selectedDepartment;
      const matchesSearch =
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesDept && matchesSearch;
    });
  }, [allVideos, activeStatusFilter, selectedDepartment, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage) || 1;
  const paginatedVideos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVideos.slice(start, start + itemsPerPage);
  }, [filteredVideos, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatusFilter, selectedDepartment, searchQuery]);

  return (
    <div className="dash-main p-6 space-y-6">

      {/* Top Banner */}
      <div className="dash-welcome-banner">
        <div className="banner-content">
          <Link href="/principal/dashboard" className="banner-badge hover:underline">
            <ChevronLeft size={13} />
            <span>Back to Dashboard</span>
          </Link>
          <h2>Admin Video Approval Portal</h2>
          <p>Review pending course videos uploaded by HODs. Approve videos to publish them to students or reject unverified content.</p>
        </div>
      </div>

      {/* Action Notification Toasts */}
      {actionMessage && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-semibold transition-all ${actionMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
        >
          {actionMessage.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Top KPI Cards (Pending, Approved, Rejected, Total) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveStatusFilter("Pending")}
          className={`corp-card cursor-pointer transition-all ${activeStatusFilter === "Pending" ? "border-amber-500/50 bg-amber-500/5" : "hover:border-amber-500/30"
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Pending Approval</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400"><Clock size={18} /></div>
          </div>
          <div className="text-2xl font-extrabold mt-2 text-white">{counts.pending}</div>
          <span className="text-xs text-amber-400 font-medium">Action Required</span>
        </div>

        <div
          onClick={() => setActiveStatusFilter("Published")}
          className={`corp-card cursor-pointer transition-all ${activeStatusFilter === "Published" ? "border-emerald-500/50 bg-emerald-500/5" : "hover:border-emerald-500/30"
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Published / Approved</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><CheckCircle2 size={18} /></div>
          </div>
          <div className="text-2xl font-extrabold mt-2 text-white">{counts.published}</div>
          <span className="text-xs text-emerald-400 font-medium">Visible to Students</span>
        </div>

        <div
          onClick={() => setActiveStatusFilter("Rejected")}
          className={`corp-card cursor-pointer transition-all ${activeStatusFilter === "Rejected" ? "border-red-500/50 bg-red-500/5" : "hover:border-red-500/30"
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Rejected Videos</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400"><XCircle size={18} /></div>
          </div>
          <div className="text-2xl font-extrabold mt-2 text-white">{counts.rejected}</div>
          <span className="text-xs text-red-400 font-medium">Hidden from Students</span>
        </div>

        <div
          onClick={() => setActiveStatusFilter("All")}
          className={`corp-card cursor-pointer transition-all ${activeStatusFilter === "All" ? "border-indigo-500/50 bg-indigo-500/5" : "hover:border-indigo-500/30"
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Videos</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400"><Video size={18} /></div>
          </div>
          <div className="text-2xl font-extrabold mt-2 text-white">{counts.total}</div>
          <span className="text-xs text-indigo-400 font-medium">All Uploaded Content</span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="corp-card space-y-4">

        {/* Controls Row: Status Tabs, Search, Department Filter, Refresh */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-xl border border-white/10 overflow-x-auto w-full lg:w-auto">
            <button
              onClick={() => setActiveStatusFilter("Pending")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeStatusFilter === "Pending"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              Pending ({counts.pending})
            </button>
            <button
              onClick={() => setActiveStatusFilter("Published")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeStatusFilter === "Published"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              Approved ({counts.published})
            </button>
            <button
              onClick={() => setActiveStatusFilter("Rejected")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeStatusFilter === "Rejected"
                  ? "bg-red-500 text-white shadow"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              Rejected ({counts.rejected})
            </button>
            <button
              onClick={() => setActiveStatusFilter("All")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeStatusFilter === "All"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              All ({counts.total})
            </button>
          </div>

          {/* Search Box + Department Filter + Sync Button */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">

            {/* Search Box */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search title, HOD, dept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>

            {/* Department Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="py-2 px-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white outline-none cursor-pointer focus:border-indigo-500"
              >
                {departmentList.map((dept) => (
                  <option key={dept} value={dept} className="bg-slate-900 text-white">
                    {dept === "All" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchApprovals}
              disabled={loading}
              className="dash-action-btn"
              title="Sync Queue"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Video Table List */}
        <div className="corp-table-wrap">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
              <RefreshCw size={24} className="animate-spin text-indigo-400" />
              <span className="text-sm font-medium">Loading video approval queue...</span>
            </div>
          ) : paginatedVideos.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Video size={40} className="mx-auto text-slate-600 mb-2" />
              <p className="font-semibold text-white">No videos match the selected filters</p>
              <p className="text-xs">Try switching status tabs or clearing your search input.</p>
            </div>
          ) : (
            <table className="corp-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Video Title</th>
                  <th>HOD Name</th>
                  <th>Department</th>
                  <th>Upload Date</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVideos.map((video) => (
                  <tr key={video.id}>
                    {/* Thumbnail Column */}
                    <td>
                      <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-slate-800 border border-white/10 group flex items-center justify-center shrink-0">
                        {video.thumbnail ? (
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center">
                            <Play size={20} className="text-indigo-400" />
                          </div>
                        )}
                        <button
                          onClick={() => setPreviewVideo(video)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          title="Watch Preview"
                        >
                          <Play size={20} className="text-white fill-white" />
                        </button>
                      </div>
                    </td>

                    {/* Title Column */}
                    <td>
                      <div className="flex flex-col max-w-xs">
                        <span className="font-bold text-white text-sm line-clamp-1">{video.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {video.category}
                          </span>
                          <span className="text-[11px] text-slate-400">{video.duration} min</span>
                        </div>
                      </div>
                    </td>

                    {/* HOD Name Column */}
                    <td>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <User size={13} className="text-indigo-400 shrink-0" />
                        {video.uploadedBy}
                      </span>
                    </td>

                    {/* Department Column */}
                    <td>
                      <span className="text-xs text-slate-300 flex items-center gap-1.5">
                        <Building2 size={13} className="text-slate-500 shrink-0" />
                        {video.department}
                      </span>
                    </td>

                    {/* Upload Date Column */}
                    <td>
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-500 shrink-0" />
                        {video.uploadDate}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td>
                      {video.status === "Pending" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 w-fit">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                      {video.status === "Published" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 w-fit">
                          <CheckCircle2 size={12} /> Published
                        </span>
                      )}
                      {video.status === "Rejected" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1.5 w-fit">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                    </td>

                    {/* Action Buttons Column: View, Approve, Reject */}
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">

                        {/* View Video Button */}
                        <button
                          onClick={() => setPreviewVideo(video)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                          title="Preview Video"
                        >
                          <Eye size={13} className="text-indigo-400" />
                          <span>View</span>
                        </button>

                        {/* Approve Button */}
                        {video.status !== "Published" && (
                          <button
                            onClick={() => handleApprove(video.id, video.title)}
                            disabled={processingId === video.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                            title="Approve Video (Publish)"
                          >
                            <CheckCircle2 size={13} />
                            <span>Approve</span>
                          </button>
                        )}

                        {/* Reject Button */}
                        {video.status !== "Rejected" && (
                          <button
                            onClick={() => handleReject(video.id, video.title)}
                            disabled={processingId === video.id}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                            title="Reject Video"
                          >
                            <XCircle size={13} />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Bar */}
        {filteredVideos.length > itemsPerPage && (
          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredVideos.length)} of {filteredVideos.length} videos
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 hover:bg-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 font-bold text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 hover:bg-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="modal-backdrop" onClick={() => setPreviewVideo(null)}>
          <div className="modal-panel max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex items-center justify-between p-4 bg-slate-900 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Video size={18} className="text-indigo-400" />
                <h3 className="text-sm font-bold text-white">{previewVideo.title}</h3>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body p-6 space-y-4 bg-slate-950">
              {/* Video Player */}
              <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10">
                <video
                  src={previewVideo.videoUrl || DEFAULT_SAMPLE_VIDEO_URL}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Metadata Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-900 border border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">HOD</span>
                  <span className="text-white font-bold">{previewVideo.uploadedBy}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">Department</span>
                  <span className="text-white font-bold">{previewVideo.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">Category</span>
                  <span className="text-indigo-400 font-bold">{previewVideo.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">Status</span>
                  <span
                    className={`font-bold ${previewVideo.status === "Published"
                        ? "text-emerald-400"
                        : previewVideo.status === "Pending"
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                  >
                    {previewVideo.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              {previewVideo.description && (
                <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 font-bold block mb-1 uppercase text-[10px]">Description</span>
                  <p className="leading-relaxed">{previewVideo.description}</p>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewVideo(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Close Preview
                </button>
                {previewVideo.status !== "Published" && (
                  <button
                    type="button"
                    onClick={() => handleApprove(previewVideo.id, previewVideo.title)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve Video</span>
                  </button>
                )}
                {previewVideo.status !== "Rejected" && (
                  <button
                    type="button"
                    onClick={() => handleReject(previewVideo.id, previewVideo.title)}
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <XCircle size={14} />
                    <span>Reject Video</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
