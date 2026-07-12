'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, UploadCloud, Plus, Trash2, Eye, Pencil, LayoutDashboard, FileText, UserCircle, Users, ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function DashboardPortal() {
  const router = useRouter();
  
  // Session State
  const [user, setUser] = useState<{ username: string, display_name: string, role: string } | null>(null);
  const [activeMenu, setActiveMenu] = useState<'overview' | 'posts' | 'profile' | 'users'>('overview');
  const [loading, setLoading] = useState(true);

  // Posts State
  const [posts, setPosts] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Blog');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  // Gallery State
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Users State
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState('AUTHOR');

  // Profile State
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState({ x: '', instagram: '', tiktok: '', github: '', linkedin: '' });
  const [profileDisplayName, setProfileDisplayName] = useState('');

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/session');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        fetchPosts();
      } else {
        router.push('/dashboard/login');
      }
    } catch (e) {
      router.push('/dashboard/login');
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (Array.isArray(data)) setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (user?.role !== 'SUPER_ADMIN') return;
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (Array.isArray(data)) setAllUsers(data);
    } catch (e) {}
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (res.ok) {
        setBio(data.bio || '');
        setProfileDisplayName(data.display_name || '');
        if (data.social_links) {
          try {
            const parsed = JSON.parse(data.social_links);
            setSocialLinks(prev => ({ ...prev, ...parsed }));
          } catch {
            setSocialLinks(prev => ({ ...prev, x: data.social_links }));
          }
        }
      }
    } catch (e) {}
  };

  // Effect to load data based on active menu
  useEffect(() => {
    if (!user) return;
    if (activeMenu === 'posts') fetchPosts();
    if (activeMenu === 'users') fetchUsers();
    if (activeMenu === 'profile') fetchProfile();
  }, [activeMenu, user]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/dashboard/login');
  };

  // -------------------------------------------------------------
  // POST EDITOR LOGIC
  // -------------------------------------------------------------
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
        alert(data.error || 'Failed to upload image');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchGallery = async () => {
    setLoadingGallery(true);
    try {
      const res = await fetch('/api/images');
      if (res.ok) {
        const data = await res.json();
        setGalleryImages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGallery(false);
    }
  };

  const openGallery = () => {
    setShowGallery(true);
    fetchGallery();
  };

  const handleDeleteImage = async (url: string) => {
    if (!confirm('Are you sure you want to delete this image? It will be removed from Cloudflare R2 forever and any posts using it will lose their cover image.')) return;
    try {
      const res = await fetch('/api/images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.success) {
        fetchGallery();
        // If the deleted image is currently selected, clear it
        if (coverImage === url) {
          setCoverImage('');
        }
      } else {
        alert(data.error || 'Failed to delete image');
      }
    } catch (e) {
      alert('An error occurred');
    }
  };

  const handleSavePost = async () => {
    if (!title || !slug || !content) {
      alert('Title, slug, and content are required');
      return;
    }

    setSaving(true);
    try {
      const url = editingSlug ? `/api/posts/${editingSlug}` : '/api/posts';
      const method = editingSlug ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, content, cover_image: coverImage, category }),
      });

      const data = await res.json();
      if (data.success) {
        setView('list');
        setTitle('');
        setSlug('');
        setCategory('Blog');
        setContent('');
        setCoverImage('');
        setEditingSlug(null);
        fetchPosts();
      } else {
        alert(data.error || 'Failed to save post');
      }
    } catch (e) {
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (postSlug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${postSlug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchPosts();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (e) {
      alert('An error occurred');
    }
  };

  // -------------------------------------------------------------
  // USER MANAGEMENT LOGIC
  // -------------------------------------------------------------
  const handleCreateUser = async () => {
    if (!newUsername || !newPassword || !newDisplayName) return alert("Fill all fields");
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword, display_name: newDisplayName, role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        setNewUsername('');
        setNewPassword('');
        setNewDisplayName('');
        fetchUsers();
      } else alert(data.error);
    } catch (e) { alert("Error"); }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete user?')) return;
    await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  // -------------------------------------------------------------
  // PROFILE LOGIC
  // -------------------------------------------------------------
  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, social_links: JSON.stringify(socialLinks), display_name: profileDisplayName })
      });
      if (res.ok) alert("Profile updated!");
    } catch (e) { alert("Error"); }
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text-muted)]">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-2 text-xl font-black text-[var(--color-text-primary)]">
            <div className="w-8 h-8 bg-gradient-to-tr from-[var(--color-primary)] to-blue-500 rounded-lg flex items-center justify-center text-white">FD</div>
            FlowDesk
          </div>
          <div className="mt-2 text-xs text-[var(--color-text-muted)]">Logged in as <span className="font-semibold text-[var(--color-primary)]">{user.display_name}</span></div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button onClick={() => { setActiveMenu('overview'); setView('list'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeMenu === 'overview' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
            <LayoutDashboard className="w-4 h-4" /> Overview
          </button>
          <button onClick={() => { setActiveMenu('posts'); setView('list'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeMenu === 'posts' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
            <FileText className="w-4 h-4" /> Posts
          </button>
          <button onClick={() => setActiveMenu('profile')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeMenu === 'profile' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
            <UserCircle className="w-4 h-4" /> My Profile
          </button>
          
          {user.role === 'SUPER_ADMIN' && (
            <button onClick={() => setActiveMenu('users')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeMenu === 'users' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
              <Users className="w-4 h-4" /> Users
            </button>
          )}
        </nav>

        <div className="p-4">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg font-medium text-sm hover:text-[var(--color-text-primary)] transition">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        
        {activeMenu === 'overview' && (
          <div className="p-10 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                <p className="text-[var(--color-text-secondary)] text-sm font-medium">Total Posts</p>
                <p className="text-4xl font-black text-[var(--color-text-primary)] mt-2">{posts.length}</p>
              </div>
              <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                <p className="text-[var(--color-text-secondary)] text-sm font-medium">Your Role</p>
                <p className="text-xl font-bold text-[var(--color-primary)] mt-2">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'posts' && view === 'list' && (
          <div className="p-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Posts</h1>
              <button onClick={() => {
                setTitle(''); setSlug(''); setCategory('Blog'); setContent(''); setCoverImage(''); setEditingSlug(null); setView('editor');
              }} className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium text-sm hover:brightness-110 transition">
                <Plus className="w-4 h-4" /> New Post
              </button>
            </div>
            
            <div className="grid gap-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm hover:border-[var(--color-primary)] transition-colors">
                  <div className="flex items-center gap-4">
                    {post.cover_image && (
                      <div className="relative w-16 h-12 rounded overflow-hidden">
                        <Image src={post.cover_image} alt="" fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-[var(--color-text-primary)]">{post.title}</h3>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {format(new Date(post.created_at), 'MMM d, yyyy HH:mm')} &middot; By {post.author}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/id/blog/${post.slug}`} target="_blank" rel="noreferrer" className="p-2 text-[var(--color-text-muted)] hover:text-blue-500 bg-[var(--color-surface-raised)] rounded-lg transition" title="View">
                      <Eye className="w-4 h-4" />
                    </a>
                    {(user.role === 'SUPER_ADMIN' || user.display_name === post.author) && (
                      <>
                        <button onClick={() => {
                          setEditingSlug(post.slug);
                          setTitle(post.title);
                          setSlug(post.slug);
                          setCategory(post.category || 'Blog');
                          setContent(post.content);
                          setCoverImage(post.cover_image || '');
                          setView('editor');
                        }} className="p-2 text-[var(--color-text-muted)] hover:text-green-500 bg-[var(--color-surface-raised)] rounded-lg transition" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeletePost(post.slug)} className="p-2 text-[var(--color-text-muted)] hover:text-red-500 bg-[var(--color-surface-raised)] rounded-lg transition" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMenu === 'posts' && view === 'editor' && (
          <div className="p-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{editingSlug ? 'Edit Post' : 'New Post'}</h1>
              <button onClick={() => setView('list')} className="px-4 py-2 bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg font-medium text-sm hover:text-[var(--color-text-primary)] transition">
                Cancel
              </button>
            </div>
            
            <div className="space-y-6 bg-[var(--color-surface)] p-8 rounded-2xl border border-[var(--color-border)]">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Title</label>
                <input type="text" value={title} onChange={handleTitleChange} placeholder="Epic product update..." className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Slug</label>
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition">
                    <option value="Blog">Blog</option>
                    <option value="Updates">Updates</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Guides">Guides</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Cover Image</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] rounded-lg font-medium text-sm transition group">
                    <UploadCloud className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition" />
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                  
                  <button onClick={openGallery} className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] rounded-lg font-medium text-sm transition">
                    <ImageIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                    Choose from Gallery
                  </button>

                  {coverImage && <div className="text-sm text-green-500 flex items-center gap-1">✓ Image Selected</div>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Content (Markdown)</label>
                <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-bg)]">
                  <MarkdownEditor value={content} onChange={setContent} />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button onClick={handleSavePost} disabled={saving} className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-bold hover:brightness-110 transition disabled:opacity-50">
                  {saving ? 'Saving...' : 'Publish Post'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'profile' && (
          <div className="p-10 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8">My Profile</h1>
            <div className="space-y-6 bg-[var(--color-surface)] p-8 rounded-2xl border border-[var(--color-border)]">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Display Name</label>
                <input type="text" value={profileDisplayName} onChange={(e) => setProfileDisplayName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none" placeholder="Short description about yourself..." />
              </div>
              <div className="pt-4 border-t border-[var(--color-border)]">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">X / Twitter</label>
                    <input type="text" value={socialLinks.x} onChange={(e) => setSocialLinks({...socialLinks, x: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none" placeholder="https://x.com/username" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Instagram</label>
                    <input type="text" value={socialLinks.instagram} onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none" placeholder="https://instagram.com/username" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">TikTok</label>
                    <input type="text" value={socialLinks.tiktok} onChange={(e) => setSocialLinks({...socialLinks, tiktok: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none" placeholder="https://tiktok.com/@username" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">LinkedIn</label>
                    <input type="text" value={socialLinks.linkedin} onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none" placeholder="https://linkedin.com/in/username" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">GitHub</label>
                    <input type="text" value={socialLinks.github} onChange={(e) => setSocialLinks({...socialLinks, github: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none" placeholder="https://github.com/username" />
                  </div>
                </div>
              </div>
              <button onClick={handleSaveProfile} className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-bold hover:brightness-110 transition">
                Save Profile
              </button>
            </div>
          </div>
        )}

        {activeMenu === 'users' && user.role === 'SUPER_ADMIN' && (
          <div className="p-10 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8">User Management</h1>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)]">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Add User</h2>
                <div className="space-y-4">
                  <input type="text" placeholder="Username" value={newUsername} onChange={(e)=>setNewUsername(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-white outline-none" />
                  <input type="password" placeholder="Password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-white outline-none" />
                  <input type="text" placeholder="Display Name" value={newDisplayName} onChange={(e)=>setNewDisplayName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-white outline-none" />
                  <select value={newRole} onChange={(e)=>setNewRole(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-white outline-none">
                    <option value="AUTHOR">Author</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                  <button onClick={handleCreateUser} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-bold">Create User</button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Existing Users</h2>
                {allUsers.map(u => (
                  <div key={u.id} className="flex justify-between items-center p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                    <div>
                      <p className="font-bold text-white">{u.display_name} <span className="text-xs text-purple-400">({u.role})</span></p>
                      <p className="text-sm text-[var(--color-text-muted)]">@{u.username}</p>
                    </div>
                    {u.id !== user.username && (
                      <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* GALLERY MODAL */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[var(--color-primary)]" />
                Media Gallery
              </h2>
              <button onClick={() => setShowGallery(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              {loadingGallery ? (
                <div className="text-center py-10 text-[var(--color-text-muted)]">Loading images...</div>
              ) : galleryImages.length === 0 ? (
                <div className="text-center py-10 text-[var(--color-text-muted)]">No images found. Upload a cover image first.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="group relative aspect-video bg-[var(--color-bg)] rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-primary)] transition">
                      <Image src={img.cover_image} alt="Gallery image" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 backdrop-blur-sm">
                        <button onClick={() => setPreviewImage(img.cover_image)} title="Preview" className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/40 transition">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => {
                          setCoverImage(img.cover_image);
                          setShowGallery(false);
                        }} title="Use Image" className="px-3 py-1.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:brightness-110 transition">
                          Select
                        </button>
                        <button onClick={() => handleDeleteImage(img.cover_image)} title="Delete from R2" className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative w-full max-w-5xl aspect-video" onClick={e => e.stopPropagation()}>
            <Image src={previewImage} alt="Preview" fill className="object-contain" />
            <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 bg-black/50 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] z-40 flex items-center justify-around p-2 pb-safe">
        <button onClick={() => { setActiveMenu('overview'); setView('list'); }} className={`flex flex-col items-center p-2 rounded-lg ${activeMenu === 'overview' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
          <LayoutDashboard className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Overview</span>
        </button>
        <button onClick={() => { setActiveMenu('posts'); setView('list'); }} className={`flex flex-col items-center p-2 rounded-lg ${activeMenu === 'posts' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
          <FileText className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Posts</span>
        </button>
        <button onClick={() => setActiveMenu('profile')} className={`flex flex-col items-center p-2 rounded-lg ${activeMenu === 'profile' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
          <UserCircle className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
        {user.role === 'SUPER_ADMIN' && (
          <button onClick={() => setActiveMenu('users')} className={`flex flex-col items-center p-2 rounded-lg ${activeMenu === 'users' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
            <Users className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Users</span>
          </button>
        )}
      </nav>

    </div>
  );
}
