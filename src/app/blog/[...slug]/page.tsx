import BlogPostClient from './BlogPostClient';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Return empty array - routes will be handled client-side
  // This is necessary for static export but allows client-side routing
  return [];
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug) ? resolvedParams.slug[0] : resolvedParams.slug;
  return <BlogPostClient slug={slug} />;
}
