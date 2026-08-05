"use client";

import { usePathname } from "next/navigation";
import StudentSidebar from "../components/Student/studentsidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/Student/login" ||
    pathname === "/Student/signup" ||
    pathname === "/Student/forgot-password";

  // Check authentication on route change
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("student") || sessionStorage.getItem("student");
    const isAuthenticated = !!saved;

    // If logged-in user tries to access auth pages, redirect to dashboard
    if (isAuthenticated && isAuthPage) {
      window.location.href = "/Student/dashboard";
      return null;
    }

    // If unauthenticated user tries to access protected student pages, redirect to login
    if (!isAuthenticated && !isAuthPage) {
      window.location.href = "/Student/login";
      return null;
    }
  }

  // Hide sidebar on authentication pages (Login / Signup / Forgot Password)
  if (isAuthPage) {
    return <div style={{ minHeight: "100vh", backgroundColor: "var(--background)" }}>{children}</div>;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", display: "flex", flexDirection: "column" }} className="lg:flex-row">
      <StudentSidebar />

      <main className="flex-1 min-w-0 transition-all duration-300 pl-0 lg:pl-[250px]" style={{ backgroundColor: "var(--background)", overflowX: "hidden" }}>
        {children}
      </main>
    </div>
  );
}