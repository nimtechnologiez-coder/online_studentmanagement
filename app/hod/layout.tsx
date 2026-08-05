"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../components/hod/Sidebar";
import "../hod/hod-theme.css";

export default function HODLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const isLoginPage = pathname === "/hod/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }

    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("hod") || sessionStorage.getItem("hod")
        : null;

    if (!saved) {
      setIsAuthenticated(false);
      router.replace("/hod/login");
    } else {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.replace("/hod/login");
        }
      } catch (e) {
        localStorage.removeItem("hod");
        sessionStorage.removeItem("hod");
        setIsAuthenticated(false);
        router.replace("/hod/login");
      }
    }
  }, [pathname, router, isLoginPage]);

  if (isLoginPage) {
    return (
      <div className="principal-themed min-h-screen" style={{ background: "var(--p-bg-main, #070913)" }}>
        {children}
      </div>
    );
  }

  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <div
        className="principal-themed min-h-screen"
        style={{
          background: "var(--p-bg-main, #0f172a)",
          color: "var(--p-text-muted, #94a3b8)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Verifying HOD authentication...</p>
      </div>
    );
  }

  return (
    <div className="principal-themed principal-layout-root">
      <Sidebar />
      <main className="principal-layout-main">
        {children}
      </main>
    </div>
  );
}