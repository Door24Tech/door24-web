import BlogPostClient from './BlogPostClient';
import { getAllBlogPosts } from '@/lib/blog';

// Required for static export with dynamic routes
// Fetch all published blog posts at build time to pre-generate their pages
export async function generateStaticParams() {
  try {
    // Fetch all published blog posts
    const posts = await getAllBlogPosts(true);
    
    // Return array of slugs for static generation
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error fetching blog posts for static generation:', error);
    // Return empty array if fetch fails - pages will still work client-side
    return [];
  }
}

// Note: With output: export, dynamicParams is not supported
// All routes must be pre-generated. New posts will need a rebuild to be accessible.

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <BlogPostClient slug={resolvedParams.slug} />;
}
