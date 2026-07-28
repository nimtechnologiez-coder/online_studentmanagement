"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../components/hod/Sidebar";

export default function HODLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show sidebar on login page
  if (pathname === "/hod/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-slate-50 min-w-0">
        {children}
      </main>
    </div>
  );
}