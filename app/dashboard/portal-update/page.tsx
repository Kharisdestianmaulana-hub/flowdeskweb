'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, UploadCloud, Plus, Trash2, Eye, Pencil } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function DashboardPortal() {
  const [posts, setPosts] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Editor states
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/dashboard/login');
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setCoverImage(data.url);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (e) {
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSavePost = async () => {
    if (!title || !slug || !content) {
      alert('Title, slug, and content are required.');
      return;
    }

    setSaving(true);
    try {
      const url = editingSlug ? `/api/posts/${editingSlug}` : '/api/posts';
      const method = editingSlug ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, content, cover_image: coverImage }),
      });

      const data = await res.json();
      if (data.success) {
        // Reset form and go back to list
        setTitle('');
        setSlug('');
        setContent('');
        setCoverImage('');
        setEditingSlug(null);
        setView('list');
        fetchPosts();
      } else {
        alert('Save failed: ' + data.error);
      }
    } catch (e) {
      alert('Error saving post');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (slugToDelete: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/posts/${slugToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchPosts();
      }
    } catch (e) {
      alert('Error deleting post');
    }
  };

  const handleEditPost = (post: any) => {
    setEditingSlug(post.slug);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setCoverImage(post.cover_image || '');
    setView('editor');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Top Navbar */}
      <nav className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">FlowDesk CMS</h1>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setView(view === 'list' ? 'editor' : 'list');
              if (view === 'list') {
                setTitle('');
                setSlug('');
                setContent('');
                setCoverImage('');
                setEditingSlug(null);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium text-sm hover:brightness-110 transition"
          >
            {view === 'list' ? (
              <><Plus className="w-4 h-4" /> New Post</>
            ) : (
              'Cancel'
            )}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg font-medium text-sm hover:text-[var(--color-text-primary)] transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {view === 'list' ? (
          // POST LIST VIEW
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8">Published Posts</h2>
            {loading ? (
              <p className="text-[var(--color-text-muted)]">Loading posts...</p>
            ) : posts.length === 0 ? (
              <div className="text-center py-24 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl border-dashed">
                <p className="text-[var(--color-text-muted)]">No posts found. Create your first update!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm hover:border-[var(--color-border-hover)] transition-colors">
                    <div className="flex items-center gap-4">
                      {post.cover_image && (
                        <div className="relative w-16 h-12 rounded overflow-hidden">
                          <Image src={post.cover_image} alt="" fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-[var(--color-text-primary)]">{post.title}</h3>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {format(new Date(post.created_at), 'MMM d, yyyy HH:mm')} &middot; /{post.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={`/en/blog/${post.slug}`} target="_blank" rel="noreferrer" className="p-2 text-[var(--color-text-muted)] hover:text-blue-500 bg-[var(--color-surface-raised)] rounded-lg transition" title="View">
                        <Eye className="w-4 h-4" />
                      </a>
                      <button onClick={() => handleEditPost(post)} className="p-2 text-[var(--color-text-muted)] hover:text-green-500 bg-[var(--color-surface-raised)] rounded-lg transition" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeletePost(post.slug)} className="p-2 text-[var(--color-text-muted)] hover:text-red-500 bg-[var(--color-surface-raised)] rounded-lg transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // EDITOR VIEW
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Create New Post</h2>
            
            <div className="space-y-6">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Post Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="e.g., FlowDesk v1.7 is Here"
                    className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">URL Slug (Auto-generated)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-muted)] font-mono text-sm"
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Cover Image</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                    <UploadCloud className="w-5 h-5" />
                    <span className="text-sm font-medium">{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                  {coverImage && (
                    <div className="relative h-12 w-24 rounded overflow-hidden border border-[var(--color-border)]">
                      <Image src={coverImage} alt="Cover Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Markdown Content */}
              <div className="mt-8">
                <MarkdownEditor value={content} onChange={setContent} />
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex justify-end">
                <button
                  onClick={handleSavePost}
                  disabled={saving || !title || !content}
                  className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-lg font-medium transition disabled:opacity-50"
                >
                  {saving ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
