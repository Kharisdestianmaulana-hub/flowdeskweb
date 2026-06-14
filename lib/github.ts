import { RepoInfo, Release, Commit } from '../types/github';

const REPO_OWNER = 'Kharisdestianmaulana-hub';
const REPO_NAME = 'flowdesk';
const GITHUB_API_URL = 'https://api.github.com';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  
  return headers;
}

export async function getRepoInfo(): Promise<RepoInfo> {
  try {
    const res = await fetch(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}`, {
      headers: getHeaders(),
      next: { revalidate: 300 },
    });
    
    if (!res.ok) throw new Error('Failed to fetch repo info');
    
    return res.json();
  } catch (error) {
    console.error('getRepoInfo error:', error);
    return {
      stargazers_count: 0,
      description: 'FlowDesk - A local-first desktop workspace.',
      topics: [],
      html_url: `https://github.com/${REPO_OWNER}/${REPO_NAME}`
    };
  }
}

export async function getLatestRelease(): Promise<Release> {
  try {
    const res = await fetch(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`, {
      headers: getHeaders(),
      next: { revalidate: 300 },
    });
    
    if (!res.ok) throw new Error('Failed to fetch latest release');
    
    return res.json();
  } catch (error) {
    console.error('getLatestRelease error:', error);
    return {
      tag_name: 'v0.0.0',
      name: 'Fallback Release',
      published_at: new Date().toISOString(),
      body: '',
      assets: [],
      html_url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases`
    };
  }
}

export async function getAllReleases(): Promise<Release[]> {
  try {
    const res = await fetch(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/releases`, {
      headers: getHeaders(),
      next: { revalidate: 300 },
    });
    
    if (!res.ok) throw new Error('Failed to fetch all releases');
    
    return res.json();
  } catch (error) {
    console.error('getAllReleases error:', error);
    return [];
  }
}

export async function getRecentCommits(limit: number = 20): Promise<Commit[]> {
  try {
    const res = await fetch(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=${limit}`, {
      headers: getHeaders(),
      next: { revalidate: 300 },
    });
    
    if (!res.ok) throw new Error('Failed to fetch commits');
    
    return res.json();
  } catch (error) {
    console.error('getRecentCommits error:', error);
    return [];
  }
}
