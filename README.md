# FlowDesk Website

This is the official landing page for **FlowDesk**, a local-first, offline-capable desktop workspace application built with .NET 10 and Avalonia UI. The website serves to showcase FlowDesk's capabilities and provide direct downloads straight from GitHub releases.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: `lucide-react`
- **Data Source**: GitHub REST API v3

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kharisdestianmaulana-hub/flowdesk.git
   cd flowdesk
   ```
   *(Note: Adjust the repo name or path if the web code is separated)*

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment variables file:
   ```bash
   cp .env.local.example .env.local
   ```
   *Note: Adding a `GITHUB_TOKEN` is highly recommended to increase API rate limits.*

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | A personal access token to prevent rate limits. | No, but recommended |

## Deployment

Deploy to **Vercel** with zero configuration. 
Don't forget to add your `GITHUB_TOKEN` as an environment variable in the Vercel dashboard to ensure you don't hit the standard 60 requests/hour limit for unauthenticated GitHub API calls.
