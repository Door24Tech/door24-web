import BlogPostClient from "./BlogPostClient";

export const dynamic = "force-dynamic";

export default function BlogPost({ params }: { params: { slug: string } }) {
  return <BlogPostClient slug={params.slug} />;
}
