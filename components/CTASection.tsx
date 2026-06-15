import { GithubIcon as Github } from './GithubIcon';
import { ReleaseAsset } from '../types/github';
import Reveal from './animations/Reveal';

interface CTASectionProps {
  assets: ReleaseAsset[];
  dict: any;
}

export default function CTASection({ assets, dict }: CTASectionProps) {
  const macAsset = assets?.find(a => a.name.includes('.dmg'));

  return (
    <section className="bg-[image:var(--gradient-cta)] py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-[800] tracking-[-0.01em] text-[var(--color-text-primary)] mb-6">
            {dict.title}
          </h2>
          <p className="text-[18px] text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto">
            {dict.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={macAsset ? macAsset.browser_download_url : '#download'}
              className="w-full sm:w-auto px-8 py-3.5 rounded-[var(--radius-md)] bg-white text-[var(--color-primary)] text-[15px] font-bold shadow-[var(--shadow-elevated)] hover:scale-105 transition-transform duration-200 text-center"
            >
              {dict.downloadMac}
            </a>
            <a
              href="https://github.com/Kharisdestianmaulana-hub/flowdesk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-[var(--radius-md)] bg-transparent border border-white/30 text-white hover:bg-white/10 transition-colors duration-200 text-[15px] font-semibold"
            >
              <Github className="w-5 h-5" />
              <span>{dict.viewGithub}</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
