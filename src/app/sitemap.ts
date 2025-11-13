import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';

const baseUrl = 'https://door24.app';

// Required for static export - tells Next.js to generate this at build time
export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mission`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/press-kit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/gdpr`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog/rss.xml`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.3,
    },
  ];

  // Fetch blog posts from Firestore
  let blogPosts: MetadataRoute.Sitemap = [];
  
  try {
    const posts = await getAllBlogPosts(true); // Only published posts
    
    blogPosts = posts.map((post) => {
      // Convert Firestore Timestamp to Date for lastModified
      let lastModified = new Date();
      
      if (post.publishedAt) {
        if (post.publishedAt instanceof Date) {
          lastModified = post.publishedAt;
        } else {
          // Handle Firestore Timestamp
          const timestamp = post.publishedAt as any;
          if (timestamp.toMillis) {
            lastModified = new Date(timestamp.toMillis());
          } else if (timestamp.seconds) {
            lastModified = new Date(timestamp.seconds * 1000);
          }
        }
      } else if (post.updatedAt) {
        // Fallback to updatedAt if publishedAt doesn't exist
        const timestamp = post.updatedAt as any;
        if (timestamp instanceof Date) {
          lastModified = timestamp;
        } else if (timestamp.toMillis) {
          lastModified = new Date(timestamp.toMillis());
        } else if (timestamp.seconds) {
          lastModified = new Date(timestamp.seconds * 1000);
        }
      }

      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });
  } catch (error) {
    // If Firestore fails, log error but still return static pages
    console.error('Error fetching blog posts for sitemap:', error);
    // Continue with just static pages
  }

  // Combine static pages and blog posts
  return [...staticPages, ...blogPosts];
}

