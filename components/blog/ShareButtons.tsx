'use client';

import { useState, useEffect } from 'react';
import { Twitter, Linkedin, Link2, Check } from 'lucide-react';

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="flex items-center gap-3 py-6 border-t border-[var(--color-border)] mt-12">
      <span className="text-sm font-medium text-[var(--color-text-muted)] mr-2">Share this article:</span>
      <button onClick={shareTwitter} className="p-2 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-blue-400 hover:border-blue-400/30 transition-colors" title="Share on Twitter">
        <Twitter size={18} />
      </button>
      <button onClick={shareLinkedin} className="p-2 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-blue-600 hover:border-blue-600/30 transition-colors" title="Share on LinkedIn">
        <Linkedin size={18} />
      </button>
      <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors" title="Copy Link">
        {copied ? <Check size={16} className="text-green-500" /> : <Link2 size={16} />}
        <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  );
}
