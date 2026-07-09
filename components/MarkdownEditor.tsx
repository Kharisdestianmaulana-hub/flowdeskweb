'use client';

import React, { useRef, useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { 
  Bold, Italic, Link as LinkIcon, Image as ImageIcon, 
  List, ListOrdered, Quote, Code, Minus, Heading1, Heading2 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function MarkdownEditor({ value, onChange, placeholder = 'Tulis ceritamu...', minHeight = 400 }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Auto-save logic (local storage backup)
  useEffect(() => {
    const saved = localStorage.getItem('flowdesk_draft');
    if (saved && !value && saved.length > 10) {
      if (confirm('Draf sebelumnya ditemukan. Ingin memulihkannya?')) {
        onChange(saved);
      }
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value.length > 0) {
        localStorage.setItem('flowdesk_draft', value);
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [value]);

  const insertTextAtCursor = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || defaultText;

    const newText = textarea.value.substring(0, start) + before + selectedText + after + textarea.value.substring(end);
    onChange(newText);

    // Reset selection to inside the newly inserted tags
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        insertTextAtCursor(`![${file.name}](${data.url})`, '\n');
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (e) {
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await uploadFile(file);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) await uploadFile(file);
        break;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      insertTextAtCursor('**', '**', 'teks tebal');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      insertTextAtCursor('*', '*', 'teks miring');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      insertTextAtCursor('[', '](url)', 'teks tautan');
    }
  };

  const ToolbarButton = ({ icon: Icon, onClick, title }: { icon: any, onClick: () => void, title: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] rounded-md transition-colors"
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="flex flex-col border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)] shadow-sm focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)] transition-all">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border)] bg-[#0d1117] sticky top-0 z-10">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
          {!isPreview && (
            <>
              <ToolbarButton icon={Heading1} title="Heading 1" onClick={() => insertTextAtCursor('# ', '')} />
              <ToolbarButton icon={Heading2} title="Heading 2" onClick={() => insertTextAtCursor('## ', '')} />
              <div className="w-px h-5 bg-[var(--color-border-subtle)] mx-1" />
              <ToolbarButton icon={Bold} title="Bold (Ctrl+B)" onClick={() => insertTextAtCursor('**', '**', 'bold')} />
              <ToolbarButton icon={Italic} title="Italic (Ctrl+I)" onClick={() => insertTextAtCursor('*', '*', 'italic')} />
              <div className="w-px h-5 bg-[var(--color-border-subtle)] mx-1" />
              <ToolbarButton icon={LinkIcon} title="Link (Ctrl+K)" onClick={() => insertTextAtCursor('[', '](url)', 'text')} />
              <ToolbarButton icon={ImageIcon} title="Image" onClick={() => insertTextAtCursor('![alt](', ')', 'image-url')} />
              <div className="w-px h-5 bg-[var(--color-border-subtle)] mx-1" />
              <ToolbarButton icon={List} title="Bullet List" onClick={() => insertTextAtCursor('- ', '')} />
              <ToolbarButton icon={ListOrdered} title="Numbered List" onClick={() => insertTextAtCursor('1. ', '')} />
              <ToolbarButton icon={Quote} title="Quote" onClick={() => insertTextAtCursor('> ', '')} />
              <ToolbarButton icon={Code} title="Code Block" onClick={() => insertTextAtCursor('\n```\n', '\n```\n', 'kode')} />
              <ToolbarButton icon={Minus} title="Divider" onClick={() => insertTextAtCursor('\n---\n', '')} />
            </>
          )}
        </div>
        <div className="flex items-center gap-2 pl-4 border-l border-[var(--color-border-subtle)]">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="text-sm font-medium px-3 py-1.5 rounded-md text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-raised)] transition-colors"
          >
            {isPreview ? 'Tulis' : 'Pratinjau'}
          </button>
        </div>
      </div>

      {/* Editor / Preview Area */}
      <div className="relative min-h-[400px] w-full max-w-[760px] mx-auto p-6 sm:p-10">
        {isUploading && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center gap-2 border border-blue-500/30">
            <span className="w-2 h-2 rounded-full border border-blue-400 border-t-transparent animate-spin" />
            Mengunggah gambar...
          </div>
        )}

        {isPreview ? (
          <div className="prose prose-invert max-w-none 
            prose-headings:text-[var(--color-text-primary)] prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mt-10 prose-h1:mb-6
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-[var(--color-border-subtle)] prose-h2:pb-2
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.8] prose-p:text-[18px] prose-p:mb-6
            prose-a:text-[var(--color-primary)] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[var(--color-text-primary)]
            prose-li:text-[var(--color-text-secondary)] prose-li:text-[18px] prose-li:leading-[1.8]
            prose-ul:mt-2 prose-ul:mb-6
            prose-code:text-[var(--color-text-primary)] prose-code:bg-[var(--color-surface-raised)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:font-medium
            prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-[#30363d] prose-pre:rounded-xl prose-pre:shadow-sm
            prose-blockquote:border-l-4 prose-blockquote:border-[var(--color-primary)] prose-blockquote:bg-[var(--color-surface)] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:not-italic prose-blockquote:text-[var(--color-text-muted)] prose-blockquote:text-[19px] prose-blockquote:rounded-r-lg
            prose-img:rounded-2xl prose-img:border prose-img:border-[var(--color-border-subtle)] prose-img:w-full prose-img:shadow-sm prose-img:my-10
            prose-hr:border-[var(--color-border)] prose-hr:my-12
            prose-table:w-full prose-table:my-8 prose-th:bg-[var(--color-surface-raised)] prose-th:p-3 prose-td:p-3 prose-td:border-t prose-td:border-[var(--color-border-subtle)]
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {value || '*Belum ada konten.*'}
            </ReactMarkdown>
          </div>
        ) : (
          <TextareaAutosize
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onDrop={handleDrop}
            onPaste={handlePaste}
            placeholder={placeholder}
            minRows={15}
            className="w-full bg-transparent text-[18px] leading-[1.8] text-[var(--color-text-secondary)] placeholder-[var(--color-text-muted)] resize-none outline-none font-mono"
          />
        )}
      </div>
    </div>
  );
}
