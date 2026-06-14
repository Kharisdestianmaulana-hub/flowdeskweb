export interface RepoInfo {
  stargazers_count: number;
  description: string;
  topics: string[];
  html_url: string;
}

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  download_count: number;
  size: number;
}

export interface Release {
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
  assets: ReleaseAsset[];
  html_url: string;
}

export interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}
