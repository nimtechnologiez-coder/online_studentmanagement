import type { Metadata } from "next";
import "./globals.css";
import ClientThemeProviderWrapper from "./ClientThemeProviderWrapper";

export const metadata: Metadata = {
  title: "Online Student Management",
  description: "Academic Administration & Management Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          id="theme-init-script"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedTheme = localStorage.getItem('theme');
                var isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ClientThemeProviderWrapper>
          {children}
        </ClientThemeProviderWrapper>
      </body>
    </html>
  );
}
