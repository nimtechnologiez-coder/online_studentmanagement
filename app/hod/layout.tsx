"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../components/hod/Sidebar";
import "../hod/hod-theme.css";

export default function HODLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show sidebar on login page
  if (pathname === "/hod/login") {
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