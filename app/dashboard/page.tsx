"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const savedPrincipal =
      typeof window !== "undefined"
        ? localStorage.getItem("principal") || sessionStorage.getItem("principal")
        : null;

    const savedHod =
      typeof window !== "undefined"
        ? localStorage.getItem("hod") || sessionStorage.getItem("hod")
        : null;

    if (savedPrincipal) {
      router.replace("/principal/dashboard");
      return;
    }

    if (savedHod) {
      router.replace("/hod/dashboard");
      return;
    }

    // Not authenticated, redirect to /login
    router.replace("/login");
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        background: "#0f172a",
        color: "#94a3b8",
      }}
    >
      <p>Redirecting...</p>
    </div>
  );
}
