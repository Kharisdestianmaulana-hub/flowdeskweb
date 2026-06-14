import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'FlowDesk - The Local-First Productivity Haven';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0a0a0f, #1a1a2e)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(168, 85, 247, 0.5)',
            }}
          >
            <div style={{ fontSize: '64px', color: 'white', fontWeight: 'bold' }}>F</div>
          </div>
          <h1 style={{ fontSize: '96px', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>
            FlowDesk
          </h1>
        </div>
        <p style={{ fontSize: '42px', color: '#9ca3af', margin: 0, fontWeight: 500, letterSpacing: '-0.01em' }}>
          The clean, offline productivity haven.
        </p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '60px' }}>
          <span style={{ fontSize: '28px', color: '#a855f7', background: 'rgba(168, 85, 247, 0.15)', padding: '12px 32px', borderRadius: '50px', border: '2px solid rgba(168, 85, 247, 0.4)', fontWeight: 600 }}>Local-First</span>
          <span style={{ fontSize: '28px', color: '#a855f7', background: 'rgba(168, 85, 247, 0.15)', padding: '12px 32px', borderRadius: '50px', border: '2px solid rgba(168, 85, 247, 0.4)', fontWeight: 600 }}>No Cloud</span>
          <span style={{ fontSize: '28px', color: '#a855f7', background: 'rgba(168, 85, 247, 0.15)', padding: '12px 32px', borderRadius: '50px', border: '2px solid rgba(168, 85, 247, 0.4)', fontWeight: 600 }}>100% Private</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
