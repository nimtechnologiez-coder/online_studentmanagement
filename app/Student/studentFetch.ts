const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://online-management-backend.onrender.com";

export async function studentFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const saved = typeof window !== "undefined" ? localStorage.getItem("student") || sessionStorage.getItem("student") : null;
  const studentId = saved ? JSON.parse(saved).id : 0;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  } as Record<string, string>;

  if (studentId) {
    headers["X-Student-Id"] = String(studentId);
  }

  const finalOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  let res: Response;
  const relativeUrl = path.startsWith("/") ? path : `/${path}`;
  try {
    res = await fetch(relativeUrl, finalOptions);
    if (!res.ok && res.status === 404) {
      throw new Error("404 relative route");
    }
  } catch (_) {
    res = await fetch(`${API_BASE}${relativeUrl}`, finalOptions);
  }

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    res = await fetch(`${API_BASE}${relativeUrl}`, finalOptions);
  }

  return res;
}
