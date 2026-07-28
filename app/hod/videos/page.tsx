"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import "./video.css";
import Link from "next/link";
import { Home, ChevronRight, Video as VideoIcon } from "lucide-react";

/* ==========================================================
   TYPES
========================================================== */

type Video = {
  id: number;
  title: string;
  category: string;
  duration: string;
  description: string;
  thumbnail: string;
  isMine: boolean;
  videoUrl: string;
  uploadedBy: string;
  uploadDate: string;
  views: number;
  status: string;
};

type UploadFormData = {
  id?: number;
  title: string;
  category: string;
  duration: string;
  description: string;
};

// One entry = one video's full form, used to support multi-video upload
type VideoEntry = {
  entryId: string;
  form: UploadFormData;
  videoFile: File | null;
  thumbnailFile: File | null;
  thumbnailPreview: string | null;
};

type SubmittedEntry = {
  data: UploadFormData;
  videoFile: File | null;
  thumbnailFile: File | null;
};

const CATEGORIES = [
  "Programming",
  "Web Development",
  "Database",
  "Computer Networks",
  "Data Structures",
  "Operating Systems",
];

const SAMPLE_VIDEO_URL =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const initialVideos: Video[] = [
  {
    id: 1,
    title: "Python Basics",
    category: "Programming",
    duration: "22:10",
    description:
      "Introduction to Python syntax, variables and control flow for first-year students.",
    uploadedBy: "Dr. Arun Kumar",
    uploadDate: "24-Jul-2026",
    views: 320,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?1",
    isMine: true,
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 2,
    title: "Django Models",
    category: "Web Development",
    duration: "18:45",
    description:
      "Deep dive into Django ORM models, relationships and database migrations.",
    uploadedBy: "Dr. Arun Kumar",
    uploadDate: "22-Jul-2026",
    views: 280,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?2",
    isMine: true,
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 3,
    title: "Database Management",
    category: "Database",
    duration: "26:30",
    description:
      "Core concepts of DBMS, normalization and transaction management explained with examples.",
    uploadedBy: "Dr. Meena Raj",
    uploadDate: "20-Jul-2026",
    views: 240,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?3",
    isMine: false,
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 4,
    title: "Computer Networks",
    category: "Computer Networks",
    duration: "20:15",
    description:
      "Overview of network layers, common protocols and the OSI reference model.",
    uploadedBy: "Dr. Arun Kumar",
    uploadDate: "18-Jul-2026",
    views: 198,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?4",
    isMine: true,
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 5,
    title: "Operating Systems",
    category: "Operating Systems",
    duration: "17:50",
    description:
      "A beginner-friendly overview of process scheduling, memory management, and file systems.",
    uploadedBy: "Dr. Ramesh Iyer",
    uploadDate: "16-Jul-2026",
    views: 156,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?5",
    isMine: false,
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 6,
    title: "Data Structures Essentials",
    category: "Data Structures",
    duration: "24:05",
    description:
      "Covers arrays, stacks, queues, linked lists, trees, and recursion with examples.",
    uploadedBy: "Dr. Arun Kumar",
    uploadDate: "14-Jul-2026",
    views: 214,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?6",
    isMine: true,
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 7,
    title: "Web Security Basics",
    category: "Web Development",
    duration: "19:40",
    description:
      "Practical introduction to secure form handling, authentication, and common web threats.",
    uploadedBy: "Dr. Meena Raj",
    uploadDate: "12-Jul-2026",
    views: 132,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?7",
    isMine: false,
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 8,
    title: "SQL Queries Deep Dive",
    category: "Database",
    duration: "21:25",
    description:
      "Learn joins, subqueries, indexing, and query optimization with practical examples.",
    uploadedBy: "Dr. Arun Kumar",
    uploadDate: "10-Jul-2026",
    views: 176,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?8",
    isMine: true,
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 9,
    title: "Networking Protocols",
    category: "Computer Networks",
    duration: "16:55",
    description:
      "A concise guide to HTTP, DNS, TCP/IP, and routing basics for students.",
    uploadedBy: "Dr. Ramesh Iyer",
    uploadDate: "08-Jul-2026",
    views: 145,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?9",
    isMine: false,
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 10,
    title: "Python for Automation",
    category: "Programming",
    duration: "23:10",
    description:
      "Hands-on session on scripting, automation, and reusable Python patterns.",
    uploadedBy: "Dr. Arun Kumar",
    uploadDate: "06-Jul-2026",
    views: 188,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?10",
    isMine: true,
    videoUrl: SAMPLE_VIDEO_URL,
  },
    {
    id: 1,
    title: "Python Basics",
    category: "Programming",
    duration: "22:10",
    description:
      "Introduction to Python syntax, variables and control flow for first-year students.",
    uploadedBy: "Dr. Arun Kumar",
    uploadDate: "24-Jul-2026",
    views: 320,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?1",
    isMine: true,
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 2,
    title: "Django Models",
    category: "Web Development",
    duration: "18:45",
    description:
      "Deep dive into Django ORM models, relationships and database migrations.",
    uploadedBy: "Dr. Arun Kumar",
    uploadDate: "22-Jul-2026",
    views: 280,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?2",
    isMine: true,
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 3,
    title: "Database Management",
    category: "Database",
    duration: "26:30",
    description:
      "Core concepts of DBMS, normalization and transaction management explained with examples.",
    uploadedBy: "Dr. Meena Raj",
    uploadDate: "20-Jul-2026",
    views: 240,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?3",
    isMine: false,
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 4,
    title: "Computer Networks",
    category: "Computer Networks",
    duration: "20:15",
    description:
      "Overview of network layers, common protocols and the OSI reference model.",
    uploadedBy: "Dr. Arun Kumar",
    uploadDate: "18-Jul-2026",
    views: 198,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?4",
    isMine: true,
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 5,
    title: "Operating Systems",
    category: "Operating Systems",
    duration: "17:50",
    description:
      "A beginner-friendly overview of process scheduling, memory management, and file systems.",
    uploadedBy: "Dr. Ramesh Iyer",
    uploadDate: "16-Jul-2026",
    views: 156,
    status: "Active",
    thumbnail: "https://picsum.photos/90/50?5",
    isMine: false,
    videoUrl: SAMPLE_VIDEO_URL,
  },
];

/* ==========================================================
   ICONS
========================================================== */

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path
        d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path
        d="M4 20h4L18.5 9.5a2.121 2.121 0 0 0-3-3L5 17v3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 12.5A1.5 1.5 0 0 0 9.5 21h5a1.5 1.5 0 0 0 1.5-1.5L17 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UploadCloudIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
      <path
        d="M7 18a4 4 0 0 1-.6-7.95A5.5 5.5 0 0 1 17.4 8.5 4.5 4.5 0 0 1 17 18H7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 12v6m0-6 2.5 2.5M12 12l-2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m5 17 4.5-5 3.5 4 2.5-3 4.5 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ==========================================================
   MODAL TRANSITION HOOK
========================================================== */

function useModalTransition(isOpen: boolean, duration = 220) {
  const [mounted, setMounted] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isOpen) {
      setMounted(true);
      setClosing(false);
    } else if (mounted) {
      setClosing(true);
      timer = setTimeout(() => {
        setMounted(false);
        setClosing(false);
      }, duration);
    }

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return { mounted, closing };
}

/* ==========================================================
   VIDEO TABLE (reused by All Videos + My Videos)
========================================================== */

type VideoTableProps = {
  title: string;
  subtitle: string;
  videos: Video[];
  page: number;
  onPageChange: (page: number) => void;
  perPage: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  renderActions: (video: Video) => ReactNode;
  headerExtra?: ReactNode;
  showBreadcrumb?: boolean; // FIX: allows hiding breadcrumb per-section
};

function VideoTable({
  title,
  subtitle,
  videos,
  page,
  onPageChange,
  perPage,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  renderActions,
  headerExtra,
  showBreadcrumb = true,
}: VideoTableProps) {
  const totalPages = Math.max(1, Math.ceil(videos.length / perPage));

  // FIX: clamp the current page whenever the underlying video count changes
  // (e.g. after delete, search, or new uploads) so a stale page number can
  // never point past the end of the list or leave it stuck out of range.
  useEffect(() => {
    if (page > totalPages) {
      onPageChange(totalPages);
    }
  }, [totalPages, page, onPageChange]);

  // FIX: always slice exactly `perPage` items for the *current* page only —
  // this, combined with unique keys + the clamp above, is what makes
  // pagination stable no matter how many times Next/Prev/page numbers are clicked.
  const pageItems = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * perPage;
    return videos.slice(start, start + perPage);
  }, [videos, page, perPage, totalPages]);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <VideoIcon size={30} style={{ color: "#4F74F9" }} />
            {title}
          </h2>
          <p>{subtitle}</p>
        </div>
        {headerExtra}
      </div>

      <div className="search-row">
        <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="table-scroll" role="region" aria-label={`${title} table`}>
        <table className="video-table">
          <thead>
            <tr>
              <th className="col-sno">S.No</th>
              <th>Thumbnail</th>
              <th>Video Title</th>
              <th>Video Category</th>
              <th>Duration</th>
              <th>Description</th>
              <th>upload date</th>
              <th className="col-action">Action</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.map((video, index) => (
              <tr key={video.id}>
                <td data-label="S.No" className="col-sno">
                  {(Math.min(Math.max(1, page), totalPages) - 1) * perPage + index + 1}
                </td>

                <td data-label="Thumbnail">
                  <img src={video.thumbnail} alt="" className="thumb" />
                </td>

                <td data-label="Video title">
                  <span className="video-title">{video.title}</span>
                </td>

                <td data-label="Video Category">
                  <span className="category-pill">{video.category}</span>
                </td>

                <td data-label="Duration">
                  <span className="duration-badge">{video.duration}</span>
                </td>

                <td data-label="Description" className="desc-cell">
                  <span className="desc-text">{video.description}</span>
                </td>

                <td data-label="date" className="desc-cel">
                  <span className="uploadDate">{video.uploadDate}</span>
                </td>

                <td data-label="Action" className="col-action">
                  <div className="action-group">{renderActions(video)}</div>
                </td>
              </tr>
            ))}

            {pageItems.length === 0 && (
              <tr>
                <td colSpan={8} className="empty-row">
                  No videos found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span>
          Showing{" "}
          {videos.length === 0
            ? 0
            : (Math.min(Math.max(1, page), totalPages) - 1) * perPage + 1}
          -
          {Math.min(Math.max(1, page), totalPages) * perPage > videos.length
            ? videos.length
            : Math.min(Math.max(1, page), totalPages) * perPage}{" "}
          of {videos.length} videos
        </span>

        <div className="pagination-numbers">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1} className = "pagination-button"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={page === i + 1 ? "page-btn active" : "page-btn"}
               >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   VIEW MODAL
========================================================== */

function ViewModal({ video, onClose }: { video: Video | null; onClose: () => void }) {
  const isOpen = video !== null;
  const { mounted, closing } = useModalTransition(isOpen);

  if (!mounted || !video) return null;

  return (
    <div className={`modal-overlay ${closing ? "is-closing" : "is-open"}`} onClick={onClose}>
      <div className={`modal-box ${closing ? "is-closing" : "is-open"}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{video.title}</h3>
          <button className="modal-close" aria-label="Close preview" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="modal-video-wrap">
          <video key={video.id} src={video.videoUrl} controls autoPlay className="modal-video" controlsList="nodownload" disablePictureInPicture />
        </div>

        <div className="modal-body">
          <div className="modal-tags">
            <span className="category-pill">{video.category}</span>
          </div>
          <div className="modal-meta">
            <span>{video.views} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   UPLOAD / EDIT MODAL
   FIX: now supports multiple video forms in one upload session
   via an "Add More Video" button. Edit mode stays single-form.
========================================================== */

const emptyForm: UploadFormData = { title: "", category: "", duration: "", description: "" };

function makeEmptyEntry(): VideoEntry {
  return {
    entryId:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
    form: { ...emptyForm },
    videoFile: null,
    thumbnailFile: null,
    thumbnailPreview: null,
  };
}

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entries: SubmittedEntry[]) => void;
  initialData?: UploadFormData | null;
};

function UploadModal({ isOpen, onClose, onSubmit, initialData }: UploadModalProps) {
  const { mounted, closing } = useModalTransition(isOpen);

  const [entries, setEntries] = useState<VideoEntry[]>([makeEmptyEntry()]);
  const [isUploading, setIsUploading] = useState(false);

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setEntries([
          {
            entryId: "edit-entry",
            form: initialData,
            videoFile: null,
            thumbnailFile: null,
            thumbnailPreview: null,
          },
        ]);
      } else {
        setEntries([makeEmptyEntry()]);
      }
      setIsUploading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData]);

  if (!mounted) return null;

  const updateForm = (entryId: string, field: keyof UploadFormData, value: string) => {
    setEntries((prev) =>
      prev.map((en) => (en.entryId === entryId ? { ...en, form: { ...en.form, [field]: value } } : en))
    );
  };

  const setVideoFile = (entryId: string, file: File | null) => {
    setEntries((prev) => prev.map((en) => (en.entryId === entryId ? { ...en, videoFile: file } : en)));
  };

  const setThumbnailFile = (entryId: string, file: File | null) => {
    if (!file) {
      setEntries((prev) =>
        prev.map((en) => (en.entryId === entryId ? { ...en, thumbnailFile: null, thumbnailPreview: null } : en))
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setEntries((prev) =>
        prev.map((en) =>
          en.entryId === entryId ? { ...en, thumbnailFile: file, thumbnailPreview: reader.result as string } : en
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const addEntry = () => setEntries((prev) => [...prev, makeEmptyEntry()]);

  const removeEntry = (entryId: string) =>
    setEntries((prev) => (prev.length > 1 ? prev.filter((en) => en.entryId !== entryId) : prev));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;

    setIsUploading(true);
    // Simulated upload delay — swap for the real API call; UI only changes.
    setTimeout(() => {
      onSubmit(
        entries.map((en) => ({
          data: en.form,
          videoFile: en.videoFile,
          thumbnailFile: en.thumbnailFile,
        }))
      );
      setIsUploading(false);
    }, 1100);
  };

  return (
    <div className={`modal-overlay ${closing ? "is-closing" : "is-open"}`} onClick={onClose}>
      <div
        className={`modal-box upload-modal ${closing ? "is-closing" : "is-open"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{isEdit ? "Edit Video" : "Upload New Video"}</h3>
          <button className="modal-close" aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <form className="upload-form" onSubmit={handleSubmit}>
          {entries.map((entry, idx) => (
            <div key={entry.entryId}>
              {entries.length > 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <span className="video-title">Video {idx + 1}</span>
                  {!isEdit && (
                    <button
                      type="button"
                      className="modal-close"
                      aria-label={`Remove video ${idx + 1}`}
                      onClick={() => removeEntry(entry.entryId)}
                    >
                      <CloseIcon />
                    </button>
                  )}
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label>Video Title</label>
                  <input
                    type="text"
                    required
                    value={entry.form.title}
                    onChange={(e) => updateForm(entry.entryId, "title", e.target.value)}
                    placeholder="Enter video title"
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    required
                    value={entry.form.category}
                    onChange={(e) => updateForm(entry.entryId, "category", e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    required
                    value={entry.form.duration}
                    onChange={(e) => updateForm(entry.entryId, "duration", e.target.value)}
                    placeholder="e.g. 18:45"
                  />
                </div>

                <div className="form-group form-group-full">
                  <label>Description</label>
                  <textarea
                    rows={4}
                    required
                    value={entry.form.description}
                    onChange={(e) => updateForm(entry.entryId, "description", e.target.value)}
                    placeholder="Briefly describe the video content"
                  />
                </div>
              </div>

              <div className="dropzone-grid">
                <label
                  className={`dropzone ${entry.videoFile ? "has-file" : ""}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) setVideoFile(entry.entryId, e.dataTransfer.files[0]);
                  }}
                >
                  <input
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={(e) => setVideoFile(entry.entryId, e.target.files?.[0] || null)}
                  />
                  <UploadCloudIcon />
                  <p className="dropzone-title">
                    {entry.videoFile ? entry.videoFile.name : "Drag & drop video file here"}
                  </p>
                  <span className="dropzone-hint">
                    {entry.videoFile
                      ? `${(entry.videoFile.size / (1024 * 1024)).toFixed(1)} MB — click to change`
                      : "or click to browse (mp4, mov, etc.)"}
                  </span>
                </label>

                <label
                  className={`dropzone thumb-dropzone ${entry.thumbnailPreview ? "has-file" : ""}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) setThumbnailFile(entry.entryId, e.dataTransfer.files[0]);
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setThumbnailFile(entry.entryId, e.target.files?.[0] || null)}
                  />
                  {entry.thumbnailPreview ? (
                    <img src={entry.thumbnailPreview} alt="Thumbnail preview" className="thumb-preview-img" />
                  ) : (
                    <>
                      <ImageIcon />
                      <p className="dropzone-title">Drag & drop thumbnail</p>
                      <span className="dropzone-hint">or click to browse (jpg, png)</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          ))}

          {!isEdit && (
            <div className="btn-row" style={{ justifyContent: "flex-start", marginBottom: "18px" }}>
              <button type="button" className="cancel-btn" onClick={addEntry} disabled={isUploading}>
                + Add More Video
              </button>
            </div>
          )}

          <div className="btn-row">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isUploading}>
              Cancel
            </button>
            <button type="submit" className="primary-btn upload-submit-btn" disabled={isUploading}>
              {isUploading && <span className="spinner" aria-hidden="true" />}
              {isUploading ? "Uploading..." : isEdit ? "Save Changes" : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==========================================================
   PAGE
========================================================== */

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>(initialVideos);

  const [searchAll, setSearchAll] = useState("");
  const [searchMine, setSearchMine] = useState("");
  const [allPage, setAllPage] = useState(1);
  const [myPage, setMyPage] = useState(1);
  const perPage = 5;

  const [viewingVideo, setViewingVideo] = useState<Video | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<UploadFormData | null>(null);

  const allVideos = useMemo(
    () =>
      videos.filter(
        (v) =>
          v.title.toLowerCase().includes(searchAll.toLowerCase()) ||
          v.category.toLowerCase().includes(searchAll.toLowerCase())
      ),
    [videos, searchAll]
  );

  const myVideos = useMemo(
    () =>
      videos.filter(
        (v) =>
          v.isMine &&
          (v.title.toLowerCase().includes(searchMine.toLowerCase()) ||
            v.category.toLowerCase().includes(searchMine.toLowerCase()))
      ),
    [videos, searchMine]
  );

  const openUploadForNew = () => {
    setEditingVideo(null);
    setUploadOpen(true);
  };

  const openUploadForEdit = (video: Video) => {
    setEditingVideo({
      id: video.id,
      title: video.title,
      category: video.category,
      duration: video.duration,
      description: video.description,
    });
    setUploadOpen(true);
  };

  const handleDelete = (video: Video) => {
    const confirmed = window.confirm(`Delete "${video.title}"? This cannot be undone.`);
    if (!confirmed) return;
    setVideos((prev) => prev.filter((v) => v.id !== video.id));
  };

  // FIX: now accepts an array of entries so multiple videos uploaded in one
  // session (via "Add More Video") are all added to My Videos at once.
  const handleUploadSubmit = (entries: SubmittedEntry[]) => {
    const isEditMode = Boolean(entries[0]?.data.id);

    if (isEditMode) {
      const { data } = entries[0];
      setVideos((prev) =>
        prev.map((v) =>
          v.id === data.id
            ? {
                ...v,
                title: data.title,
                category: data.category,
                duration: data.duration,
                description: data.description,
              }
            : v
        )
      );
    } else {
      setVideos((prev) => {
        let nextId = Math.max(0, ...prev.map((v) => v.id)) + 1;
        const newVideos: Video[] = entries.map((entry, idx) => {
          const { data, videoFile, thumbnailFile } = entry;
          const video: Video = {
            id: nextId++,
            title: data.title,
            category: data.category,
            duration: data.duration,
            description: data.description,
            uploadedBy: "You",
            uploadDate: "Today",
            views: 0,
            status: "Active",
            thumbnail: thumbnailFile
              ? URL.createObjectURL(thumbnailFile)
              : "https://picsum.photos/90/50?" + (prev.length + idx + 5),
            isMine: true,
            videoUrl: videoFile ? URL.createObjectURL(videoFile) : SAMPLE_VIDEO_URL,
          };
          return video;
        });
        return [...newVideos, ...prev];
      });
      setMyPage(1);
    }
    setUploadOpen(false);
  };

  return (
    <div className="videos-page">
      {/* ALL VIDEOS */}
      <VideoTable
        title="All Videos"
        subtitle="View all videos available in your department"
        videos={allVideos}
        page={allPage}
        onPageChange={setAllPage}
        perPage={perPage}
        searchValue={searchAll}
        onSearchChange={(v) => {
          setSearchAll(v);
          setAllPage(1);
        }}
        searchPlaceholder="Search by title or category..."
        renderActions={(video) => (
          <button className="icon-btn view-btn" title={`View ${video.title}`} onClick={() => setViewingVideo(video)}>
            <EyeIcon />
          </button>
        )}
      />

      {/* MY VIDEOS — breadcrumb removed here per request */}
      <VideoTable
        title="My Videos"
        subtitle="Videos uploaded by you"
        videos={myVideos}
        page={myPage}
        onPageChange={setMyPage}
        perPage={perPage}
        searchValue={searchMine}
        onSearchChange={(v) => {
          setSearchMine(v);
          setMyPage(1);
        }}
        searchPlaceholder="Search my videos..."
        showBreadcrumb={false}
        headerExtra={
          <button className="primary-btn upload-trigger-btn" onClick={openUploadForNew}>
            + Upload Video
          </button>
        }
        renderActions={(video) => (
          <>
            <button className="icon-btn" title={`View ${video.title}`} onClick={() => setViewingVideo(video)}>
              <EyeIcon />
            </button>
            <button
              className="icon-btn icon-btn-edit"
              title={`Edit ${video.title}`}
              onClick={() => openUploadForEdit(video)}
            >
              <EditIcon />
            </button>
            <button
              className="icon-btn icon-btn-delete"
              title={`Delete ${video.title}`}
              onClick={() => handleDelete(video)}
            >
              <TrashIcon />
            </button>
          </>
        )}
      />

      <ViewModal video={viewingVideo} onClose={() => setViewingVideo(null)} />

      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSubmit={handleUploadSubmit}
        initialData={editingVideo}
      />
    </div>
  );
}