import { NextRequest, NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSession } from '@/lib/auth';
import { queryD1 } from '@/lib/db';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await queryD1(
      'SELECT cover_image, MAX(created_at) as last_used FROM posts WHERE cover_image IS NOT NULL GROUP BY cover_image ORDER BY last_used DESC LIMIT 50'
    );
    
    // The results array will contain objects with cover_image and last_used
    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Extract the R2 object key from the public URL
    // e.g., https://pub-xxx.r2.dev/blog/uuid.jpg -> blog/uuid.jpg
    const urlParts = url.split('/');
    // The key is everything after the hostname, which is typically the last two parts for our setup (e.g. blog/filename.ext)
    // We can find where 'blog' starts
    const blogIndex = urlParts.indexOf('blog');
    if (blogIndex === -1) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }
    
    const key = urlParts.slice(blogIndex).join('/');

    // Delete from R2
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      })
    );

    // Remove the image from any posts that were using it
    await queryD1(
      'UPDATE posts SET cover_image = NULL WHERE cover_image = ?',
      [url]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
