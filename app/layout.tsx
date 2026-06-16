import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Providers } from "./providers";
import { ThemeToggle } from "./components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Tools by Joy", template: "%s · Tools by Joy" },
  description: "AI-powered tools for developers and makers. Free, fast, built with n8n + Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors">
        <Providers>
          <header className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
            <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
              <Link href="/" className="font-semibold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">
                tools<span className="text-orange-500">by</span>joy
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 hidden sm:block">AI tools · free to use</span>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <div className="flex-1">{children}</div>
          <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-400 dark:text-zinc-600">
            Built by <a href="https://joyogukah.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Joy</a> · Powered by n8n + Gemini
          </footer>
        </Providers>
      </body>
    </html>
  );
}
