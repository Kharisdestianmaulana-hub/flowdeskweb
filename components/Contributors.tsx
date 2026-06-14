import Image from 'next/image';

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface ContributorsProps {
  contributors: Contributor[];
  lang: string;
}

export default function Contributors({ contributors, lang }: ContributorsProps) {
  if (!contributors || contributors.length === 0) return null;

  const title = lang === 'id' ? "Pahlawan di Balik Layar" : "The Heroes Behind FlowDesk";
  const subtitle = lang === 'id' 
    ? "FlowDesk dikembangkan secara independen dan dibentuk secara cermat oleh para kontributor resmi kami yang luar biasa." 
    : "FlowDesk is developed independently and carefully shaped by our amazing authorized contributors.";

  return (
    <section className="py-24 bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-[800] tracking-tight text-[var(--color-text-primary)] mb-4">
          {title}
        </h2>
        <p className="text-[16px] text-[var(--color-text-secondary)] mb-12 max-w-2xl mx-auto">
          {subtitle}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {contributors.map((user) => (
            <a 
              key={user.id}
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-all transform group-hover:scale-110 group-hover:shadow-[var(--shadow-card-hover)] group-hover:z-10 bg-[var(--color-surface)]">
                <Image 
                  src={user.avatar_url} 
                  alt={user.login} 
                  width={56} 
                  height={56} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-[12px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                @{user.login}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
