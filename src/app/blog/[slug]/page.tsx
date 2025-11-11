import BlogPostClient from './BlogPostClient';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Return a dummy param to satisfy static export requirement
  // Actual routing will be handled client-side
  return [{ slug: 'dummy' }];
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <BlogPostClient slug={resolvedParams.slug} />;
}
