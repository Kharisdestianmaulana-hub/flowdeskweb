'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (data.success) {
        router.push('/dashboard/portal-update');
        router.refresh();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-md p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">FlowDesk CMS</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">Login to manage updates</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
