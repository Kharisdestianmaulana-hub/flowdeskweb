import { RepoInfo, Release, Commit } from '../types/github';

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

export async function getRepoInfo(): Promise<RepoInfo> {
  try {
    const res = await fetch(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}`, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      console.warn('GitHub API rate limit exceeded or repo not found. Using fallback data.');
      return {
        stargazers_count: 0,
        description: 'FlowDesk - A local-first desktop workspace.',
        topics: [],
        html_url: `https://github.com/${REPO_OWNER}/${REPO_NAME}`
      };
    }
    
    return res.json();
  } catch (error) {
    console.warn('getRepoInfo error:', error);
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
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      console.warn('GitHub API rate limit exceeded or latest release not found. Using fallback data.');
      return {
        tag_name: 'v1.5.0',
        name: 'FlowDesk v1.5.0 (Fallback)',
        published_at: new Date().toISOString(),
        body: '',
        assets: [],
        html_url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases`
      };
    }
    
    return res.json();
  } catch (error) {
    console.warn('getLatestRelease error:', error);
    return {
      tag_name: 'v1.5.0',
      name: 'FlowDesk v1.5.0 (Fallback)',
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
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      console.warn('GitHub API rate limit exceeded or releases not found. Using fallback data.');
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.warn('getAllReleases error:', error);
    return [];
  }
}

export async function getRecentCommits(limit: number = 20): Promise<Commit[]> {
  try {
    const res = await fetch(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=${limit}`, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      console.warn('GitHub API rate limit exceeded or commits not found. Using fallback data.');
      return [];
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching commits:', error);
    return [];
  }
}

export async function getContributors() {
  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contributors`, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contributors');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return [];
  }
}
