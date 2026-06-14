# FlowDesk Website — Design System

> Referensi visual untuk landing page FlowDesk.  
> Tone: **Modern & bold** — bersih, tegas, confident. Bukan playful, bukan corporate kaku.

---

## 1. Color Palette

### Primary
| Token | Hex | Penggunaan |
|---|---|---|
| `--color-primary` | `#7C3AED` | CTA utama, accent, highlight |
| `--color-primary-hover` | `#6D28D9` | Hover state tombol primary |
| `--color-primary-light` | `#EDE9FE` | Background badge, tag, subtle highlight |
| `--color-primary-glow` | `rgba(124,58,237,0.15)` | Glow/shadow efek hero, card hover |

### Neutrals (Dark-first)
| Token | Hex | Penggunaan |
|---|---|---|
| `--color-bg` | `#0A0A0F` | Background utama halaman |
| `--color-surface` | `#111118` | Card, section alt background |
| `--color-surface-raised` | `#1A1A24` | Card hover, modal, dropdown |
| `--color-border` | `#2A2A38` | Garis pembatas, outline card |
| `--color-border-subtle` | `#1E1E2A` | Divider halus antar section |

### Text
| Token | Hex | Penggunaan |
|---|---|---|
| `--color-text-primary` | `#F4F4F8` | Heading, teks utama |
| `--color-text-secondary` | `#A0A0B8` | Subtext, deskripsi, caption |
| `--color-text-muted` | `#5A5A72` | Placeholder, footer secondary |
| `--color-text-accent` | `#A78BFA` | Inline accent text, label aktif |

### Semantic
| Token | Hex | Penggunaan |
|---|---|---|
| `--color-success` | `#10B981` | Badge "stable", status online |
| `--color-warning` | `#F59E0B` | Badge "beta", peringatan ringan |
| `--color-error` | `#EF4444` | Error state |
| `--color-info` | `#3B82F6` | Info chip, .NET badge |

### Gradients
```css
/* Hero headline gradient */
--gradient-hero: linear-gradient(135deg, #F4F4F8 0%, #A78BFA 60%, #7C3AED 100%);

/* CTA button */
--gradient-cta: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);

/* Card border glow (dipakai via border-image atau pseudo-element) */
--gradient-border: linear-gradient(135deg, #7C3AED22, #A78BFA44, #7C3AED22);

/* Section background subtle */
--gradient-section: linear-gradient(180deg, #0A0A0F 0%, #111118 100%);
```

---

## 2. Typography

### Font Families
```css
--font-display: 'Inter', sans-serif;   /* Heading H1–H3 */
--font-body: 'Inter', sans-serif;      /* Body text, UI */
--font-mono: 'JetBrains Mono', monospace; /* Code, version badge, terminal */
```

> Gunakan Inter saja — bedakan lewat weight & tracking, bukan family. Ini bikin lebih presisi dan "native-app-like", konsisten sama vibe FlowDesk app-nya.

### Type Scale
| Role | Size | Weight | Line Height | Tracking |
|---|---|---|---|---|
| `display` | 64px / 4rem | 800 | 1.05 | -0.03em |
| `h1` | 48px / 3rem | 700 | 1.1 | -0.02em |
| `h2` | 36px / 2.25rem | 700 | 1.15 | -0.01em |
| `h3` | 24px / 1.5rem | 600 | 1.3 | 0 |
| `h4` | 18px / 1.125rem | 600 | 1.4 | 0 |
| `body-lg` | 18px / 1.125rem | 400 | 1.7 | 0 |
| `body` | 16px / 1rem | 400 | 1.65 | 0 |
| `body-sm` | 14px / 0.875rem | 400 | 1.6 | 0 |
| `caption` | 12px / 0.75rem | 500 | 1.5 | 0.02em |
| `mono` | 13px / 0.8125rem | 400 | 1.6 | 0 |

---

## 3. Spacing Scale

Berbasis **8px grid**:

```
4px   → xs   (gap kecil, padding badge)
8px   → sm   (gap inline, padding chip)
12px  → md-  (padding compact)
16px  → md   (padding standar, gap card)
24px  → lg   (section internal padding)
32px  → xl   (card padding, section gap)
48px  → 2xl  (section spacing mobile)
64px  → 3xl  (section spacing desktop)
96px  → 4xl  (hero padding, section besar)
128px → 5xl  (section paling besar)
```

---

## 4. Border Radius

```css
--radius-sm: 6px;    /* Badge, chip, tag */
--radius-md: 10px;   /* Input, tombol */
--radius-lg: 16px;   /* Card */
--radius-xl: 24px;   /* Card besar, modal */
--radius-full: 9999px; /* Pill button, avatar */
```

---

## 5. Shadows & Elevation

```css
/* Card default */
--shadow-card: 0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px #2A2A38;

/* Card hover */
--shadow-card-hover: 0 4px 24px rgba(124,58,237,0.15), 0 0 0 1px #7C3AED44;

/* CTA button */
--shadow-btn: 0 4px 16px rgba(124,58,237,0.35);

/* Glow hero */
--shadow-hero-glow: 0 0 120px rgba(124,58,237,0.2);

/* Modal / popover */
--shadow-elevated: 0 16px 48px rgba(0,0,0,0.6);
```

---

## 6. Components

### Button

**Primary**
```
bg: --gradient-cta
color: #FFFFFF
padding: 12px 24px
radius: --radius-md
font: 15px, weight 600
shadow: --shadow-btn
hover: brightness(1.08) + shadow lebih besar
```

**Ghost / Outline**
```
bg: transparent
border: 1px solid --color-border
color: --color-text-primary
padding: 12px 24px
radius: --radius-md
hover: border-color --color-primary, bg rgba(124,58,237,0.08)
```

**GitHub Button** *(khusus CTA github)*
```
bg: --color-surface-raised
border: 1px solid --color-border
icon: GitHub SVG 16px
color: --color-text-secondary
hover: color --color-text-primary, border --color-border subtle light
```

### Badge / Chip
```
bg: --color-primary-light (atau surface-raised untuk dark)
color: --color-text-accent
font: 12px, 500, mono untuk versi
padding: 4px 10px
radius: --radius-full
```

Contoh pakai: `v1.4 Beta`, `.NET 10`, `macOS`, `Windows`, `Linux`

### Card
```
bg: --color-surface
border: 1px solid --color-border-subtle
radius: --radius-lg
padding: 24–32px
hover: shadow --shadow-card-hover, border --color-primary glow
transition: 200ms ease
```

### Navbar
```
bg: rgba(10,10,15,0.8) + backdrop-blur: 12px
border-bottom: 1px solid --color-border-subtle
height: 64px
sticky top-0
```

---

## 7. Iconography

- Library: **Lucide Icons** (konsisten, clean, stroke-based)
- Size standar: 16px (inline), 20px (button), 24px (feature card)
- Stroke width: 1.5px
- Color: ikut context — `--color-text-secondary` untuk ikon deskriptif, `--color-primary` untuk ikon aksi

---

## 8. Motion

```css
/* Standar transisi */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 350ms ease;

/* Scroll reveal (pakai Intersection Observer) */
/* Elemen masuk dari bawah: translateY(24px) → translateY(0), opacity 0 → 1 */
/* Duration: 500ms, easing: cubic-bezier(0.16, 1, 0.3, 1) */
```

Prinsip: gerakan **fungsional**, bukan dekoratif. Hover card ringan, scroll reveal halus, tidak ada loop animation yang ganggu fokus.

---

## 9. Section Structure (untuk Developer)

```
[Navbar]            → sticky, blur bg
[Hero]              → full viewport height, centered
[Social Proof]      → strip, no padding, muted
[Features]          → bg: surface (alt)
[Why FlowDesk]      → bg: main (contrast section)
[App Preview]       → bg: surface
[Platform/Download] → bg: primary gradient subtle
[Changelog Strip]   → bg: main
[CTA Section]       → bg: primary solid atau gradient
[Footer]            → bg: surface
```

Alternasi `--color-bg` dan `--color-surface` antar section biar ada ritme visual tanpa border eksplisit.

---

## 10. Do & Don't

| ✅ Do | ❌ Don't |
|---|---|
| Gunakan warna sebagai komunikasi fungsi | Warna dekoratif tanpa makna |
| Teks besar, berani, tight tracking untuk heading | Heading kecil & ringan |
| Satu CTA utama per section | Dua tombol primary berdampingan |
| Screenshot / mockup app nyata | Ilustrasi kartun atau 3D render |
| Dark background dominan | Background putih (tidak konsisten sama app) |
| Versi & roadmap transparan | Menyembunyikan status "beta" |

---

*FlowDesk Website Design System — v1.0*
