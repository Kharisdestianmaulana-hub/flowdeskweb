import Link from 'next/link';

interface AnnouncementBannerProps {
  latestRelease: any;
  lang: string;
}

export default function AnnouncementBanner({ latestRelease, lang }: AnnouncementBannerProps) {
  return (
    <div className="sticky top-0 w-full bg-[var(--color-primary)] py-2.5 flex items-center justify-center text-[13px] font-medium text-white z-[110]">
      <span>What's New: {latestRelease?.name || latestRelease?.tag_name || 'Update'} Is Here!!!</span>
      <Link href={`/${lang}/download`} className="ml-2 font-semibold text-white underline hover:text-white/80 transition-colors">
        Learn more
      </Link>
    </div>
  );
}
