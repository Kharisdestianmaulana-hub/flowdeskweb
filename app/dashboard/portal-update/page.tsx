'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, UploadCloud, Plus, Trash2, Eye, Pencil, LayoutDashboard, FileText, UserCircle, Users, ImageIcon, X, Map, HelpCircle, Menu } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function DashboardPortal() {
  const router = useRouter();
  
  // Session State
  const [user, setUser] = useState<{ username: string, display_name: string, role: string } | null>(null);
  const [activeMenu, setActiveMenu] = useState<'overview' | 'posts' | 'docs' | 'roadmap' | 'profile' | 'users' | 'media' | 'faq'>('overview');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Posts State
  const [posts, setPosts] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categories, setCategories] = useState<string[]>(['Blog']);
  const [categoryInput, setCategoryInput] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('published');
  const [publishedAt, setPublishedAt] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  // Docs State
  const [docs, setDocs] = useState<any[]>([]);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docTitleId, setDocTitleId] = useState('');
  const [docTitleEn, setDocTitleEn] = useState('');
  const [docContentId, setDocContentId] = useState('');
  const [docContentEn, setDocContentEn] = useState('');
  const [docSlug, setDocSlug] = useState('');
  const [docOrder, setDocOrder] = useState<number>(99);
  const [docCategory, setDocCategory] = useState('');

  // Roadmap State
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [editingRoadmapId, setEditingRoadmapId] = useState<string | null>(null);
  const [rmQuarter, setRmQuarter] = useState('');
  const [rmVersion, setRmVersion] = useState('');
  const [rmStatus, setRmStatus] = useState('planned');
  const [rmTitleId, setRmTitleId] = useState('');
  const [rmTitleEn, setRmTitleEn] = useState('');
  const [rmDescId, setRmDescId] = useState('');
  const [rmDescEn, setRmDescEn] = useState('');
  const [rmItemsId, setRmItemsId] = useState('');
  const [rmItemsEn, setRmItemsEn] = useState('');
  const [rmOrder, setRmOrder] = useState<number>(99);

  // FAQ State
  const [faqs, setFaqs] = useState<any[]>([]);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqQId, setFaqQId] = useState('');
  const [faqAId, setFaqAId] = useState('');
  const [faqQEn, setFaqQEn] = useState('');
  const [faqAEn, setFaqAEn] = useState('');
  const [faqOrder, setFaqOrder] = useState<number>(99);
  const [faqSearchTerm, setFaqSearchTerm] = useState('');

  // Gallery State
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Search & Filter States
  const [postSearchTerm, setPostSearchTerm] = useState('');
  const [postFilterStatus, setPostFilterStatus] = useState('all');
  const [docSearchTerm, setDocSearchTerm] = useState('');
  const [rmSearchTerm, setRmSearchTerm] = useState('');

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

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/docs');
      const data = await res.json();
      if (Array.isArray(data)) setDocs(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRoadmaps = async () => {
    try {
      const res = await fetch('/api/roadmap');
      const data = await res.json();
      if (Array.isArray(data)) setRoadmaps(data);
    } catch (e) {
      console.error(e);
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

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/faq');
      const data = await res.json();
      if (Array.isArray(data)) setFaqs(data);
    } catch (e) {
      console.error(e);
    }
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
    if (activeMenu === 'docs') fetchDocs();
    if (activeMenu === 'roadmap') fetchRoadmaps();
    if (activeMenu === 'users') fetchUsers();
    if (activeMenu === 'profile') fetchProfile();
    if (activeMenu === 'media') fetchGallery();
    if (activeMenu === 'faq') fetchFaqs();
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
        body: JSON.stringify({ 
          title, slug, content, cover_image: coverImage, category: categories.join(', '), 
          meta_description: metaDescription, status, 
          published_at: status === 'scheduled' && publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString() 
        }),
      });

      const data = await res.json();
      if (data.success) {
        setView('list');
        setTitle('');
        setSlug('');
        setCategories(['Blog']);
        setCategoryInput('');
        setMetaDescription('');
        setContent('');
        setCoverImage('');
        setStatus('published');
        setPublishedAt('');
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
  // DOCS EDITOR LOGIC
  // -------------------------------------------------------------
  const handleSaveDoc = async () => {
    if (!docTitleId || !docTitleEn || !docSlug || !docContentId || !docContentEn) {
      alert('All Title, Slug, and Content fields in both languages are required');
      return;
    }

    setSaving(true);
    try {
      const url = editingDocId ? `/api/docs/${editingDocId}` : '/api/docs';
      const method = editingDocId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          slug: docSlug, title_id: docTitleId, title_en: docTitleEn, content_id: docContentId, content_en: docContentEn, order_num: docOrder, category: docCategory
        }),
      });

      const data = await res.json();
      if (data.success) {
        setView('list');
        setDocTitleId('');
        setDocTitleEn('');
        setDocSlug('');
        setDocContentId('');
        setDocContentEn('');
        setDocOrder(99);
        setDocCategory('');
        setEditingDocId(null);
        fetchDocs();
      } else {
        alert(data.error || 'Failed to save doc');
      }
    } catch (e) {
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doc?')) return;
    try {
      const res = await fetch(`/api/docs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchDocs();
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
  // ROADMAP EDITOR LOGIC
  // -------------------------------------------------------------
  const handleSaveRoadmap = async () => {
    if (!rmQuarter || !rmVersion || !rmStatus || !rmTitleId || !rmTitleEn) {
      alert('Quarter, Version, Status, and Titles are required');
      return;
    }
    setSaving(true);
    try {
      const url = editingRoadmapId ? `/api/roadmap/${editingRoadmapId}` : '/api/roadmap';
      const method = editingRoadmapId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          quarter: rmQuarter, version: rmVersion, status: rmStatus, 
          title_id: rmTitleId, title_en: rmTitleEn, 
          description_id: rmDescId, description_en: rmDescEn, 
          items_id: rmItemsId, items_en: rmItemsEn, order_num: rmOrder
        }),
      });
      const data = await res.json();
      if (data.success) {
        setView('list');
        setRmQuarter(''); setRmVersion(''); setRmStatus('planned');
        setRmTitleId(''); setRmTitleEn(''); setRmDescId(''); setRmDescEn('');
        setRmItemsId(''); setRmItemsEn(''); setRmOrder(99);
        setEditingRoadmapId(null);
        fetchRoadmaps();
      } else {
        alert(data.error || 'Failed to save roadmap');
      }
    } catch (e) {
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoadmap = async (id: string) => {
    if (!confirm('Are you sure you want to delete this roadmap item?')) return;
    try {
      const res = await fetch(`/api/roadmap/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchRoadmaps();
    } catch (e) {
      alert('An error occurred');
    }
  };

  const handleSaveFaq = async () => {
    if (!faqQId || !faqQEn || !faqAId || !faqAEn) {
      alert('All FAQ fields are required');
      return;
    }
    setSaving(true);
    const payload = {
      question_id: faqQId,
      answer_id: faqAId,
      question_en: faqQEn,
      answer_en: faqAEn,
      order_num: faqOrder
    };
    
    try {
      let res;
      if (editingFaqId) {
        res = await fetch(`/api/faq/${editingFaqId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      
      const data = await res.json();
      if (data.success) {
        fetchFaqs();
        setView('list');
      } else {
        alert(data.error || 'Failed to save FAQ');
      }
    } catch (e) {
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ item?')) return;
    try {
      const res = await fetch(`/api/faq/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchFaqs();
    } catch (e) {
      alert('An error occurred');
    }
  };

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
    <div className="h-screen overflow-hidden flex bg-[var(--color-bg)]">
      
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
          {user.role === 'SUPER_ADMIN' && (
            <button onClick={() => { setActiveMenu('docs'); setView('list'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeMenu === 'docs' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
              <FileText className="w-4 h-4" /> Docs
            </button>
          )}
          {user.role === 'SUPER_ADMIN' && (
            <button onClick={() => { setActiveMenu('roadmap'); setView('list'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeMenu === 'roadmap' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
              <Map className="w-4 h-4" /> Roadmap
            </button>
          )}
          {user.role === 'SUPER_ADMIN' && (
            <button onClick={() => { setActiveMenu('faq'); setView('list'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeMenu === 'faq' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
              <HelpCircle className="w-4 h-4" /> FAQ
            </button>
          )}
          <button onClick={() => setActiveMenu('media')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeMenu === 'media' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
            <ImageIcon className="w-4 h-4" /> Media
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

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-lg font-black text-[var(--color-text-primary)]">
          <div className="w-6 h-6 bg-gradient-to-tr from-[var(--color-primary)] to-blue-500 rounded flex items-center justify-center text-white text-[10px]">FD</div>
          FlowDesk
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE FULL SCREEN MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-[var(--color-bg)] pt-16 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <button onClick={() => { setActiveMenu('overview'); setView('list'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${activeMenu === 'overview' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
              <LayoutDashboard className="w-5 h-5" /> Overview
            </button>
            <button onClick={() => { setActiveMenu('posts'); setView('list'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${activeMenu === 'posts' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
              <FileText className="w-5 h-5" /> Posts
            </button>
            {user.role === 'SUPER_ADMIN' && (
              <button onClick={() => { setActiveMenu('docs'); setView('list'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${activeMenu === 'docs' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
                <FileText className="w-5 h-5" /> Docs
              </button>
            )}
            {user.role === 'SUPER_ADMIN' && (
              <button onClick={() => { setActiveMenu('roadmap'); setView('list'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${activeMenu === 'roadmap' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
                <Map className="w-5 h-5" /> Roadmap
              </button>
            )}
            {user.role === 'SUPER_ADMIN' && (
              <button onClick={() => { setActiveMenu('faq'); setView('list'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${activeMenu === 'faq' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
                <HelpCircle className="w-5 h-5" /> FAQ
              </button>
            )}
            <button onClick={() => { setActiveMenu('media'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${activeMenu === 'media' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
              <ImageIcon className="w-5 h-5" /> Media
            </button>
            <button onClick={() => { setActiveMenu('profile'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${activeMenu === 'profile' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
              <UserCircle className="w-5 h-5" /> My Profile
            </button>
            {user.role === 'SUPER_ADMIN' && (
              <button onClick={() => { setActiveMenu('users'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${activeMenu === 'users' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'}`}>
                <Users className="w-5 h-5" /> Users
              </button>
            )}
          </div>
          <div className="p-4 border-t border-[var(--color-border)]">
            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-xl font-medium text-base hover:text-[var(--color-text-primary)] transition">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto pb-6 md:pb-0 pt-16 md:pt-0">
        
        {activeMenu === 'overview' && (
          <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                <p className="text-[var(--color-text-secondary)] text-sm font-medium">Total Posts</p>
                <p className="text-4xl font-black text-[var(--color-text-primary)] mt-2">{posts.length}</p>
              </div>
              <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                <p className="text-[var(--color-text-secondary)] text-sm font-medium">Your Role</p>
                <p className="text-xl font-bold text-[var(--color-primary)] mt-2">{user.role}</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Top 5 Popular Articles</h2>
            <div className="space-y-4">
              {[...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map((post, index) => (
                <div key={post.id} className="flex items-center gap-4 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                  <div className="w-8 h-8 flex-shrink-0 bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold rounded-lg flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--color-text-primary)] truncate">{post.title}</h3>
                    <p className="text-xs text-[var(--color-text-muted)]">By {post.author}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)] font-medium bg-[var(--color-surface-raised)] px-3 py-1.5 rounded-lg text-sm border border-[var(--color-border-subtle)]">
                    <Eye className="w-4 h-4 text-[var(--color-primary)]" /> {post.views || 0}
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <p className="text-[var(--color-text-muted)] text-sm">No articles published yet.</p>
              )}
            </div>
          </div>
        )}

        {activeMenu === 'posts' && view === 'list' && (
          <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Posts</h1>
              <button onClick={() => {
                setTitle(''); setSlug(''); setCategories(['Blog']); setCategoryInput(''); setMetaDescription(''); setContent(''); setCoverImage(''); setStatus('published'); setPublishedAt(''); setEditingSlug(null); setView('editor');
              }} className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium text-sm hover:brightness-110 transition">
                <Plus className="w-4 h-4" /> New Post
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input type="text" placeholder="Search posts by title or slug..." value={postSearchTerm} onChange={(e) => setPostSearchTerm(e.target.value)} className="flex-1 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition" />
              <select value={postFilterStatus} onChange={(e) => setPostFilterStatus(e.target.value)} className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition">
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            
            <div className="grid gap-4">
              {posts.filter(post => {
                const matchesSearch = post.title.toLowerCase().includes(postSearchTerm.toLowerCase()) || post.slug.toLowerCase().includes(postSearchTerm.toLowerCase());
                const matchesStatus = postFilterStatus === 'all' || post.status === postFilterStatus || (!post.status && postFilterStatus === 'published');
                return matchesSearch && matchesStatus;
              }).map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm hover:border-[var(--color-primary)] transition-colors">
                  <div className="flex items-center gap-4">
                    {post.cover_image && (
                      <div className="relative w-16 h-12 rounded overflow-hidden">
                        <Image src={post.cover_image} alt="" fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[var(--color-text-primary)]">{post.title}</h3>
                        {post.status === 'draft' && <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 text-[10px] font-bold tracking-wider uppercase">Draft</span>}
                        {post.status === 'scheduled' && <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500 text-[10px] font-bold tracking-wider uppercase">Scheduled</span>}
                        {(!post.status || post.status === 'published') && <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-bold tracking-wider uppercase">Published</span>}
                      </div>
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
                          setCategories(post.category ? post.category.split(',').map((c: string) => c.trim()).filter(Boolean) : ['Blog']);
                          setCategoryInput('');
                          setMetaDescription(post.meta_description || '');
                          setContent(post.content);
                          setCoverImage(post.cover_image || '');
                          setStatus(post.status || 'published');
                          // Remove 'Z' if it's there and format to datetime-local expected format (YYYY-MM-DDThh:mm)
                          setPublishedAt(post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '');
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
          <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{editingSlug ? 'Edit Post' : 'New Post'}</h1>
              <button onClick={() => setView('list')} className="px-4 py-2 bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg font-medium text-sm hover:text-[var(--color-text-primary)] transition">
                Cancel
              </button>
            </div>
            
            <div className="space-y-6 bg-[var(--color-surface)] p-4 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Title</label>
                <input type="text" value={title} onChange={handleTitleChange} placeholder="Epic product update..." className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Slug</label>
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Categories (Tags)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {categories.map((cat, idx) => (
                      <span key={idx} className="flex items-center gap-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 rounded-full text-sm font-medium border border-[var(--color-primary)]/20">
                        {cat}
                        <button onClick={() => setCategories(categories.filter((_, i) => i !== idx))} className="hover:text-red-500 transition focus:outline-none">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    value={categoryInput} 
                    onChange={(e) => setCategoryInput(e.target.value)} 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const val = categoryInput.trim().replace(/,$/, '');
                        if (val && !categories.includes(val)) {
                          setCategories([...categories, val]);
                        }
                        setCategoryInput('');
                      }
                    }}
                    placeholder="Type a category and press Enter or Comma..."
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" 
                  />
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {['Blog', 'Updates', 'Engineering', 'Guides', 'Community'].map(suggestion => (
                      <button key={suggestion} onClick={() => {
                        if (!categories.includes(suggestion)) setCategories([...categories, suggestion]);
                      }} className="text-xs px-2 py-1 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-primary)] transition">
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2 flex justify-between">
                  <span>SEO Meta Description</span>
                  <span className={`text-xs ${metaDescription.length > 160 ? 'text-red-500' : 'text-[var(--color-text-muted)]'}`}>
                    {metaDescription.length}/160
                  </span>
                </label>
                <textarea 
                  value={metaDescription} 
                  onChange={(e) => setMetaDescription(e.target.value)} 
                  placeholder="A short and catchy description of this article to entice readers on Google and social media..." 
                  className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition resize-y min-h-[100px]"
                />
                
                {/* SEO PREVIEW CARD */}
                <div className="mt-4 p-5 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] rounded-xl">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Google Search Preview</p>
                  <div className="bg-[#202124] p-4 rounded-lg border border-[#3c4043] font-sans">
                    <p className="text-[#9aa0a6] text-[12px] flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 bg-[#3c4043] rounded-full inline-block"></span>
                      flowdesk.web.id › blog › {slug || 'your-slug-here'}
                    </p>
                    <h3 className="text-[#8ab4f8] text-[20px] font-medium leading-tight mb-1 truncate">
                      {title || 'Epic product update...'} - FlowDesk
                    </h3>
                    <p className="text-[#bdc1c6] text-[14px] leading-snug line-clamp-2">
                      {metaDescription || 'A short and catchy description of this article to entice readers on Google and social media...'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Publish Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition"
                  >
                    <option value="draft">Draft (Hidden)</option>
                    <option value="published">Published (Visible)</option>
                    <option value="scheduled">Scheduled (Future)</option>
                  </select>
                </div>
                {status === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Scheduled Date & Time</label>
                    <input 
                      type="datetime-local" 
                      value={publishedAt} 
                      onChange={(e) => setPublishedAt(e.target.value)} 
                      className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" 
                    />
                  </div>
                )}
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

        {activeMenu === 'docs' && view === 'list' && (
          <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Documentation</h1>
              <button onClick={() => {
                setDocTitleId(''); setDocTitleEn(''); setDocSlug(''); setDocContentId(''); setDocContentEn(''); setDocOrder(99); setDocCategory(''); setEditingDocId(null); setView('editor');
              }} className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium text-sm hover:brightness-110 transition">
                <Plus className="w-4 h-4" /> New Doc
              </button>
            </div>
            <div className="flex gap-4 mb-6">
              <input type="text" placeholder="Search docs by title or slug..." value={docSearchTerm} onChange={(e) => setDocSearchTerm(e.target.value)} className="flex-1 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition" />
            </div>
            
            <div className="grid gap-4">
              {docs.filter(doc => doc.title_id.toLowerCase().includes(docSearchTerm.toLowerCase()) || doc.title_en.toLowerCase().includes(docSearchTerm.toLowerCase()) || doc.slug.toLowerCase().includes(docSearchTerm.toLowerCase())).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm hover:border-[var(--color-primary)] transition-colors">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-[var(--color-text-primary)]">{doc.title_id}</h3>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        EN: {doc.title_en} &middot; Order: {doc.order_num} &middot; Category: {doc.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/id/docs/${doc.slug}`} target="_blank" rel="noreferrer" className="p-2 text-[var(--color-text-muted)] hover:text-blue-500 bg-[var(--color-surface-raised)] rounded-lg transition" title="View">
                      <Eye className="w-4 h-4" />
                    </a>
                    <button onClick={() => {
                      setEditingDocId(doc.id);
                      setDocTitleId(doc.title_id);
                      setDocTitleEn(doc.title_en);
                      setDocSlug(doc.slug);
                      setDocContentId(doc.content_id);
                      setDocContentEn(doc.content_en);
                      setDocOrder(doc.order_num);
                      setDocCategory(doc.category || '');
                      setView('editor');
                    }} className="p-2 text-[var(--color-text-muted)] hover:text-green-500 bg-[var(--color-surface-raised)] rounded-lg transition" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteDoc(doc.id)} className="p-2 text-[var(--color-text-muted)] hover:text-red-500 bg-[var(--color-surface-raised)] rounded-lg transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {docs.length === 0 && (
                <p className="text-[var(--color-text-muted)] text-sm">No documentation published yet.</p>
              )}
            </div>
          </div>
        )}

        {activeMenu === 'docs' && view === 'editor' && (
          <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{editingDocId ? 'Edit Doc' : 'New Doc'}</h1>
              <button onClick={() => setView('list')} className="px-4 py-2 bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg font-medium text-sm hover:text-[var(--color-text-primary)] transition">
                Cancel
              </button>
            </div>
            
            <div className="space-y-6 bg-[var(--color-surface)] p-4 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Title (Indonesia)</label>
                  <input type="text" value={docTitleId} onChange={(e) => {
                    setDocTitleId(e.target.value);
                    if (!docSlug) setDocSlug(generateSlug(e.target.value));
                  }} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Title (English)</label>
                  <input type="text" value={docTitleEn} onChange={(e) => setDocTitleEn(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Slug</label>
                  <input type="text" value={docSlug} onChange={(e) => setDocSlug(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Order</label>
                  <input type="number" value={docOrder} onChange={(e) => setDocOrder(parseInt(e.target.value) || 99)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Category (Optional)</label>
                <input type="text" value={docCategory} onChange={(e) => setDocCategory(e.target.value)} placeholder="e.g. Getting Started, Advanced" className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Content (Indonesia)</label>
                <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-bg)]">
                  <MarkdownEditor value={docContentId} onChange={setDocContentId} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Content (English)</label>
                <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-bg)]">
                  <MarkdownEditor value={docContentEn} onChange={setDocContentEn} />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button onClick={handleSaveDoc} disabled={saving} className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-bold hover:brightness-110 transition disabled:opacity-50">
                  {saving ? 'Saving...' : 'Publish Doc'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'roadmap' && view === 'list' && (
          <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Roadmap</h1>
              <button onClick={() => {
                setRmQuarter(''); setRmVersion(''); setRmStatus('planned');
                setRmTitleId(''); setRmTitleEn(''); setRmDescId(''); setRmDescEn('');
                setRmItemsId(''); setRmItemsEn(''); setRmOrder(99);
                setEditingRoadmapId(null); setView('editor');
              }} className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium text-sm hover:brightness-110 transition">
                <Plus className="w-4 h-4" /> New Roadmap
              </button>
            </div>
            <div className="flex gap-4 mb-6">
              <input type="text" placeholder="Search roadmap by version, title, or quarter..." value={rmSearchTerm} onChange={(e) => setRmSearchTerm(e.target.value)} className="flex-1 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition" />
            </div>
            
            <div className="space-y-4">
              {roadmaps.filter(rm => {
                const s = rmSearchTerm.toLowerCase();
                return rm.quarter.toLowerCase().includes(s) || rm.version.toLowerCase().includes(s) || (rm.title_id || '').toLowerCase().includes(s) || (rm.title_en || '').toLowerCase().includes(s);
              }).map((rm) => (
                <div key={rm.id} className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm hover:border-[var(--color-primary)] transition-colors">
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{rm.quarter} - {rm.version}</h3>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {rm.title_id} &middot; Status: {rm.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/id/roadmap`} target="_blank" rel="noreferrer" className="p-2 text-[var(--color-text-muted)] hover:text-blue-500 bg-[var(--color-surface-raised)] rounded-lg transition" title="View">
                      <Eye className="w-4 h-4" />
                    </a>
                    <button onClick={() => {
                      setEditingRoadmapId(rm.id);
                      setRmQuarter(rm.quarter);
                      setRmVersion(rm.version);
                      setRmStatus(rm.status);
                      setRmTitleId(rm.title_id);
                      setRmTitleEn(rm.title_en);
                      setRmDescId(rm.description_id);
                      setRmDescEn(rm.description_en);
                      setRmItemsId(rm.items_id);
                      setRmItemsEn(rm.items_en);
                      setRmOrder(rm.order_num);
                      setView('editor');
                    }} className="p-2 text-[var(--color-text-muted)] hover:text-green-500 bg-[var(--color-surface-raised)] rounded-lg transition" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteRoadmap(rm.id)} className="p-2 text-[var(--color-text-muted)] hover:text-red-500 bg-[var(--color-surface-raised)] rounded-lg transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {roadmaps.length === 0 && (
                <p className="text-[var(--color-text-muted)] text-sm">No roadmap data yet.</p>
              )}
            </div>
          </div>
        )}

        {activeMenu === 'roadmap' && view === 'editor' && (
          <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{editingRoadmapId ? 'Edit Roadmap' : 'New Roadmap'}</h1>
              <button onClick={() => setView('list')} className="px-4 py-2 bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg font-medium text-sm hover:text-[var(--color-text-primary)] transition">
                Cancel
              </button>
            </div>
            
            <div className="space-y-6 bg-[var(--color-surface)] p-4 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Quarter</label>
                  <input type="text" value={rmQuarter} onChange={(e) => setRmQuarter(e.target.value)} placeholder="e.g. Q4 2026" className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Version</label>
                  <input type="text" value={rmVersion} onChange={(e) => setRmVersion(e.target.value)} placeholder="e.g. v2.0.0" className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Status</label>
                  <select value={rmStatus} onChange={(e) => setRmStatus(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition">
                    <option value="planned">Planned</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Order (Sorting)</label>
                  <input type="number" value={rmOrder} onChange={(e) => setRmOrder(parseInt(e.target.value) || 99)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--color-border)]">
                {/* ID Column */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-[var(--color-primary)]">Indonesia (ID)</h3>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Title</label>
                    <input type="text" value={rmTitleId} onChange={(e) => setRmTitleId(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Description</label>
                    <textarea value={rmDescId} onChange={(e) => setRmDescId(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Items (1 item per line)</label>
                    <textarea value={rmItemsId} onChange={(e) => setRmItemsId(e.target.value)} rows={6} placeholder="Enter items separated by newline" className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                  </div>
                </div>

                {/* EN Column */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-[var(--color-primary)]">English (EN)</h3>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Title</label>
                    <input type="text" value={rmTitleEn} onChange={(e) => setRmTitleEn(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Description</label>
                    <textarea value={rmDescEn} onChange={(e) => setRmDescEn(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Items (1 item per line)</label>
                    <textarea value={rmItemsEn} onChange={(e) => setRmItemsEn(e.target.value)} rows={6} placeholder="Enter items separated by newline" className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] outline-none transition" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button onClick={handleSaveRoadmap} disabled={saving} className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-bold hover:brightness-110 transition disabled:opacity-50">
                  {saving ? 'Saving...' : 'Publish Roadmap'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'profile' && (
          <div className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8">My Profile</h1>
            <div className="space-y-6 bg-[var(--color-surface)] p-4 sm:p-8 rounded-2xl border border-[var(--color-border)]">
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
          <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8">User Management</h1>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[var(--color-surface)] p-4 sm:p-8 rounded-2xl border border-[var(--color-border)]">
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

        {activeMenu === 'faq' && view === 'list' && (
          <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">FAQ Manager</h1>
              <button onClick={() => {
                setFaqQId(''); setFaqAId(''); setFaqQEn(''); setFaqAEn(''); setFaqOrder(99);
                setEditingFaqId(null); setView('editor');
              }} className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium text-sm hover:brightness-110 transition">
                <Plus className="w-4 h-4" /> New FAQ
              </button>
            </div>
            
            <div className="flex gap-4 mb-6">
              <input type="text" placeholder="Search FAQ by question..." value={faqSearchTerm} onChange={(e) => setFaqSearchTerm(e.target.value)} className="flex-1 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition" />
            </div>
            
            <div className="space-y-4">
              {faqs.filter(f => {
                const s = faqSearchTerm.toLowerCase();
                return f.question_id.toLowerCase().includes(s) || f.question_en.toLowerCase().includes(s);
              }).map((f) => (
                <div key={f.id} className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm hover:border-[var(--color-primary)] transition-colors">
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{f.question_id}</h3>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      EN: {f.question_en} &middot; Order: {f.order_num}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setEditingFaqId(f.id);
                      setFaqQId(f.question_id); setFaqAId(f.answer_id);
                      setFaqQEn(f.question_en); setFaqAEn(f.answer_en);
                      setFaqOrder(f.order_num);
                      setView('editor');
                    }} className="p-2 text-[var(--color-text-muted)] hover:text-green-500 bg-[var(--color-surface-raised)] rounded-lg transition" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteFaq(f.id)} className="p-2 text-[var(--color-text-muted)] hover:text-red-500 bg-[var(--color-surface-raised)] rounded-lg transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {faqs.length === 0 && (
                <p className="text-[var(--color-text-muted)] text-sm">No FAQ items yet.</p>
              )}
            </div>
          </div>
        )}

        {activeMenu === 'faq' && view === 'editor' && (
          <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('list')} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition">
                  ← Back
                </button>
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{editingFaqId ? 'Edit FAQ' : 'New FAQ'}</h1>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Indonesian */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[var(--color-primary)]">Bahasa Indonesia</h2>
                <input type="text" placeholder="Pertanyaan (ID)" value={faqQId} onChange={e => setFaqQId(e.target.value)} className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition font-medium" />
                <textarea placeholder="Jawaban (ID)" value={faqAId} onChange={e => setFaqAId(e.target.value)} rows={6} className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition font-medium resize-none"></textarea>
              </div>

              {/* English */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-blue-500">English</h2>
                <input type="text" placeholder="Question (EN)" value={faqQEn} onChange={e => setFaqQEn(e.target.value)} className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition font-medium" />
                <textarea placeholder="Answer (EN)" value={faqAEn} onChange={e => setFaqAEn(e.target.value)} rows={6} className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition font-medium resize-none"></textarea>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-[var(--color-text-secondary)]">Order Number:</label>
                <input type="number" value={faqOrder} onChange={e => setFaqOrder(Number(e.target.value))} className="w-24 px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition" />
              </div>
              <button onClick={handleSaveFaq} disabled={saving} className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:brightness-110 transition disabled:opacity-50">
                {saving ? 'Saving...' : 'Save FAQ'}
              </button>
            </div>
          </div>
        )}

        {activeMenu === 'media' && (
          <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Media Manager</h1>
              <label className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium text-sm hover:brightness-110 transition cursor-pointer">
                {uploadingImage ? <span className="animate-spin text-xl leading-none">⟳</span> : <UploadCloud className="w-4 h-4" />}
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={async (e) => {
                  await handleImageUpload(e);
                  fetchGallery();
                }} className="hidden" />
              </label>
            </div>

            {loadingGallery ? (
              <div className="flex justify-center items-center py-20">
                <span className="animate-spin text-4xl text-[var(--color-primary)]">⟳</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryImages.map((img, i) => (
                  <div key={i} className="group relative aspect-video bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
                    <Image src={img.cover_image} alt="" fill className="object-cover transition duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <button onClick={() => {
                        navigator.clipboard.writeText(img.cover_image);
                        alert('URL Copied to clipboard!');
                      }} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition">
                        Copy URL
                      </button>
                      <button onClick={() => handleDeleteImage(img.cover_image)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {galleryImages.length === 0 && (
                  <div className="col-span-full py-12 text-center text-[var(--color-text-muted)]">
                    No images found in your Media Manager.
                  </div>
                )}
              </div>
            )}
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
    </div>
  );
}
