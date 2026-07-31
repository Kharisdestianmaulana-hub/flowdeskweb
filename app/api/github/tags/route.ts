import { NextResponse } from 'next/server';

const REPO_OWNER = 'Kharisdestianmaulana-hub';
const REPO_NAME = 'flowdesk';
const GITHUB_API_URL = 'https://api.github.com';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'FlowDesk-Website',
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  
  return headers;
}

export async function GET() {
  try {
    const res = await fetch(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/tags`, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch tags' }, { status: res.status });
    }
    
    const data = await res.json();
    const tags = data.map((tag: any) => tag.name);
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
