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
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      <StudentSidebar />

      <main className="flex-1 ml-0 lg:ml-[270px] min-w-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}