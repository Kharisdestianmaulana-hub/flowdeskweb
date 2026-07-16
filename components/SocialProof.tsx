export default function SocialProof({ dict }: { dict: string[] }) {
  const items = dict;

  // Duplicate items to ensure they cover wide screens
  const repeatedItems = [...items, ...items, ...items, ...items];

  const renderBlock = () => (
    <div className="flex items-center gap-3 sm:gap-6 shrink-0 pr-3 sm:pr-6">
      {repeatedItems.map((item, index) => (
        <div key={index} className="flex items-center whitespace-nowrap">
          <span className="text-[12px] font-medium tracking-[0.02em] text-white/70">
            {item}
          </span>
          {/* Selalu tampilkan pemisah karena teks mengulang terus */}
          <span className="text-white/30 ml-4 sm:ml-6 hidden sm:inline">·</span>
        </div>
      ))}
    </div>
  );

  return (
    <section className="bg-[var(--color-primary)] border-y border-white/10 py-4 overflow-hidden relative flex">
      <div className="flex animate-marquee min-w-max">
        {/* Dua blok identik agar saat bergeser -50% terlihat seamless */}
        {renderBlock()}
        {renderBlock()}
      </div>
    </section>
  );
}
