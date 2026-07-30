"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../components/principal/Sidebar";
import "../principal/principal-theme.css";

export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide sidebar on principal login/custom routes if needed
  const isLoginPage = pathname === "/principal/login";

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