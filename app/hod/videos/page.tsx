"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import "./video.css";
import { Video as VideoIcon } from "lucide-react";

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
  "Mathematics",
  "Physics",
  "Soft Skills",
];

const SAMPLE_VIDEO_URL =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const SAMPLE_VIDEOS: Video[] = [
  {
    id: 1,
    title: "Introduction to Data Structures & Algorithms",
    category: "Programming",
    duration: "45:20",
    description: "Comprehensive guide to fundamental data structures, arrays, linked lists, and time complexity.",
    thumbnail: "https://picsum.photos/seed/ds/160/90",
    isMine: true,
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    uploadedBy: "Dr. Alan Turing",
    uploadDate: "2026-07-20",
    views: 1240,
    status: "Published",
  },
  {
    id: 2,
    title: "Linear Algebra & Calculus Fundamentals",
    category: "Mathematics",
    duration: "1:15:00",
    description: "Learn matrices, vectors, derivatives, and mathematical principles for engineering.",
    thumbnail: "https://picsum.photos/seed/web/160/90",
    isMine: true,
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    uploadedBy: "Dr. Alan Turing",
    uploadDate: "2026-07-18",
    views: 890,
    status: "Published",
  },
  {
    id: 3,
    title: "Applied Physics & Thermodynamics Masterclass",
    category: "Physics",
    duration: "38:15",
    description: "Core physical laws, energy equations, and practical mechanics.",
    thumbnail: "https://picsum.photos/seed/db/160/90",
    isMine: false,
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    uploadedBy: "Prof. Grace Hopper",
    uploadDate: "2026-07-15",
    views: 650,
    status: "Published",
  },
];

/* ==========================================================
   API HELPERS
========================================================== */

function getHodId(): string {
  if (typeof window === "undefined") return "";
  const saved = localStorage.getItem("hod") || sessionStorage.getItem("hod");
  if (!saved) return "";
  try {
    const parsed = JSON.parse(saved);
    return parsed?.id ? String(parsed.id) : "";
  } catch (err) {
    console.error("Failed to parse saved HOD data:", err);
    return "";
  }
}

const DEFAULT_THUMBNAIL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90' viewBox='0 0 160 90'%3E%3Crect width='160' height='90' fill='%231e293b'/%3E%3Cpath d='M65 30l40 15-40 15z' fill='%23818cf8'/%3E%3Ctext x='80' y='75' font-family='sans-serif' font-size='11' font-weight='bold' fill='%2394a3b8' text-anchor='middle'%3EVIDEO PREVIEW%3C/text%3E%3C/svg%3E";

function mapVideo(video: any): Video {
  return {
    id: Number(video.id),
    title: video.title,
    category: video.category,
    duration: video.duration,
    description: video.description || "",
    thumbnail: video.thumbnail && typeof video.thumbnail === "string" && video.thumbnail.trim().length > 0 ? video.thumbnail : DEFAULT_THUMBNAIL,
    isMine: Boolean(video.isMine),
    videoUrl: video.videoUrl || SAMPLE_VIDEO_URL,
    uploadedBy: video.uploadedBy || "HOD",
    uploadDate: video.uploadDate || "",
    views: Number(video.views || 0),
    status: video.status || "Published",
  };
}

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
  showBreadcrumb?: boolean;
  isMyVideos?: boolean;
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
  isMyVideos = false,
}: VideoTableProps) {
  const totalPages = Math.max(1, Math.ceil(videos.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return videos.slice(start, start + perPage);
  }, [videos, safePage, perPage]);

  const rootClass = isMyVideos ? "card light-my-videos-card" : "card";
  const headerClass = isMyVideos ? "card-header light-my-videos-header" : "card-header";
  const searchRowClass = isMyVideos ? "search-row light-my-videos-search-row" : "search-row";
  const searchInputClass = isMyVideos ? "light-my-videos-search-input" : "";
  const tableWrapClass = isMyVideos ? "table-scroll light-my-videos-table-wrap" : "table-scroll";
  const tableClass = isMyVideos ? "video-table light-my-videos-table" : "video-table";
  const footerClass = isMyVideos ? "table-footer light-my-videos-footer" : "table-footer";
  const paginationClass = isMyVideos ? "pagination-numbers light-my-videos-pagination" : "pagination-numbers";

  return (
    <div className={rootClass}>
      <div className={headerClass}>
        <div>
          <h2 className="card-title-row">
            <VideoIcon size={30} className="card-title-icon" />
            {title}
          </h2>
          <p>{subtitle}</p>
        </div>
        {headerExtra}
      </div>

      <div className={searchRowClass}>
        <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          className={searchInputClass}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className={tableWrapClass} role="region" aria-label={`${title} table`}>
        <table className={tableClass}>
          <thead>
            <tr>
              <th className="col-sno">S.No</th>
              <th>Thumbnail</th>
              <th>Video Title</th>
              <th>Video Category</th>
              <th>Duration</th>
              <th>Description</th>
              <th>Upload Date</th>
              <th>Status</th>
              <th className="col-action">Action</th>
            </tr>
          </thead>

          {pageItems.length > 0 && (
            <tbody>
              {pageItems.map((video, index) => (
                <tr key={video.id} className={isMyVideos ? "light-my-videos-row" : ""}>
                  <td data-label="S.No" className="col-sno">
                    {(safePage - 1) * perPage + index + 1}
                  </td>

                  <td data-label="Thumbnail">
                    <img
                      src={video.thumbnail || DEFAULT_THUMBNAIL}
                      alt={video.title}
                      className="thumb"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_THUMBNAIL;
                      }}
                    />
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

                  <td data-label="Status">
                    {video.status === "Pending" && (
                      <span style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                        Pending Approval
                      </span>
                    )}
                    {video.status === "Published" && (
                      <span style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                        Published
                      </span>
                    )}
                    {video.status === "Rejected" && (
                      <span style={{ background: "rgba(239, 68, 68, 0.15)", color: "#fca5a5", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                        Rejected
                      </span>
                    )}
                  </td>

                  <td data-label="Action" className="col-action">
                    <div className="action-group">{renderActions(video)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {pageItems.length === 0 && (
          <div className="light-my-videos-empty" style={{ width: "100%", padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <div className="light-my-videos-empty-icon" style={{ fontSize: 24, marginBottom: 4, lineHeight: 1 }}>📹</div>
            <div className="light-my-videos-empty-title" style={{ fontSize: 14, fontWeight: 700, color: "var(--p-text-primary, #ffffff)", margin: 0 }}>No Videos Available</div>
          </div>
        )}
      </div>

      <div className={footerClass}>
        <span>
          Showing{" "}
          {videos.length === 0 ? 0 : (safePage - 1) * perPage + 1}
          -
          {safePage * perPage > videos.length ? videos.length : safePage * perPage}{" "}
          of {videos.length} videos
        </span>

        <div className={paginationClass}>
          <button
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            className="pagination-button"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={safePage === i + 1 ? "page-btn active" : "page-btn"}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
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
          <video
            key={video.id}
            src={video.videoUrl}
            controls
            autoPlay
            className="modal-video"
            controlsList="nodownload"
            disablePictureInPicture
          />
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

function uploadWithProgress(
  url: string,
  formData: FormData,
  headers: Record<string, string>,
  onProgress?: (progress: { loaded: number; total: number; percentage: number; speedMBs: number }) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let lastLoaded = 0;
    let lastTime = Date.now();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const now = Date.now();
        const timeDiffSeconds = (now - lastTime) / 1000;
        const loadedDiff = e.loaded - lastLoaded;

        let speedMBs = 0;
        if (timeDiffSeconds > 0) {
          speedMBs = parseFloat(((loadedDiff / (1024 * 1024)) / timeDiffSeconds).toFixed(2));
        }

        const percentage = Math.round((e.loaded / e.total) * 100);

        if (onProgress) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage,
            speedMBs: speedMBs || 0.1,
          });
        }

        lastLoaded = e.loaded;
        lastTime = now;
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText);
          resolve(json);
        } catch {
          resolve({ status: "success" });
        }
      } else {
        try {
          const json = JSON.parse(xhr.responseText);
          reject(new Error(json?.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network error during video upload. Please try again."));
    xhr.ontimeout = () => reject(new Error("Upload timed out. Please try again."));

    xhr.open("POST", url, true);
    xhr.withCredentials = true;

    Object.entries(headers).forEach(([key, val]) => {
      if (val) xhr.setRequestHeader(key, val);
    });

    xhr.send(formData);
  });
}

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    entries: SubmittedEntry[],
    onProgress?: (index: number, total: number, pct: number, speed: number) => void
  ) => Promise<void> | void;
  initialData?: UploadFormData | null;
  submitError?: string | null;
};

function calculateVideoDuration(file: File): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      const secondsTotal = Math.floor(video.duration || 0);
      if (!secondsTotal || isNaN(secondsTotal)) {
        resolve("00:00");
        return;
      }
      const hrs = Math.floor(secondsTotal / 3600);
      const mins = Math.floor((secondsTotal % 3600) / 60);
      const secs = secondsTotal % 60;

      if (hrs > 0) {
        resolve(
          `${hrs.toString().padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
        );
      } else {
        resolve(
          `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`
        );
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("00:00");
    };
  });
}

function UploadModal({ isOpen, onClose, onSubmit, initialData, submitError }: UploadModalProps) {
  const { mounted, closing } = useModalTransition(isOpen);

  const [entries, setEntries] = useState<VideoEntry[]>([makeEmptyEntry()]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ index: number; total: number; pct: number; speed: number } | null>(null);

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
      setUploadProgress(null);
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
    if (!file) {
      setEntries((prev) =>
        prev.map((en) =>
          en.entryId === entryId ? { ...en, videoFile: null, form: { ...en.form, duration: "" } } : en
        )
      );
      return;
    }

    setEntries((prev) => prev.map((en) => (en.entryId === entryId ? { ...en, videoFile: file } : en)));

    calculateVideoDuration(file).then((dur) => {
      setEntries((prev) =>
        prev.map((en) =>
          en.entryId === entryId ? { ...en, form: { ...en.form, duration: dur } } : en
        )
      );
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;

    setIsUploading(true);
    setUploadProgress(null);
    try {
      await onSubmit(
        entries.map((en) => ({
          data: en.form,
          videoFile: en.videoFile,
          thumbnailFile: en.thumbnailFile,
        })),
        (index, total, pct, speed) => {
          setUploadProgress({ index, total, pct, speed });
        }
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
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
          {submitError && <p className="videos-error">{submitError}</p>}

          {entries.map((entry, idx) => (
            <div key={entry.entryId}>
              {entries.length > 1 && (
                <div className="entry-header-row">
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
                    <option value="" disabled>
                      Select Category
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
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
                      ? `${(entry.videoFile.size / (1024 * 1024)).toFixed(1)} MB${entry.form.duration ? ` • Auto Duration: ${entry.form.duration}` : ''} — click to change`
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
            <div className="btn-row btn-row-start">
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
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [searchAll, setSearchAll] = useState("");
  const [searchMine, setSearchMine] = useState("");
  const [allPage, setAllPage] = useState(1);
  const [myPage, setMyPage] = useState(1);
  const perPage = 5;

  const [viewingVideo, setViewingVideo] = useState<Video | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<UploadFormData | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://online-management-backend.onrender.com";

  const authHeaders = (): Record<string, string> => {
    const hodId = getHodId();
    const headers: Record<string, string> = {};
    if (hodId) headers["X-Hod-Id"] = hodId;
    return headers;
  };

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/hod/videos/`, {
        method: "GET",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        credentials: "include",
      });

      const text = await response.text();
      let json: any = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok || !json || json.status !== "success" || !Array.isArray(json.videos)) {
        setVideos([]);
        return;
      }

      setVideos((json.videos || []).map(mapVideo));
    } catch (err: any) {
      console.error("Failed to load HOD videos:", err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE]);

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
    setUploadError(null);
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
    setUploadError(null);
    setUploadOpen(true);
  };

  const handleDelete = async (video: Video) => {
    const confirmed = window.confirm(`Delete "${video.title}"? This cannot be undone.`);
    if (!confirmed) return;

    const previous = videos;
    // optimistic update
    setVideos((prev) => prev.filter((v) => v.id !== video.id));

    try {
      const response = await fetch(`${API_BASE}/api/hod/videos/upload/${video.id}/`, {
        method: "DELETE",
        headers: { ...authHeaders() },
        credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text();
        let message = `Request failed with status ${response.status}`;
        try {
          const json = text ? JSON.parse(text) : null;
          if (json?.message) message = json.message;
        } catch {
          /* ignore parse error, use default message */
        }
        throw new Error(message);
      }
    } catch (err: any) {
      console.error("Failed to delete video:", err);
      // roll back on failure
      setVideos(previous);
      window.alert(err.message || "Failed to delete the video. Please try again.");
    }
  };

  // Handles both create (multi-entry) and edit (single-entry) submissions,
  // sending real requests to the backend with live XHR upload progress.
  const handleUploadSubmit = async (
    entries: SubmittedEntry[],
    onProgress?: (index: number, total: number, pct: number, speed: number) => void
  ) => {
    setUploadError(null);
    const isEditMode = Boolean(entries[0]?.data.id);

    try {
      if (isEditMode) {
        const { data } = entries[0];
        const response = await fetch(`${API_BASE}/api/hod/videos/${data.id}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          credentials: "include",
          body: JSON.stringify({
            title: data.title,
            category: data.category,
            duration: data.duration,
            description: data.description,
          }),
        });

        const text = await response.text();
        let json: any = null;
        try {
          json = text ? JSON.parse(text) : null;
        } catch {
          throw new Error("The server returned an invalid response.");
        }

        if (!response.ok || !json || json.status !== "success") {
          throw new Error(json?.message || `Request failed with status ${response.status}`);
        }

        const updated = mapVideo(json.video ?? { ...data, id: data.id });
        setVideos((prev) => prev.map((v) => (v.id === data.id ? { ...v, ...updated } : v)));
      } else {
        const created: Video[] = [];

        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const { data, videoFile, thumbnailFile } = entry;
          const formData = new FormData();
          formData.append("title", data.title);
          formData.append("category", data.category);
          formData.append("duration", data.duration || "00:00");
          formData.append("description", data.description);
          if (videoFile) formData.append("video", videoFile);
          if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

          if (onProgress) onProgress(i + 1, entries.length, 0, 0);

          const json = await uploadWithProgress(
            `${API_BASE}/api/hod/videos/upload/`,
            formData,
            authHeaders(),
            (p) => {
              if (onProgress) onProgress(i + 1, entries.length, p.percentage, p.speedMBs);
            }
          );

          if (!json || json.status !== "success") {
            throw new Error(json?.message || `Request failed during video upload`);
          }

          created.push(mapVideo(json.video));
        }

        setVideos((prev) => [...created, ...prev]);
        setMyPage(1);
      }

      setUploadOpen(false);
    } catch (err: any) {
      console.error("Failed to save video:", err);
      setUploadError(err.message || "Something went wrong while saving. Please try again.");
      // keep the modal open so the user can retry without losing their input
    }
  };

  return (
    <div className="videos-page">
      {loading && <p className="videos-loading">Loading videos…</p>}
      {error && <p className="videos-error">{error}</p>}

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

      {/* MY VIDEOS */}
      <VideoTable
        title="My Videos"
        subtitle="Videos uploaded by you"
        isMyVideos={true}
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
        submitError={uploadError}
      />
    </div>
  );
}