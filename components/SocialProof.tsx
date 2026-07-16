export default function SocialProof({ dict }: { dict: string[] }) {
  const items = dict;

  return (
    <>
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

      {/* Product Hunt Widget */}
      <section className="py-8 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto border border-[var(--color-border)] rounded-xl p-5 max-w-[500px] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)] transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-4 mb-4">
              <img 
                alt="FlowDesk" 
                src="https://ph-files.imgix.net/2ff717f4-c306-4ef5-8018-442a1f4a942e.png?auto=compress,format&amp;codec=mozjpeg&amp;cs=strip&amp;fit=crop&amp;h=80&amp;w=80" 
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-[var(--color-border-subtle)]"
              />
              <div className="flex-1 min-w-0 text-left">
                <h3 className="m-0 text-[18px] font-semibold text-[var(--color-text-primary)] leading-tight overflow-hidden text-ellipsis whitespace-nowrap">FlowDesk</h3>
                <p className="m-0 mt-1 text-[14px] text-[var(--color-text-secondary)] leading-snug overflow-hidden text-ellipsis line-clamp-2">A local-first workspace for teams and creators</p>
              </div>
            </div>
            <a href="https://www.producthunt.com/products/flowdesk-4?embed=true&amp;utm_source=embed&amp;utm_medium=post_embed" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full gap-1 px-4 py-2.5 bg-[#FF6154] hover:bg-[#ff4e40] text-white no-underline rounded-lg text-[14px] font-semibold transition-colors">
              Check it out on Product Hunt →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
