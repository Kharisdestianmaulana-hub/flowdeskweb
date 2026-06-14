import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlowDesk — Your clean, offline productivity haven",
  description: "A local-first desktop workspace for projects, tasks, docs, and files. No cloud. No subscription.",
  openGraph: {
    title: "FlowDesk",
    description: "Local-first desktop productivity. Built with Avalonia UI.",
    url: "https://flowdesk.app",
    siteName: "FlowDesk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowDesk — Offline-first productivity",
    description: "Projects, tasks, docs, and files — entirely on your machine.",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  return (
    <html lang={lang} className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
