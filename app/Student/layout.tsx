"use client";

import { usePathname } from "next/navigation";
import StudentSidebar from "../components/Student/studentsidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide sidebar on Student login page
  const isLoginPage = pathname === "/Student/login";

  if (isLoginPage) {
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