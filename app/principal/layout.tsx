"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../components/principal/Sidebar";
import "../principal/principal-theme.css";

export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const isLoginPage = pathname === "/principal/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }

    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("principal") || sessionStorage.getItem("principal")
        : null;

    if (!saved) {
      setIsAuthenticated(false);
      router.replace("/");
    } else {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.replace("/");
        }
      } catch (e) {
        localStorage.removeItem("principal");
        sessionStorage.removeItem("principal");
        setIsAuthenticated(false);
        router.replace("/");
      }
    }
  }, [pathname, router, isLoginPage]);

  if (isLoginPage) {
    return (
      <div className="principal-themed min-h-screen" style={{ background: "var(--p-bg-main)" }}>
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
        <p>Verifying authentication...</p>
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