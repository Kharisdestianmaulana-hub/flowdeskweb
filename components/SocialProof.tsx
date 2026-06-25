export default function SocialProof({ dict }: { dict: string[] }) {
  const items = dict;

  return (
    <section className="bg-[var(--color-primary)] border-y border-white/10 py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
          {items.map((item, index) => (
            <div key={index} className="flex items-center whitespace-nowrap">
              <span className="text-[12px] font-medium tracking-[0.02em] text-white/70">
                {item}
              </span>
              {index < items.length - 1 && (
                <span className="text-white/30 ml-4 sm:ml-6 hidden sm:inline">·</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
