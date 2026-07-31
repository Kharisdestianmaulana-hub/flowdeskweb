import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "../globals.css";
import ProgressBar from "@/components/ProgressBar";
import TabManager from "@/components/TabManager";
import ScrollToTop from "@/components/ScrollToTop";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { queryD1 } from '@/lib/db';

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

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flowdesk.web.id"),
  title: "FlowDesk | Offline-First Productivity App & Workspace",
  description: "The best Notion alternative for offline work. A local-first desktop workspace for projects, tasks, docs, and files. No cloud, no subscription.",
  keywords: ["FlowDesk", "flowdesk app", "offline productivity app", "local-first workspace", "Notion alternative offline", "no cloud productivity software", "offline task manager", "private workspace app", "desktop productivity app", "offline workspace"],
  alternates: {
    canonical: "https://flowdesk.web.id",
    languages: {
      'en': 'https://flowdesk.web.id/en',
      'id': 'https://flowdesk.web.id/id',
    },
  },
  openGraph: {
    title: "FlowDesk | Offline-First Productivity App & Workspace",
    description: "The best Notion alternative for offline work. A local-first desktop workspace for projects, tasks, docs, and files. No cloud, no subscription.",
    url: "https://flowdesk.web.id",
    siteName: "FlowDesk",
    type: "website",
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'FlowDesk - Offline-First Productivity App' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowDesk | Offline-First Productivity App",
    description: "Projects, tasks, docs, and files — entirely on your machine. No cloud. No subscription.",
  },
  verification: {
    google: "CVHrEOkr5FJVDbVTYo4o7xCH0i87asFgNFRBVuRkgXs",
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
  
  let settings = [];
  try {
    settings = await queryD1("SELECT * FROM settings");
  } catch (e) {
    console.error("Failed to load settings:", e);
  }

  const bannerActive = settings.find((s:any) => s.key === 'banner_active')?.value === 'true';
  const bannerText = settings.find((s:any) => s.key === 'banner_text')?.value || 'Update is Here!!!';
  const bannerLink = settings.find((s:any) => s.key === 'banner_link')?.value || '/en/changelog';
  
  return (
    <html lang={lang} className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} font-sans antialiased bg-[var(--color-bg)] text-[var(--color-text-primary)] min-h-screen flex flex-col selection:bg-[var(--color-primary)] selection:text-white`}
        suppressHydrationWarning
      >
        <ProgressBar />
        <TabManager currentLang={lang} />
        {bannerActive && <AnnouncementBanner text={bannerText} linkUrl={bannerLink} />}
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
