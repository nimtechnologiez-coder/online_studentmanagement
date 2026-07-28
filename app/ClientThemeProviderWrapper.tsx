"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col`}>
        {children}
      </div>
    </ThemeProvider>
  );
}
