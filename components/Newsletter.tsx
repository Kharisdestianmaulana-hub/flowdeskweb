'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Newsletter({ dict }: { dict: any }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9tBDD-QihsjTRcz43Ml6o0IyH-lFq6kj65mfbFaQvak7EmFV8EC-Q-HgzA2iYUQMc2w/exec';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      // Because Google Apps Script uses a different domain, we use no-cors
      // This means we can't read the response properly, but if the network request succeeds, we assume it's good.
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Newsletter error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-16 p-8 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-card)]">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-[800] tracking-tight text-[var(--color-text-primary)] mb-2">
          {dict.title}
        </h3>
        <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
          {dict.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading' || status === 'success'}
          placeholder={dict.placeholder}
          className="flex-grow px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              {dict.button}
            </>
          )}
        </button>
      </form>

      {status === 'success' && (
        <div className="mt-4 flex items-center justify-center gap-2 text-green-500 text-[14px] font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          {dict.success}
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 flex items-center justify-center gap-2 text-red-500 text-[14px] font-medium animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle className="w-4 h-4" />
          {dict.error}
        </div>
      )}
    </div>
  );
}
