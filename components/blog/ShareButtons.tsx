'use client';

import { useState, useEffect } from 'react';
import { Link2, Check } from 'lucide-react';
import { FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';

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

  const shareInstagram = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard! You can now paste it in Instagram.');
    window.open('https://instagram.com', '_blank');
  };

  const shareTiktok = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard! You can now paste it in TikTok.');
    window.open('https://tiktok.com', '_blank');
  };

  return (
    <div className="flex items-center gap-3 py-6 border-t border-[var(--color-border)] mt-12">
      <span className="text-sm font-medium text-[var(--color-text-muted)] mr-2">Share this article:</span>
      <button onClick={shareTwitter} className="p-2 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-blue-400 hover:border-blue-400/30 transition-colors" title="Share on Twitter">
        <FaTwitter size={18} />
      </button>
      <button onClick={shareInstagram} className="p-2 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-pink-500 hover:border-pink-500/30 transition-colors" title="Share on Instagram">
        <FaInstagram size={18} />
      </button>
      <button onClick={shareTiktok} className="p-2 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white hover:border-white/30 transition-colors" title="Share on TikTok">
        <FaTiktok size={18} />
      </button>
      <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors" title="Copy Link">
        {copied ? <Check size={16} className="text-green-500" /> : <Link2 size={16} />}
        <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  );
}
