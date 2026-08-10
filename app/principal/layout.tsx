"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../components/principal/Sidebar";
import { getStoredPrincipal, clearStoredPrincipal } from "../utils/auth";
import "../principal/principal-theme.css";

export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/principal/login";

  useEffect(() => {
    if (isLoginPage) return;

    const { expired, data } = getStoredPrincipal();

    if (expired) {
      clearStoredPrincipal();
      router.replace("/principal/login?expired=true");
    } else if (!data) {
      router.replace("/principal/login");
    }
  }, [pathname, router, isLoginPage]);

  if (isLoginPage) {
    return (
      <div className="principal-themed min-h-screen" style={{ background: "var(--p-bg-main)" }}>
        {children}
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